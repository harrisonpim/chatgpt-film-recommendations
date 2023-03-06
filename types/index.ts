export type Recommendation = {
  title: string
  year: string
}
export type Message = {
  role: 'user' | 'assistant'
  content: string
}
export type Rating = {
  title: string
  year: number
  rating: number
}
