import { NetlifyDeploymentStatusDiscordConfig } from "../../config/netlify-deployment-status-discord-config.ts";
import { DiscordColors } from "../../enums/discord-colors.ts";
import { NetlifyDeploymentStatus } from "../../enums/netlify-deployment-status.ts";
import { NetlifyPayload } from "../../providers/netlify/interfaces/netlify-payload.ts";
import { ImmutableRecord } from "../immutable-record.ts";

interface DiscordBotEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordBotEmbed {
  title: string;
  color: DiscordColors;
  fields: DiscordBotEmbedField[];
}

export interface DiscordBotPayload {
  application_id?: string;
  channel_id?: string;
  tts: boolean;
  embeds: DiscordBotEmbed[];
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
  tts: false,
  embeds: [],
  components: [],
};

export default class DiscordBotPayloadRecord
  extends ImmutableRecord<DiscordBotPayload>(
    defaultValues,
  ) {
  withApplicationId(id?: string | null): this {
    if (id == null) {
      return this;
    }

    return this.with({ application_id: id });
  }

  withChannelId(id?: string | null): this {
    if (id == null) {
      return this;
    }

    return this.with({ channel_id: id });
  }

  addActionComponent(
    component: DiscordBotPayload["components"][0]["components"][0],
  ): this {
    const currentActionComponents = (this.components?.length ?? 0) < 1
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
    netlifyPayload: NetlifyPayload,
  ): this {
    const { color, title } = NetlifyDeploymentStatusDiscordConfig[status];

    return this.with({
      embeds: [
        ...this.embeds,
        {
          title,
          color,
          ...getFields(status, netlifyPayload),
        },
      ],
    });
  }
}

function getFields(
  status: NetlifyDeploymentStatus,
  netlifyPayload: NetlifyPayload,
): Pick<DiscordBotEmbed, "fields"> {
  return {
    fields: [
      ...buildNetlifyBuildDetails(netlifyPayload),
      ...buildPreviewLink(status, netlifyPayload),
    ],
  };
}

function buildPreviewLink(
  status: NetlifyDeploymentStatus,
  payload: NetlifyPayload,
): DiscordBotEmbedField[] {
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

function buildNetlifyBuildDetails(
  payload: NetlifyPayload,
): DiscordBotEmbedField[] {
  return [
    {
      name: "Details",
      value:
        `https://app.netlify.com/sites/${payload.name}/deploys/${payload.id}`,
      inline: false,
    },
  ];
}
