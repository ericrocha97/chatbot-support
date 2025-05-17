import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { CONTACT_INFO } from '@/constants/content'

export function ContactSection() {
  return (
    <Card className="shadow-md border border-border/60">
      <CardHeader className="text-xl font-bold pb-2">Contato</CardHeader>
      <CardContent className="text-muted-foreground pt-0">
        <div className="mb-1">Fale conosco:</div>
        <ul className="pl-4 space-y-1">
          <li>
            <span className="font-medium">📱 WhatsApp:</span>{' '}
            {CONTACT_INFO.whatsapp}
          </li>
          <li>
            <span className="font-medium">📧 Email:</span> {CONTACT_INFO.email}
          </li>
        </ul>
      </CardContent>
    </Card>
  )
}
