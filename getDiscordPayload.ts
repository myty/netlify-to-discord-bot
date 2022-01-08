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
    embeds: [
      {
        title: buildDeploymentMessage(status),
        color: getDeploymentStatusColor(status),
        fields: [
          ...buildNetlifyBuildDetails(netlifyPayload),
          ...buildPreviewLink(status, netlifyPayload),
        ],
      },
    ],
  };
}

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
