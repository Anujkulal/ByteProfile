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

const ResumePreviewer3 = ({ resumeData, className, contentRef, printRef }: ResumePreviewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimension(containerRef);
  const mergeRefs = useMergeRefs<HTMLDivElement | null>(
      contentRef,
      printRef,
    );

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full rounded-md bg-gray-50 text-black shadow-lg print:rounded-none print:shadow-none",
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn("p-6 space-y-4", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        ref={mergeRefs}
        id="resumePreviewContent"
      >
        <HeaderCard resumeData={resumeData} />
        <div className="grid grid-cols-1 gap-4">
          <SummaryCard resumeData={resumeData} />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <ExperienceCard resumeData={resumeData} />
              <ProjectsCard resumeData={resumeData} />
            </div>
            <div className="space-y-4">
              <EducationCard resumeData={resumeData} />
              <SkillsCard resumeData={resumeData} />
              <AchievementsCard resumeData={resumeData} />
              <HobbiesCard resumeData={resumeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ResumeSectionProps {
  resumeData: ResumeValues;
  className?: string;
}

const Card = ({ 
  children, 
  className, 
  accentColor 
}: { 
  children: React.ReactNode; 
  className?: string;
  accentColor?: string;
}) => (
  <div 
    className={cn(
      "bg-white rounded-lg shadow-sm border-l-4 p-4",
      className
    )}
    style={{ borderLeftColor: accentColor || '#e5e7eb' }}
  >
    {children}
  </div>
);

const CardTitle = ({ 
  title, 
  icon, 
  color 
}: { 
  title: string; 
  icon?: string;
  color?: string;
}) => (
  <div className="flex items-center gap-2 mb-3">
    {icon && <span className="text-lg">{icon}</span>}
    <h2 
      className="text-lg font-bold tracking-wide"
      style={{ color: color || '#374151' }}
    >
      {title}
    </h2>
  </div>
);

const HeaderCard = ({ resumeData }: ResumeSectionProps) => {
  const { 
    photo, 
    firstName, 
    lastName, 
    jobTitle, 
    city, 
    country, 
    email, 
    phone, 
    linkedInUrl, 
    githubUrl, 
    websiteUrl, 
    colorHex,
    borderStyle 
  } = resumeData;

  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);

  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  const contactItems = [
    { icon: "📍", value: `${city}${city && country ? ", " : ""}${country}` },
    { icon: "📧", value: email, link: `mailto:${email}` },
    { icon: "📱", value: phone, link: `tel:${phone}` },
    { icon: "🔗", value: linkedInUrl?.replace("https://", ""), link: linkedInUrl },
    { icon: "💻", value: githubUrl?.replace("https://", ""), link: githubUrl },
    { icon: "🌐", value: websiteUrl?.replace("https://", ""), link: websiteUrl },
  ].filter(item => item.value);

  return (
    <Card accentColor={colorHex}>
      <div className="flex items-center gap-6">
        {photoSrc && (
          <div className="flex-shrink-0">
            <Image
              src={photoSrc}
              alt="Profile Photo"
              width={80}
              height={80}
              className="aspect-square object-cover shadow-md"
              style={{
                borderRadius:
                  borderStyle === BorderStyles.SQUARE
                    ? "8px"
                    : borderStyle === BorderStyles.CIRCLE
                      ? "50%"
                      : "12px",
              }}
            />
          </div>
        )}
        <div className="flex-1">
          <h1 
            className="text-3xl font-bold mb-1"
            style={{ color: colorHex }}
          >
            {firstName} {lastName}
          </h1>
          <p className="text-lg text-gray-600 font-medium mb-3">{jobTitle}</p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            {contactItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1">
                <span>{item.icon}</span>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-800 hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="text-gray-600">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

const SummaryCard = ({ resumeData }: ResumeSectionProps) => {
  const { summary, colorHex } = resumeData;
  if (!summary) return null;

  return (
    <Card accentColor={colorHex}>
      <CardTitle title="Professional Summary" icon="💼" color={colorHex} />
      <p className="text-sm leading-relaxed text-gray-700 italic">
        "{summary}"
      </p>
    </Card>
  );
};

const ExperienceCard = ({ resumeData }: ResumeSectionProps) => {
  const { experiences, colorHex } = resumeData;
  const hasExperiences = experiences?.filter((exp) =>
    Object.values(exp).some(Boolean),
  );
  if (!hasExperiences?.length) return null;

  return (
    <Card accentColor={colorHex}>
      <CardTitle title="Experience" icon="🚀" color={colorHex} />
      <div className="space-y-4">
        {hasExperiences.map((exp, i) => (
          <div key={i} className="relative">
            <div className="bg-gray-50 rounded-md p-3">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm">{exp.position}</h4>
                  <p className="text-xs text-gray-600 font-medium">{exp.organization}</p>
                </div>
                {exp.startDate && (
                  <span 
                    className="text-xs px-2 py-1 rounded text-white text-right"
                    style={{ backgroundColor: colorHex }}
                  >
                    {formatDate(exp.startDate, "MM/yy")} - {exp.endDate ? formatDate(exp.endDate, "MM/yy") : "Now"}
                  </span>
                )}
              </div>
              {exp.description && exp.description?.filter(desc => desc?.trim()).length > 0 && (
                <ul className="space-y-1 mt-2">
                  {exp.description
                    .filter((desc) => desc?.trim())
                    .slice(0, 2) // Limit to 2 items for space
                    .map((desc, j) => (
                      <li key={j} className="text-xs text-gray-600 flex items-start">
                        <span className="mr-2 mt-1 text-xs">•</span>
                        {desc}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

const EducationCard = ({ resumeData }: ResumeSectionProps) => {
  const { educations, colorHex } = resumeData;
  const hasEducations = educations?.filter((edu) =>
    Object.values(edu).some(Boolean),
  );
  if (!hasEducations?.length) return null;

  return (
    <Card accentColor={colorHex}>
      <CardTitle title="Education" icon="🎓" color={colorHex} />
      <div className="space-y-3">
        {hasEducations.map((edu, i) => (
          <div key={i} className="bg-gray-50 rounded-md p-3">
            <h4 className="font-semibold text-sm text-gray-900">
              {edu.degree}
            </h4>
            {edu.fieldOfStudy && (
              <p className="text-xs text-gray-600">{edu.fieldOfStudy}</p>
            )}
            <p className="text-xs text-gray-500 font-medium">{edu.institution}</p>
            {edu.startDate && (
              <p className="text-xs mt-1" style={{ color: colorHex }}>
                {formatDate(edu.startDate, "MM/yyyy")} - {edu.endDate ? formatDate(edu.endDate, "MM/yyyy") : "Present"}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

const ProjectsCard = ({ resumeData }: ResumeSectionProps) => {
  const { projects, colorHex } = resumeData;
  if (!projects?.length) return null;

  return (
    <Card accentColor={colorHex}>
      <CardTitle title="Projects" icon="⚡" color={colorHex} />
      <div className="space-y-3">
        {projects.slice(0, 3).map((project, i) => ( // Limit to 3 projects
          <div key={i} className="bg-gray-50 rounded-md p-3">
            <div className="flex justify-between items-start mb-1">
              <h4 className="font-semibold text-sm">
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
            </div>
            {project.description && project.description?.filter(desc => desc?.trim()).length > 0 && (
              <p className="text-xs text-gray-600 line-clamp-2">
                {project.description.filter(desc => desc?.trim())[0]?.trim()}
              </p>
            )}
            {project.startDate && (
              <p className="text-xs mt-1 text-gray-500">
                {formatDate(project.startDate, "MM/yyyy")} - {project.endDate ? formatDate(project.endDate, "MM/yyyy") : "Ongoing"}
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

const SkillsCard = ({ resumeData }: ResumeSectionProps) => {
  const { skills, colorHex } = resumeData;
  if (!skills?.length) return null;

  return (
    <Card accentColor={colorHex}>
      <CardTitle title="Skills" icon="🛠️" color={colorHex} />
      <div className="flex flex-wrap gap-1">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="text-xs px-2 py-1 rounded-full text-white font-medium"
            style={{ backgroundColor: colorHex }}
          >
            {skill}
          </span>
        ))}
      </div>
    </Card>
  );
};

const AchievementsCard = ({ resumeData }: ResumeSectionProps) => {
  const { achievements, colorHex } = resumeData;
  if (!achievements?.length) return null;

  return (
    <Card accentColor={colorHex}>
      <CardTitle title="Achievements" icon="🏆" color={colorHex} />
      <div className="space-y-2">
        {achievements.slice(0, 4).map((achievement, i) => ( // Limit to 4 achievements
          <div key={i} className="flex items-start gap-2">
            <span 
              className="mt-1.5 h-1.5 w-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: colorHex }}
            ></span>
            <p className="text-xs text-gray-700 leading-relaxed">{achievement}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

const HobbiesCard = ({ resumeData }: ResumeSectionProps) => {
  const { hobbies, colorHex } = resumeData;
  if (!hobbies?.length) return null;

  return (
    <Card accentColor={colorHex}>
      <CardTitle title="Interests" icon="🎨" color={colorHex} />
      <div className="flex flex-wrap gap-1">
        {hobbies.map((hobby, i) => (
          <span
            key={i}
            className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded border"
          >
            {hobby}
          </span>
        ))}
      </div>
    </Card>
  );
};

export default ResumePreviewer3;