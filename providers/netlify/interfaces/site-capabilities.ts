import { Forms } from "./forms.ts";
import { Functions } from "./functions.ts";
import { Identity } from "./identity.ts";

export interface SiteCapabilities {
  title: string;
  asset_acceleration: boolean;
  form_processing: boolean;
  cdn_propagation: string;
  build_node_pool: string;
  domain_aliases: boolean;
  secure_site: boolean;
  prerendering: boolean;
  proxying: boolean;
  ssl: string;
  rate_cents: number;
  yearly_rate_cents: number;
  ipv6_domain: string;
  branch_deploy: boolean;
  managed_dns: boolean;
  geo_ip: boolean;
  split_testing: boolean;
  id: string;
  cdn_tier: string;
  identity: Identity;
  functions: Functions;
  forms: Forms;
}
