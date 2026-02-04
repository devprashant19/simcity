import * as React from "react";
import { cn } from "@/lib/utils";
import { PathType } from "@/contexts/GameContext";

interface PathCardProps {
  path: PathType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
  isSelected?: boolean;
}

const pathStyles: Record<PathType, string> = {
  ninja: "path-ninja hover:shadow-ninja border-ninja/30 hover:border-ninja",
  elves: "path-elves hover:shadow-elves border-elves/30 hover:border-elves",
  dwarves: "path-dwarves hover:shadow-dwarves border-dwarves/30 hover:border-dwarves",
};

const pathGradients: Record<PathType, string> = {
  ninja: "from-ninja/20 to-ninja-secondary/10",
  elves: "from-elves/20 to-elves-secondary/10",
  dwarves: "from-dwarves/20 to-dwarves-secondary/10",
};

const PathCard = React.forwardRef<HTMLDivElement, PathCardProps>(
  ({ path, title, subtitle, icon, onClick, isSelected }, ref) => {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={cn(
          "relative cursor-pointer rounded-lg border-2 p-6 transition-all duration-500",
          "bg-gradient-to-br bg-card hover:scale-105",
          "group overflow-hidden",
          pathStyles[path],
          pathGradients[path],
          isSelected && "ring-2 ring-primary scale-105"
        )}
      >
        {/* Glow effect */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
            "bg-gradient-to-br",
            pathGradients[path]
          )}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="mb-4 text-5xl transition-transform duration-300 group-hover:scale-110">
            {icon}
          </div>
          <h3 className="font-display text-2xl font-bold tracking-wide text-foreground mb-2">
            {title}
          </h3>
          <p className="font-body text-sm text-muted-foreground italic">
            {subtitle}
          </p>
        </div>

        {/* Border glow animation */}
        <div
          className={cn(
            "absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            "pointer-events-none"
          )}
          style={{
            boxShadow: `inset 0 0 20px hsl(var(--path-primary) / 0.3)`,
          }}
        />
      </div>
    );
  }
);

PathCard.displayName = "PathCard";

export { PathCard };
