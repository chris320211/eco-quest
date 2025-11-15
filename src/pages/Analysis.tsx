import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  ArrowLeft,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface MonthlyData {
  year: number;
  month: number;
  month_label: string;
  co2_kg: number;
  plastic_lbs: number;
  water_gal: number;
  energy_kwh: number;
}

interface AnnualData {
  year: number;
  co2_kg: number;
  plastic_lbs: number;
  water_gal: number;
  energy_kwh: number;
}

const Analysis = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState(searchParams.get("period") || "FY2024");
  const [isRerunning, setIsRerunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [annualData, setAnnualData] = useState<AnnualData[]>([]);

  useEffect(() => {
    fetchExtractedData();
  }, []);

  const fetchExtractedData = async () => {
    try {
      setIsLoading(true);
      const response = await api.getExtractions(100);

      if (response.success && response.extractions && response.extractions.length > 0) {
        const allMonthlyData: MonthlyData[] = [];
        const allAnnualData: AnnualData[] = [];

        for (const extraction of response.extractions) {
          try {
            const detailResponse = await api.getExtraction(extraction.uploadId._id || extraction.uploadId);
            if (detailResponse.success && detailResponse.data) {
              allMonthlyData.push(...detailResponse.data.monthlyData);
              allAnnualData.push(...detailResponse.data.annualData);
            }
          } catch (err) {
            console.error('Error fetching extraction details:', err);
          }
        }

        setMonthlyData(allMonthlyData);
        setAnnualData(allAnnualData);
      }
    } catch (error: any) {
      console.error('Error fetching extracted data:', error);
      toast({
        title: "Error",
        description: "Failed to load extracted data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRerun = () => {
    setIsRerunning(true);
    fetchExtractedData().finally(() => {
      setIsRerunning(false);
      toast({
        title: "Analysis refreshed!",
        description: "Your data has been reloaded.",
      });
    });
  };

  // Calculate totals from real data
  const totalCO2 = annualData.reduce((sum, d) => sum + d.co2_kg, 0);
  const totalPlastic = annualData.reduce((sum, d) => sum + d.plastic_lbs, 0);
  const totalWater = annualData.reduce((sum, d) => sum + d.water_gal, 0);
  const totalEnergy = annualData.reduce((sum, d) => sum + d.energy_kwh, 0);
  const dataCoverage = monthlyData.length > 0 ? 100 : 0;
  const filledFields = monthlyData.length > 0 ? 4 : 0;
  const totalFields = 4;

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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading analysis data...</span>
          </div>
        ) : monthlyData.length > 0 ? (
          <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <StatCard
                title="Total CO₂ Emissions"
                value={`${(totalCO2 / 1000).toFixed(1)}`}
                subtitle={`${totalCO2.toLocaleString()} kg CO₂`}
                icon={Activity}
                variant="default"
              />
              <StatCard
                title="Data Coverage"
                value={`${dataCoverage}%`}
                subtitle={`${filledFields} of ${totalFields} metrics tracked`}
                icon={Database}
                variant={dataCoverage === 100 ? "success" : "warning"}
              />
              <StatCard
                title="Total Plastic Waste"
                value={`${totalPlastic.toLocaleString()}`}
                subtitle="lbs plastic"
                icon={Activity}
                variant="default"
              />
              <StatCard
                title="Monthly Records"
                value={`${monthlyData.length}`}
                subtitle={`Covering ${annualData.length} year(s)`}
                icon={FileCheck}
                variant="success"
              />
            </div>
          </>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-muted/20">
            <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Data Available</h3>
            <p className="text-muted-foreground mb-4">Upload sustainability documents to see your analysis</p>
            <Button onClick={() => navigate("/upload")}>
              Upload Documents
            </Button>
          </div>
        )}

        {/* Charts Grid */}
        {monthlyData.length > 0 && (
          <div className="space-y-6">
            {/* Data Summary Cards */}
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Annual Totals</CardTitle>
                  <CardDescription>Total emissions and resource consumption by year</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {annualData.map((annual, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0">
                        <h4 className="font-semibold mb-2">Year {annual.year}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>CO₂: <span className="font-medium">{annual.co2_kg.toLocaleString()} kg</span></div>
                          <div>Plastic: <span className="font-medium">{annual.plastic_lbs.toLocaleString()} lbs</span></div>
                          <div>Water: <span className="font-medium">{annual.water_gal.toLocaleString()} gal</span></div>
                          <div>Energy: <span className="font-medium">{annual.energy_kwh.toLocaleString()} kWh</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Data Records</CardTitle>
                  <CardDescription>{monthlyData.length} months of sustainability data</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="max-h-[300px] overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-card border-b">
                        <tr className="text-left">
                          <th className="pb-2">Period</th>
                          <th className="pb-2 text-right">CO₂ (kg)</th>
                          <th className="pb-2 text-right">Energy (kWh)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyData.slice(0, 12).map((month, index) => (
                          <tr key={index} className="border-b last:border-b-0">
                            <td className="py-2">{month.month_label} {month.year}</td>
                            <td className="text-right">{month.co2_kg.toLocaleString()}</td>
                            <td className="text-right">{month.energy_kwh.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {monthlyData.length > 12 && (
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Showing 12 of {monthlyData.length} records
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Row 2: Coverage & Alignment */}
            <div className="grid gap-6 lg:grid-cols-2">
              <DataCoverageGauge
                percentage={dataCoverage}
                filledFields={filledFields}
                totalFields={totalFields}
              />
              <Card>
                <CardHeader>
                  <CardTitle>Data Sources</CardTitle>
                  <CardDescription>Extracted from uploaded documents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Monthly Records:</span>
                      <span className="font-medium">{monthlyData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Annual Summaries:</span>
                      <span className="font-medium">{annualData.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Years Covered:</span>
                      <span className="font-medium">{[...new Set(annualData.map(d => d.year))].join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Metrics Tracked:</span>
                      <span className="font-medium">CO₂, Plastic, Water, Energy</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analysis;

