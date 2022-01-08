import { serve } from "./deps.ts";
import {
  buildNetlifyBuildDetails,
  getDiscordPayload,
} from "./getDiscordPayload.ts";
import { parseDeploymentStatus } from "./parseDeploymentStatus.ts";
import { NetlifyPayload } from "./types.ts";

const discordBotUrl = Deno.env.get("DISCORD_BOT");

async function handler(req: Request): Promise<Response> {
  if (discordBotUrl == null) {
    return new Response("'DISCORD_BOT' is not defined", { status: 405 });
  }

  try {
    const deploymentStatus = parseDeploymentStatus(req);

    switch (req.method) {
      case "POST": {
        const netlifyPayload: NetlifyPayload = await req.json();

        console.log("Webhook called.", {
          deploymentStatus,
          netlifyPayload: {
            id: netlifyPayload.id,
            name: netlifyPayload.name,
            permalink: netlifyPayload.links?.permalink,
            detailsLink: buildNetlifyBuildDetails(netlifyPayload),
          },
        });

        const discordPayload = getDiscordPayload(
          deploymentStatus,
          netlifyPayload
        );

        const request = new Request(discordBotUrl, {
          method: "POST",
          body: JSON.stringify(discordPayload),
          headers: {
            "content-type": "application/json",
          },
        });

        return await fetch(request);
      }
    }
  } catch (error: unknown) {
    console.error(error);
  }

  return new Response("Invalid method", { status: 405 });
}

serve(handler);
