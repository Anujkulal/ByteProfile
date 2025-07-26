import { ResumeValues } from "@/lib/resumeSchema";
import useDebounce from "./useDebounce";
import { useEffect, useState } from "react";
import { saveResumeData } from "@/app/(main)/resume-editor/actions";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const useAutoSave = (resumeData: ResumeValues) => {
  const debouncedResumeData = useDebounce(resumeData, 1500); // 1500 ms debounce

  const searchParams = useSearchParams();

  const [lastSavedData, setLastSavedData] = useState<ResumeValues>(
    structuredClone(resumeData),
  );

  const [resumeId, setResumeId] = useState(resumeData.id);
  const [isSaving, setIsSaving] = useState(false); 
  const [isError, setIsError] = useState(false);
  const [errorToastId, setErrorToastId] = useState<string | null | number>(null); 

  useEffect(() => {
    async function save() {
      // setIsSaving(true);
      // await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate save delay or artificial delay
      // setLastSavedData(structuredClone(debouncedResumeData));
      // setIsSaving(false);

      try {
        setIsSaving(true);
        setIsError(false);

        const newData = structuredClone(debouncedResumeData);

        const updatedResume = await saveResumeData({
          ...newData,
          ...(lastSavedData.photo?.toString() === newData.photo?.toString() && {
            photo: undefined,
          }),
          id: resumeId,
        });
        setResumeId(updatedResume.id);
        setLastSavedData(newData);

        if (errorToastId) {
          toast.dismiss(errorToastId);
          setErrorToastId(null);
        }


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
        setIsError(true);
        console.error("Error saving resume data:", error);
        const id = toast("Error saving resume data. Please try again.", {
            action: {
                label: "Retry",
                onClick: () => save(),
            }
        })
        setErrorToastId(id);

      }
      finally {
        setIsSaving(false);
      }
    }

    const hasUnsavedChanges =
      JSON.stringify(debouncedResumeData) !== JSON.stringify(lastSavedData);
    if (hasUnsavedChanges && debouncedResumeData && !isSaving && !isError) {
      save();
    }
  }, [debouncedResumeData, isSaving, lastSavedData, isError, resumeId, searchParams]);

  return {
    isSaving,
    isError,
    hasUnsavedChanges:
      JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
  };
};

export default useAutoSave;
