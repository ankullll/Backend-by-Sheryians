import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod/v4";

const server = new McpServer({ name: "demo-server", version: "1.0.0" });

server.registerTool("add",{
    title:"addition tool",
    description : "Add two numbers",
    inputSchema: z.object({
        a:z.number().describe("First Number"),
        b:z.number().describe("Second number")

    })
  },
  async ({a,b}) => {
   return{ content: [{ type: "text", text: String(a+b) }],}
  },
);

  const transport = new StdioServerTransport();
  await server.connect(transport);
 

