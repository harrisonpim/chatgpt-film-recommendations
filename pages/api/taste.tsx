import { NextApiRequest, NextApiResponse } from "next";

import { Rating } from "@/types";
import { createChatCompletion } from "@/services/chatgpt";
import { ratingToStars } from "@/services";
import { tastePrompt } from "@/services/prompts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
  }
  if (!req.headers.ratings) {
    res.status(400).json({ message: "Missing ratings" });
  }
  try {
    const ratings: Rating[] = JSON.parse(req.headers.ratings as string);
    const prompt = tastePrompt.replace(
      "{{ratings}}",
      ratings
        .map(
          (rating) =>
            `${rating.title} (${rating.year}) - ${ratingToStars(rating.rating)}`
        )
        .join("\n")
    );

    const tasteCompletion = await createChatCompletion([
      { role: "user", content: prompt },
    ]);

    res.status(200).json({ taste: tasteCompletion });
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ message: error.message });
  }
}
