# 📦 ${{ values.name }}-gitops

> **GitOps Repository** — Kubernetes manifests and ArgoCD configuration for the Llama Stack Agentic AI Workflow

---

## ✨ What is this?

This repository contains the GitOps deployment manifests for **${{ values.name }}**. These Kubernetes manifests define all the resources needed to deploy the application to your OpenShift/Kubernetes cluster via ArgoCD.

---

## 📁 Repository Structure

| Directory | Description |
|-----------|-------------|
| 📂 **app-of-apps/** | ArgoCD Application definitions for orchestrating deployments |
| 📂 **components/${{ values.name }}/** | Kustomize base and overlays for all Kubernetes resources |
| 📄 **application.yaml** | Root ArgoCD Application manifest |
| 📄 **catalog-info.yaml** | Backstage/RHDH catalog entity definition |

### Components Structure

```
components/${{ values.name }}/
├── base/                      # Base Kubernetes manifests
│   ├── deployment.yaml        # Streamlit UI deployment
│   ├── deployment-llama-stack.yaml
│   ├── deployment-ollama.yaml
│   ├── deployment-mcp-server.yaml
│   ├── service*.yaml          # Service definitions
│   ├── route.yaml             # OpenShift Route
│   ├── configmap-*.yaml       # Configuration
│   ├── rbac-mcp-server.yaml   # RBAC for MCP Server
│   ├── pvc-ollama.yaml        # Persistent storage for Ollama
│   └── initialize-namespace/  # Tekton pipeline setup
├── overlays/
│   ├── development/           # Development environment patches
│   └── tekton/                # Tekton-specific configuration
└── edit/                      # Scripts for image/replica updates
```

---

## 🚀 Deployed Resources

This GitOps repository deploys the following resources:

| Resource | Name | Description |
|----------|------|-------------|
| 🖥️ **Deployment** | `${{ values.name }}` | Streamlit UI application |
| 🦙 **Deployment** | `${{ values.name }}-llama-stack` | Llama Stack inference server |
| 🦙 **Deployment** | `${{ values.name }}-ollama` | Ollama for safety/guardrails |
| ☸️ **Deployment** | `${{ values.name }}-mcp-server` | Kubernetes MCP Server |
| 🌐 **Services** | Various | Internal service networking |
| 🔀 **Route** | `${{ values.name }}` | External access to Streamlit UI |
| 🔐 **RBAC** | `${{ values.name }}-mcp-*` | Permissions for cluster introspection |
| 💾 **PVC** | `${{ values.name }}-ollama-data` | Persistent storage for Ollama models |

---

## 🔄 How to Deploy Changes

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   This Repo     │────▶│     ArgoCD      │────▶│    Cluster      │
│   (GitOps)      │     │  (Manual Sync)  │     │  (Deployment)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Push changes** to this repository
2. **Navigate to ArgoCD** dashboard
3. **Sync** the application manually to apply changes
4. **Application updated** on the cluster

---

## 🔗 Quick Links

| Resource | Link |
|----------|------|
| 📝 **Source Repository** | [${{ values.srcRepoURL }}](${{ values.srcRepoURL }}) |
| 🎨 **Streamlit UI** | Deployed via OpenShift Route |
| 📊 **ArgoCD** | Check your ArgoCD dashboard for sync status |

---

## 🤝 Contribute to the Template

This GitOps repository was generated from the **Llama Stack Agentic AI Workflow** Software Template.

Want to improve the template, report issues, or contribute new features? Visit the upstream repository:

👉 **[redhat-ai-dev/llama-stack-agentic-sample](https://github.com/redhat-ai-dev/llama-stack-agentic-sample)**

---

<p align="center">
  <i>Built with ❤️ using Red Hat Developer Hub</i>
</p>
