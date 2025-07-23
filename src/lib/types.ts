import { ResumeValues } from "./resumeSchema";

export interface ResumeEditorFormProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
}
