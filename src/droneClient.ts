import axios from "axios";
import type { AxiosInstance } from "axios";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export class DroneClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly _axios: AxiosInstance;

  constructor(url: string, token: string) {
    this.baseUrl = url;
    this.token = token;
    this._axios = axios.create({
      baseURL: this.baseUrl,
      headers: { Authorization: `Bearer ${this.token}` },
      allowAbsoluteUrls: false,
    });
  }

  private async request(path: string, method = "GET"): Promise<object> {
    try {
      const { data } = await this._axios.request({
        method,
        url: path,
      });
      return data;
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        console.error("Bazinga");
        throw new ApiError(error.message, error.response?.status || 500);
      }
      console.error("No Bazinga");
      throw error;
    }
  }

  async getBuild(repoSlug: string, buildNumber: number) {
    return await this.request(`api/repos/${repoSlug}/builds/${buildNumber}`);
  }

  async getStepLogs(
    repoSlug: string,
    buildNumber: number,
    stageNumber: number,
    stepId: number,
  ) {
    return await this.request(
      `api/repos/${repoSlug}/builds/${buildNumber}/logs/${stageNumber}/${stepId}`,
    );
  }
}
