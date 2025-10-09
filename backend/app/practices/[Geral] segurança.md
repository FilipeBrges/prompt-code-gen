# Boas Práticas de Segurança em Aplicações

## Armazenamento de Dados Sensíveis

- Nunca armazene senhas em texto plano.
- Utilize algoritmos de hash com sal (ex: bcrypt, Argon2).
- Mantenha chaves e tokens fora do código-fonte.

## Comunicação Segura

- Utilize HTTPS em todos os endpoints.
- Rejeite conexões inseguras.
- Utilize cabeçalhos de segurança (CSP, HSTS, X-Frame-Options).

## Autenticação e Sessões

- Expire tokens e sessões inativas.
- Implemente autenticação multifator quando possível.
- Revogue tokens comprometidos imediatamente.

## Prevenção de Ataques

- Proteja contra XSS, CSRF, e injeções.
- Valide e sanitize todas as entradas.
- Limite requisições por IP para evitar brute force.

## Monitoramento

- Registre tentativas de login e falhas.
- Audite ações críticas do usuário.
