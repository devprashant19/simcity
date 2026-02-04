import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameButton } from "@/components/ui/game-button";
import { useGame } from "@/contexts/GameContext";
import { cn } from "@/lib/utils";

const ResultsScreen = () => {
  const navigate = useNavigate();
  const { gameState } = useGame();
  const [showRank, setShowRank] = useState(false);
  const [showRiddles, setShowRiddles] = useState(false);
  const [showPromotion, setShowPromotion] = useState(false);
  const [showNarrative, setShowNarrative] = useState(false);

  const path = gameState.selectedPath || "ninja";

  // Redirect if no path selected
  useEffect(() => {
    if (!gameState.selectedPath) {
      navigate("/path-selection");
      return;
    }

    // Reveal sequence
    const timers = [
      setTimeout(() => setShowRank(true), 1000),
      setTimeout(() => setShowRiddles(true), 2000),
      setTimeout(() => setShowPromotion(true), 3000),
      setTimeout(() => setShowNarrative(true), 4000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [gameState.selectedPath, navigate]);

  const pathNames = {
    ninja: "Shadow",
    elves: "Mythical",
    dwarves: "Forge",
  };

  const narratives = {
    promoted: {
      ninja: "The shadows bow to your mastery. The realm evolves under your silent command.",
      elves: "Nature itself celebrates your wisdom. The forest grows stronger under your stewardship.",
      dwarves: "The mountains ring with your triumph. Your forges will shape the future of all realms.",
    },
    denied: {
      ninja: "The shadows respect your strength, but not your wisdom. The path remains unconquered.",
      elves: "The ancient trees whisper of potential unfulfilled. Perhaps in another age...",
      dwarves: "The stone remembers your efforts, but the forge awaits a worthier smith.",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(20)].map((_, i) => (
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

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Loading state */}
        {!showRank && (
          <div className="animate-pulse">
            <p className="font-display text-2xl text-muted-foreground">
              Evaluating decisions...
            </p>
          </div>
        )}

        {/* Results card */}
        <div
          className={cn(
            "bg-card rounded-lg border border-border p-8 shadow-card transition-opacity duration-500",
            showRank ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Path info */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-4xl">
              {path === "ninja" && "🥷"}
              {path === "elves" && "🧝"}
              {path === "dwarves" && "⛏️"}
            </span>
            <div>
              <p className="font-display text-sm text-muted-foreground uppercase tracking-wider">
                Path
              </p>
              <p className="font-display text-2xl text-foreground">
                {path.charAt(0).toUpperCase() + path.slice(1)} ({pathNames[path]})
              </p>
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

          {/* Rank */}
          <div
            className={cn(
              "mb-6 transition-all duration-500",
              showRank ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <p className="font-display text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Rank Achieved
            </p>
            <p
              className={cn(
                "font-display text-6xl font-bold",
                gameState.rank === "S" && "text-gradient-gold",
                gameState.rank === "A" && "text-foreground",
                gameState.rank === "B" && "text-muted-foreground"
              )}
            >
              {gameState.rank}
            </p>
          </div>

          {/* Riddles solved */}
          <div
            className={cn(
              "mb-6 transition-all duration-500 delay-100",
              showRiddles ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <p className="font-display text-sm text-muted-foreground uppercase tracking-wider mb-2">
              Riddles Solved
            </p>
            <p className="font-display text-4xl text-foreground">
              {gameState.riddlesSolved}{" "}
              <span className="text-muted-foreground text-2xl">/ 14</span>
            </p>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent mb-6" />

          {/* Promotion status */}
          <div
            className={cn(
              "mb-6 transition-all duration-500 delay-200",
              showPromotion ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {gameState.isPromoted ? (
              <div className="flex items-center justify-center gap-3 text-elves">
                <span className="text-3xl">✅</span>
                <p className="font-display text-2xl">Kingdom Promoted</p>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 text-destructive">
                <span className="text-3xl">❌</span>
                <p className="font-display text-2xl">Promotion Denied</p>
              </div>
            )}
          </div>

          {/* Narrative */}
          <div
            className={cn(
              "transition-all duration-500 delay-300",
              showNarrative ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <p className="font-body text-lg text-muted-foreground italic">
              "{gameState.isPromoted ? narratives.promoted[path] : narratives.denied[path]}"
            </p>
          </div>
        </div>

        {/* End game button */}
        <div
          className={cn(
            "mt-8 transition-all duration-500",
            showNarrative ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          <GameButton
            variant="primary"
            size="lg"
            onClick={() => navigate("/game-end")}
          >
            End Game
          </GameButton>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
