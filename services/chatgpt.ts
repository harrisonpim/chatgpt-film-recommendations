const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const createChatCompletion = async (prompt: string) => {
  const completion = await openai.createChatCompletion({
    model: "text-davinci-003",
    messages: [{ role: "user", content: prompt }],
  });
  return completion;
};
