export const tastePrompt = `Here's a list of films, with ratings:

{{ratings}}

Based on that list, describe the characteristics of the films which this person enjoys, and what's important to them when choosing a film to watch.
`;

export const recommendationPrompt = `Based on those characteristics and the user's reviews, suggest a list of 10 films which this person should watch next.

Your response should be formatted as a json array of suggestions, like this:
[
  {
    "title": "The Godfather",
    "year": 1972
  },
  ...
]

Responses which do not follow this format exactly will be rejected. Do not include any other information in your response. Make sure the JSON is valid, and that the array contains exactly 10 items.
`;
