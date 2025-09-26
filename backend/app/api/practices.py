from fastapi import APIRouter, HTTPException
import os
import glob

router = APIRouter()

@router.get("/practices")
async def get_practices():
    """Get all available best practices from markdown files"""
    
    practices_dir = os.path.join(os.path.dirname(__file__), "..", "practices")
    practices = []
    
    if not os.path.exists(practices_dir):
        return {"practices": []}
    
    # Read all markdown files in practices directory
    md_files = glob.glob(os.path.join(practices_dir, "*.md"))
    
    for file_path in md_files:
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Extract title from filename or first line
                filename = os.path.basename(file_path)
                practice_id = filename.replace('.md', '')
                title = practice_id.replace('_', ' ').replace('-', ' ').title()
                
                # Extract excerpt (first paragraph or first 200 chars)
                lines = content.split('\n')
                excerpt = ""
                for line in lines:
                    if line.strip() and not line.startswith('#'):
                        excerpt = line.strip()
                        break
                
                if not excerpt and content:
                    excerpt = content[:200] + "..." if len(content) > 200 else content
                
                practices.append({
                    "id": practice_id,
                    "title": title,
                    "excerpt": excerpt,
                    "content": content
                })
                
        except Exception as e:
            print(f"Error reading practice file {file_path}: {e}")
            continue
    
    return {"practices": practices}