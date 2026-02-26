from django.urls import path
from .views import *

urlpatterns = [
    path('', WatchListView.as_view(), name='watchlist')
]