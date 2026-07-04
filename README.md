# app-ts

API REST de gerenciamento de tarefas construída com [NestJS](https://nestjs.com/) e TypeScript. Pensada para rodar em Kubernetes (local com Kind ou em qualquer cluster).

## Tecnologias

- **Node.js 20** + **TypeScript**
- **NestJS 10**
- **Swagger / OpenAPI** — documentação interativa em `/api`
- **Docker** (multi-stage build com `node:20-alpine`)
- **Kubernetes** — manifests prontos em `k8s/`

## Funcionalidades

- CRUD completo de tarefas (`/tasks`)
- Filtro de tarefas por status via query param
- Status possíveis: `PENDING`, `IN_PROGRESS`, `DONE`
- Health check em `/health`
- Documentação Swagger em `/api`

## Pré-requisitos

- Node.js 20+
- npm ou yarn

## Instalação

```bash
npm install
# ou
yarn install
```

## Executando a aplicação

```bash
# desenvolvimento
npm run start

# modo watch (hot reload)
npm run start:dev

# produção
npm run start:prod
```

A API ficará disponível em `http://localhost:3000`.  
A documentação Swagger estará em `http://localhost:3000/api`.

## Testes

```bash
# testes unitários
npm run test

# testes e2e
npm run test:e2e

# cobertura
npm run test:cov
```

## Endpoints principais

| Método | Rota          | Descrição                                      |
|--------|---------------|------------------------------------------------|
| GET    | `/tasks`      | Lista todas as tarefas (filtro por `?status=`) |
| GET    | `/tasks/:id`  | Busca tarefa por UUID                          |
| POST   | `/tasks`      | Cria nova tarefa                               |
| PATCH  | `/tasks/:id`  | Atualiza tarefa                                |
| DELETE | `/tasks/:id`  | Remove tarefa                                  |
| GET    | `/health`     | Health check                                   |

## Docker

```bash
# build da imagem
docker build -t app-ts .

# executar o container
docker run -p 3000:3000 app-ts
```

## Deploy no Kubernetes (Kind)

Consulte o guia completo em [LOCAL-KIND-DEPLOY.md](LOCAL-KIND-DEPLOY.md).

Resumo rápido:

```powershell
# criar cluster
kind create cluster --name meu-cluster --config k8s/kind.yaml

# carregar imagem no cluster
kind load docker-image app-ts:latest --name meu-cluster

# aplicar manifests
kubectl apply -f k8s/
```

## Licença

UNLICENSED
