import MoviesCollection from "../components/Movie_Collection";

export default function Home(props) {
  const {
    hollywoodData,
    hollywoodAdultData,
    bollywoodData,
    bollywoodAdultData,
  } = props;

  return (
    <main>
      <MoviesCollection
        data={hollywoodData.data}
        collectionName={"Other Country Content"}
        linkPath="/data/other_country_content"
      />
      <MoviesCollection
        data={hollywoodAdultData.data}
        collectionName={"Other Country 18+ Content"}
        linkPath="/data/other_country_18+_content"
      />
      <MoviesCollection
        data={bollywoodData.data}
        collectionName={"Indian Content"}
        linkPath="/data/indian_content"
      />
      <MoviesCollection
        data={bollywoodAdultData.data}
        collectionName={"Indian 18+ Content"}
        linkPath="/data/indian_18+_content"
      />
    </main>
  );
}

export async function getServerSideProps({ query }) {
  const apiKey = process.env.API_KEY || "http://localhost:3000/";
  const skip = parseInt(query.skip) || 0; // Get the skip value from query parameters
  const limit = 12;

  try {
    const [
      hollywoodResponse,
      bollywoodResponse,
      hollywoodAdultResponse,
      bollywoodAdultResponse,
    ] = await Promise.all([
      fetch(`${apiKey}api/blogs/?category=hollywood&skip=${skip}&limit=${limit}`),
      fetch(`${apiKey}api/blogs/?category=bollywood&skip=${skip}&limit=${limit}`),
      fetch(`${apiKey}api/blogs/?category=hollywood/adult&skip=${skip}&limit=${limit}`),
      fetch(`${apiKey}api/blogs/?category=bollywood/adult&skip=${skip}&limit=${limit}`),
    ]);

    const [
      hollywoodData,
      bollywoodData,
      hollywoodAdultData,
      bollywoodAdultData,
    ] = await Promise.all([
      hollywoodResponse.json(),
      bollywoodResponse.json(),
      hollywoodAdultResponse.json(),
      bollywoodAdultResponse.json(),
    ]);

    return {
      props: {
        hollywoodData,
        bollywoodData,
        hollywoodAdultData,
        bollywoodAdultData,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      props: {
        hollywoodData: { data: [] },
        bollywoodData: { data: [] },
        hollywoodAdultData: { data: [] },
        bollywoodAdultData: { data: [] },
      },
    };
  }
}
