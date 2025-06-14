import {
  ParamRepoSlug,
  ParamBuildNumber,
  ParamStageNumber,
  ParamStepId,
} from "./schema";

export const TOOL_DEFINITIONS = [
  {
    name: "drone_build_info" as const,
    description: [
      "Look up information about a build on ${DRONE_SERVER_URL}. This includes the current status, stages and steps",
      "",
      "Use this tool when you need to:",
      "- Know the status of the build",
      "- Find information of the pipelines and steps and its status in the build",
    ].join("\n"),
    paramsSchema: {
      repoSlug: ParamRepoSlug,
      buildNumber: ParamBuildNumber,
    },
  },
  {
    name: "drone_build_logs" as const,
    description: [
      "Look up logs for a drone CI build step",
      "",
      "Use this tool when you need to:",
      "- Find logs for a build step. Reveals commands run and its outputs",
    ].join("\n"),
    paramsSchema: {
      repoSlug: ParamRepoSlug,
      buildNumber: ParamBuildNumber,
      stageNumber: ParamStageNumber,
      stepId: ParamStepId,
    },
  },
];
