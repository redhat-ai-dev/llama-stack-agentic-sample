# **Introduction**

Congratulations! You deployed a **Llama Stack Agentic AI Workflow** application from a Software Template. The template has created a new source code repository for the application code, as well as a new GitOps deployment repository to handle deployment related tasks.

!!! info

    **Source Code Repository:** [${{ values.srcRepoURL }}](${{ values.srcRepoURL }})

    **GitOps Repository:** [${{ values.repoURL }}](${{ values.repoURL }})

# **What This Application Does**

The Llama Stack Agentic application is an intelligent "developer portal" chat interface that:

1. **Classifies User Questions** - Dynamically routes queries to specialized AI Agents
2. **Multi-Agent Orchestration** - Employs specialized agents for:
   - **Legal** - License and compliance questions
   - **HR** - Human resources queries
   - **Sales** - Business development questions
   - **Procurement** - Vendor and supply chain queries
   - **Tech Support** - Kubernetes troubleshooting with cluster integration
3. **RAG-Powered Responses** - Uses vector databases for accurate, context-aware answers
4. **Content Safety** - Implements guardrails using Llama Guard

# **Usage**

To access the ${{ values.name }} application that was deployed using the Software Template, complete the following instructions:

!!! tip

    All of this information can be found as part of your deployed **Component** in the Red Hat Developer Hub (RHDH) UI!

You can view the Topology of deployed resources by navigating to the **Topology** tab in your RHDH ribbon:

![Topology Ribbon](./images/topology-ribbon.png)

From that view, to navigate straight to your sample application, you can click the arrow on the resource of the application.

![Topology View Application Link](./images/topology-app-link.png)

!!! info

    If you are met with a placeholder web page your application may still be building and has not yet been deployed! You can verify this by checking the **CI** tab to see if all related pipeline tasks have completed.

# **Architecture Components**

This template deploys three interconnected services:

| Component | Port | Description |
|-----------|------|-------------|
| **Streamlit UI** | 8501 | Interactive chat interface |
| **Llama Stack Server** | 8321 | AI inference orchestration |
| **Kubernetes MCP Server** | 8080 | Cluster introspection tools |

# **Environment Variables**

The application uses the following configuration:

| Variable | Description |
|----------|-------------|
| `INFERENCE_MODEL` | Model for classification: `${{ values.inferenceModel }}` |
| `GUARDRAIL_MODEL` | Content safety model: `${{ values.guardrailModel }}` |
| `MCP_TOOL_MODEL` | Model for tool calls: `${{ values.mcpToolModel }}` |
| `OPENAI_API_KEY` | Required for text embeddings |
| `GITHUB_TOKEN` | GitHub integration (optional) |
| `GITHUB_URL` | Issue creation repo (optional) |

# **Deployment Information**

If you are interested in seeing the deployed Kubernetes resources, all resources were deployed into your chosen namespace of ${{ values.namespace }}. You can access this namespace through the web console or via your CLI.

!!! tip

    You can also login to your ArgoCD server to see the Argo view for deployed resources, such as your application itself!

