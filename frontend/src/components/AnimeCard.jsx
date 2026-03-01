import { Link } from 'react-router-dom';

const AnimeCard = ({ anime, children }) => {
  return (
    <div className='w-full relative group'>
      <Link className='block w-full' to={`/anime/${anime.id}/${anime.slug}/`}>
        <img className='w-full h-auto object-cover rounded-md' src={anime.cover_image} alt={anime.title} loading="lazy" />
      </Link>
      {children && (
        <div className="absolute top-2 right-2 z-10">
          {children}
        </div>
      )}
      <Link to={`/anime/${anime.id}/${anime.slug}/`}>
        <p className="text-sm hover:text-gray-300 transition-colors mt-2">{anime.title}</p>
      </Link>
    </div>
  );
};

export default AnimeCard;