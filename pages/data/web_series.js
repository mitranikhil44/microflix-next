import ContentList from '../../components/ContentList';

const Web_Series = ({ otherSeasons, indianSeasons }) => {

  return (
    <div>
        <ContentList category="hollywood/movies" initialContents={otherSeasons} />
    </div>
  );
};

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY;
  try {
    const hData = await fetch(`${apiKey}api/blogs/?category=hollywood/seasons&skip=0&limit=12`);
    let hSeasons = await hData.json();
    hSeasons = hSeasons.data || [];

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
