# Deploy Local com Docker + Kind

Este guia documenta como buildar uma imagem Docker localmente e deployar no cluster Kind sem precisar de um registry externo (Docker Hub, ECR, etc.).

---

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) instalado e rodando
- [Kind](https://kind.sigs.k8s.io/docs/user/quick-start/#installation) instalado
- [kubectl](https://kubernetes.io/docs/tasks/tools/) instalado

---

## Visão Geral do Fluxo

```
Dockerfile → docker build → imagem local → kind load → cluster Kind → kubectl apply → Pod rodando
```

---

## Passo a Passo

### 1. Criar o cluster Kind (se ainda não existir)

```powershell
kind create cluster --name meu-cluster --config kind.yaml
```

Verificar clusters existentes:
```powershell
kind get clusters
```

---

### 2. Build da imagem Docker local

Dentro da pasta `app-ts/` (onde está o `Dockerfile`):

```powershell
docker build -t app-ts .
```

> A tag `app-ts` sem versão usa `latest` por padrão, ou seja, a imagem fica como `app-ts:latest`.

Verificar se a imagem foi criada:
```powershell
docker images | Select-String "app-ts"
```

---

### 3. Carregar a imagem no cluster Kind

O Kind roda em containers Docker isolados. Por isso, a imagem local do seu Docker **não está automaticamente disponível** dentro do cluster — é preciso carregá-la explicitamente:

```powershell
kind load docker-image app-ts:latest --name meu-cluster
```

> Substitua `meu-cluster` pelo nome retornado em `kind get clusters`.

Confirmar que a imagem foi carregada:
```powershell
kubectl get nodes -o wide
docker exec -it meu-cluster-control-plane crictl images | Select-String "app-ts"
```

---

### 4. Aplicar os manifests no Kubernetes

```powershell
# A partir da pasta raiz do projeto
kubectl apply -f app-ts/k8s/configmap.yaml
kubectl apply -f app-ts/k8s/ --recursive
```

Ou aplicar tudo de uma vez:
```powershell
kubectl apply -f app-ts/k8s/
```

---

### 5. Verificar o deploy

```powershell
# Ver os pods criados
kubectl get pods

# Detalhes de um pod específico (útil para debug)
kubectl describe pod <nome-do-pod>

# Logs do container
kubectl logs <nome-do-pod>

# Ver o deployment
kubectl get deployment app-ts
```

---

## Configuração no deployment.yaml

O `deployment.yaml` está configurado para usar a imagem local:

```yaml
containers:
  - name: app-ts
    image: app-ts:latest       # nome da imagem buildada localmente
    imagePullPolicy: Never     # NUNCA tenta baixar do registry — apenas local
```

### Diferença entre as políticas de pull

| `imagePullPolicy` | Comportamento |
|-------------------|---------------|
| `Always`          | Sempre tenta baixar do registry (ignora cache local) |
| `IfNotPresent`    | Usa local se existir, caso contrário baixa do registry |
| `Never`           | **Apenas imagem local** — falha se não estiver carregada no Kind |

> Para desenvolvimento local com Kind, use sempre `Never` para garantir que o Kubernetes use exatamente a imagem que você buildou.

---

## Rebuild e Redeploy (ciclo de desenvolvimento)

Sempre que alterar o código, repita:

```powershell
# 1. Rebuild da imagem
docker build -t app-ts .

# 2. Recarregar no Kind
kind load docker-image app-ts:latest --name meu-cluster

# 3. Forçar o Kubernetes a recriar os pods com a nova imagem
kubectl rollout restart deployment app-ts

# 4. Acompanhar o rollout
kubectl rollout status deployment app-ts
```

---

## Troubleshooting

### Pod com status `ErrImageNeverPull`
A imagem não foi carregada no Kind. Execute:
```powershell
kind load docker-image app-ts:latest --name meu-cluster
```

### Pod com status `ImagePullBackOff`
O `imagePullPolicy` provavelmente está como `Always` ou `IfNotPresent` sem a imagem disponível. Verifique o `deployment.yaml`.

### Ver eventos do pod para diagnóstico
```powershell
kubectl describe pod <nome-do-pod>
# Procure a seção "Events" no final da saída
```

### Listar imagens disponíveis dentro do nó Kind
```powershell
docker exec -it meu-cluster-control-plane crictl images
```
