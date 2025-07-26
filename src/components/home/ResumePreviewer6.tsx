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

const ResumePreviewer6 = ({ resumeData, className, contentRef, printRef }: ResumePreviewerProps) => {
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
        className={cn("", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        ref={mergeRefs}
        id="resumePreviewContent"
      >
        {/* Header with accent stripe */}
        <div className="relative">
          <div 
            className="h-2 w-full"
            style={{ backgroundColor: resumeData.colorHex || '#3b82f6' }}
          />
          <div className="px-10 py-8">
            <CorporateHeader resumeData={resumeData} />
          </div>
        </div>
        
        {/* Main content area */}
        <div className="px-10 pb-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Main content - 8 columns */}
            <div className="col-span-8 space-y-8">
              <CorporateSummary resumeData={resumeData} />
              <CorporateExperience resumeData={resumeData} />
              <CorporateProjects resumeData={resumeData} />
            </div>
            
            {/* Sidebar - 4 columns */}
            <div className="col-span-4">
              <div className="bg-gray-50 p-6 rounded-lg space-y-6">
                <CorporateContact resumeData={resumeData} />
                <CorporateEducation resumeData={resumeData} />
                <CorporateSkills resumeData={resumeData} />
                <CorporateAchievements resumeData={resumeData} />
                <CorporateHobbies resumeData={resumeData} />
              </div>
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

const CorporateSectionTitle = ({ 
  title, 
  color,
  sidebar = false 
}: { 
  title: string; 
  color: string | undefined;
  sidebar?: boolean;
}) => (
  <div className={cn("mb-4", sidebar && "mb-3")}>
    <h2 className={cn(
      "font-bold text-gray-900 mb-2",
      sidebar ? "text-sm uppercase tracking-wider" : "text-lg"
    )}>
      {title}
    </h2>
    {!sidebar && (
      <div className="flex items-center">
        <div 
          className="h-1 w-12 rounded"
          style={{ backgroundColor: color || '#3b82f6' }}
        />
        <div className="h-px flex-1 bg-gray-300 ml-4" />
      </div>
    )}
    {sidebar && (
      <div 
        className="h-px w-full"
        style={{ backgroundColor: color || '#3b82f6' }}
      />
    )}
  </div>
);

const CorporateHeader = ({ resumeData }: ResumeSectionProps) => {
  const { 
    photo, 
    firstName, 
    lastName, 
    jobTitle, 
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

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <h1 className="text-5xl font-light text-gray-900 mb-3">
          {firstName}
        </h1>
        <h1 className="text-5xl font-bold text-gray-900 mb-4 -mt-3">
          {lastName}
        </h1>
        <div className="flex items-center">
          <div 
            className="h-1 w-20 rounded mr-4"
            style={{ backgroundColor: colorHex }}
          />
          <h2 
            className="text-xl font-medium tracking-wide"
            style={{ color: colorHex }}
          >
            {jobTitle}
          </h2>
        </div>
      </div>
      
      {photoSrc && (
        <div className="ml-8">
          <Image
            src={photoSrc}
            alt="Profile Photo"
            width={140}
            height={140}
            className="aspect-square object-cover shadow-lg"
            style={{
              borderRadius:
                borderStyle === BorderStyles.SQUARE
                  ? "8px"
                  : borderStyle === BorderStyles.CIRCLE
                    ? "50%"
                    : "16px",
            }}
          />
        </div>
      )}
    </div>
  );
};

const CorporateContact = ({ resumeData }: ResumeSectionProps) => {
  const { city, country, email, phone, linkedInUrl, githubUrl, websiteUrl, colorHex } = resumeData;

  const contactItems = [
    { icon: "📍", label: "Location", value: `${city}${city && country ? ", " : ""}${country}` },
    { icon: "✉️", label: "Email", value: email, link: `mailto:${email}` },
    { icon: "📞", label: "Phone", value: phone, link: `tel:${phone}` },
    { icon: "🔗", label: "LinkedIn", value: linkedInUrl?.replace("https://", ""), link: linkedInUrl },
    { icon: "💻", label: "GitHub", value: githubUrl?.replace("https://", ""), link: githubUrl },
    { icon: "🌐", label: "Website", value: websiteUrl?.replace("https://", ""), link: websiteUrl },
  ].filter(item => item.value);

  if (contactItems.length === 0) return null;

  return (
    <div>
      <CorporateSectionTitle title="Contact Information" color={colorHex} sidebar />
      <div className="space-y-3">
        {contactItems.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <span className="text-sm mt-0.5">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1">
                {item.label}
              </p>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-800 hover:underline break-all"
                >
                  {item.value}
                </a>
              ) : (
                <p className="text-sm text-gray-800 break-words">{item.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CorporateSummary = ({ resumeData }: ResumeSectionProps) => {
  const { summary, colorHex } = resumeData;
  if (!summary) return null;

  return (
    <div>
      <CorporateSectionTitle title="Executive Summary" color={colorHex} />
      <div className="bg-gray-50 p-6 rounded-lg border-l-4" style={{ borderLeftColor: colorHex }}>
        <p className="text-gray-700 leading-relaxed text-justify italic">
          "{summary}"
        </p>
      </div>
    </div>
  );
};

const CorporateExperience = ({ resumeData }: ResumeSectionProps) => {
  const { experiences, colorHex } = resumeData;
  const hasExperiences = experiences?.filter((exp) =>
    Object.values(exp).some(Boolean),
  );
  if (!hasExperiences?.length) return null;

  return (
    <div>
      <CorporateSectionTitle title="Professional Experience" color={colorHex} />
      <div className="space-y-8">
        {hasExperiences.map((exp, i) => (
          <div key={i} className="relative">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{exp.position}</h3>
                <p className="text-lg text-gray-600 font-medium">{exp.organization}</p>
              </div>
              {exp.startDate && (
                <div className="ml-6">
                  <div 
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium text-center"
                    style={{ backgroundColor: colorHex }}
                  >
                    <div className="whitespace-nowrap">
                      {formatDate(exp.startDate, "MMM yyyy")}
                    </div>
                    <div className="text-xs opacity-90">to</div>
                    <div className="whitespace-nowrap">
                      {exp.endDate ? formatDate(exp.endDate, "MMM yyyy") : "Present"}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {exp.description && exp.description?.filter(desc => desc?.trim()).length > 0 && (
              <div className="mt-4 space-y-3">
                {exp.description
                  .filter((desc) => desc?.trim())
                  .map((desc, j) => (
                    <div key={j} className="flex items-start">
                      <div 
                        className="w-2 h-2 rounded-full mt-2 mr-4 flex-shrink-0"
                        style={{ backgroundColor: colorHex }}
                      />
                      <p className="text-gray-700 leading-relaxed">{desc}</p>
                    </div>
                  ))}
              </div>
            )}
            
            {i < hasExperiences.length - 1 && (
              <div className="mt-8 border-b border-gray-200" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CorporateEducation = ({ resumeData }: ResumeSectionProps) => {
  const { educations, colorHex } = resumeData;
  const hasEducations = educations?.filter((edu) =>
    Object.values(edu).some(Boolean),
  );
  if (!hasEducations?.length) return null;

  return (
    <div>
      <CorporateSectionTitle title="Education" color={colorHex} sidebar />
      <div className="space-y-4">
        {hasEducations.map((edu, i) => (
          <div key={i} className="border-l-2 pl-4" style={{ borderColor: colorHex }}>
            <h4 className="font-semibold text-sm text-gray-900">
              {edu.degree}
            </h4>
            {edu.fieldOfStudy && (
              <p className="text-sm text-gray-600 font-medium">{edu.fieldOfStudy}</p>
            )}
            <p className="text-xs text-gray-500 font-medium">{edu.institution}</p>
            {edu.startDate && (
              <p className="text-xs mt-1 font-medium" style={{ color: colorHex }}>
                {formatDate(edu.startDate, "yyyy")} - {edu.endDate ? formatDate(edu.endDate, "yyyy") : "Present"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CorporateProjects = ({ resumeData }: ResumeSectionProps) => {
  const { projects, colorHex } = resumeData;
  if (!projects?.length) return null;

  return (
    <div>
      <CorporateSectionTitle title="Key Projects" color={colorHex} />
      <div className="grid grid-cols-1 gap-6">
        {projects.map((project, i) => (
          <div key={i} className="bg-white border rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-lg font-semibold">
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
                <span className="text-sm text-gray-500 whitespace-nowrap ml-4">
                  {formatDate(project.startDate, "MMM yyyy")} - {project.endDate ? formatDate(project.endDate, "MMM yyyy") : "Ongoing"}
                </span>
              )}
            </div>
            {project.description && project.description?.filter(desc => desc?.trim()).length > 0 && (
              <div className="space-y-2">
                {project.description
                  .filter((desc) => desc?.trim())
                  .map((desc, j) => (
                    <div key={j} className="flex items-start">
                      <span 
                        className="inline-block w-1.5 h-1.5 rounded-full mt-2 mr-3 flex-shrink-0"
                        style={{ backgroundColor: colorHex }}
                      />
                      <p className="text-sm text-gray-700 leading-relaxed">{desc.trim()}</p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const CorporateSkills = ({ resumeData }: ResumeSectionProps) => {
  const { skills, colorHex } = resumeData;
  if (!skills?.length) return null;

  return (
    <div>
      <CorporateSectionTitle title="Core Competencies" color={colorHex} sidebar />
      <div className="grid grid-cols-1 gap-2">
        {skills.map((skill, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
            <span className="text-sm text-gray-700">{skill}</span>
            <div 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colorHex }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const CorporateAchievements = ({ resumeData }: ResumeSectionProps) => {
  const { achievements, colorHex } = resumeData;
  if (!achievements?.length) return null;

  return (
    <div>
      <CorporateSectionTitle title="Key Achievements" color={colorHex} sidebar />
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

const CorporateHobbies = ({ resumeData }: ResumeSectionProps) => {
  const { hobbies, colorHex } = resumeData;
  if (!hobbies?.length) return null;

  return (
    <div>
      <CorporateSectionTitle title="Personal Interests" color={colorHex} sidebar />
      <div className="flex flex-wrap gap-2">
        {hobbies.map((hobby, i) => (
          <span
            key={i}
            className="text-xs px-3 py-1 bg-white rounded-full border text-gray-700 shadow-sm"
            style={{ borderColor: colorHex }}
          >
            {hobby}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ResumePreviewer6;