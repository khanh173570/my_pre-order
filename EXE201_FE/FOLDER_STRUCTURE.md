# Cấu trúc Frontend Đã Tổ Chức Lại

## Cấu trúc Folders

### 📁 `src/pages/`
```
pages/
├── auth/                    # Trang xác thực
│   ├── Login.tsx
│   ├── Register.tsx  
│   ├── OTPVerification.tsx
│   └── index.ts
├── customer/               # Trang dành cho khách hàng
│   ├── Cart.tsx
│   ├── CheckoutReview.tsx
│   ├── History.tsx
│   ├── PaymentReturn.tsx
│   ├── Profile.tsx
│   ├── Policy.tsx
│   ├── Result.tsx
│   ├── product/           # Trang sản phẩm
│   │   ├── Products.tsx
│   │   ├── PreOrder.tsx
│   │   ├── PreOrderDetail.tsx
│   │   └── index.ts
│   └── index.ts
├── admin/                 # Trang admin
│   ├── AdminDashboard.tsx
│   ├── orders/
│   │   └── OrderList.tsx
│   ├── products/
│   │   └── ProductList.tsx
│   ├── categories/
│   │   └── CategoryList.tsx
│   ├── accounts/
│   │   └── AccountList.tsx
│   └── index.ts
├── home/                  # Trang chủ
│   ├── HomeCustomer.tsx
│   ├── HomeStaff.tsx
│   └── HomeAdmin.tsx
└── index.ts
```

### 📁 `src/components/`
```
components/
├── customer/              # Components cho customer
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── index.ts
├── admin/                 # Components cho admin
│   ├── AdminSidebar.tsx
│   └── index.ts
├── PageTransition.tsx     # Components chung
├── Pagination.tsx
├── ProtectedRoute.tsx
└── index.ts
```

### 📁 `src/services/`
```
services/
├── admin/                 # API services cho admin
│   ├── order.service.ts
│   ├── account.service.ts
│   ├── category.service.ts
│   └── product.service.ts
├── api.ts
├── apiClient.ts
├── payment.service.ts
├── preorder.ts
└── product.service.ts
```

## Import Paths

### Trước khi tổ chức lại:
```typescript
import Login from "./pages/Login";
import Products from "./pages/Products";
import Header from "../components/Header";
```

### Sau khi tổ chức lại:
```typescript
// Sử dụng named exports từ index files
import { Login, Register } from "./pages/auth";
import { Products, PreOrder, Cart } from "./pages/customer";
import { Header, Footer } from "./components/customer";

// Hoặc sử dụng trực tiếp
import Login from "./pages/auth/Login";
import Products from "./pages/customer/product/Products";
import Header from "./components/customer/Header";
```

## Lợi ích của cấu trúc mới:

1. **Tổ chức logic**: Các trang và components được nhóm theo chức năng
2. **Dễ bảo trì**: Dễ dàng tìm kiếm và sửa đổi các file liên quan
3. **Scalable**: Dễ dàng thêm tính năng mới vào đúng folder
4. **Import sạch**: Sử dụng index files để import nhiều component cùng lúc
5. **Separation of concerns**: Tách biệt rõ ràng giữa customer, admin và auth

## Cách sử dụng:

### Thêm trang mới cho customer:
1. Tạo file trong `src/pages/customer/`
2. Export trong `src/pages/customer/index.ts`
3. Import trong App.tsx từ customer module

### Thêm trang admin mới:
1. Tạo folder trong `src/pages/admin/`
2. Tạo components trong folder đó
3. Export trong `src/pages/admin/index.ts`

### Thêm component chung:
1. Tạo trong `src/components/`
2. Export trong `src/components/index.ts`

## Notes:
- Tất cả import paths đã được cập nhật
- Build test đã pass thành công
- Các API services đã được tách riêng cho admin
- Auth context đã được cập nhật để sử dụng localStorage với key "auth"
