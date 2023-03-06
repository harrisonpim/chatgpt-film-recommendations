import { Message, Rating } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import { recommendationPrompt, tasteProfilePrompt } from '@/services/prompts'

import { createChatCompletion } from '@/services/chatgpt'
import { ratingToStars } from '@/services'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' })
  }
  if (!req.headers.ratings) {
    res.status(400).json({ message: 'Missing ratings' })
  }
  if (!req.headers.taste) {
    res.status(400).json({ message: 'Missing taste' })
  }
  try {
    const ratings: Rating[] = JSON.parse(req.headers.ratings as string)
    const taste: string = req.headers.taste as string
    const prompt = tasteProfilePrompt.replace(
      '{{ratings}}',
      ratings
        .map(
          (rating) =>
            `${rating.title} (${rating.year}) - ${ratingToStars(rating.rating)}`
        )
        .join('\n')
    )
    let messages: Message[] = [
      { role: 'user', content: prompt },
      { role: 'assistant', content: taste },
      { role: 'user', content: recommendationPrompt },
    ]
    console.log({ messages })
    
    const recommendationCompletion = await createChatCompletion(messages)
    const recommendations = JSON.parse(recommendationCompletion)
    console.log({ recommendations })

    res.status(200).json({ recommendations })
  } catch (error) {
    // @ts-ignore
    res.status(500).json({ message: error.message })
  }
}
