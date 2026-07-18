# SupportFlow

Aplicação pequena de portfólio para gerenciar solicitações de atendimento. O projeto oferece uma visão rápida dos atendimentos, busca e filtro, além do fluxo completo de criação, edição e exclusão.

## Arquitetura

O SupportFlow está dividido em duas aplicações independentes:

- **`web`**: frontend Next.js responsável pela interface, estados de carregamento/erro/lista vazia e consumo da API REST.
- **`api`**: ASP.NET Core Web API responsável pelas regras de entrada, consultas, persistência e dados iniciais.
- **PostgreSQL**: banco relacional gerenciado pelo Entity Framework Core e pelo provedor Npgsql.

O frontend se comunica por HTTP com a API. O CORS do backend aceita somente a origem local padrão do frontend (`http://localhost:3000`). Ao iniciar, a API aplica as migrations pendentes e insere seis solicitações de demonstração somente quando a tabela está vazia.

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- ASP.NET Core 10
- Entity Framework Core 10
- PostgreSQL com Npgsql

## Estrutura de pastas

```text
SupportFlow/
├── api/
│   ├── Controllers/      # Endpoints REST
│   ├── Data/             # DbContext e carga inicial
│   ├── Dtos/             # Contratos de criação, edição e dashboard
│   ├── Migrations/       # Histórico de schema do PostgreSQL
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
- PostgreSQL acessível e um banco de dados criado
- [Node.js 20.9 ou superior](https://nodejs.org/)
- npm (instalado junto com o Node.js)

## Configuração do PostgreSQL

A API exige a configuração `ConnectionStrings:DefaultConnection`. Nenhuma credencial deve ser salva em `appsettings.json`, no código ou em arquivos versionados.

### Desenvolvimento com user-secrets

Em um terminal, na pasta `api`, inicialize os segredos caso o projeto ainda não possua um `UserSecretsId` e configure a conexão:

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<CONEXAO_POSTGRESQL>"
```

O valor deve ser uma connection string PostgreSQL válida mantida somente no armazenamento local de user-secrets. Neste repositório, o `UserSecretsId` já está configurado, portanto normalmente basta executar o segundo comando.

### Produção com variável de ambiente

Defina `ConnectionStrings__DefaultConnection` no ambiente do processo ou no gerenciador de segredos da plataforma:

```bash
ConnectionStrings__DefaultConnection="<CONEXAO_POSTGRESQL>" dotnet SupportFlow.Api.dll
```

Substitua apenas o marcador no ambiente seguro de implantação; não registre o valor real no repositório ou nos logs.

## Como executar o backend

Em um terminal, a partir da raiz do projeto:

```bash
cd api
dotnet restore
dotnet ef database update
dotnet run
```

A API ficará disponível em `http://localhost:5073`. O `dotnet run` também aplica automaticamente migrations pendentes e insere os seis registros de demonstração apenas se a tabela estiver vazia.

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
| `GET` | `/health` | Verifica a disponibilidade da API |
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

O projeto não possui autenticação, Redux, microfrontends ou serviços externos. A interface usa apenas React e Tailwind CSS, enquanto a API usa os componentes necessários do ASP.NET Core, Entity Framework Core e PostgreSQL.
