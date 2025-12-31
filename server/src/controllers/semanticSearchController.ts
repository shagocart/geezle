
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import { cosineSimilarity } from '../utils/cosineSimilarity';

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generate embedding for a query
export const generateEmbedding = async (text: string) => {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-large',
    input: text,
  });
  return response.data[0].embedding;
};

// Save search query and generate embedding
export const saveSearchQuery = async (req: Request, res: Response) => {
  const { userId, query } = req.body;
  try {
    const embedding = await generateEmbedding(query);

    await prisma.searchHistory.create({
      data: { userId, query },
    });

    await prisma.userEmbedding.create({
      data: { userId, embedding },
    });

    res.status(200).json({ message: 'Search query saved successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

// Semantic search using embeddings
export const searchGigsSemantic = async (req: Request, res: Response) => {
  const { query } = req.query;
  
  if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const queryEmbedding = await generateEmbedding(query);

    const allGigs = await prisma.gig.findMany({
      include: { embeddings: true },
    });

    const rankedGigs = allGigs
      .map((gig) => {
        if (!gig.embeddings.length) return null;
        const similarity = cosineSimilarity(queryEmbedding, gig.embeddings[0].embedding);
        return { ...gig, score: similarity };
      })
      .filter(Boolean)
      .sort((a, b) => (b?.score || 0) - (a?.score || 0));

    res.status(200).json(rankedGigs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getRecommendations = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    // Basic implementation: fetch stored recommendations
    const recommendations = await prisma.recommendedGig.findMany({
      where: { userId },
      orderBy: { score: 'desc' },
      include: { gig: true }
    });
    res.status(200).json(recommendations);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
