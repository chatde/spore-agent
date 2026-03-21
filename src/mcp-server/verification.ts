import { embedText, cosineSimilarity } from "./embeddings.js";

export interface VerificationResult {
  passed: boolean;
  relevance_score: number;
  completeness_score: number;
  quality_score: number;
  overall_score: number;
  issues: string[];
  summary: string;
}

/**
 * Proof-of-Work verification for task deliveries.
 *
 * Uses Google Embeddings to check:
 * 1. Relevance: Is the delivery semantically related to the task?
 * 2. Completeness: Does it address the requirements?
 * 3. Quality: Is it substantial enough (not empty/hallucinated)?
 *
 * This is a first-pass automated check. The task poster still reviews
 * and rates the work. This catches obvious garbage/hallucination.
 */
export async function verifyDelivery(
  taskTitle: string,
  taskDescription: string,
  taskRequirements: string[],
  deliveryResult: string
): Promise<VerificationResult> {
  const issues: string[] = [];

  // Check 1: Minimum substance
  const wordCount = deliveryResult.trim().split(/\s+/).length;
  if (wordCount < 20) {
    return {
      passed: false,
      relevance_score: 0,
      completeness_score: 0,
      quality_score: 0,
      overall_score: 0,
      issues: ["Delivery is too short (less than 20 words). This appears to be empty or placeholder content."],
      summary: "FAILED: Delivery has insufficient content.",
    };
  }

  // Check 2: Repetition detection (hallucination signal)
  const sentences = deliveryResult.split(/[.!?\n]+/).filter((s) => s.trim().length > 10);
  if (sentences.length > 5) {
    const uniqueSentences = new Set(sentences.map((s) => s.trim().toLowerCase()));
    const repetitionRatio = uniqueSentences.size / sentences.length;
    if (repetitionRatio < 0.5) {
      issues.push(`High repetition detected (${Math.round((1 - repetitionRatio) * 100)}% repeated content). May indicate hallucination or copy-paste filler.`);
    }
  }

  // Check 3: Semantic relevance via embeddings
  let relevanceScore = 0.5; // default if embeddings fail
  let completenessScore = 0.5;

  try {
    const taskText = `${taskTitle}. ${taskDescription}. Requirements: ${taskRequirements.join(", ")}`;

    // Truncate delivery to first 2000 chars for embedding
    const deliverySnippet = deliveryResult.slice(0, 2000);

    const [taskEmbedding, deliveryEmbedding] = await Promise.all([
      embedText(taskText),
      embedText(deliverySnippet),
    ]);

    relevanceScore = cosineSimilarity(taskEmbedding, deliveryEmbedding);

    if (relevanceScore < 0.35) {
      issues.push(
        `Low relevance (${(relevanceScore * 100).toFixed(0)}%). The delivery doesn't appear to match what was requested.`
      );
    }

    // Check requirement coverage
    if (taskRequirements.length > 0) {
      const reqText = taskRequirements.join(", ");
      const reqEmbedding = await embedText(reqText);
      completenessScore = cosineSimilarity(reqEmbedding, deliveryEmbedding);

      if (completenessScore < 0.3) {
        issues.push(
          `Low requirement coverage (${(completenessScore * 100).toFixed(0)}%). The delivery may not address all stated requirements.`
        );
      }
    }
  } catch {
    // Embeddings unavailable — skip semantic checks
    issues.push("Semantic verification unavailable (embedding API error). Manual review recommended.");
  }

  // Quality score based on substance
  let qualityScore = Math.min(1, wordCount / 200); // Scale up to 200 words
  if (wordCount > 50 && sentences.length > 3) {
    qualityScore = Math.min(1, qualityScore + 0.2);
  }

  // Check for common filler patterns
  const fillerPatterns = [
    /lorem ipsum/i,
    /placeholder/i,
    /TODO/g,
    /FIXME/g,
    /insert .* here/i,
    /example text/i,
  ];
  for (const pattern of fillerPatterns) {
    if (pattern.test(deliveryResult)) {
      qualityScore *= 0.5;
      issues.push(`Contains placeholder/filler content matching "${pattern.source}".`);
    }
  }

  const overallScore =
    relevanceScore * 0.4 + completenessScore * 0.3 + qualityScore * 0.3;

  const passed = overallScore >= 0.4 && relevanceScore >= 0.3 && issues.length <= 1;

  return {
    passed,
    relevance_score: Math.round(relevanceScore * 1000) / 1000,
    completeness_score: Math.round(completenessScore * 1000) / 1000,
    quality_score: Math.round(qualityScore * 1000) / 1000,
    overall_score: Math.round(overallScore * 1000) / 1000,
    issues,
    summary: passed
      ? `PASSED: Delivery appears relevant and substantive (score: ${(overallScore * 100).toFixed(0)}%).`
      : `NEEDS REVIEW: ${issues.length} issue(s) detected. Score: ${(overallScore * 100).toFixed(0)}%. Manual review recommended.`,
  };
}
