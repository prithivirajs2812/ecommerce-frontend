import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Read persisted session once on module load (avoids useEffect timing issues)
function loadSession() {
    try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) return { token, user: JSON.parse(user) };
    } catch { }
    return { token: null, user: null };
}

const initial = loadSession();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(initial.user);
    const [token, setToken] = useState(initial.token);

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const isSeller = user?.role === 'SELLER';

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!token, isSeller }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
