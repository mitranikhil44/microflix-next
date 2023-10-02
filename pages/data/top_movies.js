import ContentList from '../../components/ContentList';

const Movies = ({ initialContents }) => {

  return (
    <div>
        <ContentList category="top_content_movies" initialContents={initialContents} />
    </div>
  );
};

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY;
  try {
    const topmovies = await fetch(`${apiKey}api/blogs/?category=top_content_movies&page=1`, { timeout: 15000 });
    let topMoviesData = await topmovies.json();
    topMoviesData = topMoviesData[0].data || [];

    return {
      props: {
        initialContents: topMoviesData,
      },
    };
  } catch (error) {
    return {
      props: {
        initialContents: [], // Provide a default empty array if there's an error
      },
    };
  }
}

export default Movies;
