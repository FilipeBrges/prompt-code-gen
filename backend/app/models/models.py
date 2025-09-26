from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from ..database import Base

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    document_id = Column(String, unique=True, index=True)
    filename = Column(String)
    content = Column(Text)
    file_type = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class GeneratedProject(Base):
    __tablename__ = "generated_projects"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String, unique=True, index=True)
    prompt = Column(Text)
    files_json = Column(Text)  # JSON string of generated files
    zip_path = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())