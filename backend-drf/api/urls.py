from django.urls import path
from accounts import views as UserViews 
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from .views import FavoriteCoinListCreateView, FavoriteCoinToggleView
from .views import PortfolioCoins, PortfolioPrices
from .views import DashboardCoins


from . import views
urlpatterns = [
    path('register/',UserViews.RegisterView.as_view(),name='register'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('protected-view/',UserViews.ProtectedView.as_view(),name='protected-view'),
    path('api/coins/<str:coin_id>/', views.coin_data_proxy, name='coin_data_proxy'),
    path('favorites/', views.FavoritesList.as_view(), name='favorites-list'),
    path('favorites/toggle/', views.ToggleFavorite.as_view(), name='toggle-favorite'),
    path("portfolio/coins/", PortfolioCoins.as_view(), name="portfolio-coins"),
    path("portfolio/prices/", PortfolioPrices.as_view(), name="portfolio-prices"),
    path("dashboard/coins/", DashboardCoins.as_view(), name="dashboard-coins"),
    path("chatbot/", views.chatbot_response, name="chatbot"),
    

]
