
import { createContext, useContext, useEffect, useRef, useState } from "react";
import axios from "axios"
import toast from "react-hot-toast"
import {io} from "socket.io-client"
import { savePrivateKey, getPrivateKey as getStoredPrivateKey, removePrivateKey,} from "../src/lib/keyStorage";
import { clearEncryptionCache } from "../src/lib/encryptionService";

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);
    const [loading, setLoading] = useState(true);

    // check is user is authenticated and if so ,set the user data and connect the socket
    const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        setLoading(false);
        return;
    }

    axios.defaults.headers.common.Authorization = `Bearer ${token}`;

    try {
      // console.log("1. Before API");
        const { data } = await axios.get("/api/auth/check");
        // console.log("2. After API");

        //  console.log("CHECK AUTH RESPONSE:", data);

      //  await new Promise(resolve => setTimeout(resolve, 2000));

          // console.log("3. After 10 seconds");

        if (data.success) {
        const storedKey = await getStoredPrivateKey();

        if (!storedKey && data.privateKey) {
        await savePrivateKey(
            data.privateKey
        );
    }

    setAuthUser(data.user);

    connectSocket(data.user);
}

        // console.log("4. Before loading false");
    } catch (err) {
        console.log(err);

        localStorage.removeItem("token");
        delete axios.defaults.headers.common.Authorization;

        setAuthUser(null);
    } finally {
      // console.log("5. Finally");
        setLoading(false);
    }
};

    // login fn to handle user auth and socket connection
  const login = async (state, credentials) => {
  try {
    let data;

    if (state === "google") {
      data = credentials;
    } else if (state === "firebase-email") {
      const res = await axios.post(
        "/api/auth/firebase-login",
        credentials
      );

      data = res.data;
    } else {
      const res = await axios.post(
        `/api/auth/${state}`,
        credentials
      );

      data = res.data;
    }

    if (data.success) {
      if (data.privateKey) {
        await savePrivateKey(data.privateKey);
      }

      axios.defaults.headers.common["Authorization"] =
        `Bearer ${data.token}`;

      setToken(data.token);

      localStorage.setItem(
        "token",
        data.token
      );

      setAuthUser(data.userData);

      connectSocket(data.userData);

      // Manual login does not return a private key.
      if (!data.privateKey) {
        const storedPrivateKey =
          await getStoredPrivateKey();

        if (!storedPrivateKey) {
          toast.error(
            "Encryption key not found on this device. Old encrypted messages cannot be decrypted."
          );
        }
      }

      toast.success(data.message);

      // VERY IMPORTANT
      return data;
    }

    return data;

  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      error.message
    );

    // VERY IMPORTANT
    throw error;
  }
};

    //  logout fn to handle user logout and socket disconnection
  const logout = async () => {

    localStorage.removeItem("token");

    await removePrivateKey();

    clearEncryptionCache();

    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);

    delete axios.defaults.headers.common["Authorization"];

    socketRef.current?.disconnect();
    socketRef.current = null;
    setSocket(null);

    toast.success("Logged out Successfully");
};


    // update profile fn to handle user profile updates
    const updateProfile = async (body)=>{
         try {
            const {data} = await axios.put("/api/auth/update-profile", body);
            if(data.success){
                setAuthUser(data.user);
                toast.success("Profile updated Successfully")
            }

         } catch (error) {
            toast.error(error.response?.data?.message || error.message)
         }
    }

    // connect socket fn to handle socket connection and online users updates
    const connectSocket = (userData) => {
        if (!userData) return;

        socketRef.current?.disconnect();

        const newSocket = io(backendUrl, {
            query: { userId: userData._id },
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
        });

        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineUsers(userIds);
        });

        socketRef.current = newSocket;
        setSocket(newSocket);
    };


     useEffect(() => {
    checkAuth();
    }, []);


useEffect(() => {
  const interceptor = axios.interceptors.request.use((config) => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken}`;
    }

    return config;
  });

  return () => axios.interceptors.request.eject(interceptor);
}, []);

  const getPrivateKey = () => getStoredPrivateKey();

   const value = {
    axios,
    authUser,
    loading,
    onlineUsers,
    socket,
    login,
    logout,
    updateProfile,
    getPrivateKey
}
    return (  
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider>
    )
} 




export const useAuth = () => useContext(AuthContext)

