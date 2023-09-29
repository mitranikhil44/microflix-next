import ContentList from '../../components/ContentList';

const Web_Series = ({ otherSeasons }) => {

  return (
    <div>
        <ContentList category="hollywood_movies" initialContents={otherSeasons} />
    </div>
  );
};

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY;
  try {
    const hData = await fetch(`${apiKey}api/blogs/?category=hollywood_seasons&page=1`, { timeout: 15000 });
    let hSeasons = await hData.json();
    hSeasons = hSeasons[0].data || [];

    return {
      props: {
        otherSeasons: hSeasons,
      },
    };
  } catch (error) {
    return {
      props: {
        otherSeasons: [], // Provide a default empty array if there's an error
      },
    };
  }
}

export default Web_Series;
