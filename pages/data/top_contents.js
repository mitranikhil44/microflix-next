import ContentList from '../../components/ContentList';

const Other_Country_Content = ({ initialContents }) => {
  return (
    <div>
      <ContentList category="top_hollywood" initialContents={initialContents} />
    </div>
  );
};

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY;
  try {
    const topContents = await fetch(`${apiKey}api/blogs/?category=top_hollywood&page=1`, { timeout: 15000 });
    const topContentsData = await topContents.json();
    topContentsData = topContentsData[0].data || [];
    return {
      props: { initialContents: topContentsData },
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
