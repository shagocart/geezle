
import React, { useState, useEffect, useCallback } from 'react';
import { SupportService } from '../../services/support';
import { GovernanceService } from '../../services/ai/governance.service';
import { SupportTicket, TicketReply, TicketStatus, DisputePrediction, TicketCategory, UploadedFile } from '../../types';
import { useNotification } from '../../context/NotificationContext';
import { LifeBuoy, Search, User, Send, Brain, Scale, Mail, Phone, Paperclip, Settings, Plus, Trash2, Save, X, Edit2, RefreshCw, FileText as FileIcon } from 'lucide-react';
import DisputePredictionPanel from '../../components/governance/DisputePredictionPanel';
import FilePicker from '../../components/FilePicker';

const SupportDisputes = () => {
    const [view, setView] = useState<'tickets' | 'categories'>('tickets');
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [prediction, setPrediction] = useState<DisputePrediction | null>(null);
    const [loadingPrediction, setLoadingPrediction] = useState(false);
    
    // Reply State
    const [replyText, setReplyText] = useState('');
    const [internalNote, setInternalNote] = useState(false);
    const [replyAttachments, setReplyAttachments] = useState<string[]>([]);
    const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);

    const { showNotification } = useNotification();
    
    // Category Management
    const [categories, setCategories] = useState<TicketCategory[]>([]);
    const [editingCategory, setEditingCategory] = useState<Partial<TicketCategory> | null>(null);

    const loadTickets = useCallback(async (silent = false) => {
        const data = await SupportService.getAllTickets();
        setTickets(data);
        // Update selected ticket details if it exists in the new data
        if (selectedTicket) {
            const updatedSelected = data.find(t => t.id === selectedTicket.id);
            if (updatedSelected) {
                // Only update state if something relevant changed to avoid unnecessary re-renders/jumping
                if (updatedSelected.replies.length !== selectedTicket.replies.length || updatedSelected.status !== selectedTicket.status) {
                    setSelectedTicket(updatedSelected);
                }
            }
        }
    }, [selectedTicket]); // Depend on selectedTicket to check for updates

    useEffect(() => {
        loadTickets();
        loadCategories();
        
        const handleUpdate = () => loadTickets(true);

        // Listen for cross-tab updates (when user submits in another tab)
        window.addEventListener('storage', handleUpdate);
        
        // Listen for same-tab updates (custom event from service)
        window.addEventListener('ticket_db_change', handleUpdate);

        // Fallback polling for real-time updates (every 5 seconds)
        const interval = setInterval(() => {
            loadTickets(true); 
        }, 5000);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', handleUpdate);
            window.removeEventListener('ticket_db_change', handleUpdate);
        };
    }, [loadTickets]);

    useEffect(() => {
        if (selectedTicket) {
            if (selectedTicket.category === 'Dispute' || selectedTicket.category === 'Billing') {
                setLoadingPrediction(true);
                GovernanceService.predictDisputeOutcome(selectedTicket.id)
                    .then(setPrediction)
                    .finally(() => setLoadingPrediction(false));
            } else {
                setPrediction(null);
            }
        }
    }, [selectedTicket]);

    const loadCategories = async () => {
        const data = await SupportService.getCategories();
        setCategories(data);
    };

    // --- Ticket Actions ---
    const handleStatusChange = async (id: string, status: TicketStatus) => {
        await SupportService.updateTicketStatus(id, status);
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
        if (selectedTicket?.id === id) setSelectedTicket(prev => prev ? { ...prev, status } : null);
        showNotification('info', 'Ticket Update', `Ticket status updated to ${status}`);
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket || (!replyText.trim() && replyAttachments.length === 0)) return;

        const newReply = await SupportService.replyToTicket(selectedTicket.id, {
            sender: 'admin',
            senderName: 'Admin Support',
            message: replyText,
            internalNote,
            attachments: replyAttachments
        });
        
        const updatedTicket = { ...selectedTicket, replies: [...selectedTicket.replies, newReply] } as SupportTicket;
        setTickets(prev => prev.map(t => t.id === selectedTicket.id ? updatedTicket : t));
        setSelectedTicket(updatedTicket);
        setReplyText('');
        setReplyAttachments([]);
        setInternalNote(false);
        showNotification('success', 'Sent', internalNote ? 'Note added.' : 'Reply sent.');
    };

    const handleFileSelect = (file: UploadedFile) => {
        setReplyAttachments(prev => [...prev, file.url]);
    };

    // --- Category Actions ---
    const handleSaveCategory = async () => {
        if (!editingCategory || !editingCategory.name) return;
        const toSave = { 
            id: editingCategory.id || `cat-${Date.now()}`,
            name: editingCategory.name,
            isActive: editingCategory.isActive ?? true 
        };
        await SupportService.saveCategory(toSave);
        loadCategories();
        setEditingCategory(null);
        showNotification('success', 'Saved', 'Category updated successfully.');
    };

    const handleDeleteCategory = async (id: string) => {
        if(confirm("Delete this category?")) {
            await SupportService.deleteCategory(id);
            loadCategories();
            showNotification('info', 'Deleted', 'Category removed.');
        }
    };

    const handleManualRefresh = () => {
        loadTickets(true);
        showNotification('info', 'Refreshed', 'Checking for new tickets...');
    };

    if (view === 'categories') {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col h-[calc(100vh-140px)]">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 flex items-center">
                        <Settings className="w-5 h-5 mr-2 text-gray-500" /> Ticket Categories
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={() => setEditingCategory({ name: '', isActive: true })} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg flex items-center hover:bg-blue-700 transition">
                            <Plus className="w-4 h-4 mr-1" /> Add Category
                        </button>
                        <button onClick={() => setView('tickets')} className="text-sm text-gray-600 border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
                            Back to Tickets
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto">
                     {editingCategory && (
                         <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-end gap-4 animate-fade-in">
                             <div className="flex-1">
                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category Name</label>
                                 <input 
                                    className="w-full border-gray-300 rounded-lg p-2 text-sm" 
                                    value={editingCategory.name} 
                                    onChange={e => setEditingCategory({...editingCategory, name: e.target.value})} 
                                 />
                             </div>
                             <div className="mb-2">
                                <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                                    <input type="checkbox" checked={editingCategory.isActive} onChange={e => setEditingCategory({...editingCategory, isActive: e.target.checked})} className="mr-2 rounded text-blue-600" />
                                    Active
                                </label>
                             </div>
                             <div className="flex gap-2">
                                <button onClick={() => setEditingCategory(null)} className="px-3 py-2 text-sm text-gray-600 border rounded-lg hover:bg-white">Cancel</button>
                                <button onClick={handleSaveCategory} className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold">Save</button>
                             </div>
                         </div>
                     )}

                     <table className="w-full text-sm text-left">
                         <thead className="bg-gray-50 text-gray-500"><tr><th className="px-6 py-3">Name</th><th className="px-6 py-3">Status</th><th className="px-6 py-3 text-right">Actions</th></tr></thead>
                         <tbody className="divide-y">
                             {categories.map(cat => (
                                 <tr key={cat.id} className="hover:bg-gray-50">
                                     <td className="px-6 py-4 font-medium">{cat.name}</td>
                                     <td className="px-6 py-4">
                                         <span className={`px-2 py-1 rounded text-xs font-bold ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                             {cat.isActive ? 'Active' : 'Disabled'}
                                         </span>
                                     </td>
                                     <td className="px-6 py-4 text-right space-x-2">
                                         <button onClick={() => setEditingCategory(cat)} className="text-blue-600 p-1.5 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                                         <button onClick={() => handleDeleteCategory(cat.id)} className="text-red-600 p-1.5 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                     </td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6">
            {/* Ticket List */}
            <div className="w-1/3 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center">
                            <LifeBuoy className="w-5 h-5 mr-2 text-blue-600" /> Support Tickets
                        </h2>
                        <div className="flex gap-2">
                             <button onClick={handleManualRefresh} className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition" title="Refresh Tickets">
                                <RefreshCw className="w-4 h-4" />
                            </button>
                            <button onClick={() => setView('categories')} className="text-xs text-gray-500 hover:text-blue-600 flex items-center">
                                <Settings className="w-3 h-3 mr-1" /> Categories
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input type="text" placeholder="Search tickets or codes..." className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm outline-none" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {tickets.map(ticket => (
                        <div 
                            key={ticket.id} 
                            onClick={() => setSelectedTicket(ticket)}
                            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${selectedTicket?.id === ticket.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-xs font-mono text-gray-500">#{ticket.trackingCode || ticket.id.split('-').pop()}</span>
                                <span className="text-[10px] text-gray-400">{new Date(ticket.updatedAt).toLocaleDateString()}</span>
                            </div>
                            <h3 className="text-sm text-gray-900 mb-1 truncate font-medium">{ticket.subject}</h3>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                                        ticket.status === 'Open' ? 'bg-blue-100 text-blue-700' : 
                                        ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {ticket.status}
                                    </span>
                                    {ticket.category === 'Dispute' && <span className="px-2 py-0.5 rounded text-[10px] bg-red-100 text-red-700 font-bold">DISPUTE</span>}
                                </div>
                                <span className="text-[10px] text-gray-400">{ticket.fullName}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Ticket Detail */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                {selectedTicket ? (
                    <>
                        <div className="p-6 border-b border-gray-200 bg-gray-50 overflow-y-auto">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900 mb-1">{selectedTicket.subject}</h1>
                                    <div className="flex items-center text-sm text-gray-500 gap-4 mb-2">
                                        <span className="flex items-center"><User className="w-4 h-4 mr-1" /> {selectedTicket.fullName}</span>
                                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">{selectedTicket.category}</span>
                                    </div>
                                    <div className="flex gap-4 text-xs text-gray-500">
                                        <div className="flex items-center"><Mail className="w-3 h-3 mr-1" /> {selectedTicket.email}</div>
                                        {selectedTicket.mobile && <div className="flex items-center"><Phone className="w-3 h-3 mr-1" /> {selectedTicket.mobile}</div>}
                                    </div>
                                </div>
                                <select 
                                    className="text-xs border-gray-300 rounded px-2 py-1 bg-white focus:ring-blue-500 focus:border-blue-500"
                                    value={selectedTicket.status}
                                    onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value as TicketStatus)}
                                >
                                    <option>Open</option>
                                    <option>In Review</option>
                                    <option>In Progress</option>
                                    <option>Waiting for User</option>
                                    <option>Resolved</option>
                                    <option>Closed</option>
                                </select>
                            </div>
                            
                            {/* AI Prediction Panel */}
                            {selectedTicket.category === 'Dispute' && prediction && (
                                <div className="mb-6">
                                    <DisputePredictionPanel prediction={prediction} isLoading={loadingPrediction} />
                                </div>
                            )}

                            <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-700 shadow-sm relative">
                                <div className="font-bold text-gray-900 mb-2">Message:</div>
                                <p className="whitespace-pre-wrap">{selectedTicket.message}</p>
                                
                                {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                                    <div className="mt-4 pt-3 border-t border-gray-100">
                                        <span className="text-xs font-bold text-gray-500 uppercase mb-2 block">Attachments</span>
                                        <div className="flex gap-2 flex-wrap">
                                            {selectedTicket.attachments.map((url, i) => (
                                                <a 
                                                    key={i} 
                                                    href={url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="flex items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs text-blue-600 hover:bg-gray-100 transition"
                                                >
                                                    <Paperclip className="w-3 h-3 mr-1" /> 
                                                    {url.split('/').pop() || `File ${i+1}`}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {selectedTicket.replies.map(reply => (
                                <div key={reply.id} className={`flex ${reply.sender === 'admin' ? (reply.internalNote ? 'justify-center' : 'justify-end') : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-xl p-4 shadow-sm ${
                                        reply.internalNote ? 'bg-yellow-50 border border-yellow-200 text-yellow-800 w-full' :
                                        reply.sender === 'admin' ? 'bg-blue-600 text-white rounded-br-none' : 
                                        'bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200'
                                    }`}>
                                        <div className="flex justify-between items-center mb-2 text-xs opacity-80">
                                            <span className="font-bold">{reply.senderName} {reply.internalNote && '(Internal Note)'}</span>
                                            <span>{new Date(reply.timestamp).toLocaleString()}</span>
                                        </div>
                                        <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                                        
                                        {/* Reply Attachments */}
                                        {reply.attachments && reply.attachments.length > 0 && (
                                            <div className="mt-2 pt-2 border-t border-white/20 flex flex-wrap gap-2">
                                                {reply.attachments.map((url, idx) => (
                                                    <a 
                                                        key={idx}
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`flex items-center px-2 py-1 rounded text-xs ${reply.sender === 'admin' && !reply.internalNote ? 'bg-white/20 hover:bg-white/30 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50 text-blue-600'}`}
                                                    >
                                                        <Paperclip className="w-3 h-3 mr-1" />
                                                        Attachment {idx + 1}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Reply Input */}
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <form onSubmit={handleReply}>
                                {/* Attachments Preview */}
                                {replyAttachments.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {replyAttachments.map((url, i) => (
                                            <div key={i} className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full text-xs border border-gray-200">
                                                <FileIcon className="w-3 h-3 mr-2 text-gray-500" />
                                                <span className="truncate max-w-[150px] text-gray-700">{url.split('/').pop()}</span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setReplyAttachments(prev => prev.filter((_, idx) => idx !== i))} 
                                                    className="ml-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200 p-0.5 transition"
                                                >
                                                    <X className="w-3 h-3"/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex items-center gap-2 mb-2">
                                    <label className="flex items-center text-xs text-gray-600 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={internalNote} 
                                            onChange={e => setInternalNote(e.target.checked)}
                                            className="mr-2 rounded text-yellow-500 focus:ring-yellow-500" 
                                        />
                                        Internal Note
                                    </label>
                                </div>
                                <div className="flex gap-2 items-end">
                                    <button
                                        type="button"
                                        onClick={() => setIsFilePickerOpen(true)}
                                        className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition border border-transparent hover:border-blue-100"
                                        title="Attach File"
                                    >
                                        <Paperclip className="w-5 h-5" />
                                    </button>
                                    <textarea 
                                        className={`flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:outline-none ${internalNote ? 'border-yellow-300 focus:ring-yellow-200 bg-yellow-50' : 'border-gray-300 focus:ring-blue-200'}`}
                                        rows={2}
                                        placeholder={internalNote ? "Add an internal note..." : "Reply to customer..."}
                                        value={replyText}
                                        onChange={e => setReplyText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleReply(e);
                                            }
                                        }}
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!replyText.trim() && replyAttachments.length === 0}
                                        className={`px-4 py-3 rounded-lg font-bold text-white transition-colors flex items-center justify-center disabled:opacity-50 ${internalNote ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                        <LifeBuoy className="w-16 h-16 mb-4 opacity-20" />
                        <p>Select a ticket to view details</p>
                    </div>
                )}
            </div>

            <FilePicker 
                isOpen={isFilePickerOpen}
                onClose={() => setIsFilePickerOpen(false)}
                onSelect={handleFileSelect}
                acceptedTypes=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                title="Attach File to Reply"
            />
        </div>
    );
};

export default SupportDisputes;
