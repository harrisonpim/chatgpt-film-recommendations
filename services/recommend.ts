import { createChatCompletion } from "./chatgpt";
import { getRatings } from "./letterboxd";

const recommendationPrompt = `Here's a list of films I've watched, with the ratings I gave them:

{{ratings}}

Based on that list, can you suggest some films I should watch? The list should contain titles which span the last few decades, and should contain a few non-english language films too.

You should return the list of recommendations as a json array, like this:
[
  {
    "title": "The Godfather",
    "year": 1972,
    "shortDescription": "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
  },
  ...
]
`;

function ratingToStars(n: number) {
  return "★".repeat(Math.floor(n)) + "½".repeat(Math.round(n % 1));
}

export const getRecommendations = async (username: string) => {
  const ratings = await getRatings(username);
  const prompt = recommendationPrompt.replace(
    "{{ratings}}",
    ratings
      .map(
        (rating) =>
          `${rating.title} (${rating.year}) - ${ratingToStars(rating.rating)}`
      )
      .join("\n")
  );
  const completion = await createChatCompletion(prompt);
  return completion;
};
