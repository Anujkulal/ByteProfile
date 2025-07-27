import { ResumeValues } from "@/lib/resumeSchema";
import useDebounce from "./useDebounce";
import { useEffect, useState, useCallback, useRef } from "react";
import { saveResumeData } from "@/app/(main)/resume-editor/actions";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

interface UseAutoSaveReturn {
  isSaving: boolean;
  isError: boolean;
  hasUnsavedChanges: boolean;
  lastSavedAt: Date | null;
  forceSave: () => Promise<void>;
}

interface UseAutoSaveOptions {
  debounceDelay?: number;
  enabled?: boolean;
}

const useAutoSave = (
  resumeData: ResumeValues,
  options: UseAutoSaveOptions = {},
): UseAutoSaveReturn => {
  const { debounceDelay = 1500, enabled = true } = options;

  const debouncedResumeData = useDebounce(resumeData, debounceDelay);
  const searchParams = useSearchParams();

  // State management
  const [lastSavedData, setLastSavedData] = useState<ResumeValues>(() =>
    structuredClone(resumeData),
  );
  const [resumeId, setResumeId] = useState<string | undefined>(resumeData.id);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Refs for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  // Helper function to compare photos properly (updated to handle undefined)
  const arePhotosEqual = (
    photo1: File | string | null | undefined,
    photo2: File | string | null | undefined,
  ): boolean => {
    // Both are null or undefined (treat null and undefined as equivalent)
    if (
      (photo1 === null || photo1 === undefined) && 
      (photo2 === null || photo2 === undefined)
    ) {
      return true;
    }

    // One is null/undefined, other is not
    if (
      (photo1 === null || photo1 === undefined) || 
      (photo2 === null || photo2 === undefined)
    ) {
      return false;
    }

    // Both are strings (URLs)
    if (typeof photo1 === "string" && typeof photo2 === "string") {
      return photo1 === photo2;
    }

    // Both are File objects
    if (photo1 instanceof File && photo2 instanceof File) {
      return (
        photo1.name === photo2.name &&
        photo1.size === photo2.size &&
        photo1.lastModified === photo2.lastModified
      );
    }

    // Mixed types (File vs string) - consider them different
    return false;
  };

  // Save function with proper photo handling
  const saveResume = useCallback(
    async (
      dataToSave: ResumeValues,
      currentResumeId: string | undefined,
    ): Promise<void> => {
      try {
        // Abort any existing save operation
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        setIsSaving(true);
        setIsError(false);

        const newData = structuredClone(dataToSave);

        // Better photo comparison - skip upload only if photos are truly identical
        const shouldSkipPhoto = arePhotosEqual(
          lastSavedData.photo,
          newData.photo,
        );

        console.log("Photo comparison:", {
          lastSavedPhoto: lastSavedData.photo,
          newPhoto: newData.photo,
          shouldSkip: shouldSkipPhoto,
        });

        const updatedResume = await saveResumeData({
          ...newData,
          // Only skip photo if they're truly identical, otherwise let the server handle it
          ...(shouldSkipPhoto && { photo: undefined }),
          id: currentResumeId,
        });

        // Update state on successful save
        setResumeId(updatedResume.id);
        setLastSavedData(newData);
        setLastSavedAt(new Date());

        // Update URL if resume ID changed
        if (searchParams.get("resumeId") !== updatedResume.id) {
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("resumeId", updatedResume.id);
          window.history.replaceState(
            null,
            "",
            `?${newSearchParams.toString()}`,
          );
        }
      } catch (error) {
        console.error("Error saving resume data:", error);
        setIsError(true);

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error saving resume data. Please try again.";

        toast.error(errorMessage, {
          duration: 5000,
        });

        throw error;
      } finally {
        setIsSaving(false);
        abortControllerRef.current = null;
      }
    },
    [lastSavedData, searchParams],
  );

  // Force save function for manual saves
  const forceSave = useCallback(async (): Promise<void> => {
    if (!enabled || isSaving) return;

    try {
      await saveResume(resumeData, resumeId);
    } catch (error) {
      console.warn("Force save failed:", error);
    }
  }, [enabled, isSaving, resumeData, resumeId, saveResume]);

  // Auto-save effect with better comparison
  useEffect(() => {
    if (!enabled) return;

    // Create a comparison object without the photo for general changes
    const { photo: lastPhoto, ...lastDataWithoutPhoto } = lastSavedData;
    const { photo: currentPhoto, ...currentDataWithoutPhoto } = debouncedResumeData;

    const hasGeneralChanges =
      JSON.stringify(currentDataWithoutPhoto) !==
      JSON.stringify(lastDataWithoutPhoto);
    const hasPhotoChanges = !arePhotosEqual(lastPhoto, currentPhoto);
    const hasUnsavedChanges = hasGeneralChanges || hasPhotoChanges;

    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
      console.log("Auto-saving due to changes:", {
        hasGeneralChanges,
        hasPhotoChanges,
      });
      saveResume(debouncedResumeData, resumeId);
    }
  }, [
    debouncedResumeData,
    lastSavedData,
    isSaving,
    isError,
    resumeId,
    enabled,
    saveResume,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Calculate unsaved changes with proper photo comparison
  const { photo: lastPhoto, ...lastDataWithoutPhoto } = lastSavedData;
  const { photo: currentPhoto, ...currentDataWithoutPhoto } = resumeData;

  const hasGeneralChanges =
    JSON.stringify(currentDataWithoutPhoto) !== JSON.stringify(lastDataWithoutPhoto);
  const hasPhotoChanges = !arePhotosEqual(lastPhoto, currentPhoto);
  const hasUnsavedChanges = hasGeneralChanges || hasPhotoChanges;

  return {
    isSaving,
    isError,
    hasUnsavedChanges,
    lastSavedAt,
    forceSave,
  };
};

export default useAutoSave;
