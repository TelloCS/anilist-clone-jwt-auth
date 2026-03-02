from rest_framework import serializers
from .models import (
    WatchList
)


class WatchListSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='anime_id', read_only=True)
    coverImage = serializers.URLField(source='image_url', read_only=True)

    class Meta:
        model = WatchList
        fields = ['id', 'title', 'coverImage', 'slug']
