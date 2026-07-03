import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg
        viewBox="0 0 32 32"
        width={32}
        height={32}
        aria-hidden="true"
        className="shrink-0"
      >
        <defs>
          <linearGradient id="hexa-logo-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>
        <path
          d="M16 1.5 29.4 9v14L16 30.5 2.6 23V9Z"
          fill="none"
          stroke="url(#hexa-logo-gradient)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M16 9 22 12.5v7L16 23l-6-3.5v-7Z"
          fill="url(#hexa-logo-gradient)"
          opacity="0.9"
        />
      </svg>
      {!iconOnly && (
        <span className="text-foreground text-lg font-semibold tracking-tight">HEXA</span>
      )}
    </span>
  );
}
