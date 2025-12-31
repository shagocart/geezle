
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeSlide, UserRole } from '../types';
import { useUser } from '../context/UserContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HomeSliderProps {
    slides: HomeSlide[];
}

const HomeSlider: React.FC<HomeSliderProps> = ({ slides }) => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleSlides, setVisibleSlides] = useState<HomeSlide[]>([]);

    useEffect(() => {
        const role = user?.role || UserRole.GUEST;
        const filtered = slides
            .filter(s => s.isActive && s.roleVisibility.includes(role))
            .sort((a, b) => a.sortOrder - b.sortOrder);
        setVisibleSlides(filtered);
    }, [slides, user]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % visibleSlides.length);
        }, 6000); // 6s Auto-rotate
        return () => clearInterval(interval);
    }, [visibleSlides.length]);

    if (visibleSlides.length === 0) return null;

    const handleSlideClick = (slide: HomeSlide) => {
        if (slide.redirectUrl) {
            if (slide.redirectUrl.startsWith('http')) {
                window.location.href = slide.redirectUrl;
            } else {
                navigate(slide.redirectUrl);
            }
        }
    };

    const nextSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % visibleSlides.length);
    };

    const prevSlide = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + visibleSlides.length) % visibleSlides.length);
    };

    return (
        <div className="relative w-full h-[516px] overflow-hidden bg-gray-900 group">
            {visibleSlides.map((slide, index) => (
                <div 
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    onClick={() => handleSlideClick(slide)}
                    style={{ cursor: slide.redirectUrl ? 'pointer' : 'default', backgroundColor: slide.backgroundColor || '#000' }}
                >
                    {/* Media Layer */}
                    <div className="absolute inset-0 w-full h-full">
                        {slide.mediaType === 'video' ? (
                            <video 
                                src={slide.mediaUrl}
                                autoPlay 
                                muted 
                                loop 
                                playsInline 
                                className="w-full h-full object-cover object-center"
                            />
                        ) : (
                            <img 
                                src={slide.mediaUrl} 
                                alt={slide.title || 'Slide'} 
                                className="w-full h-full object-cover object-center"
                            />
                        )}
                        {/* Overlay Gradient for Text Readability */}
                        {(slide.title || slide.subtitle) && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        )}
                    </div>

                    {/* Content Layer */}
                    {(slide.title || slide.subtitle) && (
                        <div className="absolute bottom-16 left-0 right-0 px-4 sm:px-12 max-w-7xl mx-auto text-white z-20 pointer-events-none">
                            <h2 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-md animate-fade-in-up">{slide.title}</h2>
                            <p className="text-lg md:text-xl text-gray-200 max-w-2xl drop-shadow-sm animate-fade-in-up delay-100">{slide.subtitle}</p>
                        </div>
                    )}
                </div>
            ))}

            {/* Controls */}
            {visibleSlides.length > 1 && (
                <>
                    <button 
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition opacity-0 group-hover:opacity-100"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center space-x-2">
                        {visibleSlides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default HomeSlider;
