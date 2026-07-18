# SupportFlow

Aplicação pequena de portfólio para gerenciar solicitações de atendimento. O projeto oferece uma visão rápida dos atendimentos, busca e filtro, além do fluxo completo de criação, edição e exclusão.

## Arquitetura

O SupportFlow está dividido em duas aplicações independentes:

- **`web`**: frontend Next.js responsável pela interface, estados de carregamento/erro/lista vazia e consumo da API REST.
- **`api`**: ASP.NET Core Web API responsável pelas regras de entrada, consultas, persistência e dados iniciais.
- **SQLite**: banco local criado automaticamente na primeira execução da API por meio do Entity Framework Core.

O frontend se comunica por HTTP com a API. O CORS do backend aceita somente a origem local padrão do frontend (`http://localhost:3000`).

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- ASP.NET Core 10
- Entity Framework Core 10
- SQLite

## Estrutura de pastas

```text
SupportFlow/
├── api/
│   ├── Controllers/      # Endpoints REST
│   ├── Data/             # DbContext e carga inicial
│   ├── Dtos/             # Contratos de criação, edição e dashboard
│   ├── Models/           # Entidade e enums
│   ├── Properties/       # Configuração local de execução
│   └── Program.cs        # Serviços e pipeline da aplicação
├── web/
│   ├── app/              # Layout, página e estilos globais
│   ├── components/       # Componentes visuais e modais
│   ├── services/         # Cliente da API REST
│   └── types/            # Tipos compartilhados no frontend
├── .gitignore
└── README.md
```

## Pré-requisitos

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Node.js 20.9 ou superior](https://nodejs.org/)
- npm (instalado junto com o Node.js)

## Como executar o backend

Em um terminal, a partir da raiz do projeto:

```bash
cd api
dotnet restore
dotnet run
```

A API ficará disponível em `http://localhost:5073`. O arquivo `supportflow.db` será criado dentro de `api` e receberá seis solicitações de demonstração apenas quando o banco estiver vazio.

## Como executar o frontend

Em outro terminal, a partir da raiz do projeto:

```bash
cd web
npm install
npm run dev
```

Abra `http://localhost:3000` no navegador.

Por padrão, o frontend usa `http://localhost:5073/api`. Para usar outra URL, copie `web/.env.example` para `web/.env.local` e altere `NEXT_PUBLIC_API_URL`.

## Builds de produção

```bash
cd api
dotnet build
```

```bash
cd web
npm run build
npm run start
```

## Endpoints da API

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `GET` | `/api/dashboard` | Retorna os totais por status |
| `GET` | `/api/requests` | Lista as solicitações |
| `GET` | `/api/requests?search=texto` | Busca solicitações pelo título |
| `GET` | `/api/requests?status=Open` | Filtra por `Open`, `InProgress` ou `Completed` |
| `GET` | `/api/requests/{id}` | Retorna uma solicitação |
| `POST` | `/api/requests` | Cria uma solicitação |
| `PUT` | `/api/requests/{id}` | Atualiza uma solicitação |
| `DELETE` | `/api/requests/{id}` | Exclui uma solicitação |

### Corpo de criação e edição

```json
{
  "title": "Erro ao acessar o sistema",
  "description": "A página inicial não carrega para o usuário.",
  "status": "Open",
  "priority": "High"
}
```

Valores aceitos:

- `status`: `Open`, `InProgress`, `Completed`
- `priority`: `Low`, `Medium`, `High`

## Decisões de escopo

O projeto não possui autenticação, Redux, microfrontends ou serviços externos. A interface usa apenas React e Tailwind CSS, enquanto a API usa somente os componentes necessários do ASP.NET Core, Entity Framework Core e SQLite.
