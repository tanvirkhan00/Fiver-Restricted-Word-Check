import { useState, useEffect, useRef, useMemo } from "react";
import {
  Zap,
  Play,
  RotateCcw,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Gauge,
  Clock,
  Sparkles,
  Award,
  ChevronRight,
  Copy,
  ExternalLink
} from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { getWpmTier } from "../components/LiveClock";
import { formatDuration } from "../lib/format";

const PRACTICE_SCENARIOS = [
  {
    id: "onboarding",
    title: "1. Order Confirmation & Kickoff",
    category: "First Draft",
    level: "Warm Up",
    words: 34,
    text: "Hello! Thank you so much for placing the order. I have received all your requirements and files. I am starting to work on your project immediately and will keep you updated with the progress.",
  },
  {
    id: "decline_external",
    title: "2. Declining Off-Fiverr Contact (Compliance)",
    category: "Safety Drill",
    level: "Essential",
    words: 38,
    text: "Thanks for asking! However, to protect both of our accounts and comply with Fiverr Terms of Service, all communications and payments must stay inside the Fiverr platform. We can discuss everything right here in the order chat.",
  },
  {
    id: "revision_reply",
    title: "3. Handling Revision Request",
    category: "Revision / Adjustment",
    level: "Intermediate",
    words: 42,
    text: "Thank you for the detailed feedback. I completely understand the adjustments you need on the design and typography. I am working on the revisions now and will deliver the updated version for your review shortly.",
  },
  {
    id: "delivery_note",
    title: "4. Final Delivery & Approval Note",
    category: "Delivery Message",
    level: "Intermediate",
    words: 45,
    text: "Hello! I am happy to deliver the final files for your project as requested. Please take your time to review everything carefully. If you need any minor polish, feel free to request a revision. Thank you for working with me!",
  },
  {
    id: "milestone_offer",
    title: "5. Custom Proposal & Scope Clarification",
    category: "Meeting Approach",
    level: "Pro Speed",
    words: 52,
    text: "Greetings! Based on your detailed specifications, I have prepared a complete plan covering design, development, and testing. The estimated turnaround time is four business days. You can review the breakdown and accept the custom offer below whenever you are ready.",
  },
];

export function SpeedTrainerPage({ onTransferToChecker, addToast }) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const scenario = PRACTICE_SCENARIOS[scenarioIndex];
  const targetText = scenario.text;

  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [activeElapsedMs, setActiveElapsedMs] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [personalBests, setPersonalBests] = useState(() => {
    try {
      const saved = localStorage.getItem("fiverr_trainer_pbs");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const inputRef = useRef(null);
  const timerRef = useRef(null);

  // Focus input when scenario changes
  useEffect(() => {
    handleReset();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, [scenarioIndex]);

  // Live timer tick
  useEffect(() => {
    if (startTime && !isFinished) {
      timerRef.current = setInterval(() => {
        setActiveElapsedMs(Date.now() - startTime);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isFinished]);

  // Handle typing change
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (isFinished) return;

    if (!startTime) {
      setStartTime(Date.now());
    }

    setInput(val);

    // Check completion
    if (val.length >= targetText.length) {
      const now = Date.now();
      setEndTime(now);
      setIsFinished(true);
      const totalMs = now - (startTime || now);
      setActiveElapsedMs(totalMs);

      // Calculate final WPM
      const minutes = Math.max(totalMs, 1000) / 60000;
      const finalWpm = Math.round((targetText.length / 5) / minutes);

      // Save PB
      setPersonalBests((prev) => {
        const currentPb = prev[scenario.id]?.wpm || 0;
        if (finalWpm > currentPb) {
          const nextPbs = {
            ...prev,
            [scenario.id]: { wpm: finalWpm, date: new Date().toISOString() },
          };
          try {
            localStorage.setItem("fiverr_trainer_pbs", JSON.stringify(nextPbs));
          } catch (_) {}
          return nextPbs;
        }
        return prev;
      });

      if (addToast) {
        addToast(`Completed drill at ${finalWpm} WPM!`, "success");
      }
    }
  };

  const handleReset = () => {
    setInput("");
    setStartTime(null);
    setEndTime(null);
    setActiveElapsedMs(0);
    setIsFinished(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  // Calculate live stats
  const { currentWpm, currentAccuracy, correctCount, errorCount } = useMemo(() => {
    let correct = 0;
    let errors = 0;

    for (let i = 0; i < input.length; i++) {
      if (input[i] === targetText[i]) {
        correct++;
      } else {
        errors++;
      }
    }

    const minutes = Math.max(activeElapsedMs, 1000) / 60000;
    // Standard typing calculation: (correct typed / 5) / minutes
    const wpm = (input.length >= 5 && minutes > 0)
      ? Math.round((correct / 5) / minutes)
      : 0;

    const acc = input.length > 0
      ? Math.round((correct / input.length) * 100)
      : 100;

    return {
      currentWpm: Math.min(200, wpm),
      currentAccuracy: Math.max(0, acc),
      correctCount: correct,
      errorCount: errors,
    };
  }, [input, targetText, activeElapsedMs]);

  const tier = getWpmTier(currentWpm);
  const pb = personalBests[scenario.id]?.wpm || 0;

  const handleCopyText = () => {
    navigator.clipboard.writeText(targetText);
    if (addToast) addToast("Scenario text copied to clipboard.");
  };

  const handleSendToChecker = () => {
    if (onTransferToChecker) {
      onTransferToChecker(targetText, scenario.category);
    }
  };

  return (
    <div className="page-body">
      <PageHeader
        title="Fiverr Response Speed Trainer"
        subtitle="Practice high-speed client communication drills to boost your Fiverr Response Rate and conversion speed."
        right={
          <div className="badge-live">
            <Zap size={13} className="text-accent" /> Speed &amp; Compliance Drills
          </div>
        }
      />

      {/* SCENARIO PICKER CARDS */}
      <div className="trainer-scenario-strip">
        {PRACTICE_SCENARIOS.map((s, idx) => {
          const sPb = personalBests[s.id]?.wpm;
          const isActive = idx === scenarioIndex;
          return (
            <button
              key={s.id}
              type="button"
              className={`trainer-tab-card${isActive ? " trainer-tab-active" : ""}`}
              onClick={() => setScenarioIndex(idx)}
            >
              <div className="trainer-tab-top">
                <span className="trainer-tab-cat">{s.category}</span>
                {sPb ? (
                  <span className="trainer-pb-badge" title="Personal Best">
                    <Trophy size={10} /> {sPb} WPM
                  </span>
                ) : (
                  <span className="trainer-level-tag">{s.level}</span>
                )}
              </div>
              <div className="trainer-tab-title">{s.title}</div>
              <div className="trainer-tab-meta mono">{s.words} words</div>
            </button>
          );
        })}
      </div>

      {/* LIVE SPEED TELEMETRY STRIP */}
      <div className="telemetry-strip" style={{ marginBottom: 16 }}>
        <div className="t-segment">
          <div className="t-segment-icon t-icon-accent">
            <Clock size={16} />
          </div>
          <div className="t-segment-main">
            <div className="t-label-row">
              <span className="t-label">Drill Timer</span>
              <span className="t-state-pill">
                <span className={`timer-dot ${startTime && !isFinished ? "timer-dot-active" : "timer-dot-idle"}`} />
                {isFinished ? "Completed" : startTime ? "Typing..." : "Ready"}
              </span>
            </div>
            <div className="t-value-row">
              <span className="t-value mono">{formatDuration(activeElapsedMs)}</span>
              <button
                type="button"
                className="t-ctrl-btn"
                onClick={handleReset}
                title="Restart this drill"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>
        </div>

        <div className="t-divider" />

        <div className="t-segment">
          <div className="t-segment-icon t-icon-low">
            <Gauge size={16} />
          </div>
          <div className="t-segment-main">
            <div className="t-label-row">
              <span className="t-label">Live WPM</span>
              <span className={`t-tier t-tier-${tier.tone}`}>{tier.label}</span>
            </div>
            <div className="t-value-row">
              <span className="t-value mono">
                {currentWpm} <small>WPM</small>
              </span>
              <span className="t-sub mono">
                {pb > 0 ? `PB: ${pb} WPM` : "No PB yet"}
              </span>
            </div>
          </div>
        </div>

        <div className="t-divider" />

        <div className="t-segment">
          <div className="t-segment-icon t-icon-medium">
            <Award size={16} />
          </div>
          <div className="t-segment-main">
            <div className="t-label-row">
              <span className="t-label">Accuracy &amp; Progress</span>
              <span className="t-sub mono">
                {Math.round((input.length / targetText.length) * 100)}%
              </span>
            </div>
            <div className="t-value-row">
              <span className="t-value mono">
                {currentAccuracy}% <small>Acc</small>
              </span>
              <span className="t-sub mono">
                {input.length}/{targetText.length} chars
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE DRILL WORKBENCH */}
      <div className="card trainer-workbench">
        <div className="card-head trainer-header">
          <div className="toolbar-group">
            <span className="card-label">Scenario Prompt</span>
            <span className="chip chip-static">{scenario.title}</span>
          </div>
          <div className="toolbar-group">
            <button
              type="button"
              className="chip-action-btn"
              onClick={handleCopyText}
              title="Copy prompt text"
            >
              <Copy size={12} /> Copy
            </button>
            <button
              type="button"
              className="chip-action-btn chip-action-accent"
              onClick={handleSendToChecker}
              title="Open this response in the Message Checker"
            >
              <ExternalLink size={12} /> Send to Checker
            </button>
          </div>
        </div>

        {/* CHARACTER BY CHARACTER VISUAL DISPLAY */}
        <div className="trainer-display mono" onClick={() => inputRef.current?.focus()}>
          {targetText.split("").map((char, index) => {
            let status = "pending";
            if (index < input.length) {
              status = input[index] === char ? "correct" : "incorrect";
            }
            const isCursor = index === input.length && !isFinished;

            return (
              <span
                key={index}
                className={`trainer-char trainer-char-${status}${isCursor ? " trainer-char-cursor" : ""}`}
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* INPUT BOX */}
        <div className="trainer-input-wrap">
          <textarea
            ref={inputRef}
            className="trainer-textarea"
            rows={3}
            value={input}
            onChange={handleInputChange}
            placeholder={
              startTime
                ? "Keep typing to the end of the scenario..."
                : "Type the text above here to start the live timer..."
            }
            disabled={isFinished}
            autoFocus
          />
        </div>

        {/* COMPLETION MODAL / SUMMARY CARD */}
        {isFinished && (
          <div className="trainer-result-box">
            <div className="trainer-result-head">
              <div className="trainer-badge-success">
                <CheckCircle2 size={18} /> Drill Completed!
              </div>
              <div className="trainer-score-row">
                <span className="trainer-wpm-pill mono">
                  <strong>{currentWpm}</strong> WPM
                </span>
                <span className="trainer-acc-pill mono">
                  <strong>{currentAccuracy}%</strong> Accuracy
                </span>
                <span className="trainer-time-pill mono">
                  <strong>{formatDuration(activeElapsedMs)}</strong> Time
                </span>
              </div>
            </div>

            <div className="trainer-advice">
              <Sparkles size={14} className="text-accent" />
              <span>
                {currentWpm >= 65
                  ? "⚡ Top Rated Responder Speed: You can reply to buyers in under 60 seconds, which significantly increases conversion on Fiverr!"
                  : currentWpm >= 40
                  ? "🚀 Steady Commercial Pace: Great clarity and speed. Practicing daily will easily push your response speed to 60+ WPM."
                  : "🌱 Building Speed: Focus on accuracy first — muscle memory on standard templates will quickly boost your typing speed."}
              </span>
            </div>

            <div className="trainer-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
              >
                <RotateCcw size={13} /> Try Again
              </button>
              {scenarioIndex < PRACTICE_SCENARIOS.length - 1 && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setScenarioIndex((i) => i + 1)}
                >
                  Next Drill <ChevronRight size={14} />
                </button>
              )}
              <button
                type="button"
                className="btn btn-accent"
                onClick={handleSendToChecker}
              >
                Transfer to Compliance Checker <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
