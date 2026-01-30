import { Octokit } from "@octokit/rest";

export class GitHubClient {
  private readonly octokit: Octokit

  constructor(githubToken: string, apiUrl = 'https://api.github.com') {
    this.octokit = new Octokit({
      baseUrl: apiUrl,
      userAgent: 'rhdh-devai',
      auth: githubToken,
    });
  }

  /**
   * check if a repository exists in GitHub
   * @param org A valid GitHub org
   * @param name A valid GitHub repository
   */
  async checkRepositoryExists(org: string, name: string): Promise<boolean> {
    try {
      const response = await this.octokit.repos.get({ owner: org, repo: name });
      return response.status === 200;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  /**
   * wait until a pull request is merged
   * @param org A valid GitHub org
   * @param repo A valid GitHub repository
   * @param pullNumber A valid pull reuqest number
   * @param retries number of retries in 2 second intervals
   */
  async waitPullMerged(org: string, repo: string, pullNumber: number, retries = 15) {
    while (retries > 0) {
      try {
        const response = await this.octokit.pulls.checkIfMerged({ owner: org, repo, pull_number: pullNumber });
        if (response.status === 204) {
          return;
        }
        retries--;
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (error) {
        if (retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          retries--;
          continue;
        } else {
          console.error(error);
          throw error;
        }
      }
    }
    throw new Error('Timed out waiting for pull request to be merged');
  }

  /**
   * delete repository in GitHub
   * @param org A valid GitHub org
   * @param name A valid GitHub repository
   */
  async deleteRepository(org: string, name: string): Promise<boolean> {
    try {
      const response = await this.octokit.request('DELETE /repos/' + org + '/' + `${name}`, {
        owner: org,
        repo: `${name}`,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      return response.status === 204;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}