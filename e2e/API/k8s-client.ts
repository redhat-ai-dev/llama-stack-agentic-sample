import { AppsV1Api, CoreV1Api, CustomObjectsApi, KubeConfig, V1ObjectMeta, V1Secret } from '@kubernetes/client-node';

export class KubeClient {
  private readonly kubeConfig: KubeConfig;

  constructor(configFile?: string) {
    this.kubeConfig = new KubeConfig();
    if (configFile) {
      this.kubeConfig.loadFromFile(configFile);
    } else {
      this.kubeConfig.loadFromDefault();
    }
  }

  async createSecret(name: string, namespace: string, data: {[key: string]: string}) {
    const client = this.kubeConfig.makeApiClient(CoreV1Api);
    const body: V1Secret = {
      apiVersion: 'v1',
      metadata: {
        name: name
      },
      stringData: data
    }

    try {
      const exists = await client.readNamespacedSecret({ name, namespace });
      if (exists?.metadata?.name === name) {
        await client.deleteNamespacedSecret({ name, namespace });
      }
    } catch (err) {
      // secret doesn't exist
    }
    try {
      await client.createNamespacedSecret({ namespace, body });
    } catch (error) {
      throw new Error(`Failed to create secret ${name}: ${error}`);
    }
  }

  async createNamespace(name: string) {
    const client = this.kubeConfig.makeApiClient(CoreV1Api);
    const exists = await client.readNamespace({ name: name });
    if (exists?.metadata?.name === name) {
        return;
    }
    const payload = {
      metadata: {
        name: name
      }
    }
    await client.createNamespace({ body: payload });
  }

  async listDeployments(namespace: string, appName: string) {
    const client = this.kubeConfig.makeApiClient(AppsV1Api);

    const response = await client.listNamespacedDeployment({ 
      namespace,
      labelSelector: `app.kubernetes.io/part-of=${appName}`
    });

    return response.items;
  }

  async applicationExists(name: string, namespace: string) {
    const client = this.kubeConfig.makeApiClient(CustomObjectsApi);
    let exists = false;

    try {
      const body = await client.getNamespacedCustomObject({
        group: 'argoproj.io',
        name,
        namespace,
        plural: 'applications',
        version: 'v1alpha1'
      });
      if (body.metadata.name === name) {
        exists = true;
      }
    } catch (err) {
      console.log(err)
      exists = false;
    }
    return exists;
  }

  async getPipelineRunByRepository(gitRepository: string, eventType: string) {
    const customObjectsApi = this.kubeConfig.makeApiClient(CustomObjectsApi);
    const maxAttempts = 10;
    const retryInterval = 5 * 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const body = await customObjectsApi.listClusterCustomObject({
          group: 'tekton.dev',
          plural: 'pipelineruns',
          version: 'v1',
          labelSelector: `pipelinesascode.tekton.dev/url-repository=${gitRepository}`
        });

        const filteredPipelineRuns = body.items.filter((pipelineRun) => {
          const metadata: V1ObjectMeta = pipelineRun.metadata!;
          const labels = metadata.labels;

          if (labels && labels['pipelinesascode.tekton.dev/event-type'] === eventType) {
            return true;
          }
          return false;
        });

        if (filteredPipelineRuns.length > 0) {
          console.log(`Found pipeline run ${filteredPipelineRuns[0].metadata!.name}`);

          return filteredPipelineRuns[0];
        } else {
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
        }
      } catch (error) {
        console.error(`Error fetching pipeline runs (Attempt ${attempt}):`);
        if (attempt < maxAttempts) {
          console.log(`Retrying in ${retryInterval / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
        } else {
          throw error;
        }
      }
    }
    throw new Error(`Max attempts reached. Unable to fetch pipeline runs for your component in cluster for ${gitRepository}`);
  }

  async waitPipelineRunToFinish(pipelineRun, namespace: string, timeoutMs: number): Promise<boolean> {
    const name = pipelineRun.metadata?.name;
    if (!name) {
      throw new Error('No name available for pipelinerun');
    }
    const customObjectsApi = this.kubeConfig.makeApiClient(CustomObjectsApi);
    const retryInterval = 5 * 1000;
    let totalTimeMs = 0;

    while (timeoutMs === 0 || totalTimeMs < timeoutMs) {
      try {
        const pr = await customObjectsApi.getNamespacedCustomObject({
          group: 'tekton.dev',
          name,
          namespace,
          plural: 'pipelineruns',
          version: 'v1'
        });

        if (pr.status && pr.status.conditions) {
          const pipelineHasFinishedSuccessfully = pr.status.conditions.some(
            (condition) => condition.status === 'True' && condition.type === 'Succeeded'
          );
          const pipelineHasFailed = pr.status.conditions.some(
            (condition) => condition.status === 'False' && condition.reason === 'Failed'
          );

          if (pipelineHasFinishedSuccessfully) {
            console.log(`Pipeline run '${name}' finished successfully.`);
            return true;
          } else if (pipelineHasFailed) {
            console.error(`Pipeline run '${name}' failed.`);
            return false;
          }
        }
      } catch (error) {
        console.error('Error fetching pipeline run: retrying');
      }
      await new Promise((resolve) => setTimeout(resolve, retryInterval));
      totalTimeMs += retryInterval;
    }
    throw new Error(`Timeout reached waiting for pipeline run '${name}' to finish.`);
  }
}