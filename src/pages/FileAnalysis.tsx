import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2, Download, Activity, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { StatCard } from "@/components/dashboard/StatCard";
import { DataCoverageGauge } from "@/components/dashboard/DataCoverageGauge";

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

const FileAnalysis = () => {
  const navigate = useNavigate();
  const { uploadId } = useParams<{ uploadId: string }>();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [annualData, setAnnualData] = useState<AnnualData[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [extractedAt, setExtractedAt] = useState<string>("");

  useEffect(() => {
    if (uploadId) {
      fetchFileAnalysis();
    }
  }, [uploadId]);

  const fetchFileAnalysis = async () => {
    try {
      setIsLoading(true);
      const response = await api.getExtraction(uploadId!);

      if (response.success && response.data) {
        setMonthlyData(response.data.monthlyData);
        setAnnualData(response.data.annualData);
        setExtractedAt(response.data.extractedAt);

        // Fetch upload info to get file name
        const uploadsResponse = await api.getUploads(100);
        const upload = uploadsResponse.uploads.find((u: any) => u.id === uploadId);
        if (upload) {
          setFileName(upload.fileName);
        }
      } else {
        toast({
          title: "No data found",
          description: response.message || "This file hasn't been processed yet.",
          variant: "destructive",
        });
        navigate("/upload");
      }
    } catch (error: any) {
      console.error('Error fetching file analysis:', error);
      toast({
        title: "Error",
        description: "Failed to load analysis data",
        variant: "destructive",
      });
      navigate("/upload");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (type: 'monthly' | 'annual') => {
    try {
      await api.exportExtraction(uploadId!, type);
      toast({
        title: "Export successful",
        description: `${type} data has been downloaded.`,
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Calculate totals
  const totalCO2 = annualData.reduce((sum, d) => sum + d.co2_kg, 0);
  const totalPlastic = annualData.reduce((sum, d) => sum + d.plastic_lbs, 0);
  const totalWater = annualData.reduce((sum, d) => sum + d.water_gal, 0);
  const totalEnergy = annualData.reduce((sum, d) => sum + d.energy_kwh, 0);
  const dataCoverage = monthlyData.length > 0 ? 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/upload")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Upload History
        </Button>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading analysis...</span>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2">File Analysis Dashboard</h1>
              <p className="text-lg text-muted-foreground">{fileName}</p>
              <p className="text-sm text-muted-foreground">
                Analyzed on {new Date(extractedAt).toLocaleString()}
              </p>
            </div>

            {/* Summary Stats */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
              <StatCard
                title="Total CO₂ Emissions"
                value={`${(totalCO2 / 1000).toFixed(1)}`}
                subtitle={`${totalCO2.toLocaleString()} kg CO₂`}
                icon={Activity}
                variant="default"
              />
              <StatCard
                title="Total Plastic Waste"
                value={`${totalPlastic.toLocaleString()}`}
                subtitle="lbs plastic"
                icon={Activity}
                variant="default"
              />
              <StatCard
                title="Total Water Usage"
                value={`${totalWater.toLocaleString()}`}
                subtitle="gallons water"
                icon={Database}
                variant="default"
              />
              <StatCard
                title="Total Energy"
                value={`${totalEnergy.toLocaleString()}`}
                subtitle="kWh energy"
                icon={Activity}
                variant="default"
              />
            </div>

            {/* Data Coverage and Export */}
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              <DataCoverageGauge
                percentage={dataCoverage}
                filledFields={4}
                totalFields={4}
              />

              <Card>
                <CardHeader>
                  <CardTitle>Export Data</CardTitle>
                  <CardDescription>Download sustainability metrics as CSV</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => handleExport('monthly')}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Monthly Data (CSV)
                  </Button>
                  <Button
                    onClick={() => handleExport('annual')}
                    variant="outline"
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Annual Data (CSV)
                  </Button>
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground">
                      Monthly Records: <span className="font-medium">{monthlyData.length}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Years Covered: <span className="font-medium">{[...new Set(annualData.map(d => d.year))].join(', ')}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Annual and Monthly Data */}
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Annual Totals</CardTitle>
                  <CardDescription>Total emissions by year</CardDescription>
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
                  <CardTitle>Monthly Data Preview</CardTitle>
                  <CardDescription>{monthlyData.length} monthly records</CardDescription>
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
                        {monthlyData.map((month, index) => (
                          <tr key={index} className="border-b last:border-b-0">
                            <td className="py-2">{month.month_label} {month.year}</td>
                            <td className="text-right">{month.co2_kg.toLocaleString()}</td>
                            <td className="text-right">{month.energy_kwh.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Complete Monthly Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Complete Monthly Breakdown</CardTitle>
                <CardDescription>All environmental metrics by month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr className="text-left">
                        <th className="pb-2 pr-4">Period</th>
                        <th className="pb-2 pr-4 text-right">CO₂ (kg)</th>
                        <th className="pb-2 pr-4 text-right">Plastic (lbs)</th>
                        <th className="pb-2 pr-4 text-right">Water (gal)</th>
                        <th className="pb-2 text-right">Energy (kWh)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthlyData.map((month, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="py-3 pr-4">{month.month_label} {month.year}</td>
                          <td className="pr-4 text-right">{month.co2_kg.toLocaleString()}</td>
                          <td className="pr-4 text-right">{month.plastic_lbs.toLocaleString()}</td>
                          <td className="pr-4 text-right">{month.water_gal.toLocaleString()}</td>
                          <td className="text-right">{month.energy_kwh.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default FileAnalysis;
