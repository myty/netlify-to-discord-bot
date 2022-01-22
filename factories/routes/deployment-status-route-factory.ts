import { Mediator } from "../../mediator/mediator.ts";
import { SendNetlifyBuildNotificationRequest } from "../../mediator/requests/send-netlify-build-notification-request.ts";
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
      const request = new SendNetlifyBuildNotificationRequest(
        ctx.params.status,
        async () => {
          const { value: netlifyPayloadPromise } = ctx.request.body({
            type: "json",
          });

          return await netlifyPayloadPromise;
        },
      );

      const response = await mediator.send(request);

      ctx.response.status = response;
    };
  },
);
