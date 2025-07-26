import ResumePreviewer1 from "@/components/home/ResumePreviewer1";
import ResumePreviewer2 from "@/components/home/ResumePreviewer2";
import ResumePreviewer3 from "@/components/home/ResumePreviewer3";
import ResumePreviewer4 from "@/components/home/ResumePreviewer4";
import ResumePreviewer5 from "@/components/home/ResumePreviewer5";
import ResumePreviewer6 from "@/components/home/ResumePreviewer6";

interface TemplateComponentProps {
  resumeData: any; // Replace with your actual resume data type
  className?: string;
  printRef?: React.RefObject<HTMLDivElement | null>;
}

export const templates: {
    title: string;
    component: React.ComponentType<TemplateComponentProps>;
    key: string;
}[] = [
    {title: "Template 1", component: ResumePreviewer1, key: "template-1"},
    {title: "Template 2", component: ResumePreviewer2, key: "template-2"},
    {title: "Template 3", component: ResumePreviewer3, key: "template-3"},
    {title: "Template 4", component: ResumePreviewer4, key: "template-4"},
    {title: "Template 5", component: ResumePreviewer5, key: "template-5"},
    {title: "Template 6", component: ResumePreviewer6, key: "template-6"},
]