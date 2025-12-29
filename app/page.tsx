"use client"

import Header from "@/components/Header";
import { LoginForm } from "@/components/loginForm";
import Search from "@/components/Search";
import { GalleryVerticalEnd } from "lucide-react";

export default function Page() {

  return (
    <>
      <main className="min-h-screen max-w-full flex flex-col">
        <Header></Header>
        <div className=" flex flex-1 justify-center items-center">
          <Search></Search>
        </div>
      </main >
    </>
  );
}
