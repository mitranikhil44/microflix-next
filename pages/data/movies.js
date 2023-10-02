import ContentList from '../../components/ContentList';

const Movies = ({ initialContents }) => {

  return (
    <div>
        <ContentList category="content_movies" initialContents={initialContents} />
    </div>
  );
};

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY;
  try {
    const movies = await fetch(`${apiKey}api/blogs/?category=content_movies&page=1`, { timeout: 15000 });
    let moviesData = await movies.json();
    moviesData = moviesData[0].data || [];

    return {
      props: {
        initialContents: moviesData,
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
