import { Application, Router } from "./deps.ts";
import { logger as defaultLogger } from "./providers/logging/logger.ts";
import { Logger } from "./providers/logging/interfaces/logger.ts";
import { deploymentStatusRouteFactory } from "./factories/routes/deployment-status-route-factory.ts";

interface ServeOptions {
  logger?: Logger;
  port?: number;
}

export function serve(options?: ServeOptions): void {
  const { logger = defaultLogger, port = 8000 } = options ?? {};

  try {
    const app = new Application();

    app.addEventListener("error", (event) => {
      logger.error(event.error);
    });

    const router = new Router();

    router.post(
      ...deploymentStatusRouteFactory({
        discordApplicationId: Deno.env.get("DISCORD_APPLICATION_ID"),
        discordBotUrl: Deno.env.get("DISCORD_BOT"),
        logger,
      }),
    );

    app.use(router.routes());

    logger.log(`Listening on port ${port}`);

    app.listen({ port });
  } catch (error) {
    logger.error(error);
  }
}
