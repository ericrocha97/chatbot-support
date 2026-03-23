import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SERVICES } from "@/constants/content";

export function ServicesSection() {
  return (
    <Card className="border border-border/60 shadow-md">
      <CardHeader className="pb-2 font-bold text-xl">Serviços</CardHeader>
      <CardContent className="pt-0 text-muted-foreground">
        <ul className="list-disc space-y-1 pl-5">
          {SERVICES.map((service) => (
            <li key={service.id}>{service.title}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
