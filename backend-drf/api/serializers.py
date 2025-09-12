from rest_framework import serializers
from .models import FavoriteCoin

class FavoriteCoinSerializer(serializers.ModelSerializer):
    class Meta:
        model = FavoriteCoin
        fields = ['coin_id']


class CoinSerializer(serializers.Serializer):
    id = serializers.CharField()
    symbol = serializers.CharField()
    name = serializers.CharField()
    image = serializers.URLField()
    current_price = serializers.FloatField()
    market_cap = serializers.FloatField()
    total_volume = serializers.FloatField()
    sparkline_in_7d = serializers.SerializerMethodField()

    def get_sparkline_in_7d(self, obj):
        # Suppose you store 7-day historical prices in obj.sparkline_prices
        # Or mock data if you don’t have real data
        return {"price": obj.get("sparkline_prices", [obj["current_price"]*0.95 + i for i in range(7)])}