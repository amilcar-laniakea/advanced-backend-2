# Changelog

Changes Made to the repository its initial commit.

---

## [1.4.1] Cookie user implementation, home customization (16/09/24)

- Deleted in passport configuration unnecessary functions
- Added APP_NAME and SWAGGER_PATH environment variables
- Adjusted minor code files for improve readability

### Bug Fixes

---

---

## [1.4.0] Cookie user implementation, home customization (15/09/24)

- Added validation in header for allowing the "user" endpoints use cookie data stored or bearer token (cookie_auth type boolean)
- Implemented Swagger documentation (currently only available for product list and product by id)
- Customized home ("/") and include links to current view of products and cart and also included swagger doc link
- Updated Readme to include user authorization feature
- Updated Postman file in external_resources

### Bug Fixes

---

---

## [1.3.0] Implemented user register, login and protected route /current (14/09/24)

- Created constant file to user related status messages.
- Implemented passport configuration to work with Json Web Tokens and authorization method
- Added environment variables: APP_SECRET, JWT_EXPIRATION_TIME, for passport authorization mechanic
- Added new model user, to stored in database registered users
- Added user-controller, methods registerUser and loginUser.
- Added user routes, got login, register, and current to access user data.

### Bug Fixes

---

---

## [1.2.0] Features for prepare arriving user CRUD (13/09/24)

- Renamed all utils files with kebab case (-) to maintain good practiques in clean code (backend nomenclature).
- Implemented utility hook create-hash, to encrypt password with library bcryptjs.
- Implemented utility hook generate-jwt, to encrypt data user with jwt and.
- Implemented utility hook is-valid-email, to check the correct sintaxis of email formats in requests.
- Implemented is-valid-password, with bcryptjs compare password user with one stored in database.
- Implemented middleware authenticate-jwt, to check jwt in endpoints (currently using in sessions/current)
- Implemented middleware authenticate-role, to verify user role (currently using in sessions/current)

### Bug Fixes

---

---

## [1.1.0] Reconnect feature database (12/09/24)

- Refactor file db.js in config to possibility on reconnect database when its connections fails
- Added environments variables: MONGO_MAX_RETRIES, MONGO_RETRY_DELAY, for reconnect feature.

### Bug Fixes

---

---

## [1.0.0] Refactor project to type => Module (14/07/24)

- Fist commit (fork) and refactor fom common module to type module.
- Implemented function getRoute, to emulate functionality to native commonjs type "\_\_dirname"

### Bug Fixes

---

---
