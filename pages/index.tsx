import { Rating, Recommendation } from "../types";

import Head from "next/head";
import { useState } from "react";

export default function Index() {
  const [username, setUsername] = useState("");

  const [loadingRatings, setLoadingRatings] = useState(false);
  const [ratings, setRatings] = useState<Rating[]>([]);

  const [loadingTaste, setLoadingTaste] = useState(false);
  const [taste, setTaste] = useState(null);

  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  const [error, setError] = useState(null);

  const handleGetRatings = async (username: string) => {
    setLoadingRatings(true);
    setError(null);
    try {
      const res = await fetch(`/api/ratings/${username}`);
      const data = await res.json();
      setRatings(data.ratings);
    } catch (e) {
      setError(e.message);
    }
    setLoadingRatings(false);
  };

  const handleGetTaste = async () => {
    setLoadingTaste(true);
    setError(null);
    try {
      const res = await fetch(`/api/taste`, {
        headers: {
          ratings: JSON.stringify(ratings),
        },
      });
      const data = await res.json();
      setTaste(data.taste);
    } catch (e) {
      setError(e.message);
    }
    setLoadingTaste(false);
  };

  const handleGetRecommendations = async () => {
    setLoadingRecommendations(true);
    setError(null);
    try {
      const res = await fetch(`/api/recommendations`, {
        headers: {
          ratings: JSON.stringify(ratings),
          taste: JSON.stringify(taste),
        },
      });
      const data = await res.json();
      setRecommendations(data.recommendations);
    } catch (e) {
      setError(e.message);
    }
    setLoadingRecommendations(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRatings([]);
    setTaste(null);
    setRecommendations([]);
    handleGetRatings(username).then(() => {
      handleGetTaste().then(() => {
        handleGetRecommendations();
      });
    }, console.error);
    setUsername("");
  };

  let isLoading = loadingRatings || loadingTaste || loadingRecommendations;

  return (
    <>
      <Head>
        <title>ChatGPT Film Recommendations</title>
        <meta
          name="description"
          content="A simple webapp to generate film recommendations using the ChatGPT API. Takes a letterboxd username and generates a list of film recommendations based on the RSS feed of the user's watched films."
        />
      </Head>
      <div>
        <div>
          <h1>ChatGPT Film Recommendations</h1>
          <p>
            A simple webapp to generate film recommendations using the{" "}
            <a href="https://platform.openai.com/docs/guides/chat">
              ChatGPT API
            </a>
            . Takes a letterboxd username and generates a list of film
            recommendations based on the RSS feed of the user&apos;s watched
            films.
          </p>
          <p>
            Enter your letterboxd username to get a description of your taste in
            film and a list of film recommendations.
          </p>
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="username"
              disabled={isLoading}
              onChange={(e) => setUsername(e.target.value)}
            />
            <button type="submit" disabled={isLoading}>
              {loadingRatings
                ? "Fetching letterboxd ratings..."
                : loadingTaste
                ? "Generating taste description..."
                : loadingRecommendations
                ? "Generating recommendations..."
                : "Get Recommendations"}
            </button>
          </form>

          {error && <p>{error}</p>}

          {taste && (
            <div>
              <h3>Taste</h3>
              <p>{taste}</p>

              {recommendations.length > 0 && (
                <div>
                  <h3>Recommendations</h3>
                  <ul>
                    {recommendations.map((recommendation, i) => (
                      <li key={i}>
                        <a
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
          )}
        </div>
      </div>
    </>
  );
}
