# **Llama Stack Agentic AI Workflow - Software Template Overview**

This Software Template deploys a sophisticated **AI Agentic Workflow** application that provides an intelligent chat interface for dynamic, stateful workflow orchestration using both **LangGraph** and **Llama Stack**.

## **What This Application Does**

The Llama Stack Agentic application serves as a prototype "developer portal" chat interface that:

1. **Classifies User Questions** - Takes incoming questions and dynamically routes them to specialized AI Agents based on the content and intent of the prompt
2. **Multi-Agent Orchestration** - Employs multiple specialized agents for different domains:
   - **Legal Agent** - Handles license and legal compliance questions
   - **HR Agent** - Processes human resources related queries
   - **Sales Agent** - Addresses sales and business development questions
   - **Procurement Agent** - Manages procurement and vendor queries
   - **Tech Support Agent** - Handles technical support issues with Kubernetes integration
3. **RAG-Powered Responses** - Uses Retrieval-Augmented Generation (RAG) with vector databases to provide accurate, context-aware responses
4. **Kubernetes Integration** - Includes a Kubernetes MCP (Model Context Protocol) server that allows AI agents to query cluster state, list namespaces, get events, and diagnose application issues
5. **Content Safety** - Implements guardrails using Llama Guard for content moderation

## **Architecture Components**

This template deploys three main components:

| Component | Description | Port |
|-----------|-------------|------|
| **Streamlit UI** | Interactive chat interface for users | 8501 |
| **Llama Stack Server** | AI inference orchestration server | 8321 |
| **Kubernetes MCP Server** | Tool server for Kubernetes operations | 8080 |

![Architecture Overview](./images/llama-stack-agentic.png)

## **Key Features**

- **Real-time Chat Interface** - Built with Streamlit for immediate feedback during processing
- **Concurrent Conversations** - Track and manage multiple concurrent conversations
- **Visual Workflow Tracking** - See which agents handle your requests with visual indicators
- **Performance Metrics** - View processing times for each agent and RAG queries
- **Source Attribution** - Expandable sections showing RAG document sources

## **Model Server Options**

The template supports multiple inference providers through Llama Stack:

- **vLLM** - High-throughput GPU-accelerated inference (requires NVIDIA GPUs)
- **Ollama** - Local model inference for development
- **OpenAI** - Cloud-based inference using OpenAI's API
- **Bring Your Own** - Connect to any OpenAI-compatible endpoint

## **Additional Resources**

- [The Deployable Application](./application.md)
- [Using the Llama Stack Agentic Template](./usage.md)
- [Template Prerequisites](./template-prerequisites.md)
- [Remote Cluster Configuration](./template-remote-cluster.md)

