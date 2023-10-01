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
          {items.map((element) => {
            const imdbRating = parseFloat(element.imdb?.[0]?.match(/[\d.]+/) || '0');
            return(
            <Link key={element.slug} href={`/${element.slug}`}>
              <div className="to-black relative overflow-hidden rounded-lg shadow-lg hover:scale-105 cursor-pointer transition-transform duration-300 ease-in-out h-[100%]">
                {element.image ? (
                  <div className="w-full overflow-hidden flex items-center justify-center">
                    <div className="relative">
                    <Image width="140" height="140"
                      src={element.image}
                      alt="Image"
                      className="object-cover w-full"
                    />
                    <p className={`z-10 IMDB rounded-tl-lg absolute top-0 left-0 overflow-hidden p-[1%] text-white ${imdbRating >= 9 ? 'bg-green-700' : imdbRating >= 8 ? "bg-green-600": imdbRating >= 7 ? "bg-green-500": imdbRating >= 6.5 ? "bg-yellow-700": imdbRating >= 6 ? "bg-yellow-600": imdbRating >= 5.5 ? "bg-yellow-500": imdbRating >= 5 ? "bg-red-500": imdbRating >= 4.5 ? "bg-red-600": "bg-red-700"}`}>
                {imdbRating.toFixed(1)}
              </p>
                    </div>
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
          )})}
        </div>
      </InfiniteScroll>
    </>
  );
};

export default Search_Result;
