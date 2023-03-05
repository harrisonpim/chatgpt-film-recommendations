import { NextApiRequest, NextApiResponse } from "next";

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
    const recommendations = await getRecommendations(username as string);
    res.status(200).json({ recommendations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
