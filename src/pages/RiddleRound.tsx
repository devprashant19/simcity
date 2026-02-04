import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameButton } from "@/components/ui/game-button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { useGame } from "@/contexts/GameContext";
import { riddles } from "@/data/questions";
import { cn } from "@/lib/utils";

const RiddleRound = () => {
  const navigate = useNavigate();
  const { gameState, addRiddleAnswer, calculateResults } = useGame();
  const [currentRiddle, setCurrentRiddle] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const path = gameState.selectedPath || "ninja";
  const riddle = riddles[currentRiddle];

  // Redirect if no path selected
  useEffect(() => {
    if (!gameState.selectedPath) {
      navigate("/path-selection");
    }
  }, [gameState.selectedPath, navigate]);

  const handleSubmit = () => {
    if (!answer.trim()) return;

    setIsTransitioning(true);
    addRiddleAnswer(answer.trim().toLowerCase());

    setTimeout(() => {
      if (currentRiddle < riddles.length - 1) {
        setCurrentRiddle(currentRiddle + 1);
        setAnswer("");
        setIsTransitioning(false);
      } else {
        calculateResults();
        navigate("/results");
      }
    }, 300);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && answer.trim()) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col px-4 py-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-primary rounded-full animate-pulse-slow"
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
        <div className="mb-8 text-center">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Round 3: The Trial of Insight
          </h1>
          <div className="w-32 h-px mx-auto bg-gradient-to-r from-transparent via-primary to-transparent mb-4" />
          
          {/* Rules */}
          <div className="bg-card/50 rounded-lg border border-border p-4 mb-6 inline-block">
            <ul className="font-body text-sm text-muted-foreground space-y-1 text-left">
              <li>• 14 riddles to test your wisdom</li>
              <li>• One-word answers only</li>
              <li>• Case-insensitive</li>
              <li>• Answers will be evaluated after completion</li>
            </ul>
          </div>

          <ProgressBar
            current={currentRiddle + 1}
            total={riddles.length}
            label={`Riddle ${currentRiddle + 1} of ${riddles.length}`}
            path={path}
          />
        </div>

        {/* Riddle */}
        <div
          className={cn(
            "flex-1 flex flex-col transition-opacity duration-300",
            isTransitioning ? "opacity-0" : "opacity-100"
          )}
        >
          <div className="bg-card rounded-lg border border-border p-8 mb-6 shadow-card flex-1 flex items-center justify-center">
            <p className="font-body text-xl md:text-2xl text-foreground leading-relaxed text-center italic">
              "{riddle.riddle}"
            </p>
          </div>

          {/* Answer input */}
          <div className="mb-8">
            <label className="block font-display text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Your Answer (one word)
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your answer..."
              className={cn(
                "w-full p-4 rounded-lg border-2 bg-secondary/30",
                "font-body text-lg text-foreground placeholder:text-muted-foreground",
                "focus:outline-none transition-colors",
                path === "ninja" && "border-ninja/30 focus:border-ninja",
                path === "elves" && "border-elves/30 focus:border-elves",
                path === "dwarves" && "border-dwarves/30 focus:border-dwarves"
              )}
            />
          </div>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <GameButton
            variant={path}
            size="lg"
            onClick={handleSubmit}
            disabled={!answer.trim()}
          >
            Submit Answer →
          </GameButton>
        </div>
      </div>
    </div>
  );
};

export default RiddleRound;
