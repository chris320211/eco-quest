import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload as UploadIcon, FileText, X, CheckCircle2, Loader2, ArrowLeft, Download, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UploadedFile {
  id: string;
  file?: File;
  fileName: string;
  status: "uploading" | "processing" | "processed" | "error";
  errorMessage?: string;
}

const Upload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFileAnalysis, setSelectedFileAnalysis] = useState<any>(null);
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = async (newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/vnd.ms-powerpoint",
      ];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Some files were skipped",
        description: "Only PDF, images, and PowerPoint files are supported.",
        variant: "destructive",
      });
    }

    if (validFiles.length === 0) return;

    // Add files to state immediately
    const uploadFiles: UploadedFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      fileName: file.name,
      status: "uploading" as const,
    }));

    setFiles((prev) => [...prev, ...uploadFiles]);

    try {
      // Upload files to backend
      const response = await api.uploadFiles(validFiles);

      if (response.success) {
        // Update file IDs and statuses based on backend response
        const uploadedFiles = response.files;

        setFiles((prev) =>
          prev.map((f, index) => {
            const uploadedFile = uploadedFiles[index];
            if (uploadedFile) {
              return {
                ...f,
                id: uploadedFile.id,
                status: uploadedFile.status as any,
              };
            }
            return f;
          })
        );

        // Poll for processing status
        uploadedFiles.forEach((uploadedFile: any) => {
          pollFileStatus(uploadedFile.id);
        });

        toast({
          title: "Files uploaded successfully",
          description: "Your files are being processed with Claude Haiku.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });

      // Mark all uploading files as error
      setFiles((prev) =>
        prev.map((f) =>
          f.status === "uploading"
            ? { ...f, status: "error", errorMessage: error.message }
            : f
        )
      );
    }
  };

  const pollFileStatus = async (uploadId: string) => {
    const maxAttempts = 60; // Poll for up to 2 minutes
    let attempts = 0;

    const poll = async () => {
      try {
        const uploads = await api.getUploads(50);
        const upload = uploads.uploads.find((u: any) => u.id === uploadId);

        if (upload) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadId
                ? { ...f, status: upload.status, errorMessage: upload.errorMessage }
                : f
            )
          );

          if (upload.status === "processing" && attempts < maxAttempts) {
            attempts++;
            setTimeout(poll, 2000); // Poll every 2 seconds
          } else if (upload.status === "processed") {
            toast({
              title: "Analysis complete",
              description: `${upload.fileName} has been analyzed successfully.`,
            });
          }
        }
      } catch (error) {
        console.error("Error polling file status:", error);
      }
    };

    poll();
  };

  const removeFile = async (id: string) => {
    try {
      await api.deleteUpload(id);
      setFiles((prev) => prev.filter((f) => f.id !== id));
      toast({
        title: "File deleted",
        description: "The file has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const viewAnalysis = async (id: string) => {
    try {
      const response = await api.getExtraction(id);
      if (response.success && response.data) {
        setSelectedFileAnalysis(response.data);
        setShowAnalysisDialog(true);
      } else {
        toast({
          title: "Analysis not ready",
          description: response.message || "The file is still being processed.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to load analysis",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleExport = async (uploadId: string, type: 'monthly' | 'annual') => {
    try {
      await api.exportExtraction(uploadId, type);
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

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case "processed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "error":
        return <X className="h-4 w-4 text-destructive" />;
    }
  };

  const getStatusBadge = (status: UploadedFile["status"]) => {
    const variants: Record<UploadedFile["status"], "default" | "secondary" | "destructive"> = {
      uploading: "secondary",
      processing: "secondary",
      processed: "default",
      error: "destructive",
    };
    return variants[status];
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

        <Card>
          <CardHeader>
            <CardTitle>Upload Documents</CardTitle>
            <CardDescription>
              Upload PDFs, images, or slides containing emissions/operations data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25"
              }`}
            >
              <UploadIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Supported formats: PDF, JPG, PNG, PowerPoint
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.pptx,.ppt"
                onChange={handleFileSelect}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                Browse Files
              </Button>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Uploaded Files</h3>
                {files.map((uploadFile) => (
                  <div
                    key={uploadFile.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{uploadFile.fileName}</p>
                        {uploadFile.file && (
                          <p className="text-sm text-muted-foreground">
                            {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                        {uploadFile.errorMessage && (
                          <p className="text-sm text-destructive">
                            {uploadFile.errorMessage}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(uploadFile.status)}
                      <Badge variant={getStatusBadge(uploadFile.status)}>
                        {uploadFile.status.charAt(0).toUpperCase() + uploadFile.status.slice(1)}
                      </Badge>
                      {uploadFile.status === "processed" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewAnalysis(uploadFile.id)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExport(uploadFile.id, 'monthly')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            CSV
                          </Button>
                        </>
                      )}
                      {uploadFile.status !== "uploading" && uploadFile.status !== "processing" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(uploadFile.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {files.length > 0 && files.every((f) => f.status === "processed") && (
              <Button
                className="w-full"
                onClick={() => navigate("/analysis")}
              >
                View Analytics Dashboard
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analysis Dialog */}
      <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sustainability Analysis Report</DialogTitle>
            <DialogDescription>
              Claude Haiku analysis results from your uploaded document
            </DialogDescription>
          </DialogHeader>
          {selectedFileAnalysis && (
            <div className="space-y-6">
              {/* Analysis Report */}
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{
                  __html: selectedFileAnalysis.analysisReport.replace(/\n/g, '<br/>').replace(/##/g, '<h3>').replace(/<h3>/g, '</p><h3>').replace(/<\/h3>/g, '</h3><p>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                }} />
              </div>

              {/* Data Summary */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Monthly Records</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{selectedFileAnalysis.monthlyData.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Years Covered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">
                      {[...new Set(selectedFileAnalysis.annualData.map((d: any) => d.year))].join(', ')}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Export Options */}
              <div className="flex gap-2">
                <Button
                  onClick={() => handleExport(selectedFileAnalysis.uploadId, 'monthly')}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Monthly Data (CSV)
                </Button>
                <Button
                  onClick={() => handleExport(selectedFileAnalysis.uploadId, 'annual')}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Annual Data (CSV)
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Upload;

