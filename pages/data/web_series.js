import ContentList from '../../components/ContentList';

const Web_Series = ({ initialContents }) => {

  return (
    <div>
        <ContentList category="content_seasons" initialContents={initialContents} />
    </div>
  );
};

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY;
  try {
    const webSeries = await fetch(`${apiKey}api/blogs/?category=content_seasons&page=1`, { timeout: 15000 });
    let webSeriesData = await webSeries.json();
    webSeriesData = webSeriesData[0].data || [];

    return {
      props: {
        initialContents: webSeriesData,
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
