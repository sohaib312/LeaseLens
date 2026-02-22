# LeaseLens - Technical Documentation

**AI-Powered Commercial Lease Analysis Platform**

---

| Document Information | |
|---------------------|-----------------|
| Version | 1.0.0 |
| Last Updated | February 2026 |
| Author | Development Team |
| Status | Production Ready |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Overview](#2-system-overview)
3. [Architecture](#3-architecture)
4. [Technology Stack](#4-technology-stack)
5. [API Documentation](#5-api-documentation)
6. [Frontend Documentation](#6-frontend-documentation)
7. [Installation & Setup](#7-installation--setup)
8. [Deployment Guide](#8-deployment-guide)
9. [Configuration Reference](#9-configuration-reference)
10. [Security Considerations](#10-security-considerations)
11. [Troubleshooting](#11-troubleshooting)
12. [Future Enhancements](#12-future-enhancements)
13. [Appendix](#13-appendix)

---

## 1. Executive Summary

### 1.1 Purpose

LeaseLens is an AI-powered SaaS application designed for Commercial Real Estate (CRE) brokers and property managers. The platform enables users to upload PDF lease agreements and automatically extract critical financial and termination clauses using advanced Large Language Models (LLMs).

### 1.2 Key Features

- **PDF Upload**: Drag-and-drop or file browser upload functionality
- **AI-Powered Analysis**: Leverages Llama 3.3 70B model via Groq for intelligent lease parsing
- **Instant Results**: Extracts 5 critical lease terms in seconds
- **Clean Interface**: Professional, responsive web interface
- **Zero Cost Infrastructure**: Deployed entirely on free-tier services

### 1.3 Target Users

| User Type | Use Case |
|-----------|----------|
| CRE Brokers | Quick lease term comparison during negotiations |
| Property Managers | Bulk lease analysis for portfolio management |
| Legal Teams | Initial lease review and due diligence |
| Investors | Deal analysis and risk assessment |

### 1.4 Business Value

- **Time Savings**: Reduces manual lease review from hours to seconds
- **Accuracy**: AI extraction minimizes human error
- **Scalability**: Process unlimited leases without additional staff
- **Cost Effective**: 100% free-tier deployment

---

## 2. System Overview

### 2.1 High-Level Workflow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   User      │───▶│  Frontend   │───▶│   Backend   │───▶│  Groq AI    │
│  Uploads    │    │  (Next.js)  │    │  (FastAPI)  │    │  (Llama 3)  │
│    PDF      │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
                          │                  │                  │
                          │                  │                  │
                          ▼                  ▼                  ▼
                   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
                   │  Display    │◀───│  Extract    │◀───│   Parse &   │
                   │  Results    │    │   JSON      │    │   Analyze   │
                   └─────────────┘    └─────────────┘    └─────────────┘
```

### 2.2 Data Flow

1. User uploads PDF lease document via web interface
2. Frontend sends file to backend API via multipart/form-data POST
3. Backend extracts text from PDF using pypdf library
4. Extracted text is sent to Groq API with structured prompt
5. AI model analyzes text and returns structured JSON
6. Backend validates and returns response to frontend
7. Frontend displays results in formatted table

### 2.3 Extracted Lease Terms

| Field | Description | Example |
|-------|-------------|---------|
| Monthly Rent | The monthly rental payment amount | $2,500.00 USD |
| Lease Term | Duration of the lease agreement | 5 years (Feb 1, 2026 - Jan 31, 2031) |
| Security Deposit | Required security deposit | $5,000.00 USD |
| Termination Clause | Summary of termination conditions | 60 days written notice required |
| Rent Escalation | Annual rent increase details | 3% annual increase |

---

## 3. Architecture

### 3.1 System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                              INTERNET                                   │
└────────────────────────────────────────────────────────────────────────┘
                    │                              │
                    ▼                              ▼
        ┌───────────────────┐          ┌───────────────────┐
        │      VERCEL       │          │  HUGGING FACE     │
        │   (Frontend Host) │          │    SPACES         │
        │                   │          │  (Backend Host)   │
        │  ┌─────────────┐  │   HTTPS  │  ┌─────────────┐  │
        │  │   Next.js   │──┼──────────┼─▶│   FastAPI   │  │
        │  │     App     │  │          │  │    Server   │  │
        │  └─────────────┘  │          │  └──────┬──────┘  │
        │                   │          │         │         │
        └───────────────────┘          └─────────┼─────────┘
                                                 │
                                                 │ HTTPS
                                                 ▼
                                       ┌───────────────────┐
                                       │     GROQ API      │
                                       │   (AI Service)    │
                                       │                   │
                                       │  Llama 3.3 70B    │
                                       └───────────────────┘
```

### 3.2 Component Breakdown

#### Frontend (Presentation Layer)
- **Technology**: Next.js 15 with React 18
- **Hosting**: Vercel (Free Tier)
- **Responsibilities**:
  - User interface rendering
  - File upload handling
  - API communication
  - Result display

#### Backend (Application Layer)
- **Technology**: Python FastAPI
- **Hosting**: Hugging Face Spaces (Free Tier)
- **Responsibilities**:
  - PDF text extraction
  - AI prompt engineering
  - Response validation
  - CORS management

#### AI Service (Intelligence Layer)
- **Provider**: Groq
- **Model**: Llama 3.3 70B Versatile
- **Responsibilities**:
  - Natural language understanding
  - Lease clause identification
  - Structured data extraction

### 3.3 Directory Structure

```
LeaseLens/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile          # Container configuration
│   ├── .env                # Environment variables (local only)
│   ├── .gitignore          # Git ignore rules
│   ├── Procfile            # Process configuration
│   ├── render.yaml         # Render deployment config
│   └── runtime.txt         # Python version specification
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx      # Root layout component
│   │   ├── page.tsx        # Main dashboard page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   └── UploadComponent.tsx  # File upload component
│   ├── package.json        # Node.js dependencies
│   ├── tailwind.config.ts  # Tailwind CSS configuration
│   ├── tsconfig.json       # TypeScript configuration
│   ├── next.config.js      # Next.js configuration
│   └── .env.example        # Environment template
│
├── docs/
│   └── LeaseLens_Technical_Documentation.md
│
├── .gitignore              # Root git ignore
├── README.md               # Project overview
└── DEPLOYMENT.md           # Deployment instructions
```

---

## 4. Technology Stack

### 4.1 Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Python | 3.11+ | Programming language |
| FastAPI | 0.109.0 | Web framework |
| Uvicorn | 0.27.0 | ASGI server |
| pypdf | 4.0.1 | PDF text extraction |
| Groq SDK | 0.4.0+ | AI API client |
| python-dotenv | 1.0.0 | Environment management |
| python-multipart | 0.0.6 | File upload handling |

### 4.2 Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.3.2 | React framework |
| React | 18.2.0 | UI library |
| TypeScript | 5.3.0 | Type-safe JavaScript |
| Tailwind CSS | 3.4.0 | Utility-first CSS |
| Lucide React | 0.303.0 | Icon library |
| clsx | 2.1.0 | Class name utility |

### 4.3 Infrastructure

| Service | Tier | Purpose |
|---------|------|---------|
| Vercel | Free | Frontend hosting |
| Hugging Face Spaces | Free | Backend hosting (Docker) |
| Groq | Free | AI inference |
| GitHub | Free | Source control |

### 4.4 AI Model Specifications

| Property | Value |
|----------|-------|
| Model | Llama 3.3 70B Versatile |
| Provider | Groq |
| Context Window | 128K tokens |
| Max Output | 1,000 tokens (configured) |
| Temperature | 0.1 (low variance) |
| Response Format | JSON |

---

## 5. API Documentation

### 5.1 Base URL

| Environment | URL |
|-------------|-----|
| Production | `https://sohaibb312-leaselens-api.hf.space` |
| Local Development | `http://localhost:7860` |

### 5.2 Endpoints

#### Health Check

```http
GET /
```

**Description**: Verify API is running and healthy.

**Response**:
```json
{
  "status": "healthy",
  "service": "LeaseLens API"
}
```

**Status Codes**:
| Code | Description |
|------|-------------|
| 200 | Service is healthy |

---

#### Upload and Analyze Lease

```http
POST /upload
Content-Type: multipart/form-data
```

**Description**: Upload a PDF lease agreement for AI analysis.

**Request Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| file | File | Yes | PDF file (max 10MB) |

**Request Example (cURL)**:
```bash
curl -X POST "https://sohaibb312-leaselens-api.hf.space/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@lease_agreement.pdf"
```

**Request Example (JavaScript)**:
```javascript
const formData = new FormData();
formData.append('file', pdfFile);

const response = await fetch('https://sohaibb312-leaselens-api.hf.space/upload', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
```

**Success Response** (200 OK):
```json
{
  "success": true,
  "filename": "lease_agreement.pdf",
  "data": {
    "monthly_rent": "$2,500.00 USD",
    "lease_term": "5 years (February 1, 2026 - January 31, 2031)",
    "security_deposit": "$5,000.00 USD",
    "termination_clause": "Either party may terminate with 60 days written notice. Early termination fee of 3 months rent applies.",
    "rent_escalation": "3% annual increase on lease anniversary"
  }
}
```

**Error Responses**:

| Status | Error | Description |
|--------|-------|-------------|
| 400 | No file provided | File parameter missing |
| 400 | Only PDF files are supported | Wrong file type |
| 400 | Empty file provided | File has no content |
| 400 | File too large | Exceeds 10MB limit |
| 400 | Failed to extract text | PDF is corrupted or image-only |
| 500 | AI analysis failed | Groq API error |
| 500 | Failed to parse AI response | Invalid JSON from AI |

**Error Response Format**:
```json
{
  "detail": "Error message describing the issue"
}
```

### 5.3 Rate Limits

| Limit Type | Value | Notes |
|------------|-------|-------|
| Groq API | 30 requests/minute | Free tier limit |
| File Size | 10 MB | Per request |
| Text Length | 25,000 characters | Truncated if exceeded |

### 5.4 CORS Configuration

Allowed origins are configured via the `ALLOWED_ORIGINS` environment variable:

```python
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", 
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")
```

---

## 6. Frontend Documentation

### 6.1 Component Architecture

```
App (layout.tsx)
└── Home (page.tsx)
    ├── Header
    │   └── Logo & Title
    ├── Hero Section
    │   └── Description
    ├── Features Grid
    │   ├── PDF Upload Feature
    │   ├── AI Analysis Feature
    │   └── Security Feature
    ├── Upload Section
    │   └── UploadComponent
    │       ├── Dropzone
    │       ├── Loading State
    │       └── Error Display
    └── Results Section
        └── Data Table
```

### 6.2 Key Components

#### UploadComponent

**File**: `frontend/components/UploadComponent.tsx`

**Props**:
```typescript
interface UploadComponentProps {
  onUploadSuccess: (data: AnalysisResult) => void;
  onUploadError: (error: string) => void;
  onLoadingChange: (loading: boolean) => void;
}
```

**Features**:
- Drag and drop file upload
- File type validation (PDF only)
- File size validation (10MB max)
- Loading state with spinner
- Error handling and display

#### Home Page

**File**: `frontend/app/page.tsx`

**State Management**:
```typescript
const [result, setResult] = useState<AnalysisResult | null>(null);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Key Functions**:
| Function | Description |
|----------|-------------|
| `handleUploadSuccess` | Processes successful API response |
| `handleUploadError` | Handles and displays errors |
| `handleLoadingChange` | Manages loading state |
| `resetAnalysis` | Clears results for new upload |
| `formatLabel` | Converts keys to display labels |

### 6.3 Styling

**Framework**: Tailwind CSS with custom configuration

**Color Scheme**:
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --border: 214.3 31.8% 91.4%;
}
```

### 6.4 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| NEXT_PUBLIC_API_URL | Yes | Backend API URL |

**Example** (`.env.local`):
```
NEXT_PUBLIC_API_URL=https://sohaibb312-leaselens-api.hf.space
```

---

## 7. Installation & Setup

### 7.1 Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Python | 3.11+ | Backend runtime |
| Node.js | 18+ | Frontend runtime |
| npm | 9+ | Package manager |
| Git | 2.0+ | Version control |
| Groq API Key | - | Free at console.groq.com |

### 7.2 Backend Setup

```bash
# 1. Navigate to backend directory
cd LeaseLens/backend

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt

# 5. Create environment file
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# 6. Start development server
python main.py
```

**Backend will be available at**: `http://localhost:7860`

### 7.3 Frontend Setup

```bash
# 1. Navigate to frontend directory
cd LeaseLens/frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:7860

# 4. Start development server
npm run dev
```

**Frontend will be available at**: `http://localhost:3000`

### 7.4 Quick Start (Both Services)

```bash
# Terminal 1 - Backend
cd LeaseLens/backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
python main.py

# Terminal 2 - Frontend
cd LeaseLens/frontend
npm install && npm run dev
```

---

## 8. Deployment Guide

### 8.1 Backend Deployment (Hugging Face Spaces)

#### Step 1: Create Hugging Face Account
1. Go to https://huggingface.co/join
2. Create free account (no credit card required)

#### Step 2: Create New Space
1. Navigate to https://huggingface.co/new-space
2. Configure:
   - **Space name**: `leaselens-api`
   - **SDK**: Docker
   - **Hardware**: CPU Basic (Free)
3. Click "Create Space"

#### Step 3: Upload Files
Upload these files from `backend/` directory:
- `main.py`
- `requirements.txt`
- `Dockerfile`

#### Step 4: Add Secrets
1. Go to Space Settings → Repository secrets
2. Add secret:
   - **Name**: `GROQ_API_KEY`
   - **Value**: Your Groq API key

#### Step 5: Verify Deployment
- Space URL: `https://YOUR_USERNAME-leaselens-api.hf.space`
- Test: `curl https://YOUR_USERNAME-leaselens-api.hf.space/`

### 8.2 Frontend Deployment (Vercel)

#### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub (recommended)

#### Step 2: Import Project
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`

#### Step 3: Add Environment Variable
- **Key**: `NEXT_PUBLIC_API_URL`
- **Value**: Your Hugging Face Space URL

#### Step 4: Deploy
1. Click "Deploy"
2. Wait 1-2 minutes for build
3. Your app will be available at: `https://your-project.vercel.app`

### 8.3 Post-Deployment Configuration

#### Update CORS
After getting your Vercel URL, update Hugging Face:
1. Go to Space Settings → Repository secrets
2. Add:
   - **Name**: `ALLOWED_ORIGINS`
   - **Value**: `https://your-project.vercel.app`

### 8.4 Deployment Checklist

| Task | Status |
|------|--------|
| Backend code pushed to GitHub | ☐ |
| Hugging Face Space created | ☐ |
| Backend files uploaded | ☐ |
| GROQ_API_KEY secret added | ☐ |
| Backend health check passed | ☐ |
| Vercel project created | ☐ |
| Frontend root directory set | ☐ |
| NEXT_PUBLIC_API_URL configured | ☐ |
| Frontend deployed | ☐ |
| ALLOWED_ORIGINS updated | ☐ |
| End-to-end test passed | ☐ |

---

## 9. Configuration Reference

### 9.1 Backend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| GROQ_API_KEY | Yes* | - | Groq API authentication key |
| DEMO_MODE | No | false | Enable demo mode (no API calls) |
| ALLOWED_ORIGINS | No | localhost:3000 | Comma-separated CORS origins |
| PORT | No | 7860 | Server port |

*Required unless DEMO_MODE is true

### 9.2 Frontend Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| NEXT_PUBLIC_API_URL | Yes | - | Backend API base URL |

### 9.3 AI Configuration

Located in `backend/main.py`:

```python
# Model settings
MODEL = "llama-3.3-70b-versatile"
TEMPERATURE = 0.1
MAX_TOKENS = 1000

# Text processing
MAX_CHARS = 25000  # Truncate longer documents

# File limits
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
```

### 9.4 Dockerfile Configuration

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY main.py .
EXPOSE 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
```

---

## 10. Security Considerations

### 10.1 API Key Protection

| Risk | Mitigation |
|------|------------|
| Key exposure in code | Use environment variables |
| Key in version control | .gitignore excludes .env files |
| Key in client-side code | Backend-only API calls |
| Key logging | No sensitive data in logs |

### 10.2 File Upload Security

```python
# Implemented validations:
- File type check (.pdf extension)
- Content-type validation (application/pdf)
- File size limit (10MB)
- Empty file check
```

### 10.3 CORS Policy

```python
# Restrict origins to known domains
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000"
).split(",")
```

### 10.4 Data Privacy

| Aspect | Implementation |
|--------|----------------|
| Data retention | No storage - files processed in memory |
| Data transmission | HTTPS encryption |
| Third-party sharing | Only to Groq for AI processing |
| User data | No PII collection |

### 10.5 Security Recommendations

1. **Rotate API keys** regularly
2. **Monitor usage** for unusual patterns
3. **Keep dependencies** updated
4. **Review CORS** origins periodically
5. **Implement rate limiting** for production

---

## 11. Troubleshooting

### 11.1 Common Issues

#### Backend Won't Start

**Error**: `GROQ_API_KEY environment variable is not set`

**Solution**:
```bash
# Create .env file with your key
echo "GROQ_API_KEY=your_key_here" > .env
```

#### CORS Errors

**Error**: `Access to fetch blocked by CORS policy`

**Solution**:
1. Check ALLOWED_ORIGINS includes your frontend URL
2. Ensure URL has no trailing slash
3. Restart backend after changes

#### PDF Extraction Fails

**Error**: `Failed to extract text from PDF`

**Possible Causes**:
- PDF is image-based (scanned document)
- PDF is corrupted
- PDF is password-protected

**Solution**:
- Use OCR for scanned documents (future enhancement)
- Try re-exporting the PDF
- Remove password protection

#### AI Analysis Timeout

**Error**: `AI analysis failed: timeout`

**Solution**:
- Check Groq API status
- Verify API key is valid
- Try with smaller document

### 11.2 Debug Mode

Enable detailed logging:

```python
# Add to main.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

### 11.3 Testing the API

```bash
# Health check
curl https://your-api-url/

# Upload test (replace with actual file)
curl -X POST https://your-api-url/upload \
  -F "file=@test_lease.pdf"
```

### 11.4 Log Analysis

#### Hugging Face Logs
1. Go to your Space
2. Click "Logs" tab
3. Review for errors

#### Vercel Logs
1. Go to project dashboard
2. Click "Functions" tab
3. View real-time logs

---

## 12. Future Enhancements

### 12.1 Planned Features

| Feature | Priority | Complexity | Description |
|---------|----------|------------|-------------|
| OCR Support | High | Medium | Extract text from scanned PDFs |
| Batch Upload | High | Medium | Process multiple files at once |
| Export Results | Medium | Low | Download as CSV/PDF |
| User Authentication | Medium | High | User accounts and history |
| Custom Extraction | Medium | Medium | User-defined fields to extract |
| Comparison View | Low | Medium | Compare multiple leases |
| Dashboard Analytics | Low | High | Usage statistics |

### 12.2 Technical Improvements

| Improvement | Benefit |
|-------------|---------|
| Add caching layer | Reduce API calls for duplicate documents |
| Implement queuing | Handle high traffic gracefully |
| Add unit tests | Improve code reliability |
| CI/CD pipeline | Automate deployments |
| Monitoring | Track performance and errors |

### 12.3 Scalability Considerations

For high-traffic deployment:

1. **Database**: Add PostgreSQL for storing analysis history
2. **Caching**: Redis for frequently accessed data
3. **Queue**: Celery/RQ for async processing
4. **CDN**: CloudFlare for static assets
5. **Load Balancer**: Distribute traffic across instances

---

## 13. Appendix

### 13.1 Glossary

| Term | Definition |
|------|------------|
| API | Application Programming Interface |
| CORS | Cross-Origin Resource Sharing |
| CRE | Commercial Real Estate |
| FastAPI | Modern Python web framework |
| LLM | Large Language Model |
| MVP | Minimum Viable Product |
| OCR | Optical Character Recognition |
| PDF | Portable Document Format |
| SaaS | Software as a Service |

### 13.2 References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Groq Documentation](https://console.groq.com/docs)
- [Hugging Face Spaces](https://huggingface.co/docs/hub/spaces)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

### 13.3 API Response Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "LeaseAnalysisResponse",
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean",
      "description": "Whether the analysis was successful"
    },
    "filename": {
      "type": "string",
      "description": "Original filename of uploaded PDF"
    },
    "data": {
      "type": "object",
      "properties": {
        "monthly_rent": {"type": "string"},
        "lease_term": {"type": "string"},
        "security_deposit": {"type": "string"},
        "termination_clause": {"type": "string"},
        "rent_escalation": {"type": "string"}
      },
      "required": [
        "monthly_rent",
        "lease_term", 
        "security_deposit",
        "termination_clause",
        "rent_escalation"
      ]
    }
  },
  "required": ["success", "filename", "data"]
}
```

### 13.4 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2026 LeaseLens

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### 13.5 Change Log

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Feb 2026 | Initial release with core functionality |

---

**Document End**

*For questions or support, please contact the development team.*
