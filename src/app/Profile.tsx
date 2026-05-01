"use client"

import { Button } from "@/src/components/shadcn/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/src/components/shadcn/dropdown-menu";
import { useSessionContext } from "../lib/supabase/SupabaseSessionContext";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../components/shadcn/avatar";

export default function Profile() {
    const { supabase, user } = useSessionContext();

    if (!user) {
        return (
            <Link href="/login">
                <Button className='rounded-full px-4 py-2 h-10 cursor-pointer'>
                    Sign In
                </Button>
            </Link>
        );
    }

    const userEmail = user.email || "unknown";
    const userName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.user_metadata?.user_name ||
        (userEmail ? userEmail.split("@")[0] : "User");
    const userImage =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        null;
    const userId = user.id || null;

    return (
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
                    <div className="flex-1 truncate">
                        <p className="text-sm font-medium">{userName}</p>
                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                    </div>
                </div>
                <div className="px-2 py-1.5 text-xs text-muted-foreground select-text break-all">
                    user ID: {userId}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => window.location.href = '/plans'}
                >
                    Plans
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => window.location.href = '/settings'}
                >
                    Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer"
                    variant="destructive"
                    onSelect={async (event) => {
                        event.preventDefault();
                        await supabase.auth.signOut();
                        window.location.href = '/';
                    }}
                >
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
