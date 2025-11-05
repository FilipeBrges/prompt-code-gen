import json
import logging
from typing import Any, Dict

from ..config import settings


class GenerativeService:
    """Service for AI code generation using Gemini"""

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY não configurada.")

    def generate_code(self, prompt: str) -> Dict[str, Any]:
        """
        Generate code from prompt using Gemini AI
        """
        from google.genai import Client

        logging.basicConfig(level=logging.INFO)
        logging.info(f"[Gemini] Prompt recebido: {prompt}")

        gemini_client = Client(api_key=self.api_key)

        try:
            model_name = "gemini-2.5-flash"
            logging.info(f"[Gemini] Usando modelo: {model_name}")
            response = gemini_client.models.generate_content(
                contents=prompt, model=model_name
            )

            logging.info(f"[Gemini] Resposta recebida: {response}")
            return self._parse_gemini_response(response)
        except Exception as e:
            logging.error(f"[Gemini] Erro ao consumir a API Gemini: {e}")
            raise

    def _parse_gemini_response(self, response) -> Dict[str, Any]:
        """Parse Gemini response into structured format, extracting JSON from text if needed."""
        import re

        if hasattr(response, "text"):
            text = response.text
        elif hasattr(response, "candidates") and response.candidates:
            text = response.candidates[0].content.parts[0].text
        else:
            text = str(response)

        json_regex = r"\{[\s\S]*?\}"
        match = re.search(json_regex, text)
        if match:
            json_str = match.group(0)
        else:
            json_str = text

        try:
            data = json.loads(json_str)
        except Exception:
            # Não foi possível extrair JSON: derive instruções removendo todos os blocos de código
            instr = re.sub(r"```[\s\S]*?```", "", text).strip()
            return {
                "files": [],
                "raw_text": text,
                "instructions": instr,
                "error": "Não foi possível interpretar a resposta da Gemini.",
            }

        files = data.get("files", [])
        # Se a AI retornou um campo 'instructions' use ele, caso contrário derive removendo blocos de código
        instructions = data.get("instructions")

        logging.info(f"Arquivos retornados: {files}")
        # Valida formato de arquivos
        if not isinstance(files, list):
            logging.error(f"Formato inesperado de arquivos: {files}")
            instr = instructions if instructions else re.sub(r"```[\s\S]*?```", "", text).strip()
            return {"files": [], "raw_text": text, "instructions": instr}

        valid_files = [f for f in files if isinstance(f, dict) and "path" in f and "content" in f]
        if not valid_files:
            logging.error(f"Nenhum arquivo válido encontrado: {files}")
            instr = instructions if instructions else re.sub(r"```[\s\S]*?```", "", text).strip()
            return {"files": [], "raw_text": text, "instructions": instr}

        # Se não houver instruções explícitas, derive juntando todo o texto fora dos blocos de código
        if not instructions:
            instructions = re.sub(r"```[\s\S]*?```", "", text).strip()

        return {"files": valid_files, "raw_text": text, "instructions": instructions}
