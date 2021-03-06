import { Request } from "../../deps.ts";
import { DiscordProvider } from "../../providers/discord-provider.ts";
import { NetlifyPayload } from "../../providers/netlify/interfaces/netlify-payload.ts";
import { NetlifyProvider } from "../../providers/netlify/netlify-provider.ts";

export class SendNetlifyBuildNotificationRequest
  extends Request<Promise<number>> {
  constructor(
    public readonly deploymentStatus: string,
    public readonly payload: NetlifyPayload,
  ) {
    super();
  }
}

interface SendNetlifyBuildNotificationRequestHandlerOptions {
  discordProvider: DiscordProvider;
  netlifyProvider: NetlifyProvider;
}

export function SendNetlifyBuildNotificationRequestHandler(
  { discordProvider, netlifyProvider }:
    SendNetlifyBuildNotificationRequestHandlerOptions,
) {
  return async (
    request: SendNetlifyBuildNotificationRequest,
  ): Promise<number> => {
    const { deploymentStatus, netlifyPayload } = netlifyProvider
      .parseWebhookPayload(request.deploymentStatus, request.payload);

    return await discordProvider.notify(
      deploymentStatus,
      netlifyPayload,
    );
  };
}
