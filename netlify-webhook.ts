import { Application, Mediator } from "./deps.ts";
import {
  DefaultLogger,
  LoggingProviderInterface,
} from "./providers/logging-provider.ts";
import { DiscordProvider } from "./providers/discord-provider.ts";
import { NetlifyProvider } from "./providers/netlify/netlify-provider.ts";
import {
  SendNetlifyBuildNotificationRequest,
  SendNetlifyBuildNotificationRequestHandler,
} from "./mediator/requests/send-netlify-build-notification-request.ts";
import { deploymentStatusRouteFactory } from "./factories/routes/deployment-status-route-factory.ts";

interface ServeOptions {
  logger?: LoggingProviderInterface;
  port?: number;
}

export function serve(options?: ServeOptions): void {
  const { logger = DefaultLogger, port = 8000 } = options ?? {};

  try {
    const discordProvider = new DiscordProvider({
      discordApplicationId: Deno.env.get("DISCORD_APPLICATION_ID"),
      discordBotUrl: Deno.env.get("DISCORD_BOT"),
    });

    const netlifyProvider = new NetlifyProvider();

    const mediator = new Mediator();
    mediator.handle(
      SendNetlifyBuildNotificationRequest,
      SendNetlifyBuildNotificationRequestHandler({
        discordProvider,
        netlifyProvider,
      }),
    );

    logger.log(`Listening on port ${port}`);

    new Application().get(...deploymentStatusRouteFactory({ mediator })).start({
      port,
    });
  } catch (error) {
    logger.error(error);
  }
}
