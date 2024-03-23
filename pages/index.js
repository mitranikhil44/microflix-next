import FetchSSRData from '../components/other/FetchSSRData';
import MoviesCollection from '../components/Movie_Collection';
import LatestContents from '../components/LatestContents';
import Head from 'next/head';

export default function Home({
  contentsData,
  latestContentsData,
  moviesContentData,
  webSeriesContentData,
  adultContentsData
}) {
  return (
    <>
      <Head>
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-80H6K0RCMY"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-80H6K0RCMY');
          `}
        </script> */}
      </Head>
      <section>
        <LatestContents data={latestContentsData[0].data} />
      </section>
      <section>
        <MoviesCollection
          data={contentsData[0].data}
          collectionName="Contents"
        />
        <MoviesCollection
          data={moviesContentData[0].data}
          collectionName="Movies Contents"
        />
        <MoviesCollection
          data={webSeriesContentData[0].data}
          collectionName="Web Series Content"
        />
        <MoviesCollection
          data={adultContentsData[0].data}
          collectionName="Adult Content"
        />
      </section>
    </>
  );
}

export async function getServerSideProps() {
  const page = 1; // Or whatever page you want to fetch
  const contentsData = await FetchSSRData(page, "contents");
  const latestContentsData = await FetchSSRData(page, "latest_contents");
  const moviesContentData = await FetchSSRData(page, "content_movies");
  const webSeriesContentData = await FetchSSRData(page, "content_seasons");
  const adultContentsData = await FetchSSRData(page, "content_adult");

  return {
    props: {
      contentsData,
      latestContentsData,
      moviesContentData,
      webSeriesContentData,
      adultContentsData
    }
  };
}
