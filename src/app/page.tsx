"use client"

import Header from "@/src/components/Header";
import Search from "@/src/components/Search";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";

export default function Page() {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <SessionProvider>
        <main className="min-h-screen max-w-full flex flex-col">
          <Header loginOpen={loginOpen} setLoginOpen={setLoginOpen}></Header>
          <div className=" flex flex-1 justify-center items-center">
            <Search loginOpen={loginOpen} setLoginOpen={setLoginOpen}></Search>
          </div>
        </main >
      </SessionProvider>
    </>
  );
}
