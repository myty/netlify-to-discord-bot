import DiscordBotPayloadRecord from "../../models/discord/discord-bot-payload.ts";
import { NetlifyDeploymentStatus } from "../../enums/netlify-deployment-status.ts";
import { NetlifyPayload } from "../netlify/interfaces/netlify-payload.ts";

export class DiscordProvider {
  constructor(private discordApplicationId: string) {}

  public createBotPayload(
    deploymentStatus: NetlifyDeploymentStatus,
    netlifyPayload: NetlifyPayload,
  ): DiscordBotPayloadRecord {
    const payload = new DiscordBotPayloadRecord()
      .withApplicationId(this.discordApplicationId)
      .withChannelId("772908445358620702")
      .addEmbedsFromNetlifyPayload(deploymentStatus, netlifyPayload);

    if (deploymentStatus !== NetlifyDeploymentStatus.Success) {
      return payload;
    }

    return payload.addActionComponent({
      style: 1,
      label: `Publish`,
      custom_id: `publish_deployment`,
      disabled: false,
      type: 2,
    });
  }
}
