"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/assets/logo.png"; // Adjust the path as necessary
import { UserButton } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import ThemeToggler from "@/components/home/ThemeToggler";
import {dark} from "@clerk/themes"
import { useTheme } from "next-themes";

const Navbar = () => {
  const {theme} = useTheme();
  return (
    <header className="shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-3">
        <Link href={"/resumes"} className="flex items-center gap-2">
          <Image src={logo} alt="Logo" width={35} height={35} className="" />
          <span className="text-xl font-bold tracking-tight">ByteProfile</span>
        </Link>
        <div className="flex items-center gap-4">

        <ThemeToggler />
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
            <UserButton.Link
              label="Billing"
              labelIcon={<CreditCard className="size-4" />}
              href="/billing"
              />
          </UserButton.MenuItems>
        </UserButton>
              </div>
      </div>
    </header>
  );
};

export default Navbar;
