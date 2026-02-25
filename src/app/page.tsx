"use server"

import Header from "@/src/components/Header";
import Search from "@/src/components/Search";

export default async function Page() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex flex-1 justify-center items-center">
          <Search></Search>
        </div>
      </div>
    </>
  );
}
