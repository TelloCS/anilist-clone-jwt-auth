import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [isLoggedIn, setLoggedIn] = useState(false)
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkLoggedInUser = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                if (token) {
                    const config = {
                        headers: {
                            "Authorization":`Bearer ${token}`
                        }
                    };
                    const response = await axios.get("http://127.0.0.1:8000/api/user/", config)
                    setLoggedIn(true)
                    setUsername(response.data.username)
                    setEmail(response.data.email)
                } else {
                    setLoggedIn(false);
                    setUsername("");
                    setEmail("")
                }
            } catch(error) {
                setLoggedIn(false);
                setUsername("");
                setEmail("")
            } finally {
                setLoading(false)
            }
        };
        
        checkLoggedInUser()
    }, []);

    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            if (accessToken && refreshToken) {
                const config = {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                };
                
                await axios.post("http://127.0.0.1:8000/api/logout/", { "refresh": refreshToken }, config)
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                setLoggedIn(false);
                setUsername("");
                setEmail("");
                console.log("Log out successful!")
            }
        } catch(error) {
            console.error("Failed to logout", error.response?.data || error.message)
        }
    };

    return (
        <AuthContext.Provider value={{
            isLoggedIn, 
            setLoggedIn,
            username,
            setUsername,
            email,
            setEmail,
            handleLogout,
            loading
        }}>
            { children }
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;