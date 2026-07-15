import { createContext, useContext, useEffect, useState,useRef } from "react";
import { io } from "socket.io-client"
import api from "../api/axios";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [TEMPLATES,setTEMPLATES] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [socket, setSocket] = useState(null);
    const [user, setUser] = useState(null);
    const socketRef = useRef(null);


    //Socket Connection
    const connectSocket = (userId) => {
        if (socketRef.current) {
            return socketRef.current;
        }
        socketRef.current = io(import.meta.env.VITE_BASE_API_URL, {
            auth: { userId }
        });

        socketRef.current.on("connect", () => {
            console.log("Connected", socketRef.current.id);
        });
        socketRef.current.on("disconnect", () => {
            console.log("Disconnected");
        });

        setSocket(socketRef.current);
    };

    const disconnectSocket = () => {
        socket?.disconnect();
        setSocket(null);
    };

    //Get User Details and Connect Socket
    useEffect(()=>{
      (async()=>{
        try{
          const userDetails = await api.get("/users/user");
          setUser(userDetails.data.data.user);
          if(userDetails){  
            await connectSocket(userDetails.data.data.user._id)
          }
          
        }
        catch(err){
          if (err.response?.status !== 401) {
            console.error(err);
          }
          setUser(null);
        }
        
      })();
    },[])

    return (
      <GlobalContext.Provider
        value={{ TEMPLATES,setTEMPLATES, campaigns , setCampaigns ,connectSocket, user, setUser,socket, connectSocket}}
      >
        {children}
      </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => useContext(GlobalContext);