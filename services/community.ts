
import { 
    ForumThread, CommunityClub, CommunityEvent, ContributorProfile, 
    CommunityChannel, CommunityMessage, LeaderboardEntry, CommunityAnalytics, ReputationScore, CommunitySettings, ModerationLog, CommunityComment, UserRole 
} from '../types';
import { GcoinService } from './gcoin';

// Mock Data
const MOCK_THREADS: ForumThread[] = [
    {
        id: 't1', categoryId: 'c1', categoryName: 'General Freelancing', userId: 'u2', userName: 'Sarah J.', userAvatar: 'https://ui-avatars.com/api/?name=Sarah+J',
        title: 'How to handle scope creep effectively?', content: 'Clients keep adding small tasks to the project without increasing the budget. How do you handle this professionally?', status: 'solved', views: 1205, repliesCount: 3, upvotes: 45, isPinned: true, createdAt: '2023-10-25T10:00:00Z', tags: ['advice', 'clients'],
        interactions: { likes: 45, comments: 3, reposts: 5, shares: 12 },
        userState: { liked: true, reposted: false }
    },
    // ... other threads
    {
        id: 't2', categoryId: 'c2', categoryName: 'Tech Talk', userId: 'u3', userName: 'Dev Mike', userAvatar: 'https://ui-avatars.com/api/?name=Dev+Mike',
        title: 'Best practices for React 19?', content: 'Looking for opinions on the new hook structure in React 19. Is it worth refactoring existing codebases?', status: 'open', views: 340, repliesCount: 0, upvotes: 12, isPinned: false, createdAt: '2023-10-28T14:30:00Z', tags: ['react', 'development'],
        interactions: { likes: 12, comments: 0, reposts: 1, shares: 3 },
        userState: { liked: false, reposted: false }
    },
    {
        id: 't3', categoryId: 'c3', categoryName: 'Marketing', userId: 'u4', userName: 'Growth Guru', userAvatar: 'https://ui-avatars.com/api/?name=Growth+Guru',
        title: 'Strategies for getting the first 100 users for a SaaS', content: 'Sharing my case study on how I used Reddit and cold email to get traction.', status: 'open', views: 890, repliesCount: 22, upvotes: 67, isPinned: false, createdAt: '2023-11-01T09:00:00Z', tags: ['marketing', 'growth', 'saas'],
        interactions: { likes: 67, comments: 22, reposts: 15, shares: 40 },
        userState: { liked: false, reposted: true }
    }
];

// Mock Comments (Flat structure, service handles nesting)
let MOCK_COMMENTS: CommunityComment[] = [
    { id: 'c1', threadId: 't1', parentId: null, userId: 'u5', userName: 'Alex Expert', userAvatar: 'https://ui-avatars.com/api/?name=Alex', userRole: UserRole.FREELANCER, content: 'Always have a clear contract with revision limits.', createdAt: '2023-10-25T11:00:00Z', likes: 10, isLiked: false },
    { id: 'c2', threadId: 't1', parentId: 'c1', userId: 'u2', userName: 'Sarah J.', userAvatar: 'https://ui-avatars.com/api/?name=Sarah+J', userRole: UserRole.FREELANCER, content: 'Thanks @Alex Expert! Do you charge hourly for extras?', createdAt: '2023-10-25T12:00:00Z', likes: 2, isLiked: true },
    { id: 'c3', threadId: 't1', parentId: 'c2', userId: 'u5', userName: 'Alex Expert', userAvatar: 'https://ui-avatars.com/api/?name=Alex', userRole: UserRole.FREELANCER, content: 'Yes, absolutely. I send a new proposal for any out-of-scope work.', createdAt: '2023-10-25T12:30:00Z', likes: 5, isLiked: false },
];

// ... (Existing MOCK_CLUBS, MOCK_EVENTS, etc. remain unchanged)
const MOCK_CLUBS: CommunityClub[] = [
    { id: 'cl1', name: 'SaaS Founders', description: 'For freelancers building their own products.', visibility: 'public', memberCount: 1240, coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80', ownerId: 'u1', isJoined: true },
    { id: 'cl2', name: 'UI/UX Design Hub', description: 'Share critiques and resources.', visibility: 'private', memberCount: 850, coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80', ownerId: 'u5', isJoined: false },
    { id: 'cl3', name: 'Video Editors', description: 'Premiere Pro & After Effects wizards.', visibility: 'public', memberCount: 420, coverImage: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44c?auto=format&fit=crop&w=400&q=80', ownerId: 'u8' }
];

const MOCK_EVENTS: CommunityEvent[] = [
    { id: 'ev1', title: 'Mastering AI Tools', description: 'A workshop on using Gemini for coding.', startTime: '2023-11-15T18:00:00Z', endTime: '2023-11-15T19:30:00Z', type: 'workshop', hostName: 'AtMyWorks Academy', attendees: 350, image: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=400&q=80', isRegistered: true },
    { id: 'ev2', title: 'Freelancer Networking', description: 'Meet peers in your timezone.', startTime: '2023-11-20T16:00:00Z', endTime: '2023-11-20T17:00:00Z', type: 'meetup', hostName: 'Community Team', attendees: 120, image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=400&q=80' }
];

const MOCK_CONTRIBUTORS: ContributorProfile[] = [
    { userId: 'u10', userName: 'Alex Expert', avatar: 'https://ui-avatars.com/api/?name=Alex', points: 15400, reputation: 'Elite', badges: ['Top Answerer', 'Mentor'] },
    { userId: 'u11', userName: 'Lisa Helper', avatar: 'https://ui-avatars.com/api/?name=Lisa', points: 8500, reputation: 'Gold', badges: ['Rising Star'] },
    { userId: 'u12', userName: 'Code Master', avatar: 'https://ui-avatars.com/api/?name=Code', points: 6200, reputation: 'Silver', badges: ['Bug Hunter'] }
];

const MOCK_CHANNELS: CommunityChannel[] = [
    { id: 'ch1', name: 'General Chat', type: 'public', isPaid: false, price: 0, unreadCount: 5, onlineCount: 124 },
    { id: 'ch2', name: 'Tech Support', type: 'public', isPaid: false, price: 0, unreadCount: 0, onlineCount: 45 },
    { id: 'ch3', name: 'SaaS Founders VIP', type: 'club', isPaid: true, price: 9.99, unreadCount: 12, onlineCount: 30 },
    { id: 'ch4', name: 'Event: AI Workshop', type: 'event', isPaid: false, price: 0, unreadCount: 0, onlineCount: 85 }
];

const MOCK_MESSAGES: CommunityMessage[] = [
    { id: 'm1', channelId: 'ch1', userId: 'u2', userName: 'Sarah J.', userAvatar: 'https://ui-avatars.com/api/?name=Sarah+J', content: 'Has anyone tried the new Gemini API?', timestamp: new Date(Date.now() - 3600000).toISOString(), aiFlagged: false },
    { id: 'm2', channelId: 'ch1', userId: 'u3', userName: 'Dev Mike', userAvatar: 'https://ui-avatars.com/api/?name=Dev+Mike', content: 'Yes! It is blazing fast.', timestamp: new Date(Date.now() - 3500000).toISOString(), aiFlagged: false }
];

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, userId: 'u10', userName: 'Alex Expert', userAvatar: 'https://ui-avatars.com/api/?name=Alex', score: 15400, trend: 'up', contributions: 452, category: 'Development' },
    { rank: 2, userId: 'u11', userName: 'Lisa Helper', userAvatar: 'https://ui-avatars.com/api/?name=Lisa', score: 8500, trend: 'stable', contributions: 310, category: 'Design' },
    { rank: 3, userId: 'u12', userName: 'Code Master', userAvatar: 'https://ui-avatars.com/api/?name=Code', score: 6200, trend: 'down', contributions: 215, category: 'Marketing' },
    { rank: 4, userId: 'u13', userName: 'Writer Pro', userAvatar: 'https://ui-avatars.com/api/?name=Writer', score: 5800, trend: 'up', contributions: 180, category: 'Writing' },
    { rank: 5, userId: 'u14', userName: 'SEO Ninja', userAvatar: 'https://ui-avatars.com/api/?name=SEO', score: 5100, trend: 'stable', contributions: 150, category: 'SEO' },
];

const DEFAULT_SETTINGS: CommunitySettings = {
    modules: { forum: true, clubs: true, events: true, content: true, contributors: true },
    ai: { moderationEnabled: true, autoSummary: true, sentimentAnalysis: false, adminOverride: true },
    permissions: { requireApproval: false, allowMedia: true, allowEmbeds: true, allowTagging: true },
    editor: { enabledFeatures: ['bold', 'italic', 'image', 'video'], maxContentLength: 5000 }
};

let currentSettings = { ...DEFAULT_SETTINGS };
let moderationLogs: ModerationLog[] = [
    { id: 'log-1', userName: 'SpamBot', snippet: 'Earn $5000 daily...', riskLevel: 'High', reason: 'Spam/Scam', actionTaken: 'Blocked' }
];

// Helper to build tree
const buildCommentTree = (comments: CommunityComment[]): CommunityComment[] => {
    const map: Record<string, CommunityComment> = {};
    const roots: CommunityComment[] = [];

    // Initialize map with empty replies
    comments.forEach(c => {
        map[c.id] = { ...c, replies: [] };
    });

    comments.forEach(c => {
        if (c.parentId && map[c.parentId]) {
            map[c.parentId].replies?.push(map[c.id]);
        } else {
            roots.push(map[c.id]);
        }
    });

    return roots;
};

export const CommunityService = {
    // --- Existing Data ---
    getThreads: async () => Promise.resolve([...MOCK_THREADS]),
    getThreadById: async (id: string) => Promise.resolve(MOCK_THREADS.find(t => t.id === id) || null),
    getClubs: async () => Promise.resolve([...MOCK_CLUBS]),
    getEvents: async () => Promise.resolve([...MOCK_EVENTS]),
    getTopContributors: async () => Promise.resolve([...MOCK_CONTRIBUTORS]),
    getSettings: async () => Promise.resolve({...currentSettings}),
    
    // --- Comments ---
    getComments: async (threadId: string): Promise<CommunityComment[]> => {
        const flatComments = MOCK_COMMENTS.filter(c => c.threadId === threadId).sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return Promise.resolve(buildCommentTree(flatComments));
    },

    postComment: async (threadId: string, content: string, user: any, parentId: string | null = null): Promise<CommunityComment> => {
        // Detect mentions (@username)
        const mentions: string[] = [];
        const mentionRegex = /@([a-zA-Z0-9_ ]+)/g;
        let match;
        while ((match = mentionRegex.exec(content)) !== null) {
            // In real app, verify user ID. Here we just log the name found
            mentions.push(match[1]); 
        }

        const newComment: CommunityComment = {
            id: `c-${Date.now()}`,
            threadId,
            parentId,
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            userRole: user.role,
            content,
            createdAt: new Date().toISOString(),
            likes: 0,
            isLiked: false,
            replies: [],
            mentions
        };

        MOCK_COMMENTS.push(newComment);
        
        // Update thread counts
        const thread = MOCK_THREADS.find(t => t.id === threadId);
        if(thread) {
            thread.repliesCount++;
            if(thread.interactions) thread.interactions.comments++;
        }

        // Mock Notification Trigger
        if (mentions.length > 0) {
            console.log(`[Notification Service] Sending mentions to: ${mentions.join(', ')}`);
        }

        return Promise.resolve(newComment);
    },

    updateSettings: async (settings: Partial<CommunitySettings>): Promise<void> => {
        currentSettings = { ...currentSettings, ...settings };
        return Promise.resolve();
    },

    getModerationLogs: async () => Promise.resolve([...moderationLogs]),
    
    createThread: async (thread: Partial<ForumThread>): Promise<ForumThread> => {
        const newThread: ForumThread = {
             id: `t-${Date.now()}`,
             categoryId: thread.categoryId || 'general',
             categoryName: 'General',
             userId: 'current-user',
             userName: 'You',
             userAvatar: 'https://ui-avatars.com/api/?name=You',
             title: thread.title || '',
             content: thread.content || '',
             status: 'open',
             views: 0,
             repliesCount: 0,
             upvotes: 0,
             isPinned: false,
             createdAt: new Date().toISOString(),
             tags: thread.tags || [],
             interactions: { likes: 0, comments: 0, reposts: 0, shares: 0 },
             userState: { liked: false, reposted: false }
         };
         MOCK_THREADS.unshift(newThread);
         return Promise.resolve(newThread);
    },
    
    joinClub: async (id: string) => Promise.resolve(),
    registerEvent: async (id: string) => Promise.resolve(),
    
    moderateContent: async (text: string): Promise<{ safe: boolean; reason?: string }> => {
         // Simple mock logic
         if (text.toLowerCase().includes('scam') || text.toLowerCase().includes('password')) {
             return { safe: false, reason: 'Flagged for restricted content.' };
         }
         return { safe: true };
    },

    // --- Chat ---
    getChannels: async (): Promise<CommunityChannel[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_CHANNELS]), 200));
    },

    getMessages: async (channelId: string): Promise<CommunityMessage[]> => {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_MESSAGES.filter(m => m.channelId === channelId || channelId === 'ch1')), 200)); 
    },

    sendMessage: async (channelId: string, text: string, user: any): Promise<CommunityMessage> => {
        return new Promise(resolve => {
            const msg: CommunityMessage = {
                id: `msg-${Date.now()}`,
                channelId,
                userId: user.id,
                userName: user.name,
                userAvatar: user.avatar,
                content: text,
                timestamp: new Date().toISOString(),
                aiFlagged: false
            };
            MOCK_MESSAGES.push(msg);
            resolve(msg);
        });
    },

    // --- Interaction Handling (Universal) ---
    toggleLike: async (id: string, type: 'thread' | 'comment' | 'post'): Promise<void> => {
        // Mock update in memory
        if (type === 'comment') {
            const comment = MOCK_COMMENTS.find(c => c.id === id);
            if (comment) {
                comment.isLiked = !comment.isLiked;
                comment.likes += comment.isLiked ? 1 : -1;
            }
        } else {
            const thread = MOCK_THREADS.find(t => t.id === id);
            if (thread && thread.interactions && thread.userState) {
                const liked = !thread.userState.liked;
                thread.userState.liked = liked;
                thread.interactions.likes += liked ? 1 : -1;
                
                // Check Reward (Mock ID u1)
                if (liked) await GcoinService.checkAndAward('u1', 'like', thread.interactions.likes);
            }
        }
    },

    repost: async (id: string, type: string): Promise<void> => {
        const thread = MOCK_THREADS.find(t => t.id === id);
        if (thread && thread.interactions && thread.userState) {
            thread.userState.reposted = true;
            thread.interactions.reposts += 1;
            await GcoinService.checkAndAward('u1', 'repost', thread.interactions.reposts);
        }
    },

    // --- Reputation & Leaderboard ---
    getReputationScore: async (userId: string): Promise<ReputationScore> => {
        return new Promise(resolve => setTimeout(() => resolve({
            userId,
            score: 782,
            trustLevel: 'Expert',
            badges: ['Top Contributor', 'Fast Responder'],
            signals: [{ name: 'Helpful Replies', impact: 50 }, { name: 'Verified', impact: 20 }],
            history: []
        }), 300));
    },

    getLeaderboard: async (period: 'weekly' | 'monthly' | 'all-time'): Promise<LeaderboardEntry[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...MOCK_LEADERBOARD]), 300));
    },

    // --- Admin Analytics ---
    getCommunityAnalytics: async (): Promise<CommunityAnalytics> => {
        return new Promise(resolve => setTimeout(() => resolve({
            healthScore: 88,
            activeUsers: 1450,
            messagesToday: 3200,
            aiFlaggedCount: 15,
            engagementTrend: [65, 70, 75, 72, 80, 85, 88],
            topChannels: [{ name: 'General Chat', activity: 1200 }, { name: 'SaaS Founders', activity: 850 }],
            toxicityScore: 2.1
        }), 400));
    },

    // --- Admin Actions ---
    deleteThread: async (threadId: string): Promise<void> => {
        const idx = MOCK_THREADS.findIndex(t => t.id === threadId);
        if(idx >= 0) MOCK_THREADS.splice(idx, 1);
        return Promise.resolve();
    },

    toggleThreadLock: async (threadId: string): Promise<boolean> => {
        const t = MOCK_THREADS.find(t => t.id === threadId);
        if(t) t.status = t.status === 'locked' ? 'open' : 'locked';
        return Promise.resolve(t?.status === 'locked');
    },

    toggleThreadPin: async (threadId: string): Promise<boolean> => {
        const t = MOCK_THREADS.find(t => t.id === threadId);
        if(t) t.isPinned = !t.isPinned;
        return Promise.resolve(!!t?.isPinned);
    },

    deleteClub: async (id: string): Promise<void> => {
        const idx = MOCK_CLUBS.findIndex(c => c.id === id);
        if(idx >= 0) MOCK_CLUBS.splice(idx, 1);
        return Promise.resolve();
    },

    deleteEvent: async (id: string): Promise<void> => {
        const idx = MOCK_EVENTS.findIndex(e => e.id === id);
        if(idx >= 0) MOCK_EVENTS.splice(idx, 1);
        return Promise.resolve();
    },

    createChannel: async (channel: Partial<CommunityChannel>): Promise<CommunityChannel> => {
        const newChannel: CommunityChannel = {
            id: `ch-${Date.now()}`,
            name: channel.name || 'New Channel',
            type: channel.type || 'public',
            isPaid: !!channel.isPaid,
            price: channel.price || 0,
            unreadCount: 0,
            onlineCount: 0,
            isLocked: false
        };
        MOCK_CHANNELS.push(newChannel);
        return Promise.resolve(newChannel);
    },

    deleteChannel: async (id: string): Promise<void> => {
        const idx = MOCK_CHANNELS.findIndex(c => c.id === id);
        if(idx >= 0) MOCK_CHANNELS.splice(idx, 1);
        return Promise.resolve();
    }
};