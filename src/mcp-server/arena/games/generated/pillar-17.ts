// Auto-generated — Pillar 17: Cipher & Crypto (84 games)
// Generated 2026-03-28T17:50:44.162Z
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

export const P17_EXT: Record<string, GameEngine> = {
rsa_decryptor: textGame({
  // format: solo
  prompts: [
    (d, r) => `Decrypt the RSA ciphertext. n = ${323 * 17}, e = 65537, c = ${Math.pow(323, 65537) % (323*17)}. Find the plaintext m (integer).`,
    (d, r) => `Given RSA modulus n = ${103 * 89}, public exponent e = 7, and ciphertext c = ${Math.pow(42, 7) % (103*89)}. Compute the private key d and decrypt.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const expected = "42";
    if (has(answer, [expected])) sc += 10;
    if (has(answer, ["d = ", "private"])) sc += precisionScore(answer, `d = ${(7 ** -1) % (103*89)}`);
    return clamp(sc, 0, 20);
  },
  deadline: 120,
}),

rsa_decryptor: textGame({
  // format: solo
  prompts: [
    (d, r) => `Decrypt the RSA ciphertext. n = ${323 * 17}, e = 65537, c = ${Math.pow(323, 65537) % (323*17)}. Find the plaintext m (integer).`,
    (d, r) => `Given RSA modulus n = ${103 * 89}, public exponent e = 7, and ciphertext c = ${Math.pow(42, 7) % (103*89)}. Compute the private key d and decrypt.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const expected = "42";
    if (has(answer, [expected])) sc += 10;
    if (has(answer, ["d = ", "private"])) sc += precisionScore(answer, `d = ${(7 ** -1) % (103*89)}`);
    return clamp(sc, 0, 20);
  },
  deadline: 120,
}),

hash_cracker: textGame({
  // format: solo
  prompts: [
    (d, r) => `Find a string whose SHA-256 hash starts with ${'0'.repeat(Math.min(d, 8))}. The string must be alphanumeric, <= 10 chars.`,
    (d, r) => `Find any input that hashes to a value with first 6 hex digits = ${'a'.repeat(Math.min(d, 6))} using SHA-1.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["sha256", "sha-256", "SHA256"])) sc += 2;
    const targetZeros = '0'.repeat(Math.min(d, 8));
    if (has(answer, [targetZeros])) sc += 8;
    if (creativeScore(answer) > 3) sc += 5;
    return clamp(sc, 0, 15);
  },
  deadline: 120,
}),

hash_cracker: textGame({
  // format: solo
  prompts: [
    (d, r) => `Find a string whose SHA-256 hash starts with ${'0'.repeat(Math.min(d, 8))}. The string must be alphanumeric, <= 10 chars.`,
    (d, r) => `Find any input that hashes to a value with first 6 hex digits = ${'a'.repeat(Math.min(d, 6))} using SHA-1.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["sha256", "sha-256", "SHA256"])) sc += 2;
    const targetZeros = '0'.repeat(Math.min(d, 8));
    if (has(answer, [targetZeros])) sc += 8;
    if (creativeScore(answer) > 3) sc += 5;
    return clamp(sc, 0, 15);
  },
  deadline: 120,
}),

stego_hunter: textGame({
  // format: solo
  prompts: [
    (d, r) => `The following text contains a hidden message via capital letters: "Tihs is A tEst. NoticE the CApitals." Extract the hidden message.`,
    (d, r) => `Decode: "00100111 00100000 01101001 01110011 00100000 01110100 01110010 01110101 01110100 01101000" (binary to ASCII).`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const hidden1 = "A TEST";
    const hidden2 = " is truth";
    if (has(answer.toLowerCase(), [hidden1.toLowerCase(), hidden2.toLowerCase()])) sc += 10;
    if (reasonScore(answer) > 2) sc += 5;
    return clamp(sc);
  },
  deadline: 120,
}),

stego_hunter: textGame({
  // format: solo
  prompts: [
    (d, r) => `The following text contains a hidden message via capital letters: "Tihs is A tEst. NoticE the CApitals." Extract the hidden message.`,
    (d, r) => `Decode: "00100111 00100000 01101001 01110011 00100000 01110100 01110010 01110101 01110100 01101000" (binary to ASCII).`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const hidden1 = "A TEST";
    const hidden2 = " is truth";
    if (has(answer.toLowerCase(), [hidden1.toLowerCase(), hidden2.toLowerCase()])) sc += 10;
    if (reasonScore(answer) > 2) sc += 5;
    return clamp(sc);
  },
  deadline: 120,
}),

protocol_analyzer: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Analyze this handshake: Client: "HELLO", Server: "HELLO ACK", Client: "KEY xyz", Server: "OK". What is the vulnerability?`,
    (d, r) => `Given TCP flags: SYN, SYN-ACK, ACK, then FIN, FIN-ACK. Is this a normal termination? Explain the flaw if any.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["no encryption", "plaintext", "KEY xyz", "vulnerability"])) sc += 5;
    if (has(answer, ["replay", "MITM", "man-in-the-middle"])) sc += 10;
    if (reasonScore(answer) > 4) sc += 5;
    return clamp(sc, 0, 20);
  },
  deadline: 120,
}),

protocol_analyzer: textGame({
  // format: duel_1v1
  prompts: [
    (d, r) => `Analyze this handshake: Client: "HELLO", Server: "HELLO ACK", Client: "KEY xyz", Server: "OK". What is the vulnerability?`,
    (d, r) => `Given TCP flags: SYN, SYN-ACK, ACK, then FIN, FIN-ACK. Is this a normal termination? Explain the flaw if any.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["no encryption", "plaintext", "KEY xyz", "vulnerability"])) sc += 5;
    if (has(answer, ["replay", "MITM", "man-in-the-middle"])) sc += 10;
    if (reasonScore(answer) > 4) sc += 5;
    return clamp(sc, 0, 20);
  },
  deadline: 120,
}),

cipher_breaker: textGame({
  // format: solo
  prompts: [
    (d, r) => `Break the Caesar cipher: "Khoor Zruog!" (hint: common greeting)`,
    (d, r) => `Substitution cipher: "Uifsf jt b tfdsfu qmbdf." Find the shift.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["Hello World", "shift 3", "3"])) sc += 10;
    if (has(answer, ["There is a secret place"])) sc += 10;
    return clamp(sc, 0, 20);
  },
  deadline: 120,
}),

cipher_breaker: textGame({
  // format: solo
  prompts: [
    (d, r) => `Break the Caesar cipher: "Khoor Zruog!" (hint: common greeting)`,
    (d, r) => `Substitution cipher: "Uifsf jt b tfdsfu qmbdf." Find the shift.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["Hello World", "shift 3", "3"])) sc += 10;
    if (has(answer, ["There is a secret place"])) sc += 10;
    return clamp(sc, 0, 20);
  },
  deadline: 120,
}),

key_exchange_auditor: textGame({
  // format: solo
  prompts: [
    (d, r) => `Diffie-Hellman: g=5, p=23, Alice sends A=10, Bob sends B=8. Compute shared secret s.`,
    (d, r) => `Ephemeral DH: g=2, p=11, private a=3, private b=7. What is the shared key?`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const correct1 = "2";
    const correct2 = "10";
    if (has(answer, [correct1, correct2])) sc += 10;
    if (mathScore(answer) > 0) sc += 5;
    return clamp(sc, 0, 15);
  },
  deadline: 120,
}),

key_exchange_auditor: textGame({
  // format: solo
  prompts: [
    (d, r) => `Diffie-Hellman: g=5, p=23, Alice sends A=10, Bob sends B=8. Compute shared secret s.`,
    (d, r) => `Ephemeral DH: g=2, p=11, private a=3, private b=7. What is the shared key?`,
  ],
  score: (answer, d) => {
    let sc = 0;
    const correct1 = "2";
    const correct2 = "10";
    if (has(answer, [correct1, correct2])) sc += 10;
    if (mathScore(answer) > 0) sc += 5;
    return clamp(sc, 0, 15);
  },
  deadline: 120,
}),

signature_forger: textGame({
  // format: solo
  prompts: [
    (d, r) => `Given ECDSA: curve secp256k1, msg hash h=5, private key d=7, signature (r=4,s=2). Forge a signature for h=10.`,
    (d, r) => `Given RSA-PSS signature with known padding. Forgery requires: ?`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["nonce reuse", "reuse k", "k is same"])) sc += 10;
    if (has(answer, ["d = ?", "new r", "new s"])) sc += mathScore(answer);
    return clamp(sc, 0, 15);
  },
  deadline: 120,
}),

signature_forger: textGame({
  // format: solo
  prompts: [
    (d, r) => `Given ECDSA: curve secp256k1, msg hash h=5, private key d=7, signature (r=4,s=2). Forge a signature for h=10.`,
    (d, r) => `Given RSA-PSS signature with known padding. Forgery requires: ?`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["nonce reuse", "reuse k", "k is same"])) sc += 10;
    if (has(answer, ["d = ?", "new r", "new s"])) sc += mathScore(answer);
    return clamp(sc, 0, 15);
  },
  deadline: 120,
}),

aes_bruteforcer: textGame({
  // format: solo
  prompts: [
    (d, r) => `AES-128-ECB ciphertext: "2a7a3f8c9d1e6b4a2c8f3e9d1b6a4c8". Key is 4-digit decimal. Find key and decrypt.`,
    (d, r) => `Given: ciphertext = "6d796e6b6b65796c", IV=0, key hint: key is lowercase 'password' in hex. Decrypt.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["password", "67617373"])) sc += 10;
    if (has(answer, ["mynekkeyl"])) sc += 10;
    if (precisionScore(answer, "mynekkeyl") > 0) sc += 5;
    return clamp(sc, 0, 20);
  },
  deadline: 120,
}),

aes_bruteforcer: textGame({
  // format: solo
  prompts: [
    (d, r) => `AES-128-ECB ciphertext: "2a7a3f8c9d1e6b4a2c8f3e9d1b6a4c8". Key is 4-digit decimal. Find key and decrypt.`,
    (d, r) => `Given: ciphertext = "6d796e6b6b65796c", IV=0, key hint: key is lowercase 'password' in hex. Decrypt.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["password", "67617373"])) sc += 10;
    if (has(answer, ["mynekkeyl"])) sc += 10;
    if (precisionScore(answer, "mynekkeyl") > 0) sc += 5;
    return clamp(sc, 0, 20);
  },
  deadline: 120,
}),

binary_message: textGame({
  // format: solo
  prompts: [
    (d, r) => `Decode: "01001000 01100101 01101100 01101100 01101111" (binary)`,
    (d, r) => `Convert hex "4a 6f 68 6e" to ASCII.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["Hello", "John"])) sc += 10;
    if (codeScore(answer) > 0) sc += 5;
    return clamp(sc, 0, 15);
  },
  deadline: 120,
}),

binary_message: textGame({
  // format: solo
  prompts: [
    (d, r) => `Decode: "01001000 01100101 01101100 01101100 01101111" (binary)`,
    (d, r) => `Convert hex "4a 6f 68 6e" to ASCII.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["Hello", "John"])) sc += 10;
    if (codeScore(answer) > 0) sc += 5;
    return clamp(sc, 0, 15);
  },
  deadline: 120,
}),

crypto_chat: textGame({
  // format: team_2v2
  prompts: [
    (d, r) => `Chat log: Alice: "XyZ123", Bob: "AbC456", Alice: "XyZ123". What does "XyZ123" mean?`,
    (d, r) => `Given: " meet at dawn " encrypted with Vigenere key "sun". Decrypt the full message.`,
  ],
  score: (answer, d) => {
    let sc = 0;
    if (has(answer, ["same", "replay", "XyZ123", "meet at dawn"])) sc += 10;
    if (reasonScore(answer) > 3) sc += 10;
    return clamp(sc, 0, 20);
  },
  deadline: 120,
}),
};


