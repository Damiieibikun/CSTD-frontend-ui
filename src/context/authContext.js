// AuthContext will return a datatype of values isAuthenticated, userID, username, isAdmin and isWebmaster;

import { createContext, useContext, useEffect, useState } from "react";
import { ApiContext } from "./apiContext";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userId, setUserId] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isWebmaster, setIsWebmaster] = useState(false);
    const [isMedia, setIsMedia] = useState(false);
    const { getMe } = useContext(ApiContext);

    useEffect(() => {
        async function setup() {
            try {

                const data = await getMe();
                console.log(data);
                setIsAuthenticated(data.isAuthenticated);
                setUserId(data.userid);
                setIsAdmin(data.isAdmin);
                setIsWebmaster(data.isWebmaster);
                setIsMedia(data.isMedia);
            } catch (err) {
                console.log(err)
            }
        }
        setup();
    })
    return (
        <AuthContext.Provider value={{ isAuthenticated, userId, isAdmin, isWebmaster, isMedia }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined)
        throw new Error("useAuth must be used within an AuthProvider");
    return context;
}