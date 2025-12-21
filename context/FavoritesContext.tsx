import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface FavoritesContextType {
  savedGigs: string[]; // List of Gig IDs
  savedJobs: string[]; // List of Job IDs
  toggleLikeGig: (id: string) => void;
  toggleLikeJob: (id: string) => void;
  isGigLiked: (id: string) => boolean;
  isJobLiked: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [savedGigs, setSavedGigs] = useState<string[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  // Initialize with some mock data or load from local storage
  useEffect(() => {
    const storedGigs = localStorage.getItem('savedGigs');
    const storedJobs = localStorage.getItem('savedJobs');
    if (storedGigs) setSavedGigs(JSON.parse(storedGigs));
    if (storedJobs) setSavedJobs(JSON.parse(storedJobs));
  }, []);

  useEffect(() => {
    localStorage.setItem('savedGigs', JSON.stringify(savedGigs));
  }, [savedGigs]);

  useEffect(() => {
    localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
  }, [savedJobs]);

  const toggleLikeGig = (id: string) => {
    setSavedGigs(prev => 
      prev.includes(id) ? prev.filter(gigId => gigId !== id) : [...prev, id]
    );
  };

  const toggleLikeJob = (id: string) => {
    setSavedJobs(prev => 
      prev.includes(id) ? prev.filter(jobId => jobId !== id) : [...prev, id]
    );
  };

  const isGigLiked = (id: string) => savedGigs.includes(id);
  const isJobLiked = (id: string) => savedJobs.includes(id);

  return (
    <FavoritesContext.Provider value={{ 
      savedGigs, 
      savedJobs, 
      toggleLikeGig, 
      toggleLikeJob, 
      isGigLiked, 
      isJobLiked 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};