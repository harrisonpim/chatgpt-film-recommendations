import { Rating } from '@/types'
import { load } from 'cheerio'

export async function getRatings(
  username: string,
  n: number = 20
): Promise<Rating[]> {
  const xml = await fetch(`https://letterboxd.com/${username}/rss`).then(
    (res) => res.text()
  )
  const $ = load(xml, { xmlMode: true })
  const ratings: Rating[] = []
  $('item').each((i, item) => {
    if (i >= n) return
    const title = $(item).find('letterboxd\\:filmTitle').text()
    const year = parseInt($(item).find('letterboxd\\:filmYear').text())
    const rating = parseFloat($(item).find('letterboxd\\:memberRating').text())
    ratings.push({ title, year, rating })
  })
  return ratings
}
