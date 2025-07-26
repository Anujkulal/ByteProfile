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

const ResumePreviewer5 = ({ resumeData, className, contentRef, printRef }: ResumePreviewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimension(containerRef);

  const mergeRefs = useMergeRefs<HTMLDivElement | null>(
      contentRef,
      printRef,
    );

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full rounded-md bg-white text-black shadow-lg print:rounded-none print:shadow-none",
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn("p-8 space-y-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        ref={mergeRefs}
        id="resumePreviewContent"
      >
        <TimelineHeader resumeData={resumeData} />
        <TimelineSummary resumeData={resumeData} />
        
        <div className="grid grid-cols-10 gap-8">
          {/* Main Timeline Content */}
          <div className="col-span-7 space-y-8">
            <TimelineExperience resumeData={resumeData} />
            <TimelineProjects resumeData={resumeData} />
          </div>
          
          {/* Sidebar */}
          <div className="col-span-3 space-y-6">
            <TimelineEducation resumeData={resumeData} />
            <TimelineSkills resumeData={resumeData} />
            <TimelineAchievements resumeData={resumeData} />
            <TimelineHobbies resumeData={resumeData} />
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

const TimelineSectionTitle = ({ 
  title, 
  color,
  mainSection = false 
}: { 
  title: string; 
  color: string | undefined;
  mainSection?: boolean;
}) => (
  <div className={cn("relative", mainSection ? "mb-8" : "mb-4")}>
    <h2 className={cn(
      "font-bold uppercase tracking-wider text-gray-800",
      mainSection ? "text-lg" : "text-base"
    )}>
      {title}
    </h2>
    <div className="flex items-center mt-2">
      <div 
        className={cn("h-0.5", mainSection ? "w-16" : "w-12")}
        style={{ backgroundColor: color || '#6b7280' }}
      />
      <div className="h-0.5 w-full bg-gray-200 ml-2" />
    </div>
  </div>
);

const TimelineItem = ({ 
  children, 
  color,
  isLast = false 
}: { 
  children: React.ReactNode;
  color?: string;
  isLast?: boolean;
}) => (
  <div className="relative pl-8">
    {/* Timeline dot */}
    <div 
      className="absolute left-0 top-1 w-3 h-3 rounded-full border-2 bg-white"
      style={{ borderColor: color || '#6b7280' }}
    />
    {/* Timeline line */}
    {!isLast && (
      <div 
        className="absolute left-1.5 top-4 w-0.5 h-full bg-gray-200"
        style={{ backgroundColor: color ? `${color}20` : '#e5e7eb' }}
      />
    )}
    <div className="pb-6">
      {children}
    </div>
  </div>
);

const TimelineHeader = ({ resumeData }: ResumeSectionProps) => {
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
    { label: "Email", value: email, link: `mailto:${email}` },
    { label: "Phone", value: phone, link: `tel:${phone}` },
    { label: "Location", value: `${city}${city && country ? ", " : ""}${country}` },
    { label: "LinkedIn", value: linkedInUrl?.replace("https://", ""), link: linkedInUrl },
    { label: "GitHub", value: githubUrl?.replace("https://", ""), link: githubUrl },
    { label: "Website", value: websiteUrl?.replace("https://", ""), link: websiteUrl },
  ].filter(item => item.value);

  return (
    <div className="border-b-2 pb-6" style={{ borderColor: colorHex }}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {firstName} {lastName}
          </h1>
          <h2 
            className="text-xl font-medium mb-4"
            style={{ color: colorHex }}
          >
            {jobTitle}
          </h2>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {contactItems.map((item, idx) => (
              <div key={idx} className="flex items-center">
                <span className="font-medium text-gray-600 w-20">{item.label}:</span>
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:underline ml-2"
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="text-gray-800 ml-2">{item.value}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {photoSrc && (
          <div className="ml-8">
            <Image
              src={photoSrc}
              alt="Profile Photo"
              width={120}
              height={120}
              className="aspect-square object-cover border-4"
              style={{
                borderColor: colorHex,
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
      </div>
    </div>
  );
};

const TimelineSummary = ({ resumeData }: ResumeSectionProps) => {
  const { summary, colorHex } = resumeData;
  if (!summary) return null;

  return (
    <div>
      <TimelineSectionTitle title="Professional Summary" color={colorHex} mainSection />
      <p className="text-gray-700 leading-relaxed text-justify">
        {summary}
      </p>
    </div>
  );
};

const TimelineExperience = ({ resumeData }: ResumeSectionProps) => {
  const { experiences, colorHex } = resumeData;
  const hasExperiences = experiences?.filter((exp) =>
    Object.values(exp).some(Boolean),
  );
  if (!hasExperiences?.length) return null;

  return (
    <div>
      <TimelineSectionTitle title="Professional Experience" color={colorHex} mainSection />
      <div className="">
        {hasExperiences.map((exp, i) => (
          <TimelineItem 
            key={i} 
            color={colorHex} 
            isLast={i === hasExperiences.length - 1}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                <p className="text-base font-medium text-gray-600">{exp.organization}</p>
              </div>
              {exp.startDate && (
                <div 
                  className="text-sm font-medium px-3 py-1 rounded text-white whitespace-nowrap ml-4"
                  style={{ backgroundColor: colorHex }}
                >
                  {formatDate(exp.startDate, "MMM yyyy")} - {exp.endDate ? formatDate(exp.endDate, "MMM yyyy") : "Present"}
                </div>
              )}
            </div>
            
            {exp.description && exp.description?.filter(desc => desc?.trim()).length > 0 && (
              <ul className="space-y-2 mt-3">
                {exp.description
                  .filter((desc) => desc?.trim())
                  .map((desc, j) => (
                    <li key={j} className="text-sm text-gray-700 flex items-start">
                      <span 
                        className="inline-block w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0"
                        style={{ backgroundColor: colorHex }}
                      />
                      {desc}
                    </li>
                  ))}
              </ul>
            )}
          </TimelineItem>
        ))}
      </div>
    </div>
  );
};

const TimelineProjects = ({ resumeData }: ResumeSectionProps) => {
  const { projects, colorHex } = resumeData;
  if (!projects?.length) return null;

  return (
    <div>
      <TimelineSectionTitle title="Notable Projects" color={colorHex} mainSection />
      <div className="">
        {projects.map((project, i) => (
          <TimelineItem 
            key={i} 
            color={colorHex} 
            isLast={i === projects.length - 1}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-base font-semibold">
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
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {formatDate(project.startDate, "MMM yyyy")} - {project.endDate ? formatDate(project.endDate, "MMM yyyy") : "Ongoing"}
                </span>
              )}
            </div>
            {project.description &&  project.description?.filter(desc => desc?.trim()).length > 0 && (
              <ul className="space-y-1 mt-2">
                {project.description
                  .filter((desc) => desc?.trim())
                  .map((desc, j) => (
                    <li key={j} className="text-sm text-gray-700 flex items-start">
                      <span 
                        className="inline-block w-1 h-1 rounded-full mt-2 mr-3 flex-shrink-0"
                        style={{ backgroundColor: colorHex }}
                      />
                      {desc.trim()}
                    </li>
                  ))}
              </ul>
            )}
          </TimelineItem>
        ))}
      </div>
    </div>
  );
};

const TimelineEducation = ({ resumeData }: ResumeSectionProps) => {
  const { educations, colorHex } = resumeData;
  const hasEducations = educations?.filter((edu) =>
    Object.values(edu).some(Boolean),
  );
  if (!hasEducations?.length) return null;

  return (
    <div>
      <TimelineSectionTitle title="Education" color={colorHex} />
      <div className="space-y-4">
        {hasEducations.map((edu, i) => (
          <div key={i} className="border-l-2 pl-4 pb-4" style={{ borderColor: colorHex }}>
            <h4 className="font-semibold text-sm text-gray-900">
              {edu.degree}
            </h4>
            {edu.fieldOfStudy && (
              <p className="text-sm text-gray-600">{edu.fieldOfStudy}</p>
            )}
            <p className="text-xs text-gray-500 font-medium">{edu.institution}</p>
            {edu.startDate && (
              <p className="text-xs mt-1" style={{ color: colorHex }}>
                {formatDate(edu.startDate, "yyyy")} - {edu.endDate ? formatDate(edu.endDate, "yyyy") : "Present"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const TimelineSkills = ({ resumeData }: ResumeSectionProps) => {
  const { skills, colorHex } = resumeData;
  if (!skills?.length) return null;

  return (
    <div>
      <TimelineSectionTitle title="Technical Skills" color={colorHex} />
      <div className="space-y-2">
        {skills.map((skill, i) => (
          <div key={i} className="flex items-center">
            <div 
              className="w-2 h-2 rounded-full mr-3"
              style={{ backgroundColor: colorHex }}
            />
            <span className="text-sm text-gray-700">{skill}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TimelineAchievements = ({ resumeData }: ResumeSectionProps) => {
  const { achievements, colorHex } = resumeData;
  if (!achievements?.length) return null;

  return (
    <div>
      <TimelineSectionTitle title="Achievements" color={colorHex} />
      <div className="space-y-3">
        {achievements.map((achievement, i) => (
          <div key={i} className="flex items-start">
            <span 
              className="inline-block w-1.5 h-1.5 rounded-full mt-1.5 mr-3 flex-shrink-0"
              style={{ backgroundColor: colorHex }}
            />
            <p className="text-sm text-gray-700 leading-tight">{achievement}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const TimelineHobbies = ({ resumeData }: ResumeSectionProps) => {
  const { hobbies, colorHex } = resumeData;
  if (!hobbies?.length) return null;

  return (
    <div>
      <TimelineSectionTitle title="Interests" color={colorHex} />
      <div className="flex flex-wrap gap-2">
        {hobbies.map((hobby, i) => (
          <span
            key={i}
            className="text-xs px-2 py-1 rounded-full border text-gray-700"
            style={{ borderColor: colorHex }}
          >
            {hobby}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ResumePreviewer5;