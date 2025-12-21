
import { Gig, Job, Transaction, Dispute, KYCDocument, Currency, Conversation, Order } from './types';

export const INITIAL_CURRENCIES: Currency[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1, isActive: true },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92, isActive: true },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79, isActive: true },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', rate: 56.50, isActive: true },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', rate: 1550.00, isActive: true },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', rate: 1.35, isActive: true },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.50, isActive: true },
];

export const MOCK_GIGS: Gig[] = [
  {
    id: '1',
    title: 'I will design a modern minimalist logo for your brand',
    freelancerName: 'Sarah Jenkins',
    freelancerAvatar: 'https://picsum.photos/seed/sarah/50/50',
    price: 45,
    rating: 4.9,
    reviews: 120,
    image: 'https://picsum.photos/seed/logo/400/300',
    category: 'Design'
  },
  {
    id: '2',
    title: 'I will build a responsive React website with Tailwind',
    freelancerName: 'Dev Mike',
    freelancerAvatar: 'https://picsum.photos/seed/mike/50/50',
    price: 350,
    rating: 5.0,
    reviews: 45,
    image: 'https://picsum.photos/seed/code/400/300',
    category: 'Development'
  },
  {
    id: '3',
    title: 'I will write high-converting SEO blog posts',
    freelancerName: 'Emily Write',
    freelancerAvatar: 'https://picsum.photos/seed/emily/50/50',
    price: 80,
    rating: 4.8,
    reviews: 300,
    image: 'https://picsum.photos/seed/write/400/300',
    category: 'Writing'
  },
  {
    id: '4',
    title: 'I will create engaging social media video ads',
    freelancerName: 'Video Pro',
    freelancerAvatar: 'https://picsum.photos/seed/video/50/50',
    price: 120,
    rating: 4.7,
    reviews: 89,
    image: 'https://picsum.photos/seed/editing/400/300',
    category: 'Video'
  },
  {
    id: '5',
    title: 'I will develop a custom AI chatbot for your business',
    freelancerName: 'AI Wizard',
    freelancerAvatar: 'https://picsum.photos/seed/ai/50/50',
    price: 500,
    rating: 5.0,
    reviews: 12,
    image: 'https://picsum.photos/seed/robot/400/300',
    category: 'AI Services'
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: '101',
    title: 'Full Stack Developer needed for E-commerce Platform',
    clientName: 'TechCorp Inc.',
    budget: '$2000 - $4000',
    type: 'Fixed Price',
    postedTime: '2 hours ago',
    description: 'We are looking for an experienced developer to build a multi-vendor marketplace using Next.js and Node.js. Must have experience with Stripe integration.',
    tags: ['React', 'Node.js', 'PostgreSQL'],
    proposals: 5,
    status: 'Open'
  },
  {
    id: '102',
    title: 'Graphic Designer for Monthly Social Media Content',
    clientName: 'Creative Studio',
    budget: '$25/hr',
    type: 'Hourly',
    postedTime: '5 hours ago',
    description: 'Need a creative designer to handle our instagram and linkedin post designs. Approx 10 hours per week.',
    tags: ['Canva', 'Photoshop', 'Social Media'],
    proposals: 12,
    status: 'Open'
  },
  {
    id: '103',
    title: 'SEO Expert to Audit Website',
    clientName: 'Growth Hackers',
    budget: '$500',
    type: 'Fixed Price',
    postedTime: '1 day ago',
    description: 'Complete technical SEO audit required for a SaaS website. Deliverable is a PDF report with action items.',
    tags: ['SEO', 'Auditing', 'Google Analytics'],
    proposals: 3,
    status: 'Open'
  },
  {
    id: '104',
    title: 'Video Editor for YouTube Channel',
    clientName: 'Vlog Star',
    budget: '$100/video',
    type: 'Fixed Price',
    postedTime: '3 days ago',
    description: 'Looking for a fast editor who can do cuts, transitions and captions in Premiere Pro.',
    tags: ['Premiere Pro', 'YouTube', 'Editing'],
    proposals: 25,
    status: 'In Progress'
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-8851',
    gigTitle: 'I will design a modern minimalist logo',
    clientId: 'client-1',
    clientName: 'John Client',
    freelancerId: 'free-1',
    freelancerName: 'Sarah Jenkins',
    amount: 150,
    status: 'Active',
    dateOrdered: '2023-10-25',
    dueDate: '2023-10-30'
  },
  {
    id: 'ORD-8852',
    gigTitle: 'I will build a responsive React website',
    clientId: 'client-1',
    clientName: 'John Client',
    freelancerId: 'free-1',
    freelancerName: 'Dev Mike',
    amount: 1200,
    status: 'Delivered',
    dateOrdered: '2023-10-15',
    dueDate: '2023-10-28'
  },
  {
    id: 'ORD-8853',
    gigTitle: 'SEO Audit',
    clientId: 'client-2',
    clientName: 'StartUp Inc',
    freelancerId: 'free-1',
    freelancerName: 'Sarah Jenkins',
    amount: 300,
    status: 'Completed',
    dateOrdered: '2023-10-01',
    dueDate: '2023-10-05'
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TXN-8821', date: '2023-10-25', user: 'TechCorp Inc.', amount: 2500, type: 'Escrow Funding', status: 'Completed' },
  { id: 'TXN-8822', date: '2023-10-26', user: 'Sarah Jenkins', amount: 450, type: 'Withdrawal', status: 'Pending' },
  { id: 'TXN-8823', date: '2023-10-26', user: 'Creative Studio', amount: 125, type: 'Payment Release', status: 'Completed' },
  { id: 'TXN-8824', date: '2023-10-27', user: 'Dev Mike', amount: 1200, type: 'Withdrawal', status: 'Pending' },
  { id: 'TXN-8825', date: '2023-10-28', user: 'Growth Hackers', amount: 500, type: 'Escrow Funding', status: 'Failed' },
];

export const MOCK_DISPUTES: Dispute[] = [
  { id: '1', ticketId: '#DSP-9001', orderId: 'ORD-221', claimant: 'TechCorp Inc.', respondent: 'Dev Mike', reason: 'Delivered work does not match requirements', amount: 2000, status: 'Open', date: '2023-10-27' },
  { id: '2', ticketId: '#DSP-9002', orderId: 'ORD-225', claimant: 'Sarah Jenkins', respondent: 'Small Biz LLC', reason: 'Client unresponsive for payment release', amount: 150, status: 'Escalated', date: '2023-10-25' },
  { id: '3', ticketId: '#DSP-8999', orderId: 'ORD-102', claimant: 'Video Pro', respondent: 'Streamer X', reason: 'Project scope creep without extra pay', amount: 300, status: 'Resolved', date: '2023-10-20' },
];

export const MOCK_KYC_DOCS: KYCDocument[] = [
  { 
    id: 'KYC-101', 
    userId: 'user-22', 
    userName: 'New Freelancer A', 
    fullName: 'Alex Johnson',
    address: '123 Baker Street, London',
    dob: '1990-05-12',
    nationality: 'British',
    mobile: '+44 7911 123456',
    type: 'Passport', 
    status: 'Pending', 
    dateSubmitted: '2023-10-28', 
    frontImage: 'https://via.placeholder.com/300x200?text=Passport+Front' 
  },
  { 
    id: 'KYC-102', 
    userId: 'user-45', 
    userName: 'John Doe', 
    fullName: 'John Doe',
    address: '456 Tech Ave, San Francisco, CA',
    dob: '1985-08-22',
    nationality: 'American',
    mobile: '+1 555 0123',
    type: 'Driver License', 
    status: 'Rejected', 
    dateSubmitted: '2023-10-28', 
    frontImage: 'https://via.placeholder.com/300x200?text=License+Front',
    adminNotes: 'Image is blurry. Please re-upload a clearer picture.'
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    participants: [
      { id: 'u1', name: 'John Client', avatar: 'https://picsum.photos/seed/client/50/50', isOnline: true, role: 'Employer' },
      { id: 'me', name: 'Me', avatar: 'https://picsum.photos/seed/freelancer/50/50', isOnline: true, role: 'Freelancer' },
    ],
    lastMessage: 'Hi, I need a revision on the logo.',
    unreadCount: 2,
    messages: [
      { id: 'm1', senderId: 'u1', receiverId: 'me', text: 'Hi, thanks for the draft!', timestamp: '10:00 AM', isRead: true },
      { id: 'm2', senderId: 'me', receiverId: 'u1', text: 'Glad you liked it! Any changes?', timestamp: '10:05 AM', isRead: true },
      { id: 'm3', senderId: 'u1', receiverId: 'me', text: 'Hi, I need a revision on the logo.', timestamp: '10:30 AM', isRead: false },
    ]
  },
  {
    id: 'c2',
    participants: [
       { id: 'u2', name: 'TechStart LLC', avatar: 'https://picsum.photos/seed/tech/50/50', isOnline: false, role: 'Employer' },
       { id: 'me', name: 'Me', avatar: 'https://picsum.photos/seed/freelancer/50/50', isOnline: true, role: 'Freelancer' }
    ],
    lastMessage: 'Offer accepted. When can you start?',
    unreadCount: 0,
    messages: [
      { id: 'm1', senderId: 'me', receiverId: 'u2', text: 'I can start next Monday.', timestamp: 'Yesterday', isRead: true },
      { id: 'm2', senderId: 'u2', receiverId: 'me', text: 'Offer accepted. When can you start?', timestamp: 'Yesterday', isRead: true },
    ]
  }
];

export const CATEGORIES = [
  { name: 'Development', icon: 'Code' },
  { name: 'Design', icon: 'Palette' },
  { name: 'Marketing', icon: 'Megaphone' },
  { name: 'Writing', icon: 'PenTool' },
  { name: 'Video', icon: 'Video' },
  { name: 'AI Services', icon: 'Bot' },
];
