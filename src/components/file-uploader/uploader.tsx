"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import RenderEmptyState, { RenderErrorState, RenderSuccessState, RenderUploadingState } from "./renderStates";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  error: boolean;
  isDeleting: boolean;
  objectUrl?: string;
  fileType: "image";
}

export function FileUploader() {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [fileState, setFileState] = useState<UploaderState>({
    id: null,
    file: null,
    uploading: false,
    progress: 0,
    error: false,
    isDeleting: false,
    fileType: "image",
  });

  // ☁️ 🔗 Upload file to S3 using presigned URL
  const uploadFile = async (file: File) => {
    if (!file) return;

    // Set uploading state
    setFileState((prev) => ({ ...prev, uploading: true, progress: 0, error: false }));

    try {
      // 🔶 Step 1: Get presigned URL from your API
      const presignedResponse = await axios.post("/api/s3/upload", {
        fileName: file.name,
        contentType: file.type,
        size: file.size,
        isImage: true,
      }, {
        headers: { "Content-Type": "application/json" },
      });

      const { presignedUrl, key } = presignedResponse.data;

      // 🔷 Step 2: Upload file directly to S3
      await axios.put(presignedUrl, file, {
        headers: { "Content-Type": file.type },
        onUploadProgress: (progressEvent) => {
          const total = progressEvent.total ?? 1;
          const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
          setFileState((prev) => ({ ...prev, progress: percentCompleted }));
        },
      });

      // ✅ Step 3: Mark upload as done
      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 100,
        error: false,
        key,
      }));

      toast.success("File uploaded successfully!");
    } catch (error) {
      toast.error("Upload failed");
      setFileState((prev) => ({ ...prev, uploading: false, error: true }));
    }
  };

  // ❌ Delete uploaded file from S3 and clear preview
  async function deleteFile() {
    if (fileState.isDeleting || !fileState.objectUrl || !fileState.key) return;

    setFileState((prev) => ({ ...prev, isDeleting: true }));

    try {
      await axios.delete("/api/s3/delete", {
        data: { key: fileState.key },
        headers: { "Content-Type": "application/json" },
      });

      // 🧹 Revoke blob memory
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      // 🧼 Clear state
      setFileState((prev) => ({
        ...prev,
        isDeleting: false,
        objectUrl: undefined,
        file: null,
        id: null,
      }));

      toast.success("File deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete file. Please try again.");
      console.error("Delete file error:", error);
      setFileState((prev) => ({ ...prev, isDeleting: false }));
    }
  }

  // 📥 When file is dropped
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const id = uuidv4();
      const objectUrl = URL.createObjectURL(file);

      // 🧹 Revoke old blob
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      // 🧾 Save file metadata to state
      setFileState({
        id,
        file,
        uploading: true,
        progress: 0,
        error: false,
        isDeleting: false,
        fileType: "image",
        objectUrl,
      });

      uploadFile(file); // 🚀 Start upload
    }
  }, [fileState.objectUrl, uploadFile]);

  // ❌ On rejected file
  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {

    const fileTypeMismatch = fileRejections.some(rej =>
      rej.errors.some(err => err.code === "file-invalid-type")
    );
    if (fileTypeMismatch) {
      setError("Invalid file type, only images allowed");
      toast.error("Invalid file type, only images allowed.");
      return;
    }

    const tooManyFiles = fileRejections.some(rej =>
      rej.errors.some(err => err.code === "too-many-files")
    );
    if (tooManyFiles) {
      setError("Too many files selected, max is 1");
      toast.error("Only one image can be uploaded.");
      return;
    }

    const fileTooLarge = fileRejections.some(rej =>
      rej.errors.some(err => err.code === "file-too-large")
    );
    if (fileTooLarge) {
      setError("File size exceeds limit. Max 5MB allowed.");
      toast.error("File size exceeds limit. Max 5MB allowed.");
      return;
    }

    // Default
    setError("Error in uploading file. Please try again.");
    toast.error("Error in uploading file. Please try again.");
  }, []);

  // 📦 Dropzone config
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    disabled: fileState.uploading || fileState.isDeleting || !!fileState.objectUrl,
  });

  // 🖼️ Render UI content based on file state
  const renderDropzoneContent = () => {
    if (fileState.uploading) {
      return <RenderUploadingState progress={fileState.progress} />;
    }

    if (fileState.error) {
      console.error("File upload error:", fileState);
      return (
        <RenderErrorState
          error="Upload failed. Please try again."
          onRetry={() => {
            setError(null);
            setFileState((prev) => ({ ...prev, error: false }));
            inputRef.current?.click();
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
            if (fileState.isDeleting) return;
            deleteFile();
          }}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  };

  // ♻️ Cleanup blob URL on component unmount
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
        "w-full h-64 rounded-xl border border-dashed transition-colors  hover:bg-primary/5 hover:border-primary",
        isDragActive && "border-primary bg-primary/10",
        !isDragActive && "border-muted-foreground/30",
        fileState.uploading || fileState.isDeleting
          ? "cursor-not-allowed opacity-50 "
          : "cursor-pointer",
        fileState.objectUrl && "hover:bg-transparent hover:border-muted-foreground/30"
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
