# 🔧 MANUAL TESTING GUIDE - API ACCOUNTS

## 🎯 TESTING ACCOUNTS API VỚI POSTMAN

### Bước 1: Tạo Admin User và Verify

1. **Đăng ký Admin:**

   ```
   POST http://localhost:5000/api/auth/register
   Content-Type: application/json

   {
     "name": "Admin Test",
     "email": "admin@gmail.com",
     "password": "admin123456",
     "role": "admin"
   }
   ```

2. **Kiểm tra email** để lấy OTP 6 số

3. **Verify Email:**

   ```
   POST http://localhost:5000/api/auth/verify-email
   Content-Type: application/json

   {
     "email": "admin@gmail.com",
     "otp": "YOUR_OTP_HERE"
   }
   ```

### Bước 2: Login để lấy Token

```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "admin123456"
}
```

**Copy token từ response**

### Bước 3: Test Accounts API

```
GET http://localhost:5000/api/accounts
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN_HERE
```

## 🚀 ALTERNATIVE: BYPASS VERIFICATION FOR TESTING

Nếu muốn test nhanh mà không cần email verification, tôi có thể tạo một test user admin được verify sẵn.

Bạn có muốn tôi:

1. **Tạo script bypass verification** cho testing?
2. **Hướng dẫn test với email thật**?
3. **Kiểm tra database** để xem user nào đã verified?

---

## 📊 EXPECTED RESPONSES

### Success Response:

```json
{
  "status": "success",
  "data": [
    {
      "_id": "6840536e558c9aa3472df494",
      "name": "Admin Test",
      "email": "admin@gmail.com",
      "role": "admin",
      "isVerified": true,
      "createdAt": "2025-06-04T...",
      "updatedAt": "2025-06-04T..."
    }
  ],
  "total": 1
}
```

### Error Responses:

- **401**: `{"message":"Please login to access this resource"}`
- **403**: `{"message":"You do not have permission to perform this action"}`

---

Chọn option nào bạn muốn thử?
