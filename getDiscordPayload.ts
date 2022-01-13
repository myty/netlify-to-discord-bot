import { NetlifyPayload } from "./types.ts";

export enum NetlifyDeploymentStatus {
  started = "started",
  success = "success",
  failure = "failure",
}

export function getDiscordPayload(
  status: NetlifyDeploymentStatus,
  netlifyPayload: NetlifyPayload
) {
  return {
    ...getEmbeds(status, netlifyPayload),
    ...getComponents(),
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

function getComponents() {
  return {
    components: [
      {
        type: 1,
        components: [
          {
            type: 2,
            label: "Publish",
            style: 1,
            custom_id: "publish_deployment",
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
    case NetlifyDeploymentStatus.success:
      return 3066993;
    case NetlifyDeploymentStatus.failure:
      return 15158332;
    case NetlifyDeploymentStatus.started:
      return 3447003;
    default:
      return 0;
  }
}

function buildDeploymentMessage(status: NetlifyDeploymentStatus) {
  switch (status) {
    case NetlifyDeploymentStatus.success:
      return "Deployment successful";
    case NetlifyDeploymentStatus.failure:
      return "Deployment failed";
    case NetlifyDeploymentStatus.started:
    default:
      return "Deployment started";
  }
}

function buildPreviewLink(
  status: NetlifyDeploymentStatus,
  payload: NetlifyPayload
) {
  if (
    status != NetlifyDeploymentStatus.success ||
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
