"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CloseIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  navItems: readonly NavItem[];
  activeHref: string | null;
  ctaLabel: string;
  ctaHref: string;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

export function MobileMenu({
  open,
  onClose,
  navItems,
  activeHref,
  ctaLabel,
  ctaHref,
}: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    triggerFocusRef.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerFocusRef.current?.focus();
    };
  }, [open, onClose]);

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navigation"
      className={cn(
        "bg-background/98 fixed inset-0 z-50 flex flex-col backdrop-blur-md transition-opacity duration-300 lg:hidden",
        open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <div className="flex items-center justify-between px-6 pt-6">
        <ThemeToggle />
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Fermer le menu"
          className="text-foreground hover:text-accent flex h-11 w-11 items-center justify-center rounded-full transition-colors"
        >
          <CloseIcon />
        </button>
      </div>

      <nav
        aria-label="Navigation principale"
        className="flex flex-1 flex-col items-center justify-center gap-6"
      >
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            aria-current={activeHref === item.href ? "page" : undefined}
            className={cn(
              "text-2xl font-semibold transition-colors",
              activeHref === item.href
                ? "text-accent"
                : "text-foreground hover:text-accent",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="px-6 pb-10">
        <Button href={ctaHref} onClick={onClose} className="w-full">
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}
