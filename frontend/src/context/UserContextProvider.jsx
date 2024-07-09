import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";
import axios from "axios";

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const getCurrentUser = async () => {
            try {
                const response = await axios.get('/users/', { withCredentials: true });
                setUser(response.data.data); 
                localStorage.setItem("user", JSON.stringify(response.data.data));
            } catch (error) {
                setError(error.response ? error.response.data : "Network error");
                setUser(null);
                localStorage.removeItem("user");
            } finally {
                setLoading(false);
            }
        };

        getCurrentUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
