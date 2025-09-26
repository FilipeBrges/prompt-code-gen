import json
from typing import Dict, List, Any
from ..config import settings

class GenerativeService:
    """Service for AI code generation using Gemini"""
    
    def __init__(self):
        self.api_key = settings.gemini_api_key
    
    async def generate_code(self, prompt: str) -> Dict[str, Any]:
        """
        Generate code from prompt using Gemini AI
        """
        import logging
        logging.basicConfig(level=logging.INFO)
        logging.info(f"[Gemini] Prompt recebido: {prompt}")
        try:
            import google.generativeai as genai
        except ImportError as e:
            logging.error(f"[Gemini] Erro de importação: {e}")
            raise ImportError("O pacote google-generativeai não está instalado no ambiente Python ativo.")
        if not self.api_key:
            logging.error("[Gemini] API KEY não encontrada. Verifique o .env e a configuração do Settings.")
            raise ValueError("GEMINI_API_KEY não configurada.")
        genai.configure(api_key=self.api_key)
        try:
            model_name = "models/gemini-1.5-flash"
            logging.info(f"[Gemini] Usando modelo: {model_name}")
            model = genai.GenerativeModel(model_name)
            response = await model.generate_content_async(prompt)
            logging.info(f"[Gemini] Resposta recebida: {response}")
            return self._parse_gemini_response(response)
        except Exception as e:
            logging.error(f"[Gemini] Erro ao consumir a API Gemini: {e}")
            raise
    
    def _parse_gemini_response(self, response) -> Dict[str, Any]:
      """Parse Gemini response into structured format, extracting JSON from text if needed."""
      import re
      if hasattr(response, 'text'):
        text = response.text
      elif hasattr(response, 'candidates') and response.candidates:
        text = response.candidates[0].content.parts[0].text
      else:
        text = str(response)

      json_regex = r'\{[\s\S]*?\}'
      match = re.search(json_regex, text)
      if match:
        json_str = match.group(0)
      else:
        json_str = text  

      try:
        data = json.loads(json_str)
      except Exception:
        return {"files": [], "instructions": [], "commands": [], "error": "Não foi possível interpretar a resposta da Gemini."}

      return {
        "files": data.get("files", []),
        "instructions": data.get("instructions", []),
        "commands": data.get("commands", []),
      }