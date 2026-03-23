import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TESTIMONIALS } from "@/constants/content";

export function TestimonialsSection() {
  return (
    <Card className="border border-border/60 shadow-md">
      <CardHeader className="pb-2 font-bold text-xl">Depoimentos</CardHeader>
      <CardContent className="pt-0 text-muted-foreground">
        {TESTIMONIALS.map((testimonial) => (
          <div key={testimonial.id}>
            <blockquote className="border-chart-5 border-l-4 pl-4 text-sm italic">
              "{testimonial.text}"
            </blockquote>
            <div className="mt-2 text-right text-muted-foreground text-xs not-italic">
              – {testimonial.author}, {testimonial.role}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
