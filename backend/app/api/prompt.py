from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from ..database import get_db
from ..models.models import Document
from ..snippets import SNIPPETS
from ..api.practices import get_practices

router = APIRouter()

class ComposePromptRequest(BaseModel):
    document_id: str
    snippet_ids: List[str] = []
    practice_ids: List[str] = []
    extra_instructions: Optional[str] = None

@router.post("/compose-prompt")
async def compose_prompt(
    request: ComposePromptRequest,
    db: Session = Depends(get_db)
):
    """Compose final prompt from document, snippets, and practices"""
    
    # Get document content
    document = db.query(Document).filter(Document.document_id == request.document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Start building the prompt
    prompt_parts = []
    
    # Add document content
    prompt_parts.append("## Document Requirements")
    prompt_parts.append(document.content)
    prompt_parts.append("")
    
    # Add selected snippets
    if request.snippet_ids:
        prompt_parts.append("## Prompt Engineering Context")
        for snippet_id in request.snippet_ids:
            if snippet_id in SNIPPETS:
                snippet = SNIPPETS[snippet_id]
                prompt_parts.append(f"### {snippet['title']}")
                prompt_parts.append(snippet['content'])
                prompt_parts.append("")
    
    # Add selected practices
    if request.practice_ids:
        practices_response = await get_practices()
        practices = {p['id']: p for p in practices_response['practices']}
        
        prompt_parts.append("## Best Practices to Apply")
        for practice_id in request.practice_ids:
            if practice_id in practices:
                practice = practices[practice_id]
                prompt_parts.append(f"### {practice['title']}")
                prompt_parts.append(practice['content'])
                prompt_parts.append("")
    
    # Add extra instructions
    if request.extra_instructions:
        prompt_parts.append("## Additional Instructions")
        prompt_parts.append(request.extra_instructions)
        prompt_parts.append("")
    # Add final instruction (always include - not only when extra_instructions provided)
    prompt_parts.append("## Output Requirements")
    prompt_parts.append(
        """Por favor, gere um projeto completo e funcional com base nos requisitos acima.\n" +
        "Retorne principalmente o código: explicações siga o formato MD. Se for para explicar o que os blocos de codigo fazem. Evite comentar no codigo, gerar comentarios gerais ou especificos mesmo, evite.\n" +
        "Para cada bloco de código que você gerar, use sempre três crases seguidas pelo nome da linguagem (por exemplo, python, js, ```java, etc.) e feche com três crases.\n" +
        """)
    
    final_prompt = "\n".join(prompt_parts)
    
    return {"prompt": final_prompt}