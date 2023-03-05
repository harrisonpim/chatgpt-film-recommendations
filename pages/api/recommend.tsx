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
    const parsedRecommendations = JSON.parse(recommendations);
    res.status(200).json({ recommendations: parsedRecommendations });
  } catch (error) {
    console.log(error);
    // @ts-ignore
    res.status(500).json({ message: error.message });
  }
}
