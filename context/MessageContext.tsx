
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Conversation, Message, Attachment } from '../types';
import { MOCK_CONVERSATIONS } from '../constants';

interface MessageContextType {
  conversations: Conversation[];
  sendMessage: (conversationId: string, senderId: string, text: string, files?: File[]) => void;
  getConversationsForUser: (userId: string) => Conversation[];
  getAllConversations: () => Conversation[]; // For Admin
  markAsRead: (conversationId: string, userId: string) => void;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);

  const sendMessage = (conversationId: string, senderId: string, text: string, files: File[] = []) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        const receiver = conv.participants.find(p => p.id !== senderId);
        
        // Mock file upload: Create attachment objects with blob URLs
        const attachments: Attachment[] = files.map(file => ({
          id: Date.now() + Math.random().toString(36).substring(7),
          name: file.name,
          url: URL.createObjectURL(file),
          type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
          size: file.size
        }));

        const newMessage: Message = {
          id: Date.now().toString(),
          senderId,
          receiverId: receiver?.id || 'unknown',
          text,
          timestamp: 'Just now',
          isRead: false,
          attachments
        };

        const previewText = files.length > 0 
          ? (text ? `${text} (Attachment)` : 'Sent an attachment') 
          : text;

        return {
          ...conv,
          lastMessage: previewText,
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    }));
  };

  const markAsRead = (conversationId: string, userId: string) => {
    setConversations(prev => prev.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
          messages: conv.messages.map(m => m.receiverId === userId ? { ...m, isRead: true } : m)
        };
      }
      return conv;
    }));
  };

  const getConversationsForUser = (userId: string) => {
    // For mock purposes, 'me' is the current user in MOCK_DATA
    // In a real app, this would filter by actual user ID
    if (userId === 'me' || userId === 'client-1' || userId === 'free-1') {
      return conversations.filter(c => c.participants.some(p => p.id === 'me'));
    }
    return [];
  };

  const getAllConversations = () => {
    return conversations;
  };

  return (
    <MessageContext.Provider value={{ 
      conversations, 
      sendMessage, 
      getConversationsForUser, 
      getAllConversations,
      markAsRead 
    }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
