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
          "Request failed with status code 404, this could indicate that the reposlug or build number is invalid." +
            " Drone build links are of the format {host}/{owner}/{repo}/{build_number}." +
            " The input for tool is of the format {owner}/{repo}/{build_number}.",
          404
        );
      }
      throw error;
    }
  },
  drone_build_logs: async (
    context,
    { repoSlug, buildNumber, stageNumber, stepId }
  ) => {
    const droneClient = new DroneClient(context.serverUrl, context.accessToken);
    try {
      const logs = await droneClient.getStepLogs(
        repoSlug,
        buildNumber,
        stageNumber,
        stepId
      );
      let output = `# Logs for step ${stepId} in ${stageNumber} stage of **${buildNumber}** build in **${repoSlug}** repository\n\n`;
      const formattedLogs = (<Array<any>>logs).map((line) => line.out);
      return output + "```shell\n" + formattedLogs + "\n```";
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw new ApiError(
          "Request failed with status code 404, this could indicate that one of reposlug, buildNumber, stageNumber or stepNumber is invalid." +
            " Build number is indicated by 'number' on the build in response from the drone_build_info tool." +
            " Stage number is indicated by 'number' on the stage in response from the drone_build_info tool." +
            " Step number is indicated by 'number' on the step in response from the drone_build_info tool.",
          404
        );
      }
      throw error;
    }
  },
} satisfies ToolHandlers;
