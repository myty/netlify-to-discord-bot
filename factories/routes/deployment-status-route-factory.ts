import { NetlifyPayload } from "../../providers/netlify/interfaces/netlify-payload.ts";
import { routeFactory } from "./route-factory.ts";
import { logger as defaultLogger } from "../../providers/logging/logger.ts";
import { Logger } from "../../providers/logging/interfaces/logger.ts";
import { DiscordProvider } from "../../providers/discord/discord-provider.ts";
import { NetlifyProvider } from "../../providers/netlify/netlify-provider.ts";

interface DeploymentStatusRouteFactoryOptions {
  discordProvider: DiscordProvider;
  logger?: Logger;
}

export const deploymentStatusRouteFactory = routeFactory<
  DeploymentStatusRouteFactoryOptions
>(
  "/deployments/:status",
  ({ discordProvider, logger = defaultLogger }) => {
    return async (ctx) => {
      if (
        !NetlifyProvider.isValidNetlifyDeploymentStatus(ctx.params.status)
      ) {
        throw new Error(`Invalid deployment status: ${ctx.params.status}`);
      }

      const deploymentStatus = ctx.params.status;
      const { value: netlifyPayloadPromise } = ctx.request.body({
        type: "json",
      });

      const netlifyPayload: NetlifyPayload = await netlifyPayloadPromise;

      logger.log("Reveived webhook payload", {
        deploymentStatus,
        netlifyPayload: {
          id: netlifyPayload.id,
          name: netlifyPayload.name,
          permalink: netlifyPayload.links?.permalink,
        },
      });

      ctx.response.status = await discordProvider.notify(
        deploymentStatus,
        netlifyPayload,
      );
    };
  },
);
