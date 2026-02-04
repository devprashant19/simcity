import * as React from "react";
import { cn } from "@/lib/utils";
import { PathType } from "@/contexts/GameContext";

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  path?: PathType;
}

const pathColors: Record<PathType, string> = {
  ninja: "bg-ninja",
  elves: "bg-elves",
  dwarves: "bg-dwarves",
};

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  label,
  path,
}) => {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="font-display text-sm text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          <span className="font-display text-sm text-foreground">
            {current} / {total}
          </span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out",
            path ? pathColors[path] : "bg-primary"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export { ProgressBar };
