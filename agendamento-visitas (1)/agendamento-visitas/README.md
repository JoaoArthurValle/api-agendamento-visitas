# Sistema de Agendamento de Visitas

Projeto desenvolvido para Trabalho de Conclusão de Curso.

## Visão geral

API REST + interface web para agendamento de visitas, com a regra de negócio de que **só podem ser agendadas visitas de segunda a sexta-feira, em horário comercial (09h às 18h), em slots de 1 hora**.

## Stack

- **Backend:** NestJS 10 + Prisma 5 + MySQL
- **Frontend:** React 18 + Vite + TypeScript + TailwindCSS
- **Autenticação:** JWT (Passport)
- **Documentação:** Swagger (`/api/docs`)

## Estrutura

```
agendamento-visitas/
├── backend/         # API NestJS
│   ├── prisma/      # Schema e seed
│   ├── src/
│   │   ├── auth/            # JWT, login, registro
│   │   ├── users/           # Endpoint /me
│   │   ├── appointments/    # CRUD e slots disponíveis
│   │   ├── common/validators/  # @IsBusinessHour (regra de horário)
│   │   └── prisma/          # PrismaService
│   └── ...
└── frontend/        # SPA React
    └── src/
        ├── pages/
        ├── components/
        ├── contexts/
        ├── api/
        └── types/
```

## Como rodar

### Pré-requisitos
- Node.js 18+
- MySQL acessível (banco da faculdade ou local)

### 1) Backend

```bash
cd backend
npm install
cp .env.example .env
# edite .env com a DATABASE_URL e o JWT_SECRET

npx prisma migrate dev --name init  # cria as tabelas
npm run prisma:seed                 # cria usuário admin
npm run start:dev
```

A API sobe em `http://localhost:3000/api` e o Swagger em `http://localhost:3000/api/docs`.

**Usuário admin criado pelo seed:**
- email: `admin@faculdade.edu.br`
- senha: `admin123`

### 2) Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

A interface sobe em `http://localhost:5173`.

## Regra de negócio — onde fica?

A validação de "seg–sex, 09h–18h" está implementada em **três camadas** (defesa em profundidade):

1. **Frontend** (`NewAppointment.tsx`) — input `type="date"` aceita só dias úteis e o backend retorna apenas slots válidos; slots ocupados/passados aparecem riscados.
2. **DTO do NestJS** (`business-hour.validator.ts`) — decorator `@IsBusinessHour()` no `CreateAppointmentDto`. Bloqueia antes mesmo do service.
3. **Service** (`appointments.service.ts → assertBusinessHour()`) — re-valida e bloqueia datas passadas.

Além disso:
- O campo `startTime` tem `@unique` no Prisma → garante no banco que dois agendamentos nunca ocupem o mesmo slot, mesmo em condição de corrida.
- O erro `P2002` do Prisma é traduzido em `409 Conflict` com mensagem clara.

## Endpoints principais

| Método | Rota | Auth | Descrição |
|---|---|---|---|
| POST | `/api/auth/register` | — | Cria conta |
| POST | `/api/auth/login` | — | Retorna JWT |
| GET | `/api/users/me` | JWT | Perfil do usuário |
| GET | `/api/appointments` | JWT | Lista (user: seus; admin: todos) |
| POST | `/api/appointments` | JWT | Cria agendamento |
| GET | `/api/appointments/available-slots?date=YYYY-MM-DD` | JWT | Slots livres do dia |
| DELETE | `/api/appointments/:id` | JWT | Cancela |

## Testes

```bash
cd backend
npm test
```

Há testes unitários para o validator `@IsBusinessHour`, cobrindo dias úteis, fim de semana, horários fora do expediente, minutos quebrados e valores inválidos.

## Pontos para defesa na banca

- **Arquitetura modular** do NestJS (módulos isolados: auth, users, appointments).
- **Validação em camadas** + constraint no banco como cinturão de segurança.
- **JWT stateless** (sem sessão no servidor).
- **Prisma** como ORM com migrações versionadas.
- **Swagger** para documentação interativa.
- **Separação de papéis** (USER vê só seus, ADMIN vê todos).

## Próximos passos sugeridos

- Notificação por email ao agendar/cancelar
- Painel administrativo para marcar como `COMPLETED`
- Feriados nacionais bloqueados via tabela `Holiday`
- Tratamento de timezone com `date-fns-tz` (atualmente assume timezone do servidor)
- Suporte a múltiplos profissionais/recursos (uma sala, um técnico etc.)
