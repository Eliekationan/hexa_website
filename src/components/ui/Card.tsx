import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ className, hoverable = false, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "border-border bg-surface rounded-2xl border p-6",
        hoverable &&
          "hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-glow-accent)]",
        className,
      )}
      {...props}
    />
  );
}
