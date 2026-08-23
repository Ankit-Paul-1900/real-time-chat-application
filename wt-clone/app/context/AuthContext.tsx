"use client";

import api from "@/lib/axios";
import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {io, Socket} from "socket.io-client";
import { useRouter,usePathname} from "next/navigation";
import toast from "react-hot-toast";
interface AuthContextType {
  currentuser: any | null;
  onlineUsers: string[];
  socket: any | null;
  users: any[];
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  fetchUsers: () => Promise<void>;
  setCurrentuser: React.Dispatch<React.SetStateAction<any | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext=()=>{
   const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider");
  }

  return context;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router= useRouter();

  // const [token, setToken]=useState<string|null>(null);
  const [currentuser, setCurrentuser]=useState<any|null>(null);
  const [onlineUsers, setOnlineUsers]=useState<string[]>([]);
  const [socket, setSocket]=useState<any|null>(null);
  const[users,setUsers]=useState<any[]>([]);
    const pathname = usePathname();


  // Function to check authentication status and fetch user data
const checkAuth = async () => {
  try {
    const { data } = await api.get("/user/profile", {
      withCredentials: true,
    });

    setCurrentuser(data.user);

  } catch (error: any) {
    if (error.response?.status === 401) {
      setCurrentuser(null);
      setOnlineUsers([]);
      router.push("/login")
      return;
    }

    console.error(error);
  }
};

// Function to connect to the socket server
const connectSocket = (userdata:any) => {
        if (!userdata  ) {
          return;
        }
        const newSocket = io(process.env.NEXT_PUBLIC_BASEURL!, {
          withCredentials: true,
          query: {
            userId: userdata._id,
          },
        });
        setSocket(newSocket);
        newSocket.on("connect", () => {
          console.log("Socket connected:", newSocket.id);
        });
        newSocket.on("disconnect", () => {
          console.log("Socket disconnected");

          }
        );
        newSocket.on("connect_error", (err) => {
  console.log("Socket error:", err.message);
});
        //recieves the list of online users from the server and updates the onlineUsers state
        newSocket.on("getOnlineUsers", (users: string[]) => {
          setOnlineUsers(users);
        });
}



// Function to log out the user
  const logout=async()=>{
    try{

      const response=await api.post("/user/logout",{
        withCredentials:true
      })
    if(response.data.success){
      setCurrentuser(null); 
      setOnlineUsers([]);
      toast.success("Logged out successfully");
      socket?.disconnect();
      
      
    }
    else{
      toast.error("Logout failed");
    }
  }
  catch(err){
    toast.error("An error occurred during logout");
  }
}


  const fetchUsers = async () => {
    const { data } = await api.get("/user/all-users", {
        withCredentials: true,
    });

    if (data.success) {
        setUsers(data.users);
    }
};

// Check authentication status on component mount

    useEffect(() => {
        if (pathname === "/login") {
            return;
        }

        checkAuth();
    }, [pathname]);
   
   

//to connect to the socket server when the currentuser changes
  useEffect(() => {
  if (!currentuser) return;

  connectSocket(currentuser);

  return () => {
    socket?.disconnect();
  };
}, [currentuser]);


//to fetch the list of users when the component mounts
  useEffect(() => {
   
    if (pathname === "/login") {
        return;
    }
    fetchUsers()},
    []);


  const value: AuthContextType = {
    
    currentuser,
    onlineUsers,
    socket,
    checkAuth,
    logout,fetchUsers,
    setCurrentuser,
    users
  };
 
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}





















// import {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useMemo,
//   useState,
//   ReactNode,
// } from "react";
// import {Socket} from "socket.io-client";
// import {connectSocket,disconnectSocket,getSocket} from "@/lib/socket";
// import api from "@/lib/axios";
// interface User {
//   id: string;
//   name: string;
//   email: string;
//   profilePicture: Object;
// }

// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   socket: Socket | null;
//   onlineUsers: string[];
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   checkAuth: () => Promise<void>;
// }
// const [user, setUser] = useState<User | null>(null);
// const [loading, setLoading] = useState<boolean>(true);

// const checkAuth=async ()=>{
//  try{
//   const profileResp= await api.get("/users/profile");
//   console.log("Profile Response:", profileResp.data);
//   if(profileResp.data.success){
//   setUser(profileResp.data.user);
//    }
// }
//  catch(error){
//     console.error("Error checking authentication:", error);
//     setUser(null);
//  }
//  finally{
//     setLoading(false);
//  }
// }