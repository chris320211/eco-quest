import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "@/components/dashboard/StatCard";
import { EmissionsBreakdownChart } from "@/components/dashboard/EmissionsBreakdownChart";
import { EmissionsByCategoryChart } from "@/components/dashboard/EmissionsByCategoryChart";
import { DataCoverageGauge } from "@/components/dashboard/DataCoverageGauge";
import { GuidelineAlignmentCard } from "@/components/dashboard/GuidelineAlignmentCard";
import { MissingDataChart } from "@/components/dashboard/MissingDataChart";
import { InsightsSection } from "@/components/dashboard/InsightsSection";
import { 
  Activity, 
  Database, 
  FileCheck, 
  RefreshCw,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Analysis = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState(searchParams.get("period") || "FY2024");
  const [isRerunning, setIsRerunning] = useState(false);

  const handleRerun = () => {
    setIsRerunning(true);
    toast({
      title: "Re-running analysis",
      description: "This may take a few moments...",
    });
    
    // Simulate analysis
    setTimeout(() => {
      setIsRerunning(false);
      toast({
        title: "Analysis complete!",
        description: "Your analysis has been updated.",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">ESG Analysis Dashboard</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FY2024">FY2024</SelectItem>
                      <SelectItem value="FY2023">FY2023</SelectItem>
                      <SelectItem value="FY2022">FY2022</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Emissions Analysis</p>
                </div>
              </div>
            </div>
            <Button onClick={handleRerun} disabled={isRerunning}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRerunning ? "animate-spin" : ""}`} />
              {isRerunning ? "Re-running..." : "Re-run Analysis"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatCard
            title="Total Emissions"
            value="1,000"
            subtitle="tCO₂e (partial data)"
            icon={Activity}
            variant="default"
          />
          <StatCard
            title="Data Coverage"
            value="58%"
            subtitle="7 of 12 critical fields"
            icon={Database}
            variant="warning"
          />
          <StatCard
            title="Top Source"
            value="Electricity"
            subtitle="60% of emissions"
            icon={Activity}
            variant="default"
          />
          <StatCard
            title="Framework Alignment"
            value="75%"
            subtitle="GHG Basic Protocol"
            icon={FileCheck}
            variant="success"
          />
        </div>

        {/* Charts Grid */}
        <div className="space-y-6">
          {/* Row 1: Main Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <EmissionsBreakdownChart />
            <EmissionsByCategoryChart />
          </div>

          {/* Row 2: Coverage & Alignment */}
          <div className="grid gap-6 lg:grid-cols-2">
            <DataCoverageGauge 
              percentage={58} 
              filledFields={7} 
              totalFields={12} 
            />
            <GuidelineAlignmentCard />
          </div>

          {/* Row 3: Missing Data */}
          <MissingDataChart />

          {/* Insights Section */}
          <InsightsSection />
        </div>
      </main>
    </div>
  );
};

export default Analysis;

