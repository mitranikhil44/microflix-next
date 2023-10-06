import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../styles/globals.css";
import Head from 'next/head';

function MyApp({ Component, pageProps }) {

  return (
    <div>
      <Head>
        <meta name="robots" content="index, follow" />
        <meta name="description"
          content="Microflix is a popular movie downloading website that offers a wide collection of Bollywood, Tollywood, and Hollywood movies available in Hindi." />
        <meta name="keywords"
          content="Microflix, movie download, free movies, Hollywood movies in Hindi, Bollywood movies, 2023 movies" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Microflix - 480p, 720p & 1080p Movies Download" />
        {/* <meta property="og:url" content="https://www.microflix.ml/" /> */}
        <meta property="og:description"
          content="Microflix is a popular movie downloading website that offers a wide collection of Bollywood, Tollywood, and Hollywood movies available in Hindi." />
        <meta property="og:site_name" content="Microflix" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Microflix - 480p, 720p & 1080p Movies Download" />
        <meta name="twitter:description"
          content="Microflix is a popular movie downloading website that offers a wide collection of Bollywood, Tollywood, and Hollywood movies available in Hindi." />
        <title>Microflix - 480p, 720p & 1080p Movies Download</title>
        <script async="async" data-cfasync="false" src="//pl17971947.highcpmrevenuegate.com/8a8462267705e39989e95218ff6f6dae/invoke.js"></script>
        <meta name="google-site-verification" content="HzCShkhNsHqze7KztqMUe4veQUNUHyTrDV6_7_2iWwM" />
        <meta name="google-adsense-account" content="ca-pub-4724045884570258"></meta>
      </Head>
      <Navbar />
      <div className="sm:gridClass">
        <div>
          <div className="mx-auto">
            <div className="p-[3%]">
              <Component {...pageProps} />
            </div>
          </div>
        </div>
        <div>

        </div>
      </div>
      <div className="flex justify-center items-center flex-wrap">
        <div id="container-8a8462267705e39989e95218ff6f6dae"></div>
      </div>
      <hr />
      <Footer />
    </div>
  );
}

export default MyApp;
