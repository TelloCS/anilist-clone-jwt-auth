from django.urls import path
from .views import *

urlpatterns = [
    path('anime', AnimeBySeasonView.as_view(), name='anime-by-season'),
    path('trending', TrendingAnimeView.as_view(), name='trending-anime'),
    path('anime/<int:pk>/<slug:slug>/', AnimeDetailView.as_view(), name='anime-detail'),
    path('search', SearchAnimeView.as_view(), name='search')
]