
// ... existing imports
import { PlatformSettings, BlogPost, StaticPage, LandingContent, KYCDocument, SystemConfig, PageCategory, MediaItem, ContentBlock, BlogCategory, BlogSettings, HomepageSection, ABTest, HomepageTemplate, HomepageVersion, HomepageAnalytics, UserRole, HomepageSectionType, HeaderConfig, FooterConfig, HomeSlide, TrendingConfig, AffiliatePageContent, ActivityConfig, NavIconConfig, HelpLink, TrustContent, CategoriesContent, HowItWorksContent, FeaturedContent, CTAContent } from '../types';
import { MOCK_KYC_DOCS } from '../constants';
import { FileService } from './files'; // Import FileService

// ... existing MOCK CONSTANTS DEFINITION ...
const DEFAULT_LOGO = 'https://ui-avatars.com/api/?name=G&background=0D8ABC&color=fff&size=128';
const DEFAULT_FAVICON = 'https://ui-avatars.com/api/?name=G&background=0D8ABC&color=fff&size=32';

// --- INITIALIZE MISSING VARIABLES ---
// ... (Keep existing variable initializations: CURRENT_SETTINGS, CURRENT_HEADER, etc.)
let CURRENT_SETTINGS: PlatformSettings = {
    siteName: 'Geezle',
    tagline: 'The Freelance Marketplace',
    logoUrl: '',
    faviconUrl: '',
    adminEmail: 'admin@geezle.com',
    supportEmail: 'support@geezle.com',
    footerAboutTitle: 'About Geezle',
    footerAboutText: 'Connecting talent with opportunity.',
    footerCopyright: '© 2024 Geezle Inc.',
    footerLinks: [],
    socialLinks: [],
    system: {
        maintenanceMode: false,
        registrationsEnabled: true,
        kycEnforced: false,
        admin2FA: false
    }
};

let CURRENT_HEADER: HeaderConfig = {
    id: 'header-1',
    homeUrl: '/',
    variant: 'light',
    searchEnabled: true,
    searchMode: 'semantic',
    logoUrl: '',
    faviconUrl: '',
    navigation: [
        { id: 'nav-1', label: 'Find Talent', url: '/browse', visibility: [UserRole.GUEST, UserRole.EMPLOYER] },
        { id: 'nav-2', label: 'Find Work', url: '/browse-jobs', visibility: [UserRole.GUEST, UserRole.FREELANCER] },
        { id: 'nav-3', label: 'Community', url: '/community', visibility: [UserRole.GUEST, UserRole.FREELANCER, UserRole.EMPLOYER] },
    ],
    actions: { notifications: true, messages: true, orders: true, lists: true, switchSelling: true, profile: true },
    profileMenu: [
        { id: 'pm-1', label: 'Dashboard', url: '/dashboard', visibility: [UserRole.FREELANCER, UserRole.EMPLOYER] },
        { id: 'pm-2', label: 'Profile', url: '/profile', visibility: [UserRole.FREELANCER] },
        { id: 'pm-3', label: 'Settings', url: '/settings', visibility: [UserRole.FREELANCER, UserRole.EMPLOYER] }
    ]
};

let CURRENT_TRENDING: TrendingConfig = {
    enabled: true,
    title: 'Trending Now',
    categoryIds: [],
    scrollBehavior: 'manual',
    autoSlideInterval: 5000,
    visibility: [UserRole.GUEST, UserRole.FREELANCER, UserRole.EMPLOYER]
};

let CURRENT_FOOTER: FooterConfig = {
    id: 'footer-1',
    description: 'The world\'s work marketplace.',
    copyright: '© 2024 Geezle Inc.',
    columns: [
        { id: 'fc-1', title: 'For Clients', links: [{ id: 'l1', label: 'How to Hire', url: '/p/how-to-hire', visibility: [UserRole.GUEST], type: 'internal' }] },
        { id: 'fc-2', title: 'For Talent', links: [{ id: 'l2', label: 'How to Find Work', url: '/p/how-to-work', visibility: [UserRole.GUEST], type: 'internal' }] }
    ],
    contact: { adminEmail: 'admin@geezle.com', supportEmail: 'help@geezle.com', ticketRoute: '/support' },
    socials: [
        { id: 'soc-1', platform: 'Twitter', url: 'https://twitter.com', enabled: true },
        { id: 'soc-2', platform: 'LinkedIn', url: 'https://linkedin.com', enabled: true }
    ]
};

let CURRENT_SLIDES: HomeSlide[] = [
    {
        id: 'slide-1',
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80',
        title: 'Find the perfect professional for you',
        subtitle: 'Get work done with confidence',
        redirectUrl: '/browse',
        roleVisibility: [UserRole.GUEST, UserRole.EMPLOYER],
        sortOrder: 1,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

const DEFAULT_LANDING_CONTENT: LandingContent = {
    hero: {
        headline: 'Find the perfect freelance services for your business',
        subheadline: 'Work with talented people at the most affordable price to get the most out of your time and cost',
        primaryCtaText: 'Find Talent',
        primaryCtaLink: '/browse',
        secondaryCtaText: 'Find Work',
        secondaryCtaLink: '/browse-jobs',
        backgroundImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1920&q=80',
        showTrustBadges: true
    },
    stats: [
        { value: '1M+', label: 'Total Freelancers' },
        { value: '98%', label: 'Positive Reviews' },
        { value: '24H', label: 'Average Turnaround' }
    ],
    howItWorks: {
        showVideo: false,
        employerSteps: [
            { icon: 'Search', title: 'Find Talent', description: 'Post a job or search for freelancers' },
            { icon: 'CheckCircle', title: 'Hire', description: 'Choose the best person for the job' },
            { icon: 'DollarSign', title: 'Pay', description: 'Pay safely through our platform' }
        ],
        freelancerSteps: [
            { icon: 'UserPlus', title: 'Create Profile', description: 'Showcase your skills' },
            { icon: 'Briefcase', title: 'Find Work', description: 'Apply to jobs that match your skills' },
            { icon: 'DollarSign', title: 'Get Paid', description: 'Receive payment securely' }
        ]
    },
    whyChoose: {},
    testimonials: [],
    cta: {
        headline: 'Ready to get started?',
        subheadline: 'Join thousands of satisfied customers.',
        buttonText: 'Join Now',
        buttonLink: '/auth/signup'
    }
};

const INITIAL_HOMEPAGE_SECTIONS: HomepageSection[] = [
    { id: 'sec-1', type: 'hero', name: 'Hero Banner', isActive: true, position: 0, content: DEFAULT_LANDING_CONTENT.hero },
    { id: 'sec-2', type: 'trust', name: 'Trust Stats', isActive: true, position: 1, content: { stats: DEFAULT_LANDING_CONTENT.stats } },
    { id: 'sec-3', type: 'categories', name: 'Popular Categories', isActive: true, position: 2, content: { showIcons: true, viewMoreLink: '/browse' } },
    { id: 'sec-4', type: 'featured', name: 'Featured Gigs', isActive: true, position: 3, content: { source: 'gigs', count: 4, layout: 'grid', autoRotate: false } },
    { id: 'sec-5', type: 'cta', name: 'Bottom CTA', isActive: true, position: 4, content: DEFAULT_LANDING_CONTENT.cta }
];

let homepageSections: HomepageSection[] = [...INITIAL_HOMEPAGE_SECTIONS];
let abTests: ABTest[] = [];
let homepageTemplates: HomepageTemplate[] = [];
let homepageAnalytics: HomepageAnalytics = {
    views: 12500,
    ctaClicks: 3200,
    bounceRate: 45,
    avgTimeOnPage: 120,
    deviceBreakdown: { desktop: 60, mobile: 35, tablet: 5 },
    sectionEngagement: []
};
let homepageHistory: HomepageVersion[] = [];

let MOCK_BLOG_POSTS: BlogPost[] = [
    {
        id: 'post-1',
        title: 'How to hire the best freelancers',
        slug: 'how-to-hire-freelancers',
        content: '<p>Hiring freelancers can be tricky...</p>',
        blocks: [],
        excerpt: 'Tips for finding the right talent.',
        shortDescription: 'Tips for finding the right talent.',
        featuredImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
        status: 'published',
        visibility: 'public',
        authorName: 'Admin',
        categoryId: 'cat-1',
        categoryName: 'Hiring',
        tags: ['hiring', 'tips'],
        views: 120,
        seo: { metaTitle: 'How to Hire', metaDescription: 'Guide to hiring.' },
        allowComments: true,
        isFeatured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];

let MOCK_BLOG_CATEGORIES: BlogCategory[] = [
    { id: 'cat-1', name: 'Hiring', slug: 'hiring', description: 'Tips for employers', status: 'active', count: 1 }
];

let BLOG_SETTINGS: BlogSettings = {
    pageTitle: 'Geezle Blog',
    metaTitle: 'Geezle Blog - Insights',
    metaDescription: 'Latest news and tips.',
    bannerImage: '',
    postsPerPage: 10,
    defaultCategory: 'cat-1',
    showAuthor: true,
    showDate: true
};

let MOCK_PAGES: Record<string, StaticPage> = {
    'about-us': {
        id: 'p-1',
        title: 'About Us',
        slug: 'about-us',
        content: '<p>We are Geezle.</p>',
        blocks: [],
        status: 'PUBLISHED',
        visibility: 'public',
        updatedAt: new Date().toISOString(),
        categoryId: 'pc-1'
    }
};

let MOCK_PAGE_CATEGORIES: PageCategory[] = [
    { id: 'pc-1', name: 'Company', slug: 'company', count: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), status: 'active' }
];

let MOCK_MEDIA: MediaItem[] = [];

let kycDocs: KYCDocument[] = [...MOCK_KYC_DOCS];

let CURRENT_AFFILIATE_CONTENT: AffiliatePageContent = {
    heroTitle: 'Earn Money by Promoting Geezle',
    heroSubtitle: 'Join our affiliate program and earn commission on every sale.',
    heroButtonText: 'Become an Affiliate',
    benefits: [
        { title: 'High Commission', description: 'Earn up to 20% commission.', icon: 'dollar' },
        { title: 'Fast Payouts', description: 'Get paid monthly.', icon: 'trending' },
        { title: 'Marketing Tools', description: 'Access banners and links.', icon: 'users' }
    ]
};

// ... serializeBlocksToHtml helper ...
const serializeBlocksToHtml = (blocks: ContentBlock[]): string => {
    return blocks.map(b => {
        switch(b.type) {
            case 'heading': return `<h2>${b.content}</h2>`;
            case 'image': return `<img src="${b.content}" alt="Image" />`;
            default: return `<p>${b.content}</p>`;
        }
    }).join('');
};

// --- NAVIGATION & ACTIVITY DEFAULTS ---
const DEFAULT_ACTIVITY_CONFIG: ActivityConfig = {
    icons: [
        { id: 'nav-notif', type: 'notifications', label: 'Notifications', isEnabled: true, showLabel: false, sortOrder: 1, roles: [UserRole.FREELANCER, UserRole.EMPLOYER, UserRole.ADMIN] },
        { id: 'nav-msg', type: 'messages', label: 'Messages', isEnabled: true, showLabel: false, sortOrder: 2, roles: [UserRole.FREELANCER, UserRole.EMPLOYER, UserRole.ADMIN] },
        { id: 'nav-fav', type: 'favorites', label: 'Favorites', isEnabled: true, showLabel: false, sortOrder: 3, roles: [UserRole.FREELANCER, UserRole.EMPLOYER] },
        { id: 'nav-help', type: 'help', label: 'Help', isEnabled: true, showLabel: false, sortOrder: 4, roles: [UserRole.FREELANCER, UserRole.EMPLOYER, UserRole.GUEST] },
    ],
    helpMenu: [
        { id: 'help-1', label: 'Help Center', url: '/support', target: '_self', isEnabled: true },
        { id: 'help-2', label: 'Community Forum', url: '/community/forum', target: '_self', isEnabled: true },
        { id: 'help-3', label: 'Blog', url: '/blog', target: '_self', isEnabled: true },
        { id: 'help-4', label: 'Contact Support', url: '/support?tab=create', target: '_self', isEnabled: true },
    ],
    design: {
        iconStyle: 'outline',
        iconSize: 20,
        badgeColor: '#EF4444',
        showBadges: true
    }
};

let CURRENT_ACTIVITY_CONFIG: ActivityConfig = { ...DEFAULT_ACTIVITY_CONFIG };

export const CMSService = {
  // --- Navigation & Activity Config ---
  getActivityConfig: async (): Promise<ActivityConfig> => {
      return new Promise(resolve => {
          setTimeout(() => {
            const stored = localStorage.getItem('geezle_activity_config');
            if (stored) {
                resolve(JSON.parse(stored));
            } else {
                resolve({ ...CURRENT_ACTIVITY_CONFIG });
            }
          }, 100);
      });
  },

  saveActivityConfig: async (config: ActivityConfig): Promise<ActivityConfig> => {
      return new Promise(resolve => {
          CURRENT_ACTIVITY_CONFIG = config;
          localStorage.setItem('geezle_activity_config', JSON.stringify(config));
          resolve(config);
      });
  },

  // ... (rest of the existing methods below remain unchanged)
  // ... existing export methods wrapper
  getSettings: async (): Promise<PlatformSettings> => {
    return new Promise((resolve) => setTimeout(() => resolve({ ...CURRENT_SETTINGS }), 50));
  },
  updateSettings: async (settings: Partial<PlatformSettings>): Promise<PlatformSettings> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if(settings.system) {
                CURRENT_SETTINGS.system = { ...CURRENT_SETTINGS.system, ...settings.system };
                delete settings.system; 
            }
            CURRENT_SETTINGS = { ...CURRENT_SETTINGS, ...settings };
            localStorage.setItem('geezle_settings', JSON.stringify(CURRENT_SETTINGS));
            resolve(CURRENT_SETTINGS);
        }, 300);
    });
  },
  getHeaderConfig: async (): Promise<HeaderConfig> => {
      return new Promise(resolve => setTimeout(() => resolve({ ...CURRENT_HEADER }), 50));
  },
  saveHeaderConfig: async (config: HeaderConfig): Promise<HeaderConfig> => {
      return new Promise(resolve => {
          CURRENT_HEADER = config;
          localStorage.setItem('geezle_header_config', JSON.stringify(config));
          resolve(config);
      });
  },
  getTrendingConfig: async (): Promise<TrendingConfig> => {
      return new Promise(resolve => setTimeout(() => resolve({ ...CURRENT_TRENDING }), 50));
  },
  saveTrendingConfig: async (config: TrendingConfig): Promise<TrendingConfig> => {
      return new Promise(resolve => {
          CURRENT_TRENDING = config;
          localStorage.setItem('geezle_trending_config', JSON.stringify(config));
          resolve(config);
      });
  },
  getFooterConfig: async (): Promise<FooterConfig> => {
      return new Promise(resolve => setTimeout(() => resolve({ ...CURRENT_FOOTER }), 50));
  },
  saveFooterConfig: async (config: FooterConfig): Promise<FooterConfig> => {
      return new Promise(resolve => {
          CURRENT_FOOTER = config;
          localStorage.setItem('geezle_footer_config', JSON.stringify(config));
          resolve(config);
      });
  },
  getHomeSlides: async (): Promise<HomeSlide[]> => {
      return new Promise(resolve => setTimeout(() => resolve([...CURRENT_SLIDES]), 200));
  },
  saveHomeSlide: async (slide: HomeSlide): Promise<HomeSlide> => {
      return new Promise(resolve => {
          const idx = CURRENT_SLIDES.findIndex(s => s.id === slide.id);
          if (idx >= 0) CURRENT_SLIDES[idx] = slide;
          else CURRENT_SLIDES.push(slide);
          
          CURRENT_SLIDES.sort((a,b) => a.sortOrder - b.sortOrder);
          localStorage.setItem('geezle_home_slides', JSON.stringify(CURRENT_SLIDES));
          resolve(slide);
      });
  },
  deleteHomeSlide: async (id: string): Promise<void> => {
      return new Promise(resolve => {
          CURRENT_SLIDES = CURRENT_SLIDES.filter(s => s.id !== id);
          localStorage.setItem('geezle_home_slides', JSON.stringify(CURRENT_SLIDES));
          resolve();
      });
  },
  updateHomeSlideOrder: async (slides: HomeSlide[]): Promise<void> => {
      return new Promise(resolve => {
          CURRENT_SLIDES = slides;
          localStorage.setItem('geezle_home_slides', JSON.stringify(CURRENT_SLIDES));
          resolve();
      });
  },
  getLandingContent: async (): Promise<LandingContent> => {
    return new Promise((resolve) => setTimeout(() => resolve(DEFAULT_LANDING_CONTENT), 50));
  },
  getHomepageSections: async (userContext?: { role?: UserRole, location?: string }): Promise<HomepageSection[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date();
        
        let filteredSections = homepageSections.filter(section => {
          if (section.startAt && new Date(section.startAt) > now) return false;
          if (section.endAt && new Date(section.endAt) < now) return false;
          if (userContext?.role && section.targeting?.roles && section.targeting.roles.length > 0) {
             if (!section.targeting.roles.includes(userContext.role)) return false;
          }
          return true;
        });

        filteredSections = filteredSections.map(section => {
           if (section.abTestId) {
              const test = abTests.find(t => t.id === section.abTestId && t.status === 'running');
              if (test) {
                 const showVariant = Math.random() * 100 < test.trafficSplit;
                 if (showVariant && test.variants.length > 0) {
                    const variant = test.variants[Math.floor(Math.random() * test.variants.length)];
                    return { ...variant, id: section.id }; 
                 }
              }
           }
           return section;
        });

        resolve([...filteredSections].sort((a,b) => a.position - b.position));
      }, 200);
    });
  },
  saveHomepageSection: async (section: HomepageSection): Promise<HomepageSection> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const idx = homepageSections.findIndex(s => s.id === section.id);
            if(idx >= 0) {
                homepageSections[idx] = section;
            } else {
                homepageSections.push(section);
            }
            resolve(section);
        }, 300);
    });
  },
  addHomepageSection: async (type: HomepageSectionType): Promise<HomepageSection> => {
      return new Promise(resolve => {
          setTimeout(() => {
              const newSection: HomepageSection = {
                  id: `sec-${Math.random().toString(36).substr(2, 9)}`,
                  type,
                  name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
                  isActive: true,
                  position: homepageSections.length,
                  content: INITIAL_HOMEPAGE_SECTIONS.find(s => s.type === type)?.content || {}
              };
              homepageSections.push(newSection);
              resolve(newSection);
          }, 200);
      });
  },
  updateSectionOrder: async (sections: HomepageSection[]): Promise<void> => {
      return new Promise(resolve => {
          homepageSections = sections;
          resolve();
      });
  },
  deleteHomepageSection: async (id: string): Promise<void> => {
      return new Promise(resolve => {
          homepageSections = homepageSections.filter(s => s.id !== id);
          resolve();
      });
  },
  getTemplates: async (): Promise<HomepageTemplate[]> => {
      return new Promise(resolve => setTimeout(() => resolve([...homepageTemplates]), 200));
  },
  saveTemplate: async (template: HomepageTemplate): Promise<HomepageTemplate> => {
      return new Promise(resolve => {
          homepageTemplates.push(template);
          resolve(template);
      });
  },
  loadTemplate: async (templateId: string): Promise<HomepageSection | null> => {
      return new Promise(resolve => {
          const tpl = homepageTemplates.find(t => t.id === templateId);
          if (tpl) {
              const newSection: HomepageSection = {
                  id: `sec-${Math.random().toString(36).substr(2, 9)}`,
                  type: tpl.type,
                  name: `${tpl.name} (Copy)`,
                  isActive: true,
                  position: homepageSections.length,
                  content: { ...tpl.content },
                  style: { ...tpl.style }
              };
              homepageSections.push(newSection);
              resolve(newSection);
          } else {
              resolve(null);
          }
      });
  },
  getABTests: async (): Promise<ABTest[]> => {
      return new Promise(resolve => setTimeout(() => resolve([...abTests]), 200));
  },
  createABTest: async (test: Partial<ABTest>): Promise<ABTest> => {
      return new Promise(resolve => {
          const newTest: ABTest = {
              id: `ab-${Math.random().toString(36).substr(2, 9)}`,
              name: test.name || 'New A/B Test',
              sectionId: test.sectionId || '',
              variants: test.variants || [],
              trafficSplit: test.trafficSplit || 50,
              status: 'running',
              metrics: { views: 0, conversions: 0 },
              createdAt: new Date().toISOString()
          };
          abTests.push(newTest);
          resolve(newTest);
      });
  },
  saveABTest: async (test: ABTest): Promise<ABTest> => {
      return new Promise(resolve => {
          const idx = abTests.findIndex(t => t.id === test.id);
          if (idx >= 0) abTests[idx] = test;
          else abTests.push(test);
          resolve(test);
      });
  },
  getHomepageAnalytics: async (): Promise<HomepageAnalytics> => {
      return new Promise(resolve => setTimeout(() => resolve(homepageAnalytics), 200));
  },
  getHomepageHistory: async (): Promise<HomepageVersion[]> => {
      return new Promise(resolve => setTimeout(() => resolve([...homepageHistory]), 200));
  },
  createHomepageVersion: async (description: string): Promise<void> => {
      return new Promise(resolve => {
          const version: HomepageVersion = {
              id: Math.random().toString(36).substr(2, 9),
              createdAt: new Date().toISOString(),
              createdBy: 'Admin',
              snapshot: JSON.parse(JSON.stringify(homepageSections)),
              description
          };
          homepageHistory.unshift(version);
          resolve();
      });
  },
  restoreHomepageVersion: async (versionId: string): Promise<void> => {
      return new Promise(resolve => {
          const version = homepageHistory.find(v => v.id === versionId);
          if (version) {
              homepageSections = JSON.parse(JSON.stringify(version.snapshot));
          }
          resolve();
      });
  },
  getBlogPosts: async (): Promise<BlogPost[]> => {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_BLOG_POSTS]), 300));
  },
  getBlogPostBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_BLOG_POSTS.find(p => p.slug === slug)), 200));
  },
  saveBlogPost: async (post: BlogPost): Promise<BlogPost> => {
      return new Promise(resolve => {
          setTimeout(() => {
              if (post.blocks && post.blocks.length > 0) {
                  post.content = serializeBlocksToHtml(post.blocks);
              }
              const idx = MOCK_BLOG_POSTS.findIndex(p => p.id === post.id);
              post.updatedAt = new Date().toISOString();
              if(idx >= 0) MOCK_BLOG_POSTS[idx] = post;
              else MOCK_BLOG_POSTS.unshift(post);
              resolve(post);
          }, 300);
      });
  },
  deleteBlogPost: async (id: string): Promise<void> => {
      return new Promise(resolve => {
          MOCK_BLOG_POSTS = MOCK_BLOG_POSTS.filter(p => p.id !== id);
          resolve();
      });
  },
  getBlogCategories: async (): Promise<BlogCategory[]> => {
      return new Promise(resolve => setTimeout(() => resolve([...MOCK_BLOG_CATEGORIES]), 200));
  },
  saveBlogCategory: async (category: BlogCategory): Promise<BlogCategory> => {
      return new Promise(resolve => {
          const idx = MOCK_BLOG_CATEGORIES.findIndex(c => c.id === category.id);
          if (idx >= 0) MOCK_BLOG_CATEGORIES[idx] = category;
          else MOCK_BLOG_CATEGORIES.push(category);
          resolve(category);
      });
  },
  deleteBlogCategory: async (id: string): Promise<void> => {
      return new Promise(resolve => {
          MOCK_BLOG_CATEGORIES = MOCK_BLOG_CATEGORIES.filter(c => c.id !== id);
          resolve();
      });
  },
  getBlogSettings: async (): Promise<BlogSettings> => {
      return new Promise(resolve => setTimeout(() => resolve({...BLOG_SETTINGS}), 100));
  },
  updateBlogSettings: async (settings: Partial<BlogSettings>): Promise<BlogSettings> => {
      return new Promise(resolve => {
          BLOG_SETTINGS = { ...BLOG_SETTINGS, ...settings };
          resolve(BLOG_SETTINGS);
      });
  },
  getPages: async (): Promise<StaticPage[]> => {
      return new Promise(resolve => setTimeout(() => resolve(Object.values(MOCK_PAGES)), 200));
  },
  getPageBySlug: async (slug: string): Promise<StaticPage | undefined> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_PAGES[slug]), 200));
  },
  savePage: async (page: StaticPage): Promise<StaticPage> => {
      return new Promise(resolve => {
          setTimeout(() => {
              if (page.blocks && page.blocks.length > 0) {
                  page.content = serializeBlocksToHtml(page.blocks);
              }
              page.updatedAt = new Date().toISOString();
              const existingSlug = Object.keys(MOCK_PAGES).find(key => MOCK_PAGES[key].id === page.id);
              if (existingSlug && existingSlug !== page.slug) {
                  delete MOCK_PAGES[existingSlug];
              }
              if (!existingSlug && MOCK_PAGES[page.slug]) {
                  page.slug = `${page.slug}-${Math.floor(Math.random() * 1000)}`;
              }
              MOCK_PAGES[page.slug] = page;
              resolve(page);
          }, 400);
      });
  },
  deletePage: async (id: string): Promise<void> => {
      return new Promise(resolve => {
          const slug = Object.keys(MOCK_PAGES).find(key => MOCK_PAGES[key].id === id);
          if (slug) delete MOCK_PAGES[slug];
          resolve();
      });
  },
  getPageCategories: async (): Promise<PageCategory[]> => {
      return new Promise(resolve => setTimeout(() => resolve([...MOCK_PAGE_CATEGORIES]), 200));
  },
  savePageCategory: async (category: PageCategory): Promise<PageCategory> => {
      return new Promise(resolve => {
          setTimeout(() => {
              const idx = MOCK_PAGE_CATEGORIES.findIndex(c => c.id === category.id);
              if (idx >= 0) {
                  MOCK_PAGE_CATEGORIES[idx] = { ...category, updatedAt: new Date().toISOString() };
              } else {
                  MOCK_PAGE_CATEGORIES.push({ 
                      ...category, 
                      id: category.id || Math.random().toString(36).substr(2, 9),
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      count: 0
                  });
              }
              resolve(category);
          }, 200);
      });
  },
  deletePageCategory: async (id: string): Promise<void> => {
      return new Promise(resolve => {
          MOCK_PAGE_CATEGORIES = MOCK_PAGE_CATEGORIES.filter(c => c.id !== id);
          resolve();
      });
  },
  getMedia: async (): Promise<MediaItem[]> => {
      return new Promise(resolve => setTimeout(() => resolve([...MOCK_MEDIA]), 200));
  },
  
  // UPDATED: Using FileService for unified upload handling and persistence
  uploadMedia: async (file: File): Promise<MediaItem> => {
      // Use FileService to persist as base64 in local storage for demo purposes
      // instead of failing API call
      const uploaded = await FileService.uploadFile('admin', file, 'document');
      const mediaItem: MediaItem = {
          id: uploaded.id,
          name: uploaded.name,
          url: uploaded.url,
          type: uploaded.type,
          size: uploaded.size,
          createdAt: uploaded.createdAt
      };
      
      // Update local MOCK_MEDIA for getMedia calls
      MOCK_MEDIA.unshift(mediaItem);
      
      return mediaItem;
  },

  deleteMedia: async (id: string): Promise<void> => {
      return new Promise(resolve => {
          MOCK_MEDIA = MOCK_MEDIA.filter(m => m.id !== id);
          resolve();
      });
  },
  getKYCRequests: async (): Promise<KYCDocument[]> => {
      return new Promise(resolve => setTimeout(() => resolve(kycDocs), 200));
  },
  submitKYC: async (doc: KYCDocument): Promise<void> => {
      return new Promise(resolve => {
          setTimeout(() => {
              kycDocs = [doc, ...kycDocs];
              resolve();
          }, 500);
      });
  },
  updateKYCStatus: async (id: string, status: KYCDocument['status'], notes?: string): Promise<void> => {
      return new Promise(resolve => {
          setTimeout(() => {
              kycDocs = kycDocs.map(doc => doc.id === id ? { ...doc, status, adminNotes: notes } : doc);
              resolve();
          }, 300);
      });
  },
  
  getAffiliateContent: async (): Promise<AffiliatePageContent> => {
    return new Promise(resolve => {
        setTimeout(() => {
          const stored = localStorage.getItem('geezle_affiliate_content');
          if (stored) {
              resolve(JSON.parse(stored));
          } else {
              resolve({ ...CURRENT_AFFILIATE_CONTENT });
          }
        }, 100);
    });
},

saveAffiliateContent: async (content: AffiliatePageContent): Promise<AffiliatePageContent> => {
    return new Promise(resolve => {
        CURRENT_AFFILIATE_CONTENT = content;
        localStorage.setItem('geezle_affiliate_content', JSON.stringify(content));
        resolve(content);
    });
},

};
