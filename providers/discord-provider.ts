import { NetlifyDeploymentStatus } from "../enums/netlify-deployment-status.ts";
import {
  LoggingProvider,
  LoggingProviderInterface,
} from "./logging-provider.ts";
import { NetlifyPayload } from "./netlify/interfaces/netlify-payload.ts";
import { DiscordFactory } from "../factories/discord/discord-factory.ts";

interface DiscordProviderOptions {
  discordApplicationId: string;
  discordBotUrl: string;
}

export class DiscordProvider {
  #discordApplicationId?: string;
  #discordBotUrl: string;
  #logger: LoggingProviderInterface;

  constructor(
    options: Partial<DiscordProviderOptions> = {},
  ) {
    if (options.discordBotUrl == null) {
      throw new Error("'DISCORD_BOT' is not defined");
    }

    this.#discordApplicationId = options.discordApplicationId;
    this.#discordBotUrl = options.discordBotUrl;
    this.#logger = LoggingProvider(this.constructor.name);
  }

  async notify(
    deploymentStatus: NetlifyDeploymentStatus,
    netlifyPayload: NetlifyPayload,
  ): Promise<number> {
    const discordPayload = DiscordFactory.createBotPayload(
      this.#discordApplicationId,
      deploymentStatus,
      netlifyPayload,
    );

    const request = new Request(this.#discordBotUrl, {
      method: "POST",
      body: JSON.stringify(discordPayload),
      headers: {
        "content-type": "application/json",
      },
    });

    this.#logger.log("notify", {
      discordPayload,
    });

    return (await fetch(request)).status;
  }
}
