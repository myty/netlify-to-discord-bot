import { NetlifyDeploymentStatus } from "./getDiscordPayload.ts";

export function parseDeploymentStatus(req: Request): NetlifyDeploymentStatus {
  const urlSplit = req.url.split("/");
  const lastUrlSplitSection = urlSplit[urlSplit.length - 1];

  if (
    lastUrlSplitSection === NetlifyDeploymentStatus.started ||
    lastUrlSplitSection === NetlifyDeploymentStatus.success ||
    lastUrlSplitSection === NetlifyDeploymentStatus.failure
  ) {
    return lastUrlSplitSection as NetlifyDeploymentStatus;
  }

  throw new Error(`Invalid deployment status: ${lastUrlSplitSection}`);
}
