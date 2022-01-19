import { NetlifyDeploymentStatus } from "../../enums/netlify-deployment-status.ts";
import { NetlifyPayload } from "../netlify/interfaces/netlify-payload.ts";
import { DiscordFactory } from "../../factories/discord/discord-factory.ts";
import { Logger } from "../logging/interfaces/logger.ts";
import { loggerFactory } from "../logging/logger.ts";

interface DiscordProviderOptions {
  discordApplicationId: string;
  discordBotUrl: string;
}

export class DiscordProvider {
  private discordApplicationId: string;
  private discordBotUrl: string;
  private logger: Logger;

  constructor(
    options: Partial<DiscordProviderOptions> = {},
  ) {
    if (options.discordBotUrl == null) {
      throw new Error("'DISCORD_BOT' is not defined");
    }

    if (options.discordApplicationId == null) {
      throw Error("'DISCORD_APPLICATION_ID' is not defined");
    }

    this.discordApplicationId = options.discordApplicationId;
    this.discordBotUrl = options.discordBotUrl;
    this.logger = loggerFactory(this.constructor.name);
  }

  async notify(
    deploymentStatus: NetlifyDeploymentStatus,
    netlifyPayload: NetlifyPayload,
  ): Promise<number> {
    const discordPayload = DiscordFactory.createBotPayload(
      this.discordApplicationId,
      deploymentStatus,
      netlifyPayload,
    );

    const request = new Request(this.discordBotUrl, {
      method: "POST",
      body: JSON.stringify(discordPayload),
      headers: {
        "content-type": "application/json",
      },
    });

    this.logger.log("notify", {
      discordPayload,
    });

    return (await fetch(request)).status;
  }
}
