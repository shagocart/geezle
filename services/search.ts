
import { TrendingSearch, SearchResult, SearchConfig, UserRole, SearchSuggestion, SearchHistory, RecommendedItem } from '../types';
import { MOCK_GIGS, MOCK_JOBS } from '../constants';
import { CMSService } from './cms';
import { AIService } from './ai/ai.service';

// --- MOCK STATE ---

let trendingSearches: TrendingSearch[] = [
    { id: '1', keyword: 'Logo Design', count: 1540, isPinned: true, isBlocked: false, trend: 'up', lastSearchedAt: new Date().toISOString() },
    { id: '2', keyword: 'WordPress', count: 1200, isPinned: false, isBlocked: false, trend: 'stable', lastSearchedAt: new Date().toISOString() },
    { id: '3', keyword: 'SEO Audit', count: 980, isPinned: false, isBlocked: false, trend: 'up', lastSearchedAt: new Date().toISOString() },
    { id: '4', keyword: 'Video Editing', count: 850, isPinned: false, isBlocked: false, trend: 'down', lastSearchedAt: new Date().toISOString() },
    { id: '5', keyword: 'React Native', count: 600, isPinned: false, isBlocked: false, trend: 'stable', lastSearchedAt: new Date().toISOString() }
];

let searchHistory: SearchHistory[] = [];

let searchConfig: SearchConfig = {
    aiEnabled: true,
    personalizedSuggestions: true,
    maxTrendingItems: 8,
    blockedKeywords: ['scam', 'free money']
};

export const SearchService = {
    // --- Public Methods ---

    saveSearchQuery: async (userId: string, query: string): Promise<void> => {
        // Simulate storing search history
        return new Promise(resolve => {
            if (query && userId) {
                searchHistory.unshift({
                    id: Math.random().toString(36).substr(2, 9),
                    userId,
                    query,
                    createdAt: new Date().toISOString()
                });
            }
            resolve();
        });
    },

    getRecommendations: async (userId: string): Promise<RecommendedItem[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                // Mock: Return a mix of gigs and jobs with random scores
                const recs: RecommendedItem[] = [
                    ...MOCK_GIGS.map(g => ({
                        id: g.id,
                        type: 'gig' as const,
                        title: g.title,
                        description: `Starting at $${g.price}`,
                        image: g.image,
                        score: Math.random() * 100,
                        meta: g
                    })),
                    ...MOCK_JOBS.map(j => ({
                        id: j.id,
                        type: 'job' as const,
                        title: j.title,
                        description: j.description,
                        score: Math.random() * 80,
                        meta: j
                    }))
                ];
                
                // Sort by AI score
                resolve(recs.sort((a, b) => b.score - a.score).slice(0, 4));
            }, 300);
        });
    },

    getTrendingSearches: async (): Promise<TrendingSearch[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                // Return pinned first, then by count, excluding blocked
                const visible = trendingSearches
                    .filter(t => !t.isBlocked && !searchConfig.blockedKeywords.includes(t.keyword.toLowerCase()))
                    .sort((a, b) => (a.isPinned === b.isPinned ? b.count - a.count : a.isPinned ? -1 : 1))
                    .slice(0, searchConfig.maxTrendingItems);
                resolve(visible);
            }, 100);
        });
    },

    getSuggestions: async (query: string, userRole?: UserRole): Promise<SearchSuggestion[]> => {
        return new Promise(resolve => {
            setTimeout(() => {
                if (!query) return resolve([]);

                const q = query.toLowerCase();
                const suggestions: SearchSuggestion[] = [];

                // 1. Keyword Matches from Trending
                trendingSearches.forEach(t => {
                    if (t.keyword.toLowerCase().includes(q) && !t.isBlocked) {
                        suggestions.push({ text: t.keyword, type: 'keyword' });
                    }
                });

                // 2. Categories (Mock logic based on role)
                if (userRole === UserRole.EMPLOYER) {
                    if ('developer'.includes(q)) suggestions.push({ text: 'Hire Web Developers', type: 'category', category: 'Development' });
                    if ('design'.includes(q)) suggestions.push({ text: 'Find Designers', type: 'category', category: 'Design' });
                } else if (userRole === UserRole.FREELANCER) {
                    if ('javascript'.includes(q)) suggestions.push({ text: 'JavaScript Jobs', type: 'category', category: 'Development' });
                }

                resolve(suggestions.slice(0, 5));
            }, 150);
        });
    },

    performSearch: async (query: string, filters?: any): Promise<{ results: SearchResult[], total: number }> => {
        // Use AI Service for query understanding
        let searchTerm = query;
        if (searchConfig.aiEnabled) {
            const analysis = await AIService.semanticSearch({ query });
            if (analysis.refinedQuery) {
                console.log(`[AI Search] Refined "${query}" to "${analysis.refinedQuery}"`);
                searchTerm = analysis.refinedQuery;
            }
        }

        return new Promise(async resolve => {
            const q = searchTerm.toLowerCase();
            const results: SearchResult[] = [];

            // Gigs
            MOCK_GIGS.forEach(g => {
                if (g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)) {
                    results.push({
                        id: g.id,
                        type: 'gig',
                        title: g.title,
                        description: `Starting at $${g.price}`,
                        image: g.image,
                        url: `/gigs/${g.id}`,
                        relevanceScore: 1, 
                        meta: { price: g.price, rating: g.rating, author: g.freelancerName }
                    });
                }
            });

            // Jobs
            MOCK_JOBS.forEach(j => {
                if (j.title.toLowerCase().includes(q) || j.description.toLowerCase().includes(q)) {
                    results.push({
                        id: j.id,
                        type: 'job',
                        title: j.title,
                        description: `${j.type} • ${j.budget}`,
                        url: `/jobs/${j.id}`,
                        relevanceScore: 0.9,
                        meta: { author: j.clientName, date: j.postedTime }
                    });
                }
            });

            // Blogs
            const blogs = await CMSService.getBlogPosts();
            blogs.forEach(b => {
                if (b.title.toLowerCase().includes(q)) {
                    results.push({
                        id: b.id,
                        type: 'blog',
                        title: b.title,
                        description: b.excerpt || '',
                        image: b.featuredImage,
                        url: `/blog/${b.slug}`,
                        relevanceScore: 0.8,
                        meta: { author: b.authorName, date: b.createdAt }
                    });
                }
            });

            // Record Search
            const existingTrend = trendingSearches.find(t => t.keyword.toLowerCase() === q);
            if (existingTrend) {
                existingTrend.count++;
                existingTrend.lastSearchedAt = new Date().toISOString();
            } else if (q.length > 3) {
                trendingSearches.push({
                    id: Math.random().toString(36).substr(2, 9),
                    keyword: query, 
                    count: 1,
                    isPinned: false,
                    isBlocked: false,
                    trend: 'stable',
                    lastSearchedAt: new Date().toISOString()
                });
            }

            resolve({ results, total: results.length });
        });
    },

    // --- Admin Methods ---

    getAllTrendingData: async (): Promise<TrendingSearch[]> => {
        return new Promise(resolve => setTimeout(() => resolve([...trendingSearches].sort((a, b) => b.count - a.count)), 200));
    },

    updateTrendingItem: async (id: string, updates: Partial<TrendingSearch>): Promise<void> => {
        return new Promise(resolve => {
            trendingSearches = trendingSearches.map(t => t.id === id ? { ...t, ...updates } : t);
            resolve();
        });
    },

    deleteTrendingItem: async (id: string): Promise<void> => {
        return new Promise(resolve => {
            trendingSearches = trendingSearches.filter(t => t.id !== id);
            resolve();
        });
    },

    getConfig: async (): Promise<SearchConfig> => {
        return new Promise(resolve => setTimeout(() => resolve({ ...searchConfig }), 100));
    },

    saveConfig: async (config: SearchConfig): Promise<void> => {
        return new Promise(resolve => {
            searchConfig = config;
            resolve();
        });
    },

    getAnalytics: async () => {
        return new Promise(resolve => {
            resolve({
                totalSearches: trendingSearches.reduce((acc, t) => acc + t.count, 0),
                topKeywords: trendingSearches.slice(0, 5).map(t => ({ keyword: t.keyword, count: t.count })),
                zeroResultSearches: 124,
                conversionRate: 8.5
            });
        });
    }
};
