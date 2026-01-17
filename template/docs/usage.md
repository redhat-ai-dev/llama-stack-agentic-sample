# **Using the Llama Stack Agentic AI Workflow Template**

This AI Software Template allows you to customize and deploy a complete agentic AI workflow system. Follow this guide to configure and use the template effectively.

## **Template Parameters**

### **Application Information**

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| **Name** | Unique name for your application | - | Yes |
| **Owner** | Owner of the component in RHDH | `user:guest` | Yes |
| **ArgoCD Namespace** | Target namespace for ArgoCD | `openshift-gitops` | Yes |
| **ArgoCD Instance** | ArgoCD instance name | `default` | Yes |
| **ArgoCD Project** | ArgoCD project name | `default` | Yes |
| **Include ArgoCD App Label** | Include a user provided ArgoCD Application Label | `true` | No |
| **ArgoCD Application Label** | Label RHDH uses to identify ArgoCD Applications | `rolling-demo` | Conditional |

### **Llama Stack Configuration**

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| **vLLM Server URL** | URL of the vLLM inference server endpoint | - | Yes |
| **Safety Model** | Model for content safety guardrails | `ollama/llama-guard3:8b` | No |
| **Llama Stack Secrets Name** | Kubernetes Secret name containing `VLLM_API_KEY` and `OPENAI_API_KEY` | `llama-stack-secrets` | Yes |

### **Application Configuration**

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| **Inference Model** | Model ID for classification and inference | `vllm/redhataiqwen3-8b-fp8-dynamic` | Yes |
| **MCP Tool Model** | Model for MCP Kubernetes tool calls (must support function calling) | `vllm/redhataiqwen3-8b-fp8-dynamic` | Yes |
| **GitHub Repository URL** | GitHub repository URL for issue creation and comments | - | Yes |
| **Application Secrets Name** | Kubernetes Secret name containing `GITHUB_TOKEN` | `app-secrets` | Yes |

!!! tip "Model Selection"
    
    For optimal performance, models that grade well for tool calling are recommended:
    
    - `redhataiqwen3-8b-fp8-dynamic` via vLLM
    - `gpt-4o` or `gpt-4o-mini` via OpenAI

### **Repository Information**

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| **Host Type** | GitHub or GitLab | `GitHub` | Yes |
| **Repository Server** | Git server URL | `github.com` or `gitlab.com` | Yes |
| **Repository Owner** | Organization or user | - | Yes |
| **Repository Name** | Name for source repo | - | Yes |
| **Branch** | Default branch name | `main` | Yes |

### **Deployment Information**

| Parameter | Description | Default | Required |
|-----------|-------------|---------|----------|
| **Image Registry** | Container registry host | `quay.io` | Yes |
| **Image Organization** | Registry organization | - | Yes |
| **Image Name** | Name for container image | - | Yes |
| **Namespace** | Kubernetes namespace for deployment | `rhdh-app` | Yes |
| **CI/CD Credentials Secret Name** | Secret containing pipeline credentials | `cicd-credentials` | Yes |
| **Deploy on Remote Cluster** | Deploy to a remote cluster | `false` | No |
| **Remote Cluster API URL** | Kube API URL of remote cluster | - | Conditional |
| **Remote Cluster Namespace** | Namespace on remote cluster | - | Conditional |

## **Required Secrets**

Before deploying, you need to create the following secrets in your target namespace:

### **Llama Stack Secrets**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: llama-stack-secrets  # Must match "Llama Stack Secrets Name" parameter
type: Opaque
stringData:
  VLLM_API_KEY: "<your-vllm-api-key>"
  OPENAI_API_KEY: "<your-openai-api-key>"
```

### **Application Secrets**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets  # Must match "Application Secrets Name" parameter
type: Opaque
stringData:
  GITHUB_TOKEN: "<your-github-personal-access-token>"
```

### **CI/CD Credentials**

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: cicd-credentials  # Must match "CI/CD Credentials Secret Name" parameter
type: Opaque
stringData:
  GIT_TOKEN: "<github-or-gitlab-pat>"
  GITLAB_TOKEN: "<gitlab-pat>"  # Only if using GitLab
  WEBHOOK_SECRET: "<pipelines-as-code-webhook-secret>"
  QUAY_DOCKERCONFIGJSON: "<base64-encoded-docker-config>"
```

!!! warning "Secret Management"
    
    For production deployments, use **Sealed Secrets** or **External Secrets Operator** 
    instead of plain Kubernetes secrets.

## **MCP Server Permissions**

The Kubernetes MCP Server requires read access to cluster resources. The template creates:

- **ServiceAccount** - `<app-name>-mcp-sa`
- **ClusterRole** - `<app-name>-mcp-reader` with read-only permissions
- **ClusterRoleBinding** - Binds the role to the service account

!!! note "Cluster-Wide Access"
    
    The MCP Server has cluster-wide read access to enable cross-namespace 
    troubleshooting. Modify the ClusterRole if you need to restrict scope.

## **Post-Deployment Steps**

1. **Verify Deployments** - Check that all four pods are running:
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

Check the ConfigMap and Secret are correctly configured:
```bash
kubectl get configmap <app-name>-llama-stack-env -o yaml
kubectl get secret llama-stack-secrets
```

### MCP Server Permission Denied

Verify the ClusterRoleBinding exists:
```bash
kubectl get clusterrolebinding <app-name>-mcp-reader-binding
```

### Ollama Model Not Loaded

Check the Ollama pod logs and verify the safety model was pulled:
```bash
kubectl logs deployment/<app-name>-ollama -c pull-safety-model
kubectl logs deployment/<app-name>-ollama -c ollama
```

### Vector Store Errors

Check the Ollama PVC is bound (Llama Stack uses ephemeral storage):
```bash
kubectl get pvc <app-name>-ollama-data
```
