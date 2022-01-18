import { NetlifyDeploymentStatus } from "./enums/netlify-deployment-status.ts";
import { NetlifyProvider } from "./netlify-provider.ts";

export function parseDeploymentStatus(req: Request): NetlifyDeploymentStatus {
  const urlSplit = req.url.split("/");
  const lastUrlSplitSection = urlSplit[urlSplit.length - 1];

  if (NetlifyProvider.isValidNetlifyDeploymentStatus(lastUrlSplitSection)) {
    return lastUrlSplitSection;
  }

  throw new Error(`Invalid deployment status: ${lastUrlSplitSection}`);
}
