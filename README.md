
# Chatbot Support

Este é um projeto de chatbot desenvolvido com [Next.js](https://nextjs.org), utilizando a API Gemini do Google e Upstash Redis para gerenciamento de dados e controle de rate limit. O projeto foi inicializado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Funcionalidades

- Chatbot com integração à API Gemini (Google GenAI)
- Rate limiting com Upstash Redis
- Interface moderna com componentes React e Radix UI
- Suporte a temas customizados (Rose Pine)
- Configuração pronta para deploy na Vercel

## Tecnologias Utilizadas

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [@google/genai](https://www.npmjs.com/package/@google/genai)
- [@upstash/redis](https://www.npmjs.com/package/@upstash/redis)
- [@upstash/ratelimit](https://www.npmjs.com/package/@upstash/ratelimit)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

## Como começar

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/ericrocha97/chatbot-support.git
   cd chatbot-support
   ```

2. **Instale as dependências:**

   ```bash
   pnpm install
   # ou
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente:**

   Copie o arquivo `.env.exemple` para `.env` e preencha com suas chaves:

   ```env
   GEMINI_API_KEY=suachave
   UPSTASH_REDIS_REST_URL=sua-url
   UPSTASH_REDIS_REST_TOKEN=seu-token
   ```

4. **Inicie o servidor de desenvolvimento:**

   ```bash
   pnpm dev
   # ou
   npm run dev
   # ou
   yarn dev
   ```

5. Abra [http://localhost:3000](http://localhost:3000) no navegador para ver o resultado.

## Estrutura do Projeto

```bash
├── public/                # Arquivos estáticos
├── src/
│   ├── app/              # Páginas e layouts do Next.js
│   │   ├── api/         # APIs do projeto
│   │   └── rose-pine-theme/  # Arquivos de tema
│   ├── components/       # Componentes reutilizáveis
│   │   ├── sections/    # Seções da página
│   │   └── ui/         # Componentes de UI
│   ├── constants/       # Constantes e conteúdo estático
│   ├── features/        # Features específicas
│   │   └── chat/       # Funcionalidade do chat
│   └── lib/            # Utilitários e serviços
├── .env.exemple         # Exemplo de variáveis de ambiente
├── components.json      # Configuração de componentes
├── next.config.ts      # Configuração do Next.js
├── package.json        # Dependências e scripts
└── README.md           # Documentação
```

## Scripts Disponíveis

- `dev`: Inicia o servidor de desenvolvimento com Turbopack
- `build`: Gera a build de produção
- `start`: Inicia o servidor em modo produção
- `lint`: Checa e corrige problemas de lint com Biome

## Deploy

O deploy pode ser feito facilmente na [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

## Licença

Este projeto é privado e para uso interno.
