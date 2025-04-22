import yaml from "js-yaml";
import type { ToolHandlers } from "./types";
import { ApiError, DroneClient } from "./droneClient";

export const TOOL_HANDLERS = {
  drone_build_info: async (context, { repoSlug, buildNumber }) => {
    let output = `# Build **${buildNumber}** in **${repoSlug}**\n\n`;
    const droneClient = new DroneClient(context.serverUrl, context.accessToken);
    try {
      const buildInfo = await droneClient.getBuild(repoSlug, buildNumber);
      return output + "```yaml\n" + yaml.dump(buildInfo) + "\n```";
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw new ApiError(
          "Request failed with status code 404, this could indicate that the reposlug or buildnumber is invalid.",
          404,
        );
      }
      throw error;
    }
  },
  drone_build_logs: async (
    context,
    { repoSlug, buildNumber, stageNumber, stepId },
  ) => {
    const droneClient = new DroneClient(context.serverUrl, context.accessToken);
    try {
      const logs = await droneClient.getStepLogs(
        repoSlug,
        buildNumber,
        stageNumber,
        stepId,
      );
      let output = `# Logs for step ${stepId} in ${stageNumber} stage of **${buildNumber}** build in **${repoSlug}** repository\n\n`;
      const formattedLogs = (<Array<any>>logs).map((line) => line.out);
      return output + "```shell\n" + formattedLogs + "\n```";
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw new ApiError(
          "Request failed with status code 404, this could indicate that one of reposlug, buildnumber, stagenumber or stepId is invalid.",
          404,
        );
      }
      throw error;
    }
  },
} satisfies ToolHandlers;
