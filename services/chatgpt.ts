const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export const createChatCompletion = async (messages: Message[]) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages,
  });
  return completion.data.choices[0].message.content;
};
