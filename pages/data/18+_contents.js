import ContentList from '../../components/ContentList';

const Other_Country_18_Content = ({ initialContents }) => {
  return (
    <div>
      <ContentList category="hollywood/adult" initialContents={initialContents.data} />
    </div>
  );
};

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY;
  try {
    const data = await fetch(`${apiKey}api/blogs/?category=hollywood/adult&page=1`, { timeout: 15000 });
    const movies = await data.json();
    return {
      props: { initialContents: movies },
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
