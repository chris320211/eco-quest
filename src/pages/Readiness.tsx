import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataCoverageGauge } from "@/components/dashboard/DataCoverageGauge";
import { ArrowLeft, Upload, Play, AlertCircle, Loader2 } from "lucide-react";
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

interface ExtractionData {
  uploadId: {
    _id: string;
    fileName: string;
    fileType: string;
  };
  monthlyData: MonthlyData[];
  annualData: AnnualData[];
  extractedAt: string;
}

const Readiness = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPeriod] = useState("FY2024");
  const [isLoading, setIsLoading] = useState(true);
  const [extractedData, setExtractedData] = useState<MonthlyData[]>([]);
  const [annualData, setAnnualData] = useState<AnnualData[]>([]);

  useEffect(() => {
    fetchExtractedData();
  }, []);

  const fetchExtractedData = async () => {
    try {
      setIsLoading(true);
      const response = await api.getExtractions(100); // Get more extractions

      if (response.success && response.extractions && response.extractions.length > 0) {
        // Fetch detailed data for each extraction
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

        setExtractedData(allMonthlyData);
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

  // Calculate coverage based on actual data
  const totalFields = 4; // CO2, Plastic, Water, Energy
  const filledFields = extractedData.length > 0 ? totalFields : 0;
  const coverage = extractedData.length > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

  const missingFields = extractedData.length === 0 ? [
    { field: "CO₂ Emissions Data", description: "Monthly carbon dioxide emissions in kg", category: "Emissions" },
    { field: "Plastic Waste Data", description: "Monthly plastic waste in pounds", category: "Waste" },
    { field: "Water Usage Data", description: "Monthly water consumption in gallons", category: "Resources" },
    { field: "Energy Usage Data", description: "Monthly energy consumption in kWh", category: "Energy" },
  ] : [];

  const handleRunAnalysis = () => {
    toast({
      title: "Analysis started",
      description: "Your analysis is being generated. This may take a few moments.",
    });
    navigate("/analysis");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Data Readiness & Gaps</h1>
          <p className="text-muted-foreground">
            Data readiness for {selectedPeriod}
          </p>
        </div>

        {/* Data Coverage */}
        <div className="mb-6">
          <DataCoverageGauge
            percentage={coverage}
            filledFields={filledFields}
            totalFields={totalFields}
          />
        </div>

        {/* Missing Critical Fields */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-warning" />
              Missing Critical Fields
            </CardTitle>
            <CardDescription>
              These fields are required for a complete analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {missingFields.map((field, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{field.field}</p>
                    <p className="text-sm text-muted-foreground">{field.description}</p>
                    <Badge variant="outline" className="mt-2">
                      {field.category}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/upload")}
                    >
                      Add Data
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Extracted Data Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Extracted Data Summary</CardTitle>
            <CardDescription>
              {extractedData.length > 0
                ? `${extractedData.length} monthly records extracted from your documents`
                : "No data extracted yet. Upload documents to begin."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading extracted data...</span>
              </div>
            ) : extractedData.length > 0 ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total CO₂</CardDescription>
                      <CardTitle className="text-2xl">
                        {annualData.reduce((sum, d) => sum + d.co2_kg, 0).toLocaleString()} kg
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Plastic</CardDescription>
                      <CardTitle className="text-2xl">
                        {annualData.reduce((sum, d) => sum + d.plastic_lbs, 0).toLocaleString()} lbs
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Water</CardDescription>
                      <CardTitle className="text-2xl">
                        {annualData.reduce((sum, d) => sum + d.water_gal, 0).toLocaleString()} gal
                      </CardTitle>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Total Energy</CardDescription>
                      <CardTitle className="text-2xl">
                        {annualData.reduce((sum, d) => sum + d.energy_kwh, 0).toLocaleString()} kWh
                      </CardTitle>
                    </CardHeader>
                  </Card>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">CO₂ (kg)</TableHead>
                      <TableHead className="text-right">Plastic (lbs)</TableHead>
                      <TableHead className="text-right">Water (gal)</TableHead>
                      <TableHead className="text-right">Energy (kWh)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {extractedData.slice(0, 12).map((data, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {data.month_label} {data.year}
                        </TableCell>
                        <TableCell className="text-right">{data.co2_kg.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{data.plastic_lbs.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{data.water_gal.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{data.energy_kwh.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {extractedData.length > 12 && (
                  <p className="text-sm text-muted-foreground text-center">
                    Showing 12 of {extractedData.length} monthly records
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No extracted data available.</p>
                <p className="text-sm mt-2">Upload sustainability documents to extract environmental metrics.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => navigate("/upload")}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload More Documents
          </Button>
          <Button
            onClick={handleRunAnalysis}
            className="flex-1"
          >
            <Play className="mr-2 h-4 w-4" />
            Run Analysis
          </Button>
        </div>

        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> You can run an analysis even with incomplete data. The analysis will be based on 
            available information and will clearly indicate limitations and missing data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Readiness;

