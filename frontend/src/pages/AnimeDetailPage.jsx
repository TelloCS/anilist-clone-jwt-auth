import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthProvider'

const AnimeDetailPage = () => {
  const { id, name } = useParams(); // Get the 'id' from the URL
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isLoggedIn } = useAuth();
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      axios.get('http://127.0.0.1:8000/watchlist/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      .then(response => {
        setIsWatchlisted(response.data.includes(parseInt(id)));
      });
    }
  }, [id, isLoggedIn]);

  const handleWatchlistToggle = async () => {
    const token = localStorage.getItem('accessToken');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };
    const payload = { 'anime_id': parseInt(id) };

    try {
      if (isWatchlisted) {
        await axios.delete('http://127.0.0.1:8000/watchlist/', { ...config, data: payload });
        setIsWatchlisted(false);
      } else {
        await axios.post('http://127.0.0.1:8000/watchlist/', payload, config);
        setIsWatchlisted(true);
      }
    } catch (error) {
        console.error('Watchlist action failed:', error);
    }
  };

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const API_URL = `http://127.0.0.1:8000/v1/anime/${id}/${name}/`;
        const response = await axios.get(API_URL);
        setAnime(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnime();
  }, [id, name]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: Could not fetch anime details.</p>;

  return (
    <div>
      <h1>{anime.title}</h1>
      <img src={anime.cover_image} alt={anime.title} />
      <p>{anime.description}</p>
      {isLoggedIn && (
        <button onClick={handleWatchlistToggle}>
          {isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
        </button>
      )}
    </div>
    
  );
};

export default AnimeDetailPage;