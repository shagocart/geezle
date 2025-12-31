
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateSystemSettings = async (req: Request, res: Response) => {
  const settings = req.body;
  
  try {
    // Upsert Global Settings
    const updated = await prisma.systemSettings.upsert({
      where: { id: 'global' },
      update: { ...settings },
      create: { id: 'global', ...settings }
    });

    // ⚡️ REAL-TIME TRIGGER
    // Notify all connected clients that settings changed
    const io = (req as any).io;
    io.emit('settings:updated', updated);

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  const { userId, status } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { status }
    });

    // ⚡️ REAL-TIME TRIGGER
    // Notify Admin Dashboard List
    const io = (req as any).io;
    io.emit('admin:user_updated', user);
    
    // Notify Specific User (e.g., force logout if suspended)
    io.to(`user_${userId}`).emit('account:status_change', { status });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};
