# Environment Setup Guide

## 🔧 Initial Setup After Cloning

Sau khi clone repository này, bạn cần thiết lập các file environment để ứng dụng có thể chạy.

### 1. Backend Environment Setup

```bash
cd EXE201_BE
```

**Tạo file .env từ template:**

```bash
copy .env.example .env
```

**Chỉnh sửa file .env với thông tin thực của bạn:**

#### Database Configuration

- **MongoDB Local:**
  ```
  MONGODB_URI=mongodb://localhost:27017/preorder_db
  ```
- **MongoDB Atlas (Cloud):**
  ```
  MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/preorder_db
  ```

#### Email Configuration (Gmail)

1. Tạo App Password cho Gmail:
   - Vào Google Account Settings
   - Security → 2-Step Verification
   - App passwords → Generate password
2. Cập nhật file .env:
   ```
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   ```

#### JWT Secret

Tạo một secret key mạnh:

```
JWT_SECRET=super_secret_key_at_least_32_characters_long
```

### 2. Frontend Environment Setup

```bash
cd EXE201_FE
```

**Tạo file .env từ template:**

```bash
copy .env.example .env
```

**Cập nhật API URL nếu cần:**

```
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies

**Backend:**

```bash
cd EXE201_BE
npm install
```

**Frontend:**

```bash
cd EXE201_FE
npm install
```

### 4. Database Setup

**Khởi động MongoDB (nếu dùng local):**

```bash
mongod
```

**Tạo admin user (tùy chọn):**

```bash
cd EXE201_BE
node create-admin-simple.js
```

### 5. Start Development Servers

**Terminal 1 - Backend:**

```bash
cd EXE201_BE
npm run dev
```

**Terminal 2 - Frontend:**

```bash
cd EXE201_FE
npm run dev
```

## 🔐 Security Notes

- ❌ **KHÔNG BAO GIỜ** commit file `.env` lên Git
- ✅ Luôn dùng `.env.example` để chia sẻ template
- ✅ Sử dụng strong passwords và API keys
- ✅ Rotate keys định kỳ trong production

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Kiểm tra MongoDB service
net start MongoDB

# Hoặc khởi động manual
mongod --dbpath "C:\data\db"
```

### Email Service Issues

- Kiểm tra Gmail App Password
- Đảm bảo 2FA đã được bật
- Verify email/password trong .env

### Port Conflicts

- Backend default: port 5000
- Frontend default: port 5173
- Thay đổi PORT trong .env nếu bị conflict

## 📚 Additional Resources

- [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)
- [Gmail App Password Setup](../EXE201_BE/GMAIL_APP_PASSWORD_GUIDE.md)
- [OTP System Guide](../EXE201_BE/OTP_AUTHENTICATION_GUIDE.md)
