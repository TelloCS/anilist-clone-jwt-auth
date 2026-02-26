from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.request import Request
from .serializers import *

class WatchListView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request):
        watchlist_items = WatchList.objects.filter(user=request.user)
        anime_ids = [item.anime_id for item in watchlist_items]

        return Response(anime_ids)
    
    def post(self, request: Request):
        anime_id = request.data.get('anime_id')
        if not anime_id:
            return Response({'error': 'anime_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            WatchList.objects.create(user=request.user, anime_id=anime_id)
            return Response({'success': 'Anime added to watchlist.'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
    def delete(self, request: Request):
        anime_id = request.data.get('anime_id')
        if not anime_id:
            return Response({'error': 'anime_id is required.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            watchlist_item = WatchList.objects.get(user=request.user, anime_id=anime_id)
            watchlist_item.delete()
            return Response({'success': 'Anime removed from watchlist.'}, status=status.HTTP_204_NO_CONTENT)
        except WatchList.DoesNotExist:
            return Response({'error': 'Anime not found in watchlist.'}, status=status.HTTP_404_NOT_FOUND)