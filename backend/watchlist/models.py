from django.db import models
from django.conf import settings

class WatchList(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    anime_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'anime_id')


    def __str__(self):
        return f"{self.user}'s Watchlist Item: {self.anime_id}"