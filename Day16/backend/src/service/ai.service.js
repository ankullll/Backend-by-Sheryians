const { GoogleGenAI }= require("@google/genai")
const ai = new GoogleGenAI({});

async function generateResponse(chatHistory){
    const response = await ai.models.generateContent({
        model:"gemini-3.5-flash",
        contents:chatHistory,
        config:{
            systemInstruction:"Always give clear ,concise and short one line answers, never give detailed answer until asked for that"
        }
    })

    return response.text;
}

module.exports = generateResponse;