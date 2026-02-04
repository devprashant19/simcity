import { useNavigate } from "react-router-dom";
import { GameButton } from "@/components/ui/game-button";
import { useGame } from "@/contexts/GameContext";
import { cn } from "@/lib/utils";

const GameEndScreen = () => {
  const navigate = useNavigate();
  const { gameState, resetGame } = useGame();

  const path = gameState.selectedPath || "ninja";

  const handleRestart = () => {
    resetGame();
    navigate("/");
  };

  const kingdomDescriptions = {
    promoted: {
      ninja: "Under your command, the Shadow Kingdom has risen to unprecedented power. Your network of spies spans every corner of the known world, and your enemies tremble at whispered rumors of your reach. The shadows are yours to command.",
      elves: "The Mythical Realm flourishes under your guidance. Ancient forests have expanded, magical creatures thrive, and the balance of nature is stronger than ever. Your legacy will echo through the ages as songs of the forest spirits.",
      dwarves: "The Forge Kingdom stands as a monument to dwarven ingenuity. Your mines run deeper than any before, your forges burn brighter, and your craftwork is sought by kings across all lands. The mountains themselves sing your praises.",
    },
    denied: {
      ninja: "The Shadow Kingdom endures, though it has not risen to its full potential. Your agents remain vigilant, waiting for a leader worthy of their skills. Perhaps another shall complete what you have started.",
      elves: "The Mythical Realm continues its ancient cycles, neither growing nor diminishing. The forest spirits await one who can truly commune with nature's wisdom. Your efforts have not been in vain, but the work remains unfinished.",
      dwarves: "The Forge Kingdom maintains its traditions, though the great expansion you envisioned remains a dream. The mountain halls echo with the work of your successors, building upon the foundation you laid.",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center animate-fade-in">
        {/* Crown icon */}
        <div className="text-7xl mb-6">
          {gameState.isPromoted ? "👑" : "⚔️"}
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
          {gameState.isPromoted ? "The Kingdom Rises" : "The Journey Ends"}
        </h1>

        <div className="w-32 h-px mx-auto bg-gradient-to-r from-transparent via-primary to-transparent mb-8" />

        {/* Kingdom description */}
        <div className="bg-card rounded-lg border border-border p-8 shadow-card mb-8">
          <p className="font-body text-lg text-foreground/90 leading-relaxed">
            {gameState.isPromoted
              ? kingdomDescriptions.promoted[path]
              : kingdomDescriptions.denied[path]}
          </p>
        </div>

        {/* Stats summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-secondary/30 rounded-lg p-4">
            <p className="font-display text-sm text-muted-foreground uppercase tracking-wider">
              Path
            </p>
            <p className={cn(
              "font-display text-xl",
              path === "ninja" && "text-ninja",
              path === "elves" && "text-elves",
              path === "dwarves" && "text-dwarves"
            )}>
              {path.charAt(0).toUpperCase() + path.slice(1)}
            </p>
          </div>
          <div className="bg-secondary/30 rounded-lg p-4">
            <p className="font-display text-sm text-muted-foreground uppercase tracking-wider">
              Rank
            </p>
            <p className="font-display text-xl text-foreground">
              {gameState.rank}
            </p>
          </div>
          <div className="bg-secondary/30 rounded-lg p-4">
            <p className="font-display text-sm text-muted-foreground uppercase tracking-wider">
              Riddles
            </p>
            <p className="font-display text-xl text-foreground">
              {gameState.riddlesSolved}/14
            </p>
          </div>
        </div>

        {/* Thank you message */}
        <p className="font-body text-muted-foreground italic mb-8">
          Thank you for playing SimCity: Rise of Realms
        </p>

        {/* Restart button */}
        <GameButton variant="primary" size="xl" onClick={handleRestart}>
          Restart Game
        </GameButton>
      </div>
    </div>
  );
};

export default GameEndScreen;
