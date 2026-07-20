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

const socialLinks = [
  { label: "LinkedIn", href: siteConfig.social.linkedin, Icon: LinkedInIcon },
  { label: "X (Twitter)", href: siteConfig.social.x, Icon: XIcon },
  { label: "GitHub", href: siteConfig.social.github, Icon: GitHubIcon },
];

export function ContactInfo() {
  return (
    <div className="flex flex-col gap-6">
      <div className="border-border bg-surface flex flex-col gap-5 rounded-2xl border p-6">
        <div className="flex items-start gap-3">
          <MapPinIcon className="text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-foreground text-sm font-medium">Adresse</p>
            <p className="text-muted text-sm">{siteConfig.contact.address}</p>
          </div>
        </div>

        <a
          href={`mailto:${siteConfig.contact.email}`}
          className="group flex items-start gap-3"
        >
          <MailIcon className="text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-foreground text-sm font-medium">Email</p>
            <p className="text-muted group-hover:text-accent text-sm transition-colors">
              {siteConfig.contact.email}
            </p>
          </div>
        </a>

        <a
          href={`tel:${siteConfig.contact.phone.replace(/\s+/g, "")}`}
          className="group flex items-start gap-3"
        >
          <PhoneIcon className="text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-foreground text-sm font-medium">Téléphone</p>
            <p className="text-muted group-hover:text-accent text-sm transition-colors">
              {siteConfig.contact.phone}
            </p>
          </div>
        </a>

        <a
          href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-start gap-3"
        >
          <WhatsAppIcon className="text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-foreground text-sm font-medium">WhatsApp</p>
            <p className="text-muted group-hover:text-accent text-sm transition-colors">
              {siteConfig.contact.whatsapp}
            </p>
          </div>
        </a>

        <div className="flex items-start gap-3">
          <ClockIcon className="text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-foreground text-sm font-medium">Horaires</p>
            <p className="text-muted text-sm">{siteConfig.contact.hours}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
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
  );
}
