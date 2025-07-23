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
import {
  Info,
  User,
  GraduationCap,
  Briefcase,
  FolderKanban,
  Brain,
  Palette,
  Trophy,
  List
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

export const steps: {
  title: string;
  icon?: LucideIcon; 
  component: React.ComponentType<ResumeEditorFormProps>;
  key: string;
}[] = [
  { title: "General Info", icon: Info, component: GeneralInfoForm, key: "general-info" },
  { title: "Personal Info", icon: User, component: PersonalInfoForm, key: "personal-info" },
  { title: "Education Info",icon: GraduationCap, component: EducationForm, key: "education-info" },
  { title: "Experience Info", icon: Briefcase, component: ExperienceForm, key: "experience-info" },
  { title: "Project Info", icon: FolderKanban, component: ProjectsForm, key: "project-info" },
  { title: "Skills Info", icon: Brain, component: SkillsForm, key: "skills-info" },
  { title: "Hobbies Info", icon: Palette, component: HobbiesForm, key: "hobbies-info" },
  { title: "Achievements Info", icon: Trophy, component: AchievementsForm, key: "achievements-info" },
  { title: "Summary Info", icon: List, component: SummaryForm, key: "summary-info" },
];
