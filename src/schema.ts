import { z } from "zod";

export const ParamRepoSlug = z
  .string()
  .describe(
    "The slug of the repository in drone. Combination of owner/org and repository name seperated by '/', i.e. owner/repo",
  )
  .regex(/^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/);

export const ParamBuildNumber = z
  .number()
  .describe("The drone CI build number")
  .gt(0);

export const ParamStageNumber = z
  .number()
  .describe(
    "The build stage number. Indicated by the field 'number' on a stage",
  )
  .gt(0);

export const ParamStepId = z
  .number()
  .describe("The build step id. Indicated by the field 'step_id' on a step")
  .gt(0);
