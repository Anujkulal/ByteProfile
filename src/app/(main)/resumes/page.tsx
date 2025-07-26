import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { PlusCircle, FileText, Clock, Search } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import ResumeCard from "./ResumeCard";
import { resumeDataInclude } from "@/lib/types";
import { Input } from "@/components/ui/input";
import ResumeSearchBar from "./ResumeSearchBar";

export const metadata: Metadata = {
  title: "Your Resumes - ByteProfile",
  description: "Manage and create professional resumes",
};

type Props = {};

const ResumesPage = async (props: Props) => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const [resumes, totalCount] = await Promise.all([
    prisma.resume.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
      include: resumeDataInclude,
    }),
    prisma.resume.count({
      where: {
        userId,
      },
    }),
  ]);

  const recentResumes = resumes.slice(0, 3);
  const hasResumes = resumes.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-white to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <main className="mx-auto w-full max-w-7xl px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col space-y-6 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
              Your Resumes
            </h1>
            <p className="text-lg text-muted-foreground">
              Create, edit, and manage your professional resumes
            </p>
          </div>
          
          <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300">
            <Link href={"/resume-editor"} className="flex items-center gap-3">
              <PlusCircle className="h-5 w-5" />
              Create New Resume
            </Link>
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <h3 className="font-medium">Total Resumes</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{totalCount}</p>
          </div>
          
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <h3 className="font-medium">Recently Updated</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{recentResumes.length}</p>
          </div>
          
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center space-x-2">
              <PlusCircle className="h-5 w-5 text-purple-600" />
              <h3 className="font-medium">This Month</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {resumes.filter(resume => {
                const thisMonth = new Date();
                thisMonth.setDate(1);
                return resume.createdAt >= thisMonth;
              }).length}
            </p>
          </div>
        </div>

        {/* Search and Filter Section */}
        {/* {hasResumes && (
          <ResumeSearchBar resumes={resumes} totalCount={totalCount} />
        )} */}

        {/* Content Section */}
        {!hasResumes ? (
          // Empty State
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-6">
              <FileText className="h-12 w-12 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">No resumes yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Get started by creating your first professional resume. Our AI-powered tools will help you craft the perfect resume.
            </p>
            <Button asChild size="lg" className="shadow-lg">
              <Link href={"/resume-editor"} className="flex items-center gap-2">
                <PlusCircle className="h-5 w-5" />
                Create Your First Resume
              </Link>
            </Button>
          </div>
        ) : (
          // Resumes Grid
          <div className="space-y-8">
            {/* Recent Resumes Section */}
            {recentResumes.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recent</h2>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="#all-resumes">View All</Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {recentResumes.map((resume) => (
                    <ResumeCard key={resume.id} resume={resume} />
                  ))}
                </div>
              </div>
            )}

            {/* All Resumes Section */}
            <div className="space-y-4" id="all-resumes">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  All Resumes
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({totalCount})
                  </span>
                </h2>
                {/* <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    Sort by Date
                  </Button>
                </div> */}
              </div>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {resumes.map((resume) => (
                  <ResumeCard key={resume.id} resume={resume} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Section */}
        {hasResumes && (
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>Made with ❤️ by Anuj Kulal</span>
              <Button variant="link" size="sm" className="p-0 h-auto">
                ByteProfile
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ResumesPage;
