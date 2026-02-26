import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import axios from 'axios';

export default function Profile() {
    const { username, email } = useAuth();
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const config = { headers: { 'Authorization': `Bearer ${token}` } };
                const response = await axios.get('http://127.0.0.1:8000/watchlist/', config);
                setWatchlist(response.data);
            } catch (error) {
                console.error('Failed to fetch watchlist:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchlist();
    }, []);

    if (loading) return <p>Loading watchlist...</p>;

    return (
        <div>
            <h2>Username: {username}</h2>
            <h2>Email: {email}</h2>
            <h3>My Watchlist</h3>
            <ul>
                {watchlist.length > 0 ? (
                    watchlist.map(animeId => (
                        <li key={animeId}>Anime ID: {animeId}</li>
                    ))
                ) : (
                    <p>Your watchlist is empty.</p>
                )}
            </ul>
        </div>
    )
}