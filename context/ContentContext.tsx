
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SiteContent } from '../types';

const INITIAL_CONTENT: SiteContent = {
  landing: {
    hero: {
      title: "Hire Top Talent or Find Quality Work — Securely.",
      subtitle: "AtMyWorks connects verified freelancers and trusted employers with secure escrow payments, full admin oversight, and zero off-platform risk.",
      primaryCtaText: "Post a Job",
      secondaryCtaText: "Find Work",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80",
      showTrustBadges: true
    },
    stats: [
      { label: "Total Freelancers", value: "12k+" },
      { label: "Jobs Completed", value: "85k+" },
      { label: "Escrow Secured", value: "$5M+" },
      { label: "Satisfaction", value: "4.9/5" }
    ],
    howItWorks: {
      enabled: true,
      employerSteps: [
        { title: "Post a Job", description: "Create a detailed job post in minutes.", icon: "FileText" },
        { title: "Hire Verified Talent", description: "Review proposals and hire the best match.", icon: "UserCheck" },
        { title: "Secure Payment", description: "Fund escrow. Money is safe until work is done.", icon: "ShieldCheck" },
        { title: "Approve & Release", description: "Review work and release payment instantly.", icon: "CheckCircle" }
      ],
      freelancerSteps: [
        { title: "Create Profile", description: "Showcase your skills and pass KYC verification.", icon: "User" },
        { title: "Apply for Jobs", description: "Find work that matches your expertise.", icon: "Search" },
        { title: "Deliver Work", description: "Complete the task and submit for review.", icon: "Upload" },
        { title: "Get Paid", description: "Funds are released to your wallet immediately.", icon: "DollarSign" }
      ]
    },
    whyChoose: {
      enabled: true,
      title: "Why AtMyWorks is different",
      features: [
        { title: "Escrow Protection", description: "We hold funds safely until the job is done right.", icon: "Lock" },
        { title: "Admin Verified", description: "Every freelancer undergoes ID verification.", icon: "BadgeCheck" },
        { title: "Dispute Resolution", description: "Fair, admin-mediated dispute handling.", icon: "Scale" }
      ]
    },
    testimonials: [
      { id: '1', name: "Alex Chen", role: "CEO, TechStart", quote: "The escrow system gives me total peace of mind. I only pay when I'm happy.", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
      { id: '2', name: "Sarah Miller", role: "Freelance Designer", quote: "AtMyWorks verified my profile quickly. I feel safe knowing clients are vetted.", avatar: "https://randomuser.me/api/portraits/women/44.jpg" }
    ],
    cta: {
      title: "Ready to work smarter and safer?",
      subtitle: "Join the next generation of freelancing today."
    }
  },
  branding: {
    logoText: "AtMyWorks",
    primaryColor: "indigo",
    // Use a placeholder logo or leave empty to fallback to text
    // logoUrl: "https://via.placeholder.com/150x40?text=AtMyWorks" 
  },
  search: {
    aiEnabled: true,
    popularKeywords: ["Logo Design", "React Developer", "SEO Writing", "Video Editing", "Python Script"],
    trendingRefreshInterval: 60
  },
  footer: {
    aboutText: "The secure, enterprise-grade freelancing platform. Connect, collaborate, and grow with confidence."
  }
};

interface ContentContextType {
  content: SiteContent;
  updateContent: (section: string, data: any) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [content, setContent] = useState<SiteContent>(INITIAL_CONTENT);

  const updateContent = (sectionPath: string, data: any) => {
    // Helper to update nested state based on string path like 'landing.hero'
    setContent(prev => {
      const newState = { ...prev };
      const keys = sectionPath.split('.');
      let current: any = newState;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = {
        ...current[keys[keys.length - 1]],
        ...data
      };
      
      return newState;
    });
  };

  return (
    <ContentContext.Provider value={{ content, updateContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
