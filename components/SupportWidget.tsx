
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Headphones, Sparkles, User, Briefcase, RefreshCw, LifeBuoy, Paperclip, FileText, Image as ImageIcon } from 'lucide-react';
import { getSupportResponse } from '../services/ai';
import { Attachment } from '../types';

type Sender = 'user' | 'agent' | 'system';
type UserRole = 'Freelancer' | 'Employer' | null;

interface ChatMessage {
  sender: Sender;
  text: string;
  timestamp: Date;
  attachments?: Attachment[];
}

const SupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<UserRole>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

  // Initial Jima Greeting
  useEffect(() => {
    if (chatHistory.length === 0) {
      setChatHistory([
        { 
          sender: 'agent', 
          text: "Hi there, I’m Jima, AtMyWorks’ AI Customer Support Agent.\n\nI’m here to assist you with any customer support questions or concerns you may have.\n\nPlease choose one of the options below to start chatting with me. You can type “switch” at any time to change your selection.", 
          timestamp: new Date() 
        }
      ]);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, role, isTyping]);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setChatHistory(prev => [
      ...prev,
      { sender: 'user', text: `I need help as an ${selectedRole}`, timestamp: new Date() },
      { sender: 'agent', text: `Great! I'm now assisting you as a **${selectedRole}**. How can I help you today?`, timestamp: new Date() }
    ]);
  };

  const requestHumanAgent = () => {
    if (!role || isTyping) return;
    
    setChatHistory(prev => [...prev, { sender: 'user', text: "I'd like to speak with a human agent.", timestamp: new Date() }]);
    setIsTyping(true);
    
    // Simulate delay and ticket creation
    setTimeout(() => {
      setIsTyping(false);
      const ticketNum = Math.floor(100000 + Math.random() * 900000);
      setChatHistory(prev => [...prev, { 
        sender: 'agent', 
        text: `I understand. I've created a priority support ticket (#${ticketNum}) for you.\n\nA human support specialist has been notified and will review our conversation history. They will join this chat shortly or contact you via email if you go offline.`, 
        timestamp: new Date() 
      }]);
    }, 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && !selectedFile)) return;

    const userMsg = message.trim();
    const currentFile = selectedFile;
    
    setMessage('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Check for switch command
    if (userMsg.toLowerCase() === 'switch') {
      setRole(null);
      setChatHistory(prev => [
        ...prev, 
        { sender: 'user', text: userMsg, timestamp: new Date() },
        { sender: 'agent', text: "Okay, I've reset your role selection. Please choose an option below.", timestamp: new Date() }
      ]);
      return;
    }

    let attachment: Attachment | undefined = undefined;
    if (currentFile) {
      attachment = {
        id: Date.now().toString(),
        name: currentFile.name,
        url: URL.createObjectURL(currentFile),
        type: currentFile.type.startsWith('image/') ? 'image' : 'document',
        size: currentFile.size
      };
    }

    // Add user message
    setChatHistory(prev => [...prev, { 
      sender: 'user', 
      text: userMsg, 
      timestamp: new Date(),
      attachments: attachment ? [attachment] : undefined
    }]);

    if (!role) {
      setChatHistory(prev => [...prev, { sender: 'agent', text: "Please select a role above so I can better assist you, or type 'switch' to restart.", timestamp: new Date() }]);
      return;
    }

    setIsTyping(true);

    // Prepare message for AI (mention file if attached)
    const promptMessage = currentFile 
      ? `${userMsg} [User attached file: ${currentFile.name}]` 
      : userMsg;

    // Call AI
    const response = await getSupportResponse(
      promptMessage, 
      role, 
      chatHistory.map(m => ({ sender: m.sender, text: m.text }))
    );

    setIsTyping(false);
    setChatHistory(prev => [...prev, { sender: 'agent', text: response, timestamp: new Date() }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end font-sans">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white w-80 sm:w-96 h-[600px] rounded-2xl shadow-2xl border border-gray-200 mb-4 flex flex-col overflow-hidden animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-indigo-600 p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-full mr-3 relative">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Jima (AI Support)</h3>
                <p className="text-[10px] text-indigo-200">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {role && (
                 <>
                   <button 
                     onClick={requestHumanAgent}
                     className="text-xs bg-indigo-500 hover:bg-indigo-400 px-2 py-1 rounded text-indigo-100 flex items-center transition-colors" 
                     title="Request Human Agent"
                   >
                     <LifeBuoy className="h-3 w-3 mr-1" /> Agent
                   </button>
                   <button 
                     onClick={() => setRole(null)} 
                     className="text-xs bg-indigo-500 hover:bg-indigo-400 px-2 py-1 rounded text-indigo-100 flex items-center transition-colors" 
                     title="Switch Role"
                   >
                     <RefreshCw className="h-3 w-3 mr-1" /> Switch
                   </button>
                 </>
              )}
              <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-700 p-1 rounded transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Disclaimer Banner */}
          <div className="bg-gray-50 p-2 text-[10px] text-gray-500 text-center border-b border-gray-200 leading-tight px-4">
            I may need to share certain information from this discussion with our trusted third-party service providers to support and facilitate the work.
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.sender === 'agent' && (
                  <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                    <Sparkles className="h-3 w-3 text-indigo-600" />
                  </div>
                )}
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm whitespace-pre-wrap ${
                  msg.sender === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 border border-gray-100 rounded-bl-none'
                }`}>
                  {msg.text && <p>{msg.text}</p>}
                  
                  {msg.attachments && msg.attachments.map(att => (
                    <div key={att.id} className="mt-2 p-2 bg-white/20 rounded border border-white/20">
                      {att.type === 'image' ? (
                         <img src={att.url} alt={att.name} className="max-h-32 rounded object-cover" />
                      ) : (
                        <div className="flex items-center space-x-2 text-xs">
                          <FileText className="h-4 w-4" />
                          <span className="truncate max-w-[150px]">{att.name}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Role Selection UI */}
            {!role && (
              <div className="flex flex-col space-y-2 mt-4 animate-fade-in">
                <button 
                  onClick={() => handleRoleSelect('Freelancer')}
                  className="flex items-center justify-between p-3 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm group"
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-indigo-500 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-700">I need help as a Freelancer (Seller)</span>
                  </div>
                </button>
                <button 
                   onClick={() => handleRoleSelect('Employer')}
                   className="flex items-center justify-between p-3 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm group"
                >
                  <div className="flex items-center">
                    <Briefcase className="h-5 w-5 text-indigo-500 mr-3 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium text-gray-700">I need help as an Employer (Buyer)</span>
                  </div>
                </button>
              </div>
            )}

            {isTyping && (
              <div className="flex justify-start">
                 <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2 mt-1">
                    <Sparkles className="h-3 w-3 text-indigo-600" />
                  </div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-3 border border-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-gray-100">
            {selectedFile && (
               <div className="mb-2 flex items-center bg-gray-100 p-2 rounded-lg text-xs relative max-w-fit">
                 {selectedFile.type.startsWith('image/') ? <ImageIcon className="h-3 w-3 mr-2" /> : <FileText className="h-3 w-3 mr-2" />}
                 <span className="truncate max-w-[200px]">{selectedFile.name}</span>
                 <button onClick={() => setSelectedFile(null)} className="ml-2 hover:text-red-500"><X className="h-3 w-3" /></button>
               </div>
            )}
            <form onSubmit={handleSend} className="flex gap-2 items-center">
              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
              />
              <button 
                type="button" 
                disabled={!role}
                onClick={() => fileInputRef.current?.click()}
                className="text-gray-400 hover:text-indigo-600 disabled:opacity-50"
              >
                <Paperclip className="h-5 w-5" />
              </button>
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={role ? "Ask Jima a question..." : "Select a role above..."}
                disabled={!role}
                className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-400 transition-colors"
              />
              <button 
                type="submit" 
                disabled={!role || (!message.trim() && !selectedFile)}
                className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`${isOpen ? 'bg-gray-700' : 'bg-indigo-600'} text-white p-4 rounded-full shadow-lg hover:opacity-90 transition-all transform hover:scale-105 flex items-center justify-center group`}
      >
        {isOpen ? <X className="h-6 w-6" /> : (
          <div className="relative">
             <Headphones className="h-6 w-6" />
             <span className="absolute -top-1 -right-1 flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
             </span>
          </div>
        )}
      </button>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SupportWidget;
