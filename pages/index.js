import MoviesCollection from "../components/Movie_Collection";

export default function Home(props) {

  const {
    hollywoodData,
    hollywoodAdultData
  } = props;


  return (
    <main>
      <MoviesCollection
        data={hollywoodData.data}
        collectionName={"Contents"}
        linkPath="/data/contents"
      />
      <MoviesCollection
        data={hollywoodAdultData.data}
        collectionName={"18+ Contents"}
        linkPath="/data/18+_contents"
      />
    </main>
  );
}

export async function getServerSideProps({ query }) {
  const apiKey = process.env.API_KEY || "https://microflix.vercel.app/";
  const skip = parseInt(query.skip) || 0; // Get the skip value from query parameters
  const limit = 24;

  try {
    const [
      hollywoodResponse,
      hollywoodAdultResponse,
    ] = await Promise.all([
      fetch(`${apiKey}api/blogs/?category=hollywood&skip=${skip}&limit=${limit}`, { timeout: 15000 }),
      fetch(`${apiKey}api/blogs/?category=hollywood/adult&skip=${skip}&limit=${limit}`, { timeout: 15000 }),
    ]);

    const [
      hollywoodData,
      hollywoodAdultData,
    ] = await Promise.all([
      hollywoodResponse.json(),
      hollywoodAdultResponse.json(),
    ]);

    return {
      props: {
        hollywoodData,
        hollywoodAdultData,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      props: {
        hollywoodData: { data: [] },
        hollywoodAdultData: { data: [] },
      },
    };
  }
}
