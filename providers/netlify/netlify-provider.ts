import { NetlifyDeploymentStatus } from "../../enums/netlify-deployment-status.ts";
import {
  LoggingProvider,
  LoggingProviderInterface,
} from "../logging-provider.ts";
import { NetlifyPayload } from "./interfaces/netlify-payload.ts";

export class NetlifyProvider {
  private logger: LoggingProviderInterface;

  constructor() {
    this.logger = LoggingProvider(this.constructor.name);
  }

  parseWebhookPayload(
    deploymentStatus: string,
    netlifyPayload: NetlifyPayload,
  ): {
    deploymentStatus: NetlifyDeploymentStatus;
    netlifyPayload: NetlifyPayload;
  } {
    if (!isValidNetlifyDeploymentStatus(deploymentStatus)) {
      throw new Error(`Invalid deployment status: ${deploymentStatus}`);
    }

    this.logger.log("Reveived webhook payload", {
      deploymentStatus,
      netlifyPayload: {
        id: netlifyPayload.id,
        name: netlifyPayload.name,
        permalink: netlifyPayload.links?.permalink,
      },
    });

    return { deploymentStatus, netlifyPayload };
  }
}

function isValidNetlifyDeploymentStatus(
  status: string,
): status is NetlifyDeploymentStatus {
  return Object.values(NetlifyDeploymentStatus)
    .map((key) => key as string)
    .includes(status);
}
