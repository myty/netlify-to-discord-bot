import { serve } from "./deps.ts";
import { buildHandler } from "./netlify-webhook.ts";

const handler = buildHandler();

serve(handler);
