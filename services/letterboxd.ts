import { load } from "cheerio";

export type Rating = {
  title: string;
  year: number;
  rating: number;
};

export async function getRatings(
  username: string,
  n: number = 10
): Promise<Rating[]> {
  const xml = await fetch(`https://letterboxd.com/${username}/rss`).then(
    (res) => res.text()
  );
  const $ = load(xml, { xmlMode: true });
  const ratings: Rating[] = [];
  $("item").each((i, item) => {
    if (i >= n) return;
    const title = $(item).find("letterboxd\\:filmTitle").text();
    const year = parseInt($(item).find("letterboxd\\:filmYear").text());
    const rating = parseInt($(item).find("letterboxd\\:memberRating").text());
    ratings.push({ title, year, rating });
  });
  return ratings;
}
