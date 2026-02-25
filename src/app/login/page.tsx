"use client"

import { LoginForm } from "./loginForm";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <div className="w-full max-w-md">
                <LoginForm />
            </div>
        </div>
    );
}
