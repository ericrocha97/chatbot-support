import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { SERVICES } from '@/constants/content'

export function ServicesSection() {
  return (
    <Card className="shadow-md border border-border/60">
      <CardHeader className="text-xl font-bold pb-2">Serviços</CardHeader>
      <CardContent className="text-muted-foreground pt-0">
        <ul className="list-disc pl-5 space-y-1">
          {SERVICES.map(service => (
            <li key={service.id}>{service.title}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
