"use server"

import Profile from "./Profile";
import LogoSection from "./LogoSection";

export default async function Header() {
    return (
        <>
            <header className="flex items-center justify-between px-6 py-4 sticky">
                <LogoSection />
                <div className="flex items-center gap-4">
                    <Profile />
                </div>
            </header>

        </>
    );
}