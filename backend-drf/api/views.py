from django.shortcuts import render

import requests
from django.http import JsonResponse
from django.core.cache import cache
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import FavoriteCoin
from .serializers import FavoriteCoinSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import FavoriteCoin
from .serializers import FavoriteCoinSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import FavoriteCoin
from .serializers import FavoriteCoinSerializer


from rest_framework.permissions import AllowAny
from .serializers import CoinSerializer

# Create your views here.

def coin_data_proxy(request, coin_id):
    cache_key = f'coingecko_data_{coin_id}'
    cached_data = cache.get(cache_key)

    if cached_data:
        return JsonResponse(cached_data)

    try:
        # 1. Fetch main coin details
        coin_res = requests.get(
            f'https://api.coingecko.com/api/v3/coins/{coin_id}',
            params={'localization': 'false', 'sparkline': 'true'}
        )
        coin_data = coin_res.json()

        # 2. Fetch trending coins
        trending_res = requests.get('https://api.coingecko.com/api/v3/search/trending')
        trending_data = trending_res.json()['coins']

        # 3. Consolidate and cache the response
        final_data = {
            'coin': coin_data,
            'trending': trending_data,
        }

        # Cache the response for 5 minutes (300 seconds)
        cache.set(cache_key, final_data, 300)

        return JsonResponse(final_data)

    except requests.exceptions.RequestException as e:
        return JsonResponse({'error': 'Failed to fetch data from CoinGecko API', 'details': str(e)}, status=500)


class FavoriteCoinListCreateView(generics.ListCreateAPIView):
    serializer_class = FavoriteCoinSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FavoriteCoin.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FavoriteCoinToggleView(generics.GenericAPIView):
    serializer_class = FavoriteCoinSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        coin_id = request.data.get('coin_id')
        if not coin_id:
            return Response({"error": "coin_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        fav, created = FavoriteCoin.objects.get_or_create(user=request.user, coin_id=coin_id)
        if not created:
            # already exists, remove it
            fav.delete()
            return Response({"removed": True})
        return Response({"added": True})
    
    
    
@api_view(['GET'])
def favorite_list(request):
    user = request.user
    favorites = FavoriteCoin.objects.filter(user=user)
    serializer = FavoriteCoinSerializer(favorites, many=True)
    return Response(serializer.data) 

class FavoritesList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        favorites = FavoriteCoin.objects.filter(user=request.user)
        serializer = FavoriteCoinSerializer(favorites, many=True)
        return Response(serializer.data)


class ToggleFavorite(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        coin_id = request.data.get("coin_id")
        if not coin_id:
            return Response({"error": "coin_id is required"}, status=400)

        favorite, created = FavoriteCoin.objects.get_or_create(user=request.user, coin_id=coin_id)
        if not created:
            favorite.delete()
            return Response({"removed": True, "coin_id": coin_id})
        return Response({"added": True, "coin_id": coin_id})
    
    
    
    #portfolio
COINGECKO_BASE = "https://api.coingecko.com/api/v3"
class PortfolioCoins(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            # Fetch top 50 coins
            url = f"{COINGECKO_BASE}/coins/markets"
            params = {
                "vs_currency": "usd",
                "order": "market_cap_desc",
                "per_page": 50,
                "page": 1,
                "sparkline": "false"
            }
            response = requests.get(url, params=params)
            response.raise_for_status()
            return Response(response.json())
        except Exception as e:
            return Response({"error": str(e)}, status=500)


class PortfolioPrices(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            coin_ids = request.query_params.get("ids", "")
            if not coin_ids:
                return Response({"error": "No coin ids provided"}, status=400)

            url = f"{COINGECKO_BASE}/simple/price"
            params = {"ids": coin_ids, "vs_currencies": "usd"}
            response = requests.get(url, params=params)
            response.raise_for_status()
            return Response(response.json())
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
        
        
##dashbord
class DashboardCoins(APIView):
    def get(self, request):
        per_page = request.GET.get("per_page", 50)  # default 50
        page = request.GET.get("page", 1)           # default 1
        cache_key = f"dashboard_coins_{per_page}_{page}"
        data = cache.get(cache_key)

        if not data:
            url = f"https://api.coingecko.com/api/v3/coins/markets"
            params = {
                "vs_currency": "usd",
                "order": "market_cap_desc",
                "per_page": per_page,
                "page": page,
                "sparkline": "false"
            }
            res = requests.get(url, params=params)
            if res.status_code == 200:
                data = res.json()
                cache.set(cache_key, data, 60 * 5)  # cache for 5 min
            else:
                return JsonResponse({"error": "Failed to fetch coins"}, status=res.status_code)

        return JsonResponse(data, safe=False)
    
    
    
class CoinListView(APIView):
    def get(self, request):
        # Suppose you fetch coins from your DB or external API
        coins = [
            {
                "id": "bitcoin",
                "symbol": "btc",
                "name": "Bitcoin",
                "image": "https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png",
                "current_price": 115954,
                "market_cap": 2309556922332,
                "total_volume": 44683057683,
                # 7-day mock sparkline
                "sparkline_prices": [115000, 115200, 115400, 115800, 116000, 116100, 115900]
            },
            # ... other coins
        ]
        serializer = CoinSerializer(coins, many=True)
        return Response(serializer.data)