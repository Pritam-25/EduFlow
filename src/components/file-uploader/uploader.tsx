"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn, extractErrorMessage } from "@/lib/utils";
import RenderEmptyState, { RenderErrorState, RenderSuccessState, RenderUploadingState } from "./renderStates";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  error: boolean;
  errorMessage?: string;
  isDeleting: boolean;
  objectUrl?: string;
  fileType: "image" | "video" | "pdf";
}

interface FileUploaderProps {
  value?: string;
  onChange?: (value: string) => void;
  fileTypeAccepted?: "image" | "video" | "pdf";
}

export function FileUploader({ value, onChange, fileTypeAccepted }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const objectUrl = useConstructUrl(value || "");

  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    error: false,
    isDeleting: false,
    fileType: fileTypeAccepted || "image",
    key: value,
    objectUrl: value ? objectUrl : undefined,
  });

  // ✅ Always hold the latest fileState for use in callbacks
  const fileStateRef = useRef(fileState);
  useEffect(() => {
    fileStateRef.current = fileState;
  }, [fileState]);

  // ✅ Upload file - wrap in useCallback
  const uploadFile = useCallback(async (file: File) => {
    if (!file) return;

    setFileState((prev) => ({ ...prev, uploading: true, progress: 0, error: false }));

    try {
      const presignedResponse = await axios.post("/api/s3/upload", {
        fileName: file.name,
        contentType: file.type,
        size: file.size,
        isImage: fileTypeAccepted === "image",
      });

      const { presignedUrl, key } = presignedResponse.data;

      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total ?? 1;
          const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
          setFileState((prev) => ({ ...prev, progress: percentCompleted }));
        },
      });

      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 100,
        error: false,
        key,
      }));

      onChange?.(key);
      toast.success("File uploaded successfully!");
    } catch (error) {
      const extracted = extractErrorMessage(error, "Something went wrong, please try again.");
      if (axios.isAxiosError(error) && !error.response) {
        // No response = network issue
        toast.error("Network unavailable. Please check your connection.");
      } else {
        toast.error(extracted);
      }

      setFileState((prev) => ({
        ...prev,
        uploading: false,
        error: true,
        errorMessage: extracted,
      }));
    }
  }, [fileTypeAccepted, onChange]); // Add dependencies that uploadFile uses

  // ✅ Delete file
  const deleteFile = async () => {
    if (fileState.isDeleting || !fileState.objectUrl || !fileState.key) return;

    setFileState((prev) => ({ ...prev, isDeleting: true }));

    try {
      await axios.delete("/api/s3/delete", {
        data: { key: fileState.key },
      });

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      setFileState((prev) => ({
        id: null,
        file: null,
        uploading: false,
        progress: 0,
        error: false,
        isDeleting: false,
        fileType: fileTypeAccepted || prev.fileType, // ✅ retain correct type
        key: undefined,
        objectUrl: undefined,
      }));

      onChange?.("");
      toast.success("File deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      const extracted = extractErrorMessage(error, "Failed to delete file");
      toast.error(extracted);
      setFileState((prev) => ({ ...prev, isDeleting: false, error: true, errorMessage: extracted }));
    }
  };

  // ✅ Drop handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const id = uuidv4();
    const objectUrl = URL.createObjectURL(file);

    const prevUrl = fileStateRef.current.objectUrl;
    if (prevUrl && !prevUrl.startsWith("http")) {
      URL.revokeObjectURL(prevUrl);
    }

    setFileState({
      id,
      file,
      uploading: true,
      progress: 0,
      error: false,
      isDeleting: false,
      fileType: fileTypeAccepted || "image",
      objectUrl,
    });

    uploadFile(file);
  }, [uploadFile, fileTypeAccepted]); // ✅ Add fileTypeAccepted to dependency array

  // ❌ Drop rejection
  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    let errorMessage = "Error in uploading file. Please try again.";

    if (fileRejections.some(r => r.errors.some(e => e.code === "file-invalid-type")))
      errorMessage = "Invalid file type, only images allowed.";
    else if (fileRejections.some(r => r.errors.some(e => e.code === "too-many-files")))
      errorMessage = "Too many files selected, max is 1.";
    else if (fileRejections.some(r => r.errors.some(e => e.code === "file-too-large")))
      errorMessage = "File size exceeds limit. Max 5MB allowed.";

    setFileState((prev) => ({
      ...prev,
      file: null, // ⛔ Ensure no retry happens
      error: true,
      errorMessage: errorMessage,
    }));
    toast.error(errorMessage);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: fileTypeAccepted === "video" ? { "video/*": [] } :
      fileTypeAccepted === "image" ? { "image/*": [] } :
        fileTypeAccepted === "pdf" ? { "application/pdf": [".pdf"] } : undefined,
    maxFiles: 1,
    multiple: false,
    maxSize: fileTypeAccepted === "video" ? 500 * 1024 * 1024 : 5 * 1024 * 1024,  // 500MB for videos
    disabled: fileState.uploading || fileState.isDeleting || !!fileState.objectUrl,
  });

  // ✅ Render state
  const renderDropzoneContent = () => {
    if (fileState.uploading) return <RenderUploadingState fileName={fileState.file?.name || ""} filePreview={fileState.objectUrl || ""} progress={fileState.progress} fileType={fileState.fileType} />;

    if (fileState.error) {
      return (
        <RenderErrorState
          error={fileState.errorMessage || "An error occurred while uploading."}
          onRetry={() => {

            const fileToRetry = fileStateRef.current.file;

            setFileState((prev) => ({
              ...prev,
              error: false,
              uploading: false,
              errorMessage: undefined,
            }));

            if (fileToRetry) uploadFile(fileToRetry);

            requestAnimationFrame(() => {
              inputRef.current?.click();
            });
          }}

        />
      );
    }

    if (fileState.objectUrl) {
      return (
        <RenderSuccessState
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handleDeleteFile={() => {
            if (!fileState.isDeleting) deleteFile();
          }}
          fileType={fileState.fileType}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} fileType={fileState.fileType} />;
  };

  // ♻️ Cleanup URL on unmount
  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "w-full h-64 rounded-xl border transition-colors hover:bg-primary/5 hover:border-primary hover:border-dashed",
        isDragActive && !fileState.error
          ? "border-primary border-solid bg-primary/10"
          : "border-dashed",
        !isDragActive && "border-muted-foreground/30",
        fileState.uploading || fileState.isDeleting
          ? "cursor-not-allowed"
          : "cursor-pointer",
        (fileState.objectUrl || fileState.error) && "hover:bg-transparent hover:border-muted-foreground/30"
      )}
    >
      <Card className="w-full h-full bg-transparent shadow-none border-none p-2">
        <CardContent className="flex items-center justify-center h-full w-full px-2">
          <input ref={inputRef} {...getInputProps()} />
          {renderDropzoneContent()}
        </CardContent>
      </Card>
    </div>
  );
}
