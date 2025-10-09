# Boas Práticas para Desenvolvimento em Java

## Estrutura de Código

- Siga convenções de nomenclatura: `camelCase` para variáveis/métodos e `PascalCase` para classes.
- Mantenha uma hierarquia de pacotes coerente.
- Evite classes ou métodos excessivamente grandes.

## Padrões e Arquitetura

- Aplique princípios SOLID e design patterns quando apropriado.
- Prefira composição a herança desnecessária.
- Utilize interfaces para promover flexibilidade.

## Tratamento de Exceções

- Use exceções verificadas e não verificadas conforme o contexto.
- Evite capturar exceções genéricas.
- Registre logs de erros com contexto suficiente para depuração.

## Testes

- Utilize `JUnit` e `Mockito` para testes unitários e de integração.
- Automatize a execução dos testes no build (ex: Maven, Gradle).
- Escreva nomes de testes que expressem comportamento esperado.

## Documentação e Comentários

- Use JavaDoc para gerar documentação automática.
- Comente apenas o necessário; o código deve ser autoexplicativo.
