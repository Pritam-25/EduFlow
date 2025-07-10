import { cn } from "@/lib/utils";
import { CloudAlert, CloudUpload, ImageUpIcon, Loader2, Trash2, Upload } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

export default function RenderEmptyState({ isDragActive }: { isDragActive: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-3">
      <div className={cn(
        "flex items-center justify-center size-14 rounded-full bg-secondary transition-all",
        isDragActive && "bg-primary/20"
      )}>
        <CloudUpload
          className={cn(
            "size-icon text-muted-foreground transition-transform",
            isDragActive && "animate-bounce text-primary"
          )}
        />
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground font-medium">
          Drag & drop files here or <span className="text-primary font-semibold">click to upload</span>
        </p>
      </div>
    </div>
  );
}



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
          className="cursor-pointer font-medium bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex-1"
          onClick={onRetry}
        >
          <Upload className="mr-2 size-4" />
          Try Again
        </Button>
      </div>
    </div>
  );
}


export function RenderSuccessState({ previewUrl, isDeleting, handleDeleteFile }: {
  previewUrl: string;
  isDeleting: boolean;
  handleDeleteFile: () => void;
}) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <Image
        src={previewUrl}
        alt="Uploaded file preview"
        fill
        className="object-contain w-auto h-full"
      />

      <Button
        variant="default"
        onClick={handleDeleteFile}
        disabled={isDeleting}
        className="absolute top-2 right-0 bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-800 text-white shadow-sm hover:shadow-md transition-all duration-200 "
      >
        {isDeleting ? (
          <Loader2 className="animate-spin" />
        ) : (
          <Trash2 className=" text-white" />
        )}
      </Button>
    </div>
  );
}



export function RenderUploadingState({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 w-full max-w-xs mx-auto">
      {/* Upload Icon */}
      <div className="flex items-center justify-center size-14 rounded-full bg-secondary">
        <ImageUpIcon className="size-icon text-muted-foreground" />
      </div>

      {/* Upload Text */}
      <p className="text-sm text-muted-foreground font-medium">
        Uploading... {progress}%
      </p>

      {/* Progress Bar Container */}
      <div className="w-full bg-muted-foreground/20 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
