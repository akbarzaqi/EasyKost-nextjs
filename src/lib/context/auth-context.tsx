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
    token: string | null;
    user: User | null;
    isLoading : boolean;

    loginUser: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    user: null,
    isLoading: true,
    loginUser: () => {},
    logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    console.log('AuthProvider initialized with token:', token, 'and user:', user);

    const fetchData = async () => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
    }

    useEffect(() => {
        async function loadAuthData() {
            setIsLoading(true);
            await fetchData();
            setIsLoading(false);

        }
        loadAuthData();
    }, []);

    const loginUser = (token: string, user: User) => {
        console.log('Login User : ', { token, user });
        setToken(token);
        setUser(user);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
    }

    const logout = async () => {
        await logoutUser();
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ token, user, isLoading, loginUser, logout }}>
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