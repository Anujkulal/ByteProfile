import useDimension from "@/hooks/useDimension";
import { ResumeValues } from "@/lib/resumeSchema";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { formatDate } from "date-fns";
import { BorderStyles } from "./BorderStyle";

interface ResumePreviewerProps {
  resumeData: ResumeValues;
  className?: string;
}

const ResumePreviewer = ({ resumeData, className }: ResumePreviewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { width } = useDimension(containerRef);

  return (
    <div
      className={cn(
        "aspect-[210/297] h-fit w-full bg-white text-black",
        className,
      )}
      ref={containerRef}
    >
      {" "}
      {/** aspect-[210/297] is the size of A4 paper */}
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
      >
        <PersonalInfo resumeData={resumeData} />
        <SummaryInfo resumeData={resumeData} />
        <EducationInfo resumeData={resumeData} />
        <ExperienceInfo resumeData={resumeData} />
        <ProjectsInfo resumeData={resumeData} />
        <AchievementsInfo resumeData={resumeData} />
        <SkillsInfo resumeData={resumeData} />
        <HobbiesInfo resumeData={resumeData} />
        {/** Add more sections as needed */}
      </div>
    </div>
  );
};

interface ResumeSectionProps {
  resumeData: ResumeValues;
}

const PersonalInfo = ({ resumeData }: ResumeSectionProps) => {
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
    if (objectUrl) {
      setPhotoSrc(objectUrl);
    }

    if (photo === null) {
      setPhotoSrc("");
    }

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [photo]);

  return (
    <div className="flex items-center gap-6">
      {photoSrc && (
        <Image
          src={photoSrc}
          alt="Profile Photo"
          width={100}
          height={100}
          className="aspect-square object-cover"
          style= {{
            borderRadius: borderStyle === BorderStyles.SQUARE ? "0px" : borderStyle === BorderStyles.CIRCLE ? "50%" : "10px",
          }}
        />
      )}
      <div className="space-y-2.5">
        <div className="space-y-1">
          <p className="text-3xl font-bold" style={{ color: colorHex }}>
            {firstName} {lastName}
          </p>
          <p className="font-medium">{jobTitle}</p>
        </div>
        <p className="text-[18px] text-gray-500">
          {" "}
          {city}
          {city && country ? ", " + country + " |" : ""}
          {(city || country) && (phone || email)
            ? " " + [email, phone].filter(Boolean).join(" | ")
            : ""}
          {linkedInUrl && (
            <>
              {" | "}
              <a href={linkedInUrl} target="_blank" rel="noopener noreferrer">
                {linkedInUrl.toString().replace("https://", "")}
              </a>
            </>
          )}{" "}
          {githubUrl && (
            <>
              {" | "}
              <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                {githubUrl.toString().replace("https://", "")}
              </a>
            </>
          )}{" "}
          {websiteUrl && (
            <>
              {" | "}
              <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                {websiteUrl.toString().replace("https://", "")}
              </a>
            </>
          )}{" "}
        </p>
      </div>
    </div>
  );
};

const SummaryInfo = ({ resumeData }: ResumeSectionProps) => {
  const { summary, colorHex } = resumeData;
  if (!summary) return null;
  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="break-inside-avoid space-y-3">
        {" "}
        {/** This is to avoid breaking the section when printing */}
        <p className="text-lg font-semibold" style={{ color: colorHex }}>Professional Profile</p>
        <div className="whitespace-pre-line">{summary}</div>
      </div>
    </>
  );
};

const ExperienceInfo = ({ resumeData }: ResumeSectionProps) => {
  const { experiences, colorHex } = resumeData;

  const hasExperiences = experiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0,
  );

  if (!hasExperiences?.length) return null;

  return (
    <div className="">
      <hr className="border-2" style={{ borderColor: colorHex }}/>
      <div className="space-y-3">
        <p className="text-lg font-semibold" style={{ color: colorHex }}> Experiences </p>
        {hasExperiences.map((exp, index) => (
          <div key={index} className="break-inside-avoid space-y-1">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="">{exp.position}</span>
              {exp.startDate && (
                <span>
                  {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                  {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{exp.organization}</p>
            <div className="text-xs whitespace-pre-line">{exp.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EducationInfo = ({ resumeData }: ResumeSectionProps) => {
  const { educations, colorHex } = resumeData;

  const hasEducations = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0,
  );

  if (!hasEducations?.length) return null;

  return (
    <div className="space-y-3">
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <p className="text-lg font-semibold" style={{ color: colorHex }}>Education</p>
      {hasEducations.map((edu, index) => (
        <div key={index} className="break-inside-avoid space-y-1">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>
              {edu.fieldOfStudy ? `${edu.fieldOfStudy}, ` : ""}
              {edu.degree}
            </span>
            {edu.startDate && (
              <span>
                {formatDate(edu.startDate, "MM/yyyy")} -{" "}
                {edu.endDate ? formatDate(edu.endDate, "MM/yyyy") : "Present"}
              </span>
            )}
          </div>
          <p className="text-xs font-semibold">{edu.institution}</p>
        </div>
      ))}
    </div>
  );
};

const ProjectsInfo = ({ resumeData }: ResumeSectionProps) => {
  const { projects, colorHex } = resumeData;

  if (!projects || !projects.length) return null;

  return (
    <div className="break-inside-avoid space-y-3">
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <p className="text-lg font-semibold" style={{ color: colorHex }}>
        Projects
      </p>
      
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="break-inside-avoid space-y-2">
            {/* Project Header */}
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-gray-900">
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
              
              {/* Date Range */}
              {project.startDate && (
                <span className="text-xs text-gray-600">
                  {formatDate(project.startDate, "MM/yyyy")}
                  {project.endDate && ` - ${formatDate(project.endDate, "MM/yyyy")}`}
                </span>
              )}
            </div>

            {/* Project Description */}
            {project.description && project.description.length > 0 && (
              <ul className="ml-4 space-y-1">
                {project.description
                  .filter(desc => desc?.trim()) // Filter out empty descriptions
                  .map((desc, descIndex) => (
                    <li key={descIndex} className="relative text-xs">
                      <span className="absolute -left-3 top-1.5 h-1 w-1 rounded-full bg-black" />
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

const SkillsInfo = ({ resumeData }: ResumeSectionProps) => {
  const { skills, colorHex } = resumeData;

  if (!skills || !skills.length) return null;

  return (
    <div className="space-y-3">
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <p className="text-lg font-semibold" style={{ color: colorHex }}>Skills</p>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="rounded-sm border border-gray-400 px-2 py-1 text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};


const HobbiesInfo = ({ resumeData }: ResumeSectionProps) => {
  const { hobbies, colorHex } = resumeData;

  if (!hobbies || !hobbies.length) return null;

  return (
    <div className="space-y-3">
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <p className="text-lg font-semibold" style={{ color: colorHex }}>Hobbies</p>
      <ul className="list-disc pl-5">
        {hobbies.map((hobby, index) => (
          <li
            key={index}
            className="text-sm"
          >
            {hobby}
          </li>
        ))}
      </ul>
    </div>
  );
};

const AchievementsInfo = ({ resumeData }: ResumeSectionProps) => {
  const { achievements, colorHex } = resumeData;

  if (!achievements || !achievements.length) return null;

  return (
    <div className="space-y-3">
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <p className="text-lg font-semibold" style={{ color: colorHex }}>Achievements</p>
      <ul className="list-disc pl-5">
        {achievements.map((achievement, index) => (
          <li
            key={index}
            className="text-sm"
          >
            {achievement}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ResumePreviewer;
