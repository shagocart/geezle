
import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { AdminService } from '../services/admin';
import { CMSService } from '../services/cms';
import { ListingCategory, TrendingConfig } from '../types';
import { useUser } from '../context/UserContext';

const TrendingCategoriesStrip = () => {
    const navigate = useNavigate();
    const { user } = useUser();
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [categories, setCategories] = useState<ListingCategory[]>([]);
    const [config, setConfig] = useState<TrendingConfig | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const [conf, gigs, jobs] = await Promise.all([
                CMSService.getTrendingConfig(),
                AdminService.getGigCategories(),
                AdminService.getJobCategories()
            ]);
            
            setConfig(conf);

            // Filter categories based on config if specific IDs provided, else show active sorted by popularity
            const allCats = [...gigs, ...jobs].filter(c => c.status === 'active');
            let displayCats = allCats;

            if (conf.categoryIds && conf.categoryIds.length > 0) {
                displayCats = allCats.filter(c => conf.categoryIds.includes(c.id));
                // Sort by config order
                displayCats.sort((a, b) => conf.categoryIds.indexOf(a.id) - conf.categoryIds.indexOf(b.id));
            } else {
                displayCats.sort((a,b) => b.count - a.count);
            }

            setCategories(displayCats);
        };
        loadData();
    }, []);

    // Check visibility based on user role
    if (config) {
        const userRole = user?.role || 'guest';
        // Need to map 'guest' string to UserRole enum or handle loosely.
        // Assuming config.visibility stores enum values stringified.
        const isVisible = config.visibility.some(v => v === userRole);
        if (!config.enabled || !isVisible) return null;
    }

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const newScrollLeft = direction === 'left' 
                ? scrollContainerRef.current.scrollLeft - scrollAmount 
                : scrollContainerRef.current.scrollLeft + scrollAmount;
            
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
        }
    };

    useEffect(() => {
        const el = scrollContainerRef.current;
        if (el) {
            el.addEventListener('scroll', checkScrollButtons);
            checkScrollButtons(); // Initial check
            return () => el.removeEventListener('scroll', checkScrollButtons);
        }
    }, [categories]);

    // Auto-scroll logic if enabled
    useEffect(() => {
        if (config?.scrollBehavior === 'auto' && config.autoSlideInterval > 0) {
            const interval = setInterval(() => {
                if (scrollContainerRef.current) {
                    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
                    if (scrollLeft + clientWidth >= scrollWidth - 5) {
                        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        scroll('right');
                    }
                }
            }, config.autoSlideInterval);
            return () => clearInterval(interval);
        }
    }, [config, categories]);

    if (categories.length === 0) return null;

    return (
        <div className="bg-white border-b border-gray-200 relative shadow-sm z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center">
                <div className="flex items-center mr-4 text-gray-500 text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                    <TrendingUp className="w-4 h-4 mr-1 text-red-500" /> {config?.title || 'Trending 🔥'}
                </div>
                
                <div className="relative flex-1 overflow-hidden group">
                    {canScrollLeft && (
                        <button 
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-1 rounded-full shadow-md text-gray-600 hover:text-blue-600 border border-gray-100"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                    )}

                    <div 
                        ref={scrollContainerRef}
                        className="flex space-x-3 overflow-x-auto scrollbar-hide scroll-smooth px-1"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => navigate(`/browse?category=${cat.name}`)}
                                className="flex-shrink-0 px-3 py-1.5 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 rounded-full text-xs font-medium text-gray-700 hover:text-blue-700 transition-colors whitespace-nowrap"
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {canScrollRight && (
                        <button 
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 p-1 rounded-full shadow-md text-gray-600 hover:text-blue-600 border border-gray-100"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
};

export default TrendingCategoriesStrip;
