"""
LeaseLens Backend - FastAPI server for PDF lease analysis
Uses pypdf for PDF extraction and Groq (Llama 3) for AI analysis
"""

import os
import json
import re
import io
import time
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pypdf import PdfReader
from groq import Groq

# Load environment variables
load_dotenv()

# Configure Groq API (Free - get key from https://console.groq.com/)
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
DEMO_MODE = os.getenv("DEMO_MODE", "false").lower() == "true"

if not GROQ_API_KEY and not DEMO_MODE:
    raise ValueError("GROQ_API_KEY environment variable is not set. Get a free key from https://console.groq.com/")

# Initialize Groq client
client = None
if GROQ_API_KEY and not DEMO_MODE:
    client = Groq(api_key=GROQ_API_KEY)

# Initialize FastAPI app
app = FastAPI(
    title="LeaseLens API",
    description="AI-powered commercial lease analysis",
    version="1.0.0"
)

# Get allowed origins from environment or use defaults
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000").split(",")

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# System prompt for Groq (Llama 3)
SYSTEM_PROMPT = """You are a legal expert specializing in commercial real estate leases. 
Extract the following 5 items from this lease agreement and return them in valid JSON format:

1. Monthly Rent - The monthly rental amount
2. Lease Term - The duration of the lease (start date, end date, or total period)
3. Security Deposit - The security deposit amount required
4. Termination Clause Summary - A brief summary of how the lease can be terminated
5. Rent Escalation - Details about any rent increases over the lease term

Return ONLY a valid JSON object with these exact keys:
{
    "monthly_rent": "extracted value or 'Not specified'",
    "lease_term": "extracted value or 'Not specified'",
    "security_deposit": "extracted value or 'Not specified'",
    "termination_clause": "extracted summary or 'Not specified'",
    "rent_escalation": "extracted details or 'Not specified'"
}

If any information is not found in the document, use "Not specified" as the value.
Do not include any markdown formatting or code blocks in your response, just the raw JSON."""


def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """Extract text content from PDF bytes using pypdf"""
    try:
        pdf_file = io.BytesIO(pdf_bytes)
        reader = PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        
        if not text.strip():
            raise ValueError("No text content found in PDF")
        
        return text
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to extract text from PDF: {str(e)}"
        )


def clean_json_response(response_text: str) -> dict:
    """Clean and parse the JSON response from Gemini"""
    # Remove markdown code blocks if present
    cleaned = response_text.strip()
    cleaned = re.sub(r'^```json\s*', '', cleaned)
    cleaned = re.sub(r'^```\s*', '', cleaned)
    cleaned = re.sub(r'\s*```$', '', cleaned)
    cleaned = cleaned.strip()
    
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to parse AI response as JSON: {str(e)}"
        )


async def analyze_lease_with_groq(text: str) -> dict:
    """Send lease text to Groq (Llama 3) for analysis"""
    
    # Demo mode - return sample data without calling API
    if DEMO_MODE:
        return {
            "monthly_rent": "$2,500.00 USD" if "2,500" in text else "See document",
            "lease_term": "5 years (Feb 1, 2026 - Jan 31, 2031)" if "five" in text.lower() else "See document",
            "security_deposit": "$5,000.00 USD" if "5,000" in text else "See document",
            "termination_clause": "60 days written notice + 3 months early termination fee ($7,500)" if "termination" in text.lower() else "See document",
            "rent_escalation": "3% annual increase" if "3%" in text or "three percent" in text.lower() else "See document"
        }
    
    try:
        # Truncate text if too long
        max_chars = 25000
        if len(text) > max_chars:
            text = text[:max_chars] + "\n\n[Document truncated for processing...]"
        
        # Use Llama 3.3 70B - fast and capable
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT
                },
                {
                    "role": "user",
                    "content": f"Lease Document Content:\n{text}"
                }
            ],
            model="llama-3.3-70b-versatile",
            temperature=0.1,
            max_tokens=1000,
        )
        
        response_text = chat_completion.choices[0].message.content
        
        if not response_text:
            raise HTTPException(
                status_code=500,
                detail="Empty response from AI model"
            )
        
        return clean_json_response(response_text)
        
    except Exception as e:
        error_str = str(e)
        
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {error_str}"
        )


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "healthy", "service": "LeaseLens API"}


@app.post("/upload")
async def upload_lease(file: UploadFile = File(...)):
    """
    Upload a PDF lease agreement for AI analysis.
    Returns extracted key lease terms in JSON format.
    """
    # Validate file type
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported"
        )
    
    # Validate content type
    if file.content_type and file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a PDF file."
        )
    
    try:
        # Read file content
        pdf_bytes = await file.read()
        
        if len(pdf_bytes) == 0:
            raise HTTPException(status_code=400, detail="Empty file provided")
        
        # Check file size (limit to 10MB for free tier)
        max_size = 10 * 1024 * 1024  # 10MB
        if len(pdf_bytes) > max_size:
            raise HTTPException(
                status_code=400,
                detail="File too large. Maximum size is 10MB."
            )
        
        # Extract text from PDF
        lease_text = extract_text_from_pdf(pdf_bytes)
        
        # Analyze with Groq (Llama 3)
        analysis_result = await analyze_lease_with_groq(lease_text)
        
        return {
            "success": True,
            "filename": file.filename,
            "data": analysis_result
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An unexpected error occurred: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
