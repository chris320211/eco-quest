import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataCoverageGaugeProps {
  percentage: number;
  filledFields: number;
  totalFields: number;
}

export function DataCoverageGauge({ percentage, filledFields, totalFields }: DataCoverageGaugeProps) {
  const isGood = percentage >= 75;
  const isPartial = percentage >= 50 && percentage < 75;
  
  const progressColor = isGood 
    ? "bg-green-600" 
    : isPartial 
    ? "bg-yellow-600" 
    : "bg-destructive";
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Coverage</CardTitle>
        <CardDescription>Critical fields completion status</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isGood ? (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className={cn("h-5 w-5", isPartial ? "text-yellow-600" : "text-destructive")} />
            )}
            <span className="text-3xl font-bold">{percentage}%</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {filledFields} of {totalFields} fields
          </span>
        </div>
        <div className="relative h-3 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={cn("h-full transition-all", progressColor)}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {isGood && "Excellent data coverage for reliable analysis"}
          {isPartial && "Partial data - analysis may have limitations"}
          {!isGood && !isPartial && "Low data coverage - significant gaps present"}
        </p>
      </CardContent>
    </Card>
  );
}

