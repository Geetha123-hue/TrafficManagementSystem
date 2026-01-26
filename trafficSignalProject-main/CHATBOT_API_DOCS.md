# Chatbot API Documentation

## Base URL
```
http://localhost:5000/api
```

---

## Endpoints

### 1. Send Message
**Endpoint**: `POST /api/chat/message`

**Description**: Send a message to the chatbot and receive an intelligent response.

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "message": "string - User's message to the chatbot"
}
```

**Request Example**:
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"How does traffic monitoring work?"}'
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "message": "Traffic monitoring is a key component of TrafficAI...",
  "timestamp": "2025-01-26T10:30:45.123Z"
}
```

**Response (Error - 400)**:
```json
{
  "success": false,
  "error": "Message is required"
}
```

**Response (Error - 500)**:
```json
{
  "success": false,
  "error": "Internal server error"
}
```

**Response Codes**:
| Code | Meaning |
|------|---------|
| 200 | Success - Message processed |
| 400 | Bad Request - Invalid input |
| 500 | Server Error - Internal error |

**Supported Message Types**:
- Traffic monitoring queries
- Violation detection questions
- Queue analysis inquiries
- Vehicle tracking questions
- Signal optimization questions
- System performance questions
- General greeting/help requests

---

### 2. Get Chat History
**Endpoint**: `GET /api/chat/history`

**Description**: Retrieve the chat history for the current session.

**Request Headers**:
```
Content-Type: application/json
```

**Query Parameters**:
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Maximum messages to return (default: 50) |
| offset | number | Skip N messages (default: 0) |

**Request Example**:
```bash
curl -X GET "http://localhost:5000/api/chat/history?limit=10&offset=0" \
  -H "Content-Type: application/json"
```

**Response (Success - 200)**:
```json
{
  "success": true,
  "messages": [
    {
      "id": "msg_001",
      "text": "Hello! How can I help?",
      "sender": "bot",
      "timestamp": "2025-01-26T10:25:00.000Z"
    },
    {
      "id": "msg_002",
      "text": "Tell me about traffic monitoring",
      "sender": "user",
      "timestamp": "2025-01-26T10:25:15.000Z"
    }
  ]
}
```

**Response (Error - 500)**:
```json
{
  "success": false,
  "error": "Failed to retrieve history"
}
```

---

## Data Models

### ChatMessage
```typescript
interface ChatMessage {
  id: string;              // Unique message identifier
  text: string;            // Message content
  sender: 'user' | 'bot';  // Message sender type
  timestamp: string;       // ISO 8601 timestamp
}
```

### ChatResponse
```typescript
interface ChatResponse {
  success: boolean;        // Operation success status
  message?: string;        // Response message (on success)
  error?: string;          // Error message (on failure)
  timestamp?: string;      // When response was generated
}
```

### ChatHistoryResponse
```typescript
interface ChatHistoryResponse {
  success: boolean;
  messages?: ChatMessage[];
  error?: string;
}
```

---

## Response Categories

The chatbot intelligently categorizes user input and provides appropriate responses:

### Traffic Monitoring
**Keywords**: "monitor", "monitoring", "observe", "track", "overview", "real-time"
**Response Focus**: Computer vision, sensors, real-time data

### Violation Detection
**Keywords**: "violation", "violated", "breaking rules", "red light", "speeding"
**Response Focus**: Detection methods, enforcement, analytics

### Queue Analysis
**Keywords**: "queue", "waiting", "congestion", "backup", "lines", "wait times"
**Response Focus**: Measurement, optimization, reduction strategies

### Vehicle Tracking
**Keywords**: "vehicle", "car", "truck", "bus", "identify", "track"
**Response Focus**: Identification, location tracking, metrics

### Signal Optimization
**Keywords**: "signal", "optimization", "timing", "green", "red", "phase"
**Response Focus**: Algorithm, timing adjustments, efficiency

### System Performance
**Keywords**: "performance", "efficiency", "speed", "latency", "metrics"
**Response Focus**: Benchmarks, improvements, capabilities

### Fallback/Help
**Keywords**: Any unmatched query
**Response**: General help message with available features

---

## Error Handling

### Common Errors

**400 Bad Request**
```json
{
  "success": false,
  "error": "Message is required"
}
```
Cause: Empty or missing message field

**400 Bad Request**
```json
{
  "success": false,
  "error": "Message must be a string"
}
```
Cause: Message field is not a string type

**500 Internal Server Error**
```json
{
  "success": false,
  "error": "Internal server error"
}
```
Cause: Unexpected server error

---

## Rate Limiting

**Recommended Configuration**:
- Rate: 30 requests per minute per IP
- Burst: 5 requests per second

---

## CORS Configuration

The backend is configured to accept requests from:
```
http://localhost:8081  (Development)
http://localhost:3000  (Alternative dev port)
```

For production, update the CORS configuration in `backend/src/index.ts`:
```typescript
cors({
  origin: ['https://yourdomain.com'],
  methods: ['GET', 'POST'],
  credentials: true
})
```

---

## Authentication (Future Enhancement)

Currently, the API does not require authentication. For future versions, consider implementing:
- JWT tokens
- API keys
- Session cookies

---

## Request/Response Examples

### Example 1: Basic Question
```
REQUEST:
POST /api/chat/message
Content-Type: application/json

{
  "message": "What is TrafficAI?"
}

RESPONSE:
{
  "success": true,
  "message": "TrafficAI is an intelligent traffic management system using computer vision and machine learning to optimize traffic flow, detect violations, and provide real-time insights...",
  "timestamp": "2025-01-26T10:30:45.123Z"
}
```

### Example 2: Follow-up Question
```
REQUEST:
POST /api/chat/message
Content-Type: application/json

{
  "message": "How does the violation detection work?"
}

RESPONSE:
{
  "success": true,
  "message": "Our system uses advanced computer vision to detect traffic violations in real-time. When a vehicle crosses a red light or exceeds speed limits, our AI captures the violation with timestamp and vehicle identifiers...",
  "timestamp": "2025-01-26T10:31:02.456Z"
}
```

### Example 3: Get History
```
REQUEST:
GET /api/chat/history?limit=5

RESPONSE:
{
  "success": true,
  "messages": [
    {
      "id": "1",
      "text": "What is TrafficAI?",
      "sender": "user",
      "timestamp": "2025-01-26T10:30:30.000Z"
    },
    {
      "id": "2",
      "text": "TrafficAI is an intelligent...",
      "sender": "bot",
      "timestamp": "2025-01-26T10:30:45.123Z"
    }
  ]
}
```

---

## Testing with cURL

### Test 1: Simple Message
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello"}'
```

### Test 2: Traffic Question
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"How does traffic monitoring work?"}'
```

### Test 3: Get History
```bash
curl -X GET "http://localhost:5000/api/chat/history"
```

### Test 4: Error Case (Empty Message)
```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Testing with Postman

1. **Create POST request**
   - URL: `http://localhost:5000/api/chat/message`
   - Body (raw JSON): `{"message":"Your question here"}`
   - Send

2. **Create GET request**
   - URL: `http://localhost:5000/api/chat/history`
   - Send

---

## Response Time Expectations

| Operation | Expected Time |
|-----------|---------------|
| Message Send | 500ms (with simulated delay) |
| Response Parse | < 50ms |
| UI Update | < 100ms |
| Total Round Trip | 550-700ms |

---

## Browser Console Access

### View API Calls
```javascript
// Open DevTools (F12) → Network tab
// Filter for Fetch/XHR
// Click on /api/chat/message request
// View Request and Response tabs
```

### Debug in Console
```javascript
// Check last response
// Navigate to Network → /api/chat/message → Response tab
console.log('Last response:', response);
```

---

## Webhook Integration (Future)

For future versions, webhooks could notify external systems:
```json
{
  "event": "message_received",
  "data": {
    "messageId": "msg_001",
    "sender": "user",
    "text": "...",
    "timestamp": "..."
  }
}
```

---

## Changelog

### Version 1.0.0 (Current)
- ✅ POST /api/chat/message endpoint
- ✅ GET /api/chat/history endpoint
- ✅ Keyword-based response generation
- ✅ Error handling
- ✅ CORS configuration

### Version 1.1.0 (Planned)
- [ ] User authentication
- [ ] Message persistence
- [ ] Advanced NLP
- [ ] Rate limiting

### Version 2.0.0 (Future)
- [ ] External AI integration
- [ ] Multi-language support
- [ ] Voice API
- [ ] Analytics endpoint

---

**API Version**: 1.0.0
**Last Updated**: January 26, 2026
**Status**: ✅ Production Ready
