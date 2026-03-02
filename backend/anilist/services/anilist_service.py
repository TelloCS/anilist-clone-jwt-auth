import requests
from django.core.cache import cache
import logging
from dotenv import load_dotenv
import os

load_dotenv()

logger = logging.getLogger(__name__)

ANILIST_API_URL = os.getenv("ANILIST_API_URL")
DEFAULT_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    'Content-Type': 'application/json',
    'Accept': 'application/json'
}

def fetch_from_anilist(query: str, variables: dict = None):
    try:
        response = requests.post(
            ANILIST_API_URL, 
            json={'query': query, 'variables': variables or {}},
            headers=DEFAULT_HEADERS,
            timeout=10
        )
        response.raise_for_status() 
        return response.json()
        
    except requests.exceptions.RequestException as e:
        error_body = getattr(e.response, 'text', 'No response body')
        logger.error(f"AniList API request failed: {e} | Body: {error_body}")
        return None

def get_anime_by_season(season, seasonYear):
    query = """
    query ($season: MediaSeason, $seasonYear: Int) {
        Page {
            media (season: $season, seasonYear: $seasonYear, type: ANIME) {
                id
                season
                seasonYear
                title {
                    english

                }
                coverImage {
                    extraLarge
                }
            }
        }
    }
    """

    return fetch_from_anilist(query, {"season": season, "seasonYear": seasonYear})
    
def get_trending_now_anime(page: int = 1):
    cache_key = f"trending_anime_data_page_{page}"    
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data
    
    logger.info(f"Fetching page {page} from AniList...")
    
    query = """
    query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
            pageInfo { currentPage hasNextPage }
            media(type: ANIME, sort: [TRENDING_DESC]) {
                id season seasonYear meanScore episodes status
                title { english romaji }
                coverImage { extraLarge }
            }
        }
    }
    """
    
    raw_data = fetch_from_anilist(query, {"page": page, "perPage": 18})
    timeout =  60 * 60

    if raw_data:
        cache.set(cache_key, raw_data, timeout)
        
    return raw_data

def get_anime_by_id(anime_id: int):
    cache_key = f"anime_data_{anime_id}"
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data

    query = """
    query ($id: Int) {
        Media(id: $id, type: ANIME) {
            id season seasonYear description meanScore episodes status
            title { english romaji }
            coverImage { extraLarge }
        }
    }
    """
    raw_data = fetch_from_anilist(query, {"id": anime_id})
    timeout = 60 * 60 * 24

    if raw_data:
        cache.set(cache_key, raw_data, timeout)
        
    return raw_data

def search_anilist_anime(search_term: str):
    clean_term = search_term.lower().replace(" ", "_")
    cache_key = f"anime_search_{clean_term}"
    cached_data = cache.get(cache_key)
    if cached_data:
        logger.info(f"Cache hit for search: '{clean_term}'")
        return cached_data

    query = """
    query ($search: String) {
        Page(page: 1, perPage: 6) {
            media(search: $search, type: ANIME, isAdult: false, sort: [POPULARITY_DESC]) {
                id season seasonYear
                title { english romaji }
                coverImage { extraLarge }
            }
        }
    }
    """
    
    raw_data = fetch_from_anilist(query, {"search": clean_term})
    
    if raw_data:
        media_list = raw_data.get('data', {}).get('Page', {}).get('media', [])
        cache.set(cache_key, media_list, 60 * 60 * 12)
        return media_list
        
    return None
