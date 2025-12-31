
import { DemandForecast } from '../../types';

// Mock AI Service for Demand Forecasting
// In production, this would connect to an ML model or Gemini analysis on real data.

export const ForecastingService = {
    getForecasts: async (): Promise<DemandForecast[]> => {
        // Simulating API Latency
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { 
                        skill: "AI Automation", 
                        growthRate: 38, 
                        recommendedPriceRange: "$45–$85/hr", 
                        regions: ["US", "EU", "SEA"], 
                        confidence: 0.92, 
                        timeframe: 'Short-Term', 
                        category: 'AI Services' 
                    },
                    { 
                        skill: "Rust Development", 
                        growthRate: 25, 
                        recommendedPriceRange: "$60–$100/hr", 
                        regions: ["US", "EU"], 
                        confidence: 0.85, 
                        timeframe: 'Mid-Term', 
                        category: 'Development' 
                    },
                    { 
                        skill: "Video Generation", 
                        growthRate: 45, 
                        recommendedPriceRange: "$50–$90/hr", 
                        regions: ["Global"], 
                        confidence: 0.88, 
                        timeframe: 'Short-Term', 
                        category: 'Video' 
                    },
                    { 
                        skill: "Sustainability Consulting", 
                        growthRate: 15, 
                        recommendedPriceRange: "$80–$150/hr", 
                        regions: ["EU", "UK"], 
                        confidence: 0.75, 
                        timeframe: 'Long-Term', 
                        category: 'Business' 
                    },
                    { 
                        skill: "Web3 Security", 
                        growthRate: 12, 
                        recommendedPriceRange: "$100–$200/hr", 
                        regions: ["US", "SG"], 
                        confidence: 0.70, 
                        timeframe: 'Mid-Term', 
                        category: 'Blockchain' 
                    },
                    {
                        skill: "React Native",
                        growthRate: 8,
                        recommendedPriceRange: "$40-$70/hr",
                        regions: ["Global"],
                        confidence: 0.95,
                        timeframe: "Short-Term",
                        category: "Mobile Dev"
                    }
                ]);
            }, 600);
        });
    }
};
