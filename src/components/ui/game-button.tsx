import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const gameButtonVariants = cva(
  "relative inline-flex items-center justify-center font-display text-lg tracking-wider uppercase transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 overflow-hidden group",
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-r from-primary to-accent text-primary-foreground",
          "border-2 border-primary/50",
          "shadow-[0_0_20px_hsl(var(--primary)/0.3)]",
          "hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]",
          "hover:scale-105",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent",
          "before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
        ],
        secondary: [
          "bg-secondary/50 text-foreground",
          "border border-border",
          "hover:bg-secondary hover:border-primary/50",
          "hover:shadow-[0_0_15px_hsl(var(--primary)/0.2)]",
        ],
        ghost: [
          "bg-transparent text-muted-foreground",
          "hover:text-foreground hover:bg-secondary/30",
        ],
        ninja: [
          "bg-gradient-to-r from-ninja to-ninja-secondary text-foreground",
          "border-2 border-ninja/50",
          "shadow-[0_0_20px_hsl(var(--ninja-primary)/0.3)]",
          "hover:shadow-[0_0_30px_hsl(var(--ninja-primary)/0.5)]",
          "hover:scale-105",
        ],
        elves: [
          "bg-gradient-to-r from-elves to-elves-secondary text-foreground",
          "border-2 border-elves/50",
          "shadow-[0_0_20px_hsl(var(--elves-primary)/0.3)]",
          "hover:shadow-[0_0_30px_hsl(var(--elves-primary)/0.5)]",
          "hover:scale-105",
        ],
        dwarves: [
          "bg-gradient-to-r from-dwarves to-dwarves-secondary text-foreground",
          "border-2 border-dwarves/50",
          "shadow-[0_0_20px_hsl(var(--dwarves-primary)/0.3)]",
          "hover:shadow-[0_0_30px_hsl(var(--dwarves-primary)/0.5)]",
          "hover:scale-105",
        ],
      },
      size: {
        default: "h-12 px-8 py-3",
        sm: "h-10 px-6 py-2 text-sm",
        lg: "h-14 px-10 py-4 text-xl",
        xl: "h-16 px-12 py-5 text-2xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface GameButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gameButtonVariants> {}

const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(gameButtonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
GameButton.displayName = "GameButton";

export { GameButton, gameButtonVariants };
