import { Link } from 'react-router-dom';

const AnimeCard = ({ anime }) => {
  return (
    <div className='w-full'>
      <Link className='inline-block h-[285px] w-full' to={`/anime/${anime.id}/${anime.slug}/`}>
        <img className='h-full object-cover' src={anime.cover_image} alt={anime.title}/>
      </Link>
      <Link to={`/anime/${anime.id}/${anime.slug}/`}>
        <p className="font-bold mt-2 hover:text-gray-300 transition-colors">{anime.title}</p>
      </Link>
    </div>
  );
};

export default AnimeCard;