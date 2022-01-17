import {
  isValidNetlifyDeploymentStatus,
  buildNetlifyBuildDetails,
  getDiscordPayload,
} from "../../providers/discord/get-discord-payload.ts";
import { NetlifyPayload } from "../../providers/netlify/interfaces/netlify-payload.ts";
import { routeFactory } from "./route-factory.ts";
import { logger as defaultLogger } from "../../providers/logging/logger.ts";
import { Logger } from "../../providers/logging/interfaces/logger.ts";

interface DeploymentStatusRouteFactoryOptions {
  discordBotUrl?: string;
  logger?: Logger;
}

export const deploymentStatusRouteFactory =
  routeFactory<DeploymentStatusRouteFactoryOptions>(
    "/deployments/:status",
    ({ discordBotUrl, logger = defaultLogger }) => {
      if (discordBotUrl == null) {
        throw new Error("'DISCORD_BOT' is not defined");
      }

      return async (ctx) => {
        if (!isValidNetlifyDeploymentStatus(ctx.params.status)) {
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
            detailsLink: buildNetlifyBuildDetails(netlifyPayload),
          },
        });

        const discordPayload = getDiscordPayload(
          deploymentStatus,
          netlifyPayload
        );

        const request = new Request(discordBotUrl!, {
          method: "POST",
          body: JSON.stringify(discordPayload),
          headers: {
            "content-type": "application/json",
          },
        });

        logger.log("Called Discord", {
          discordPayload,
        });

        ctx.response.status = (await fetch(request)).status;
      };
    }
  );
