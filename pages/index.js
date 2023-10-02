import React from 'react';
import MoviesCollection from '../components/Movie_Collection';

export default function Home(props) {
  const categories = [
    { data: props.contentsData, collectionName: 'Contents', linkPath: '/data/contents' },
    { data: props.topContentsData, collectionName: 'Top Contents', linkPath: '/data/top_contents' },
    { data: props.contentMoviesData, collectionName: 'Movies', linkPath: '/data/movies' },
    { data: props.topContentMoviesData, collectionName: 'Top Movies', linkPath: '/data/top_movies' },
    { data: props.contentSeasonsData, collectionName: 'Web Series', linkPath: '/data/web_series' },
    { data: props.topContentSeasonsData, collectionName: 'Top Web Series', linkPath: '/data/top_web_series' },
    { data: props.contentAdultData, collectionName: '18+ Contents', linkPath: '/data/18+_contents' },
    { data: props.topContentAdultData, collectionName: 'Top 18+ Contents', linkPath: '/data/top_18+_contents' },
  ];
  
  return (
    <main>
      {categories.map((category, index) => (
        <MoviesCollection
          key={index + 1}
          data={category.data[0].data}
          collectionName={category.collectionName}
          linkPath={category.linkPath}
        />
      ))}
    </main>
  );
}

export async function getServerSideProps() {
  const apiKey = process.env.API_KEY || 'https://microflix.vercel.app/';

  try {
    const categories = [
      'contents',
      'top_contents',
      'content_movies',
      'top_content_movies',
      'content_seasons',
      'top_content_seasons',
      'content_adult',
      'top_content_adult',
    ];

    const fetchDataPromises = categories.map(async (category) => {
      const response = await fetch(`${apiKey}api/blogs/?category=${category}&page=1`);
      return response.json();
    });

    const data = await Promise.all(fetchDataPromises);

    return {
      props: {
        contentsData: data[0],
        topContentsData: data[1],
        contentMoviesData: data[2],
        topContentMoviesData: data[3],
        contentSeasonsData: data[4],
        topContentSeasonsData: data[5],
        contentAdultData: data[6],
        topContentAdultData: data[7],
      },
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      props: {
        contentsData: { data: [] },
        topContentsData: { data: [] },
        contentMoviesData: { data: [] },
        topContentMoviesData: { data: [] },
        contentSeasonsData: { data: [] },
        topContentSeasonsData: { data: [] },
        contentAdultData: { data: [] },
        topContentAdultData: { data: [] },
      },
    };
  }
}