import PaginationButton from '../../components/other/PaginationButton';
import FetchSSRData from '../../components/other/FetchSSRData';
import ContentList from '../../components/ContentList';

const TopWebSeries = ({ contents, page, totalPages }) => {
  return (
    <div>
      <ContentList contents={contents} />
      <PaginationButton totalPages={totalPages} page={page} category={"top_content_seasons"}/>
    </div>
  );
};

export async function getServerSideProps() {
  const page = 1; 
  try {
    const contents = await FetchSSRData(page, "top_content_seasons");
    const totalPages = contents[0].totalPages;
    return { props: { contents, page, totalPages } }; 
  } catch (error) {
    console.error("Error fetching data:", error);
    return { props: { contents: [], page: 1 } }; 
  }
}

export default TopWebSeries;
