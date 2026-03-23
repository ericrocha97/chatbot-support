import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { COMPANY_INFO } from "@/constants/content";

export function AboutSection() {
  return (
    <Card className="border border-border/60 shadow-md">
      <CardHeader className="pb-2 font-bold text-xl">
        Sobre a ContBill
      </CardHeader>
      <CardContent className="pt-0 text-muted-foreground leading-relaxed">
        {COMPANY_INFO.description} <br />
        {COMPANY_INFO.details}
      </CardContent>
    </Card>
  );
}
