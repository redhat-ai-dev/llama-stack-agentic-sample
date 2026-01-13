# **Remote Cluster Configuration for Llama Stack Agentic**

This guide covers deploying the Llama Stack Agentic application to a remote OpenShift cluster separate from your Red Hat Developer Hub instance.

## **Overview**

Remote cluster deployment allows you to:

- Separate development/staging from production workloads
- Deploy to clusters with GPU resources for inference
- Isolate AI workloads with specific security requirements
- Scale AI infrastructure independently

## **Prerequisites**

### **Remote Cluster Requirements**

1. **ArgoCD Access** - The remote cluster must be registered with your ArgoCD instance
2. **Secrets** - Required secrets must be pre-created in the target namespace
3. **RBAC** - Cluster admin access for creating ClusterRoles

### **RHDH Configuration**

Your Red Hat Developer Hub must have the remote cluster configured:

```yaml
argocd:
  instances:
    - name: default
      url: https://argocd.example.com
      appLocatorMethods:
        - type: config
```

## **Template Configuration**

When using the template, enable remote cluster deployment:

1. Set **Deploy ArgoCD Application on Remote Cluster** to `true`
2. Provide the **Remote Cluster API URL** (e.g., `https://api.remote-cluster.example.com:6443`)
3. Specify the **Remote Cluster Deployment Namespace**

## **Pre-Creating Secrets**

Before running the template, create secrets on the remote cluster:

```bash
# Connect to remote cluster
oc login https://api.remote-cluster.example.com:6443

# Create namespace if needed
oc new-project <your-namespace>

# Create secrets
oc create secret generic <app-name>-secrets \
  --from-literal=OPENAI_API_KEY="sk-..." \
  --from-literal=GITHUB_TOKEN="ghp_..." \
  --from-literal=GITHUB_URL="https://github.com/org/repo" \
  --from-literal=GITHUB_ID="username"
```

!!! tip "Sealed Secrets"
    
    For production, use Sealed Secrets:
    
    ```bash
    kubeseal --format yaml < secret.yaml > sealed-secret.yaml
    ```

## **RBAC for MCP Server**

The MCP Server requires cluster-wide read access. On the remote cluster:

```bash
# The template creates these automatically, but verify they exist:
oc get clusterrole <app-name>-mcp-reader
oc get clusterrolebinding <app-name>-mcp-reader-binding
```

If deploying manually, apply the RBAC resources:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: <app-name>-mcp-reader
rules:
  - apiGroups: [""]
    resources: ["namespaces", "pods", "events", "services"]
    verbs: ["get", "list", "watch"]
  - apiGroups: ["apps"]
    resources: ["deployments", "replicasets"]
    verbs: ["get", "list", "watch"]
```

## **Network Considerations**

### **Ingress Configuration**

The Streamlit UI route will be created on the remote cluster:

```bash
# Get the route URL
oc get route <app-name> -n <namespace> -o jsonpath='{.spec.host}'
```

### **Cross-Cluster Communication**

If Llama Stack needs to communicate with services on another cluster:

1. Use service mesh (Istio/OpenShift Service Mesh)
2. Configure external endpoints in the ConfigMap
3. Ensure firewall rules allow traffic

## **Storage Configuration**

Remote clusters may have different storage classes:

```yaml
# Verify available storage classes
oc get storageclass

# Update the PVC if needed
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: <app-name>-llama-data
spec:
  storageClassName: gp3  # Adjust for your cluster
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
```

## **GPU Scheduling on Remote Cluster**

If the remote cluster has GPU nodes for vLLM:

1. Verify GPU nodes are available:
   ```bash
   oc get nodes -l nvidia.com/gpu.present=true
   ```

2. Check GPU operator is installed:
   ```bash
   oc get pods -n nvidia-gpu-operator
   ```

3. The vLLM deployment (if enabled) will include GPU tolerations automatically

## **Monitoring Remote Deployments**

### **From RHDH**

Use the Topology view to monitor deployments:

1. Navigate to your component in RHDH
2. Click the **Topology** tab
3. View all deployed resources and their status

### **From ArgoCD**

Access the ArgoCD dashboard:

```bash
# Get ArgoCD route
oc get route -n openshift-gitops

# View sync status
argocd app get <app-name>-app-of-apps
```

### **From Remote Cluster**

```bash
# Check all pods
oc get pods -l app.kubernetes.io/part-of=<app-name>

# Check logs
oc logs -l app.kubernetes.io/component=streamlit-ui
oc logs -l app.kubernetes.io/component=llama-stack
oc logs -l app.kubernetes.io/component=mcp-server
```

## **Troubleshooting Remote Deployments**

### **ArgoCD Sync Failures**

```bash
# Check ArgoCD application status
argocd app get <app-name>-app-of-apps

# Force sync
argocd app sync <app-name>-app-of-apps
```

### **Secret Not Found**

Ensure secrets exist before ArgoCD sync:

```bash
oc get secret <app-name>-secrets -n <namespace>
```

### **RBAC Permission Denied**

Check the ClusterRoleBinding:

```bash
oc get clusterrolebinding <app-name>-mcp-reader-binding -o yaml
```

Verify the namespace in the binding matches your deployment namespace.

## **Cleanup**

To remove the deployment from the remote cluster:

```bash
# Delete via ArgoCD
argocd app delete <app-name>-app-of-apps

# Or directly on the cluster
oc delete namespace <namespace>

# Clean up cluster-scoped resources
oc delete clusterrole <app-name>-mcp-reader
oc delete clusterrolebinding <app-name>-mcp-reader-binding
```

