import ContentList from '../../components/ContentList';

const Other_Country_Content = ({ initialContents }) => {
  return (
    <div>
      <ContentList category="hollywood" initialContents={initialContents} />
    </div>
  );
};

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY;
  try {
    const contents = await fetch(`${apiKey}api/blogs/?category=hollywood&page=1`, { timeout: 15000 });
    let contentsData = await contents.json();
    contentsData = contentsData[0].data || [];
    return {
      props: { initialContents: contentsData },
    };
  } catch (error) {
    return {
      props: {
        initialContents: { files: [], count: 0, total: 0 },
      },
    };
  }
}

export default Other_Country_Content;
