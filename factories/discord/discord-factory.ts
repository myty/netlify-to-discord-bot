import { NetlifyDeploymentStatus } from "../../enums/netlify-deployment-status.ts";
import DiscordBotPayloadRecord from "../../models/discord/discord-bot-payload.ts";
import { NetlifyPayload } from "../../providers/netlify/interfaces/netlify-payload.ts";

export const DiscordFactory = {
  createBotPayload(
    discordApplicationId: string,
    deploymentStatus: NetlifyDeploymentStatus,
    netlifyPayload: NetlifyPayload,
  ): DiscordBotPayloadRecord {
    const payload = new DiscordBotPayloadRecord()
      .withApplicationId(discordApplicationId)
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
  },
};
