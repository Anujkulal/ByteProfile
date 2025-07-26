"use client";

import { Input } from '@/components/ui/input';
import { ResumeServerData } from '@/lib/types';
import { Search } from 'lucide-react';
import React, { useMemo, useState } from 'react'

interface ResumesPageClientProps {
  resumes: ResumeServerData[];
    totalCount: number;
}

const ResumeSearchBar = ({ resumes, totalCount }: ResumesPageClientProps) => {
    const [searchQuery, setSearchQuery] = useState("");

  // Filter resumes based on search query
  const filteredResumes = useMemo(() => {
    if (!searchQuery.trim()) return resumes;

    const query = searchQuery.toLowerCase();
    return resumes.filter((resume) => {
      return (
        resume.title?.toLowerCase().includes(query) ||
        resume.description?.toLowerCase().includes(query) ||
        resume.firstName?.toLowerCase().includes(query) ||
        resume.lastName?.toLowerCase().includes(query) ||
        resume.jobTitle?.toLowerCase().includes(query) ||
        resume.summary?.toLowerCase().includes(query) ||
        resume.experiences?.some(exp => 
          exp.position?.toLowerCase().includes(query) ||
          exp.organization?.toLowerCase().includes(query)
        ) ||
        resume.skills?.some(skill => 
          skill.toLowerCase().includes(query)
        )
      );
    });
  }, [resumes, searchQuery]);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search resumes..."
                className="pl-10 shadow-sm"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {resumes.length} of {totalCount} resumes
            </div>
          </div>
  )
}

export default ResumeSearchBar