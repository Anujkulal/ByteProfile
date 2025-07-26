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
  printRef?: React.RefObject<HTMLDivElement | null>;
}

const ResumePreviewer1 = ({
  resumeData,
  className,
  contentRef,
  printRef,
}: ResumePreviewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimension(containerRef);

  // function mergeRefs<T>(
  //   ...refs: (React.Ref<T> | undefined)[]
  // ): React.RefCallback<T> {
  //   return (value) => {
  //     refs.forEach((ref) => {
  //       if (typeof ref === "function") {
  //         ref(value);
  //       } else if (ref && typeof ref === "object") {
  //         (ref as React.MutableRefObject<T | null>).current = value;
  //       }
  //     });
  //   };
  // }

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
      style={{
        borderColor: resumeData.colorHex,
      }}
      ref={containerRef}
    >
      <div
        className={cn("space-y-6 p-6", !width && "invisible")}
        style={{
          zoom: (1 / 794) * width,
        }}
        ref={mergeRefs}
        id="resumePreviewContent"
      >
        <PersonalInfo resumeData={resumeData} />
        <SummaryInfo resumeData={resumeData} />
        <EducationInfo resumeData={resumeData} />
        <ExperienceInfo resumeData={resumeData} />
        <ProjectsInfo resumeData={resumeData} />
        <AchievementsInfo resumeData={resumeData} />
        <SkillsInfo resumeData={resumeData} />
        <HobbiesInfo resumeData={resumeData} />
      </div>
    </div>
  );
};

interface ResumeSectionProps {
  resumeData: ResumeValues;
  className?: string;
}

const SectionTitle = ({
  title,
  color,
}: {
  title: string;
  color: string | undefined;
}) => (
  <>
    <hr className="border-t-2" style={{ borderColor: color }} />
    <p className="mt-1 text-lg font-semibold" style={{ color }}>
      {title}
    </p>
  </>
);

const PersonalInfo = ({ resumeData, className }: ResumeSectionProps) => {
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
    borderStyle,
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
    linkedInUrl,
    githubUrl,
    websiteUrl,
  ].filter(Boolean);

  return (
    <div className={cn("flex items-center gap-6", className)}>
      {photoSrc && (
        <Image
          src={photoSrc}
          alt="Profile Photo"
          width={100}
          height={100}
          className="aspect-square border object-cover"
          style={{
            borderRadius:
              borderStyle === BorderStyles.SQUARE
                ? "0px"
                : borderStyle === BorderStyles.CIRCLE
                  ? "50%"
                  : "10px",
          }}
        />
      )}
      <div className="space-y-2">
        <div>
          <p
            className="text-2xl leading-tight font-bold"
            style={{ color: colorHex }}
          >
            {firstName} {lastName}
          </p>
          <p className=" font-medium text-gray-700">{jobTitle}</p>
        </div>
        <p className="space-x-1  text-gray-600">
          <span>
            {city}
            {city && country ? "," : ""} {country}
          </span>
          {contactItems.length > 0 && (
            <span>
              {" "}
              |{" "}
              {contactItems.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && " | "}
                  <a
                    href={item === email ? `mailto:${item}` : item === phone ? `tel:${item}` : item}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {item}
                  </a>
                </React.Fragment>
              ))}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

const SummaryInfo = ({ resumeData }: ResumeSectionProps) => {
  const { summary, colorHex } = resumeData;
  if (!summary) return null;
  return (
    <div className="break-inside-avoid space-y-2">
      <SectionTitle title="Summary" color={colorHex} />
      <p className=" whitespace-pre-line text-gray-800">{summary}</p>
    </div>
  );
};

const ExperienceInfo = ({ resumeData }: ResumeSectionProps) => {
  const { experiences, colorHex } = resumeData;
  const hasExperiences = experiences?.filter((exp) =>
    Object.values(exp).some(Boolean),
  );
  if (!hasExperiences?.length) return null;

  return (
    <div className="break-inside-avoid space-y-2">
      <SectionTitle title="Experiences" color={colorHex} />
      {hasExperiences.map((exp, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between  font-semibold">
            <span>{exp.position}</span>
            {exp.startDate && (
              <span>
                {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                {exp.endDate ? formatDate(exp.endDate, "MM/yyyy") : "Present"}
              </span>
            )}
          </div>
          <p className=" font-medium text-gray-700">
            {exp.organization}
          </p>

          <ul className="ml-5 list-disc space-y-0.5  text-gray-700">
            {exp.description
              ?.filter((desc) => desc?.trim())
              .map((desc, i) => (
                <li key={i}>{desc}</li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

const EducationInfo = ({ resumeData }: ResumeSectionProps) => {
  const { educations, colorHex } = resumeData;
  const hasEducations = educations?.filter((edu) =>
    Object.values(edu).some(Boolean),
  );
  if (!hasEducations?.length) return null;

  return (
    <div className="break-inside-avoid space-y-2">
      <SectionTitle title="Education" color={colorHex} />
      {hasEducations.map((edu, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between  font-semibold">
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
          <p className=" font-medium text-gray-700">{edu.institution}</p>
        </div>
      ))}
    </div>
  );
};

const ProjectsInfo = ({ resumeData }: ResumeSectionProps) => {
  const { projects, colorHex } = resumeData;
  if (!projects?.length) return null;

  return (
    <div className="break-inside-avoid space-y-2">
      <SectionTitle title="Projects" color={colorHex} />
      {projects.map((project, i) => (
        <div key={i} className="space-y-1">
          <div className="flex items-center justify-between">
            <h4 className=" font-semibold">
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
              <span className=" text-gray-600">
                {formatDate(project.startDate, "MM/yyyy")} -{" "}
                {project.endDate && formatDate(project.endDate, "MM/yyyy")}
              </span>
            )}
          </div>
          {project.description && project.description?.length > 0 && (
            <ul className="ml-5 list-disc space-y-0.5  text-gray-700">
              {project.description
                .filter((desc) => desc?.trim())
                .map((desc, j) => (
                  <li key={j}>{desc.trim()}</li>
                ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

const SkillsInfo = ({ resumeData }: ResumeSectionProps) => {
  const { skills, colorHex } = resumeData;
  if (!skills?.length) return null;

  return (
    <div className="break-inside-avoid space-y-2">
      <SectionTitle title="Skills" color={colorHex} />
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, i) => (
          <span
            key={i}
            className="rounded border border-gray-300 bg-gray-100 px-2 py-0.5  text-gray-800"
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
  if (!hobbies?.length) return null;

  return (
    <div className="break-inside-avoid space-y-2">
      <SectionTitle title="Hobbies" color={colorHex} />
      <ul className="list-disc space-y-1 pl-5  text-gray-700">
        {hobbies.map((hobby, i) => (
          <li key={i} className="break-words whitespace-normal">
            {hobby}
          </li>
        ))}
      </ul>
    </div>
  );
};

const AchievementsInfo = ({ resumeData }: ResumeSectionProps) => {
  const { achievements, colorHex } = resumeData;
  if (!achievements?.length) return null;

  return (
    <div className="break-inside-avoid space-y-2">
      <SectionTitle title="Achievements" color={colorHex} />
      <ul className="list-disc pl-5  text-gray-700">
        {achievements.map((achievement, i) => (
          <li key={i}>{achievement}</li>
        ))}
      </ul>
    </div>
  );
};

export default ResumePreviewer1;
