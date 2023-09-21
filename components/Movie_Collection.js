import React, { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const MoviesCollection = (props) => {
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    let scrollInterval;

    const startScrolling = () => {
      const container = scrollContainerRef.current;

      if (container) {
        const scrollWidth = container.scrollWidth;
        const containerWidth = container.clientWidth;

        if (scrollWidth > containerWidth) {
          let scrollPosition = 0;

          scrollInterval = setInterval(() => {
            container.scrollLeft = scrollPosition;
            scrollPosition++;

            if (scrollPosition >= scrollWidth - containerWidth) {
              scrollPosition = 0;
            }
          }, 10);
        }
      }
    };

    startScrolling();

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div>
      <Link href={props.linkPath}>
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
      <hr className="p-3" />
      <div
        ref={scrollContainerRef}
        className="flex items-center overflow-x-auto overflow-y-hidden scrollbar-thumb-rounded-md scrollbar-track-rounded-md scrollbar-thin scrollbar-thumb-[#7d5c20] scrollbar-track-gray-100"
      >
        <div className="flex">
          {props.data &&
            props.data.map((element) => (
              <Link key={element.slug} href={`/content/${element.slug}`} className="w-36">
                <div className="hover:scale-110 m-2 overflow-hidden">
                  <div>
                    <Image width="140" height="140" src={element.image} alt="Image" className="rounded-lg" />
                  </div>
                  <div className="text-center text-sm lg:text-base xl:text-lg py-3">
                    <h4>{element.title}</h4>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MoviesCollection;
