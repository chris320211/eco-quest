import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataCoverageGauge } from "@/components/dashboard/DataCoverageGauge";
import { ArrowLeft, Upload, Play, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Readiness = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPeriod] = useState("FY2024");

  // Mock data - replace with actual data from API
  const coverage = 58;
  const filledFields = 7;
  const totalFields = 12;

  const missingFields = [
    { field: "Vehicle fuel usage 2024", description: "Total fuel consumption for company vehicles", category: "Fuel" },
    { field: "Waste disposal records", description: "Waste management and disposal data", category: "Waste" },
    { field: "Refrigerant specifications", description: "Type and quantity of refrigerants used", category: "Refrigerants" },
    { field: "Natural gas consumption Q4", description: "Fourth quarter natural gas usage", category: "Energy" },
    { field: "Business travel details", description: "Air travel and accommodation emissions", category: "Travel" },
  ];

  const extractedData = [
    { field: "Electricity consumption 2024", value: "125,000", unit: "kWh", source: "energy-bill-2024.pdf (p. 2)" },
    { field: "Natural gas Q1-Q3", value: "45,000", unit: "therms", source: "energy-bill-2024.pdf (p. 3)" },
    { field: "Company vehicle count", value: "12", unit: "vehicles", source: "operations-slides.pptx (slide 5)" },
    { field: "Office square footage", value: "5,000", unit: "sq ft", source: "operations-slides.pptx (slide 2)" },
    { field: "Employee count", value: "45", unit: "employees", source: "operations-slides.pptx (slide 1)" },
    { field: "Diesel fuel Q1-Q3", value: "8,500", unit: "gallons", source: "fuel-receipts.jpg" },
    { field: "Paper consumption", value: "2,500", unit: "reams", source: "operations-slides.pptx (slide 8)" },
  ];

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
              Key fields that have been extracted from your documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field Name</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {extractedData.map((data, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{data.field}</TableCell>
                    <TableCell>{data.value}</TableCell>
                    <TableCell>{data.unit}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {data.source}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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

