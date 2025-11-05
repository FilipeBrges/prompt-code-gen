from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
import uuid
import json
import os
from ..database import get_db
from ..models.models import GeneratedProject
from ..services.generative import GenerativeService
from ..services.project_generator import ProjectGenerator

router = APIRouter()

class GenerateCodeRequest(BaseModel):
    prompt: str

@router.post("/generate-code")
async def generate_code(
    request: GenerateCodeRequest,
    db: Session = Depends(get_db)
):
    """Generate code from prompt using AI"""
    
    try:
        # Generate code using AI service
        generative_service = GenerativeService()
        generated_data = generative_service.generate_code(request.prompt)

        # Create project ZIP
        zip_path = ProjectGenerator.create_project_zip(generated_data)

        # Generate project ID
        project_id = str(uuid.uuid4())

        # Save to database
        db_project = GeneratedProject(
            project_id=project_id,
            prompt=request.prompt,
            files_json=json.dumps(generated_data),
            zip_path=zip_path
        )

        db.add(db_project)
        db.commit()
        db.refresh(db_project)

        return {
            "project_id": project_id,
            "files": generated_data.get("files", []),
            "download_url": f"/api/download/{project_id}",
            "raw_text": generated_data.get("raw_text", ""),
            "instructions": generated_data.get("instructions", "")
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating code: {str(e)}")

@router.get("/download/{project_id}")
async def download_project(
    project_id: str,
    db: Session = Depends(get_db)
):
    """Download generated project as ZIP file"""
    
    # Get project from database
    project = db.query(GeneratedProject).filter(GeneratedProject.project_id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if ZIP file exists
    if not os.path.exists(project.zip_path):
        raise HTTPException(status_code=404, detail="Project file not found")
    
    return FileResponse(
        path=project.zip_path,
        filename=f"generated_project_{project_id}.zip",
        media_type="application/zip"
    )