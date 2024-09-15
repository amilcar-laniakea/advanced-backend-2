export const userErrorCodes = {
  ERROR_INVALID_EMAIL_FORMAT: "invalid email format",
  ERROR_REGISTER_FIELDS_REQUIRED:
    "email, password, first_name, last_name and age are required",
  ERROR_LOGIN_FIELDS_REQUIRED: "email and password are required",
  ERROR_PASSWORD_LENGTH: "Password must have at least 6 characters",
  ERROR_CREATE_USER: "Error in create user",
  ERROR_USER_EXISTS: "User already exists",
  ERROR_NOT_FOUND: "User(s) not found",
  ERROR_UNEXPECTED: "unexpected error",
  ERROR_REGISTER: "Error registering user",
  ERROR_CREDENTIALS: "Invalid credentials",
};

export const userSuccessCodes = {
  SUCCESS_REGISTER: "User registered successfully",
  SUCCESS_LOGIN: "User logged in successfully",
};
