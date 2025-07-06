# User Registration Endpoint Documentation

## Endpoint

`POST /users/resgister`

---

## Description

This endpoint allows a new user to register by providing their first name, last name, email, and password. On successful registration, a JWT authentication token and user data are returned.

---

## Request Body

Send a JSON object with the following structure:

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "Password": "yourpassword"
}
```

**Notes:**
- `fullname.firstname`: Required, minimum 3 characters.
- `fullname.lastname`: Required, minimum 3 characters.
- `email`: Required, must be a valid email address, unique.
- `Password`: Required, minimum 6 characters.

---

## Responses

### Success

- **Status Code:** `201 Created`
- **Body Example:**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "_id": "60f7c2b5e1b1c8a1b8e4d123",
        "fullname": {
          "firstname": "John",
          "lastname": "Doe"
        },
        "email": "john.doe@example.com",
        "socketID": null
      }
    }
    ```

### Validation Error

- **Status Code:** `400 Bad Request`
- **Body Example (invalid email):**
    ```json
    {
      "error": [
        {
          "msg": "invalid email",
          "param": "email",
          "location": "body"
        }
      ]
    }
    ```
- **Body Example (missing fields):**
    ```json
    {
      "error": "All fields are required."
    }
    ```

---

## Example Request

```bash
curl -X POST http://localhost:4000/users/resgister \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": { "firstname": "John", "lastname": "Doe" },
    "email": "john.doe@example.com",
    "Password": "yourpassword"
  }'
```

---

## Notes

- The `Password` will be securely hashed before storing in the database.
- On success, use the returned JWT token for authenticated requests.

---

# User Login Endpoint Documentation

## Endpoint

`POST /users/login`

---

## Description

This endpoint allows an existing user to log in using their email and password. On successful login, a JWT authentication token and user data are returned.

---

## Request Body

Send a JSON object with the following structure:

```json
{
  "email": "john.doe@example.com",
  "Password": "yourpassword"
}
```

**Notes:**
- `email`: Required, must be a valid email address.
- `Password`: Required, minimum 6 characters.

---

## Responses

### Success

- **Status Code:** `200 OK`
- **Body Example:**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "_id": "60f7c2b5e1b1c8a1b8e4d123",
        "fullname": {
          "firstname": "John",
          "lastname": "Doe"
        },
        "email": "john.doe@example.com",
        "socketID": null
      }
    }
    ```

### Validation Error

- **Status Code:** `400 Bad Request`
- **Body Example (invalid email):**
    ```json
    {
      "error": [
        {
          "msg": "invalid email",
          "param": "email",
          "location": "body"
        }
      ]
    }
    ```
- **Body Example (missing fields):**
    ```json
    {
      "error": [
        {
          "msg": "password must be 6 digit",
          "param": "Password",
          "location": "body"
        }
      ]
    }
    ```

### Authentication Error

- **Status Code:** `401 Unauthorized`
- **Body Example:**
    ```json
    {
      "error": "Invalid email or password"
    }
    ```

---

## Example Request

```bash
curl -X POST http://localhost:4000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "Password": "yourpassword"
  }'
```

---

## Notes

- On success, use the returned JWT

 User Registration Endpoint Documentation

...existing code...

---

# User Profile Endpoint Documentation

## Endpoint

`GET /users/profile`

---

## Description

This endpoint returns the authenticated user's profile information. The request must include a valid JWT token in the `Authorization` header as a Bearer token or as a cookie.

---

## Authentication

- **Required:** Yes (JWT token)

**Header Example:**
```
Authorization: Bearer <jwt_token>
```

---

## Responses

### Success

- **Status Code:** `200 OK`
- **Body Example:**
    ```json
    {
      "_id": "60f7c2b5e1b1c8a1b8e4d123",
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com",
      "socketID": null
    }
    ```

### Authentication Error

- **Status Code:** `401 Unauthorized`
- **Body Example:**
    ```json
    {
      "error": "Authentication required"
    }
    ```

---

## Example Request

```bash
curl -X GET http://localhost:4000/users/profile \
  -H "Authorization: Bearer <jwt_token>"
```

---
