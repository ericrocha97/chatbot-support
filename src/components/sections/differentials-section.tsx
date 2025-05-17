import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DIFFERENTIALS } from '@/constants/content'

export function DifferentialsSection() {
  return (
    <Card className="shadow-md border border-border/60">
      <CardHeader className="text-xl font-bold pb-2">Diferenciais</CardHeader>
      <CardContent className="text-muted-foreground pt-0">
        <ul className="list-disc pl-5 space-y-1">
          {DIFFERENTIALS.map(differential => (
            <li key={differential.id}>{differential.title}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
