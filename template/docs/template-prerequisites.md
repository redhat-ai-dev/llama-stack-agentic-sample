# **Llama Stack Agentic Template Prerequisites**

Before using this Software Template, ensure your environment meets the following requirements.

## **Cluster Requirements**

### **OpenShift/Kubernetes Version**

- OpenShift 4.12+ or Kubernetes 1.25+
- Cluster admin access (for ClusterRole creation)

### **Required Operators**

| Operator | Purpose | Required |
|----------|---------|----------|
| **OpenShift GitOps (ArgoCD)** | GitOps deployment | Yes |
| **Red Hat OpenShift Pipelines** | CI/CD pipelines | Yes |

### **Resource Requirements**

The template deploys three services with the following minimum requirements:

| Component | CPU Request | Memory Request | CPU Limit | Memory Limit |
|-----------|-------------|----------------|-----------|--------------|
| Streamlit UI | 250m | 512Mi | 1000m | 2Gi |
| Llama Stack | 500m | 1Gi | 2000m | 4Gi |
| MCP Server | 100m | 128Mi | 500m | 512Mi |

**Total Minimum**: 850m CPU, 1.6Gi Memory

### **Storage Requirements**

- **10Gi PersistentVolumeClaim** for Llama Stack data (vector DBs, SQLite stores)
- Storage class with `ReadWriteOnce` access mode

## **External Dependencies**

### **OpenAI API Key** (Required)

An OpenAI API key is required for text embeddings (`text-embedding-3-small` model).

1. Create an account at [platform.openai.com](https://platform.openai.com)
2. Generate an API key from the API Keys section
3. Store the key securely for deployment

!!! warning "API Costs"
    
    The embedding model incurs costs per token. Monitor your usage through 
    the OpenAI dashboard.

### **Inference Model Provider** (Choose One)

#### Option 1: vLLM (Recommended for Production)

- Requires NVIDIA GPU nodes (compute capability 7.0+)
- Deploy vLLM serving a model like `ibm-granite/granite-3.1-8b-instruct`
- Requires model endpoint URL and API key

#### Option 2: Ollama (Development)

- Deploy Ollama in-cluster or on a connected machine
- Pull required models: `ollama pull llama-guard3:1b`
- No GPU required for smaller models

#### Option 3: OpenAI API

- Use your existing OpenAI API key
- Models like `gpt-4o` or `gpt-4o-mini` work well
- Higher latency due to network calls

### **GitHub/GitLab Access**

For the Git Agent functionality:

- **GitHub Personal Access Token** with `repo` and `issues` scopes
- Target repository for issue creation
- GitHub username for issue assignment

## **Red Hat Developer Hub Configuration**

### **ArgoCD Configuration**

Ensure your RHDH instance has ArgoCD integration configured:

```yaml
argocd:
  instances:
    - name: default
      url: https://argocd.example.com
      appLocatorMethods:
        - type: config
```

### **GitHub/GitLab Integration**

Configure your SCM integration in RHDH:

```yaml
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}
  gitlab:
    - host: gitlab.com
      token: ${GITLAB_TOKEN}
```

## **Network Requirements**

### **Outbound Access**

The following external endpoints must be accessible:

| Endpoint | Purpose |
|----------|---------|
| `api.openai.com` | Text embeddings |
| `huggingface.co` | Model downloads (if using HF models) |
| `github.com` or `gitlab.com` | Document ingestion, issue creation |

### **Internal Communication**

Services communicate internally:

```
Streamlit UI (8501) → Llama Stack (8321)
Llama Stack (8321) → MCP Server (8080)
MCP Server (8080) → Kubernetes API (443)
```

## **Pre-Deployment Checklist**

- [ ] OpenShift GitOps operator installed
- [ ] OpenShift Pipelines operator installed
- [ ] ArgoCD instance configured in RHDH
- [ ] GitHub/GitLab integration configured
- [ ] Container registry access configured (e.g., Quay.io)
- [ ] OpenAI API key obtained
- [ ] Inference model provider decided (vLLM/Ollama/OpenAI)
- [ ] Target namespace created (or use template default)
- [ ] Storage class available for PVC creation
- [ ] Cluster admin access for ClusterRole creation

## **GPU Considerations**

If using vLLM for inference:

- Node pools with NVIDIA GPUs (A100, A10G, T4, or similar)
- NVIDIA GPU Operator installed
- At least 16GB GPU memory for 8B parameter models
- Tolerations configured for GPU nodes

