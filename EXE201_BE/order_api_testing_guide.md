# Order API Testing Guide with Postman

## Base URL

```
http://localhost:5000/api/orders
```

## Authentication

Tất cả endpoints đều yêu cầu JWT token (trừ khi được ghi chú khác).
**Header:** `Authorization: Bearer YOUR_JWT_TOKEN`

---

## 1. CREATE Order - Tạo đơn hàng mới

**Endpoint:** `POST /api/orders`
**Role:** Customer
**Headers:**

```
Content-Type: application/json
Authorization: Bearer CUSTOMER_JWT_TOKEN
```

**Body Sample:**

```json
{
  "items": [
    {
      "product": "68491e341898cb12f97408ad",
      "quantity": 2,
      "price": 500000
    },
    {
      "product": "68491e791898cb12f97408b1",
      "quantity": 1,
      "price": 1000000
    }
  ],
  "totalAmount": 2030000,
  "paymentMethod": "vnpay",
  "shippingAddress": {
    "address": "123 Nguyen Van A",
    "city": "Ho Chi Minh",
    "postalCode": "70000",
    "country": "Vietnam"
  },
  "shippingInfo": {
    "fullName": "Nguyen Van A",
    "address": "123 Nguyen Van A, Quan 1, TP.HCM",
    "phone": "0901234567",
    "email": "user@example.com",
    "note": "Giao hàng buổi sáng"
  },
  "shippingFee": 30000
}
```

---

## 2. GET All Orders - Lấy tất cả đơn hàng (Admin/Staff)

**Endpoint:** `GET /api/orders/all?page=1&limit=10`
**Role:** Admin, Staff
**Headers:**

```
Authorization: Bearer ADMIN_OR_STAFF_JWT_TOKEN
```

**Query Parameters:**

- `page` (optional): Số trang (default: 1)
- `limit` (optional): Số items per page (default: 10)

---

## 3. GET User Orders - Lấy đơn hàng của user

**Endpoint:** `GET /api/orders/my-orders`
**Role:** Customer
**Headers:**

```
Authorization: Bearer CUSTOMER_JWT_TOKEN
```

---

## 4. GET Order by ID - Lấy đơn hàng theo ID

**Endpoint:** `GET /api/orders/{orderId}`
**Role:** Customer (own orders), Admin, Staff (all orders)
**Headers:**

```
Authorization: Bearer JWT_TOKEN
```

**Example:** `GET /api/orders/684abc123def456789012345`

---

## 5. UPDATE Order Status - Cập nhật trạng thái (Admin/Staff)

**Endpoint:** `PUT /api/orders/{orderId}/status`
**Role:** Admin, Staff
**Headers:**

```
Content-Type: application/json
Authorization: Bearer ADMIN_OR_STAFF_JWT_TOKEN
```

**Body Sample:**

```json
{
  "status": "processing",
  "paymentStatus": "completed",
  "transactionId": "VNP123456789",
  "paymentDate": "20250611120000"
}
```

**Valid Status Values:**

- Order Status: `pending`, `processing`, `shipped`, `delivered`, `cancelled`
- Payment Status: `pending`, `completed`, `failed`, `refunded`

---

## 6. CANCEL Order - Hủy đơn hàng (Customer)

**Endpoint:** `PUT /api/orders/{orderId}/cancel`
**Role:** Customer (own orders only)
**Headers:**

```
Authorization: Bearer CUSTOMER_JWT_TOKEN
```

**Note:** Chỉ có thể hủy đơn hàng có status = "pending"

---

## 7. DELETE Order - Xóa đơn hàng (Admin only)

**Endpoint:** `DELETE /api/orders/{orderId}`
**Role:** Admin only
**Headers:**

```
Authorization: Bearer ADMIN_JWT_TOKEN
```

**Note:** Chỉ có thể xóa đơn hàng có status = "pending" hoặc "cancelled"

---

## Sample Responses

### Success Response:

```json
{
  "success": true,
  "message": "Đơn hàng được tạo thành công",
  "data": {
    "_id": "684abc123def456789012345",
    "user": {
      "_id": "6842e21b6b9ad166d295aca4",
      "name": "User Name",
      "email": "user@example.com"
    },
    "items": [
      {
        "product": {
          "_id": "68491e341898cb12f97408ad",
          "name": "HG RX-78-2 Gundam (Revive Ver.)",
          "price": 500000,
          "image": "image_url"
        },
        "quantity": 2,
        "price": 500000,
        "_id": "684abc456def789012345678"
      }
    ],
    "totalAmount": 2030000,
    "paymentStatus": "pending",
    "paymentMethod": "vnpay",
    "status": "pending",
    "shippingFee": 30000,
    "shippingInfo": {
      "fullName": "Nguyen Van A",
      "address": "123 Nguyen Van A, Quan 1, TP.HCM",
      "phone": "0901234567",
      "email": "user@example.com",
      "note": "Giao hàng buổi sáng"
    },
    "createdAt": "2025-06-11T10:30:00.000Z",
    "updatedAt": "2025-06-11T10:30:00.000Z"
  }
}
```

### Error Response:

```json
{
  "success": false,
  "message": "Không tìm thấy đơn hàng"
}
```

---

## Testing Steps:

1. **Get JWT Token:** Đăng nhập để lấy token
2. **Test CREATE:** Tạo đơn hàng mới với customer token
3. **Test GET All:** Lấy tất cả đơn hàng với admin token
4. **Test GET User:** Lấy đơn hàng của user với customer token
5. **Test GET by ID:** Lấy đơn hàng cụ thể
6. **Test UPDATE Status:** Cập nhật trạng thái với admin token
7. **Test CANCEL:** Hủy đơn hàng với customer token
8. **Test DELETE:** Xóa đơn hàng với admin token

## Important Notes:

- Tất cả `product` IDs phải tồn tại trong database
- `totalAmount` phải khớp với tổng `(price * quantity)` của tất cả items + shippingFee
- Chỉ admin có thể xóa đơn hàng
- Customer chỉ có thể xem và hủy đơn hàng của mình
- Admin/Staff có thể xem và cập nhật trạng thái tất cả đơn hàng
