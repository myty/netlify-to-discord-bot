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

  async parseWebhookPayload(
    deploymentStatus: string,
    payloadReader: () => Promise<NetlifyPayload>,
  ): Promise<
    {
      deploymentStatus: NetlifyDeploymentStatus;
      netlifyPayload: NetlifyPayload;
    }
  > {
    if (!isValidNetlifyDeploymentStatus(deploymentStatus)) {
      throw new Error(`Invalid deployment status: ${deploymentStatus}`);
    }

    const netlifyPayload = await payloadReader();

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
