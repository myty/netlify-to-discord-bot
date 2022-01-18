import { NetlifyDeploymentStatus } from "./enums/netlify-deployment-status.ts";

export class NetlifyProvider {
  static isValidNetlifyDeploymentStatus(
    status: string
  ): status is NetlifyDeploymentStatus {
    return Object.values(NetlifyDeploymentStatus)
      .map((key) => key as string)
      .includes(status);
  }
}
