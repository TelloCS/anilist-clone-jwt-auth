from rest_framework import serializers
from .models import *

class WatchListSerializer(serializers.ModelSerializer):
    class Meta:
        model = WatchList
        fields = ['anime_id']