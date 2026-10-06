const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Initialize Gemini client per request
 * Uses custom key from x-api-key header if provided, otherwise falls back to server env
 */
function getGeminiClient(customApiKey) {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY") {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenerativeAI(apiKey);
}

/**
 * Helper to call Gemini model with automatic fallback and retry on transient 503/429 errors
 */
async function generateContent(genAI, systemPrompt, userPrompt) {
  const candidateModels = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-3.5-flash"];
  let lastError = null;

  for (const modelName of candidateModels) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\n---\n\nUser Input:\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
          },
        });
        return result.response.text();
      } catch (err) {
        lastError = err;
        // If 503 (high demand) or 429 (rate limit), wait briefly and retry or try next candidate model
        if (err.message?.includes("503") || err.message?.includes("429") || err.status === 503) {
          await new Promise((resolve) => setTimeout(resolve, 800 * attempt));
        } else {
          // If error is not a transient capacity error (e.g. invalid key), rethrow immediately
          break;
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate content from AI model.");
}

/**
 * Helper to strip markdown code fences from JSON or code responses
 */
function stripMarkdownFences(text) {
  let cleaned = (text || "").trim();
  if (cleaned.startsWith("```")) {
    const lines = cleaned.split("\n");
    if (lines[0].startsWith("```")) {
      lines.shift();
    }
    if (lines[lines.length - 1] && lines[lines.length - 1].startsWith("```")) {
      lines.pop();
    }
    cleaned = lines.join("\n").trim();
  }
  return cleaned;
}

/**
 * AI Code Conversion
 */
async function convertCodeService(code, fromLanguage, toLanguage, customApiKey) {
  const genAI = getGeminiClient(customApiKey);
  const systemPrompt = `You are an expert developer. Convert the provided code from ${fromLanguage || "auto-detect"} to ${toLanguage}.
Your response must contain ONLY the converted code inside a markdown code block. Do not provide explanations, notes, or introductions outside the code block.`;

  const responseText = await generateContent(genAI, systemPrompt, code);
  const convertedCode = stripMarkdownFences(responseText);
  return convertedCode;
}

/**
 * AI Code Debugging
 */
async function debugCodeService(code, customApiKey) {
  const genAI = getGeminiClient(customApiKey);
  const systemPrompt = `You are an expert debugger. Analyze the provided code for actual syntax errors, logical bugs, runtime failures, and compiler issues.
You must respond with ONLY a valid JSON object (no markdown, no code fences, no extra text) containing the following keys:
- "hasErrors": boolean (set to true ONLY if there are functional bugs, syntax errors, or runtime issues. If the code is correct or just has stylistic variances, set this to false)
- "bugs": an array of objects, where each object has:
  - "line": number or null (approximate line number of the issue)
  - "severity": string ("High", "Medium", "Low")
  - "description": string (short description of the issue)
- "explanation": string (markdown-formatted detailed explanation of why the code failed and how the fixes resolve the issues. If no errors are found, state that the code is clean)
- "fixedCode": string (the fixed code. CRITICAL: Do NOT make unnecessary changes to variable names, indentation, spacing, comments, or overall structure unless it is strictly required to resolve a bug. If no bugs are found, this must be EXACTLY identical to the original input code)`;

  const responseText = await generateContent(genAI, systemPrompt, code);
  const cleaned = stripMarkdownFences(responseText);
  const debugInfo = JSON.parse(cleaned);
  return debugInfo;
}

/**
 * AI Code Quality Analysis
 */
async function qualityCheckService(code, customApiKey) {
  const genAI = getGeminiClient(customApiKey);
  const systemPrompt = `You are an expert code quality reviewer. Analyze the provided code for readability, performance (efficiency), security, and compliance with best practices.
You must respond with ONLY a valid JSON object (no markdown, no code fences, no extra text) containing the following keys:
- "score": number (an overall score between 0 and 100)
- "categories": an object with keys: "readability", "efficiency", "security", "bestPractices". Each category must have:
  - "score": number (0 to 10)
  - "feedback": string (brief explanation of the score and suggestions)
- "improvements": array of strings (actionable items to improve the code)
- "summary": string (a short markdown-formatted summary of the review)`;

  const responseText = await generateContent(genAI, systemPrompt, code);
  const cleaned = stripMarkdownFences(responseText);
  const qualityReport = JSON.parse(cleaned);
  return qualityReport;
}

module.exports = {
  convertCodeService,
  debugCodeService,
  qualityCheckService,
};
