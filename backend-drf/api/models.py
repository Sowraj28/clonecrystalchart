from django.db import models
from django.contrib.auth.models import User

class FavoriteCoin(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="favorites")
    coin_id = models.CharField(max_length=100)

    class Meta:
        unique_together = ('user', 'coin_id')  # user cannot favorite same coin twice

    def __str__(self):
        return f"{self.user.username} - {self.coin_id}"
