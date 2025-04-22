#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { startStdio } from "./transports/stdio";

let serverUrl: string | undefined = process.env.DRONE_SERVER_URL;
let accessToken: string | undefined = process.env.DRONE_ACCESS_TOKEN;

const command = "drone-ci-mcp";

for (const arg of process.argv.slice(2)) {
  if (arg.startsWith("--access-token=")) {
    accessToken = arg.split("=")[1];
  } else if (arg.startsWith("--server-url=")) {
    serverUrl = arg.split("=")[1];
  }
}

if (!accessToken) {
  console.error(
    "Error: No access token was provided. Pass one with `--access-token` or via `DRONE_ACCESS_TOKEN`.",
  );
  console.error(
    `Usage: ${command} --access-token=<token> [--server-url=<drone-server-url>]`,
  );
  process.exit(1);
}

if (!serverUrl) {
  console.error(
    "Error: No server url was provided. Pass one with `--server-url` or via `DRONE_SERVER_URL`.",
  );
  console.error(
    `Usage: ${command} --access-token=<token> [--server-url=<drone-server-url>]`,
  );
  process.exit(1);
}

const server = new McpServer({
  name: "Drone CI MCP",
  version: "0.1.0",
});

startStdio(server, {
  accessToken,
  serverUrl,
}).catch((err) => {
  console.error("Server error:", err);
  process.exit(1);
});
