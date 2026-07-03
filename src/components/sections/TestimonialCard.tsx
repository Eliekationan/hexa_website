import { TestimonialAvatar } from "@/components/sections/TestimonialAvatar";
import type { Testimonial } from "@/data/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="border-border bg-surface flex h-full flex-col gap-4 rounded-2xl border p-6">
      <p className="text-foreground text-pretty">« {testimonial.quote} »</p>
      <div className="mt-auto flex items-center gap-3 pt-2">
        <TestimonialAvatar name={testimonial.name} initials={testimonial.initials} />
        <div>
          <p className="text-foreground text-sm font-semibold">{testimonial.name}</p>
          <p className="text-muted text-xs">
            {testimonial.role} — {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
}
