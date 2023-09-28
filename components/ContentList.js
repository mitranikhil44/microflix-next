import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Image from "next/image";
import LoadingSpinner from "./Loading";

const ContentList = ({ category, initialContents }) => {
  const apiKey = process.env.API_KEY || "http://localhost:3000/";
  const [contents, setContents] = useState(initialContents || []);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const fetchMoreData = async () => {
    try {
      const nextPage = page + 1; // Increment the page
      const data = await fetch(`${apiKey}api/blogs/?category=${category}&page=${nextPage}`, { timeout: 15000 });
      const parsedData = await data.json();

      if (Array.isArray(parsedData.data)) {
        setPage(nextPage); // Update the page state
        setContents([...contents, ...parsedData.data]);
        if (contents.length + limit >= parsedData.data) {
          setHasMore(false);
        }
      } else {
        console.error("Fetched data does not contain an array of contents:", parsedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (initialContents && initialContents.length === 0) {
      setHasMore(false);
    }
  }, [initialContents]);

  const showLoading = async () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  }

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      <InfiniteScroll
        dataLength={contents.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4 className='text-center my-[2%]'>Loading...</h4>}
      >
        <div className="grid grid-cols-2 mt-4 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 overflow-hidden">
          {contents && contents.map((element) => (
            <Link key={element.slug} href={`/${element.slug}`} onClick={showLoading} className='p-4'>
              <div className="to-black relative overflow-hidden rounded-lg shadow-lg cursor-pointer transition-transform duration-300 ease-in-out ">
                <div className="overflow-hidden flex items-center justify-center">
                  <Image width="144" height="144"
                    src={element.image}
                    alt="Image"
                    className="object-cover hover:scale-110 overflow-hidden"
                  />
                </div>
                <div className="text-center mt-2">
                  <h4 className="text-sm font-semibold mb-2">{element.title}</h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default ContentList;
