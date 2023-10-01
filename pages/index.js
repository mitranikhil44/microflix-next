import React from 'react';
import MoviesCollection from '../components/Movie_Collection';

export default function Home(props) {
  const categories = [
    { data: props.hollywoodData, collectionName: 'hollywoods', linkPath: '/data/hollywood' },
    { data: props.topHollywoodData, collectionName: 'Top hollywoods', linkPath: '/data/top_hollywood' },
    { data: props.hollywoodMoviesData, collectionName: 'Movies', linkPath: '/data/movies' },
    { data: props.topHollywoodMoviesData, collectionName: 'Top Movies', linkPath: '/data/top_movies' },
    { data: props.hollywoodSeasonsData, collectionName: 'Web Series', linkPath: '/data/web_series' },
    { data: props.topHollywoodSeasonsData, collectionName: 'Top Web Series', linkPath: '/data/top_web_serires_seasons' },
    { data: props.hollywoodAdultData, collectionName: '18+ hollywoods', linkPath: '/data_18+_contents' },
    { data: props.topHollywoodAdultData, collectionName: 'Top 18+ hollywoods', linkPath: '/data/top_18+_contents' },
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
      'hollywood',
      'top_hollywood',
      'hollywood_movies',
      'top_hollywood_movies',
      'hollywood_seasons',
      'top_hollywood_seasons',
      'hollywood_adult',
      'top_hollywood_adult',
    ];

    const fetchDataPromises = categories.map(async (category) => {
      const response = await fetch(`${apiKey}api/blogs/?category=${category}&page=1`);
      return response.json();
    });

    const data = await Promise.all(fetchDataPromises);

    return {
      props: {
        hollywoodData: data[0],
        topHollywoodData: data[1],
        hollywoodMoviesData: data[2],
        topHollywoodMoviesData: data[3],
        hollywoodSeasonsData: data[4],
        topHollywoodSeasonsData: data[5],
        hollywoodAdultData: data[6],
        topHollywoodAdultData: data[7],
      },
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      props: {
        hollywoodData: { data: [] },
        topHollywoodData: { data: [] },
        hollywoodMoviesData: { data: [] },
        topHollywoodMoviesData: { data: [] },
        hollywoodSeasonsData: { data: [] },
        topHollywoodSeasonsData: { data: [] },
        hollywoodAdultData: { data: [] },
        topHollywoodAdultData: { data: [] },
      },
    };
  }
}