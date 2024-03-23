import PaginationButton from "../../../components/other/PaginationButton";
import FetchSSRData from "../../../components/other/FetchSSRData";
import ContentList from "../../../components/ContentList";
import Head from "next/head";

export default function NextPage({ contents, totalPages, currentPage, category }) {
  return (
    <>
      <Head>
        {/* Ads Script */}
        <script
          type="text/javascript"
          src="//pl17869772.toprevenuegate.com/84/84/ce/8484cef01a310a80e4ea6f32c0a15daa.js"
        ></script>
      </Head>
      <div>
        <ContentList contents={contents} />
        <PaginationButton
          totalPages={totalPages}
          page={currentPage}
          category={category}
        />
      </div>
    </>
  );
}

export async function getServerSideProps({ query }) {
    const { page, category } = query; 
    const currentPage = page ? parseInt(page) : 2;
    try {
      const contents = await FetchSSRData(currentPage, category); 
      const totalPages = contents[0].totalPages;
      return { props: { contents, totalPages, currentPage, category } };
    } catch (error) {
      console.error("Error fetching data:", error);
      return { props: { contents: [], currentPage: 1 } };
    }
  }
  