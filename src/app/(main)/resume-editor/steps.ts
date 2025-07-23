import { ResumeEditorFormProps } from "@/lib/types";
import GeneralInfoForm from "./forms/GeneralInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";
import ExperienceForm from "./forms/ExperienceForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import SummaryForm from "./forms/SummaryForm";
import HobbiesForm from "./forms/HobbiesForm";
import AchievementsForm from "./forms/AchievementsForm";
import ProjectsForm from "./forms/ProjectsForm";

export const steps: {
  title: string;
  component: React.ComponentType<ResumeEditorFormProps>;
  key: string;
}[] = [
  { title: "General Info", component: GeneralInfoForm, key: "general-info" },
  { title: "Personal Info", component: PersonalInfoForm, key: "personal-info" },
  { title: "Education Info", component: EducationForm, key: "education-info" },
  { title: "Experience Info", component: ExperienceForm, key: "experience-info" },
  { title: "Project Info", component: ProjectsForm, key: "project-info" },
  { title: "Skills Info", component: SkillsForm, key: "skills-info" },
  { title: "Hobbies Info", component: HobbiesForm, key: "hobbies-info" },
  { title: "Achievements Info", component: AchievementsForm, key: "achievements-info" },
  { title: "Summary Info", component: SummaryForm, key: "summary-info" },
];
