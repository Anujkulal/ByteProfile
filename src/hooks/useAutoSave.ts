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
  retryCount: number;
  forceSave: () => Promise<void>;
}

interface UseAutoSaveOptions {
  debounceDelay?: number;
  maxRetries?: number;
  enabled?: boolean;
}

const useAutoSave = (
  resumeData: ResumeValues,
  options: UseAutoSaveOptions = {},
): UseAutoSaveReturn => {
  const { debounceDelay = 1500, maxRetries = 3, enabled = true } = options;

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
  const [retryCount, setRetryCount] = useState<number>(0);

  // Refs for cleanup and consistency
  const errorToastIdRef = useRef<string | number | null>(null);
  const savingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (savingTimeoutRef.current) {
      clearTimeout(savingTimeoutRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (errorToastIdRef.current) {
      toast.dismiss(errorToastIdRef.current);
      errorToastIdRef.current = null;
    }
  }, []);

  // Save function with proper error handling and retry logic
  const saveResume = useCallback(
    async (
      dataToSave: ResumeValues,
      currentResumeId: string | undefined,
      isRetry: boolean = false,
    ): Promise<void> => {
      try {
        // Abort any existing save operation
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        setIsSaving(true);
        setIsError(false);

        if (!isRetry) {
          setRetryCount(0);
        }

        const newData = structuredClone(dataToSave);

        // Optimize photo upload - don't re-upload if unchanged
        const shouldSkipPhoto =
          lastSavedData.photo?.toString() === newData.photo?.toString();

        const updatedResume = await saveResumeData({
          ...newData,
          ...(shouldSkipPhoto && { photo: undefined }),
          id: currentResumeId,
        });

        // Update state on successful save
        setResumeId(updatedResume.id);
        setLastSavedData(newData);
        setLastSavedAt(new Date());
        setRetryCount(0);

        // Dismiss any existing error toast
        if (errorToastIdRef.current) {
          toast.dismiss(errorToastIdRef.current);
          errorToastIdRef.current = null;
        }

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

        const currentRetry = isRetry ? retryCount : retryCount + 1;
        setRetryCount(currentRetry);
        setIsError(true);

        // Show error toast with retry option
        const canRetry = currentRetry < maxRetries;
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error saving resume data. Please try again.";

        const toastId = toast.error(errorMessage, {
          duration: canRetry ? Infinity : 5000,
          action: canRetry
            ? {
                label: `Retry (${maxRetries - currentRetry} left)`,
                onClick: () => {
                  if (errorToastIdRef.current) {
                    toast.dismiss(errorToastIdRef.current);
                  }
                  saveResume(dataToSave, currentResumeId, true);
                },
              }
            : undefined,
        });

        errorToastIdRef.current = toastId;

        // Auto-retry with exponential backoff
        if (canRetry) {
          const retryDelay = Math.min(
            1000 * Math.pow(2, currentRetry - 1),
            10000,
          );
          savingTimeoutRef.current = setTimeout(() => {
            saveResume(dataToSave, currentResumeId, true);
          }, retryDelay);
        }

        throw error;
      } finally {
        setIsSaving(false);
        abortControllerRef.current = null;
      }
    },
    [lastSavedData, retryCount, maxRetries, searchParams],
  );

  // Force save function for manual saves
  const forceSave = useCallback(async (): Promise<void> => {
    if (!enabled || isSaving) return;

    try {
      await saveResume(resumeData, resumeId);
    } catch (error) {
      // Error is already handled in saveResume
      console.warn("Force save failed:", error);
    }
  }, [enabled, isSaving, resumeData, resumeId, saveResume]);

  // Auto-save effect
  useEffect(() => {
    if (!enabled) return;

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData) !== JSON.stringify(lastSavedData);

    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
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

  // Calculate unsaved changes
  const hasUnsavedChanges =
    JSON.stringify(resumeData) !== JSON.stringify(lastSavedData);

  return {
    isSaving,
    isError,
    hasUnsavedChanges,
    lastSavedAt,
    retryCount,
    forceSave,
  };
};

export default useAutoSave;
