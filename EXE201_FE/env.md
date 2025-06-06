# API Configuration

VITE_API_URL=http://localhost:5000/api
VITE_BASE_URL=http://localhost:5000

# App Configuration

VITE_APP_NAME=Pre-Order System
VITE_APP_VERSION=1.0.0

# Role Configuration

VITE_ROLE_ADMIN=admin
VITE_ROLE_CUSTOMER=user
VITE_ROLE_STAFF=staff

# Authentication

VITE_JWT_EXPIRES_IN=7d

# File Upload

VITE_MAX_FILE_SIZE=5242880
VITE_ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,image/webp

# Features Toggle

VITE_ENABLE_REGISTRATION=true
VITE_ENABLE_OTP_VERIFICATION=true
VITE_ENABLE_EMAIL_NOTIFICATIONS=true

# Environment

VITE_NODE_ENV=development

# Default Routes

VITE_DEFAULT_AUTH_REDIRECT=/home

# Server Configuration

PORT=5000
NODE_ENV=development

# Database Configuration

MONGODB_URI=mongodb://localhost:27017/preorder_db

# JWT Configuration

JWT_SECRET=mySuper@SecretKey2025
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)

EMAIL_USER=khanhtpse173570@fpt.edu.vn
EMAIL_PASSWORD=cszh mqze vxfk gbut
EMAIL_FROM=khanhtpse173570@fpt.edu.vn

# SMTP Configuration

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_REQUIRE_TLS=true
SMTP_REJECT_UNAUTHORIZED=false

# Frontend URL (for CORS)

FRONTEND_URL=http://localhost:5173

# OTP Configuration

OTP_EXPIRES_IN=300000

# Admin Account

ADMIN_EMAIL=test-admin@gmail.com
ADMIN_PASSWORD=admin123456
ADMIN_NAME=Test Admin

# File Upload Configuration

MAX_FILE_SIZE=5242880

# Session Configuration

SESSION_SECRET=mySessionSecret@2025

# Rate Limiting

MAX_LOGIN_ATTEMPTS=5
LOCKOUT_TIME=900000

# Security

BCRYPT_ROUNDS=12
