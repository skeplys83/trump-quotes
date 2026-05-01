import Link from "next/link"
import { Button } from "@/src/components/shadcn/button"
import { LoginForm } from "./loginForm"

export default function LoginPage() {
    return (
        <>
            <div className="px-6 py-6 absolute top-0 left-0">
                <Link href="/">
                    <Button variant="outline" size="sm" className="rounded-full px-4 py-2 h-10 cursor-pointer">
                        ← Back
                    </Button>
                </Link>
            </div>
            <div className="min-h-screen flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <LoginForm />
                </div>
            </div>
        </>
    )
}
