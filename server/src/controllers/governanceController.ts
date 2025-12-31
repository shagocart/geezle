
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { GoogleGenAI } from '@google/genai';
import { GOVERNANCE_PROMPTS } from '../ai/prompts';

const prisma = new PrismaClient();
const aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL_NAME = 'gemini-3-pro-preview'; // Using Pro for complex reasoning

// 1. Predict Dispute Outcome
export const predictDispute = async (req: Request, res: Response) => {
    const { disputeId, contract, freelancerClaim, employerClaim, evidence } = req.body;

    try {
        const prompt = GOVERNANCE_PROMPTS.DISPUTE_PREDICTOR_V1
            .replace('{contract}', JSON.stringify(contract))
            .replace('{freelancer_claim}', freelancerClaim)
            .replace('{employer_claim}', employerClaim)
            .replace('{evidence}', JSON.stringify(evidence));

        const result = await aiClient.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const prediction = JSON.parse(result.text || '{}');

        // Save to DB
        await prisma.disputePrediction.upsert({
            where: { disputeId },
            update: { ...prediction },
            create: { disputeId, ...prediction, aiModelUsed: MODEL_NAME }
        });

        // Audit Log
        await prisma.aIAuditLog.create({
            data: {
                module: 'Dispute',
                inputHash: 'hash-of-inputs', // simplify for example
                outputSummary: prediction,
                confidence: prediction.confidenceScore
            }
        });

        res.json(prediction);
    } catch (error) {
        res.status(500).json({ error: 'AI Prediction Failed', details: error.message });
    }
};

// 2. Advise Escrow Release
export const adviseEscrow = async (req: Request, res: Response) => {
    const { escrowId, requirements, deliverables, clientActivity } = req.body;

    try {
        const prompt = GOVERNANCE_PROMPTS.ESCROW_ADVISOR_V1
            .replace('{requirements}', requirements)
            .replace('{deliverables}', JSON.stringify(deliverables))
            .replace('{client_activity}', clientActivity);

        const result = await aiClient.models.generateContent({
            model: 'gemini-3-flash-preview', // Faster model for transactions
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const advice = JSON.parse(result.text || '{}');

        await prisma.escrowAdvice.upsert({
            where: { escrowId },
            update: { ...advice },
            create: { escrowId, ...advice, auditLog: req.body }
        });

        res.json(advice);
    } catch (error) {
        res.status(500).json({ error: 'Escrow Advice Failed' });
    }
};

// 3. Suggest Contract Clauses
export const suggestClauses = async (req: Request, res: Response) => {
    const { jobDescription, jobType, jurisdiction } = req.body;

    try {
        const prompt = GOVERNANCE_PROMPTS.CONTRACT_CLAUSE_SUGGESTION_V1
            .replace('{description}', jobDescription)
            .replace('{type}', jobType)
            .replace('{jurisdiction}', jurisdiction || 'General');

        const result = await aiClient.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const suggestions = JSON.parse(result.text || '[]');
        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ error: 'Clause Suggestion Failed' });
    }
};

// 4. Enterprise Insights
export const getEnterpriseInsights = async (req: Request, res: Response) => {
    const { employerId, jobDescription, candidates } = req.body;

    try {
        const prompt = GOVERNANCE_PROMPTS.ENTERPRISE_HIRING_V1
            .replace('{job_description}', jobDescription)
            .replace('{candidates_json}', JSON.stringify(candidates));

        const result = await aiClient.models.generateContent({
            model: MODEL_NAME,
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });

        const insights = JSON.parse(result.text || '{}');
        
        // Save history logic would go here

        res.json(insights);
    } catch (error) {
        res.status(500).json({ error: 'Enterprise Insights Failed' });
    }
};
