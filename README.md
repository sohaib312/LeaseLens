# LeaseLens 🏢

AI-Powered Commercial Lease Analysis for Real Estate Brokers

LeaseLens is a Zero-Dollar MVP that allows users to upload PDF lease agreements and automatically extract the top 5 most critical financial and termination clauses using Google's Gemini AI.

## Features

- 📄 **PDF Upload**: Drag & drop or browse to upload lease documents
- 🤖 **AI Analysis**: Powered by Google Gemini 1.5 Flash (free tier)
- 📊 **Key Clause Extraction**: Automatically extracts:
  - Monthly Rent
  - Lease Term
  - Security Deposit
  - Termination Clause Summary
  - Rent Escalation Details
- 🔒 **Secure**: Files are processed in memory and not stored
- 💰 **Zero Cost**: Uses only free-tier services

## Tech Stack

### Backend
- Python 3.10+
- FastAPI
- PyMuPDF (fitz) for PDF text extraction
- Google Generative AI (Gemini 1.5 Flash)

### Frontend
- Next.js 15 (App Router)
- React 18
- Tailwind CSS
- Lucide Icons

## Project Structure

```
LeaseLens/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables (API key)
├── frontend/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main dashboard page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   └── UploadComponent.tsx  # File upload component
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── next.config.js
└── README.md
```

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- Google AI Studio API Key (free from https://aistudio.google.com/)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Configure environment variables:
   - Edit `.env` file with your Google API key:
     ```
     GOOGLE_API_KEY=your_api_key_here
     ```

6. Start the server:
   ```bash
   python main.py
   ```
   
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:3000`

## API Endpoints

### `GET /`
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "LeaseLens API"
}
```

### `POST /upload`
Upload and analyze a PDF lease document.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` - PDF file (max 10MB)

**Response:**
```json
{
  "success": true,
  "filename": "lease.pdf",
  "data": {
    "monthly_rent": "$5,000",
    "lease_term": "3 years starting January 1, 2024",
    "security_deposit": "$10,000",
    "termination_clause": "Either party may terminate with 90 days written notice",
    "rent_escalation": "3% annual increase"
  }
}
```

## Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| `GOOGLE_API_KEY` | Your Google AI Studio API key |

### Frontend (optional)
| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: http://localhost:8000) |

## Free Tier Limits

- **Google AI Studio**: 60 requests per minute (free tier)
- **PDF Size**: Limited to 10MB per file
- **Text Length**: Truncated to 30,000 characters for API calls

## Security Considerations

- API key is stored in environment variables
- Files are processed in memory only
- CORS is configured for localhost development
- No data persistence or storage

## Development Notes

- The backend uses PyMuPDF for fast PDF text extraction
- Gemini 1.5 Flash provides quick, cost-effective AI analysis
- Frontend uses client-side state management for simplicity
- Error handling is implemented at all layers

## License

MIT License - Free for commercial and personal use.

---

Built with ❤️ for Commercial Real Estate Professionals
