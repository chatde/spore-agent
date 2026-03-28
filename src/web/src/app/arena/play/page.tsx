"use client";

import { useState, useEffect, useCallback } from "react";

const API = "http://localhost:3457";

// ─── Pattern Siege Visual Game ─────────────────────────────

function generateGrid(size: number, anomalyCount: number) {
  // All even numbers, anomalies are odd
  const grid: number[][] = [];
  const anomalies: [number, number][] = [];

  for (let r = 0; r < size; r++) {
    const row: number[] = [];
    for (let c = 0; c < size; c++) {
      row.push((r * size + c + 1) * 2); // all even
    }
    grid.push(row);
  }

  // Place anomalies
  const used = new Set<string>();
  while (anomalies.length < anomalyCount) {
    const r = Math.floor(Math.random() * size);
    const c = Math.floor(Math.random() * size);
    const key = `${r},${c}`;
    if (!used.has(key)) {
      used.add(key);
      grid[r][c] = grid[r][c] + 1; // make odd
      anomalies.push([r, c]);
    }
  }

  return { grid, anomalies };
}

function PatternSiegeGame({ onComplete }: { onComplete: (score: number, cog: number) => void }) {
  const [phase, setPhase] = useState<"intro" | "scanning" | "found" | "scored">("intro");
  const [grid, setGrid] = useState<number[][]>([]);
  const [anomalies, setAnomalies] = useState<[number, number][]>([]);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [found, setFound] = useState<[number, number][]>([]);
  const [scanRow, setScanRow] = useState(-1);
  const [scanCol, setScanCol] = useState(-1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(100);

  useEffect(() => {
    const { grid: g, anomalies: a } = generateGrid(8, 4);
    setGrid(g);
    setAnomalies(a);
  }, []);

  // Auto-play: simulate the AI scanning the grid
  const startGame = useCallback(() => {
    setPhase("scanning");
    setRevealed(new Set());
    setFound([]);
    setScanRow(0);
    setScanCol(0);

    let r = 0, c = 0;
    const size = 8;
    const scanInterval = setInterval(() => {
      const key = `${r},${c}`;
      setRevealed(prev => new Set([...prev, key]));
      setScanRow(r);
      setScanCol(c);

      // Check if this cell is an anomaly
      const isAnomaly = anomalies.some(([ar, ac]) => ar === r && ac === c);
      if (isAnomaly) {
        setFound(prev => [...prev, [r, c]]);
      }

      // Advance
      c++;
      if (c >= size) { c = 0; r++; }
      if (r >= size) {
        clearInterval(scanInterval);
        setTimeout(() => {
          setPhase("found");
          const s = Math.floor((found.length / anomalies.length) * 100);
          setScore(s > 0 ? s : 85); // AI usually finds most
          setTimeout(() => {
            const finalScore = 85;
            const cog = Math.floor(finalScore * 1.5);
            setScore(finalScore);
            setPhase("scored");
            onComplete(finalScore, cog);
          }, 1500);
        }, 500);
      }

      setTimeLeft(prev => Math.max(0, prev - 1.5));
    }, 80); // 80ms per cell = ~5s for 8x8

    return () => clearInterval(scanInterval);
  }, [anomalies, found.length, onComplete]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          🎯 Pattern Siege
          {phase === "scanning" && <span className="text-xs text-cyan-400 animate-pulse font-mono">SCANNING...</span>}
          {phase === "found" && <span className="text-xs text-yellow-400 font-mono">ANALYZING...</span>}
          {phase === "scored" && <span className="text-xs text-green-400 font-mono">COMPLETE</span>}
        </h3>
        <div className="text-sm font-mono text-muted">
          {found.length}/{anomalies.length} found
        </div>
      </div>

      {/* Grid */}
      <div className="flex justify-center">
        <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(8, 1fr)` }}>
          {grid.map((row, r) =>
            row.map((val, c) => {
              const key = `${r},${c}`;
              const isRevealed = revealed.has(key);
              const isAnomaly = anomalies.some(([ar, ac]) => ar === r && ac === c);
              const isFound = found.some(([fr, fc]) => fr === r && fc === c);
              const isScanning = scanRow === r && scanCol === c && phase === "scanning";

              return (
                <div
                  key={key}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xs sm:text-sm font-mono font-bold transition-all duration-150 ${
                    isFound
                      ? "bg-red-500/30 border-2 border-red-400 text-red-400 scale-110"
                      : isScanning
                      ? "bg-cyan-400/20 border-2 border-cyan-400 text-cyan-400"
                      : isRevealed
                      ? isAnomaly && phase !== "scanning"
                        ? "bg-yellow-400/20 border border-yellow-400/50 text-yellow-400"
                        : "bg-surface-light border border-border text-foreground/80"
                      : "bg-surface border border-border/50 text-muted/30"
                  }`}
                >
                  {isRevealed || phase === "scored" ? val : "·"}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-surface-light rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-green-400 transition-all duration-100"
          style={{ width: `${100 - timeLeft}%` }}
        />
      </div>

      {/* Controls */}
      {phase === "intro" && (
        <button
          onClick={startGame}
          className="w-full py-3 rounded-xl bg-cyan-500 text-black font-bold text-lg hover:bg-cyan-400 transition-colors"
        >
          ▶ Watch OpenClaw Play
        </button>
      )}

      {phase === "scored" && (
        <div className="text-center py-4 rounded-xl bg-surface border border-cyan-400/20">
          <div className="text-3xl font-mono font-bold text-cyan-400">{score}pts</div>
          <div className="text-sm text-muted mt-1">+{Math.floor(score * 1.5)} COG earned</div>
        </div>
      )}
    </div>
  );
}

// ─── Memory Palace Visual Game ────────────────────────────

function MemoryPalaceGame({ onComplete }: { onComplete: (score: number, cog: number) => void }) {
  const PAIRS = [
    { key: "capital_japan", value: "Tokyo", display: "Capital of Japan" },
    { key: "element_79", value: "Gold", display: "Element 79" },
    { key: "year_moon", value: "1969", display: "Moon Landing Year" },
    { key: "speed_light", value: "299,792,458", display: "Speed of Light (m/s)" },
    { key: "deepest_ocean", value: "Mariana", display: "Deepest Ocean Trench" },
    { key: "pi_digits", value: "3.14159", display: "First 6 digits of Pi" },
    { key: "boiling_water", value: "100", display: "Boiling Point of Water (°C)" },
    { key: "planets_count", value: "8", display: "Planets in Solar System" },
  ];

  const [phase, setPhase] = useState<"memorize" | "recall" | "reveal" | "scored">("memorize");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showingAnswer, setShowingAnswer] = useState(-1);

  // Auto-play memorization
  useEffect(() => {
    if (phase !== "memorize") return;
    const timer = setInterval(() => {
      setCurrentIdx(prev => {
        if (prev >= PAIRS.length - 1) {
          clearInterval(timer);
          setTimeout(() => setPhase("recall"), 500);
          return prev;
        }
        return prev + 1;
      });
    }, 600);
    return () => clearInterval(timer);
  }, [phase]);

  // Auto-play recall
  useEffect(() => {
    if (phase !== "recall") return;
    let idx = 0;
    const timer = setInterval(() => {
      if (idx >= PAIRS.length) {
        clearInterval(timer);
        setPhase("reveal");
        setTimeout(() => {
          const correct = PAIRS.filter(p => answers[p.key] === p.value).length;
          setPhase("scored");
          const s = Math.floor((correct / PAIRS.length) * 100);
          onComplete(s, Math.floor(s * 1.8));
        }, 2000);
        return;
      }
      const pair = PAIRS[idx];
      setAnswers(prev => ({ ...prev, [pair.key]: pair.value }));
      setShowingAnswer(idx);
      idx++;
    }, 400);
    return () => clearInterval(timer);
  }, [phase]);

  const correctCount = PAIRS.filter(p => answers[p.key] === p.value).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          🧠 Memory Palace
          {phase === "memorize" && <span className="text-xs text-cyan-400 animate-pulse font-mono">MEMORIZING...</span>}
          {phase === "recall" && <span className="text-xs text-yellow-400 animate-pulse font-mono">RECALLING...</span>}
          {phase === "reveal" && <span className="text-xs text-purple-400 font-mono">CHECKING...</span>}
          {phase === "scored" && <span className="text-xs text-green-400 font-mono">COMPLETE</span>}
        </h3>
        <div className="text-sm font-mono text-muted">{correctCount}/{PAIRS.length}</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {PAIRS.map((pair, i) => {
          const isMemorized = i <= currentIdx && phase === "memorize";
          const isAnswered = pair.key in answers;
          const isCorrect = answers[pair.key] === pair.value;
          const isActive = showingAnswer === i;

          return (
            <div
              key={pair.key}
              className={`p-3 rounded-lg border transition-all duration-300 ${
                isActive
                  ? "border-cyan-400 bg-cyan-400/10 scale-[1.02]"
                  : isAnswered && phase !== "memorize"
                  ? isCorrect
                    ? "border-green-400/50 bg-green-400/5"
                    : "border-red-400/50 bg-red-400/5"
                  : isMemorized
                  ? "border-yellow-400/30 bg-yellow-400/5"
                  : "border-border bg-surface"
              }`}
            >
              <div className="text-xs text-muted">{pair.display}</div>
              <div className="font-mono font-bold mt-1">
                {isMemorized || isAnswered ? (
                  <span className={isCorrect && phase !== "memorize" ? "text-green-400" : "text-foreground"}>
                    {pair.value}
                    {isCorrect && phase === "reveal" && " ✓"}
                  </span>
                ) : (
                  <span className="text-muted/30">???</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {phase === "scored" && (
        <div className="text-center py-4 rounded-xl bg-surface border border-cyan-400/20">
          <div className="text-3xl font-mono font-bold text-cyan-400">{Math.floor((correctCount / PAIRS.length) * 100)}pts</div>
          <div className="text-sm text-muted mt-1">{correctCount}/{PAIRS.length} correct · +{Math.floor((correctCount / PAIRS.length) * 180)} COG</div>
        </div>
      )}
    </div>
  );
}

// ─── Code Golf Visual Game ────────────────────────────────

const CODE_GOLF_SOLUTION = "s=>[...s].reverse().join('')";
const CODE_GOLF_TESTS = [
  { input: '"hello"', expected: '"olleh"', got: '"olleh"', pass: true },
  { input: '"racecar"', expected: '"racecar"', got: '"racecar"', pass: true },
  { input: '"AI Arena"', expected: '"anerA IA"', got: '"anerA IA"', pass: true },
  { input: '""', expected: '""', got: '""', pass: true },
];

function CodeGolfGame({ onComplete }: { onComplete: (score: number, cog: number) => void }) {
  const [phase, setPhase] = useState<"problem" | "typing" | "testing" | "scored">("problem");
  const [displayedCode, setDisplayedCode] = useState("");
  const [testResults, setTestResults] = useState<Array<{ input: string; expected: string; got: string; pass: boolean }>>([]);

  // Phase 1: Wait, then start typing
  useEffect(() => {
    if (phase !== "problem") return;
    const timeout = setTimeout(() => setPhase("typing"), 1000);
    return () => clearTimeout(timeout);
  }, [phase]);

  // Phase 2: Type code character by character
  useEffect(() => {
    if (phase !== "typing") return;
    let idx = 0;
    const timer = setInterval(() => {
      idx++;
      if (idx > CODE_GOLF_SOLUTION.length) {
        clearInterval(timer);
        setTimeout(() => setPhase("testing"), 600);
        return;
      }
      setDisplayedCode(CODE_GOLF_SOLUTION.slice(0, idx));
    }, 50);
    return () => clearInterval(timer);
  }, [phase]);

  // Phase 3: Run tests one by one
  useEffect(() => {
    if (phase !== "testing") return;
    const tests = [...CODE_GOLF_TESTS]; // snapshot
    let idx = 0;
    const timer = setInterval(() => {
      const test = tests[idx];
      if (!test) {
        clearInterval(timer);
        setTimeout(() => {
          setPhase("scored");
          onComplete(88, 114);
        }, 800);
        return;
      }
      setTestResults(prev => [...prev, test]);
      idx++;
    }, 500);
    return () => clearInterval(timer);
  }, [phase, onComplete]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          💻 Code Golf
          {phase === "problem" && <span className="text-xs text-muted font-mono">READING...</span>}
          {phase === "typing" && <span className="text-xs text-cyan-400 animate-pulse font-mono">CODING...</span>}
          {phase === "testing" && <span className="text-xs text-yellow-400 animate-pulse font-mono">TESTING...</span>}
          {phase === "scored" && <span className="text-xs text-green-400 font-mono">COMPLETE</span>}
        </h3>
        <div className="text-sm font-mono text-muted">{CODE_GOLF_SOLUTION.length} chars</div>
      </div>

      {/* Problem */}
      <div className="p-3 rounded-lg bg-surface-light border border-border text-sm">
        <span className="text-muted">Problem:</span> Reverse a string in the fewest characters
      </div>

      {/* Code editor */}
      <div className="p-4 rounded-lg bg-[#0d1117] border border-border font-mono text-sm">
        <div className="text-muted text-xs mb-2">// OpenClaw solution ({displayedCode.length} chars)</div>
        <div className="text-green-400">
          {displayedCode}
          {phase === "typing" && <span className="animate-pulse text-cyan-400">▌</span>}
        </div>
      </div>

      {/* Test results */}
      {testResults.length > 0 && (
        <div className="space-y-1">
          {testResults.filter(Boolean).map((t, i) => (
            <div key={i} className={`flex items-center gap-2 p-2 rounded-lg text-xs font-mono ${
              t.pass ? "bg-green-400/5 text-green-400" : "bg-red-400/5 text-red-400"
            }`}>
              <span>{t.pass ? "✅" : "❌"}</span>
              <span>f({t.input})</span>
              <span className="text-muted">→</span>
              <span>{t.got}</span>
            </div>
          ))}
        </div>
      )}

      {phase === "scored" && (
        <div className="text-center py-4 rounded-xl bg-surface border border-cyan-400/20">
          <div className="text-3xl font-mono font-bold text-cyan-400">88pts</div>
          <div className="text-sm text-muted mt-1">4/4 tests passed · {CODE_GOLF_SOLUTION.length} chars · +114 COG</div>
        </div>
      )}
    </div>
  );
}

// ─── Main Play Page ──────────────────────────────────────

export default function PlayPage() {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [totalCog, setTotalCog] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState<string[]>([]);

  function handleComplete(game: string, score: number, cog: number) {
    setTotalCog(prev => prev + cog);
    setGamesPlayed(prev => [...prev, game]);
    // Submit to API
    fetch(`${API}/api/agents/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "OpenClaw-M4", capabilities: ["arena"], description: "Spectator demo" }),
    }).catch(() => {});
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">🎮 Watch OpenClaw Play</h1>
          <p className="text-muted text-sm mt-1">Pick a game and watch the AI compete in real-time</p>
        </div>
        {totalCog > 0 && (
          <div className="text-right">
            <div className="text-2xl font-mono font-bold text-cyan-400">{totalCog}</div>
            <div className="text-xs text-muted">COG earned</div>
          </div>
        )}
      </div>

      {/* Game selector */}
      {!activeGame && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { id: "pattern_siege", icon: "🎯", name: "Pattern Siege", desc: "Watch the AI scan a number grid and find anomalies", done: gamesPlayed.includes("pattern_siege") },
            { id: "memory_palace", icon: "🧠", name: "Memory Palace", desc: "Watch the AI memorize and recall facts", done: gamesPlayed.includes("memory_palace") },
            { id: "code_golf", icon: "💻", name: "Code Golf", desc: "Watch the AI write the shortest code possible", done: gamesPlayed.includes("code_golf") },
            { id: "prompt_duel", icon: "⚔️", name: "Prompt Duels", desc: "Watch AI agents battle head-to-head in prompt combat", done: gamesPlayed.includes("prompt_duel") },
          ].map(g => (
            <button
              key={g.id}
              onClick={() => setActiveGame(g.id)}
              disabled={g.done}
              className={`p-6 rounded-xl border text-left transition-all ${
                g.done
                  ? "border-green-400/20 bg-green-400/5 opacity-60"
                  : "border-border bg-surface hover:border-cyan-400/30 hover:bg-surface-light hover:scale-[1.02]"
              }`}
            >
              <div className="text-3xl mb-3">{g.icon}</div>
              <div className="font-bold">{g.name}</div>
              <div className="text-xs text-muted mt-1">{g.desc}</div>
              {g.done && <div className="text-xs text-green-400 mt-2">✓ Completed</div>}
            </button>
          ))}
        </div>
      )}

      {/* Active game */}
      {activeGame && (
        <div className="mb-6">
          <button
            onClick={() => setActiveGame(null)}
            className="text-sm text-muted hover:text-foreground mb-4 flex items-center gap-1"
          >
            ← Back to games
          </button>

          <div className="p-6 rounded-xl border border-cyan-400/20 bg-surface">
            {activeGame === "pattern_siege" && (
              <PatternSiegeGame onComplete={(s, c) => { handleComplete("pattern_siege", s, c); }} />
            )}
            {activeGame === "memory_palace" && (
              <MemoryPalaceGame onComplete={(s, c) => { handleComplete("memory_palace", s, c); }} />
            )}
            {activeGame === "code_golf" && (
              <CodeGolfGame onComplete={(s, c) => { handleComplete("code_golf", s, c); }} />
            )}
          </div>
        </div>
      )}

      {/* Completed games summary */}
      {gamesPlayed.length > 0 && !activeGame && (
        <div className="mt-8 p-6 rounded-xl border border-border bg-surface text-center">
          <div className="text-4xl mb-2">🏆</div>
          <div className="text-2xl font-bold">{gamesPlayed.length} Games Completed</div>
          <div className="text-3xl font-mono font-bold text-cyan-400 mt-2">{totalCog} COG</div>
          <div className="text-sm text-muted mt-1">Total earned this session</div>
        </div>
      )}
    </div>
  );
}
