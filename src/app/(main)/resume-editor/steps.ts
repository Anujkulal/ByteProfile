import { ResumeEditorFormProps } from "@/lib/types";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import SummaryForm from "./forms/SummaryForm";

export const steps: {
  title: string;
  component: React.ComponentType<ResumeEditorFormProps>;
  key: string;
}[] = [
  { title: "General Info", component: GeneralInfoForm, key: "general-info" },
  { title: "Personal Info", component: PersonalInfoForm, key: "personal-info" },
  { title: "Experience Info", component: ExperienceForm, key: "experience-info" },
  { title: "Education Info", component: EducationForm, key: "education-info" },
  { title: "Skills Info", component: SkillsForm, key: "skills-info" },
  { title: "Summary Info", component: SummaryForm, key: "summary-info" },
];
