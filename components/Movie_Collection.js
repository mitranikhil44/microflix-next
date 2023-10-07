import React, { useState, useEffect } from "react";
import LoadingSpinner from "./Loading";
import Image from "next/image";
import Link from "next/link";

const MoviesCollection = ({ data, linkPath, collectionName }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemWidth = 180; // Adjust as needed

  useEffect(() => {
    const scrollInterval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        (prevIndex + 1) % data.length
      );
    }, 3000); // Adjust the interval time

    return () => clearInterval(scrollInterval);
  }, [data]);

  const showLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };

  const renderMovieCards = () => {
    return data.map((element, index) => (
      <Link key={element.slug} href={`/${element.slug}`} onClick={showLoading}>
        <div
          className={`border rounded-lg p-2 hover:shadow-md ${
            index === currentIndex ? "border-green-500" : "border-gray-300"
          }`}
        >
          <div className="relative">
            <Image
              width={144}
              height={144}
              src={element.image}
              alt="Image"
              className="w-40 h-56 cropped-image rounded-lg"
            />
            <p
              className={`IMDB rounded-tl-lg absolute top-0 left-0 p-1 text-white ${
                getRatingColor(element.imdb[0])
              }`}
            >
              {parseFloat(element.imdb[0].match(/[\d.]+/)[0]).toFixed(1)}
            </p>
          </div>
        </div>
      </Link>
    ));
  };

  const getRatingColor = (rating) => {
    // Implement your logic for rating-based colors here
    const imdbRating = parseFloat(rating.match(/[\d.]+/)[0]);
    if (imdbRating >= 9) {
      return "bg-green-700";
    } else if (imdbRating >= 8) {
      return "bg-green-600";
    } else if (imdbRating >= 7) {
      return "bg-green-500";
    } else {
      return "bg-red-500";
    }
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
      <hr className="p-1" />
      <div className="overflow-x-auto overflow-y-hidden h-60 relative">
        <div
          className="flex absolute scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-thin scrollbar-thumb-[#7d5c20] scrollbar-track-gray-100"
          style={{
            width: `${data.length * itemWidth * 4}px`,
            left: `-${currentIndex * itemWidth}px`,
            transition: "left 1s linear",
          }}
        >
          {renderMovieCards()}
        </div>
      </div>
    </div>
  );
};

export default MoviesCollection;
