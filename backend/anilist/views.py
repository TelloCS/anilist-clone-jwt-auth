from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from .serializers import *
from .services.anilist_service import *


class AnimeBySeasonView(APIView):
    permission_classes = (AllowAny,) 

    def get(self, request: Request):
        season = request.query_params.get('season')
        season_year = request.query_params.get('seasonYear')
        raw_data = get_anime_by_season(season, season_year)

        if raw_data:
            media_list = raw_data['data']['Page']['media']
            serializer = AnimeSerializer(media_list, many=True)
            return Response(serializer.data)
        else:
            return Response({'error': 'Could not fetch data'}, status=400)
        

class TrendingAnimeView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request: Request):
        page = int(request.query_params.get('page', 1))
        raw_data = get_trending_now_anime(page=page)

        if raw_data:
            page_info = raw_data['data']['Page']['pageInfo']
            media_list = raw_data['data']['Page']['media']
            
            serializer = TrendingNowAnimeSerializer(media_list, many=True)
            return Response({
                'pageInfo': page_info,
                'results': serializer.data
            })
        else:
           return Response({'error': 'Could not fetch data'}, status=400)
   

class AnimeDetailView(APIView):
    permission_classes = (AllowAny,)
    
    def get(self, request, pk, slug):
        raw_data = get_anime_by_id(pk)
        
        if raw_data and 'data' in raw_data and raw_data['data']['Media']:
            anime_data = raw_data['data']['Media']
            serializer = TrendingNowAnimeSerializer(anime_data)
            return Response(serializer.data)
        else:
            return Response({'error': 'Anime not found.'}, status=404)
