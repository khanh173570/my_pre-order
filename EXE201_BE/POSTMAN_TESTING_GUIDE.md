# 📮 HƯỚNG DẪN TEST POSTMAN - AUTHENTICATION & OTP SYSTEM

## ⚙️ Cài đặt Environment Variables

Tạo Environment trong Postman với các variables sau:

```javascript
{
  "baseURL": "http://localhost:5000/api",
  "userToken": "",
  "adminToken": "",
  "userId": "",
  "testEmail": "khanhtpse173570@fpt.edu.vn", // Chỉ @gmail.com hoặc @fpt.edu.vn
  "fptEmail": "student@fpt.edu.vn",
  "otp": "",
  "resetOtp": ""
}
```

## 🚨 EMAIL DOMAIN RESTRICTIONS

**Chỉ cho phép 2 loại email:**

- ✅ `@gmail.com` (ví dụ: user@gmail.com)
- ✅ `@fpt.edu.vn` (ví dụ: student@fpt.edu.vn)

**Không cho phép:**

- ❌ `@yahoo.com`, `@hotmail.com`, `@outlook.com`, v.v.

---

## 1. 📝 REGISTER USER (Đăng ký với Email Validation)

### Request

- **Method**: POST
- **URL**: `{{baseURL}}/auth/register`
- **Headers**: `Content-Type: application/json`

### Body - Valid Gmail (JSON):

```json
{
  "name": "Test User Gmail",
  "email": "khanhtpse173570@fpt.edu.vn",
  "password": "password123",
  "phone": "0123456789",
  "address": "123 Test Street"
}
```

### Body - Valid FPT Email (JSON):

```json
{
  "name": "Test User FPT",
  "email": "student@fpt.edu.vn",
  "password": "password123",
  "phone": "0987654321",
  "address": "FPT University"
}
```

### Body - Invalid Domain (JSON):

```json
{
  "name": "Test User Invalid",
  "email": "test@yahoo.com",
  "password": "password123"
}
```

### Expected Response - Success (201):

```json
{
  "status": "success",
  "message": "Registration successful! Please check your email for verification OTP.",
  "data": {
    "userId": "user_id_here",
    "email": "khanhtranphuong2003@gmail.com",
    "message": "Please verify your email before logging in"
  }
}
```

### Expected Response - Invalid Domain (400):

```json
{
  "status": "error",
  "message": "Email domain not allowed. Only gmail.com and fpt.edu.vn are permitted"
}
```

### Test Script:

```javascript
pm.test("Register with valid domain", function () {
  if (pm.response.code === 201) {
    pm.response.to.have.status(201);
    const response = pm.response.json();
    pm.expect(response.status).to.equal("success");
    pm.expect(response.data).to.have.property("userId");
    pm.environment.set("userId", response.data.userId);
  } else if (pm.response.code === 400) {
    const response = pm.response.json();
    pm.expect(response.message).to.include("Email domain not allowed");
  }
});
```

---

## 2. ✉️ VERIFY EMAIL OTP (Xác thực email)

**📧 Kiểm tra email để lấy OTP (6 số)**

### Request

- **Method**: POST
- **URL**: `{{baseURL}}/auth/verify-email`
- **Headers**: `Content-Type: application/json`

### Body (JSON):

```json
{
  "email": "{{testEmail}}",
  "otp": "123456"
}
```

### Expected Response (200):

```json
{
  "status": "success",
  "message": "Email verified successfully! You can now login.",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Test User Gmail",
    "email": "khanhtranphuong2003@gmail.com",
    "role": "user",
    "isVerified": true
  }
}
```

### Test Script:

```javascript
pm.test("Email verification successful", function () {
  pm.response.to.have.status(200);
  const response = pm.response.json();
  pm.expect(response.status).to.equal("success");
  pm.expect(response.user.isVerified).to.be.true;
  pm.environment.set("userToken", response.token);
});
```

---

## 3. 🔐 LOGIN USER (Đăng nhập)

### Request

- **Method**: POST
- **URL**: `{{baseURL}}/auth/login`
- **Headers**: `Content-Type: application/json`

### Body (JSON):

```json
{
  "email": "{{testEmail}}",
  "password": "password123"
}
```

### Expected Response - Success (200):

```json
{
  "status": "success",
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Test User Gmail",
    "email": "khanhtranphuong2003@gmail.com",
    "role": "user"
  }
}
```

### Expected Response - Unverified Email (401):

```json
{
  "status": "error",
  "message": "Please verify your email before logging in. Check your inbox for verification OTP.",
  "data": {
    "needsVerification": true,
    "userId": "user_id"
  }
}
```

---

## 4. 🔄 RESEND VERIFICATION OTP

### Request

- **Method**: POST
- **URL**: `{{baseURL}}/auth/resend-verification-otp`
- **Headers**: `Content-Type: application/json`

### Body (JSON):

```json
{
  "email": "{{testEmail}}"
}
```

### Expected Response (200):

```json
{
  "status": "success",
  "message": "Verification OTP sent successfully! Please check your email."
}
```

---

## 5. 🔑 FORGOT PASSWORD

### Request

- **Method**: POST
- **URL**: `{{baseURL}}/auth/forgot-password`
- **Headers**: `Content-Type: application/json`

### Body (JSON):

```json
{
  "email": "{{testEmail}}"
}
```

### Expected Response (200):

```json
{
  "status": "success",
  "message": "Password reset OTP sent successfully! Please check your email."
}
```

---

## 6. 🔄 RESET PASSWORD WITH OTP

**📧 Kiểm tra email để lấy reset OTP**

### Request

- **Method**: POST
- **URL**: `{{baseURL}}/auth/reset-password`
- **Headers**: `Content-Type: application/json`

### Body (JSON):

```json
{
  "email": "{{testEmail}}",
  "otp": "654321",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

### Expected Response (200):

```json
{
  "status": "success",
  "message": "Password reset successfully! You can now login with your new password.",
  "token": "new_jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "Test User Gmail",
    "email": "khanhtranphuong2003@gmail.com",
    "role": "user"
  }
}
```

---

## 7. 🚪 LOGOUT USER

### Request

- **Method**: POST
- **URL**: `{{baseURL}}/auth/logout`
- **Headers**: `Authorization: Bearer {{userToken}}`

### Expected Response (200):

```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

## 🧪 TEST SCENARIOS CHÍNH

### Scenario 1: Complete Registration Flow (Gmail)

1. **Register** với email Gmail → Success
2. Check email → Get OTP
3. **Verify Email** → Success
4. **Login** → Success

### Scenario 2: Complete Registration Flow (FPT)

1. **Register** với email @fpt.edu.vn → Success
2. Check email → Get OTP
3. **Verify Email** → Success
4. **Login** → Success

### Scenario 3: Invalid Domain Test

1. **Register** với @yahoo.com → Should fail
2. **Register** với @hotmail.com → Should fail
3. **Register** với @outlook.com → Should fail

### Scenario 4: Login Before Verification

1. **Register** → Success
2. **Login** without verification → Should fail
3. **Verify Email** → Success
4. **Login** → Success

### Scenario 5: Forgot Password Flow

1. **Login** → Success
2. **Forgot Password** → Success
3. Check email → Get reset OTP
4. **Reset Password** → Success
5. **Login** with new password → Success

### Scenario 6: OTP Validation Tests

1. **Invalid OTP** → Should fail
2. **Expired OTP** (wait 10+ min) → Should fail
3. **Already used OTP** → Should fail

---

## ❌ ERROR RESPONSES

### 400 Bad Request:

**Invalid Email Domain**:

```json
{
  "status": "error",
  "message": "Email domain not allowed. Only gmail.com and fpt.edu.vn are permitted"
}
```

**Missing Fields**:

```json
{
  "status": "error",
  "message": "Please provide name, email and password"
}
```

**Invalid OTP**:

```json
{
  "status": "error",
  "message": "Invalid or expired OTP"
}
```

**Email Already Exists**:

```json
{
  "status": "error",
  "message": "Email already registered. Please use a different email"
}
```

### 401 Unauthorized:

```json
{
  "status": "error",
  "message": "Please verify your email before logging in"
}
```

### 500 Server Error:

```json
{
  "status": "error",
  "message": "Failed to send verification email. Please try again."
}
```

---

## 📊 POSTMAN COLLECTION SETUP

### Environment Variables:

```json
{
  "baseURL": "http://localhost:5000/api",
  "gmailUser": "khanhtranphuong2003@gmail.com",
  "fptUser": "student@fpt.edu.vn",
  "invalidUser": "test@yahoo.com",
  "userToken": "",
  "currentOTP": ""
}
```

### Pre-request Script (Collection level):

```javascript
// Generate random test data
const randomNum = Math.floor(Math.random() * 1000);
pm.environment.set("randomGmail", `test${randomNum}@gmail.com`);
pm.environment.set("randomFPT", `student${randomNum}@fpt.edu.vn`);
```

### Global Test Script:

```javascript
pm.test("Response time acceptable", function () {
  pm.expect(pm.response.responseTime).to.be.below(5000);
});

pm.test("Proper JSON response", function () {
  pm.response.to.be.json;
  pm.expect(pm.response.json()).to.have.property("status");
});
```

---

## 🔧 TROUBLESHOOTING

### Lỗi 500 "Failed to send verification email"

**Nguyên nhân**: Email chưa được cấu hình đúng

**Giải pháp**:

1. Check file `.env`:

   ```env
   EMAIL_FROM=khanhtranphuong2003@gmail.com
   EMAIL_PASSWORD=your_16_char_app_password
   ```

2. Tạo Gmail App Password:

   - Google Account → Security → 2-Step Verification
   - App passwords → Generate password
   - Copy 16-character password

3. Test email configuration:
   ```bash
   node test-email-validation.js
   ```

### Lỗi "Invalid or expired OTP"

**Nguyên nhân**:

- OTP sai
- OTP hết hạn (>10 phút)
- User chưa tồn tại

**Giải pháp**:

- Nhập đúng OTP từ email
- Request OTP mới nếu hết hạn
- Kiểm tra user đã register chưa

### Lỗi "Email domain not allowed"

**Nguyên nhân**: Sử dụng email domain không được phép

**Giải pháp**: Chỉ dùng email:

- ✅ `@gmail.com`
- ✅ `@fpt.edu.vn`

---

## 🎯 TESTING WORKFLOW HOÀN CHỈNH

### Bước 1: Setup

1. Start server: `npm run dev`
2. Setup Gmail App Password
3. Update `.env` file
4. Test email: `node test-email-validation.js`

### Bước 2: Test Registration

1. Test với Gmail → Should work
2. Test với FPT email → Should work
3. Test với domain khác → Should fail

### Bước 3: Test OTP Flow

1. Register → Get OTP email
2. Verify with correct OTP → Success
3. Verify with wrong OTP → Fail
4. Test OTP expiry → Fail after 10 min

### Bước 4: Test Login Flow

1. Login before verify → Should fail
2. Login after verify → Should work
3. Login with wrong password → Should fail

### Bước 5: Test Password Reset

1. Forgot password → Get reset OTP
2. Reset with correct OTP → Success
3. Login with new password → Success

**🎉 Nếu tất cả test pass → Hệ thống hoạt động hoàn hảo!**
