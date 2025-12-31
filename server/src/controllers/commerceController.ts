
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// --- CATEGORIES ---

export const getCategories = async (req: Request, res: Response) => {
    const { type } = req.query;
    try {
        // Fallback to mock data if DB not ready (for demo stability)
        // In production, remove the mock fallback
        let categories;
        try {
            categories = await prisma.listingCategory.findMany({
                where: type ? { type: String(type) } : undefined,
                orderBy: { sortOrder: 'asc' }
            });
        } catch (dbError) {
            console.warn("DB Access failed, using mock", dbError);
            return res.json([
                { id: '1', name: 'Development', slug: 'development', type: 'gig', status: 'active', count: 12, sortOrder: 1, subcategories: [] },
                { id: '2', name: 'Design', slug: 'design', type: 'gig', status: 'active', count: 8, sortOrder: 2, subcategories: [] }
            ]);
        }
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
};

export const saveCategory = async (req: Request, res: Response) => {
    const { id, name, slug, type, subcategories } = req.body;
    
    if (!name || !type) {
        return res.status(400).json({ error: 'Name and Type are required' });
    }

    try {
        const payload = {
            name,
            slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
            type,
            subcategories: subcategories || [],
            status: req.body.status || 'active',
            sortOrder: req.body.sortOrder || 0,
            count: 0
        };

        const category = id 
            ? await prisma.listingCategory.update({ where: { id }, data: payload })
            : await prisma.listingCategory.create({ data: payload });

        // Real-time update
        (req as any).io.emit('admin:category_update', category);
        
        res.json({ success: true, data: category });
    } catch (error) {
        console.error(error);
        // Fallback for demo without DB
        res.json({ success: true, data: { id: id || `cat-${Date.now()}`, ...req.body } });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.listingCategory.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete category' });
    }
};

// --- GIGS ---

export const getGigs = async (req: Request, res: Response) => {
    try {
        const gigs = await prisma.gig.findMany({ orderBy: { createdAt: 'desc' } });
        res.json(gigs);
    } catch (error) {
        // Fallback Mock
        res.json([
             { id: 'g1', title: 'React Development', price: 500, category: 'Development', status: 'active' }
        ]);
    }
};

export const saveGig = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const gig = data.id
            ? await prisma.gig.update({ where: { id: data.id }, data })
            : await prisma.gig.create({ data });
            
        (req as any).io.emit('admin:gig_update', gig);
        res.json({ success: true, data: gig });
    } catch (error) {
        res.json({ success: true, data: { ...data, id: data.id || `gig-${Date.now()}` } });
    }
};

export const deleteGig = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.gig.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete' });
    }
};

// --- JOBS ---

export const getJobs = async (req: Request, res: Response) => {
    try {
        const jobs = await prisma.job.findMany({ orderBy: { postedTime: 'desc' } });
        res.json(jobs);
    } catch (error) {
         res.json([]);
    }
};

export const saveJob = async (req: Request, res: Response) => {
    const data = req.body;
    try {
        const job = data.id
            ? await prisma.job.update({ where: { id: data.id }, data })
            : await prisma.job.create({ data });
            
        (req as any).io.emit('admin:job_update', job);
        res.json({ success: true, data: job });
    } catch (error) {
         res.json({ success: true, data: { ...data, id: data.id || `job-${Date.now()}` } });
    }
};

export const deleteJob = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.job.delete({ where: { id } });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete' });
    }
};
