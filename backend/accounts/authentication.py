from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions
from django.conf import settings

class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        
        if header is None:
            raw_token = request.COOKIES.get(settings.SIMPLE_JWT['AUTH_COOKIE']) or None
        else:
            raw_token = self.get_raw_token(header)
            
        if raw_token is None:
            return None
            
        validated_token = self.get_validated_token(raw_token)
        
        # Enforce CSRF only if we are extracting the token from cookies.
        # If the token came from the Authorization header, CSRF isn't strictly necessary.
        if header is None:
            self.enforce_csrf(request)
            
        return self.get_user(validated_token), validated_token
    
    def enforce_csrf(self, request):
        # DRF's CSRFCheck requires a dummy get_response callable
        check = CSRFCheck(get_response=lambda req: None)
        check.process_request(request)
        reason = check.process_view(request, None, (), {})
        if reason:
            raise exceptions.PermissionDenied(f'CSRF Failed: {reason}')