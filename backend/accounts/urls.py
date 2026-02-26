from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenBlacklistView

urlpatterns = [
    path('register/', UserRegistrationAPIView.as_view(), name='register'),
    path('login/', UserLoginAPIView.as_view(), name='login'),
    path('logout/', UserLogoutAPIView.as_view(), name='logout'),
    path('token/refresh/', TokenBlacklistView.as_view(), name='token-refresh'),
    path('user/', UserInfoAPIView.as_view(), name='user-info')
]