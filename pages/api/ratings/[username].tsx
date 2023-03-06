import { NextApiRequest, NextApiResponse } from "next";

import { getRatings } from "@/services/letterboxd";

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
    const ratings = await getRatings(username as string);
    res.status(200).json({ ratings });
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ message: error.message });
  }
}
