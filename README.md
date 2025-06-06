# Pre-Order System

A full-stack pre-order system built with React (Frontend) and Node.js (Backend).

## Project Structure

```
EXE201/
├── EXE201_BE/          # Backend (Node.js)
├── EXE201_FE/          # Frontend (React + TypeScript)
└── README.md
```

## Features

### Frontend (EXE201_FE)

- **React + TypeScript** for type-safe development
- **Tailwind CSS** for modern, responsive styling
- **Authentication System** with login/register
- **OTP Verification** for secure user verification
- **Pre-order Management** for customers
- **Cart System** with add/remove functionality
- **User Profiles** with role-based access
- **Protected Routes** for authenticated users
- **Responsive Design** for mobile and desktop

### Backend (EXE201_BE)

- **Node.js + Express** RESTful API
- **Authentication & Authorization** with JWT
- **OTP Email Verification** system
- **User Management** with role-based access
- **Product Management** for administrators
- **Booking/Pre-order System**
- **Category Management**
- **Email Services** for notifications
- **MongoDB** database integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB database

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/khanh173570/my_pre-order.git
   cd my_pre-order
   ```

2. **Environment Setup**

   ⚠️ **Important**: You need to create `.env` files as they are not included in the repository for security reasons.

   ```bash
   # Backend environment
   cd EXE201_BE
   copy .env.example .env
   # Edit .env with your actual values

   # Frontend environment
   cd ../EXE201_FE
   copy .env.example .env
   # Edit .env with your actual values
   ```

   📖 **Detailed setup instructions**: See [SETUP_GUIDE.md](SETUP_GUIDE.md)

3. **Install Dependencies**

   ```bash
   # Backend
   cd EXE201_BE
   npm install

   # Frontend
   cd ../EXE201_FE
   npm install
   ```

### Running the Application

1. **Start Backend Server**

   ```bash
   cd EXE201_BE
   npm start
   ```

   Server will run on `http://localhost:5000`

2. **Start Frontend Development Server**
   ```bash
   cd EXE201_FE
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/resend-otp` - Resend OTP

### User Management

- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Product Management

- `GET /api/products` - Get all products
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Pre-order Management

- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking status

## User Roles

- **Customer**: Can browse products, place pre-orders, manage cart
- **Staff**: Can manage orders, view customer information
- **Admin**: Full access to system management

## Technology Stack

### Frontend

- React 18
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios for API calls
- Vite for build tooling

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email services
- bcrypt for password hashing

## Development Guidelines

### Code Style

- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling
- Write clean, maintainable code

### Git Workflow

1. Create feature branches from `main`
2. Make meaningful commits
3. Test thoroughly before pushing
4. Create pull requests for review

## Testing

### Backend Testing

```bash
cd EXE201_BE
npm test
```

### Frontend Testing

```bash
cd EXE201_FE
npm test
```

## Deployment

### Environment Variables

Make sure to set up all required environment variables:

- Database connection strings
- JWT secrets
- Email service credentials
- API endpoints

### Build for Production

```bash
# Frontend
cd EXE201_FE
npm run build

# Backend
cd EXE201_BE
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Support

For support and questions, please contact:

- Email: [your-email@example.com]
- GitHub Issues: [Repository Issues](https://github.com/khanh173570/my_pre-order/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Note**: This is a student project developed for EXE201 course.
