"use client";

import { GithubIcon } from "~/components/icons";
import { Input } from "~/components/ui/input";
import Label from "~/components/ui/label";
import { cn } from "~/lib/utils";
import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div className="w-full flex items-center justify-center mt-10">
      <div className="relative w-[664px] h-[827px] md:p-[70px] p-5 rounded-[32px] bg-gradient-to-b from-brand">
        <div className="bg-white rounded-[28px] w-full h-full p-8">
          <h1 className="text-3xl font-bold">Sign up for an account</h1>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label>Full name</Label>
              <Input placeholder="Manu Arora" />
            </div>
            <div className="space-y-2">
              <Label>Email address</Label>
              <Input placeholder="hello@johndoe.com" />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input placeholder="*********" type="password" />
            </div>
            <div className="pt-3">
              <Button>Submit</Button>
            </div>
            <div className="w-full flex items-center justify-center">
              <Label className="md:text-base text-xs ">
                Already have an account?
              </Label>
              <Link
                href={"/"}
                className="hover:underline text-black ml-2 md:text-base text-xs "
              >
                Sign in
              </Link>
            </div>
            <div className="relative w-full h-10 flex items-center justify-center">
              <div className="w-full h-px bg-black"></div>
              <div className="absolute flex items-center justify-center w-44 rounded-full bg-white text-[#A3A3A3]">
                Or continue with
              </div>
            </div>
            <div className="pt-3">
              <Button className="gap-2">
                <GithubIcon />
                Github
              </Button>
            </div>
            <div className="flex items-center justify-center w-full">
              <p className="text-center md:text-sm text-xs md:w-[75%] w-full">
                By clicking on sign up, you agree our Terms of Service and
                Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;

const Button = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      className={cn(
        "flex items-center justify-center bg-black w-full text-white h-10 rounded-full p-6 font-medium text-lg",
        className
      )}
    >
      {children}
    </button>
  );
};
