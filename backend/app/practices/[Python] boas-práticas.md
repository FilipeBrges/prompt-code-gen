# Boas Práticas para Desenvolvimento em Python

## Estilo e Formatação

- Siga o guia PEP 8 para padronização de estilo.
- Utilize ferramentas de linting como `flake8` ou `pylint`.
- Aplique formatação automática com `black` ou `autopep8`.

## Tipagem e Legibilidade

- Use type hints (`def soma(a: int, b: int) -> int:`).
- Prefira nomes descritivos para variáveis e funções.
- Evite funções muito longas ou com múltiplas responsabilidades.

## Tratamento de Erros

- Use exceções específicas em vez de `except Exception`.
- Sempre registre erros relevantes com `logging`.
- Evite capturar exceções sem tratá-las adequadamente.

## Testes

- Utilize `pytest` ou `unittest` para testes automatizados.
- Mantenha boa cobertura de testes e execute-os frequentemente.
- Use mocks para isolar dependências externas.

## Segurança

- Nunca armazene senhas ou chaves diretamente no código.
- Use variáveis de ambiente e arquivos `.env`.
- Valide entradas do usuário antes de processá-las.
