import Head from "next/head";
import { useState } from "react";

type Recommendation = {
  title: string;
  year: string;
  shortDescription?: string;
};

export default function Index() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [taste, setTaste] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (username: string) => {
    setRecommendations([]);
    setError(null);
    setLoading(true);
    const apiResponse = await fetch(`/api/recommend?username=${username}`);
    if (!apiResponse.ok) {
      const { message } = await apiResponse.json();
      setLoading(false);
      setError(message);
    } else {
      const { taste, recommendations } = await apiResponse.json();
      setLoading(false);
      setTaste(taste);
      setRecommendations(recommendations as Recommendation[]);
    }
  };

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
        </div>
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e.currentTarget.username.value);
            }}
          >
            <label htmlFor="username">Letterboxd Username</label>
            <input type="text" name="username" />
            <button type="submit">Submit</button>
          </form>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          {recommendations.length > 0 && (
            <div>
              <h2>Recommendations</h2>
              <p>
                {taste}
              </p>
              <ul>
                {recommendations.map((recommendation: Recommendation, i) => (
                  <li key={i}>
                    <p>
                      {recommendation.title} ({recommendation.year})
                      <br />
                      {recommendation.shortDescription}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
