import { Button } from "@/components/shadcn/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./shadcn/dialog";
import { useState } from "react";
import { LoginForm } from "./loginForm";

export default function Header() {
    const [loginOpen, setloginOpen] = useState(false)

    return (
        <>
            <header className="flex items-center justify-between px-6 py-4 sticky">
                <div className="text-2xl font-bold">Next Weather</div>
                <Dialog open={loginOpen} onOpenChange={setloginOpen}>
                    <DialogTrigger asChild>
                        <Button className='rounded-full text-md p-6'>Sign In</Button>
                    </DialogTrigger>

                    <DialogContent className="
                        p-0 overflow-hidden
                        border-0 bg-transparent shadow-none" //removes the card overlay from Dialog
                        showCloseButton={true}
                    >
                        <DialogHeader className="sr-only">
                            <DialogTitle>Sign in</DialogTitle>
                            <DialogDescription>Authenticate to access your account.</DialogDescription>
                        </DialogHeader>

                        <div className="flex w-full flex-col gap-6">
                            <LoginForm />
                        </div>
                    </DialogContent>
                </Dialog>
            </header>

        </>
    );
}