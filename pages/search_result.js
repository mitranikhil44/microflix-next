import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from "next/image";
import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

const Search_Result = () => {
  const router = useRouter();
  const { data, searchResult } = router.query;

  const parsedSearchResult = searchResult ? JSON.parse(searchResult) : { suggestions: [] };
  
  // Initialize state for displaying items and tracking the page number
  const [items, setItems] = useState(parsedSearchResult.suggestions.slice(0, 12));
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  // Function to load more items when scrolling
  const loadMoreItems = () => {
    const nextPage = page + 1;
    const startIndex = (nextPage - 1) * itemsPerPage;
    const endIndex = nextPage * itemsPerPage;

    if (startIndex < parsedSearchResult.suggestions.length) {
      const newItems = parsedSearchResult.suggestions.slice(startIndex, endIndex);
      setItems([...items, ...newItems]);
      setPage(nextPage);
    }
  };

  return (
    <>
      <h1><strong>Movie Results for: </strong>{data}</h1>
      <InfiniteScroll
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={items.length < parsedSearchResult.suggestions.length}
        loader={<h4>Loading...</h4>}
      >
        <div className="grid grid-cols-2 mt-4 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 overflow-hidden">
          {items.map((element) => (
            <Link key={element.slug} href={`/content/${element.slug}`}>
              <div className="to-black relative overflow-hidden rounded-lg shadow-lg hover:scale-105 cursor-pointer transition-transform duration-300 ease-in-out h-[100%]">
                {element.image ? (
                  <div className="w-full overflow-hidden flex items-center justify-center cropped-image">
                    <Image width="140" height="140"
                      src={element.image}
                      alt="Image"
                      className="object-cover w-full"
                    />
                  </div>
                ) : (
                  // Handle missing image or provide a placeholder
                  <div className="w-full h-40 flex items-center justify-center">
                    <p>Image not available</p>
                  </div>
                )}
                <div className="text-center mt-2">
                  <h4 className="text-sm font-semibold mb-2">{element.title}</h4>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default Search_Result;
