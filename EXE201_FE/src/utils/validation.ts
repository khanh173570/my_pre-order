// Username: 3-20 ký tự, chỉ cho phép chữ, số, dấu gạch dưới và gạch ngang
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
  return usernameRegex.test(username);
};

// Email: định dạng email chuẩn RFC 5322
export const isValidEmail = (email: string): boolean => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

// Password: ít nhất 8 ký tự, phải có chữ hoa, chữ thường, số và ký tự đặc biệt
export const isValidPassword = (password: string): boolean => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Định dạng error message cho dễ đọc
export const getValidationErrors = (formData: {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}): string[] => {
  const errors: string[] = [];

  if (!isValidUsername(formData.userName)) {
    errors.push(
      "Tên đăng nhập phải từ 3-20 ký tự, chỉ chứa chữ, số và dấu gạch dưới"
    );
  }

  if (!isValidEmail(formData.email)) {
    errors.push("Email không hợp lệ");
  }

  if (!isValidPassword(formData.password)) {
    errors.push(
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt"
    );
  }

  if (formData.password !== formData.confirmPassword) {
    errors.push("Mật khẩu nhập lại không khớp");
  }

  return errors;
};
