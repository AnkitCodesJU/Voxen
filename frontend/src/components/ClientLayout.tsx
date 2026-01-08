"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { AuthProvider } from "@/context/AuthContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === "/login" || pathname === "/register";

    return (
        <AuthProvider>
            {isAuthPage ? (
                children
            ) : (
                <div className="flex min-h-screen pt-16">
                    <Sidebar />
                    <main className="flex-1 w-full md:ml-64 p-4 md:p-6 overflow-x-hidden">
                        {children}
                    </main>
                </div>
            )}
        </AuthProvider>
    );
}
