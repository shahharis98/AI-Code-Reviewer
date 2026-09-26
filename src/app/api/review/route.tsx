import { NextRequest, NextResponse } from 'next/server';
import { generateWithRetry, buildPrompt } from '@/lib/groq';
import type { ReviewResult } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const prompt = buildPrompt(code, language);
    const text = await generateWithRetry(prompt);

    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed: ReviewResult = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Review error:', err);
    return NextResponse.json(
      { error: 'Failed to review code. Please try again.' },
      { status: 500 }
    );
  }
}