import { useNavigate } from "react-router-dom";
import { PathCard } from "@/components/ui/path-card";
import { useGame, PathType } from "@/contexts/GameContext";

const PathSelection = () => {
  const navigate = useNavigate();
  const { setSelectedPath } = useGame();

  const handlePathSelect = (path: PathType) => {
    setSelectedPath(path);
    navigate("/round-1");
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-pulse-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Which path do you want to start SimCity with?
          </h1>
          <div className="w-32 h-px mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>

        {/* Path cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div className="animate-fade-in-delay-1">
            <PathCard
              path="ninja"
              title="Ninja"
              subtitle="Stealth, control, sacrifice"
              icon="🥷"
              onClick={() => handlePathSelect("ninja")}
            />
          </div>
          <div className="animate-fade-in-delay-2">
            <PathCard
              path="elves"
              title="Elves"
              subtitle="Balance, nature, long-term growth"
              icon="🧝"
              onClick={() => handlePathSelect("elves")}
            />
          </div>
          <div className="animate-fade-in-delay-3">
            <PathCard
              path="dwarves"
              title="Dwarves"
              subtitle="Industry, infrastructure, resilience"
              icon="⛏️"
              onClick={() => handlePathSelect("dwarves")}
            />
          </div>
        </div>

        {/* Bottom hint */}
        <p className="text-center text-muted-foreground mt-12 font-body italic animate-fade-in-delay-3">
          Choose wisely — your path determines your destiny
        </p>
      </div>
    </div>
  );
};

export default PathSelection;
