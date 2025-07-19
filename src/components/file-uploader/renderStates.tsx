import { cn } from "@/lib/utils";
import { CloudAlert, CloudUpload, FileTextIcon, ImageUpIcon, Loader2, Trash2, Upload, UploadIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const FileTypeHints: Record<string, string> = {
  image: "SVG, PNG, JPG or GIF",
  video: "MP4, MOV or AVI",
  pdf: "PDF only",
};

const FileTypeMaxSize: Record<"image" | "video" | "pdf", number> = {
  image: 5,
  pdf: 5,
  video: 500,
};

type Props = {
  isDragActive: boolean;
  fileType?: "image" | "pdf" | "video";
};

// RenderEmptyState component
export default function RenderEmptyState({
  isDragActive,
  fileType = "image",
}: Props) {
  const fileHint = FileTypeHints[fileType] || "all file types";
  const maxSize = FileTypeMaxSize[fileType];

  return (
    <div className="flex flex-col items-center justify-center text-center gap-3">
      <div
        className={cn(
          "flex items-center justify-center size-14 rounded-full bg-accent transition-all",
          isDragActive && "bg-primary/20"
        )}
      >
        <CloudUpload
          className={cn(
            "size-icon transition-transform",
            isDragActive && "animate-bounce text-primary"
          )}
        />
      </div>

      <div>
        <p className="text-base font-medium mb-1.5">
          Drag & drop files here or{" "}
          <span className="text-primary font-semibold">click to upload</span>
        </p>
        <p className="text-muted-foreground text-xs">
          {fileHint} (max. {maxSize}MB)
        </p>
      </div>
    </div>
  );
}

// RenderErrorState component
export function RenderErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3">
      {/* Icon */}
      <div className="flex items-center justify-center size-14 rounded-full bg-destructive/30">
        <CloudAlert className="size-icon text-red-600" />
      </div>

      {/* Error Text */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-600 dark:text-muted-foreground">Upload Failed</h3>
        <p className="text-sm text-red-700">{error}</p>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button
          variant="default"
          className="cursor-pointer font-medium bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 min-w-64"
          onClick={onRetry}
        >
          <Upload className="mr-2 size-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}

// RenderSuccessState component
export function RenderSuccessState({
  previewUrl,
  isDeleting,
  handleDeleteFile,
  fileType,
}: {
  previewUrl: string;
  isDeleting: boolean;
  handleDeleteFile: () => void;
  fileType: "image" | "video" | "pdf";
}) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden ">
      {/* File Preview Logic */}
      {fileType === "video" ? (
        <video
          src={previewUrl}
          controls
          className="w-auto h-full object-contain"
        />
      ) : fileType === "pdf" ? (
        <iframe
          src={previewUrl}
          title="PDF Preview"
          className="w-full h-full object-contain"
        />
      ) : (
        <Image
          src={previewUrl}
          alt="Uploaded file preview"
          fill
          className="object-contain w-auto h-full"
        />
      )}

      {/* Delete Button */}
      <Button
        variant="default"
        onClick={handleDeleteFile}
        disabled={isDeleting}
        className="absolute top-2 right-0 bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 text-white shadow-sm hover:shadow-md transition-all duration-200"
      >
        {isDeleting ? (
          <Loader2 className="animate-spin size-4" />
        ) : (
          <Trash2 className="size-4 text-white" />
        )}
      </Button>
    </div>
  );
}

// uploading state component
export function RenderUploadingState({
  fileName,
  filePreview,
  progress,
  fileType,
}: {
  fileName: string;
  filePreview: string;
  progress: number;
  fileType: "image" | "video" | "pdf";
}) {
  return (
    <Card className="min-w-full sm:min-w-xl">
      <CardContent className="flex items-center gap-4 h-full px-4 pr-4 py-2">
        {/* File Preview */}
        <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden border bg-accent/10">
          {fileType === "video" ? (
            <video
              src={filePreview}
              className="w-full h-full object-cover"
              muted
              autoPlay
              loop
            />
          ) : fileType === "image" ? (
            <Image
              src={filePreview}
              alt="File preview"
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-background text-muted-foreground">
              <FileTextIcon className="size-6" />
            </div>
          )}
        </div>

        {/* File Info + Upload Icon */}
        <div className="flex flex-col flex-1 gap-1">
          <div className="flex items-center justify-between w-full">
            <p className="text-base font-medium truncate max-w-[90%]">
              {fileName}
            </p>
            <UploadIcon className="text-muted-foreground size-4 shrink-0 ml-2" />
          </div>

          <p className="text-sm text-muted-foreground">
            Uploading... {progress}%
          </p>

          <Progress value={progress} className="h-2 bg-muted rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
