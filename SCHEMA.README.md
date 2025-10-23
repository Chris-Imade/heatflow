# HeatFlow Experts - API Schema Documentation

This document outlines the request and response schemas for the HeatFlow Experts website's forms.

## Table of Contents

1. [Quote Form](#quote-form)
2. [Contact Form](#contact-form)
3. [Newsletter Subscription](#newsletter-subscription)

## Quote Form

### Endpoint

`POST /api/quotes`

### Request Body

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "01234567890",
  "address": "123 Example Street, Wellingborough, UK",
  "serviceType": "boiler",
  "timeframe": "1week",
  "message": "Looking to replace my old boiler with a more efficient model.",
  "privacyPolicyAccepted": true
}
```

#### Fields

| Field                 | Type           | Required | Description                                                                                 |
| --------------------- | -------------- | -------- | ------------------------------------------------------------------------------------------- |
| firstName             | string         | Yes      | Customer's first name                                                                       |
| lastName              | string         | Yes      | Customer's last name                                                                        |
| email                 | string (email) | Yes      | Customer's email address                                                                    |
| phone                 | string         | Yes      | Customer's phone number                                                                     |
| address               | string         | Yes      | Full property address                                                                       |
| serviceType           | string         | Yes      | Type of service requested (enum: 'boiler', 'heat-pump', 'ac', 'smart', 'plumbing', 'other') |
| timeframe             | string         | Yes      | When service is needed (enum: 'urgent', '1week', '2weeks', '1month', 'flexible')            |
| message               | string         | No       | Additional details about the project                                                        |
| privacyPolicyAccepted | boolean        | Yes      | Must be true to submit the form                                                             |

### Response (Success)

```json
{
  "success": true,
  "message": "Quote request received successfully",
  "quoteId": "QUO-123456",
  "estimatedResponseTime": "24 hours"
}
```

### Response (Error)

```json
{
  "success": false,
  "error": "ValidationError",
  "message": "Invalid email address",
  "errors": [
    {
      "field": "email",
      "message": "Must be a valid email address"
    }
  ]
}
```

## Contact Form

### Endpoint

`POST /api/contact`

### Request Body

```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "subject": "General Inquiry",
  "message": "I have a question about your services.",
  "privacyPolicyAccepted": true
}
```

#### Fields

| Field                 | Type           | Required | Description                        |
| --------------------- | -------------- | -------- | ---------------------------------- |
| name                  | string         | Yes      | Full name of the person contacting |
| email                 | string (email) | Yes      | Contact email address              |
| subject               | string         | Yes      | Subject of the inquiry             |
| message               | string         | Yes      | Detailed message                   |
| privacyPolicyAccepted | boolean        | Yes      | Must be true to submit the form    |

### Response (Success)

```json
{
  "success": true,
  "message": "Your message has been sent successfully. We'll get back to you soon.",
  "ticketId": "TKT-789012"
}
```

## Newsletter Subscription

### Endpoint

`POST /api/newsletter/subscribe`

### Request Body

```json
{
  "email": "subscriber@example.com"
}
```

#### Fields

| Field | Type           | Required | Description                |
| ----- | -------------- | -------- | -------------------------- |
| email | string (email) | Yes      | Email address to subscribe |

### Response (Success)

```json
{
  "success": true,
  "message": "Successfully subscribed to our newsletter",
  "subscriptionId": "SUB-345678"
}
```

### Response (Already Subscribed)

```json
{
  "success": true,
  "message": "This email is already subscribed to our newsletter",
  "subscriptionId": "SUB-345678"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "ValidationError",
  "message": "One or more validation errors occurred"
}
```

### 429 Too Many Requests

```json
{
  "success": false,
  "error": "RateLimitExceeded",
  "message": "Too many requests, please try again later",
  "retryAfter": 3600
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "error": "InternalServerError",
  "message": "An unexpected error occurred. Please try again later.",
  "requestId": "req_1234567890"
}
```

## Rate Limiting

- All endpoints are rate limited to 100 requests per hour per IP address
- Exceeding the limit will result in a 429 status code

## CORS

- All endpoints accept cross-origin requests from: `https://heatflowexperts.co.uk`
- Preflight requests are supported
- Credentials are not required

## Versioning

- Current API version: `v1`
- Versioning is handled through the `Accept` header: `Accept: application/vnd.heatflow.v1+json`

## Authentication

- No authentication required for these public endpoints
- Future endpoints may require API keys or OAuth tokens
