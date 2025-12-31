
import { LTVMetric, ReferralIntelligence, DemandForecast } from "../../types";

export const MarketService = {
    getLTVPredictions: async (): Promise<LTVMetric[]> => {
        return new Promise(resolve => setTimeout(() => resolve([
            { userId: 'u1', userName: 'Top Agency', role: 'freelancer' as any, predictedLTV: 150000, confidenceScore: 92, revenueVelocity: 'High', churnRisk: 5, nextAction: 'Offer Pro Plan' },
            { userId: 'u2', userName: 'Startup Inc', role: 'employer' as any, predictedLTV: 45000, confidenceScore: 85, revenueVelocity: 'Medium', churnRisk: 15, nextAction: 'Send Case Studies' },
            { userId: 'u3', userName: 'New Dev', role: 'freelancer' as any, predictedLTV: 5000, confidenceScore: 60, revenueVelocity: 'Low', churnRisk: 45, nextAction: 'Suggest Upskilling' },
        ]), 600));
    },

    getReferralIntelligence: async (): Promise<ReferralIntelligence> => {
        return new Promise(resolve => setTimeout(() => resolve({
            topReferrers: [
                { userId: 'u10', name: 'Tech Blogger', totalReferrals: 125, qualityScore: 95, kFactor: 1.8 },
                { userId: 'u11', name: 'Design Guru', totalReferrals: 45, qualityScore: 88, kFactor: 1.2 }
            ],
            fraudAlerts: [
                { referrerId: 'u99', reason: 'Self-referral loop detected', severity: 'High' }
            ],
            campaignSuggestions: [
                'Increase commission for "SaaS" category referrals to 15%',
                'Launch "Refer-a-Founder" bonus for employers'
            ]
        }), 600));
    },

    getDemandForecast: async (): Promise<DemandForecast[]> => {
        return new Promise(resolve => setTimeout(() => resolve([
            { skill: "AI Agent Dev", growthRate: 145, recommendedPriceRange: "$80-$150/hr", regions: ["Global"], confidence: 0.95, timeframe: "30d", category: "AI" },
            { skill: "Rust", growthRate: 40, recommendedPriceRange: "$70-$120/hr", regions: ["US", "EU"], confidence: 0.88, timeframe: "90d", category: "Backend" },
            { skill: "Video UGC", growthRate: 65, recommendedPriceRange: "$100-$500/video", regions: ["US"], confidence: 0.90, timeframe: "30d", category: "Marketing" }
        ]), 600));
    }
};
