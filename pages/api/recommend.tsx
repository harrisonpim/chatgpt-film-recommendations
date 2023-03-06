import { NextApiRequest, NextApiResponse } from "next";

import { getRatings } from "@/services/letterboxd";
import { getRecommendations } from "@/services/recommend";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
  }
  const { username } = req.query;
  if (!username) {
    res.status(400).json({ message: "Missing username" });
  }
  try {
    const { taste, recommendations } = await getRecommendations(
      username as string
    );

    res.status(200).json({ taste, recommendations });
  } catch (error) {
    console.log(error);
    // @ts-ignore
    res.status(500).json({ message: error.message });
  }
}
