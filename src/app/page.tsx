"use client"

import Header from "@/src/components/Header";
import Search from "@/src/components/Search";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const [loginOpen, setLoginOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('login') === 'true') {
      setLoginOpen(true);
    }
  }, [searchParams]);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header loginOpen={loginOpen} setLoginOpen={setLoginOpen}></Header>
        <div className="flex flex-1 justify-center items-center">
          <Search></Search>
        </div>
      </div>
    </>
  );
}
