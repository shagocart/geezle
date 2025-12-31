
import { User, Subscriber, StaffMember, StaffRole, Plan, SupportTicket, FraudAlert, MediaItem, ListingCategory, Gig, Job, FraudLog, ChurnRisk, GrowthForecast, OptimizationProposal, AnomalyAlert, MarketingROI } from '../types';
import { MOCK_GIGS, MOCK_JOBS } from '../constants';

const ADMIN_STAFF_KEY = 'atmyworks_staff';
const ADMIN_ROLES_KEY = 'atmyworks_staff_roles';
const ADMIN_GIGS_KEY = 'geezle_admin_gigs';
const ADMIN_JOBS_KEY = 'geezle_admin_jobs';
const CATEGORIES_KEY = 'geezle_admin_categories';

// Helper to get categories with defaults
const getCategoriesFromStorage = (): ListingCategory[] => {
    try {
        const stored = localStorage.getItem(CATEGORIES_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to parse categories", e);
    }
    
    // Defaults if empty
    const defaults: ListingCategory[] = [
        { id: '1', name: 'Development', slug: 'development', type: 'gig', status: 'active', count: 120, sortOrder: 1, subcategories: [
            { id: 's1', name: 'Web Development', slug: 'web-dev', status: 'active', sortOrder: 1 },
            { id: 's2', name: 'Mobile Apps', slug: 'mobile-apps', status: 'active', sortOrder: 2 }
        ]},
        { id: '2', name: 'Design', slug: 'design', type: 'gig', status: 'active', count: 85, sortOrder: 2, subcategories: [
             { id: 's3', name: 'Logo Design', slug: 'logo-design', status: 'active', sortOrder: 1 }
        ]},
        { id: '3', name: 'Writing', slug: 'writing', type: 'job', status: 'active', count: 45, sortOrder: 3, subcategories: [] },
        { id: '4', name: 'Marketing', slug: 'marketing', type: 'gig', status: 'active', count: 60, sortOrder: 4, subcategories: [] }
    ];
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaults));
    return defaults;
};

export const AdminService = {
    // --- USERS ---
    getUsers: async (): Promise<User[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                const stored = localStorage.getItem('geezle_user'); 
                const users: User[] = [
                    { id: 'u1', name: 'John Freelancer', email: 'john@example.com', role: 'freelancer' as any, status: 'active', avatar: 'https://ui-avatars.com/api/?name=John+Freelancer' },
                    { id: 'client-1', name: 'Alice Client', email: 'alice@example.com', role: 'employer' as any, status: 'active', avatar: 'https://ui-avatars.com/api/?name=Alice+Client' },
                    { id: 'admin-1', name: 'Super Admin', email: 'admin@geezle.com', role: 'admin' as any, status: 'active', avatar: 'https://ui-avatars.com/api/?name=Admin' }
                ];
                if (stored) {
                    const current = JSON.parse(stored);
                    // Avoid duplicate if ID matches mock
                    if (!users.find(u => u.id === current.id)) users.push(current);
                    else {
                        const idx = users.findIndex(u => u.id === current.id);
                        if(idx !== -1) users[idx] = current;
                    }
                }
                resolve(users);
            }, 300);
        });
    },

    getSubscribers: async (): Promise<Subscriber[]> => {
        return new Promise(resolve => setTimeout(() => resolve([
            { id: 'sub-1', email: 'fan@example.com', source: 'footer', status: 'verified', subscribedAt: '2023-10-01' },
            { id: 'sub-2', email: 'lead@business.com', source: 'popup', status: 'pending', subscribedAt: '2023-10-05' },
            { id: 'sub-3', email: 'marketer@agency.com', source: 'popup', status: 'verified', subscribedAt: '2023-10-12' },
            { id: 'sub-4', email: 'curious@gmail.com', source: 'footer', status: 'unsubscribed', subscribedAt: '2023-09-15' },
            { id: 'sub-5', email: 'new.user@yahoo.com', source: 'popup', status: 'pending', subscribedAt: '2023-11-01' },
            { id: 'sub-6', email: 'loyal.customer@tech.io', source: 'footer', status: 'active', subscribedAt: '2023-08-20' },
        ]), 200));
    },

    getSubscriberAnalytics: async (): Promise<any> => {
        return new Promise(resolve => setTimeout(() => resolve({
            total: 1240,
            verified: 850,
            pending: 340,
            unsubscribed: 50,
            sources: { popup: 780, footer: 460 },
            growth: { today: 12, week: 85, month: 320 },
            conversion: { popup: 4.2, footer: 1.8 } 
        }), 300));
    },

    updateUserDetail: async (userId: string, data: Partial<User>, adminId: string): Promise<User> => {
        return new Promise((resolve) => {
            // Update in local storage if it matches current user
            const stored = localStorage.getItem('geezle_user');
            if (stored) {
                const current = JSON.parse(stored);
                if (current.id === userId) {
                    const updated = { ...current, ...data };
                    localStorage.setItem('geezle_user', JSON.stringify(updated));
                }
            }
            resolve({ id: userId, ...data } as User);
        });
    },

    updateUserStatus: async (userId: string, status: any, adminId: string): Promise<void> => {
        return Promise.resolve();
    },

    deleteUser: async (userId: string, adminId: string): Promise<void> => {
        return Promise.resolve();
    },

    // --- STAFF ---
    getStaff: async (): Promise<StaffMember[]> => {
        return new Promise(resolve => {
            const stored = localStorage.getItem(ADMIN_STAFF_KEY);
            resolve(stored ? JSON.parse(stored) : []);
        });
    },

    getRoles: async (): Promise<StaffRole[]> => {
        return new Promise(resolve => {
            const stored = localStorage.getItem(ADMIN_ROLES_KEY);
            resolve(stored ? JSON.parse(stored) : [
                { id: 'role-super', name: 'Super Admin', level: 100, permissions: { all: true } },
                { id: 'role-support', name: 'Support Agent', level: 10, permissions: { tickets: true } },
                { id: 'role-manager', name: 'Manager', level: 50, permissions: { users: true, content: true } }
            ]);
        });
    },

    saveStaff: async (staff: Partial<StaffMember>): Promise<StaffMember> => {
        return new Promise(resolve => {
            const all = JSON.parse(localStorage.getItem(ADMIN_STAFF_KEY) || '[]');
            const newStaff = { ...staff, id: staff.id || `staff-${Date.now()}` } as StaffMember;
            const idx = all.findIndex((s: StaffMember) => s.id === newStaff.id);
            if (idx >= 0) all[idx] = newStaff;
            else all.push(newStaff);
            localStorage.setItem(ADMIN_STAFF_KEY, JSON.stringify(all));
            resolve(newStaff);
        });
    },

    deleteStaff: async (id: string): Promise<void> => {
        const all = JSON.parse(localStorage.getItem(ADMIN_STAFF_KEY) || '[]');
        localStorage.setItem(ADMIN_STAFF_KEY, JSON.stringify(all.filter((s: StaffMember) => s.id !== id)));
    },

    // --- LISTINGS (Gigs & Jobs) ---
    getAdminGigs: async (): Promise<Gig[]> => {
        return new Promise(resolve => {
            const stored = localStorage.getItem(ADMIN_GIGS_KEY);
            // Return stored gigs, or if empty, initialize with MOCK_GIGS
            if (stored) {
                resolve(JSON.parse(stored));
            } else {
                localStorage.setItem(ADMIN_GIGS_KEY, JSON.stringify(MOCK_GIGS));
                resolve([...MOCK_GIGS]);
            }
        });
    },

    getAdminJobs: async (): Promise<Job[]> => {
        return new Promise(resolve => {
            const stored = localStorage.getItem(ADMIN_JOBS_KEY);
            if (stored) {
                resolve(JSON.parse(stored));
            } else {
                localStorage.setItem(ADMIN_JOBS_KEY, JSON.stringify(MOCK_JOBS));
                resolve([...MOCK_JOBS]);
            }
        });
    },

    saveGig: async (gig: Gig): Promise<void> => {
        return new Promise(resolve => {
             const stored = localStorage.getItem(ADMIN_GIGS_KEY);
             const gigs: Gig[] = stored ? JSON.parse(stored) : [...MOCK_GIGS];
             const idx = gigs.findIndex(g => g.id === gig.id);
             if (idx >= 0) gigs[idx] = gig;
             else gigs.unshift(gig);
             localStorage.setItem(ADMIN_GIGS_KEY, JSON.stringify(gigs));
             resolve();
        });
    },

    saveJob: async (job: Job): Promise<void> => {
        return new Promise(resolve => {
             const stored = localStorage.getItem(ADMIN_JOBS_KEY);
             const jobs: Job[] = stored ? JSON.parse(stored) : [...MOCK_JOBS];
             const idx = jobs.findIndex(j => j.id === job.id);
             if (idx >= 0) jobs[idx] = job;
             else jobs.unshift(job);
             localStorage.setItem(ADMIN_JOBS_KEY, JSON.stringify(jobs));
             resolve();
        });
    },

    deleteGig: async (id: string): Promise<void> => {
        const stored = localStorage.getItem(ADMIN_GIGS_KEY);
        const gigs: Gig[] = stored ? JSON.parse(stored) : [...MOCK_GIGS];
        const filtered = gigs.filter(g => g.id !== id);
        localStorage.setItem(ADMIN_GIGS_KEY, JSON.stringify(filtered));
    },

    deleteJob: async (id: string): Promise<void> => {
        const stored = localStorage.getItem(ADMIN_JOBS_KEY);
        const jobs: Job[] = stored ? JSON.parse(stored) : [...MOCK_JOBS];
        const filtered = jobs.filter(j => j.id !== id);
        localStorage.setItem(ADMIN_JOBS_KEY, JSON.stringify(filtered));
    },

    approveListing: async (type: 'gig' | 'job', id: string, status: string): Promise<void> => {
        if (type === 'gig') {
            const stored = localStorage.getItem(ADMIN_GIGS_KEY);
            const gigs: Gig[] = stored ? JSON.parse(stored) : [...MOCK_GIGS];
            const idx = gigs.findIndex(g => g.id === id);
            if (idx >= 0) {
                gigs[idx].status = status as any;
                gigs[idx].adminStatus = status === 'active' ? 'approved' : status as any;
                localStorage.setItem(ADMIN_GIGS_KEY, JSON.stringify(gigs));
            }
        } else {
            const stored = localStorage.getItem(ADMIN_JOBS_KEY);
            const jobs: Job[] = stored ? JSON.parse(stored) : [...MOCK_JOBS];
            const idx = jobs.findIndex(j => j.id === id);
            if (idx >= 0) {
                jobs[idx].status = status as any;
                localStorage.setItem(ADMIN_JOBS_KEY, JSON.stringify(jobs));
            }
        }
    },

    // --- CATEGORIES ---
    getGigCategories: async (): Promise<ListingCategory[]> => {
        return new Promise(resolve => {
            const cats = getCategoriesFromStorage();
            resolve(cats.filter(c => c.type === 'gig'));
        });
    },

    getJobCategories: async (): Promise<ListingCategory[]> => {
        return new Promise(resolve => {
            const cats = getCategoriesFromStorage();
            resolve(cats.filter(c => c.type === 'job'));
        });
    },

    saveListingCategory: async (cat: ListingCategory): Promise<void> => {
        return new Promise(resolve => {
            const all = getCategoriesFromStorage();
            const idx = all.findIndex(c => c.id === cat.id);
            if (idx >= 0) all[idx] = cat;
            else all.push(cat);
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(all));
            resolve();
        });
    },

    deleteListingCategory: async (id: string): Promise<void> => {
        return new Promise(resolve => {
            const all = getCategoriesFromStorage();
            const filtered = all.filter(c => c.id !== id);
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered));
            resolve();
        });
    },
    
    // --- PLANS ---
    getPlans: async (): Promise<Plan[]> => {
        return [
            { id: 'p1', name: 'Basic', type: 'freelancer', price: 0, interval: 'monthly', currency: 'USD', isActive: true, isPopular: false, features: [] },
            { id: 'p2', name: 'Pro', type: 'freelancer', price: 10, interval: 'monthly', currency: 'USD', isActive: true, isPopular: true, features: [] }
        ];
    },
    savePlan: async (plan: Plan): Promise<void> => {},

    // --- AI ANALYTICS ---
    getAIAnalytics: async (): Promise<any> => {
        return {
            totalConversations: 1250,
            costEstimate: 12.50,
            avgResponseTime: 450,
            safetyStats: { spamTriggers: 5 },
            topRoles: [{ role: 'freelancer', count: 800 }, { role: 'employer', count: 450 }],
            conversionImpact: { aiGigsCreated: 120, aiHireRate: 15, revenueUplift: 4500 }
        };
    },

    getFraudAlerts: async (): Promise<FraudAlert[]> => {
        return [
            { id: 'fa1', userId: 'u-suspicious', userName: 'Bot User', userRole: 'freelancer', score: 85, riskLevel: 'Critical', reason: 'High velocity', contentSnippet: '', action: 'Auto-Frozen', reviewed: false, timestamp: new Date().toISOString() }
        ];
    },

    // --- NEW INTELLIGENCE DATA ---

    getFraudLogs: async (): Promise<FraudLog[]> => {
        return new Promise(resolve => setTimeout(() => resolve([
            { id: 'fl-1', email: 'spam@temp-mail.org', ip: '192.168.1.5', riskScore: 85, riskLevel: 'Critical', reasons: ['Disposable Domain', 'High Frequency'], actionTaken: 'Blocked', timestamp: new Date().toISOString() },
            { id: 'fl-2', email: 'john@gmail.com', ip: '10.0.0.2', riskScore: 10, riskLevel: 'Low', reasons: [], actionTaken: 'Allow', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: 'fl-3', email: 'bot@script.net', ip: '45.32.11.9', riskScore: 65, riskLevel: 'Medium', reasons: ['IP Reputation'], actionTaken: 'Flagged', timestamp: new Date(Date.now() - 86400000).toISOString() }
        ]), 300));
    },

    getChurnRisks: async (): Promise<ChurnRisk[]> => {
        return new Promise(resolve => setTimeout(() => resolve([
            { userId: 'u-101', userName: 'Tech Startup', role: 'employer', score: 75, window: '14d', factors: ['Low Activity', 'Failed Payment'], lastActive: '2023-10-15', projectedLoss: 1200 },
            { userId: 'u-102', userName: 'Sarah Writer', role: 'freelancer', score: 60, window: '30d', factors: ['No Gigs Sold', 'Profile Incomplete'], lastActive: '2023-10-20', projectedLoss: 150 }
        ]), 300));
    },

    getGrowthForecast: async (): Promise<GrowthForecast[]> => {
        return new Promise(resolve => setTimeout(() => resolve([
            { date: '2023-11-01', subscribers: 1240, revenue: 15000, source: 'current' },
            { date: '2023-11-15', subscribers: 1350, revenue: 16200, source: 'predicted' },
            { date: '2023-12-01', subscribers: 1500, revenue: 18500, source: 'predicted' },
            { date: '2023-12-15', subscribers: 1750, revenue: 21000, source: 'predicted' },
            { date: '2024-01-01', subscribers: 2100, revenue: 25000, source: 'predicted' },
        ]), 300));
    },

    getOptimizationProposals: async (): Promise<OptimizationProposal[]> => {
        return new Promise(resolve => setTimeout(() => resolve([
            { id: 'opt-1', module: 'popup', issue: 'High abandonment rate on signup form', recommendation: 'Delay popup trigger by 10s and reduce fields', impact: '+12% Conversion', status: 'pending', generatedAt: new Date().toISOString(), details: 'Current trigger: 2s. Suggested: 12s.' },
            { id: 'opt-2', module: 'email', issue: 'Low open rate on Welcome Email', recommendation: 'Personalize subject line with User Name', impact: '+5% Open Rate', status: 'approved', generatedAt: new Date(Date.now() - 86400000).toISOString(), details: 'A/B test results showed 5% uplift.' },
        ]), 300));
    },

    getAnomalyAlerts: async (): Promise<AnomalyAlert[]> => {
        return new Promise(resolve => setTimeout(() => resolve([
            { id: 'an-1', severity: 'warning', area: 'signups', message: 'Unusual spike in guest traffic from new IP range', value: '450/hr', baseline: '120/hr', timestamp: new Date().toISOString(), status: 'active' },
            { id: 'an-2', severity: 'info', area: 'payments', message: 'Payment gateway latency slightly elevated', value: '1.2s', baseline: '0.4s', timestamp: new Date(Date.now() - 3600000).toISOString(), status: 'resolved' }
        ]), 300));
    },

    getMarketingROI: async (): Promise<MarketingROI[]> => {
        return new Promise(resolve => setTimeout(() => resolve([
            { channel: 'Google Ads', spend: 5000, conversions: 120, costPerAcquisition: 41.66, revenue: 15000, roi: 200 },
            { channel: 'Email Marketing', spend: 500, conversions: 450, costPerAcquisition: 1.11, revenue: 8500, roi: 1600 },
            { channel: 'Content/SEO', spend: 2000, conversions: 85, costPerAcquisition: 23.52, revenue: 6000, roi: 200 },
            { channel: 'Referral Program', spend: 1200, conversions: 200, costPerAcquisition: 6.00, revenue: 9000, roi: 650 }
        ]), 300));
    },

    // --- FILES ---
    getAllFiles: async (): Promise<MediaItem[]> => {
        return [];
    },
    deleteFile: async (id: string, adminId: string): Promise<void> => {},
};
