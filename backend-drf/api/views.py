from django.shortcuts import render
import requests
from django.http import JsonResponse
from django.core.cache import cache
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import FavoriteCoin
from .serializers import FavoriteCoinSerializer
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from .serializers import CoinSerializer

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import os
import json
from dotenv import load_dotenv


load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
COINGECKO_API = "https://api.coingecko.com/api/v3"

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
    
    
# ---------------- Chatbot View (CSRF exempt) ---------------- #
@csrf_exempt
def chatbot_response(request):
    if request.method != "POST":
        return JsonResponse({"reply": "Invalid request"}, status=400)

    try:
        data = json.loads(request.body)
        user_msg = data.get("message", "").lower()
        if not user_msg:
            return JsonResponse({"reply": "Please ask something about crypto."})

        # ------------------------------
        # 30 popular coins
        # ------------------------------
        popular_coins = [
            "bitcoin", "ethereum", "tether", "binancecoin", "usd-coin", "ripple", "cardano",
            "dogecoin", "polygon", "solana", "polkadot", "litecoin", "tron", "avalanche",
            "chainlink", "stellar", "uniswap", "vechain", "filecoin", "internet-computer",
            "algorand", "theta", "decentraland", "axie-infinity", "monero", "crypto-com-chain",
            "fantom", "hedera-hashgraph", "tezos", "osmosis"
        ]

        # ------------------------------
        # Preload coins into cache if missing
        # ------------------------------
        coin_cache = {}
        for coin in popular_coins:
            cached = cache.get(f"coin_{coin}")
            if not cached:
                try:
                    res = requests.get(f"{COINGECKO_API}/coins/{coin}", params={"localization": "false", "sparkline": "true"})
                    if res.status_code == 200:
                        cache.set(f"coin_{coin}", res.json(), 300)
                        cached = res.json()
                except:
                    cached = None
            if cached:
                coin_cache[coin] = cached

        # ------------------------------
        # Case 1: Compare coins (7-day)
        # ------------------------------
        if "compare" in user_msg:
            coins = [c for c in popular_coins if c in user_msg]
            if len(coins) >= 2:
                comparison = []
                for coin in coins:
                    coin_data = coin_cache.get(coin)
                    if coin_data:
                        prices = coin_data["market_data"]["sparkline_7d"]["price"]
                        start, end = prices[0], prices[-1]
                        change = ((end - start) / start) * 100
                        comparison.append(f"- {coin.title()}: ${start:,.2f} → ${end:,.2f} ({change:.2f}%)")
                if comparison:
                    return JsonResponse({"reply": "📊 7-Day Comparison:\n" + "\n".join(comparison)})
                return JsonResponse({"reply": "No cached data available yet. Please open coin pages first."})

        # ------------------------------
        # Case 2: Best exchange
        # ------------------------------
        if "best exchange" in user_msg:
            import re
            match = re.search(r"best exchange for (\w+)", user_msg)
            if match:
                coin = match.group(1)
                coin_data = coin_cache.get(coin)
                if coin_data:
                    tickers = coin_data.get("tickers", [])
                    if tickers:
                        best_ex = sorted(tickers, key=lambda x: x.get("volume", 0), reverse=True)[0]["market"]["name"]
                        return JsonResponse({"reply": f"Best exchange for {coin.title()} is {best_ex} (highest volume)."})
                    return JsonResponse({"reply": f"No exchange data for {coin.title()}."})
                return JsonResponse({"reply": f"No cached data for {coin.title()}. Open its page first."})

        # ------------------------------
        # Case 3: Price or Investment summary
        # ------------------------------
        for coin in popular_coins:
            if coin in user_msg:
                coin_data = coin_cache.get(coin)
                if coin_data:
                    md = coin_data["market_data"]
                    if "price" in user_msg:
                        return JsonResponse({"reply": f"💰 {coin.title()} current price: ${md['current_price']['usd']:,.2f}"})
                    if "invest" in user_msg or "suggest" in user_msg or "details" in user_msg:
                        resp = (
                            f"💹 {coin.title()} Investment Summary:\n"
                            f"- Current Price: ${md['current_price']['usd']:,.2f}\n"
                            f"- Market Cap: ${md['market_cap']['usd']:,.0f}\n"
                            f"- 24h Volume: ${md['total_volume']['usd']:,.0f}\n"
                            f"- Circulating Supply: {md['circulating_supply']:,.0f}\n"
                            f"- Price Change (7d): {md['price_change_percentage_7d']:.2f}%"
                        )
                        return JsonResponse({"reply": resp})

        # ------------------------------
        # Default fallback to Gemini API
        # ------------------------------
        try:
            url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"
            headers = {"Content-Type": "application/json"}
            body = {"contents": [{"parts": [{"text": user_msg}]}]}
            params = {"key": GEMINI_API_KEY}
            response = requests.post(url, headers=headers, params=params, json=body, timeout=10)
            result = response.json()
            bot_reply = "Sorry, I couldn’t process that."
            if "candidates" in result and result["candidates"]:
                parts = result["candidates"][0].get("content", {}).get("parts", [])
                if parts and "text" in parts[0]:
                    bot_reply = parts[0]["text"]
            return JsonResponse({"reply": bot_reply})
        except:
            return JsonResponse({"reply": "Failed to connect to Gemini API."})

    except Exception as e:
        return JsonResponse({"reply": f"Error: {str(e)}"}, status=500)