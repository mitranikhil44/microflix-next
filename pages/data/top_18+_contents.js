import ContentList from '../../components/ContentList';

const Other_Country_18_Content = ({ initialContents }) => {
  return (
    <div>
      <ContentList category="top_content_adult" initialContents={initialContents} />
    </div>
  );
};

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY;
  try {
    const topAdult = await fetch(`${apiKey}api/blogs/?category=top_content_adult&page=1`, { timeout: 15000 });
    let topAdultData = await topAdult.json();
    topAdultData = topAdultData[0].data
    return {
      props: { initialContents: topAdultData },
    };
  } catch (error) {
    return {
      props: {
        initialContents: { files: [], count: 0, total: 0 },
      },
    };
  }
}

export default Other_Country_18_Content;
