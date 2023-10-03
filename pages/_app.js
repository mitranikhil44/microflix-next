import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "../styles/globals.css";

export const metadata = {
  title: 'Coder Bugs',
  description: 'A blog for a coder by a coder',
  scriptTag:
    '<script async="async" data-cfasync="false" src="//revelationschemes.com/8a8462267705e39989e95218ff6f6dae/invoke.js"></script>',
  metaTag: '<meta name="google-site-verification" content="HzCShkhNsHqze7KztqMUe4veQUNUHyTrDV6_7_2iWwM" />'
};


function MyApp({ Component, pageProps }) {

  return (
    <div>
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
