import { NetlifyDeploymentStatus } from "../../enums/netlify-deployment-status.ts";
import DiscordBotPayloadRecord from "../../models/discord/discord-bot-payload.ts";
import { NetlifyPayload } from "../../providers/netlify/interfaces/netlify-payload.ts";

export const DiscordFactory = {
  createBotPayload(
    applicationId: string | undefined,
    deploymentStatus: NetlifyDeploymentStatus,
    netlifyPayload: NetlifyPayload,
  ): DiscordBotPayloadRecord {
    const payload = new DiscordBotPayloadRecord()
      .withApplicationId(applicationId)
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
