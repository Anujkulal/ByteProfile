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

const ResumePreviewer4 = ({ resumeData, className, contentRef, printRef }: ResumePreviewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimension(containerRef);

  const mergeRefs = useMergeRefs<HTMLDivElement | null>(
      containerRef,
      printRef,
    );

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full rounded-md bg-red-500 text-black shadow-lg print:rounded-none print:shadow-none",
        className,
      )}
      ref={containerRef}
    >
      <div
        className={cn("h-full w-full", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        ref={mergeRefs}
        id="resumePreviewContent"
      >
        {/* Header Section */}
        <div 
          className="px-12 py-8 text-white"
          style={{ backgroundColor: resumeData.colorHex || '#1f2937' }}
        >
          <ExecutiveHeader resumeData={resumeData} />
        </div>
        
        {/* Main Content */}
        <div className="px-12 py-8 space-y-8">
          <ExecutiveSummary resumeData={resumeData} />
          <div className="grid grid-cols-3 gap-12">
            <div className="col-span-2 space-y-8">
              <ExecutiveExperience resumeData={resumeData} />
              <ExecutiveProjects resumeData={resumeData} />
            </div>
            <div className="space-y-8">
              <ExecutiveEducation resumeData={resumeData} />
              <ExecutiveSkills resumeData={resumeData} />
              <ExecutiveAchievements resumeData={resumeData} />
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

const ExecutiveSectionTitle = ({ 
  title, 
  color,
  className 
}: { 
  title: string; 
  color: string | undefined;
  className?: string;
}) => (
  <div className={cn("mb-6", className)}>
    <h2 className="text-xl font-light uppercase tracking-widest text-gray-800 mb-2">
      {title}
    </h2>
    <div 
      className="h-px w-full"
      style={{ backgroundColor: color || '#e5e7eb' }}
    />
  </div>
);

const ExecutiveHeader = ({ resumeData }: ResumeSectionProps) => {
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
    email,
    phone,
    city && country ? `${city}, ${country}` : city || country,
    linkedInUrl?.replace("https://", ""),
    githubUrl?.replace("https://", ""),
    websiteUrl?.replace("https://", ""),
  ].filter(Boolean);

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h1 className="text-4xl font-light mb-2 text-white">
          {firstName} <span className="font-normal">{lastName}</span>
        </h1>
        <p className="text-xl text-white/90 font-light mb-4">{jobTitle}</p>
        
        <div className="flex flex-wrap gap-6 text-sm text-white/80">
          {contactItems.map((item, idx) => (
            <span key={idx} className="border-r border-white/30 pr-6 last:border-r-0 last:pr-0">
              {item?.includes('@') || item?.startsWith('www') || item?.includes('.com') ? (
                <a
                  href={item.includes('@') ? `mailto:${item}` : item.startsWith('http') ? item : `https://${item}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {item}
                </a>
              ) : (
                item
              )}
            </span>
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
            className="aspect-square object-cover border-4 border-white/20"
            style={{
              borderRadius:
                borderStyle === BorderStyles.SQUARE
                  ? "0px"
                  : borderStyle === BorderStyles.CIRCLE
                    ? "50%"
                    : "8px",
            }}
          />
        </div>
      )}
    </div>
  );
};

const ExecutiveSummary = ({ resumeData }: ResumeSectionProps) => {
  const { summary, colorHex } = resumeData;
  if (!summary) return null;

  return (
    <div>
      <ExecutiveSectionTitle title="Executive Summary" color={colorHex} />
      <p className="text-base leading-relaxed text-gray-700 font-light">
        {summary}
      </p>
    </div>
  );
};

const ExecutiveExperience = ({ resumeData }: ResumeSectionProps) => {
  const { experiences, colorHex } = resumeData;
  const hasExperiences = experiences?.filter((exp) =>
    Object.values(exp).some(Boolean),
  );
  if (!hasExperiences?.length) return null;

  return (
    <div>
      <ExecutiveSectionTitle title="Professional Experience" color={colorHex} />
      <div className="space-y-8">
        {hasExperiences.map((exp, i) => (
          <div key={i} className="group">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
                <p className="text-base text-gray-600 font-light">{exp.organization}</p>
              </div>
              {exp.startDate && (
                <div className="text-right">
                  <span 
                    className="text-sm font-medium px-3 py-1 rounded-sm text-white"
                    style={{ backgroundColor: colorHex }}
                  >
                    {formatDate(exp.startDate, "MMM yyyy")} - {exp.endDate ? formatDate(exp.endDate, "MMM yyyy") : "Present"}
                  </span>
                </div>
              )}
            </div>
            
            {exp.description && exp.description?.filter(desc => desc?.trim()).length > 0 && (
              <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                {exp.description
                  .filter((desc) => desc?.trim())
                  .map((desc, j) => (
                    <p key={j} className="text-sm text-gray-700 leading-relaxed">
                      {desc}
                    </p>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ExecutiveEducation = ({ resumeData }: ResumeSectionProps) => {
  const { educations, colorHex } = resumeData;
  const hasEducations = educations?.filter((edu) =>
    Object.values(edu).some(Boolean),
  );
  if (!hasEducations?.length) return null;

  return (
    <div>
      <ExecutiveSectionTitle title="Education" color={colorHex} />
      <div className="space-y-4">
        {hasEducations.map((edu, i) => (
          <div key={i}>
            <h4 className="font-medium text-gray-900 text-sm">
              {edu.degree}
            </h4>
            {edu.fieldOfStudy && (
              <p className="text-sm text-gray-600 font-light">{edu.fieldOfStudy}</p>
            )}
            <p className="text-sm text-gray-500">{edu.institution}</p>
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

const ExecutiveProjects = ({ resumeData }: ResumeSectionProps) => {
  const { projects, colorHex } = resumeData;
  if (!projects?.length) return null;

  return (
    <div>
      <ExecutiveSectionTitle title="Key Projects" color={colorHex} />
      <div className="space-y-6">
        {projects.map((project, i) => (
          <div key={i}>
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900">
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
                <span className="text-xs text-gray-500">
                  {formatDate(project.startDate, "MMM yyyy")} - {project.endDate ? formatDate(project.endDate, "MMM yyyy") : "Ongoing"}
                </span>
              )}
            </div>
            {project.description && project.description?.filter(desc => desc?.trim()).length > 0 && (
              <div className="space-y-1 pl-4 border-l border-gray-200">
                {project.description
                  .filter((desc) => desc?.trim())
                  .map((desc, j) => (
                    <p key={j} className="text-sm text-gray-700 leading-relaxed">
                      {desc.trim()}
                    </p>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ExecutiveSkills = ({ resumeData }: ResumeSectionProps) => {
  const { skills, colorHex } = resumeData;
  if (!skills?.length) return null;

  return (
    <div>
      <ExecutiveSectionTitle title="Core Competencies" color={colorHex} />
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

const ExecutiveAchievements = ({ resumeData }: ResumeSectionProps) => {
  const { achievements, colorHex } = resumeData;
  if (!achievements?.length) return null;

  return (
    <div>
      <ExecutiveSectionTitle title="Key Achievements" color={colorHex} />
      <div className="space-y-3">
        {achievements.map((achievement, i) => (
          <div key={i} className="flex items-start">
            <span 
              className="inline-block w-1 h-1 rounded-full mt-2 mr-3 flex-shrink-0"
              style={{ backgroundColor: colorHex }}
            />
            <p className="text-sm text-gray-700 leading-relaxed">{achievement}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumePreviewer4;