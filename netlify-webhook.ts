import { dotEnvConfig, serve } from "./deps.ts";
import { getDiscordPayload } from "./getDiscordPayload.ts";
import { NetlifyPayload } from "./types.ts";

dotEnvConfig({ export: true });

const discordBotUrl = Deno.env.get("DISCORD_BOT");

async function handler(req: Request): Promise<Response> {
  if (discordBotUrl == null) {
    return new Response("'DISCORD_BOT' is not defined", { status: 405 });
  }

  try {
    switch (req.method) {
      case "POST": {
        const netlifyPayload: NetlifyPayload = await req.json();
        const discordPayload = getDiscordPayload(netlifyPayload);
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

console.log("Listening on http://localhost:8000");
serve(handler);
