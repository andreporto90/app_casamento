# Wedding App - André & Julia

Aplicativo web (PWA) para o casamento de André & Julia, com foco em mobile, RSVP e painel admin.

## ✨ Stack
- Next.js (App Router) + TypeScript + Tailwind
- Supabase (Postgres + Auth) para RSVPs
- Framer Motion para animações
- PWA com manifest + service worker básico

## ✅ Conteúdo editável
Os textos e links estão centralizados em `src/config/wedding.ts`.

---

## 🚀 Passo a passo

### 1) Criar projeto e instalar dependências
```bash
npm install
```

### 2) Configurar variáveis de ambiente
Crie um arquivo `.env.local` usando `.env.example` como base:
```bash
cp .env.example .env.local
```

Preencha:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (url pública para QR Code)

### 3) Configurar Supabase
Crie um projeto no Supabase e rode o SQL abaixo no painel (SQL Editor):

```sql
create table if not exists public.rsvps (
  id uuid primary key,
  name text not null,
  phone text not null,
  guests_count int not null,
  attending boolean not null,
  dietary text,
  message text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.rsvps enable row level security;

create policy "Public insert" on public.rsvps
  for insert
  to anon
  with check (true);

create policy "Admin full access" on public.rsvps
  for all
  to authenticated
  using (true);

create policy "Allow select for admin" on public.rsvps
  for select
  to authenticated
  using (true);
```

> Opcional: se quiser permitir edição pública por token, crie uma coluna extra e ajuste RLS.

### 4) Rodar localmente
```bash
npm run dev
```
Acesse em `http://localhost:3000`.

### 5) Deploy na Vercel
1. Suba o repositório no GitHub.
2. Crie um projeto na Vercel e importe o repo.
3. Configure as envs (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`).
4. Deploy.

---

## 🧪 Modo fallback (sem Supabase)
Se as envs do Supabase não existirem, o app usa um modo em memória (mock) para RSVPs. Isso ajuda em testes rápidos sem configurar backend.

---

## 📦 Estrutura principal
```
src/
  app/            # rotas (Home, Cerimônia, Recepção, RSVP, Noivos, Presentes, Admin)
  components/     # componentes reutilizáveis (IconButton, SectionCard, ElegantDivider)
  config/         # conteúdo editável do casamento
  lib/            # supabase client + fallback em memória
public/
  manifest.json
  sw.js
  floral.svg
```

---

## ♿ Acessibilidade & performance
- Contraste suave com paleta sálvia.
- Botões grandes e legíveis.
- Imagens com lazy load.

---

## 📝 Observações
- O service worker é básico para cache inicial.
- Para ícones PNG reais do PWA, substitua os SVGs em `public/icons/`.
