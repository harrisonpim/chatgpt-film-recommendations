import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Recommendation } from '../types'
import { X } from 'react-feather'
import { useState } from 'react'

type Props = {
  username: string
}

export default function Index(props: Props) {
  const [username, setUsername] = useState(props.username)
  const [loadingRatings, setLoadingRatings] = useState(false)

  const [loadingTasteProfile, setLoadingTasteProfile] = useState(false)
  const [tasteProfile, setTasteProfile] = useState(null)

  const [loadingRecommendations, setLoadingRecommendations] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])

  const [error, setError] = useState(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearResults()
    setLoadingRatings(true)
    const { ratings } = await fetch(`/api/ratings/${username}`).then((res) =>
      res.json()
    )
    setLoadingRatings(false)

    setLoadingTasteProfile(true)
    const { tasteProfile } = await fetch(`/api/taste-profile`, {
      headers: {
        ratings: JSON.stringify(ratings),
      },
    }).then((res) => res.json())
    setTasteProfile(tasteProfile)
    setLoadingTasteProfile(false)

    setLoadingRecommendations(true)
    const { recommendations } = await fetch(`/api/recommendations`, {
      headers: {
        ratings: JSON.stringify(ratings),
        taste: JSON.stringify(tasteProfile),
      },
    }).then((res) => res.json())
    setRecommendations(recommendations)
    setLoadingRecommendations(false)

    setError(null)
    return recommendations
  }

  const clearResults = () => {
    setTasteProfile(null)
    setRecommendations([])
    setError(null)
  }

  const clearState = () => {
    setUsername('')
    clearResults()
  }

  return (
    <>
      <Head>
        <title>ChatGPT Film Recommendations</title>
        <meta
          name="description"
          content="Generating film recommendations with large language models"
        />
        <link
          rel="icon"
          href={`data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🍿</text></svg>`}
        />
      </Head>
      <div>
        <div className="flex flex-row items-center justify-center gap-x-5">
          <div className="flex items-center gap-x-2">
            <Image
              src="/letterboxd.svg"
              alt="Letterboxd"
              width="40"
              height="40"
              className="dark:hidden"
            />
            <Image
              src="/letterboxd-dark.svg"
              alt="Letterboxd"
              width="40"
              height="40"
              className="hidden dark:block"
            />
            <X className="h-auto w-6" />
            <Image
              src="/openai.svg"
              alt="OpenAI"
              width="40"
              height="40"
              className="dark:invert"
            />
          </div>

          <h1 className="text-xl font-bold leading-6 tracking-normal">
            ChatGPT Film <br />
            Recommendations
          </h1>
        </div>
        <div className="mt-6 flex flex-col gap-y-4">
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="relative flex flex-row items-center justify-center">
              <input
                className="bg-gray-100 w-full rounded border border-gray px-4 py-2 text-lg text-dark-gray placeholder-gray focus:outline-none dark:border-none"
                type="text"
                placeholder="What's your letterboxd username?"
                value={username}
                disabled={
                  loadingRatings ||
                  loadingTasteProfile ||
                  loadingRecommendations
                }
                onChange={(e) => setUsername(e.target.value)}
              />
              <button
                type="reset"
                className={`absolute right-0 mr-2 text-dark-gray ${
                  (username && 'visible') || 'invisible'
                }`}
                onClick={() => clearState()}
              >
                <X className="w-6" />
              </button>
            </div>
            <div className="pt-1 text-sm text-gray dark:text-light-gray">
              {loadingRatings
                ? 'Fetching letterboxd ratings...'
                : loadingTasteProfile
                ? 'Generating a taste profile based on your ratings...'
                : loadingRecommendations
                ? 'Generating recommendations...'
                : null}
            </div>
          </form>

          {error && <p>{error}</p>}

          {tasteProfile && (
            <div>
              <h3>Taste Profile</h3>
              <p className="text-sm text-dark-gray dark:text-light-gray">
                {tasteProfile}
              </p>
            </div>
          )}

          {recommendations.length > 0 && (
            <div>
              <h3>Recommendations</h3>
              <ul className="flex list-inside list-disc flex-col gap-y-1 text-sm text-dark-gray dark:text-light-gray">
                {recommendations.map((recommendation, i) => (
                  <li key={i}>
                    <a
                      className="underline underline-offset-4	"
                      href={`https://letterboxd.com/search/films/${recommendation.title} ${recommendation.year}/?adult`}
                    >
                      {recommendation.title} ({recommendation.year})
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const username = (query.username as string) || ''
  return {
    props: {
      username,
    },
  }
}
