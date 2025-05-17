import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { TESTIMONIALS } from '@/constants/content'

export function TestimonialsSection() {
  return (
    <Card className="shadow-md border border-border/60">
      <CardHeader className="text-xl font-bold pb-2">Depoimentos</CardHeader>
      <CardContent className="text-muted-foreground pt-0">
        {TESTIMONIALS.map(testimonial => (
          <div key={testimonial.id}>
            <blockquote className="italic border-l-4 border-chart-5 pl-4 text-sm">
              "{testimonial.text}"
            </blockquote>
            <div className="mt-2 text-xs not-italic text-right text-muted-foreground">
              – {testimonial.author}, {testimonial.role}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
