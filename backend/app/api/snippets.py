from fastapi import APIRouter
from ..snippets import SNIPPETS

router = APIRouter()

@router.get("/snippets")
async def get_snippets():
    """Get all available prompt engineering snippets"""
    
    snippets_list = []
    for snippet_id, snippet_data in SNIPPETS.items():
        snippets_list.append({
            "id": snippet_id,
            "title": snippet_data["title"],
            "description": snippet_data["description"],
            "content": snippet_data["content"]
        })
    
    return {"snippets": snippets_list}