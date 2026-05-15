# Frontend - React + Vite + TypeScript

## Instalação

```bash
npm install
cp .env.example .env
```

## Executar

```bash
npm run dev       # ambiente de desenvolvimento (http://localhost:5173)
npm run build     # build de produção
npm run preview   # preview do build
```

## Estrutura

```
src/
├── api/            # cliente axios + interceptors
├── components/     # Navbar, ProtectedRoute
├── contexts/       # AuthContext (JWT)
├── pages/          # Login, Register, Dashboard, NewAppointment
├── types/          # tipos TypeScript compartilhados
├── App.tsx         # roteador
├── main.tsx        # entry point
└── index.css       # Tailwind
```

## Variáveis de ambiente

| Variável | Exemplo |
|---|---|
| `VITE_API_URL` | `http://localhost:3000/api` |
