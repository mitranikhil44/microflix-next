import React, { useState } from "react";
import LoadingSpinner from "./Loading";
import Link from "next/link";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Import carousel styles
import { Carousel } from "react-responsive-carousel";
import styles from "./MoviesCollection.module.css";

const MoviesCollection = ({ data, linkPath, collectionName }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      <Link href={linkPath} onClick={showLoading}>
        <div className="flex justify-between items-center m-2">
          <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl m-2">
            {collectionName}
          </h3>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-right cursor-pointer hover:opacity-80 w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 2xl:w-8 2xl:h-8"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              />
            </svg>
          </div>
        </div>
      </Link>
      <hr className="p-[1%]" />
      <div className={styles.carouselContainer}>
        <Carousel>
          {data.map((element) => (
            <Link key={element.slug} href={`/${element.slug}`} onClick={showLoading}>
              <div className={`${styles.movieCard}`}>
                <div className={styles.movieImage}>
                  <img
                    width={144}
                    height={144}
                    src={element.image}
                    alt="Image"
                    className="w-40 h-56 cropped-image rounded-lg"
                  />
                </div>
                <div className={`${styles.imdbRating} ${getRatingColor(element.imdb[0])}`}>
                  {parseFloat(element.imdb[0].match(/[\d.]+/)[0]).toFixed(1)}
                </div>
              </div>
            </Link>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default MoviesCollection;
