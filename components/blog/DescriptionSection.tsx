// components/game/DescriptionSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DescriptionSectionProps {
  description: string;
}

export function DescriptionSection({ description }: DescriptionSectionProps) {
  return (
    <Card className="rounded-none shadow-sm">
      <CardContent>
        <div
          className="prose prose-sm max-w-none dark:prose-invert
            prose-p:leading-loose prose-p:mb-4
            prose-headings:font-bold prose-headings:mt-6 prose-headings:mb-3
          "
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </CardContent>
    </Card>
  );
}