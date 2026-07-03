import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { Service, ServiceIcon } from "@/data/services";
import {
  EngineeringIcon,
  ConsultingIcon,
  WebIcon,
  MobileIcon,
  AgenticIcon,
  type IconProps,
} from "@/components/icons";
import { AgentAnimation } from "@/components/sections/AgentAnimation";

const iconMap: Record<ServiceIcon, (props: IconProps) => React.ReactElement> = {
  engineering: EngineeringIcon,
  consulting: ConsultingIcon,
  web: WebIcon,
  mobile: MobileIcon,
  agentic: AgenticIcon,
};

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = iconMap[service.icon];

  const cardContent = (
    <div
      className={cn(
        "group relative flex h-full flex-col gap-4 rounded-2xl p-6 transition-all duration-300",
        "bg-surface hover:-translate-y-1 hover:shadow-[var(--shadow-glow-accent)]",
        !service.featured && "border-border hover:border-accent/50 border",
      )}
    >
      {service.featured && (
        <span className="bg-accent/10 text-accent border-accent/30 absolute -top-3 right-6 rounded-full border px-3 py-1 text-xs font-semibold">
          Service phare
        </span>
      )}

      <div className="bg-surface-2 text-accent flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        <Icon width={24} height={24} />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-foreground text-xl font-semibold">{service.title}</h3>
        <p className="text-muted text-sm text-pretty">{service.description}</p>
      </div>

      <div className="mt-auto flex flex-wrap gap-2 pt-2">
        {service.keywords.map((keyword) => (
          <Badge key={keyword}>{keyword}</Badge>
        ))}
      </div>

      {service.featured && (
        <div className="mt-4 h-28 w-full">
          <AgentAnimation />
        </div>
      )}
    </div>
  );

  if (!service.featured) {
    return <div className="h-full">{cardContent}</div>;
  }

  return (
    <div className="animate-hexa-border h-full rounded-2xl p-[1.5px] motion-reduce:animate-none">
      {cardContent}
    </div>
  );
}
