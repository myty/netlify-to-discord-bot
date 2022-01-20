import { NetlifyDeploymentStatus } from "../enums/netlify-deployment-status.ts";
import { DiscordColors } from "../enums/discord-colors.ts";

type DiscordMessageOption = {
  color: DiscordColors;
  title: string;
};

export const NetlifyDeploymentStatusDiscordConfig: Record<
  NetlifyDeploymentStatus,
  DiscordMessageOption
> = {
  [NetlifyDeploymentStatus.Started]: {
    color: DiscordColors.BLUE,
    title: "Deployment Started",
  },
  [NetlifyDeploymentStatus.Success]: {
    color: DiscordColors.GREEN,
    title: "Deployment Successful",
  },
  [NetlifyDeploymentStatus.Failure]: {
    color: DiscordColors.RED,
    title: "Deployment Failed",
  },
};
