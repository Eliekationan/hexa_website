"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/icons/Logo";
import { MenuIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { useScrollSpy } from "@/components/layout/useScrollSpy";

const navItems = siteConfig.nav.filter((item) => item.href !== siteConfig.cta.href);
const sectionIds = navItems
  .filter((item) => item.href.startsWith("#"))
  .map((item) => item.href.slice(1));

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const activeSection = useScrollSpy(sectionIds);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const activeHref =
    pathname === "/contact" ? "/contact" : activeSection ? `#${activeSection}` : null;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-all duration-300",
          scrolled
            ? "bg-background/70 border-border border-b backdrop-blur-md"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-6">
          <Link href="/" aria-label="HEXA — accueil">
            <Logo />
          </Link>

          <nav
            aria-label="Navigation principale"
            className="hidden items-center gap-8 lg:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={activeHref === item.href ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors",
                  activeHref === item.href
                    ? "text-accent"
                    : "text-foreground/80 hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button href={siteConfig.cta.href} size="sm">
              {siteConfig.cta.label}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="text-foreground flex h-11 w-11 items-center justify-center rounded-full lg:hidden"
          >
            <MenuIcon />
          </button>
        </div>
      </header>

      <div id="mobile-menu">
        <MobileMenu
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          navItems={navItems}
          activeHref={activeHref}
          ctaLabel={siteConfig.cta.label}
          ctaHref={siteConfig.cta.href}
        />
      </div>
    </>
  );
}
