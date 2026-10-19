const { StateGraph, MessagesAnnotation } = require("@langchain/langgraph");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ToolMessage } = require("@langchain/core/messages");
const tools = require("../agent/tool");

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3-flash-preview",
  temperature: 0.5,
  disableStreaming: true,
  outputVersion: "v0",
});

const modelWithTools = model.bindTools([
  tools.searchProduct,
  tools.addProductToCart,
]);

const graph = new StateGraph(MessagesAnnotation)
  .addNode("chat", async (state) => {
    const response = await modelWithTools.invoke(state.messages);
    return { messages: [response] };
  })

 .addNode("tools", async (state, config) => {

     console.log(
    "Token available in tool node:",
    Boolean(config.metadata?.token)
  );
  const lastMessage = state.messages[state.messages.length - 1];
  const toolCalls = lastMessage.tool_calls ?? [];

  const results = await Promise.all(
    toolCalls.map(async (call) => {

         console.log("Tool name:", call.name);

      const selectedTool = tools[call.name];

      if (!selectedTool) {
        throw new Error(`Tool ${call.name} not found`);
      }

      const result = await selectedTool.invoke({
        ...call.args,
        token: config.metadata?.token,
      });

      return new ToolMessage({
        content:
          typeof result === "string"
            ? result
            : JSON.stringify(result),
        tool_call_id: call.id,
      });
    })
  );

  return { messages: results };
})

  .addEdge("__start__", "chat")

  .addConditionalEdges("chat", (state) => {
    const lastMessage = state.messages[state.messages.length - 1];

    return lastMessage.tool_calls?.length ? "tools" : "__end__";
  })

  .addEdge("tools", "chat");

module.exports = graph.compile();
