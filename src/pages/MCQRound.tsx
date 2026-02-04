import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GameButton } from "@/components/ui/game-button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useGame } from "@/contexts/GameContext";
import { round1Questions, round2Questions } from "@/data/questions";
import { cn } from "@/lib/utils";

const MCQRound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const round = location.pathname.includes("round-1") ? "1" : "2";
  const { gameState, addRound1Answer, addRound2Answer } = useGame();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const isRound1 = round === "1";
  const path = gameState.selectedPath || "ninja";
  const questions = isRound1 ? round1Questions[path] : round2Questions[path];
  const question = questions[currentQuestion];

  // Redirect if no path selected
  useEffect(() => {
    if (!gameState.selectedPath) {
      navigate("/path-selection");
    }
  }, [gameState.selectedPath, navigate]);

  const handleNext = () => {
    if (!selectedAnswer) return;

    setIsTransitioning(true);

    // Store answer
    if (isRound1) {
      addRound1Answer(selectedAnswer);
    } else {
      addRound2Answer(selectedAnswer);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsTransitioning(false);
      } else {
        // Move to next round or riddles
        if (isRound1) {
          navigate("/round-2");
        } else {
          navigate("/riddles");
        }
      }
    }, 300);
  };

  const pathTitles = {
    ninja: "Shadow Path",
    elves: "Mythical Path",
    dwarves: "Forge Path",
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col px-4 py-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "absolute w-1 h-1 rounded-full animate-pulse-slow",
              path === "ninja" && "bg-ninja",
              path === "elves" && "bg-elves",
              path === "dwarves" && "bg-dwarves"
            )}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {path === "ninja" && "🥷"}
                {path === "elves" && "🧝"}
                {path === "dwarves" && "⛏️"}
              </span>
              <div>
                <p className="font-display text-sm text-muted-foreground uppercase tracking-wider">
                  Path: {path.charAt(0).toUpperCase() + path.slice(1)}
                </p>
                <p className="font-display text-lg text-foreground">
                  {pathTitles[path]}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-sm text-muted-foreground uppercase tracking-wider">
                Round {round}
              </p>
              <p className="font-display text-lg text-foreground">
                {isRound1 ? "Strategic Decisions" : "Field & Infrastructure"}
              </p>
            </div>
          </div>

          <ProgressBar
            current={currentQuestion + 1}
            total={questions.length}
            label={`Question ${currentQuestion + 1} of ${questions.length}`}
            path={path}
          />
        </div>

        {/* Question */}
        <div
          className={cn(
            "flex-1 flex flex-col transition-opacity duration-300",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="bg-card rounded-lg border border-border p-6 mb-6 shadow-card">
            <p className="font-body text-xl md:text-2xl text-foreground leading-relaxed">
              {question.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((option) => (
              <button
                key={option.label}
                onClick={() => setSelectedAnswer(option.label)}
                className={cn(
                  "w-full text-left p-4 rounded-lg border-2 transition-all duration-300",
                  "bg-secondary/30 hover:bg-secondary/50",
                  "group flex items-start gap-4",
                  selectedAnswer === option.label
                    ? cn(
                        "border-2",
                        path === "ninja" && "border-ninja bg-ninja/10",
                        path === "elves" && "border-elves bg-elves/10",
                        path === "dwarves" && "border-dwarves bg-dwarves/10"
                      )
                    : "border-border hover:border-muted-foreground"
                )}
              >
                <span
                  className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-display text-sm transition-colors",
                    selectedAnswer === option.label
                      ? cn(
                          path === "ninja" && "border-ninja bg-ninja text-foreground",
                          path === "elves" && "border-elves bg-elves text-foreground",
                          path === "dwarves" && "border-dwarves bg-dwarves text-foreground"
                        )
                      : "border-muted-foreground text-muted-foreground group-hover:border-foreground group-hover:text-foreground"
                  )}
                >
                  {option.label}
                </span>
                <span className="font-body text-lg text-foreground/90">
                  {option.value}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Next button */}
        <div className="flex justify-end">
          <GameButton
            variant={path}
            size="lg"
            onClick={handleNext}
            disabled={!selectedAnswer}
          >
            Next →
          </GameButton>
        </div>
      </div>
    </div>
  );
};

export default MCQRound;
