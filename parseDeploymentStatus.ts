import {
  isValidNetlifyDeploymentStatus,
  NetlifyDeploymentStatus,
} from "./getDiscordPayload.ts";

export function parseDeploymentStatus(req: Request): NetlifyDeploymentStatus {
  const urlSplit = req.url.split("/");
  const lastUrlSplitSection = urlSplit[urlSplit.length - 1];

  if (isValidNetlifyDeploymentStatus(lastUrlSplitSection)) {
    return lastUrlSplitSection;
  }

  throw new Error(`Invalid deployment status: ${lastUrlSplitSection}`);
}
