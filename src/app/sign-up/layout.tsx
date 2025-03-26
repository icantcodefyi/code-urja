import { Logo } from "~/components/logo";
import Link from "next/link";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Link
        href="/"
        className="flex gap-3 w-full items-center justify-center my-4 cursor-pointer"
      >
        <Logo />
        <label className="text-4xl font-semibold cursor-pointer">Playful</label>
      </Link>
      {children}
    </div>
  );
};

export default Layout;
