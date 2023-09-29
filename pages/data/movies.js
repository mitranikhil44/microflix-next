import ContentList from '../../components/ContentList';

const Movies = ({ otherMovies }) => {

  return (
    <div>
        <ContentList category="hollywood_movies" initialContents={otherMovies} />
    </div>
  );
};

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY;
  try {
    const hData = await fetch(`${apiKey}api/blogs/?category=hollywood_movies&page=1`, { timeout: 15000 });
    let hMovies = await hData.json();
    hMovies = hMovies[0].data || [];

    return {
      props: {
        otherMovies: hMovies,
      },
    };
  } catch (error) {
    return {
      props: {
        otherMovies: [], // Provide a default empty array if there's an error
      },
    };
  }
}

export default Movies;
