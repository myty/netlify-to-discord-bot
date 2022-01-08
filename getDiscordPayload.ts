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
  const deploymentMessage = buildDeploymentMessage(status);
  const deploymentLink = buildNetlifyBuildDetailsUrl(netlifyPayload);

  return {
    content: `${deploymentMessage}: ${deploymentLink}`,
  };
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

function buildNetlifyBuildDetailsUrl(payload: NetlifyPayload) {
  return `https://app.netlify.com/sites/${payload.name}/deploys/${payload.id}`;
}
