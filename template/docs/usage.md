# **Using the Llama Stack Agentic AI Workflow Template**

This AI Software Template allows you to customize and deploy a complete agentic AI workflow system. Follow this guide to configure and use the template effectively.

## **Template Parameters**

### **Application Information**

| Parameter | Description | Required |
|-----------|-------------|----------|
| **Name** | Unique name for your application | Yes |
| **Owner** | Owner of the component in RHDH | Yes |
| **ArgoCD Namespace** | Target namespace for ArgoCD | Yes |
| **ArgoCD Instance** | ArgoCD instance name | Yes |
| **ArgoCD Project** | ArgoCD project name | Yes |

### **Model Configuration**

| Parameter | Description | Options |
|-----------|-------------|---------|
| **Inference Model** | Primary model for classification | `vllm/qwen3-8b-fp8`, `openai/gpt-4o`, custom |
| **Guardrail Model** | Content safety model | `ollama/llama-guard3:8b`, custom |
| **MCP Tool Model** | Model for tool calls | Same options as Inference Model |
| **Inference Provider** | Backend for model inference | vLLM, Ollama, OpenAI |

### **Repository Information**

| Parameter | Description | Required |
|-----------|-------------|----------|
| **Host Type** | GitHub or GitLab | Yes |
| **Repository Server** | Git server URL | Yes |
| **Repository Owner** | Organization or user | Yes |
| **Repository Name** | Name for source repo | Yes |
| **Branch** | Default branch name | Yes |

### **Deployment Information**

| Parameter | Description | Required |
|-----------|-------------|----------|
| **Image Registry** | Container registry host | Yes |
| **Image Organization** | Registry organization | Yes |
| **Image Name** | Name for container image | Yes |
| **Namespace** | Kubernetes deployment namespace | Yes |

## **Required Secrets**

Before deploying, ensure the following secrets are available in your target namespace:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: <app-name>-secrets
type: Opaque
stringData:
  # Required: OpenAI API key for embeddings
  OPENAI_API_KEY: "sk-..."
  
  # Optional: GitHub integration
  GITHUB_TOKEN: "ghp_..."
  GITHUB_URL: "https://github.com/your-org/your-repo"
  GITHUB_ID: "your-github-username"
  
  # Optional: vLLM server (if using vLLM provider)
  VLLM_URL: "https://your-vllm-server/v1"
  VLLM_API_KEY: "your-vllm-api-key"
```

!!! warning "Secret Management"
    
    For production deployments, use **Sealed Secrets** or **External Secrets Operator** 
    instead of plain Kubernetes secrets.

## **Configuring the Llama Stack Server**

The Llama Stack server is configured via the `run.yaml` ConfigMap. Key configuration sections:

### **Inference Providers**

```yaml
providers:
  inference:
  # vLLM for high-throughput inference
  - provider_id: vllm
    provider_type: remote::vllm
    config:
      url: ${env.VLLM_URL}
      api_token: ${env.VLLM_API_KEY}
      
  # Ollama for local inference
  - provider_id: ollama
    provider_type: remote::ollama
    config:
      url: http://ollama-service:11434
      
  # OpenAI for cloud inference
  - provider_id: openai
    provider_type: remote::openai
    config:
      api_key: ${env.OPENAI_API_KEY}
```

### **Vector Store Configuration**

```yaml
vector_io:
- provider_id: milvus
  provider_type: inline::milvus
  config:
    db_path: /data/milvus.db
    embedding_model: openai/text-embedding-3-small
    embedding_dimension: 1536
```

## **Configuring Document Ingestion**

The ingestion pipeline is configured via the `ingestion-config.yaml` ConfigMap:

```yaml
pipelines:
  # Add your document sources
  custom-pipeline:
    enabled: true
    name: "custom-vector-db"
    version: "1.0"
    vector_store_name: "custom-vector-db-v1-0"
    source: GITHUB
    config:
      url: "https://github.com/your-org/your-docs"
      path: "docs/knowledge-base"
      branch: "main"
```

## **MCP Server Permissions**

The Kubernetes MCP Server requires read access to cluster resources. The template creates:

- **ServiceAccount** - `<app-name>-mcp-sa`
- **ClusterRole** - `<app-name>-mcp-reader` with read-only permissions
- **ClusterRoleBinding** - Binds the role to the service account

!!! note "Cluster-Wide Access"
    
    The MCP Server has cluster-wide read access to enable cross-namespace 
    troubleshooting. Modify the ClusterRole if you need to restrict scope.

## **Post-Deployment Steps**

1. **Verify Deployments** - Check that all three pods are running:
   ```bash
   kubectl get pods -l app.kubernetes.io/part-of=<app-name>
   ```

2. **Check Llama Stack Health**:
   ```bash
   kubectl port-forward svc/<app-name>-llama-stack 8321:8321
   curl http://localhost:8321/v1/health
   ```

3. **Access the UI** - Navigate to the OpenShift Route:
   ```bash
   kubectl get route <app-name> -o jsonpath='{.spec.host}'
   ```

4. **Monitor Ingestion** - The application will automatically ingest documents on first startup

## **Git Repository Options**

!!! tip "Git Repositories"
    
    You can choose between **GitHub** and **GitLab** as your desired Source Code 
    Management (SCM) platform, and the template fields will update accordingly!

## **Troubleshooting**

### Llama Stack Not Starting

Check the ConfigMap for syntax errors:
```bash
kubectl get configmap <app-name>-llama-stack-config -o yaml
```

### MCP Server Permission Denied

Verify the ClusterRoleBinding exists:
```bash
kubectl get clusterrolebinding <app-name>-mcp-reader-binding
```

### Vector Store Errors

Check PVC is bound and has sufficient storage:
```bash
kubectl get pvc <app-name>-llama-data
```

