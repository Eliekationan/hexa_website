import { type ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[var(--shadow-glow-primary)]",
  secondary:
    "bg-surface-2 text-foreground border border-border-strong hover:border-accent/60 hover:text-accent",
  ghost: "bg-transparent text-foreground hover:bg-surface-2",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-base",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

type NativeButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

interface LinkButtonProps extends CommonProps {
  href: string;
  children?: React.ReactNode;
  target?: string;
  rel?: string;
  onClick?: () => void;
  "aria-label"?: string;
}

export type ButtonProps = NativeButtonProps | LinkButtonProps;

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ variant = "primary", size = "md", className, ...props }, ref) {
    const classes = cn(baseStyles, variantStyles[variant], sizeStyles[size], className);

    if ("href" in props && props.href) {
      const { href, children, ...rest } = props;
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...rest}
        >
          {children}
        </Link>
      );
    }

    const { children, ...rest } = props as NativeButtonProps;
    return (
      <button ref={ref as React.Ref<HTMLButtonElement>} className={classes} {...rest}>
        {children}
      </button>
    );
  },
);
