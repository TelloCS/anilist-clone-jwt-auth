from django.urls import path
from .views import (
    WatchListView
)

urlpatterns = [
    path('', WatchListView.as_view(), name='watchlist')
]
