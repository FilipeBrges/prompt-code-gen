from fastapi import FastAPI, File, UploadFile, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
import os
import tempfile
import zipfile
from typing import List, Optional
import uuid

from .config import settings
from .database import get_db, engine, Base
from .api import upload, snippets, practices, prompt, generation
from .models import models

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PromptCodeGen API",
    description="Transform documents into optimized prompts and generate code",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(snippets.router, prefix="/api", tags=["snippets"])
app.include_router(practices.router, prefix="/api", tags=["practices"])
app.include_router(prompt.router, prefix="/api", tags=["prompt"])
app.include_router(generation.router, prefix="/api", tags=["generation"])

@app.get("/")
async def root():
    return {"message": "PromptCodeGen API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=settings.PORT)