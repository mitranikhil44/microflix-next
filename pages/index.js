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

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY || "https://microflix.vercel.app/";
  const page = 1; 

  try {
    const [
      hollywoodResponse,
      hollywoodAdultResponse,
    ] = await Promise.all([
      fetch(`${apiKey}api/blogs/?category=hollywood&page=${page}`),
      fetch(`${apiKey}api/blogs/?category=hollywood/adult&page=${page}`),
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
