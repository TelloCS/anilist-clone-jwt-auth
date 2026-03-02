from .base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'not-secret-key-for-testing'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = ["http://localhost:5173"]

SIMPLE_JWT['AUTH_COOKIE_SECURE'] = False
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False

SIMPLE_JWT['AUTH_COOKIE_SAMESITE'] = 'Lax'
CSRF_COOKIE_SAMESITE = 'Lax'
