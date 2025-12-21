
export enum UserRole {
  ADMIN = 'admin',
  EMPLOYER = 'employer',
  FREELANCER = 'freelancer',
  GUEST = 'guest'
}

export interface PortfolioItem {
  id: string;
  title: string;
  image: string;
  description?: string;
  isVisible: boolean; // controls publish/unpublish status
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  country: string;
  startDate: string;
  endDate: string; // "Present" or date string
  description: string;
}

export interface Education {
  id: string;
  country: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  url?: string;
  isVerified: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  kycStatus?: 'pending' | 'approved' | 'rejected' | 'none' | 'resubmission_required';
  balance?: number;
  escrowBalance?: number;
  location?: string;
  joinDate?: string;
  // Profile specific fields
  title?: string;
  bio?: string;
  skills?: string[];
  rating?: number;
  reviewsCount?: number;
  portfolio?: PortfolioItem[];
  // Enhanced Profile Fields
  introVideo?: string; // URL to video
  availability?: 'Available' | 'Unavailable';
  workExperience?: WorkExperience[];
  education?: Education[];
  certifications?: Certification[];
}

export interface Category {
  id: string;
  name: string;
  icon: string; // lucide icon name string
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Exchange rate relative to USD (USD = 1)
  isActive: boolean;
}

export interface CommissionConfig {
  type: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
}

export interface CommissionSettings {
  buyer: CommissionConfig;
  seller: CommissionConfig;
}

export interface PaymentGateway {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
  description: string;
  config: {
    publicKey: string;
    secretKey: string;
    isSandbox: boolean;
  };
}

// --- CMS Types ---

export interface HeroSection {
  title: string;
  subtitle: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  image: string;
  showTrustBadges: boolean;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface HowItWorksStep {
  title: string;
  description: string;
  icon: string; // Icon name
}

export interface HowItWorksSection {
  enabled: boolean;
  employerSteps: HowItWorksStep[];
  freelancerSteps: HowItWorksStep[];
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: string;
}

export interface WhyChooseSection {
  enabled: boolean;
  title: string;
  features: FeatureItem[];
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface SearchSettings {
  aiEnabled: boolean;
  popularKeywords: string[];
  trendingRefreshInterval: number; // in minutes
}

export interface SiteContent {
  landing: {
    hero: HeroSection;
    stats: StatItem[];
    howItWorks: HowItWorksSection;
    whyChoose: WhyChooseSection;
    testimonials: TestimonialItem[];
    cta: {
      title: string;
      subtitle: string;
    };
  };
  branding: {
    logoText: string;
    primaryColor: string;
    logoUrl?: string;
  };
  search: SearchSettings;
  footer: {
    aboutText: string;
  };
}

// --- End CMS Types ---

export interface Notification {
  id: string;
  type: 'message' | 'alert' | 'success' | 'info';
  title: string;
  message: string;
  isRead: boolean;
  timestamp: string;
  link?: string;
}

export interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  fromEmail: string;
  fromName: string;
  encryption: 'ssl' | 'tls' | 'none';
}

export interface Gig {
  id: string;
  title: string;
  freelancerId?: string; // Link to user
  freelancerName: string;
  freelancerAvatar: string;
  price: number;
  rating: number;
  reviews: number;
  image: string; // Main thumbnail
  gallery?: string[]; // Up to 6 photos
  video?: string; // 1 video
  category: string;
  deliveryTime?: string; // e.g. "3 Days"
  tags?: string[]; // Search tags
  status?: 'active' | 'paused' | 'suspended'; // Admin control status
}

export interface Job {
  id: string;
  title: string;
  clientName: string;
  budget: string;
  type: 'Fixed Price' | 'Hourly';
  postedTime: string;
  description: string;
  tags: string[];
  proposals?: number;
  status?: 'Open' | 'In Progress' | 'Completed' | 'Suspended';
  images?: string[]; // Optional job images
}

export interface Order {
  id: string;
  gigTitle: string;
  clientId: string;
  clientName: string;
  freelancerId: string;
  freelancerName: string;
  amount: number;
  status: 'Active' | 'Delivered' | 'Completed' | 'Cancelled' | 'Disputed';
  dateOrdered: string;
  dueDate: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'document';
  size: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  attachments?: Attachment[];
}

export interface ChatParticipant {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  isOnline?: boolean;
}

export interface Conversation {
  id: string;
  participants: ChatParticipant[];
  lastMessage: string;
  unreadCount: number;
  messages: Message[];
}

export interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Transaction {
  id: string;
  date: string;
  user: string;
  amount: number;
  type: 'Escrow Funding' | 'Payment Release' | 'Withdrawal';
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface Dispute {
  id: string;
  ticketId: string;
  orderId: string;
  claimant: string;
  respondent: string;
  reason: string;
  amount: number;
  status: 'Open' | 'Resolved' | 'Escalated';
  date: string;
}

export interface KYCDocument {
  id: string;
  userId: string;
  userName: string;
  type: 'Passport' | 'ID Card' | 'Driver License';
  status: 'Pending' | 'Approved' | 'Rejected' | 'Resubmission Required';
  dateSubmitted: string;
  frontImage: string;
  
  // New KYC Fields
  fullName?: string;
  address?: string;
  mobile?: string;
  dob?: string;
  nationality?: string;
  adminNotes?: string;
}
