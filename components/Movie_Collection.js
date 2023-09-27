import React, { useState, useEffect, useRef } from "react";
import LoadingSpinner from "./Loading";
import Image from "next/image";
import Link from "next/link";

const MoviesCollection = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const itemWidth = 140; // Assuming each item width is 140px
  const containerRef = useRef(null);
  const dataLength = props.data.length;
  const [displayedData, setDisplayedData] = useState([]);
  const itemsPerPage = 26;

  useEffect(() => {
    if (dataLength > 0) {
      const scrollInterval = setInterval(() => {
        setScrollPosition((prevPosition) => {
          const newPosition = prevPosition + itemWidth;
          if (newPosition >= dataLength * itemWidth) {
            // Reached the end, reset to the beginning
            return 0;
          }
          return newPosition;
        });
      }, 2000);

      return () => clearInterval(scrollInterval);
    }
  }, [dataLength]);

  useEffect(() => {
    // Load and display initial data
    loadMoreData();
  }, []);

  const showLoading = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };

  const loadMoreData = () => {
    // Calculate the range of items to load
    const startIndex = Math.max(0, displayedData.length - itemsPerPage);
    const endIndex = displayedData.length + itemsPerPage;
    
    // Slice the new data to be displayed
    const newData = props.data.slice(startIndex, endIndex).map((element) => (
      <Link key={element.slug} href={`/content/${element.slug}`} onClick={showLoading}>
        <div className="m-[2%] overflow-hidden">
          <div>
            <Image width="150" height="200" src={element.image} alt="Image" className="cropped-image hover:scale-110 overflow-hidden rounded-lg" />
          </div>
        </div>
      </Link>
    ));

    // Update the displayed data with the new data
    setDisplayedData((prevData) => [...prevData, ...newData]);
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      <Link href={props.linkPath} onClick={showLoading}>
        <div className="flex justify-between items-center m-2">
          <h3 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl m-2">
            {props.collectionName}
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
      <div className="overflow-x-scroll overflow-y-hidden h-60 relative">
        <div
          ref={containerRef}
          className="flex absolute scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-thin scrollbar-thumb-[#7d5c20] scrollbar-track-gray-100"
          style={{
            width: `${dataLength * itemWidth * 4}px`,
            left: `-${scrollPosition}px`,
            transition: "left 1s linear",
          }}
        >
          {displayedData}
        </div>
      </div>
    </div>
  );
};

export default MoviesCollection;
