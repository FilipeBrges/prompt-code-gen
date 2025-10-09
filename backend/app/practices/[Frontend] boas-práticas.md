# Boas Práticas de Desenvolvimento Front-end

## Estrutura e Organização

- Mantenha uma hierarquia de pastas clara (componentes, páginas, assets, hooks, contextos).
- Separe responsabilidades entre lógica, apresentação e estilo.
- Prefira componentes reutilizáveis e bem definidos.

## Legibilidade e Manutenção

- Use nomes descritivos para componentes e variáveis.
- Evite funções anônimas diretamente em JSX.
- Utilize comentários apenas quando o código não for autoexplicativo.

## Performance

- Faça lazy loading de componentes e rotas.
- Otimize imagens e recursos estáticos.
- Utilize memoização (`useMemo`, `React.memo`) apenas quando necessário.

## Acessibilidade (A11y)

- Sempre forneça rótulos (`aria-label`, `alt`) para elementos interativos.
- Garanta contraste de cores adequado.
- Teste navegação via teclado.

## Segurança

- Nunca injete HTML sem sanitização.
- Evite armazenar dados sensíveis no cliente.
- Utilize HTTPS e políticas de CORS seguras.
