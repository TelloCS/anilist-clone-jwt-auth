import requests
from django.core.cache import cache
import logging
from dotenv import load_dotenv
import os

load_dotenv()

logger = logging.getLogger(__name__)

ANILIST_API_URL = os.getenv("ANILIST_API_URL")

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

    variables = {
        "season": season,
        "seasonYear": seasonYear
    }


    try:
        response = requests.post(ANILIST_API_URL, json={'query': query, 'variables': variables})
        if response.status_code == 200:
            return response.json()
    except requests.exceptions.RequestException as e:
        print(f"AniList API request failed: {e}")
        return None
    
def get_trending_now_anime(page: int = 1):
    cache_key = f"trending_anime_data_page_{page}"
    timeout = 60 * 60
    
    cached_data = cache.get(cache_key)
    if cached_data:
        return cached_data
    
    logger.info(f"Fetching page {page} from AniList...")
    
    query = """
    query ($page: Int, $perPage: Int) {
        Page(page: $page, perPage: $perPage) {
            pageInfo {
                currentPage
                hasNextPage
            }
            media(type: ANIME, sort: [TRENDING_DESC]) {
                id
                season
                seasonYear
                title {
                    english
                    romaji
                }
                coverImage {
                    extraLarge
                }
                meanScore
                episodes
                status
            }
        }
    }
    """
    
    variables = {
        "page": page,
        "perPage": 18
    }

    try:
        response = requests.post(ANILIST_API_URL, json={'query': query, 'variables': variables})
        
        if response.status_code == 200:
            raw_data = response.json()
            cache.set(cache_key, raw_data, timeout)
            return raw_data
        else:
            print(f"AniList Error {response.status_code}: {response.text}")
            logger.error(f"AniList Error: {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"Network failure: {e}")
        return None

def get_anime_by_id(anime_id: int):
    query = """
        query ($id: Int) {
            Media(id: $id, type: ANIME) {
                id
                season
                seasonYear
                title {
                    english
                    romaji
                }
                coverImage {
                    extraLarge
                }
                description
                meanScore
                episodes
                status
            }
        }
    """

    variables = {
        "id": anime_id
    }

    cache_key = f"anime_data_{anime_id}"
    timeout = 60 * 60 * 24
    
    cached_data = cache.get(cache_key)
    if cached_data:
        logger.info("Cache hit for current anime.")
        return cached_data

    try:
        response = requests.post(ANILIST_API_URL, json={'query': query, 'variables': variables})
        if response.status_code == 200:
            raw_data = response.json()
            cache.set(cache_key, raw_data, timeout)
            return raw_data
    except requests.exceptions.RequestException as e:
        print(f"AniList API request failed: {e}")
        return None
