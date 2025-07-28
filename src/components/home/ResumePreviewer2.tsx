import useDimension from "@/hooks/useDimension";
import { ResumeValues } from "@/lib/resumeSchema";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import { BorderStyles } from "./BorderStyle";
import useMergeRefs from "@/hooks/useMergeRefs";

interface ResumePreviewerProps {
  resumeData: ResumeValues;
  className?: string;
  contentRef?: React.Ref<HTMLDivElement>;
  printRef?: React.RefObject<HTMLDivElement | null>; // Allow null
}

const ResumePreviewer2 = ({ resumeData, className, contentRef, printRef }: ResumePreviewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimension(containerRef);

  const mergeRefs = useMergeRefs<HTMLDivElement | null>(
      contentRef,
      printRef,
    );

  return (
    <div
      className={cn(
        "aspect-[210/297] h-full w-full rounded-md bg-white text-black shadow-lg print:rounded-none print:shadow-none",
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn("flex h-full", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        ref={mergeRefs}
        id="resumePreviewContent"
      >
        {/* Left Sidebar */}
        <div 
          className="w-1/3 p-6 text-white"
          style={{ backgroundColor: resumeData.colorHex || '#2563eb' }}
        >
          <PersonalInfoSidebar resumeData={resumeData} />
          <ContactInfo resumeData={resumeData} />
          <SkillsInfoSidebar resumeData={resumeData} />
          <HobbiesInfoSidebar resumeData={resumeData} />
        </div>
        
        {/* Right Main Content */}
        <div className="w-2/3 p-6 space-y-6">
          <SummaryInfoMain resumeData={resumeData} />
          <ExperienceInfoMain resumeData={resumeData} />
          <EducationInfoMain resumeData={resumeData} />
          <ProjectsInfoMain resumeData={resumeData} />
          <AchievementsInfoMain resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
};

interface ResumeSectionProps {
  resumeData: ResumeValues;
  className?: string;
}

const SidebarSectionTitle = ({ title }: { title: string }) => (
  <h3 className="text-lg font-bold mb-3 text-white border-b border-white/30 pb-1">
    {title}
  </h3>
);

const MainSectionTitle = ({ title, color }: { title: string; color: string | undefined }) => (
  <div className="mb-4">
    <h2 
      className="text-xl font-bold mb-2 uppercase tracking-wide"
      style={{ color: color || '#2563eb' }}
    >
      {title}
    </h2>
    <div 
      className="h-0.5 w-12"
      style={{ backgroundColor: color || '#2563eb' }}
    />
  </div>
);

const PersonalInfoSidebar = ({ resumeData }: ResumeSectionProps) => {
  const { photo, firstName, lastName, jobTitle, borderStyle } = resumeData;
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <div className="text-center mb-8">
      {photoSrc && (
        <div className="mb-4 flex justify-center">
          <Image
            src={photoSrc}
            alt="Profile Photo"
            width={120}
            height={120}
            className="aspect-square border-4 border-white object-cover"
            style={{
              borderRadius:
                borderStyle === BorderStyles.SQUARE
                  ? "0px"
                  : borderStyle === BorderStyles.CIRCLE
                    ? "50%"
                    : "12px",
            }}
          />
        </div>
      )}
      <h1 className="text-2xl font-bold mb-2 text-white">
        {firstName} {lastName}
      </h1>
      <p className="text-sm opacity-90 font-medium uppercase tracking-wider">
        {jobTitle}
      </p>
    </div>
  );
};

const ContactInfo = ({ resumeData }: ResumeSectionProps) => {
  const { city, country, email, phone, linkedInUrl, githubUrl, websiteUrl } = resumeData;

  const contactItems = [
    { label: "Location", value: `${city}${city && country ? ", " : ""}${country}` },
    { label: "Email", value: email, link: `mailto:${email}` },
    { label: "Phone", value: phone, link: `tel:${phone}` },
    { label: "LinkedIn", value: linkedInUrl?.replace("https://", ""), link: linkedInUrl },
    { label: "GitHub", value: githubUrl?.replace("https://", ""), link: githubUrl },
    { label: "Website", value: websiteUrl?.replace("https://", ""), link: websiteUrl },
  ].filter(item => item.value);

  if (contactItems.length === 0) return null;

  return (
    <div className="mb-8">
      <SidebarSectionTitle title="Contact" />
      <div className="space-y-3">
        {contactItems.map((item, idx) => (
          <div key={idx} className="text-sm">
            <p className="font-semibold opacity-90 mb-1">{item.label}</p>
            {item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="opacity-80 hover:opacity-100 break-words"
              >
                {item.value}
              </a>
            ) : (
              <p className="opacity-80 break-words">{item.value}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const SkillsInfoSidebar = ({ resumeData }: ResumeSectionProps) => {
  const { skills } = resumeData;
  if (!skills?.length) return null;

  return (
    <div className="mb-8">
      <SidebarSectionTitle title="Skills" />
      <div className="space-y-2">
        {skills.map((skill, i) => (
          <div key={i} className="bg-white/20 rounded px-3 py-1 text-sm text-center">
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
};

const HobbiesInfoSidebar = ({ resumeData }: ResumeSectionProps) => {
  const { hobbies } = resumeData;
  if (!hobbies?.length) return null;

  return (
    <div className="mb-8">
      <SidebarSectionTitle title="Interests" />
      <div className="space-y-1">
        {hobbies.map((hobby, i) => (
          <p key={i} className="text-sm opacity-80">
            • {hobby}
          </p>
        ))}
      </div>
    </div>
  );
};

const SummaryInfoMain = ({ resumeData }: ResumeSectionProps) => {
  const { summary, colorHex } = resumeData;
  if (!summary) return null;

  return (
    <div>
      <MainSectionTitle title="Professional Summary" color={colorHex} />
      <p className="text-sm leading-relaxed text-gray-700">{summary}</p>
    </div>
  );
};

const ExperienceInfoMain = ({ resumeData }: ResumeSectionProps) => {
  const { experiences, colorHex } = resumeData;
  const hasExperiences = experiences?.filter((exp) =>
    Object.values(exp).some(Boolean),
  );
  if (!hasExperiences?.length) return null;

  return (
    <div>
      <MainSectionTitle title="Professional Experience" color={colorHex} />
      <div className="space-y-6">
        {hasExperiences.map((exp, i) => (
          <div key={i} className="relative pl-4 border-l-2" style={{ borderColor: colorHex }}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold text-gray-900">{exp.position}</h4>
                <p className="text-sm font-medium text-gray-600">{exp.organization}</p>
              </div>
              {exp.startDate && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 whitespace-nowrap ml-4">
                  {formatDate(exp.startDate, "MM/yyyy")} - {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
                </span>
              )}
            </div>
            {exp.description && exp.description?.filter(desc => desc?.trim()).length > 0 && (
              <ul className="space-y-1">
                {exp.description
                  .filter((desc) => desc?.trim())
                  .map((desc, j) => (
                    <li key={j} className="text-sm text-gray-700 flex items-start">
                      <span className="mr-2 mt-1.5 h-1 w-1 rounded-full bg-gray-400 flex-shrink-0"></span>
                      {desc}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const EducationInfoMain = ({ resumeData }: ResumeSectionProps) => {
  const { educations, colorHex } = resumeData;
  const hasEducations = educations?.filter((edu) =>
    Object.values(edu).some(Boolean),
  );
  if (!hasEducations?.length) return null;

  return (
    <div>
      <MainSectionTitle title="Education" color={colorHex} />
      <div className="space-y-4">
        {hasEducations.map((edu, i) => (
          <div key={i} className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-gray-900">
                {edu.degree}
                {edu.fieldOfStudy && ` in ${edu.fieldOfStudy}`}
              </h4>
              <p className="text-sm text-gray-600">{edu.institution}</p>
            </div>
            {edu.startDate && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 whitespace-nowrap ml-4">
                {formatDate(edu.startDate, "MM/yyyy")} - {edu.endDate ? formatDate(edu.endDate, "MM/yyyy") : "Present"}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectsInfoMain = ({ resumeData }: ResumeSectionProps) => {
  const { projects, colorHex } = resumeData;
  if (!projects?.length) return null;

  return (
    <div>
      <MainSectionTitle title="Projects" color={colorHex} />
      <div className="space-y-4">
        {projects.map((project, i) => (
          <div key={i}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold">
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                    style={{ color: colorHex }}
                  >
                    {project.title}
                  </a>
                ) : (
                  <span style={{ color: colorHex }}>{project.title}</span>
                )}
              </h4>
              {project.startDate && (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 whitespace-nowrap ml-4">
                  {formatDate(project.startDate, "MM/yyyy")} - {project.endDate ? formatDate(project.endDate, "MM/yyyy") : "Ongoing"}
                </span>
              )}
            </div>
            {project?.description && project?.description?.filter(desc => desc?.trim()).length > 0 && (
              <ul className="space-y-1">
                {project.description
                  .filter((desc) => desc?.trim())
                  .map((desc, j) => (
                    <li key={j} className="text-sm text-gray-700 flex items-start">
                      <span className="mr-2 mt-1.5 h-1 w-1 rounded-full bg-gray-400 flex-shrink-0"></span>
                      {desc.trim()}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const AchievementsInfoMain = ({ resumeData }: ResumeSectionProps) => {
  const { achievements, colorHex } = resumeData;
  if (!achievements?.length) return null;

  return (
    <div>
      <MainSectionTitle title="Achievements" color={colorHex} />
      <div className="grid grid-cols-1 gap-2">
        {achievements.map((achievement, i) => (
          <div key={i} className="flex items-start">
            <span 
              className="mr-3 mt-1.5 h-2 w-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: colorHex }}
            ></span>
            <p className="text-sm text-gray-700">{achievement}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumePreviewer2;