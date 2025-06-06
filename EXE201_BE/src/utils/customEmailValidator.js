// Custom email validator for allowed domains
const allowedDomains = ["gmail.com", "fpt.edu.vn"];

export const validateEmail = (email) => {
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: "Invalid email format",
    };
  }

  // Extract domain from email
  const domain = email.split("@")[1].toLowerCase();

  // Check if domain is in allowed list
  if (!allowedDomains.includes(domain)) {
    return {
      isValid: false,
      message: `Email domain not allowed. Only ${allowedDomains.join(
        " and "
      )} are permitted`,
    };
  }

  return {
    isValid: true,
    message: "Email is valid",
  };
};

// Mongoose custom validator function
export const customEmailValidator = function (email) {
  const validation = validateEmail(email);
  return validation.isValid;
};

// Custom validator message
export const emailValidatorMessage = `Email must be from allowed domains: ${allowedDomains.join(
  " or "
)}`;
