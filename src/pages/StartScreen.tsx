import { useNavigate } from "react-router-dom";
import { GameButton } from "@/components/ui/game-button";

const StartScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-pulse-slow"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/80 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 text-center animate-fade-in">
        {/* Crown icon */}
        <div className="text-6xl mb-6 animate-float">👑</div>

        {/* Title */}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider mb-4">
          <span className="text-gradient-gold">SIMCITY</span>
        </h1>
        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground/90 tracking-widest mb-8">
          RISE OF REALMS
        </h2>

        {/* Decorative line */}
        <div className="w-48 h-px mx-auto bg-gradient-to-r from-transparent via-primary to-transparent mb-8" />

        {/* Subtitle */}
        <p className="font-body text-lg md:text-xl text-muted-foreground italic mb-12 max-w-md mx-auto">
          "Your decisions shape the kingdom."
        </p>

        {/* Start button */}
        <GameButton
          variant="primary"
          size="xl"
          onClick={() => navigate("/path-selection")}
          className="animate-fade-in-delay-2"
        >
          Start Game
        </GameButton>
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 opacity-30">
        <span className="text-2xl">⚔️</span>
        <span className="text-2xl">🏰</span>
        <span className="text-2xl">🛡️</span>
      </div>
    </div>
  );
};

export default StartScreen;
