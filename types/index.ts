export type Recommendation = {
  title: string
  year: string
}
export type Message = {
  role: 'user' | 'assistant' | 'system'
  content: string
}
export type Rating = {
  title: string
  year: number
  rating: number
}
