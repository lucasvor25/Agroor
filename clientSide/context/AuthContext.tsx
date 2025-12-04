import { createContext, useContext, useState, useEffect } from "react";

type User = {
    id: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    logout: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // simula carregamento inicial (ex: checar token salvo)
    useEffect(() => {
        setTimeout(() => {
            setUser({
                id: "1",
                email: "mock@usuario.com",
            });
            setLoading(false);
        }, 800);
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        // simula chamada API
        await new Promise((res) => setTimeout(res, 800));

        setUser({
            id: "1",
            email,
        });

        setLoading(false);
    };

    const logout = async () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
