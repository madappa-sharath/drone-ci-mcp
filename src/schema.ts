import { z } from "zod";

export const ParamRepoSlug = z
  .string()
  .describe(
    "The slug of the repository in drone. Combination of owner/org and repository name seperated by '/', i.e. owner/repo"
  )
  .regex(/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/);

export const ParamBuildNumber = z
  .number()
  .describe(
    "The drone CI build number. Drone build links are of the format {host}/{owner}/{repo}/{build_number}. The build number is the last part of the link."
  )
  .gt(0);

export const ParamStageNumber = z
  .number()
  .describe(
    "The build stage number. Indicated by the field 'number' on a stage in response from the drone_build_info tool"
  )
  .gt(0);

export const ParamStepId = z
  .number()
  .describe(
    "The build step number. Indicated by the field 'number' on a step in response from the drone_build_info tool"
  )
  .gt(0);
