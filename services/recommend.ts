import { Message, createChatCompletion } from "./chatgpt";

import { getRatings } from "./letterboxd";

const tastePrompt = `Here's a list of films I've watched, with the ratings I gave them:

{{ratings}}

Based on that list, describe the characteristics of the films which I enjoy, and what's important to me when choosing a film to watch.
`;

const recommendationPrompt = `Based on those characteristics, recommend a set of films to me.

Your response should be formatted as a json array of recommendations, like this:
[
  {
    "title": "The Godfather",
    "year": 1972
    "shortDescription": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
  },
  ...
]

Responses which do not follow this format exactly will be rejected. Do not include any other information in your response.
`;

function ratingToStars(n: number) {
  return "★".repeat(Math.floor(n)) + "½".repeat(Math.round(n % 1));
}

export const getRecommendations = async (username: string) => {
  const ratings = await getRatings(username);
  const prompt = tastePrompt.replace(
    "{{ratings}}",
    ratings
      .map(
        (rating) =>
          `${rating.title} (${rating.year}) - ${ratingToStars(rating.rating)}`
      )
      .join("\n")
  );
  let messages: Message[] = [{ role: "user", content: prompt }];
  const tasteCompletion = await createChatCompletion(messages);
  messages.push({ role: "assistant", content: tasteCompletion as string });
  messages.push({ role: "user", content: recommendationPrompt });
  const recommendationCompletion = await createChatCompletion(messages);
  const recommendations = JSON.parse(recommendationCompletion);
  return { taste: tasteCompletion, recommendations };
};
