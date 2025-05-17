import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { COMPANY_INFO } from '@/constants/content'

export function AboutSection() {
  return (
    <Card className="shadow-md border border-border/60">
      <CardHeader className="text-xl font-bold pb-2">
        Sobre a ContBill
      </CardHeader>
      <CardContent className="text-muted-foreground leading-relaxed pt-0">
        {COMPANY_INFO.description} <br />
        {COMPANY_INFO.details}
      </CardContent>
    </Card>
  )
}
