import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TrendingUp, Lightbulb, AlertTriangle } from "lucide-react";

export function InsightsSection() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Emissions Snapshot
          </CardTitle>
          <CardDescription>Key findings from your reported data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            <strong>Primary Source:</strong> Approximately 60% of your reported emissions come from 
            electricity consumption, representing the largest single contributor to your carbon footprint.
          </p>
          <p className="text-sm">
            <strong>Total Reported:</strong> Based on available data, estimated total emissions are 
            1,000 tCO₂e for the reporting period.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-accent" />
            Hotspots & Recommendations
          </CardTitle>
          <CardDescription>Suggested actions for emissions reduction</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-sm font-medium">Top Opportunities:</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>Consider renewable energy sources to reduce electricity-related emissions</li>
              <li>Implement energy efficiency measures in high-consumption areas</li>
              <li>Optimize vehicle fleet usage and explore electric vehicle options</li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Data Improvements:</p>
            <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
              <li>Prioritize collecting waste management data (6 missing fields)</li>
              <li>Complete fuel consumption records (5 missing fields)</li>
              <li>Add refrigerant usage details for more accurate Scope 1 calculations</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Analysis Limitations:</strong> This analysis is based on incomplete data (58% coverage). 
          Results may change significantly when additional information is provided. Key missing data includes 
          complete waste records, detailed fuel consumption, and refrigerant specifications.
        </AlertDescription>
      </Alert>
    </div>
  );
}

