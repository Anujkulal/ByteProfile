"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/assets/logo.png"; // Adjust the path as necessary
import { UserButton } from "@clerk/nextjs";
import { CircleChevronLeft, CircleX, CreditCard, Moon, Sun } from "lucide-react";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const showResumeExitButton = pathname.startsWith("/resume-editor");

  const handleThemeToggle = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-zinc-900/10">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-2">
        <div className="flex justify-between gap-4">
          <Link href={"/"} className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Logo"
              width={35}
              height={35}
              className="rounded-full"
            />
            <span className="text-xl font-bold tracking-tight">
              ByteProfile
            </span>
          </Link>
          {showResumeExitButton && (
            <Button
              variant={"ghost"}
              className=""
              asChild
            >
              <Link href={"/resumes"}>
                <CircleChevronLeft />
              </Link>
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <UserButton
            appearance={{
              elements: {
                avatarBox: {
                  width: "40px",
                  height: "40px",
                },
              },
              baseTheme: theme === "dark" ? dark : undefined,
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Action
                label={theme === "light" ? "Light Mode" : "Dark Mode"}
                labelIcon={
                  theme === "light" ? (
                    <Sun className="size-4" />
                  ) : (
                    <Moon className="size-4" />
                  )
                }
                onClick={handleThemeToggle}
              />
              <UserButton.Action label="manageAccount" />
              <UserButton.Action label="signOut" />
            </UserButton.MenuItems>
          </UserButton>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
