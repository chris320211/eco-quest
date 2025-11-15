import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GuidelineItem {
  name: string;
  percentage: number;
  status: "high" | "partial" | "low";
}

const guidelines: GuidelineItem[] = [
  { name: "Basic GHG Inventory", percentage: 75, status: "high" },
  { name: "VSME Environmental", percentage: 60, status: "partial" },
  { name: "Customer Questionnaires", percentage: 85, status: "high" },
];

export function GuidelineAlignmentCard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "high":
        return "bg-green-600 text-white";
      case "partial":
        return "bg-yellow-600 text-white";
      case "low":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "high":
        return "High Alignment";
      case "partial":
        return "Partial Alignment";
      case "low":
        return "Low Alignment";
      default:
        return "Unknown";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Guideline Alignment</CardTitle>
        <CardDescription>Compliance with reporting frameworks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {guidelines.map((guideline, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="space-y-1 flex-1">
              <p className="text-sm font-medium">{guideline.name}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all",
                      guideline.status === "high" && "bg-green-600",
                      guideline.status === "partial" && "bg-yellow-600",
                      guideline.status === "low" && "bg-destructive"
                    )}
                    style={{ width: `${guideline.percentage}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-12 text-right">
                  {guideline.percentage}%
                </span>
              </div>
            </div>
            <Badge className={cn("ml-4", getStatusColor(guideline.status))}>
              {getStatusLabel(guideline.status)}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

