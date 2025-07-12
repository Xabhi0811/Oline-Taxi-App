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
## Captain Profile

### Endpoint

`GET /captains/profile`

---

### Description

Returns the authenticated captain's profile information. Requires a valid JWT token.

---

### Authentication

- **Required:** Yes (JWT token)

**Header Example:**
```
Authorization: Bearer <jwt_token>
```

---

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body Example:**
    ```json
    {
      "captain": {
        "_id": "60f7c2b5e1b1c8a1b8e4d456",
        "fullname": {
          "firstname": "Jane",
          "lastname": "Smith"
        },
        "email": "jane.smith@example.com",
        "vehicle": {
          "color": "Red",
          "plate": "ABC123",
          "capacity": 4,
          "vehicleType": "car"
        }
      }
    }
    ```

#### Authentication Error

- **Status Code:** `401 Unauthorized`
- **Body Example:**
    ```json
    {
      "error": "Authentication required"
    }
    ```

---

### Example Request

```bash
curl -X GET http://localhost:4000/captains/profile \
  -H "Authorization: Bearer <jwt_token>"
```

---

## Captain Logout

### Endpoint

`GET /captains/logout`

---

### Description

Logs out the authenticated captain by blacklisting the current JWT token.

---

### Authentication

- **Required:** Yes (JWT token)

---

### Responses

#### Success

- **Status Code:** `200 OK`
- **Body Example:**
    ```json
    {
      "message": "Logged out successfully"
    }
    ```

#### Authentication Error

- **Status Code:** `401 Unauthorized`
- **Body Example:**
    ```json
    {
      "error": "Authentication required"
    }
    ```

---

### Example Request

```bash
curl -X GET http://localhost:4000/captains/logout \
  -H "Authorization: Bearer <jwt_token>"
```