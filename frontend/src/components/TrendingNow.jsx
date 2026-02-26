import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const TrendingAnimeList = () => {
  const [animeData, setAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Define an async function inside useEffect
    const fetchTrendingAnime = async () => {
      try {
        const API_URL = 'http://127.0.0.1:8000/v1/trending';
        // Use await to wait for the API response
        const response = await axios.get(API_URL); 
        // Update state with the received data
        setAnimeData(response.data);
      } catch (err) {
        // Handle any errors that occur during the fetch
        setError(err);
      } finally {
        // Set loading to false once the request is complete
        setLoading(false);
      }
    };

    // Call the async function
    fetchTrendingAnime();
    
  }, []); // The empty dependency array ensures this runs once

  if (loading)
    return <p>Loading trending anime...</p>;
  if (error)
    return <p>Error: Could not fetch data.</p>;

  return (
    <div className=''>
      <div className='max-w-[1520px] mx-auto p-[30px]'>
        <h2>Trending Anime</h2>
        <div className='grid gap-[28px] grid-cols-[repeat(auto-fill,185px)] justify-between'>
          {animeData.map(anime => (
            <div className='w-[185px] w-full' key={anime.id}>
              <Link className='inline-block h-[285px] w-full' to={`/anime/${anime.id}/${anime.slug}/`}>
                <img className='h-full object-cover' src={anime.cover_image} alt={anime.title}/>
              </Link>
              <a href=""><p>{anime.title}</p></a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendingAnimeList;