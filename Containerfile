# Llama Stack Agentic Application Container
# This Containerfile builds a multi-service container for the agentic AI workflow

FROM registry.access.redhat.com/ubi9/python-312:latest

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_SYSTEM_PYTHON=1 \
    UV_COMPILE_BYTECODE=1

# Install system dependencies and uv
USER root
RUN pip install --no-cache-dir uv

# Create application directory
WORKDIR /app

# Copy dependency files first for better caching
COPY pyproject.toml uv.lock ./

# Install Python dependencies using uv
RUN uv sync --frozen --no-dev

# Copy application source code
COPY src/ ./src/
COPY streamlit_app.py ./
COPY config/ ./config/
COPY rag_file_metadata.json ./

# Create directories for Llama Stack data persistence
RUN mkdir -p /app/.llama /app/files && \
    chgrp -R 0 /app && \
    chmod -R g=u /app

# Expose port for Streamlit UI
EXPOSE 8501

# Default entrypoint runs the Streamlit app
# Override with appropriate command for Llama Stack or MCP server deployments
USER 1001
ENTRYPOINT ["uv", "run", "streamlit", "run", "streamlit_app.py", "--server.address=0.0.0.0"]

