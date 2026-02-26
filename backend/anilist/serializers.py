from rest_framework import serializers
import html, re


class AnimeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    season = serializers.CharField()
    seasonYear = serializers.IntegerField()
    cover_image = serializers.URLField(source='coverImage.large')

    title = serializers.SerializerMethodField()
    slug = serializers.SerializerMethodField()

    def get_title(self, obj):
        english_title = obj['title'].get('english')
        if english_title:
            return english_title
        return obj['title'].get('romaji', '')

    def get_slug(self, obj):
        title = obj['title'].get('romaji')

        if not title:
            return ''
        
        slug_value = title.replace(' ', '-')
        slug_value = re.sub(r'[^a-zA-Z0-9-]', '', slug_value)

        return slug_value


class TrendingNowAnimeSerializer(AnimeSerializer):
    meanScore = serializers.FloatField(allow_null=True)
    episodes = serializers.IntegerField(allow_null=True)
    status = serializers.CharField(allow_null=True)

    description = serializers.SerializerMethodField()

    def get_description(self, obj: dict):
        raw_description = obj.get('description', '')
        clean_description = re.sub(r'<[^>]+>', '', raw_description)
        return html.unescape(clean_description)
