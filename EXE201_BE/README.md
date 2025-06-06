# Pre-Order System Backend API

A comprehensive Node.js backend API with MongoDB for a pre-order system featuring authentication, CRUD operations, role-based authorization, and OTP verification.

## Features

- 🔐 **JWT Authentication** with role-based access control (User/Staff/Admin)
- 📧 **OTP Email Verification** for registration and password reset
- 🛡️ **Comprehensive Validation** and error handling
- 📦 **Product Management** with category relationships
- 👥 **User Account Management** with role-based permissions
- 🔒 **Secure Password Reset** flow with OTP verification
- 📊 **Relationship Management** between categories and products

## Technologies Used

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email services
- **Validator** for input validation

## Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd c:\SEMETER_08\EXE201_Node
npm install
```

### 2. Environment Configuration

Update the `.env` file with your configurations:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/preorder_db
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail)
EMAIL_FROM=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

### 3. Gmail App Password Setup

To use Gmail for sending OTP emails:

1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account Settings → Security → App passwords
3. Generate an app password for "Mail"
4. Use this app password (not your regular password) in `EMAIL_PASSWORD`

### 4. Start the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Registration successful! Please check your email for verification OTP.",
  "data": {
    "userId": "user_id_here",
    "email": "john@example.com",
    "message": "Please verify your email before logging in"
  }
}
```

#### Verify Email

```http
POST /api/auth/verify-email
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456"
}
```

#### Resend Verification OTP

```http
POST /api/auth/resend-verification
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "status": "success",
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Forgot Password

```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password

```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "email": "john@example.com",
  "otp": "123456",
  "newPassword": "newpassword123"
}
```

### Protected Routes

All protected routes require the Authorization header:

```http
Authorization: Bearer your_jwt_token_here
```

### Category Routes (Admin/Staff Only)

```http
GET    /api/categories          # Get all categories
POST   /api/categories          # Create category (Admin only)
GET    /api/categories/:id      # Get category with products
PUT    /api/categories/:id      # Update category (Admin only)
DELETE /api/categories/:id      # Delete category (Admin only)
```

### Product Routes

```http
GET    /api/products            # Get all products (Public)
POST   /api/products            # Create product (Admin/Staff)
GET    /api/products/:id        # Get single product (Public)
PUT    /api/products/:id        # Update product (Admin/Staff)
DELETE /api/products/:id        # Delete product (Admin/Staff)
```

### Account Routes

```http
GET    /api/accounts            # Get all users (Admin only)
POST   /api/accounts            # Create user (Admin only)
GET    /api/accounts/profile    # Get own profile
PUT    /api/accounts/profile    # Update own profile
PUT    /api/accounts/:id        # Update user (Admin only)
DELETE /api/accounts/:id        # Delete user (Admin only)
```

## User Roles & Permissions

### User (Default)

- View products and categories
- Manage own profile
- Cannot access admin/staff functions

### Staff

- All user permissions
- Create/edit/delete products
- View categories

### Admin

- All staff permissions
- Create/edit/delete categories
- Manage all user accounts
- Full system access

## OTP System

### Email Verification Flow

1. User registers → OTP sent to email
2. User enters OTP → Email verified
3. User can now login

### Password Reset Flow

1. User requests password reset → OTP sent to email
2. User enters OTP + new password → Password updated
3. User can login with new password

### OTP Details

- **Format:** 6-digit numeric code
- **Validity:** 10 minutes
- **Security:** Hashed before storage
- **Rate Limiting:** Built-in via email service

## Error Handling

The API returns consistent error responses:

```json
{
  "status": "error",
  "message": "Descriptive error message"
}
```

### Common Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate data)
- `500` - Server Error

## Data Validation

### User Registration

- Name: Required, trimmed
- Email: Required, valid email format, unique
- Password: Required, minimum 8 characters
- Phone: Optional
- Address: Optional

### Product Creation

- Name: Required, unique
- Description: Required
- Price: Required, positive number
- Stock: Required, non-negative integer
- Category: Required, valid category ID

### Category Creation

- Name: Required, unique
- Description: Optional

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Role-based authorization
- ✅ Input validation and sanitization
- ✅ OTP-based email verification
- ✅ Secure password reset flow
- ✅ Protection against common attacks

## Database Schema

### User Model

```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: user/staff/admin),
  phone: String (optional),
  address: String (optional),
  isVerified: Boolean (default: false),
  emailVerificationOTP: String (hashed),
  emailVerificationOTPExpires: Date,
  passwordResetOTP: String (hashed),
  passwordResetOTPExpires: Date,
  timestamps: true
}
```

### Category Model

```javascript
{
  name: String (required, unique),
  description: String,
  timestamps: true
}
```

### Product Model

```javascript
{
  name: String (required, unique),
  description: String (required),
  price: Number (required, min: 0),
  stock: Number (required, min: 0),
  category: ObjectId (ref: Category),
  timestamps: true
}
```

## Testing

Use tools like Postman or Thunder Client to test the API endpoints. A complete test collection is available for:

- User registration and verification flow
- Authentication and authorization
- CRUD operations for all resources
- Error handling scenarios
- Role-based access control

## Production Deployment

### Environment Variables

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your_production_db_uri
JWT_SECRET=your_very_secure_jwt_secret
JWT_EXPIRES_IN=7d
EMAIL_FROM=your_production_email@domain.com
EMAIL_PASSWORD=your_secure_app_password
```

### Recommended Security Enhancements

- Use HTTPS in production
- Implement rate limiting
- Add request logging
- Set up monitoring and alerts
- Use environment-specific configurations
- Implement API versioning

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
