E-Commerce Process Timeline:

1. User Registration (Initial step)
   Action: User registers by providing necessary details (e.g., email, password).
   Response: The system generates a JWT (JSON Web Token) and returns it in the response.
   Note: The user does not need to log in again after registration because the JWT will serve for authentication in the next steps.

2. (Optional) User Login
   Action: If the user hasn't registered in the current session, they can log in by sending credentials (email and password) to the login endpoint.
   Response: Upon successful login, the system returns a JWT to authenticate the user.
   Note: This step is optional for registered users.

3. Generate Cart (Cart Creation)
   Action: The user triggers a service to generate a cart, using the JWT obtained in step 1 or 2 for authentication.
   Requirement: The system checks if the user is authenticated using the provided JWT.
   Response: A cart is created for the user, ready to hold products for the purchase process.

4. Add Products to Cart
   Action: The user adds desired products to the cart.
   Process: Multiple products can be added in a series of requests.
   Response: The system updates the cart with the added products, associating them with the authenticated user's cart.

   4.1 (Optional) Check User Session
   Action: An optional step where the user can verify their session and check the contents of their cart.
   Process: The user calls the "check user session" endpoint, which validates the JWT and provides a summary of the cart.
   Response: The system returns the status of the user's session and the current cart contents.

5. Purchase Process (Final Step)
   Action: The user proceeds to finalize the purchase by triggering the purchase process.
   Process: The system verifies that the cart is valid and that the user is authenticated. Payment information is processed, and the transaction is completed.
   Response: Upon successful purchase, the system sends a confirmation email to the user's registered email address, notifying them of the successful transaction.

\*IMPORTANT NOTE:

This timeline illustrates the key steps in the eCommerce process, emphasizing the happy path where everything functions as expected. Optional steps, like login and session checks, are included but not required for a successful purchase.
