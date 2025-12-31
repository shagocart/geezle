
import { Conversation, Message, UserRole, Notification, MessageReaction } from '../types';
import { MOCK_CONVERSATIONS } from '../constants';

const CONVOS_KEY = 'atmyworks_conversations';

// Mock Encryption Helpers (In production, use crypto libs)
const encryptMessage = (text: string) => `ENC[${btoa(text)}]`;
const decryptMessage = (encrypted: string) => {
    if (encrypted.startsWith('ENC[')) {
        return atob(encrypted.slice(4, -1));
    }
    return encrypted; // Legacy support
};

// Initialize conversations in storage if empty
const initializeConversations = () => {
    if (!localStorage.getItem(CONVOS_KEY)) {
        localStorage.setItem(CONVOS_KEY, JSON.stringify(MOCK_CONVERSATIONS));
    }
};

export const MessagingService = {
    // --- Data Access ---
    
    getAllConversations: async (userId: string, role: UserRole): Promise<Conversation[]> => {
        initializeConversations();
        const all: Conversation[] = JSON.parse(localStorage.getItem(CONVOS_KEY) || '[]');
        
        // Admins see all, Users see their own
        if (role === UserRole.ADMIN) {
            return all.map(c => ({
                ...c,
                messages: c.messages.map(m => ({ ...m, text: decryptMessage(m.text) }))
            }));
        }
        
        const userConvos = all.filter(c => c.participants.some(p => p.id === userId));
        return userConvos.map(c => ({
            ...c,
            messages: c.messages.map(m => ({ ...m, text: decryptMessage(m.text) }))
        }));
    },

    getConversationById: async (id: string): Promise<Conversation | null> => {
        initializeConversations();
        const all: Conversation[] = JSON.parse(localStorage.getItem(CONVOS_KEY) || '[]');
        const convo = all.find(c => c.id === id);
        
        if (convo) {
            return {
                ...convo,
                messages: convo.messages.map(m => ({ ...m, text: decryptMessage(m.text) }))
            };
        }
        return null;
    },

    // --- Actions ---

    sendMessage: async (
        conversationId: string, 
        senderId: string, 
        text: string, 
        role: string
    ): Promise<Message> => {
        const all: Conversation[] = JSON.parse(localStorage.getItem(CONVOS_KEY) || '[]');
        const convoIdx = all.findIndex(c => c.id === conversationId);
        
        if (convoIdx === -1) throw new Error("Conversation not found");

        const encryptedText = encryptMessage(text);
        
        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            conversationId,
            senderId,
            senderRole: role,
            receiverId: all[convoIdx].participants.find(p => p.id !== senderId)?.id || 'unknown',
            text: encryptedText,
            timestamp: new Date().toISOString(),
            isRead: false,
            reactions: []
        };

        all[convoIdx].messages.push(newMessage);
        all[convoIdx].lastMessage = text; // Preview 
        all[convoIdx].lastMessageAt = newMessage.timestamp;
        
        // Update unread counts
        all[convoIdx].unreadCount = (all[convoIdx].unreadCount || 0) + 1;

        localStorage.setItem(CONVOS_KEY, JSON.stringify(all));
        
        // Return decrypted for UI
        return { ...newMessage, text }; 
    },

    markAsRead: async (conversationId: string, userId: string): Promise<void> => {
        const all: Conversation[] = JSON.parse(localStorage.getItem(CONVOS_KEY) || '[]');
        const convoIdx = all.findIndex(c => c.id === conversationId);
        
        if (convoIdx !== -1) {
            // Only reset if the last message wasn't from me
            const lastMsg = all[convoIdx].messages[all[convoIdx].messages.length - 1];
            if (lastMsg && lastMsg.senderId !== userId) {
                all[convoIdx].unreadCount = 0;
                all[convoIdx].messages.forEach(m => {
                    if(m.receiverId === userId) m.isRead = true;
                });
                localStorage.setItem(CONVOS_KEY, JSON.stringify(all));
            }
        }
    },

    toggleReaction: async (conversationId: string, messageId: string, userId: string, emoji: string): Promise<void> => {
        const all: Conversation[] = JSON.parse(localStorage.getItem(CONVOS_KEY) || '[]');
        const convoIdx = all.findIndex(c => c.id === conversationId);
        
        if (convoIdx === -1) return;

        const msgIdx = all[convoIdx].messages.findIndex(m => m.id === messageId);
        if (msgIdx === -1) return;

        const message = all[convoIdx].messages[msgIdx];
        const existingReactionIdx = (message.reactions || []).findIndex(r => r.userId === userId && r.emoji === emoji);

        if (existingReactionIdx >= 0) {
            // Remove
            message.reactions?.splice(existingReactionIdx, 1);
        } else {
            // Add (ensure array exists)
            if (!message.reactions) message.reactions = [];
            message.reactions.push({
                userId,
                emoji,
                timestamp: new Date().toISOString()
            });
        }

        all[convoIdx].messages[msgIdx] = message;
        localStorage.setItem(CONVOS_KEY, JSON.stringify(all));
    },

    // --- Admin/Support ---
    
    // Create a new conversation (e.g., from Admin Dashboard)
    createConversation: async (participants: Conversation['participants']): Promise<string> => {
        initializeConversations();
        const all: Conversation[] = JSON.parse(localStorage.getItem(CONVOS_KEY) || '[]');
        
        // Check if exists
        const existing = all.find(c => 
            c.participants.length === participants.length && 
            c.participants.every(p => participants.some(np => np.id === p.id))
        );
        
        if (existing) return existing.id;

        const newId = `c-${Date.now()}`;
        const newConvo: Conversation = {
            id: newId,
            type: 'direct',
            participants,
            lastMessage: 'Conversation started',
            lastMessageAt: new Date().toISOString(),
            unreadCount: 0,
            messages: []
        };

        all.push(newConvo);
        localStorage.setItem(CONVOS_KEY, JSON.stringify(all));
        return newId;
    },

    deleteMessage: async (conversationId: string, messageId: string): Promise<void> => {
        const all: Conversation[] = JSON.parse(localStorage.getItem(CONVOS_KEY) || '[]');
        const convoIdx = all.findIndex(c => c.id === conversationId);
        
        if (convoIdx !== -1) {
            all[convoIdx].messages = all[convoIdx].messages.filter(m => m.id !== messageId);
            // Update last message if needed
            if (all[convoIdx].messages.length > 0) {
                const last = all[convoIdx].messages[all[convoIdx].messages.length - 1];
                all[convoIdx].lastMessage = decryptMessage(last.text); // Store plain for preview
                all[convoIdx].lastMessageAt = last.timestamp;
            } else {
                all[convoIdx].lastMessage = '';
            }
            localStorage.setItem(CONVOS_KEY, JSON.stringify(all));
        }
    }
};
