
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({children})=>{

    const [messages, setMessages] = useState([]);
    const [users , setUsers] = useState([]);
    const [selectedUser , setSelectedUser] = useState(null);
    const [unseenMessages , setUnseenMessages] = useState({});
    const [requests, setRequests] = useState([]);
    // key value-> userid and no. of msgs

    const {socket, axios} = useContext(AuthContext);


    //fn to get all users for sidebar
    // const getUsers = async()=>{
    //     try {
    //     const { data } = await axios.get("/api/messages/users")
    //     console.log("USERS API:", data);
    //     if(data.success){
    //         setUsers(data.users)
    //         setUnseenMessages(data.unseenMessages)

    //     }
    //     } catch (error) {
    //         toast.error(error.message)
    //     }
    // }

    const getUsers = async () => {
  try {
    const { data } = await axios.get("/api/messages/users");

    console.log("SIDEBAR USERS:", data.users); // 👈 ADD THIS

    if (data.success) {
      setUsers(data.users);
    }

  } catch (error) {
    toast.error(error.message);
  }
};

     
    // fn to get msgs for selected user
    const getMessages = async (userId)=>{
         try {
          const { data } = await axios.get(`/api/messages/${userId}`)
          if(data.success){
            setMessages(data.messages)
        } 
         } catch (error) {
            toast.error(error.message)
         }
    }

    // fn to send msgs to selected usr
    const sendMessage = async (messageData)=>{
         try {
          const { data } = await axios.post(`/api/messages/send/${selectedUser._id}` , messageData)
          if(data.success){
            setMessages((prevMessages)=> [...prevMessages, data.newMessage])
        }  
        else{
              toast.error(data.message)
        }
         } catch (error) {
            toast.error(error.message)
         }
    }

    // fn to subscribe to msgs for selected user
    const subscribeToMessages = async ()=>{
        if(!socket) return;
        socket.on("newMessage" , (newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen = true;
                setMessages((prevMessages)=> [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }
            else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId] + 1 : 1
                }))
            }
        })
    }

    //  // fn to Unsubscribe from msgs 
const unsubscribeFromMessages = async ()=>{
        if(socket) socket.off("newMessage");
    }

    // fn to get req
    const getRequests = async () => {
  try {
    const { data } = await axios.get("/api/friends/pending");
    if (data.success) {
      setRequests(data.requests);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


    //fn to respond
    const respondRequest = async (requestId, action) => {
  try {
    await axios.post("/api/friends/respond", { requestId, action });
    getRequests(); // refresh
    getUsers(); // update friends list
  } catch (error) {
    toast.error(error.message);
  }
};


    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    },[socket, selectedUser])

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        requests,
        getRequests,
        respondRequest
    }

    return (<ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>)
}