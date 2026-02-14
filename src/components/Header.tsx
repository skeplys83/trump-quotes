"use client"

import { Button } from "@/src/components/shadcn/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./shadcn/dialog";
import { useState } from "react";
import { LoginForm } from "./loginForm";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./shadcn/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./shadcn/dropdown-menu";

export default function Header({ loginOpen, setLoginOpen }: { loginOpen: boolean, setLoginOpen: (open: boolean) => void }) {
    const { data: session, status } = useSession();

    const userName = session?.user?.name ?? "";
    const userImage = session?.user?.image ?? "";

    return (
        <>
            <header className="flex items-center justify-between px-6 py-4 sticky">
                <div className="text-2xl font-bold">Next Weather</div>
                {session?.user ? (
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
                                    <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled>Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                variant="destructive"
                                onSelect={(event) => {
                                    event.preventDefault();
                                    void signOut();
                                }}
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                        <DialogTrigger asChild>
                            <Button className='rounded-full text-md p-6'>Sign In</Button>
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
            </header>
                
        </>
    );
}