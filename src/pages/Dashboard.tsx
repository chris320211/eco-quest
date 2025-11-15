import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Loader2
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [uploadHistory, setUploadHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [dashboard, uploads] = await Promise.all([
          api.getDashboard(),
          api.getUploads(5),
        ]);

        setDashboardData(dashboard.data);
        setUploadHistory(uploads.uploads || []);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const dataCoverage = dashboardData?.dataCoverage || 0;
  const lastAnalysisDate = dashboardData?.lastAnalysisDate
    ? new Date(dashboardData.lastAnalysisDate).toLocaleDateString()
    : null;
  const framework = dashboardData?.framework || "GHG Basic Protocol / VSME Environmental";
  const totalAnalyses = dashboardData?.totalAnalyses || 0;
  const analysisHistory = dashboardData?.analysisHistory || [];

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
              <p className="text-xs text-muted-foreground">
                {dataCoverage > 0 ? "Critical fields filled" : "No data yet"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Analysis</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{lastAnalysisDate || "N/A"}</div>
              <p className="text-xs text-muted-foreground">
                {lastAnalysisDate ? "Most recent run" : "No analyses yet"}
              </p>
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
              <div className="text-2xl font-bold">{totalAnalyses}</div>
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
          {totalAnalyses > 0 && (
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
                        <p className="font-medium">{file.fileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {file.fileType.split('/')[1].toUpperCase()} • {new Date(file.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={file.status === "processed" ? "default" : "secondary"}>
                      {file.status.charAt(0).toUpperCase() + file.status.slice(1)}
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
                analysisHistory.map((analysis: any) => (
                  <div key={analysis.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{analysis.period}</p>
                      <p className="text-sm text-muted-foreground">
                        Run on {new Date(analysis.date).toLocaleDateString()} • {analysis.coverage}% coverage
                      </p>
                      {analysis.summary && (
                        <p className="text-sm text-muted-foreground mt-1">{analysis.summary}</p>
                      )}
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
