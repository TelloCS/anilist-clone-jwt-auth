from rest_framework import serializers
from django.utils.text import slugify
import html
import re


class AnimeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    coverImage = serializers.URLField(source='coverImage.extraLarge', required=False)
    title = serializers.SerializerMethodField()
    slug = serializers.SerializerMethodField()
    releaseDate = serializers.SerializerMethodField()

    def get_title(self, obj: dict):
        english_title = obj.get('title', {}).get('english')
        if english_title:
            return english_title

        return obj.get('title', {}).get('romaji') or 'Unknown Title'

    def get_slug(self, obj: dict):
        title = obj.get('title', {}).get('romaji')
        if not title:
            return ''
        return slugify(title)

    def get_releaseDate(self, obj: dict):
        season = obj.get('season')
        year = obj.get('seasonYear')

        if season and year:
            return f"{season.title()} {year}"
        elif year:
            return str(year)
        else:
            return "TBA"


class TrendingNowAnimeSerializer(AnimeSerializer):
    meanScore = serializers.FloatField(allow_null=True, required=False)
    episodes = serializers.IntegerField(allow_null=True, required=False)
    status = serializers.CharField(allow_null=True, required=False)

    description = serializers.SerializerMethodField()

    def get_description(self, obj: dict):
        raw_description = obj.get('description')

        if not raw_description:
            return "No description available."

        clean_description = re.sub(r'<[^>]+>', '', raw_description)
        return html.unescape(clean_description)
