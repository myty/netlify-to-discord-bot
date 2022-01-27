import { Mediator } from "../../deps.ts";
import { SendNetlifyBuildNotificationRequest } from "../../mediator/requests/send-netlify-build-notification-request.ts";
import { NetlifyPayload } from "../../providers/netlify/interfaces/netlify-payload.ts";
import { routeFactory } from "./route-factory.ts";

interface DeploymentStatusRouteFactoryOptions {
  mediator: Mediator;
}

export const deploymentStatusRouteFactory = routeFactory<
  DeploymentStatusRouteFactoryOptions
>(
  "/deployments/:status",
  ({ mediator }) => {
    return async (ctx) => {
      const payload = await ctx.body as NetlifyPayload;
      const request = new SendNetlifyBuildNotificationRequest(
        ctx.params.status,
        payload,
      );

      ctx.response.status = await mediator.send(request);
    };
  },
);
