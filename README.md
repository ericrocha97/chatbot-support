# ContBill Chatbot Support

Este é um projeto de chatbot focado em atendimento para contabilidade, desenvolvido com **Next.js 16** e **React 19**, utilizando a **Vercel AI SDK**, **Google Gemini**, e **Upstash Redis** para um controle de abuse rate-limit distribuído. A arquitetura foi desenhada para alta resiliência, segurança via sessões com token HMAC, validação rigorosa de payloads, e _graceful degradation_ (fallback) caso o Redis fique inoperante.

## 🚀 Funcionalidades Chave

- **Vercel AI SDK**: Integração transparente e *model-agnostic* padronizado para facilitar a troca de provedores de IA no futuro. Atualmente configurado via `@ai-sdk/google`.
- **Sessões Resilientes (Tokens HMAC)**: Controle de acesso seguro atrelado à sessão do usuário (`/api/session`). Renovações gerenciadas automaticamente no hook cliente.
- **Proteção Anti-Abuso & Rate Limiting**: Limitador distribuído via [Upstash](https://upstash.com) (Vercel KV).
- **Graceful Degradation e Circuit Breaker**: Padrão de Circuit Breaker ativado para integrações via IA e Redis. Se o banco falhar, o serviço não cai, acionando perfeitamente um rate-limiter secundário embutido na memória RAM (`InMemoryRateLimiter`).
- **Validação com Zod**: Variáveis de ambiente garantidas no boot da aplicação e payload das APIs extremamente seguro.
- **Qualidade de Código & Testes (TDD)**: Testes automatizados escritos utilizando `vitest` e padronização `Ultracite` (_Biome presets_ super-rígidos).

## 🛠 Tecnologias Utilizadas

- **Core:** [Next.js 16 (Turbopack)](https://nextjs.org/) / [React 19.2](https://react.dev/) / [TypeScript](https://www.typescriptlang.org/)
- **Inteligência Artificial:** [Vercel AI SDK (`ai`)](https://sdk.vercel.ai/docs) / `@ai-sdk/google`
- **Banco e Cache:** [@upstash/redis](https://upstash.com/redis) / `@upstash/ratelimit`
- **Frontend & UI:** [Tailwind CSS v4](https://tailwindcss.com/) / [Radix UI](https://www.radix-ui.com/) (Shadcn)
- **Ferramental de Qualidade:** [Ultracite](https://haydenbleasel.com/ultracite) / [Vitest](https://vitest.dev/) / Zod

---

## 💻 Como começar (Desenvolvimento)

### 1. Requisitos e Setup
O projeto utiliza o `pnpm` como gerenciador de dependências oficial. 
Caso não o tenha, ative nativamente no NodeJS: `corepack enable pnpm`.

```bash
git clone https://github.com/ericrocha97/chatbot-support.git
cd chatbot-support
pnpm install
```

### 2. Variáveis de Ambiente
Copie o arquivo de exemplo para seu ambiente de desenvolvimento local:
```bash
cp .env.exemple .env.local
cp .env.exemple .env.development.local
```
**Observação**: Preencha as chaves:
- `GOOGLE_GENERATIVE_AI_API_KEY`: Para o Gemini.
- `SESSION_TOKEN_SECRET`: Senha forte.
Para o Vercel KV em Produção, você pode rodar o `vercel env pull .env.development.local` e baixar suas envs reais do projeto vinculado.

### 3. Simulando Upstash Redis com Docker
As libs do Upstash usam **requisições HTTP/REST**, e não o protocolo padrão de porta `6379`. Para simular isso, suba nossa stack Docker que roda um container Redis em conjunto com um Proxy Emulador compatível com o ecossistema Serverless (SRH):

```bash
docker compose up -d
```
Ele vai expor o proxy HTTP do Redis na porta `8079`.

### 4. Rodando o Projeto

Você tem à sua disposição três comandos principais. Use aquele conforme a origem desejada do seu banco Redis:

```bash
# Sobe o projeto apontando para o EMULADOR DOCKER do Upstash (via .env.local)
pnpm dev:local

# Sobe o projeto apontando para o UPSTASH REAL em nuvem (via chaves vercel em .env.development.local)
pnpm dev:vercel
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🧪 Testes e Qualidade (TDD)

O projeto foi construído via _Test-Driven Development_. Todos os casos de Rate Limit in-memory, lógica de HMAC da sessão, Circuit Breaker e Sanitização de Payload são testados de forma unitária isolada de banco de dados e internet:

- `pnpm test` : Executa todos os exames em único passe.
- `pnpm test:watch` : Roda o observador que reexecuta testes sob demanda.
- `pnpm check` : Roda a verificação severa de lints com o Ultracite (Biome).
- `pnpm fix` : Aplica lints e formatações seguras automáticas no código (roda via _lint-staged_ em pre-commits também).

---

## 🏗 Arquitetura & Estrutura de Diretórios

```bash
├── src/
│   ├── app/
│   │   ├── api/chat/route.ts      # Endpoint principal de AI (protegido, circuit breaker)
│   │   ├── api/session/route.ts   # Emissor de token HMAC
│   ├── features/chat/hooks/       # Hooks principais do front end 
│   ├── lib/
│   │   ├── services/ai.ts         # Integração isolada Vercel AI SDK
│   │   ├── circuit-breaker.ts     # Padrão genérico contra falhas
│   │   ├── env.ts                 # Validador crítico de inicialização via Zod
│   │   ├── in-memory-rate-limiter.ts # Limiter seguro na memória do Node (Fallback)
│   │   ├── logger.ts              # Observabilidade JSON
│   │   ├── rate-limiter.ts        # Fachada para Upstash + Memory Fallback
│   │   └── session.ts             # Assinaturas Token/HMAC e decodificadores
│   └── components/                # Componentes React + UI/UX Customizados
├── docker-compose.yml             # Upstash Serverless REST SDK Emulator
├── next.config.ts                 # Regras CORS estritas
└── package.json                   # Scripts de Execução e Configurações
```

---

## 🔒 Segurança

- **Payload Sanitizations**: A lib `zod` garante a tipagem rigorosa de quem invoca as rotas da API Chat. Remove tags HTML de injeção XSS por padrão.
- **Circuit Breaker Anti-Spike**: Conexões excessivas não geram efeito cascata e fila, a conexão derruba no early exit assim que a janela de timeout atua. Em falha de DNS ou Redis, cai nativamente pro fallback local isolando a sessão atacante (identificada via payload JWT/HMAC gerado a cada 5m).
- **Hard CORS**: Permite requisições unicamente de origens autorizadas na variável do ambiente `ALLOWED_ORIGINS` bloqueando ataques de cross-origin em APIs sensíveis.

---
## 📄 Licença

Este projeto é privado e para uso da lógica de negócios contábeis.
