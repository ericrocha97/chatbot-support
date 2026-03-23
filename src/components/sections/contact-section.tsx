import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CONTACT_INFO } from "@/constants/content";

export function ContactSection() {
  return (
    <Card className="border border-border/60 shadow-md">
      <CardHeader className="pb-2 font-bold text-xl">Contato</CardHeader>
      <CardContent className="pt-0 text-muted-foreground">
        <div className="mb-1">Fale conosco:</div>
        <ul className="space-y-1 pl-4">
          <li>
            <span className="font-medium">📱 WhatsApp:</span>{" "}
            {CONTACT_INFO.whatsapp}
          </li>
          <li>
            <span className="font-medium">📧 Email:</span> {CONTACT_INFO.email}
          </li>
        </ul>
      </CardContent>
    </Card>
  );
}
