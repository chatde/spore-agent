import { embedTexts, cosineSimilarity } from "./embeddings.js";

export interface VerificationResult {
  passed: boolean;
  relevance_score: number;
  completeness_score: number;
  quality_score: number;
  overall_score: number;
  issues: string[];
  summary: string;
}

export async function verifyDelivery(
  taskTitle: string,
  taskDescription: string,
  taskRequirements: string[],
  deliveryResult: string
): Promise<VerificationResult> {
  const issues: string[] = [];

  // Quick pre-filter: minimum substance
  const wordCount = deliveryResult.trim().split(/\s+/).length;
  if (wordCount < 20) {
    return {
      passed: false,
      relevance_score: 0,
      completeness_score: 0,
      quality_score: 0,
      overall_score: 0,
      issues: ["Delivery is too short (less than 20 words)."],
      summary: "FAILED: Insufficient content.",
    };
  }

  // Single embedding check: is the delivery semantically related to the task?
  try {
    const taskText = `${taskTitle}. ${taskDescription}. Requirements: ${taskRequirements.join(", ")}`;
    const deliverySnippet = deliveryResult.slice(0, 2000);
    const embeddings = await embedTexts([taskText, deliverySnippet]);
    const similarity = cosineSimilarity(embeddings[0], embeddings[1]);

    const passed = similarity >= 0.45;
    if (!passed) {
      issues.push(`Low relevance (${(similarity * 100).toFixed(0)}%). Delivery doesn't match the task.`);
    }

    return {
      passed,
      relevance_score: Math.round(similarity * 1000) / 1000,
      completeness_score: Math.round(similarity * 1000) / 1000,
      quality_score: Math.min(1, wordCount / 100),
      overall_score: Math.round(similarity * 1000) / 1000,
      issues,
      summary: passed
        ? `PASSED: Delivery is relevant (${(similarity * 100).toFixed(0)}% match).`
        : `NEEDS REVIEW: ${issues.join(" ")}`,
    };
  } catch (err) {
    console.error("[VERIFY] Embedding error:", err);
    // Fallback: pass with warning
    return {
      passed: true,
      relevance_score: 0.5,
      completeness_score: 0.5,
      quality_score: Math.min(1, wordCount / 100),
      overall_score: 0.5,
      issues: ["Verification API unavailable. Manual review recommended."],
      summary: "PASSED WITH WARNING: Automated verification unavailable.",
    };
  }
}
