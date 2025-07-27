import { Prisma } from "@/generated/prisma";
import { ResumeValues } from "./resumeSchema";

export interface ResumeEditorFormProps {
    resumeData: ResumeValues;
    setResumeData: (data: ResumeValues) => void;
}


export const resumeDataInclude = {
  experiences: true,
  educations: true,
  projects: true,
} satisfies Prisma.ResumeInclude;

export type ResumeServerData = Prisma.ResumeGetPayload<{
  include: typeof resumeDataInclude;
}>;

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  watchers_count: number;
  language: string | null;
  fork: boolean;
  forks_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  clone_url: string;
  topics: string[];
  visibility: string;
  default_branch: string;
}

export interface GitHubApiResponse {
  user: GitHubUser;
  topRepos: GitHubRepo[];
}

export interface ErrorResponse {
  error: string;
  message?: string;
}