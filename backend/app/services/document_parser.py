import os
import tempfile
from typing import Tuple
import docx
import PyPDF2
import fitz  # PyMuPDF

class DocumentParser:
    """Parse different document types and extract text content"""
    
    @staticmethod
    async def parse_document(file_content: bytes, filename: str) -> Tuple[str, str]:
        """
        Parse document and return (content, file_type)
        """
        file_extension = os.path.splitext(filename)[1].lower()
        
        if file_extension == '.docx':
            return DocumentParser._parse_docx(file_content), 'docx'
        elif file_extension == '.pdf':
            return DocumentParser._parse_pdf(file_content), 'pdf'
        elif file_extension in ['.md', '.txt']:
            return DocumentParser._parse_text(file_content), file_extension[1:]
        else:
            raise ValueError(f"Unsupported file type: {file_extension}")
    
    @staticmethod
    def _parse_docx(file_content: bytes) -> str:
        """Parse DOCX file and extract text"""
        with tempfile.NamedTemporaryFile() as tmp_file:
            tmp_file.write(file_content)
            tmp_file.flush()
            
            doc = docx.Document(tmp_file.name)
            text_content = []
            
            for paragraph in doc.paragraphs:
                text_content.append(paragraph.text)
            
            return '\n'.join(text_content)
    
    @staticmethod
    def _parse_pdf(file_content: bytes) -> str:
        """Parse PDF file and extract text"""
        with tempfile.NamedTemporaryFile() as tmp_file:
            tmp_file.write(file_content)
            tmp_file.flush()
            
            # Try PyMuPDF first (better for complex PDFs)
            try:
                doc = fitz.open(tmp_file.name)
                text_content = []
                
                for page in doc:
                    text_content.append(page.get_text())
                
                doc.close()
                return '\n'.join(text_content)
            except:
                # Fallback to PyPDF2
                with open(tmp_file.name, 'rb') as pdf_file:
                    pdf_reader = PyPDF2.PdfReader(pdf_file)
                    text_content = []
                    
                    for page in pdf_reader.pages:
                        text_content.append(page.extract_text())
                    
                    return '\n'.join(text_content)
    
    @staticmethod
    def _parse_text(file_content: bytes) -> str:
        """Parse text/markdown file"""
        try:
            return file_content.decode('utf-8')
        except UnicodeDecodeError:
            # Try latin-1 as fallback
            return file_content.decode('latin-1')