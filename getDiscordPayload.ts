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
  const deploymentLink = buildNetlifyLink(status, netlifyPayload);

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

function buildNetlifyLink(
  status: NetlifyDeploymentStatus,
  payload: NetlifyPayload
) {
  switch (status) {
    case NetlifyDeploymentStatus.success:
      return payload.deploy_ssl_url;
    case NetlifyDeploymentStatus.failure:
    case NetlifyDeploymentStatus.started:
    default:
      return `https://app.netlify.com/sites/${payload.name}/deploys/${payload.id}`;
  }
}
