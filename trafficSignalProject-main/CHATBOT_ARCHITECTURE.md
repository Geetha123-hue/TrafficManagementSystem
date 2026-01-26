# AI Chatbot Architecture & Flow Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           FRONTEND (React + TypeScript)                  │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Pages                                             │ │  │
│  │  │  ├── Dashboard.tsx (Integrated Chatbot)           │ │  │
│  │  │  └── LandingPage.tsx (Integrated Chatbot)         │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                          ↓                               │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Components                                        │ │  │
│  │  │  └── Chatbot.tsx                                  │ │  │
│  │  │      ├── Message Display                          │ │  │
│  │  │      ├── User Input                               │ │  │
│  │  │      ├── Minimize/Maximize Logic                  │ │  │
│  │  │      └── Animations                               │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                          ↓                               │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  Services (API Communication)                      │ │  │
│  │  │  └── chatService.ts                               │ │  │
│  │  │      ├── sendMessage(message)                      │ │  │
│  │  │      └── getChatHistory()                          │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND SERVER                            │
│                  (Express.js + Node.js)                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Routes (src/routes/api.ts)                          │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  POST /api/chat/message                           │ │  │
│  │  │  ├── Receives: { message: string }                │ │  │
│  │  │  └── Returns: { success, message, timestamp }    │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  GET /api/chat/history                            │ │  │
│  │  │  └── Returns: { success, messages[] }             │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                              ↓                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Controllers (src/controllers/chatbotController.ts)      │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  sendMessage(req, res)                            │ │  │
│  │  │  ├── Validate Input                               │ │  │
│  │  │  ├── Generate Response                            │ │  │
│  │  │  └── Return JSON Response                         │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │  generateChatResponse(message)                    │ │  │
│  │  │  ├── Keyword Matching                             │ │  │
│  │  │  ├── Context Analysis                             │ │  │
│  │  │  └── Response Selection                           │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  AI Logic (Response Generation)                          │  │
│  │                                                          │  │
│  │  • Traffic Monitoring Responses                         │  │
│  │  • Violation Detection Responses                        │  │
│  │  • Queue Analysis Responses                            │  │
│  │  • Vehicle Tracking Responses                          │  │
│  │  • Signal Optimization Responses                       │  │
│  │  • System Performance Responses                        │  │
│  │  • Fallback Responses                                 │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Message Flow Diagram

```
USER INTERACTION
      │
      │ 1. User Opens Chatbot
      ↓
┌──────────────────┐
│  Chatbot Widget  │
│  Opens with      │
│  Animations      │
└──────────────────┘
      │
      │ 2. User Types Message
      ↓
┌──────────────────────────────────┐
│  Input Field                     │
│  "How does traffic work?"        │
└──────────────────────────────────┘
      │
      │ 3. User Clicks Send
      ↓
┌──────────────────────────────────┐
│  Message Added to Chat UI        │
│  • User Message Displayed        │
│  • Input Cleared                 │
│  • Loading State Shown           │
└──────────────────────────────────┘
      │
      │ 4. API Call to Backend
      ↓
┌──────────────────────────────────┐
│  chatService.sendMessage()       │
│  POST /api/chat/message          │
│  Body: { message: "..." }        │
└──────────────────────────────────┘
      │
      │ 5. Backend Processing
      ↓
┌──────────────────────────────────┐
│  Backend Receives Request        │
│  • Validates Input               │
│  • Processes Message             │
│  • Generates Response            │
└──────────────────────────────────┘
      │
      │ 6. Keyword Analysis
      ↓
┌──────────────────────────────────┐
│  generateChatResponse()          │
│  • Match Keywords                │
│  • Find Relevant Response        │
│  • Add Contextual Info           │
└──────────────────────────────────┘
      │
      │ 7. Response Sent Back
      ↓
┌──────────────────────────────────┐
│  JSON Response                   │
│  {                               │
│    success: true,                │
│    message: "...",               │
│    timestamp: "..."              │
│  }                               │
└──────────────────────────────────┘
      │
      │ 8. Frontend Displays Response
      ↓
┌──────────────────────────────────┐
│  Bot Message in Chat             │
│  • Message Appears               │
│  • Smooth Animation              │
│  • Auto-scroll to Bottom         │
│  • Loading State Cleared         │
└──────────────────────────────────┘
      │
      │ 9. Ready for Next Message
      ↓
┌──────────────────────────────────┐
│  User Can Continue Conversation  │
│  • Input Field Enabled           │
│  • Ready for Follow-up Questions │
└──────────────────────────────────┘
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────┐
│      Dashboard / LandingPage            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │      Main Content Area          │   │
│  │                                 │   │
│  │  (Dashboard Metrics/Landing     │   │
│  │   Page Hero Section)            │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │   Chatbot Component             │   │
│  │   (Bottom Right Corner)         │   │
│  │                                 │   │
│  │  ┌──────────────────────────┐   │   │
│  │  │  Header                  │   │   │
│  │  │  • Title                 │   │   │
│  │  │  • Minimize/Close Btns   │   │   │
│  │  └──────────────────────────┘   │   │
│  │                                 │   │
│  │  ┌──────────────────────────┐   │   │
│  │  │  Messages Container      │   │   │
│  │  │  • Scrollable Area       │   │   │
│  │  │  • Message Bubbles       │   │   │
│  │  │  • Loading Indicator     │   │   │
│  │  └──────────────────────────┘   │   │
│  │                                 │   │
│  │  ┌──────────────────────────┐   │   │
│  │  │  Input Area              │   │   │
│  │  │  • Text Input Field      │   │   │
│  │  │  • Send Button           │   │   │
│  │  └──────────────────────────┘   │   │
│  │                                 │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
           ↓
    Uses chatService
           ↓
    Calls Backend API
```

## Data Flow for Message

```
FRONTEND                          BACKEND
┌─────────────┐
│ User Input: │
│ "How does   │
│  traffic    │
│  work?"     │
└─────────────┘
      │
      │ Validates
      ↓
┌─────────────────────────────────┐
│ Input Validation                │
│ • Not empty                     │
│ • Type check                    │
└─────────────────────────────────┘
      │
      │ Sends
      ↓
┌──────────────────────────────────────────┐
│ HTTP POST Request                        │
│ {                                        │
│   method: "POST",                        │
│   headers: { "Content-Type": "json" },   │
│   body: { message: "..." }               │
│ }                                        │
└──────────────────────────────────────────┘
      │                                      
      │ Transmits over network              
      ↓                                      
                              ┌──────────────────────┐
                              │ Backend Receives     │
                              │ req.body.message     │
                              └──────────────────────┘
                                      │
                                      │ Process
                                      ↓
                              ┌──────────────────────┐
                              │ toLowerCase()        │
                              │ Check Keywords       │
                              │ Select Response      │
                              └──────────────────────┘
                                      │
                                      │ Add Timestamp
                                      ↓
                              ┌──────────────────────┐
                              │ Generate JSON        │
                              │ {                    │
                              │   success: true,     │
                              │   message: "...",    │
                              │   timestamp: "..."   │
                              │ }                    │
                              └──────────────────────┘
                                      │
      ┌─────────────────────────────────┘
      │ Return to Frontend
      ↓
┌──────────────────────────────────────────┐
│ Parse JSON Response                      │
│ Extract message                          │
└──────────────────────────────────────────┘
      │
      │ Display
      ↓
┌──────────────────────────────────────────┐
│ Add Bot Message to Chat                  │
│ • Show message text                      │
│ • Animate appearance                     │
│ • Auto-scroll view                       │
│ • Clear loading state                    │
└──────────────────────────────────────────┘
```

## State Management

```
ChatbotComponent State:
├── messages: ChatMessage[]
│   ├── id: string
│   ├── text: string
│   ├── sender: 'user' | 'bot'
│   └── timestamp: Date
├── input: string (current text)
├── isLoading: boolean (showing spinner)
├── isMinimized: boolean (collapsed state)
└── isOpen: boolean (visible/hidden)
```

## Error Handling Flow

```
Request Sent
    │
    ├─→ Network Error? ──→ Show Error Message
    │
    ├─→ API Error (4xx/5xx)? ──→ Show Error Message
    │
    ├─→ Invalid Response? ──→ Show Error Message
    │
    └─→ Success ──→ Display Message
                      │
                      └─→ Scroll to Bottom
                          Clear Input
                          Disable Loading
```

---

**Architecture Version**: 1.0.0
**Last Updated**: January 26, 2026
**Status**: ✅ Production Ready
