import { routeFactory } from "./route-factory.ts";
import { DiscordProvider } from "../../providers/discord-provider.ts";
import { NetlifyProvider } from "../../providers/netlify/netlify-provider.ts";

interface DeploymentStatusRouteFactoryOptions {
  discordProvider: DiscordProvider;
  netlifyProvider: NetlifyProvider;
}

export const deploymentStatusRouteFactory = routeFactory<
  DeploymentStatusRouteFactoryOptions
>(
  "/deployments/:status",
  ({ discordProvider, netlifyProvider }) => {
    return async (ctx) => {
      const { deploymentStatus, netlifyPayload } = await netlifyProvider
        .parseWebhookPayload(ctx.params.status, async () => {
          const { value: netlifyPayloadPromise } = ctx.request.body({
            type: "json",
          });

          return await netlifyPayloadPromise;
        });

      ctx.response.status = await discordProvider.notify(
        deploymentStatus,
        netlifyPayload,
      );
    };
  },
);
