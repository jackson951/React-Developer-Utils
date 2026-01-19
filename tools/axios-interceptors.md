# Axios Interceptors

## Overview

Axios interceptors provide a centralized mechanism for handling HTTP requests and responses across an application.  
They are commonly used in enterprise React applications to enforce cross-cutting concerns such as authentication, logging, error handling, and request transformation.

Using interceptors helps:
- Eliminate repetitive request logic
- Standardize API communication
- Improve maintainability and observability
- Centralize error handling strategies

---

## What Are Interceptors?

Interceptors are functions that Axios executes:
- **Before a request is sent**
- **After a response is received**
- **When a request or response fails**

They allow you to intercept and modify requests or responses globally.

---

## Common Enterprise Use Cases

- Automatically attaching authentication tokens
- Refreshing expired tokens
- Normalizing API responses
- Centralized error handling (401, 403, 500)
- Request/response logging
- Request cancellation and timeouts

---

## Basic Setup

Create a dedicated Axios instance to avoid polluting the global Axios configuration.

```js
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});
````

---

## Request Interceptor

Request interceptors are typically used to attach authentication headers or modify outgoing requests.

### Example: Attach Authorization Token

```js
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
```

### Common Request Interceptor Responsibilities

* Inject authentication tokens
* Add correlation or trace IDs
* Set locale or tenant headers
* Validate request configuration

---

## Response Interceptor

Response interceptors handle successful responses and errors in a single location.

### Example: Handle API Responses

```js
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Unauthorized: token expired or invalid
        // Trigger logout or token refresh
      }

      if (status >= 500) {
        // Server error handling
      }
    }

    return Promise.reject(error);
  }
);
```

### Common Response Interceptor Responsibilities

* Normalize response data
* Handle authentication failures
* Redirect on authorization errors
* Log or report server errors

---

## Token Refresh Pattern

A common enterprise pattern is refreshing expired access tokens using interceptors.

### High-Level Flow

1. API request fails with `401 Unauthorized`
2. Interceptor attempts token refresh
3. Original request is retried
4. If refresh fails, user is logged out

### Simplified Example

```js
let isRefreshing = false;
let pendingRequests = [];

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshResponse = await axios.post("/auth/refresh");
          const newToken = refreshResponse.data.accessToken;

          localStorage.setItem("access_token", newToken);
          apiClient.defaults.headers.Authorization = `Bearer ${newToken}`;

          pendingRequests.forEach((cb) => cb(newToken));
          pendingRequests = [];
        } catch (refreshError) {
          pendingRequests = [];
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        pendingRequests.push((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);
```

---

## Error Handling Strategy

Centralized error handling improves consistency and user experience.

Recommended practices:

* Map HTTP status codes to application-level errors
* Avoid handling errors inside every component
* Surface only actionable errors to the UI
* Log technical details separately

---

## Interceptor Lifecycle Management

Interceptors persist for the lifetime of the Axios instance.

To avoid memory leaks or duplicated logic:

* Register interceptors once (e.g., during app initialization)
* Eject interceptors if dynamically added

```js
const interceptorId = apiClient.interceptors.request.use(handler);

// Remove interceptor
apiClient.interceptors.request.eject(interceptorId);
```

---

## Best Practices

* Always use a dedicated Axios instance
* Keep interceptor logic minimal and predictable
* Avoid business logic inside interceptors
* Handle side effects (logout, redirects) carefully
* Document interceptor behavior clearly

---

## When Not to Use Interceptors

Interceptors are not ideal for:

* Component-specific request behavior
* Highly conditional request logic
* UI-specific error handling

In such cases, handle logic closer to the call site.

---

## Summary

Axios interceptors are a powerful mechanism for enforcing consistency and reliability in React applications.
When used correctly, they reduce boilerplate, centralize critical logic, and improve long-term maintainability.

They should be treated as infrastructure-level tooling and designed with care, especially in large or distributed teams.

```
```
