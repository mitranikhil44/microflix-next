import MoviesCollection from "../components/Movie_Collection";

export default function Home(props) {

  const {
    hollywoodData,
    hollywoodAdultData,
    topHollywoodData
  } = props;

  return (
    <main>
      <MoviesCollection
        data={hollywoodData[0].data}
        collectionName={"Contents"}
        linkPath="/data/contents"
      />
      <MoviesCollection
        data={topHollywoodData[0].data}
        collectionName={"Top Contents"}
        linkPath="/data/top_contents"
      />
      <MoviesCollection
        data={hollywoodAdultData[0].data}
        collectionName={"18+ Contents"}
        linkPath="/data_18+_contents"
      />
    </main>
  );
}

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY || "https://microflix.vercel.app/";
  const page = 1; 

  try {
    const [
      hollywoodResponse,
      hollywoodAdultResponse,
      topHollywoodResponse,
    ] = await Promise.all([
      fetch(`${apiKey}api/blogs/?category=hollywood&page=${page}`),
      fetch(`${apiKey}api/blogs/?category=hollywood_adult&page=${page}`),
      fetch(`${apiKey}api/blogs/?category=top_hollywood&page=${page}`),
    ]);

    const [
      hollywoodData,
      hollywoodAdultData,
      topHollywoodData,
    ] = await Promise.all([
      hollywoodResponse.json(),
      hollywoodAdultResponse.json(),
      topHollywoodResponse.json(),
    ]);

    return {
      props: {
        hollywoodData,
        hollywoodAdultData,
        topHollywoodData,
      },
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      props: {
        hollywoodData: { data: [] },
        hollywoodAdultData: { data: [] },
        topHollywoodData: { data: [] },
      },
    };
  }
}
