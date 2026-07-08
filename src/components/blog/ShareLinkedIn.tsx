import { LinkedInIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

interface ShareLinkedInProps {
  url: string;
  className?: string;
}

export function ShareLinkedIn({ url, className }: ShareLinkedInProps) {
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <a
      href={shareUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "border-border-strong text-foreground/80 hover:border-accent/60 hover:text-accent inline-flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
        className,
      )}
    >
      <LinkedInIcon />
      Partager sur LinkedIn
    </a>
  );
}
