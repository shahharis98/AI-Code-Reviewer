import Groq from "groq-sdk";

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export function buildPrompt(code: string, language: string): string {
  return `You are an expert code reviewer. Review the following ${language} code and identify issues.

For each issue found, provide:
- The line number
- Severity: "critical" (bugs, security issues), "warning" (bad practices, potential bugs), or "suggestion" (style, readability)
- A clear message explaining the issue
- An optional code suggestion to fix it

Respond ONLY with valid JSON in this exact format, no other text, no markdown code fences:
{
  "summary": "A 1-2 sentence overall summary of the code quality",
  "issues": [
    { "line": 5, "severity": "critical", "message": "...", "suggestion": "..." }
  ]
}

Code to review:
\`\`\`${language}
${code}
\`\`\`
`;
}

export async function generateWithRetry(
  prompt: string,
  retries = 2,
): Promise<string> {
  for (let i = 0; i <= retries; i++) {
    try {
      const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
      });
      const text = completion.choices[0]?.message?.content;
      if (!text) throw new Error("No text response from AI");
      return text;
    } catch (err: any) {
      const isLastAttempt = i === retries;
      const isRetryable = err?.status === 503 || err?.status === 429;
      if (isLastAttempt || !isRetryable) throw err;
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error("Failed after retries");
}
