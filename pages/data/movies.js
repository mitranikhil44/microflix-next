import ContentList from '../../components/ContentList';

const Movies = ({ otherMovies, indianMovies }) => {

  return (
    <div>
        <ContentList category="hollywood/movies" initialContents={otherMovies} />

        <ContentList category="bollywood/movies" initialContents={indianMovies} />
    </div>
  );
};

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY;
  try {
    const hData = await fetch(`${apiKey}api/blogs/?category=hollywood/movies&skip=0&limit=12`);
    const bData = await fetch(`${apiKey}api/blogs/?category=bollywood/movies&skip=0&limit=12`);
    let hMovies = await hData.json();
    let bMovies = await bData.json();
    hMovies = hMovies.data || [];
    bMovies = bMovies.data || [];

    return {
      props: {
        otherMovies: hMovies,
        indianMovies: bMovies
      },
    };
  } catch (error) {
    return {
      props: {
        otherMovies: [], // Provide a default empty array if there's an error
        indianMovies: [], // Provide a default empty array if there's an error
      },
    };
  }
}

export default Movies;
