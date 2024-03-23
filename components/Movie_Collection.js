"use client"

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination } from 'swiper/modules';

const MoviesCollection = ({ data, collectionName, linkPath }) => {
  const getRatingColor = (rating) => {
    const imdbRating = rating ? parseFloat(rating) : 0;

    switch (true) {
      case imdbRating >= 9:
        return 'bg-green-800';
      case imdbRating >= 8:
        return 'bg-green-500';
      case imdbRating >= 7:
        return "bg-yellow-700"
      case imdbRating >= 6:
        return "bg-orange-700"
      case imdbRating >= 5:
        return 'bg-orange-500';
      case imdbRating >= 4:
        return "bg-red-500";
      case imdbRating >= 3:
        return "bg-red-800";
      default:
        return "bg-gray-500";
    }
  };
  return (
    <>
      <div>
        <Link href="/data/contents">
          <h2 className="xl:text-3xl lg:text-2xl md:text-xl smd:text-lg text-sm text-white my-4">{collectionName}</h2>
        </Link>
      </div>
      <div>
        <Swiper
          slidesPerView={3}
          spaceBetween={10}
          freeMode={true}
          pagination={{
            clickable: true,
          }}
          breakpoints={{
            420: { slidesPerView: 2 },
            600: { slidesPerView: 3 },
            756: { slidesPerView: 3 },
            1080: { slidesPerView: 4 },
            1260: { slidesPerView: 5 },
            1560: { slidesPerView: 6 },
            1984: { slidesPerView: 8 },
          }}
          modules={[FreeMode, Pagination]}
          className="mySwiper"
        >
          {data &&
            data.map((element, index) => (
              <SwiperSlide key={index}>
                <Link href={element.slug}>
                  <div className="mx-2 flex flex-col justify-center items-center hover:scale-105 cursor-pointer">
                    <div className="relative h-60 -z-10">
                      <Image
                        width={144}
                        height={144}
                        src={element.image}
                        alt={element.title.replace(/Download/, "").trim()}
                        className="hover:scale-95 rounded-lg w-auto h-auto"
                        style={{ clipPath: 'polygon(0 10%, 100% 10%, 100% 100%, 0% 100%)' }}
                      />
                      <div
                        className={`absolute top-0 left-0 p-1 font-bold text-sm bg-opacity-50 rounded-tl-md ${getRatingColor(element.imdbDetails && element.imdbDetails.imdbRating ? element.imdbDetails.imdbRating.rating != null ? element.imdbDetails.imdbRating.rating : 0 : 0)}`}
                      >
                        <p>{element.imdbDetails && element.imdbDetails.imdbRating ? element.imdbDetails.imdbRating.rating != null ? element.imdbDetails.imdbRating.rating : 0 : 0}</p>
                        <p>{element.imdbDetails && element.imdbDetails.imdbRating ? element.imdbDetails.imdbRating.votes != null ? element.imdbDetails.imdbRating.votes : 0 : 0}</p>
                      </div>
                    </div>
                  </div>
                    <p className="z-50 text-center font-light text-xs mt-[4%] md:text-sm ">{element.title}</p>
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </>
  );
};

export default MoviesCollection;