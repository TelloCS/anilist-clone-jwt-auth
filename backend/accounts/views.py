from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .utils import set_jwt_cookies
from django.conf import settings
from django.middleware.csrf import get_token
from django.http import JsonResponse
from .models import CustomUser
from .serializers import UserRegistrationSerializer, UserSerializer

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # Read the refresh token from the cookie instead of the request body
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        if not refresh_token:
            return Response({'error': 'Refresh token not found in cookies'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Inject it into the request data so the parent class can validate it
        # Handle immutable QueryDict if necessary
        if hasattr(request.data, '_mutable'):
            request.data._mutable = True
            request.data['refresh'] = refresh_token
            request.data._mutable = False
        else:
            request.data['refresh'] = refresh_token
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            access = response.data.get('access')
            # If ROTATE_REFRESH_TOKENS is True, a new refresh token is also returned
            refresh = response.data.get('refresh', refresh_token)
            set_jwt_cookies(response, access, refresh)
            response.data = {'message': 'Token refreshed successfully'}
            
        return response


class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access = response.data.get('access')
            refresh = response.data.get('refresh')
            set_jwt_cookies(response, access, refresh)
            
            # Return user data so frontend can update state immediately
            try:
                user = CustomUser.objects.get(email=request.data.get('email'))
                response.data = {
                    'message': 'Successfully logged in',
                    'user': UserSerializer(user).data
                }
            except CustomUser.DoesNotExist:
                response.data = {'message': 'Successfully logged in'}
        return response


class LogoutView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        if refresh_token:
            try:
                # Blacklist the refresh token
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError:
                # Token is invalid or expired, but we still want to log out (clear cookies)
                pass
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        response = Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
        # Delete the cookies
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'], path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'])
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'], path=settings.SIMPLE_JWT['AUTH_COOKIE_PATH'])
        return response


class RegisterView(CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer


class UserInfoView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        # Overriding get_object ensures the endpoint dynamically returns 
        # the currently authenticated user based on their JWT cookie, 
        # preventing users from accessing other users' data.
        return self.request.user
    
class CSRFTokenView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        get_token(request)
        return JsonResponse({'message': 'CSRF cookie set successfully'})