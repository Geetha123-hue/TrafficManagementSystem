// Chat service for API communication
const API_BASE_URL = 'http://localhost:5000/api';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  timestamp: string;
}

export const chatService = {
  async sendMessage(message: string): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      return {
        success: false,
        message: 'Sorry, I encountered an error processing your message. Please try again.',
        timestamp: new Date().toISOString(),
      };
    }
  },

  async getChatHistory(): Promise<{ success: boolean; messages: ChatMessage[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/history`);
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching chat history:', error);
      return {
        success: false,
        messages: [],
      };
    }
  },
};
