import { recommendationPrompt, tastePrompt } from "./prompts";

import { Message } from "../types";
import { createChatCompletion } from "./chatgpt";
import { getRatings } from "./letterboxd";
import { ratingToStars } from ".";

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
