import { useState } from "react";
import { AuthContext } from "./auth-context";

function AuthProvider({ children }) {

    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token) {
            return null;
        }

        if (storedUser) {
            try {
                return JSON.parse(storedUser);
            } catch {
                return {
                    token
                };
            }
        }

        return {
            token
        };
    });

    const login = (token, userData) => {

        localStorage.setItem(
            "token",
            token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setUser(userData);

    };

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);

    };

    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export default AuthProvider;
