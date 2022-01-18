import { NetlifyDeploymentStatus } from "../../providers/netlify/enums/netlify-deployment-status.ts";
import { NetlifyPayload } from "../../providers/netlify/interfaces/netlify-payload.ts";
import { ImmutableRecord } from "../immutable-record.ts";

export interface DiscordBotPayload {
  application_id: string;
  channel_id: string;
  tts: boolean;
  embeds: {
    title: string;
    color: number;
    fields: {
      name: string;
      value: string | number;
      inline: boolean;
    }[];
  }[];
  components: {
    type: 1;
    components: {
      style: number;
      label: string;
      custom_id: string;
      disabled: boolean;
      type: 2;
    }[];
  }[];
}

const defaultValues: DiscordBotPayload = {
  application_id: "",
  channel_id: "",
  tts: false,
  embeds: [],
  components: [],
};

export default class DiscordBotPayloadRecord extends ImmutableRecord<DiscordBotPayload>(
  defaultValues
) {
  withApplicationId(id: string) {
    return this.with({ application_id: id });
  }

  withChannelId(id: string) {
    return this.with({ channel_id: id });
  }

  addActionComponent(
    component: DiscordBotPayload["components"][0]["components"][0]
  ) {
    const currentActionComponents =
      (this.components?.length ?? 0) < 1
        ? []
        : this.components[0].components ?? [];

    return this.with({
      components: [
        {
          type: 1,
          components: [...currentActionComponents, component],
        },
      ],
    });
  }

  addEmbedsFromNetlifyPayload(
    status: NetlifyDeploymentStatus,
    netlifyPayload: NetlifyPayload
  ) {
    return this.with({
      embeds: [
        ...this.embeds,
        {
          title: buildDeploymentMessage(status),
          color: getDeploymentStatusColor(status),
          ...getFields(status, netlifyPayload),
        },
      ],
    });
  }
}

function getFields(
  status: NetlifyDeploymentStatus,
  netlifyPayload: NetlifyPayload
) {
  return {
    fields: [
      ...buildNetlifyBuildDetails(netlifyPayload),
      ...buildPreviewLink(status, netlifyPayload),
    ],
  };
}

/**
 * Colors returned are based on: https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812#file-code_colors_discordjs-md
 * @param status {NetlifyDeploymentStatus}
 * @returns {number}
 */
function getDeploymentStatusColor(status: NetlifyDeploymentStatus): number {
  switch (status) {
    case NetlifyDeploymentStatus.Success:
      return 3066993;
    case NetlifyDeploymentStatus.Failure:
      return 15158332;
    case NetlifyDeploymentStatus.Started:
      return 3447003;
    default:
      return 0;
  }
}

function buildDeploymentMessage(status: NetlifyDeploymentStatus) {
  switch (status) {
    case NetlifyDeploymentStatus.Success:
      return "Deployment Successful";
    case NetlifyDeploymentStatus.Failure:
      return "Deployment Failed";
    case NetlifyDeploymentStatus.Started:
    default:
      return "Deployment Started";
  }
}

function buildPreviewLink(
  status: NetlifyDeploymentStatus,
  payload: NetlifyPayload
) {
  if (
    status != NetlifyDeploymentStatus.Success ||
    payload.links?.permalink == null
  ) {
    return [];
  }

  return [
    {
      name: "Preview",
      value: payload.links?.permalink,
      inline: false,
    },
  ];
}

function buildNetlifyBuildDetails(payload: NetlifyPayload) {
  return [
    {
      name: "Details",
      value: `https://app.netlify.com/sites/${payload.name}/deploys/${payload.id}`,
      inline: false,
    },
  ];
}
