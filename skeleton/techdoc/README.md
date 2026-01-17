# 🦙 ${{ values.name }}

> **Llama Stack Agentic AI Workflow** — An intelligent multi-agent chat application powered by LangGraph, Llama Stack, and MCP

---

## ✨ What is this?

This repository contains the source code for **${{ values.name }}**, an AI-powered chat application created from a Red Hat Developer Hub Software Template.

The application features:

| Feature | Description |
|---------|-------------|
| 🤖 **Multi-Agent Orchestration** | Specialized agents for Legal, HR, Sales, Procurement, and Tech Support |
| 📚 **RAG-Powered Responses** | Context-aware answers using FAISS vector stores |
| ☸️ **Kubernetes Integration** | Real-time cluster introspection via MCP tools |
| 🛡️ **Content Safety** | Guardrails powered by Llama Guard |
| 🐙 **GitHub Integration** | Automatic issue creation for support tickets |

---

## 📖 Documentation

For documentation about using and extending this application, see the **[docs](./docs/)** directory.

The documentation includes:
- Architecture overview
- Environment variables configuration
- Source code structure
- Deployment information

---

## 🔗 Quick Links

| Resource | Link |
|----------|------|
| 📦 **GitOps Repository** | [${{ values.repoURL }}](${{ values.repoURL }}) |
| 🎨 **Streamlit UI** | Deployed via OpenShift Route |
| 📊 **ArgoCD** | Check your ArgoCD dashboard for deployment status |

---

## 🚀 Getting Started

This application is deployed automatically via GitOps. To make changes:

1. **Modify the code** in this repository
2. **Create a Pull Request** to trigger the CI pipeline
3. **Merge** to automatically deploy via ArgoCD

---

## 🛠️ Tech Stack

- **Frontend**: Streamlit
- **AI Framework**: Llama Stack + LangGraph
- **Vector Store**: FAISS
- **Inference**: vLLM / OpenAI
- **Safety**: Ollama (Llama Guard)
- **GitOps**: ArgoCD
- **CI/CD**: Tekton Pipelines

---

## 🤝 Contribute to the Template

This application was generated from the **Llama Stack Agentic AI Workflow** Software Template.

Want to improve the template, report issues, or contribute new features? Visit the upstream repository:

👉 **[redhat-ai-dev/llama-stack-agentic-sample](https://github.com/redhat-ai-dev/llama-stack-agentic-sample)**

---

<p align="center">
  <i>Built with ❤️ using Red Hat Developer Hub</i>
</p>
