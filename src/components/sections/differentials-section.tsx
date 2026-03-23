import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DIFFERENTIALS } from "@/constants/content";

export function DifferentialsSection() {
  return (
    <Card className="border border-border/60 shadow-md">
      <CardHeader className="pb-2 font-bold text-xl">Diferenciais</CardHeader>
      <CardContent className="pt-0 text-muted-foreground">
        <ul className="list-disc space-y-1 pl-5">
          {DIFFERENTIALS.map((differential) => (
            <li key={differential.id}>{differential.title}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
