import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  BarChart3, 
  Database,
  Calendar,
  TrendingUp,
  Plus
} from "lucide-react";

const Dashboard = () => {
  // Mock data - replace with actual data from API
  const dataCoverage = 58;
  const lastAnalysisDate = "2024-11-10";
  const framework = "GHG Basic Protocol / VSME Environmental";

  const uploadHistory = [
    { id: 1, name: "energy-bill-2024.pdf", type: "PDF", date: "2024-11-10", status: "Processed" },
    { id: 2, name: "fuel-receipts.jpg", type: "Image", date: "2024-11-09", status: "Processed" },
    { id: 3, name: "operations-slides.pptx", type: "Presentation", date: "2024-11-08", status: "Processing" },
  ];

  const analysisHistory = [
    { id: 1, period: "FY2024", date: "2024-11-10", coverage: 58, summary: "Partial data - electricity dominant" },
    { id: 2, period: "FY2023", date: "2024-10-15", coverage: 45, summary: "Initial baseline assessment" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
        </div>

        {/* Summary Tiles */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Coverage</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dataCoverage}%</div>
              <p className="text-xs text-muted-foreground">Critical fields filled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Analysis</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lastAnalysisDate}</div>
              <p className="text-xs text-muted-foreground">Most recent run</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Framework</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium truncate">{framework}</div>
              <p className="text-xs text-muted-foreground">Active schema</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analyses</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analysisHistory.length}</div>
              <p className="text-xs text-muted-foreground">Total completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Primary Actions */}
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Link to="/upload">
            <Button className="w-full h-24" size="lg">
              <Upload className="mr-2 h-5 w-5" />
              Upload New Documents
            </Button>
          </Link>
          {analysisHistory.length > 0 && (
            <Link to="/analysis">
              <Button className="w-full h-24" size="lg" variant="outline">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Latest Analysis
              </Button>
            </Link>
          )}
        </div>

        {/* Upload History */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload History</CardTitle>
            <CardDescription>Recently uploaded files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadHistory.length > 0 ? (
                uploadHistory.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {file.type} • {file.date}
                        </p>
                      </div>
                    </div>
                    <Badge variant={file.status === "Processed" ? "default" : "secondary"}>
                      {file.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No files uploaded yet. <Link to="/upload" className="text-primary hover:underline">Upload your first document</Link>
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Analysis History */}
        <Card>
          <CardHeader>
            <CardTitle>Analysis History</CardTitle>
            <CardDescription>Past analysis runs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisHistory.length > 0 ? (
                analysisHistory.map((analysis) => (
                  <div key={analysis.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{analysis.period}</p>
                      <p className="text-sm text-muted-foreground">
                        Run on {analysis.date} • {analysis.coverage}% coverage
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">{analysis.summary}</p>
                    </div>
                    <Link to={`/analysis?period=${analysis.period}`}>
                      <Button variant="outline" size="sm">
                        View Analysis
                      </Button>
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No analyses yet. Upload documents and run your first analysis.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

