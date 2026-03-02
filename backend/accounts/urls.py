from django.urls import path
from .views import (
    CSRFTokenView,
    RegisterView,
    CookieTokenObtainPairView,
    LogoutView,
    CookieTokenRefreshView,
    UserInfoView
)

urlpatterns = [
    path('csrf/', CSRFTokenView.as_view(), name='csrf_token'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CookieTokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token-refresh'),
    path('user/', UserInfoView.as_view(), name='user-info')
]
