import { NetlifyPayload } from "./types.ts";

export function getDiscordPayload(netlifyPayload: NetlifyPayload) {
  return {
    content: `Deployed successfully: ${netlifyPayload.deploy_ssl_url}`,
  };
}
