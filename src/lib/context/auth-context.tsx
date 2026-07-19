'use client'

import { createContext, useState, useEffect, useContext } from "react";
import { logoutUser } from "../api/auth";

interface User {
    id_user: string;
    nama: string;
    username: string;
    email: string;
    no_hp: string;
    pekerjaan?: string;
    provinsi?: string;
    kabupaten?: string;
    kecamatan?: string;
    alamat?: string;
    foto?: string;
    role: "admin" | "user";
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;

    loginUser: (user: User) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    loginUser: () => {},
    logout: async () => {},
    refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await fetch('/api/auth/me');
            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const loginUser = (newUser: User) => {
        setUser(newUser);
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    const refreshUser = async () => {
        await fetchUser();
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, loginUser, logout, refreshUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}
