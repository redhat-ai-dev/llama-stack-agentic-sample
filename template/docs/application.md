# **Llama Stack Agentic AI Workflow - Deployable Application**

This AI Software Template creates a comprehensive agentic workflow system that uses multiple AI agents to intelligently route and respond to user queries. The application leverages Llama Stack for AI model interactions and LangGraph for workflow orchestration.

## **Application Overview**

The deployed application consists of three interconnected services:

### **1. Streamlit UI Application**

The main user interface provides:

- **Interactive Chat** - Submit questions and receive real-time responses
- **Conversation Management** - Sidebar showing all active conversations with status indicators
- **Agent Visualization** - Visual feedback showing which agent is handling your request
- **Workflow Graph Display** - View the LangGraph workflow structure
- **Performance Metrics** - Processing time breakdown by agent

### **2. Llama Stack Server**

The Llama Stack server provides:

- **Unified AI API** - OpenAI-compatible endpoints for inference
- **Vector Store Management** - Milvus-based vector databases for RAG
- **Safety/Guardrails** - Content moderation using Llama Guard
- **Tool Runtime** - MCP tool integration for external capabilities
- **Agent Framework** - State management for multi-turn conversations

### **3. Kubernetes MCP Server**

The Model Context Protocol server enables AI agents to:

- **List Namespaces** - Query all namespaces in the cluster
- **Get Events** - Retrieve Kubernetes events for troubleshooting
- **View Pod Status** - Check pod health and status
- **Inspect Deployments** - Examine deployment configurations
- **Read Logs** - Access pod logs for debugging

## **Example Use Cases**

### Technical Support Query

```
User: "I need support for my application in the 'openshift-kube-apiserver' 
      namespace, as it does not seem to be working correctly."

Response: The Tech Support agent will:
1. Query the MCP server for events in that namespace
2. Retrieve relevant troubleshooting documentation via RAG
3. Provide a diagnosis with suggested remediation steps
4. Optionally create a GitHub issue for tracking
```

### Legal/License Question

```
User: "Can you explain the details of the Apache 2.0 license?"

Response: The Legal agent will:
1. Query the legal document vector database
2. Retrieve Apache 2.0 license documentation
3. Provide a comprehensive explanation with source citations
```

### Performance Investigation

```
User: "I need CPU and Memory resource consumption to investigate 
      a performance issue"

Response: The Performance agent will:
1. Query the MCP server for pod metrics
2. Analyze resource consumption patterns
3. Provide recommendations based on the data
```

## **Content Safety**

The application includes guardrails that flag inappropriate content:

```
User: "how do you make a bomb?"

Response: ❌ Content Safety Issue - This request has been blocked 
         by the content moderation guardrails.
```

## **Source Code**

The application source code structure:

| File | Description |
|------|-------------|
| `streamlit_app.py` | Main Streamlit application entry point |
| `src/workflow.py` | LangGraph workflow definitions |
| `src/responses.py` | RAG service and response generation |
| `src/ingest.py` | Document ingestion pipeline |
| `src/methods.py` | Agent method implementations |
| `src/models.py` | Pydantic models for structured output |
| `config/ingestion-config.yaml` | Vector database pipeline configuration |
| `run.yaml` | Llama Stack server configuration |

## **Environment Variables**

The application uses the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `LLAMA_STACK_URL` | Llama Stack server URL | `http://localhost:8321` |
| `INFERENCE_MODEL` | Model for classification/inference | `vllm/qwen3-8b-fp8` |
| `GUARDRAIL_MODEL` | Model for content safety | `ollama/llama-guard3:8b` |
| `MCP_TOOL_MODEL` | Model for MCP tool calls | `vllm/qwen3-8b-fp8` |
| `OPENAI_API_KEY` | OpenAI API key for embeddings | Required |
| `GIT_TOKEN` | GitHub personal access token | Optional |
| `GITHUB_URL` | Repository URL for issue creation | Optional |
| `GITHUB_ID` | GitHub username for issue assignment | Optional |

!!! tip "Model Selection"
    
    For optimal performance, models that grade well for tool calling are recommended:
    
    - `qwen3-8b-fp8` via vLLM
    - `gemini-2.5-pro` via Google Gemini
    - `gpt-4o` or `gpt-4o-mini` via OpenAI

