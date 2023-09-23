import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Image from "next/image";
import LoadingSpinner from "./Loading";

const ContentList = ({ category, initialContents }) => {
  const apiKey = process.env.API_KEY || "http://localhost:3000/";
  const [contents, setContents] = useState(initialContents || []);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(12);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state

  const fetchMoreData = async () => {
    try {
      const updatedSkip = skip + limit;
      const data = await fetch(`${apiKey}api/blogs/?category=${category}&skip=${updatedSkip}&limit=${limit}`);
      const parsedData = await data.json();

      if (Array.isArray(parsedData.data)) {
        setSkip(updatedSkip);
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
    // Simulate data loading
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false); // Set isLoading to false when data is available
    }, 5000); // Simulating a 2-second delay
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
            <Link key={element.slug} href={`/content/${element.slug}`} onClick={showLoading}>
              <div className="to-black relative overflow-hidden rounded-lg shadow-lg hover:scale-105 cursor-pointer transition-transform duration-300 ease-in-out ">
                <div className="overflow-hidden flex items-center justify-center">
                  <Image width="144" height="144"
                    src={element.image}
                    alt="Image"
                    className="object-cover"
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
