import MoviesCollection from "../components/Movie_Collection";

export default function Home(props) {
  const { hollywoodData, hollywoodAdultData, bollywoodData, bollywoodAdultData } = props;
  console.log();
  return (
    <main>
      <MoviesCollection data={hollywoodData.data} collectionName={"Other Country Content"} linkPath="/data/other_country_content" />
      <MoviesCollection data={hollywoodAdultData.data} collectionName={"Other Country 18+ Content"} linkPath="/data/other_country_18+_content" />
      <MoviesCollection data={bollywoodData.data} collectionName={"Indian Content"} linkPath="/data/indian_content" />
      <MoviesCollection data={bollywoodAdultData.data} collectionName={"Indian 18+ Content"} linkPath="/data/indian_18+_content" />
    </main>
  );
}

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY || "https://microflix.vercel.app/";
  try {
    const skip = 0;
    const limit = 12;
      // Use the apiKey variable here
      const hResponse = await fetch(`${apiKey}api/blogs/?category=hollywood&skip=${skip}&limit=${limit}`);
      const bResponse = await fetch(`${apiKey}api/blogs/?category=bollywood&skip=${skip}&limit=${limit}`);
      const hAdultResponse = await fetch(`${apiKey}api/blogs/?category=hollywood/adult&skip=${skip}&limit=${limit}`);
      const bAdultResponse = await fetch(`${apiKey}api/blogs/?category=bollywood/adult&skip=${skip}&limit=${limit}`);
      const hollywoodData = await hResponse.json();
      const bollywoodData = await bResponse.json();
      const hollywoodAdultData = await hAdultResponse.json();
      const bollywoodAdultData = await bAdultResponse.json();

    return {
      props: { hollywoodData, bollywoodData, hollywoodAdultData, bollywoodAdultData },
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
