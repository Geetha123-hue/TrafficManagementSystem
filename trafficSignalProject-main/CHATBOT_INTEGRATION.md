# TrafficAI Chatbot Integration Guide

## Overview
The TrafficAI application now includes an intelligent AI-powered chatbot assistant that helps users understand traffic management, answer questions, and guide them through the platform features.

## Features

### 🤖 Smart Responses
- **Traffic Monitoring**: Real-time traffic updates and congestion information
- **Violation Detection**: Information about traffic violation detection and evidence capture
- **Queue Analysis**: Insights about queue optimization and wait time management
- **Vehicle Tracking**: Details about real-time vehicle monitoring and detection
- **Signal Optimization**: Information about intelligent signal phase adjustment
- **System Performance**: Metrics and performance statistics

### 💫 User Experience
- **Floating Widget**: Non-intrusive chatbot that floats in the bottom-right corner
- **Smooth Animations**: Professional animations for opening, closing, and message display
- **Responsive Design**: Works seamlessly on all screen sizes
- **Message History**: Maintains conversation history within the session
- **Loading States**: Visual feedback during message processing

## Architecture

### Backend Components

#### File: `backend/src/controllers/chatbotController.ts`
Contains the chatbot logic with intelligent response generation based on user queries.

**Key Functions:**
- `sendMessage()`: Processes user messages and generates responses
- `getChatHistory()`: Retrieves chat history for a user session
- `generateChatResponse()`: AI logic that matches keywords and generates contextual responses

#### File: `backend/src/routes/api.ts`
REST API endpoints for chatbot communication.

**Endpoints:**
- `POST /api/chat/message`: Send a message and receive a response
- `GET /api/chat/history`: Retrieve chat history

### Frontend Components

#### File: `frontend/src/components/Chatbot.tsx`
Main chatbot UI component with message display and user input.

**Features:**
- Real-time message display with animations
- User input field with send button
- Loading state during message processing
- Minimize/expand functionality
- Close button to hide the chatbot

#### File: `frontend/src/services/chatService.ts`
Service layer for API communication with the backend.

**Methods:**
- `sendMessage(message: string)`: Sends a message to the backend
- `getChatHistory()`: Fetches chat history

#### Integration Points:
- **Dashboard**: `frontend/src/pages/Dashboard.tsx`
- **Landing Page**: `frontend/src/pages/LandingPage.tsx`

## Usage

### For Users

1. **Access the Chatbot**:
   - Look for the floating chat bubble in the bottom-right corner
   - Click the message icon to open the chatbot

2. **Ask Questions**:
   - Type your question about traffic management, violations, queues, etc.
   - Press Enter or click the Send button
   - Wait for the AI response

3. **Common Queries**:
   - "How does traffic optimization work?"
   - "Tell me about violation detection"
   - "What's the queue analysis feature?"
   - "How accurate is your system?"
   - "Help me with the dashboard"

### For Developers

#### Adding New Responses

Edit `backend/src/controllers/chatbotController.ts`:

```typescript
if (lowerMessage.includes('your-keyword')) {
  return 'Your response text here';
}
```

#### Customizing the UI

The Chatbot component accepts props:

```tsx
<Chatbot 
  isOpen={true}           // Control visibility
  onClose={handleClose}   // Handle close action
/>
```

#### Connecting to External AI Services

To integrate with external AI services (like OpenAI, Claude, etc.):

1. Install the SDK: `npm install openai` (example)
2. Update `chatbotController.ts`:

```typescript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const sendMessage = async (req: Request, res: Response) => {
  const { message } = req.body;
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: message }],
  });
  
  res.json({
    success: true,
    message: response.choices[0].message.content,
  });
};
```

## Testing

### Test the Chatbot Locally

1. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the App**:
   - Open `http://localhost:8081`
   - Click the chatbot icon
   - Ask a test question

### API Testing (with cURL)

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message":"How does traffic optimization work?"}'
```

## Performance Considerations

- **Message Delay**: Currently configured with 500ms artificial delay for realistic feel
- **Response Time**: Under 1s typical response time
- **Message Limit**: Session-based; no permanent storage (can be added to database)
- **Error Handling**: Graceful fallbacks for API errors

## Future Enhancements

1. **Database Integration**: Store chat history persistently
2. **Machine Learning**: Train on user queries for better responses
3. **Multi-language Support**: Support for multiple languages
4. **Advanced NLP**: Integration with advanced NLP services
5. **User Profiles**: Personalized responses based on user role
6. **Analytics**: Track popular questions and improve responses
7. **Voice Input**: Speech-to-text for hands-free interaction
8. **Integration with Knowledge Base**: Connect to documentation and FAQs

## Troubleshooting

### Chatbot Not Responding
- Check if backend is running on port 5000
- Verify API endpoint is correct in `chatService.ts`
- Check browser console for errors

### CORS Errors
- Ensure backend CORS is configured correctly
- Update frontend API URL if backend is on different host

### Messages Not Sending
- Check network tab in browser DevTools
- Verify message input is not empty
- Check backend logs for errors

## Configuration

### Environment Variables

**Backend** (`.env` file):
```
PORT=5000
NODE_ENV=development
# Add your AI service keys here if using external services
```

**Frontend** (in `chatService.ts`):
```typescript
const API_BASE_URL = 'http://localhost:5000/api';
```

For production, update the API base URL to your deployed backend.

## Security

- **Input Validation**: All messages are validated before processing
- **Error Handling**: Sensitive errors are not exposed to users
- **CORS**: Configure CORS appropriately for your deployment
- **Rate Limiting**: Consider implementing rate limiting in production

## Support

For issues or feature requests, contact the development team or open an issue on the project repository.

---

**Last Updated**: January 26, 2026
**Version**: 1.0.0
