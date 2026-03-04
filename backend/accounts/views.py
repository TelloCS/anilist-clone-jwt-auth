from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .utils import set_jwt_cookies, clear_jwt_cookies
from django.conf import settings
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from .models import CustomUser
from .serializers import (
    RegistrationSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer,
    CookieTokenRefreshSerializer
)
import logging

logger = logging.getLogger(__name__)


@method_decorator(csrf_protect, name='dispatch')
class CookieTokenRefreshView(TokenRefreshView):
    serializer_class = CookieTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access = response.data.get('access')
            refresh = response.data.get('refresh')

            set_jwt_cookies(response, access, refresh)
            response.data = {'message': 'Token refreshed successfully'}
        return response


@method_decorator(csrf_protect, name='dispatch')
class CookieTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'login'

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access = response.data.get('access')
            refresh = response.data.get('refresh')
            user_data = response.data.get('user')

            set_jwt_cookies(response, access, refresh)
            response.data = {'message': 'Successfully logged in', 'user': user_data}
        return response


@method_decorator(csrf_protect, name='dispatch')
class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        response = Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)
        clear_jwt_cookies(response)

        refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        if refresh_token:
            try:
                token = RefreshToken(refresh_token)
                token.blacklist()
            except TokenError:
                pass
            except Exception as e:
                logger.error(f"Blacklisting failed during logout: {str(e)}")

        return response


@method_decorator(csrf_protect, name='dispatch')
class RegisterView(CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegistrationSerializer
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = 'register'

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            response = Response({
                "message": "Registration successful.",
                "user": UserSerializer(user).data
                }, status=status.HTTP_201_CREATED)

            set_jwt_cookies(response, access_token, refresh_token)
            return response

        except ValidationError as e:
            error_messages = []
            if isinstance(e.detail, dict):
                for field, errors in e.detail.items():
                    clean_field = field.capitalize().replace('_', ' ')
                    for error in errors:
                        error_messages.append(f"{clean_field}: {str(error)}")
            elif isinstance(e.detail, list):
                for error in e.detail:
                    error_messages.append(str(error))
            else:
                error_messages.append(str(e.detail))

            formatted_error_string = " ".join(error_messages)
            return Response({"error": formatted_error_string}, status=status.HTTP_400_BAD_REQUEST)


class UserInfoView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class CSRFTokenView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request):
        get_token(request)
        return JsonResponse({'message': 'CSRF cookie set successfully'})
