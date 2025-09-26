from fastapi import APIRouter, File, UploadFile, HTTPException, Depends
from sqlalchemy.orm import Session
import uuid
from ..database import get_db
from ..models.models import Document
from ..services.document_parser import DocumentParser

router = APIRouter()

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload and parse a document"""
    
    # Check file type
    allowed_types = ['.docx', '.pdf', '.md', '.txt']
    file_extension = '.' + file.filename.split('.')[-1].lower()
    
    if file_extension not in allowed_types:
        raise HTTPException(
            status_code=400, 
            detail=f"File type not supported. Allowed types: {', '.join(allowed_types)}"
        )
    
    try:
        # Read file content
        file_content = await file.read()
        
        # Parse document
        content, file_type = await DocumentParser.parse_document(file_content, file.filename)
        
        # Generate unique document ID
        document_id = str(uuid.uuid4())
        
        # Save to database
        db_document = Document(
            document_id=document_id,
            filename=file.filename,
            content=content,
            file_type=file_type
        )
        
        db.add(db_document)
        db.commit()
        db.refresh(db_document)
        
        return {
            "document_id": document_id,
            "filename": file.filename,
            "file_type": file_type,
            "content_preview": content[:200] + "..." if len(content) > 200 else content,
            "content_length": len(content)
        }
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")