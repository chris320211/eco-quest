import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload as UploadIcon, FileText, X, CheckCircle2, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  file: File;
  status: "uploading" | "processing" | "processed" | "error";
}

const Upload = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
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

  const handleFiles = (newFiles: File[]) => {
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

    const uploadFiles: UploadedFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substring(7),
      file,
      status: "uploading" as const,
    }));

    setFiles((prev) => [...prev, ...uploadFiles]);

    // Simulate upload and processing
    uploadFiles.forEach((uploadFile) => {
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, status: "processing" } : f
          )
        );

        setTimeout(() => {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === uploadFile.id ? { ...f, status: "processed" } : f
            )
          );
        }, 2000);
      }, 1000);
    });
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
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
                        <p className="font-medium">{uploadFile.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(uploadFile.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(uploadFile.status)}
                      <Badge variant={getStatusBadge(uploadFile.status)}>
                        {uploadFile.status.charAt(0).toUpperCase() + uploadFile.status.slice(1)}
                      </Badge>
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
                onClick={() => navigate("/readiness")}
              >
                Continue to Data Readiness
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Upload;

