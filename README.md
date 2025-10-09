# PromptCodeGen

Transform requirement documents into optimized prompts and generate code blocks via AI integration.

## Overview

PromptCodeGen is a full-stack application that helps developers transform requirement documents into well-structured prompts and generate code using AI. The system supports document upload, prompt engineering with snippets, best practices integration, and code generation with downloadable project files.

## Architecture

- **Backend**: Python with FastAPI and uvicorn
- **Frontend**: React with Vite
- **Database**: PostgreSQL (production) / SQLite (development)
 - **AI Integration**: Gemini (Google Generative AI) integrated

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn

### 1. Environment Setup

Copy and configure environment variables:

```bash
cp .env.example .env
```


Add your Gemini API key to `.env` (required for code generation):
```
GEMINI_API_KEY=your_api_key_here
APP_ENV=
DATABASE_URL=
PORT=
```
(as per example .env)

### 2. Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Development vs Production

### Development Mode (default)
- Uses SQLite in-memory database
- Set `APP_ENV=dev` in `.env`

### Production Mode
- Uses PostgreSQL database
- Set `APP_ENV=prod` and configure `DATABASE_URL` in `.env`
- Run migrations: `cd backend && alembic upgrade head`

## Scripts


Use the provided scripts for easy development (work on Linux/macOS and can be used on Windows via WSL or PowerShell):

```bash
# Run backend only
./scripts/run_backend.sh

# Run frontend only  
./scripts/run_frontend.sh

# Run both backend and frontend
./scripts/run_all.sh

# Build frontend for production
./scripts/build_frontend.sh
```

## Features

- **Document Upload**: Support for .docx, .pdf, .md, .txt files
- **Prompt Engineering**: Pre-built snippets for different developer roles
- **Best Practices**: Curated guidelines from markdown files
- **Code Generation**: AI-powered code generation (Gemini integration)
- **Visual Experience**: Frontend displays highlighted code blocks and markdown instructions, with support for bold, italic, headings, and lists for improved readability.
- **Project Download**: Generated projects as downloadable ZIP files
- **Dark Theme**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices

## API Endpoints

- `POST /api/upload` - Upload documents
- `GET /api/snippets` - Get prompt snippets
- `GET /api/practices` - Get best practices
- `POST /api/compose-prompt` - Compose final prompt
- `POST /api/generate-code` - Generate code from prompt
- `GET /api/download/{project_id}` - Download generated project

## License

MIT License