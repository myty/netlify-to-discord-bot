import { NetlifyDeploymentStatus } from "../netlify/enums/netlify-deployment-status.ts";
import { NetlifyPayload } from "../netlify/interfaces/netlify-payload.ts";

export function isValidNetlifyDeploymentStatus(
  status: string
): status is NetlifyDeploymentStatus {
  return Object.values(NetlifyDeploymentStatus)
    .map((key) => key as string)
    .includes(status);
}

export function getDiscordPayload(
  status: NetlifyDeploymentStatus,
  netlifyPayload: NetlifyPayload
) {
  const discordApplicationId = Deno.env.get("DISCORD_APPLICATION_ID");
  if (discordApplicationId == null) {
    throw Error("'DISCORD_APPLICATION_ID' is not defined");
  }

  return {
    application_id: discordApplicationId,
    channel_id: "772908445358620702",
    tts: false,
    ...getEmbeds(status, netlifyPayload),
    ...getComponents(status),
  };
}

function getEmbeds(
  status: NetlifyDeploymentStatus,
  netlifyPayload: NetlifyPayload
) {
  return {
    embeds: [
      {
        title: buildDeploymentMessage(status),
        color: getDeploymentStatusColor(status),
        ...getFields(status, netlifyPayload),
      },
    ],
  };
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

function getComponents(status: NetlifyDeploymentStatus) {
  if (status !== NetlifyDeploymentStatus.Success) {
    return {};
  }

  return {
    components: [
      {
        type: 1,
        components: [
          {
            style: 1,
            label: `Publish`,
            custom_id: `publish_deployment`,
            disabled: false,
            type: 2,
          },
        ],
      },
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

export function buildNetlifyBuildDetails(payload: NetlifyPayload) {
  return [
    {
      name: "Details",
      value: `https://app.netlify.com/sites/${payload.name}/deploys/${payload.id}`,
      inline: false,
    },
  ];
}
