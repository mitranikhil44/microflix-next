import FetchSSRData from "../components/other/FetchSSRData";
import MoviesCollection from "../components/Movie_Collection";
import LatestContents from "../components/LatestContents";
import Script from "next/script";
import { useWebStore } from "../context/WebStore";
import { useEffect } from "react";

export default function Home({
  contentsData,
  latestContentsData,
  moviesContentData,
  webSeriesContentData,
  adultContentsData,
}) {
  const { setProgress } = useWebStore();

  useEffect(() => {
    setProgress(100);
  }, []);

  return (
    <>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-80H6K0RCMY"
        strategy="afterInteractive"
      />
      <Script>
        {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-80H6K0RCMY');
          `}
      </Script>
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
  const page = 1;

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
      adultContentsData,
    },
  };
}
