"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

interface SharedButtonProps {
  className?: string;
  text?: string;
  withShadow?: boolean;
}

export const SharedButton = ({
  className = "flex items-center justify-center w-full md:w-36 h-10 rounded-xl border border-purple-700 text-base font-semibold text-purple-600",
  text = "Get Started",
  withShadow = false,
}: SharedButtonProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    if (status === "authenticated") {
      // User is logged in, redirect to app
      router.push("/app");
    } else {
      // User needs to sign in
      await signIn("google", { callbackUrl: "/app" });
    }
  };

  return (
    <Link
      href="#"
      onClick={handleClick}
      style={withShadow ? { boxShadow: "0px 4px 14.8px rgba(0, 0, 0, 0.2)" } : {}}
      className={className}
    >
      {text}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  );
}; 