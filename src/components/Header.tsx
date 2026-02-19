"use client"

import { Button } from "@/src/components/shadcn/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./shadcn/dialog";
import { LoginForm } from "./loginForm";
import { Avatar, AvatarFallback, AvatarImage } from "./shadcn/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./shadcn/dropdown-menu";
import Link from "next/link";
import { createSupabaseBrowser } from "../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Header({ loginOpen, setLoginOpen }: { loginOpen: boolean, setLoginOpen: (open: boolean) => void }) {
    const supabase = createSupabaseBrowser();
    const session = await supabase.auth.getSession();
    const router = useRouter();
    
    const user = session?.data?.session?.user || null;
    const userEmail = user?.email || "unknown";
    const userName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.user_metadata?.user_name ||
        (userEmail ? userEmail.split("@")[0] : "User");
    const userImage =
        user?.user_metadata?.avatar_url ||
        user?.user_metadata?.picture ||
        null;

    return (
        <>
            <header className="flex items-center justify-between px-6 py-4 sticky">
                <Link href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity cursor-pointer">
                    Next Weather
                </Link>
                <div className="flex items-center gap-4">
                    <Link href="/plans">
                        <Button 
                            variant="default"
                            className="rounded-full px-4 py-2 h-10 cursor-pointer"
                        >
                            Plans
                        </Button>
                    </Link>
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Avatar size="lg" className="cursor-pointer">
                                    {userImage ? (
                                        <AvatarImage src={userImage} alt={userName || "User"} />
                                    ) : null}
                                    <AvatarFallback>{userName ? userName.charAt(0).toUpperCase() : "??"}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="flex items-center gap-3 px-2 py-2">
                                    {/* {userImage ? (
                                        <img
                                            src={userImage}
                                            alt={userName || "User"}
                                            className="size-10 rounded-full"
                                        />
                                    ) : (
                                        <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full text-sm font-medium">
                                            {userName ? userName.charAt(0).toUpperCase() : "?"}
                                        </div>
                                    )} */}
                                    <div className="flex-1 truncate">
                                        <p className="text-sm font-medium">{userName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem disabled>Settings</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    variant="destructive"
                                    onSelect={async (event) => {
                                        event.preventDefault();
                                        await supabase.auth.signOut();
                                        router.push('/');
                                    }}
                                >
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Dialog open={loginOpen}>
                            <DialogTrigger asChild>
                                <Button className='rounded-full px-4 py-2 h-10 cursor-pointer' onClick={() => router.push('/?login=true')}>Sign In</Button>
                            </DialogTrigger>

                        <DialogContent
                            onOpenAutoFocus={(event) => event.preventDefault()}
                            className="
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
                    )}
                </div>
            </header>
                
        </>
    );
}