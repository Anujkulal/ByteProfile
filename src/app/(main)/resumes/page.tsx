import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";

export const metadata: Metadata = {
  title: "Resumes",
  description: "Resumes page",
};

type Props = {};

const ResumesPage = (props: Props) => {
  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8">
      <div className="mx-auto flex w-fit">

      <Button asChild variant={"default"}>
        <Link href={"/resume-editor"} className="flex gap-2">
          <PlusCircle size={30} />
          Resume
        </Link>
      </Button>
      </div>
    </main>
  );
};

export default ResumesPage;
