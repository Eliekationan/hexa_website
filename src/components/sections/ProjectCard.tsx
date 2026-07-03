import { Badge } from "@/components/ui/Badge";
import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div
      className="border-border bg-surface group focus:outline-accent flex h-full flex-col overflow-hidden rounded-2xl border"
      tabIndex={0}
    >
      <div
        className="relative h-40 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
        }}
      >
        <svg
          className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 opacity-30 transition-transform duration-300 group-hover:scale-110"
          viewBox="0 0 32 32"
          aria-hidden="true"
        >
          <path
            d="M16 1.5 29.4 9v14L16 30.5 2.6 23V9Z"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>

        <div className="absolute inset-0 flex flex-wrap content-end gap-2 bg-black/50 p-4 opacity-0 transition-opacity duration-300 group-focus-within:opacity-100 group-hover:opacity-100">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-white/40 text-white">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-6">
        <span className="text-accent text-xs font-semibold tracking-wide uppercase">
          {project.category}
        </span>
        <h3 className="text-foreground text-lg font-semibold">{project.title}</h3>
        <p className="text-muted text-sm text-pretty">{project.description}</p>
      </div>
    </div>
  );
}
