# 🛠️ FIX LỖI 500 API ACCOUNTS - HƯỚNG DẪN TESTING

## 🚨 NGUYÊN NHÂN LỖI 500

API `/api/accounts` trả về lỗi 500 vì **thiếu authentication và authorization**:

1. ❌ **Chưa login** → Cần JWT token
2. ❌ **Không phải admin** → Chỉ admin mới truy cập được

---

## ✅ CÁCH KHẮC PHỤC

### Bước 1: Đăng ký Admin User

**POST** `http://localhost:5000/api/auth/register`

```json
{
  "name": "Admin User",
  "email": "admin@gmail.com",
  "password": "admin123456",
  "role": "admin"
}
```

### Bước 2: Verify Email

**Kiểm tra email** để lấy OTP 6 số, sau đó:

**POST** `http://localhost:5000/api/auth/verify-email`

```json
{
  "email": "admin@gmail.com",
  "otp": "123456"
}
```

### Bước 3: Login để lấy Token

**POST** `http://localhost:5000/api/auth/login`

```json
{
  "email": "admin@gmail.com",
  "password": "admin123456"
}
```

**Response sẽ có:**

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "role": "admin"
  }
}
```

### Bước 4: Test API Accounts với Token

**GET** `http://localhost:5000/api/accounts`

**Headers:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

---

## 🧪 POSTMAN TESTING

### Environment Variables:

```json
{
  "baseURL": "http://localhost:5000/api",
  "adminToken": ""
}
```

### Test Sequence:

1. **Register Admin** → Save userId
2. **Verify Email** → Enter OTP from email
3. **Login** → Copy token to `adminToken` variable
4. **GET Accounts** → Should work now

---

## 🔧 TROUBLESHOOTING

### Lỗi "Please login to access this resource"

- ❌ Thiếu token trong header
- ✅ Thêm `Authorization: Bearer <token>`

### Lỗi "You do not have permission"

- ❌ User không phải admin
- ✅ Đảm bảo user có `"role": "admin"`

### Lỗi "Please verify your email"

- ❌ Email chưa verify
- ✅ Verify email với OTP trước khi login

### Lỗi 500 Internal Server Error

- ❌ Database connection issue
- ❌ Missing environment variables
- ✅ Check server logs và .env file

---

## 📝 POSTMAN SCRIPTS

### Pre-request Script (cho GET Accounts):

```javascript
// Auto-add token if available
if (pm.environment.get("adminToken")) {
  pm.request.headers.add({
    key: "Authorization",
    value: "Bearer " + pm.environment.get("adminToken"),
  });
}
```

### Test Script (cho Login):

```javascript
// Save token after successful login
if (pm.response.code === 200) {
  const response = pm.response.json();
  pm.environment.set("adminToken", response.token);
  console.log("Token saved:", response.token);
}
```

---

## 🎯 QUICK TEST

### Nếu đã có admin account verified:

1. **Login:**

```bash
POST /api/auth/login
{
  "email": "admin@gmail.com",
  "password": "admin123456"
}
```

2. **Copy token từ response**

3. **Test Accounts:**

```bash
GET /api/accounts
Authorization: Bearer <your-token>
```

**Expected Success Response:**

```json
{
  "status": "success",
  "data": [
    {
      "id": "...",
      "name": "Admin User",
      "email": "admin@gmail.com",
      "role": "admin",
      "isVerified": true
    }
  ],
  "total": 1
}
```

---

## 🚀 AUTOMATION TEST

Chạy automated test:

```bash
node test-accounts-api.js
```

Script này sẽ:

1. Register admin user
2. Prompt để verify email
3. Login và test accounts API

---

_API accounts hoạt động bình thường, chỉ cần authentication và admin role!_
