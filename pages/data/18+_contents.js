import ContentList from '../../components/ContentList';

const Other_Country_18_Content = ({ initialContents }) => {
  return (
    <div>
      <ContentList category="content_adult" initialContents={initialContents} />
    </div>
  );
};

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY;
  try {
    const adult = await fetch(`${apiKey}api/blogs/?category=content_adult&page=1`, { timeout: 15000 });
    let adultData = await adult.json();
    adultData = adultData[0].data || [];
    return {
      props: { initialContents: adultData },
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
