import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { TOOL_DEFINITIONS } from "./toolDefinitions";
import { ServerContext } from "./types";
import { TOOL_HANDLERS } from "./tools";
import { ApiError } from "./droneClient";

function isApiError(error: unknown) {
  return error instanceof ApiError || Object.hasOwn(error as any, "status");
}
async function logAndFormatError(error: unknown) {
  console.error(error);
  if (isApiError(error)) {
    const typedError = error as ApiError;
    return [
      "**Error**",
      `There was a ${typedError.status} error with the your request to the drone server API.`,
      `${typedError.message}`,
    ].join("\n\n");
  }

  return [
    "**Error**",
    "It looks like there was a problem communicating with the drone server API.",
  ].join("\n\n");
}

export async function configureServer({
  server,
  context,
  onToolComplete,
}: {
  server: McpServer;
  context: ServerContext;
  onToolComplete?: () => void;
}) {
  server.server.onerror = (error) => {
    console.error(error);
  };

  for (const tool of TOOL_DEFINITIONS) {
    const handler = TOOL_HANDLERS[tool.name];
    server.tool(
      tool.name as string,
      tool.description.replaceAll("${DRONE_SERVER_URL}", context.serverUrl),
      tool.paramsSchema ? tool.paramsSchema : {},
      async (...args) => {
        try {
          try {
            // @ts-ignore
            const output = await handler(context, ...args);
            return {
              content: [
                {
                  type: "text",
                  text: output,
                },
              ],
            };
          } catch (error) {
            return {
              content: [
                {
                  type: "text",
                  text: await logAndFormatError(error),
                },
              ],
              isError: true,
            };
          }
        } finally {
          if (onToolComplete) {
            onToolComplete();
          }
        }
      }
    );
  }
}
