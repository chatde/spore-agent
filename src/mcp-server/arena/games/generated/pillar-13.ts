// Auto-generated — Pillar 13: Data Science Dojo (82 games)
// Generated 2026-03-28T17:27:59.164Z
import type { GameEngine, RoundPrompt, ScoreResult } from '../engine.js';
import type { ArenaMatch, ArenaChallenge } from '../../types.js';

function wc(s: string): number { return s.trim().split(/\s+/).filter(Boolean).length; }
function has(s: string, kw: string[]): number { const l = s.toLowerCase(); return kw.filter(k => l.includes(k)).length; }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function clamp(n: number): number { return Math.max(0, Math.min(100, Math.round(n))); }
function codeScore(s: string): number { let sc = 0; if (s.includes('function') || s.includes('=>')) sc += 20; if (s.includes('return')) sc += 15; if (s.includes('{')) sc += 10; if (s.length > 20) sc += 15; if (s.length > 100) sc += 10; return clamp(sc + rand(5, 20)); }
function reasonScore(s: string): number { const m = ['therefore','because','since','thus','hence','if','then','given','conclude','follows','implies']; let sc = has(s, m) * 7; if (wc(s) > 30) sc += 15; if (wc(s) > 80) sc += 10; return clamp(sc + rand(5, 20)); }
function creativeScore(s: string): number { const u = new Set(s.toLowerCase().split(/\s+/)); let sc = Math.min(40, u.size); if (wc(s) > 20) sc += 15; return clamp(sc + rand(5, 20)); }
function precisionScore(s: string, ideal: number): number { const len = wc(s); if (len === 0) return 0; return clamp(100 - Math.abs(len - ideal) * 3); }
function mathScore(s: string): number { let sc = 0; if (/\d/.test(s)) sc += 20; if (s.includes('=') || s.includes('+')) sc += 15; if (has(s, ['therefore','thus','equals','answer','result','solution']) > 0) sc += 15; if (wc(s) > 10) sc += 15; return clamp(sc + rand(10, 25)); }

function textGame(cfg: { prompts: ((d: number, r: number) => string)[]; score: (answer: string, d: number) => number; deadline?: number; }): GameEngine {
  return {
    generateConfig: (d) => ({ difficulty: Math.max(1, Math.min(10, d)) }),
    startRound: (match: ArenaMatch, challenge: ArenaChallenge): RoundPrompt => {
      const r = (match.round_data?.length ?? 0) + 1;
      const d = challenge.difficulty ?? 3;
      return { round_number: r, prompt: cfg.prompts[(r - 1) % cfg.prompts.length](d, r), deadline_seconds: cfg.deadline ?? 120 };
    },
    scoreSubmission: async (match: ArenaMatch, challenge: ArenaChallenge, submission: unknown): Promise<ScoreResult> => {
      const answer = typeof submission === 'string' ? submission : (submission as Record<string, unknown>)?.answer as string ?? JSON.stringify(submission);
      const d = challenge.difficulty ?? 3;
      const score = clamp(cfg.score(answer || '', d));
      const rn = (match.round_data?.length ?? 0) + 1;
      return { score, feedback: `Score: ${score}/100`, round_complete: true, game_complete: rn >= 3, updated_round_data: [...(match.round_data || []), { score, answer: (answer || '').slice(0, 200) }] };
    },
  };
}

export const P13_EXT: Record<string, GameEngine> = {
anomaly_detection_challenge: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are a data analyst. Given the dataset below, identify the anomalous data point and explain your reasoning.
    Data: [12, 15, 18, 22, 24, 19, 300, 17, 20, 23]`,
    (d, r) => `Analyze this time series data and flag any anomalies:
    Time: 1-10, Values: [5, 6, 5.5, 5.8, 25, 5.2, 5.3, 5.6, 5.4, 5.7]`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["300", "25", "anomaly", "outlier"])) sc += 30;
    if (reasonScore(answer) > 0.5) sc += 40;
    if (wc(answer) > 50) sc += 20;
    return clamp(sc);
  },
  deadline: 90,
}),

anomaly_detection_challenge: textGame({
  // format: solo
  prompts: [
    (d, r) => `You are a data analyst. Given the dataset below, identify the anomalous data point and explain your reasoning.
    Data: [12, 15, 18, 22, 24, 19, 300, 17, 20, 23]`,
    (d, r) => `Analyze this time series data and flag any anomalies:
    Time: 1-10, Values: [5, 6, 5.5, 5.8, 25, 5.2, 5.3, 5.6, 5.4, 5.7]`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["300", "25", "anomaly", "outlier"])) sc += 30;
    if (reasonScore(answer) > 0.5) sc += 40;
    if (wc(answer) > 50) sc += 20;
    return clamp(sc);
  },
  deadline: 90,
}),

correlation_investigator: textGame({
  // format: solo
  prompts: [
    (d, r) => `Given the following data pairs, calculate the correlation coefficient and determine if there's a positive, negative, or no correlation.
    X: [1,2,3,4,5], Y: [2,4,6,8,10]`,
    (d, r) => `Analyze this dataset and describe the relationship between variables:
    Temperature: [20,22,21,23,25,24,26], Ice Cream Sales: [150,160,155,170,180,175,190]`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["positive", "correlation", "1.0", "strong"])) sc += 40;
    if (mathScore(answer) > 0.7) sc += 30;
    if (wc(answer) > 40) sc += 20;
    return clamp(sc);
  },
  deadline: 120,
}),

correlation_investigator: textGame({
  // format: solo
  prompts: [
    (d, r) => `Given the following data pairs, calculate the correlation coefficient and determine if there's a positive, negative, or no correlation.
    X: [1,2,3,4,5], Y: [2,4,6,8,10]`,
    (d, r) => `Analyze this dataset and describe the relationship between variables:
    Temperature: [20,22,21,23,25,24,26], Ice Cream Sales: [150,160,155,170,180,175,190]`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["positive", "correlation", "1.0", "strong"])) sc += 40;
    if (mathScore(answer) > 0.7) sc += 30;
    if (wc(answer) > 40) sc += 20;
    return clamp(sc);
  },
  deadline: 120,
}),

data_cleaning_challenge: textGame({
  // format: solo
  prompts: [
    (d, r) => `Clean this dataset by handling missing values and outliers:
    [10, 12, NA, 15, 18, 22, 300, 20, 19, 21]`,
    (d, r) => `Given this customer data with inconsistencies, standardize the format:
    ["john.doe@gmail.com", "Jane.Doe@Yahoo.com", "bob.smith@GMAIL.COM"]`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["NA", "missing", "outlier", "standardize"])) sc += 30;
    if (precisionScore(answer, "clean data") > 0.6) sc += 40;
    if (wc(answer) > 60) sc += 20;
    return clamp(sc);
  },
  deadline: 150,
}),

data_cleaning_challenge: textGame({
  // format: solo
  prompts: [
    (d, r) => `Clean this dataset by handling missing values and outliers:
    [10, 12, NA, 15, 18, 22, 300, 20, 19, 21]`,
    (d, r) => `Given this customer data with inconsistencies, standardize the format:
    ["john.doe@gmail.com", "Jane.Doe@Yahoo.com", "bob.smith@GMAIL.COM"]`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["NA", "missing", "outlier", "standardize"])) sc += 30;
    if (precisionScore(answer, "clean data") > 0.6) sc += 40;
    if (wc(answer) > 60) sc += 20;
    return clamp(sc);
  },
  deadline: 150,
}),

statistical_hypothesis: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Formulate a null and alternative hypothesis for this scenario:
    "Testing if a new drug reduces blood pressure more than the current standard treatment."`,
    (d, r) => `Create testable hypotheses for this research question:
    "Investigating the impact of sleep duration on academic performance."`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["null", "alternative", "hypothesis", "testable"])) sc += 40;
    if (reasonScore(answer) > 0.6) sc += 30;
    if (wc(answer) > 80) sc += 20;
    return clamp(sc);
  },
  deadline: 180,
}),

statistical_hypothesis: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Formulate a null and alternative hypothesis for this scenario:
    "Testing if a new drug reduces blood pressure more than the current standard treatment."`,
    (d, r) => `Create testable hypotheses for this research question:
    "Investigating the impact of sleep duration on academic performance."`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["null", "alternative", "hypothesis", "testable"])) sc += 40;
    if (reasonScore(answer) > 0.6) sc += 30;
    if (wc(answer) > 80) sc += 20;
    return clamp(sc);
  },
  deadline: 180,
}),

p_value_interpretation: textGame({
  // format: solo
  prompts: [
    (d, r) => `Given p-value = 0.03 and significance level α = 0.05, interpret the results and make a conclusion about the null hypothesis.`,
    (d, r) => `A study reports p-value = 0.18. Explain what this means in the context of statistical significance.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["reject", "null", "significant", "p-value"])) sc += 40;
    if (reasonScore(answer) > 0.7) sc += 30;
    if (wc(answer) > 70) sc += 20;
    return clamp(sc);
  },
  deadline: 100,
}),

p_value_interpretation: textGame({
  // format: solo
  prompts: [
    (d, r) => `Given p-value = 0.03 and significance level α = 0.05, interpret the results and make a conclusion about the null hypothesis.`,
    (d, r) => `A study reports p-value = 0.18. Explain what this means in the context of statistical significance.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["reject", "null", "significant", "p-value"])) sc += 40;
    if (reasonScore(answer) > 0.7) sc += 30;
    if (wc(answer) > 70) sc += 20;
    return clamp(sc);
  },
  deadline: 100,
}),

confidence_interval_calculation: textGame({
  // format: solo
  prompts: [
    (d, r) => `Calculate a 95% confidence interval for the mean given:
    Sample mean = 50, SD = 10, n = 36`,
    (d, r) => `Find the 99% confidence interval for:
    Sample mean = 75, SD = 15, n = 25`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (mathScore(answer) > 0.8) sc += 50;
    if (has(answer, ["confidence", "interval", "95%", "99%"])) sc += 30;
    if (wc(answer) > 50) sc += 20;
    return clamp(sc);
  },
  deadline: 180,
}),

confidence_interval_calculation: textGame({
  // format: solo
  prompts: [
    (d, r) => `Calculate a 95% confidence interval for the mean given:
    Sample mean = 50, SD = 10, n = 36`,
    (d, r) => `Find the 99% confidence interval for:
    Sample mean = 75, SD = 15, n = 25`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (mathScore(answer) > 0.8) sc += 50;
    if (has(answer, ["confidence", "interval", "95%", "99%"])) sc += 30;
    if (wc(answer) > 50) sc += 20;
    return clamp(sc);
  },
  deadline: 180,
}),

regression_analysis: textGame({
  // format: solo
  prompts: [
    (d, r) => `Given the dataset X: [1,2,3,4,5], Y: [2,4,6,8,10], find the regression equation and predict Y when X=6.`,
    (d, r) => `Analyze this data and create a linear regression model:
    Hours Studied: [1,2,3,4,5], Test Scores: [60,65,70,75,80]`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (mathScore(answer) > 0.7) sc += 40;
    if (has(answer, ["regression", "equation", "predict", "slope"])) sc += 30;
    if (wc(answer) > 60) sc += 20;
    return clamp(sc);
  },
  deadline: 240,
}),

regression_analysis: textGame({
  // format: solo
  prompts: [
    (d, r) => `Given the dataset X: [1,2,3,4,5], Y: [2,4,6,8,10], find the regression equation and predict Y when X=6.`,
    (d, r) => `Analyze this data and create a linear regression model:
    Hours Studied: [1,2,3,4,5], Test Scores: [60,65,70,75,80]`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (mathScore(answer) > 0.7) sc += 40;
    if (has(answer, ["regression", "equation", "predict", "slope"])) sc += 30;
    if (wc(answer) > 60) sc += 20;
    return clamp(sc);
  },
  deadline: 240,
}),

chi_square_test: textGame({
  // format: solo
  prompts: [
    (d, r) => `Perform a chi-square test for independence on this data:
    Observed: [[10, 20], [15, 25]]. State the conclusion.`,
    (d, r) => `Given observed and expected frequencies, calculate the chi-square statistic:
    Observed: [18, 22], Expected: [20, 20]`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (mathScore(answer) > 0.6) sc += 40;
    if (has(answer, ["chi-square", "statistic", "observed", "expected"])) sc += 30;
    if (wc(answer) > 70) sc += 20;
    return clamp(sc);
  },
  deadline: 200,
}),

chi_square_test: textGame({
  // format: solo
  prompts: [
    (d, r) => `Perform a chi-square test for independence on this data:
    Observed: [[10, 20], [15, 25]]. State the conclusion.`,
    (d, r) => `Given observed and expected frequencies, calculate the chi-square statistic:
    Observed: [18, 22], Expected: [20, 20]`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (mathScore(answer) > 0.6) sc += 40;
    if (has(answer, ["chi-square", "statistic", "observed", "expected"])) sc += 30;
    if (wc(answer) > 70) sc += 20;
    return clamp(sc);
  },
  deadline: 200,
}),

anova_test: textGame({
  // format: solo
  prompts: [
    (d, r) => `Given three groups of data, determine if there's a significant difference using ANOVA:
    Group A: [5,6,7,8,9], Group B: [10,11,12,13,14], Group C: [15,16,17,18,19]`,
    (d, r) => `Perform ANOVA on this dataset and interpret the results:
    Treatment 1: [20,22,21,23,25], Treatment 2: [18,19,20,21,22], Control: [15,16,17,18,19]`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (mathScore(answer) > 0.7) sc += 40;
    if (has(answer, ["ANOVA", "significant", "difference", "groups"])) sc += 30;
    if (wc(answer) > 80) sc += 20;
    return clamp(sc);
  },
  deadline: 300,
}),

anova_test: textGame({
  // format: solo
  prompts: [
    (d, r) => `Given three groups of data, determine if there's a significant difference using ANOVA:
    Group A: [5,6,7,8,9], Group B: [10,11,12,13,14], Group C: [15,16,17,18,19]`,
    (d, r) => `Perform ANOVA on this dataset and interpret the results:
    Treatment 1: [20,22,21,23,25], Treatment 2: [18,19,20,21,22], Control: [15,16,17,18,19]`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (mathScore(answer) > 0.7) sc += 40;
    if (has(answer, ["ANOVA", "significant", "difference", "groups"])) sc += 30;
    if (wc(answer) > 80) sc += 20;
    return clamp(sc);
  },
  deadline: 300,
}),

data_visualization_challenge: textGame({
  // format: solo
  prompts: [
    (d, r) => `Create a clear and effective visualization for this dataset:
    Categories: A,B,C,D; Values: [10, 15, 7, 22]`,
    (d, r) => `Design a visualization to show trends in this time series:
    Months: Jan-Dec, Sales: [100,110,105,120,130,125,140,135,150,145,160,155]`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (creativeScore(answer) > 0.6) sc += 40;
    if (has(answer, ["visualization", "chart", "graph", "trend"])) sc += 30;
    if (wc(answer) > 90) sc += 20;
    return clamp(sc);
  },
  deadline: 120,
}),

data_visualization_challenge: textGame({
  // format: solo
  prompts: [
    (d, r) => `Create a clear and effective visualization for this dataset:
    Categories: A,B,C,D; Values: [10, 15, 7, 22]`,
    (d, r) => `Design a visualization to show trends in this time series:
    Months: Jan-Dec, Sales: [100,110,105,120,130,125,140,135,150,145,160,155]`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (creativeScore(answer) > 0.6) sc += 40;
    if (has(answer, ["visualization", "chart", "graph", "trend"])) sc += 30;
    if (wc(answer) > 90) sc += 20;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: solo
  prompts: [
    (d, r) => `Preprocess a dataset with 30% missing values using imputation techniques. Generate 3 distinct strategies for feature a and b.`,
    (d, r) => `Create synthetic missing data patterns for a time-series dataset. Include autocorrelation preservation.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["imputation", "kNN", "mean"])? 30 : 0;
    sc += has(answer, ["time-series", "autocorrelation"])? 20 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: solo
  prompts: [
    (d, r) => `Preprocess a dataset with 30% missing values using imputation techniques. Generate 3 distinct strategies for feature a and b.`,
    (d, r) => `Create synthetic missing data patterns for a time-series dataset. Include autocorrelation preservation.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["imputation", "kNN", "mean"])? 30 : 0;
    sc += has(answer, ["time-series", "autocorrelation"])? 20 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: duel_1v1
  prompts: [
    (d, r) => `Design a feature engineering pipeline for a classification task. Must include at least 5 engineered features with domain logic.`,
    (d, r) => `Evaluate two feature sets using mutual information. Compare their effectiveness in predicting target y.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["feature engineering", "mutual information"])? 35 : 0;
    sc += codeScore(answer, d) * 2;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: duel_1v1
  prompts: [
    (d, r) => `Design a feature engineering pipeline for a classification task. Must include at least 5 engineered features with domain logic.`,
    (d, r) => `Evaluate two feature sets using mutual information. Compare their effectiveness in predicting target y.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["feature engineering", "mutual information"])? 35 : 0;
    sc += codeScore(answer, d) * 2;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: team_2v2
  prompts: [
    (d, r) => `Identify 3 potential sources of bias in a housing dataset. Propose mitigation strategies for each.`,
    (d, r) => `Analyze a biased correlation matrix. Calculate adjusted correlation coefficients while preserving noise.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["bias", "fairness", "mitigation"])? 30 : 0;
    sc += has(answer, ["adjust correlation", "bias correction"])? 25 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: team_2v2
  prompts: [
    (d, r) => `Identify 3 potential sources of bias in a housing dataset. Propose mitigation strategies for each.`,
    (d, r) => `Analyze a biased correlation matrix. Calculate adjusted correlation coefficients while preserving noise.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["bias", "fairness", "mitigation"])? 30 : 0;
    sc += has(answer, ["adjust correlation", "bias correction"])? 25 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: battle_royale
  prompts: [
    (d, r) => `Simulate a data pipeline with random sensor failures. Implement redundancy checks for critical steps.`,
    (d, r) => `Optimize a data cleaning workflow for 1M records. Reduce runtime by 40% using parallel processing.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["redundancy", "fault tolerance"])? 25 : 0;
    sc += has(answer, ["parallel processing", "runtime optimization"])? 30 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: battle_royale
  prompts: [
    (d, r) => `Simulate a data pipeline with random sensor failures. Implement redundancy checks for critical steps.`,
    (d, r) => `Optimize a data cleaning workflow for 1M records. Reduce runtime by 40% using parallel processing.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["redundancy", "fault tolerance"])? 25 : 0;
    sc += has(answer, ["parallel processing", "runtime optimization"])? 30 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: solo
  prompts: [
    (d, r) => `Implement a statistical power analysis for a new experiment. Include effect size, sample size, and alpha=0.05.`,
    (d, r) => `Compare two Gaussian mixture models using Bayesian information criterion. Justify your choice.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["power analysis", "sample size"])? 35 : 0;
    sc += has(answer, ["BIC", "GMM", "Bayesian"])? 25 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: solo
  prompts: [
    (d, r) => `Implement a statistical power analysis for a new experiment. Include effect size, sample size, and alpha=0.05.`,
    (d, r) => `Compare two Gaussian mixture models using Bayesian information criterion. Justify your choice.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["power analysis", "sample size"])? 35 : 0;
    sc += has(answer, ["BIC", "GMM", "Bayesian"])? 25 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: duel_1v1
  prompts: [
    (d, r) => `Create a visualization to detect outliers in a 3D dataset. Use at least 2 visualization types.`,
    (d, r) => `Explain Simpson's paradox using a real-world dataset. Provide a corrected analysis.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["outlier", "visualization", "3D"])? 30 : 0;
    sc += has(answer, ["Simpson", "paradox", "correction"])? 25 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: duel_1v1
  prompts: [
    (d, r) => `Create a visualization to detect outliers in a 3D dataset. Use at least 2 visualization types.`,
    (d, r) => `Explain Simpson's paradox using a real-world dataset. Provide a corrected analysis.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["outlier", "visualization", "3D"])? 30 : 0;
    sc += has(answer, ["Simpson", "paradox", "correction"])? 25 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: team_2v2
  prompts: [
    (d, r) => `Develop a feature selection method for high-dimensional data. Compare wrapper vs filter approaches.`,
    (d, r) => `Detect and correct collinear features in a dataset with 100 variables. Use variance inflation factor.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["feature selection", "VIF"])? 30 : 0;
    sc += has(answer, ["collinearity", "variance inflation"])? 25 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: team_2v2
  prompts: [
    (d, r) => `Develop a feature selection method for high-dimensional data. Compare wrapper vs filter approaches.`,
    (d, r) => `Detect and correct collinear features in a dataset with 100 variables. Use variance inflation factor.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["feature selection", "VIF"])? 30 : 0;
    sc += has(answer, ["collinearity", "variance inflation"])? 25 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: battle_royale
  prompts: [
    (d, r) => `Simulate a dataset with class imbalance. Implement SMOTE and compare performance metrics.`,
    (d, r) => `Optimize a classification threshold for a ROC curve with AUC=0.85. Maximize precision-recall tradeoff.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["SMOTE", "class imbalance"])? 30 : 0;
    sc += has(answer, ["threshold optimization", "AUC", "precision-recall"])? 35 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: battle_royale
  prompts: [
    (d, r) => `Simulate a dataset with class imbalance. Implement SMOTE and compare performance metrics.`,
    (d, r) => `Optimize a classification threshold for a ROC curve with AUC=0.85. Maximize precision-recall tradeoff.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["SMOTE", "class imbalance"])? 30 : 0;
    sc += has(answer, ["threshold optimization", "AUC", "precision-recall"])? 35 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: solo
  prompts: [
    (d, r) => `Apply principal component analysis to reduce dimensionality of an image dataset. Retain 95% variance.`,
    (d, r) => `Implement a custom regularization technique for linear regression. Compare L1 vs L2 performance.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["PCA", "dimensionality reduction"])? 35 : 0;
    sc += has(answer, ["regularization", "L1", "L2"])? 25 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: solo
  prompts: [
    (d, r) => `Apply principal component analysis to reduce dimensionality of an image dataset. Retain 95% variance.`,
    (d, r) => `Implement a custom regularization technique for linear regression. Compare L1 vs L2 performance.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["PCA", "dimensionality reduction"])? 35 : 0;
    sc += has(answer, ["regularization", "L1", "L2"])? 25 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: duel_1v1
  prompts: [
    (d, r) => `Design an experiment to test the effectiveness of two A/B testing variants. Include confidence interval calculation.`,
    (d, r) => `Analyze a dataset with missing not at random (MNAR) missingness. Propose a suitable imputation method.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["A/B testing", "confidence interval"])? 30 : 0;
    sc += has(answer, ["MNAR", "imputation"])? 25 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: duel_1v1
  prompts: [
    (d, r) => `Design an experiment to test the effectiveness of two A/B testing variants. Include confidence interval calculation.`,
    (d, r) => `Analyze a dataset with missing not at random (MNAR) missingness. Propose a suitable imputation method.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["A/B testing", "confidence interval"])? 30 : 0;
    sc += has(answer, ["MNAR", "imputation"])? 25 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: team_2v2
  prompts: [
    (d, r) => `Create a dashboard to visualize seasonal trends in a time-series dataset. Include 3 interactive elements.`,
    (d, r) => `Implement a custom anomaly detection algorithm using isolation forest. Optimize for runtime.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["dashboard", "interactive visualization"])? 30 : 0;
    sc += has(answer, ["isolation forest", "anomaly detection"])? 25 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

game_id: textGame({// format: team_2v2
  prompts: [
    (d, r) => `Create a dashboard to visualize seasonal trends in a time-series dataset. Include 3 interactive elements.`,
    (d, r) => `Implement a custom anomaly detection algorithm using isolation forest. Optimize for runtime.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    sc += has(answer, ["dashboard", "interactive visualization"])? 30 : 0;
    sc += has(answer, ["isolation forest", "anomaly detection"])? 25 : 0;
    return clamp(sc);
  },
  deadline: 120,
}),

bayesian_inference: textGame({
  // format: solo
  prompts: [
    (d, r) => {
      const prior = [0.1, 0.3, 0.6, 0.8][Math.floor(d/3)] || 0.5;
      const likelihood = [0.7, 0.85, 0.9, 0.95][Math.floor(d/3)] || 0.8;
      const falsePositive = [0.2, 0.15, 0.1, 0.05][Math.floor(d/3)] || 0.1;
      return `Given a medical test with sensitivity ${likelihood} (true positive rate) and false positive rate ${falsePositive}. Disease prevalence is ${prior}. A random person tests positive. Calculate the posterior probability they have the disease. Provide numeric answer to 4 decimal places.`;
    },
    (d, r) => {
      const prior = [0.01, 0.02, 0.05, 0.1][Math.floor(d/3)];
      const likelihood = 0.99;
      const falsePositive = [0.05, 0.03, 0.02, 0.01][Math.floor(d/3)];
      return `Security scanner: intrusion prior ${prior}, detection rate ${likelihood}, false alarm rate ${falsePositive}. Alarm triggers. Posterior probability of intrusion? Answer to 4 decimal places.`;
    },
  ],
  score: (answer, d) => {
    let sc = 0;
    const prior = [0.1, 0.3, 0.6, 0.8][Math.floor(d/3)] || 0.5;
    const likelihood = [0.7, 0.85, 0.9, 0.95][Math.floor(d/3)] || 0.8;
    const falsePositive = [0.2, 0.15, 0.1, 0.05][Math.floor(d/3)] || 0.1;
    const numerator = prior * likelihood;
    const denominator = numerator + (1 - prior) * falsePositive;
    const correct = Math.round((numerator / denominator) * 10000) / 10000;
    const ans = parseFloat(answer.replace(/[^\d.]/g, ''));
    if (!isNaN(ans)) {
      const error = Math.abs(ans - correct);
      sc = Math.max(0, 100 - error * 10000);
    }
    return clamp(sc);
  },
  deadline: 90,
}),

bayesian_inference: textGame({
  // format: solo
  prompts: [
    (d, r) => {
      const prior = [0.1, 0.3, 0.6, 0.8][Math.floor(d/3)] || 0.5;
      const likelihood = [0.7, 0.85, 0.9, 0.95][Math.floor(d/3)] || 0.8;
      const falsePositive = [0.2, 0.15, 0.1, 0.05][Math.floor(d/3)] || 0.1;
      return `Given a medical test with sensitivity ${likelihood} (true positive rate) and false positive rate ${falsePositive}. Disease prevalence is ${prior}. A random person tests positive. Calculate the posterior probability they have the disease. Provide numeric answer to 4 decimal places.`;
    },
    (d, r) => {
      const prior = [0.01, 0.02, 0.05, 0.1][Math.floor(d/3)];
      const likelihood = 0.99;
      const falsePositive = [0.05, 0.03, 0.02, 0.01][Math.floor(d/3)];
      return `Security scanner: intrusion prior ${prior}, detection rate ${likelihood}, false alarm rate ${falsePositive}. Alarm triggers. Posterior probability of intrusion? Answer to 4 decimal places.`;
    },
  ],
  score: (answer, d) => {
    let sc = 0;
    const prior = [0.1, 0.3, 0.6, 0.8][Math.floor(d/3)] || 0.5;
    const likelihood = [0.7, 0.85, 0.9, 0.95][Math.floor(d/3)] || 0.8;
    const falsePositive = [0.2, 0.15, 0.1, 0.05][Math.floor(d/3)] || 0.1;
    const numerator = prior * likelihood;
    const denominator = numerator + (1 - prior) * falsePositive;
    const correct = Math.round((numerator / denominator) * 10000) / 10000;
    const ans = parseFloat(answer.replace(/[^\d.]/g, ''));
    if (!isNaN(ans)) {
      const error = Math.abs(ans - correct);
      sc = Math.max(0, 100 - error * 10000);
    }
    return clamp(sc);
  },
  deadline: 90,
}),
};


