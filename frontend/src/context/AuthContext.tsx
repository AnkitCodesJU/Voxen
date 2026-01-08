"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

interface User {
    _id: string;
    username: string;
    email: string;
    fullName: string;
    avatar: string;
    coverImage: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    isLoading: boolean;
    login: (credentials: any) => Promise<void>;
    register: (userData: FormData) => Promise<any>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const checkAuth = async () => {
        try {
            const response = await api.get("/users/current-user");
            if (response.data.success) {
                setIsLoggedIn(true);
                setUser(response.data.data);
            }
        } catch (error) {
            console.log("Not authenticated");
            setIsLoggedIn(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials: any) => {
        try {
            const response = await api.post("/users/login", credentials);
            if (response.data.success) {
                setIsLoggedIn(true);
                setUser(response.data.data.user);
            }
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const register = async (userData: FormData) => {
        try {
            const response = await api.post("/users/register", userData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.data.success) {
                // Auto login after register? Or just return success.
                // Usually better to ask user to login or auto-login.
                // Let's assume backend doesn't auto-set cookie on register, so we might need to login explicitly or just redirect to login.
                // For now, just return true/void.
                return response.data;
            }
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await api.post("/users/logout");
            setIsLoggedIn(false);
            setUser(null);
            router.push("/");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, isLoading, login, register, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
