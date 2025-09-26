"""
Hard-coded prompt engineering snippets
"""

SNIPPETS = {
    "senior_dev": {
        "title": "Desenvolvedor Sênior",
        "description": "Considere-se um desenvolvedor sênior experiente",
        "content": """Considere-se um desenvolvedor sênior experiente em Python e FastAPI com mais de 5 anos de experiência. 
        Aplique as melhores práticas de desenvolvimento, padrões de design e arquitetura limpa. 
        Gere código production-ready com tratamento de erros adequado, logging e documentação."""
    },
    "qa_perspective": {
        "title": "Perspectiva QA",
        "description": "Adote perspectiva de QA para gerar testes",
        "content": """Adote a perspectiva de um QA experiente. Gere casos de teste unitários abrangentes, 
        testes de integração e cenários de edge cases. Inclua validação de entrada, tratamento de erros 
        e testes de performance quando apropriado."""
    },
    "junior_dev": {
        "title": "Desenvolvedor Júnior",
        "description": "Explique com comentários simples",
        "content": """Explique o código com comentários detalhados e gere soluções acessíveis para desenvolvedores júnior. 
        Use padrões simples, evite over-engineering e inclua explicações sobre as decisões de design tomadas."""
    },
    "limited_complexity": {
        "title": "Limitar Complexidade",
        "description": "Restrinja a soluções básicas a intermediárias",
        "content": """Restrinja as soluções a complexidade básica a intermediária. Evite padrões avançados 
        desnecessários, múltiplas camadas de abstração ou soluções over-engineered. Priorize simplicidade e clareza."""
    },
    "generate_tests": {
        "title": "Gerar Testes",
        "description": "Inclua testes básicos usando pytest",
        "content": """Inclua testes básicos usando pytest e pytest-mock. Gere testes unitários para funções principais, 
        testes de API para endpoints e mocks adequados para dependências externas."""
    },
    "best_practices": {
        "title": "Boas Práticas",
        "description": "Aplique padrões de código limpo",
        "content": """Aplique padrões de código limpo e princípios SOLID simplificados. Use nomes descritivos, 
        funções pequenas e focadas, separação adequada de responsabilidades e documentação clara."""
    }
}