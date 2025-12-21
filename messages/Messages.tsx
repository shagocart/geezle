
import React, { useState, useRef } from 'react';
import { Send, AlertTriangle, Search, PhoneOff, Shield, MessageSquare, Paperclip, X, FileText, Image as ImageIcon, Download } from 'lucide-react';
import { useMessages } from '../context/MessageContext';
import { Attachment } from '../types';

const Messages: React.FC = () => {
  const { getConversationsForUser, sendMessage } = useMessages();
  // In a real app, 'me' would come from auth context
  const conversations = getConversationsForUser('me');
  
  const [selectedChatId, setSelectedChatId] = useState<string>(conversations[0]?.id || '');
  const [newMessage, setNewMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedConversation = conversations.find(c => c.id === selectedChatId);

  // Helper to find the "other" user in the chat
  const getOtherParticipant = (participants: {id: string, name: string, avatar: string, isOnline?: boolean}[]) => {
    return participants.find(p => p.id !== 'me') || participants[0];
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && selectedFiles.length === 0) || !selectedChatId) return;

    sendMessage(selectedChatId, 'me', newMessage, selectedFiles);
    setNewMessage('');
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderAttachment = (att: Attachment) => {
    if (att.type === 'image') {
      return (
        <div key={att.id} className="mt-2 relative group max-w-xs">
          <img src={att.url} alt={att.name} className="rounded-lg shadow-sm border border-gray-200 max-h-48 object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
             <a href={att.url} download={att.name} className="p-2 bg-white rounded-full text-gray-800 shadow-lg">
               <Download className="h-4 w-4" />
             </a>
          </div>
        </div>
      );
    }
    return (
      <div key={att.id} className="mt-2 flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 group hover:bg-gray-100 transition-colors max-w-xs">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <FileText className="h-5 w-5 text-indigo-600" />
        </div>
        <div className="ml-3 flex-1 overflow-hidden">
          <p className="text-sm font-medium text-gray-900 truncate">{att.name}</p>
          <p className="text-xs text-gray-500">{(att.size / 1024).toFixed(1)} KB</p>
        </div>
        <a href={att.url} download={att.name} className="p-2 text-gray-400 hover:text-indigo-600">
          <Download className="h-4 w-4" />
        </a>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-gray-100 overflow-hidden">
      
      {/* Sidebar - Chat List */}
      <div className="w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map(chat => {
            const otherUser = getOtherParticipant(chat.participants);
            return (
              <div 
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`p-4 flex items-center cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100 ${selectedChatId === chat.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
              >
                <div className="relative">
                  <img src={otherUser.avatar} alt={otherUser.name} className="h-12 w-12 rounded-full object-cover" />
                  {otherUser.isOnline && <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>}
                </div>
                <div className="ml-4 flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold text-gray-900 truncate">{otherUser.name}</h4>
                    {chat.unreadCount > 0 && <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">{chat.unreadCount}</span>}
                  </div>
                  <p className={`text-sm truncate ${chat.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {chat.unreadCount > 0 ? 'New Message: ' : ''}{chat.lastMessage}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="hidden md:flex flex-1 flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center shadow-sm z-10">
              <div className="flex items-center">
                 <img src={getOtherParticipant(selectedConversation.participants).avatar} alt="User" className="h-10 w-10 rounded-full" />
                 <div className="ml-3">
                   <h3 className="font-bold text-gray-900">{getOtherParticipant(selectedConversation.participants).name}</h3>
                   <span className="text-xs text-green-600 flex items-center">
                     {getOtherParticipant(selectedConversation.participants).isOnline ? 'Online' : 'Offline'}
                   </span>
                 </div>
              </div>
              <div className="flex items-center space-x-3 text-gray-500" title="Payment Protected">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
            </div>

            {/* Safety Warning */}
            <div className="bg-red-50 p-3 border-b border-red-100 flex items-start">
               <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
               <div className="ml-3 text-sm text-red-700">
                 <p className="font-bold flex items-center"><PhoneOff className="h-3 w-3 mr-1"/> Safety Warning</p>
                 <p>To protect your payment and security, <strong>never communicate or pay outside of the platform.</strong> Sharing personal contact info (email, phone, skype) is prohibited.</p>
               </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
               {selectedConversation.messages.map(msg => (
                 <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${msg.senderId === 'me' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                     {msg.text && <p className="text-sm">{msg.text}</p>}
                     
                     {msg.attachments && msg.attachments.length > 0 && (
                       <div className="mt-2 space-y-1">
                         {msg.attachments.map(att => renderAttachment(att))}
                       </div>
                     )}

                     <span className={`text-[10px] block text-right mt-1 ${msg.senderId === 'me' ? 'text-indigo-200' : 'text-gray-400'}`}>
                       {msg.timestamp}
                     </span>
                   </div>
                 </div>
               ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              {/* File Previews */}
              {selectedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="relative bg-gray-100 rounded-lg p-2 pr-8 border border-gray-200 flex items-center">
                      <div className="mr-2">
                        {file.type.startsWith('image/') ? (
                          <ImageIcon className="h-4 w-4 text-purple-500" />
                        ) : (
                          <FileText className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      <span className="text-xs text-gray-700 truncate max-w-[150px]">{file.name}</span>
                      <button 
                        onClick={() => removeFile(idx)}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                <input 
                  type="file"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Attach file"
                >
                  <Paperclip className="h-5 w-5" />
                </button>
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button 
                  type="submit"
                  disabled={!newMessage.trim() && selectedFiles.length === 0}
                  className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
             <div className="text-center text-gray-500">
               <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
               <p className="text-lg">Select a conversation to start chatting</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
