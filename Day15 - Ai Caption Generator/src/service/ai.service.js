const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});


async function generateCaption(base64ImageFile) {
  const contents = [
    {
      inlineData: {
        mimeType: "image/jpeg",
        data: base64ImageFile,
      },
    },
    { text: "Caption this image." },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: contents,
    config:{
      systemInstruction:`You are an stylish morder expert caption generation.
      Generation only one single line caption.
      caption should be short clear and concise.
      You can you hastags and emojis in caption`
    }
  });
  return response.text;
}

module.exports = generateCaption;
