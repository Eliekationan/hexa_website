import Link from "next/link";
import { Logo } from "@/components/icons/Logo";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  LinkedInIcon,
  XIcon,
  GitHubIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { siteConfig } from "@/lib/site-config";
import { services } from "@/data/services";

const socialLinks = [
  { label: "LinkedIn", href: siteConfig.social.linkedin, Icon: LinkedInIcon },
  { label: "X (Twitter)", href: siteConfig.social.x, Icon: XIcon },
  { label: "GitHub", href: siteConfig.social.github, Icon: GitHubIcon },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border border-t">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="text-muted text-sm text-pretty">{siteConfig.description}</p>
        </div>

        <div>
          <h3 className="text-foreground mb-4 text-sm font-semibold">Navigation</h3>
          <ul className="flex flex-col gap-3">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted hover:text-accent text-sm transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-foreground mb-4 text-sm font-semibold">Services</h3>
          <ul className="flex flex-col gap-3">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href="#services"
                  className="text-muted hover:text-accent text-sm transition-colors"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-foreground mb-4 text-sm font-semibold">Contact</h3>
          <ul className="flex flex-col gap-3">
            <li className="text-muted flex items-start gap-2 text-sm">
              <MapPinIcon className="mt-0.5 shrink-0" />
              <span>{siteConfig.contact.address}</span>
            </li>
            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-muted hover:text-accent flex items-center gap-2 text-sm transition-colors"
              >
                <MailIcon className="shrink-0" />
                {siteConfig.contact.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
                className="text-muted hover:text-accent flex items-center gap-2 text-sm transition-colors"
              >
                <PhoneIcon className="shrink-0" />
                {siteConfig.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-accent flex items-center gap-2 text-sm transition-colors"
              >
                <WhatsAppIcon className="shrink-0" />
                {siteConfig.contact.whatsapp} (WhatsApp)
              </a>
            </li>
            <li className="text-muted flex items-start gap-2 text-sm">
              <ClockIcon className="mt-0.5 shrink-0" />
              <span>{siteConfig.contact.hours}</span>
            </li>
          </ul>

          <div className="mt-5 flex items-center gap-3">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-muted hover:text-accent hover:border-accent/50 border-border flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-border border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm sm:flex-row">
          <p className="text-muted">
            © {year} {siteConfig.legalName}. Tous droits réservés.
          </p>
          <Link
            href="/mentions-legales"
            className="text-muted hover:text-accent transition-colors"
          >
            Mentions légales
          </Link>
        </div>
      </div>
    </footer>
  );
}
