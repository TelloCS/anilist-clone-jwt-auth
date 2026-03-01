from .base import *
from dotenv import load_dotenv
import os

load_dotenv()

SECRET_KEY = os.getenv('SECRET_KEY')

DEBUG = False

# Your VPS IP or domain name
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS').split(' ')

# --- Reverse Proxy Configuration (Nginx) ---
# Tells Django it's sitting behind Nginx which is handling the HTTPS
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# --- Strict Security Headers ---
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_CONTENT_TYPE_NOSNIFF = True

# --- Cookie Security (Strict for HTTPS) ---
SIMPLE_JWT['AUTH_COOKIE_SECURE'] = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True

# If Nginx serves React and Django on the exact SAME domain (e.g., example.com and example.com/api), 'Lax' is perfect.
SIMPLE_JWT['AUTH_COOKIE_SAMESITE'] = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'

# --- CORS & CSRF ---
# If Nginx serves both from the same domain, you might not even need CORS! 
# But if React is on a subdomain (app.domain.com), list it here.
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS').split(' ')
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = os.getenv('CSRF_TRUSTED_ORIGINS').split(' ')
