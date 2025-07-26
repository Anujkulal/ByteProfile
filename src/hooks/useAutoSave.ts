import { ResumeValues } from "@/lib/resumeSchema";
import useDebounce from "./useDebounce";
import { useEffect, useState } from "react";
import { resolve } from "path";

const useAutoSave = (resumeData: ResumeValues) => {
    const debouncedResumeData = useDebounce(resumeData, 1500); // 1500 ms debounce

    const [lastSavedData, setLastSavedData] = useState<ResumeValues>(structuredClone(resumeData));

    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        async function save() {
            setIsSaving(true);
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate save delay or artificial delay
            setLastSavedData(structuredClone(debouncedResumeData));
            setIsSaving(false);
        }

        const hasUnsavedChanges = JSON.stringify(debouncedResumeData) !== JSON.stringify(lastSavedData);
        if (hasUnsavedChanges && debouncedResumeData && !isSaving) {
            save();
        }
    }, [debouncedResumeData, isSaving, lastSavedData])

    return {
        isSaving,
        hasUnsavedChanges: JSON.stringify(resumeData) !== JSON.stringify(lastSavedData),
    }
}

export default useAutoSave;