import ContentList from '../../components/ContentList';

const Web_Series = ({ initialContents }) => {

  return (
    <div>
        <ContentList category="top_hollywood_seasons" initialContents={initialContents} />
    </div>
  );
};

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY;
  try {
    const topSeries = await fetch(`${apiKey}api/blogs/?category=top_hollywood_seasons&page=1`, { timeout: 15000 });
    let topSeriesData = await topSeries.json();
    topSeriesData = topSeriesData[0].data || [];

    return {
      props: {
        initialContents: topSeriesData,
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

export default Web_Series;
