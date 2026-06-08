
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

    // const updateUserLastMessage = (userId, lastMessageAt) => {
    //   setUsers((prevUsers) => {
    //     const updated = prevUsers.map((user) =>
    //       String(user._id) === String(userId)
    //         ? { ...user, lastMessageAt }
    //         : user
    //     );
    
    //     return updated.sort((a, b) => {
    //       const lastA = a.lastMessageAt
    //         ? new Date(a.lastMessageAt).getTime()
    //         : 0;
    
    //       const lastB = b.lastMessageAt
    //         ? new Date(b.lastMessageAt).getTime()
    //         : 0;
    
    //       return lastB - lastA;
    //     });
    //   });
    // };


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

    if (data.success) {
  setUsers(data.users || []);
  setUnseenMessages(data.unseenMessages || {});

  // 🔥 FIX: refresh selectedUser reference
  if (selectedUser) {
    const updatedUser = data.users.find(u => u._id === selectedUser._id);
    if (updatedUser) {
      setSelectedUser(updatedUser);
    }
  }
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
    // const sendMessage = async (messageData)=>{
    //      try {
    //       console.log("🚀 SENDING:", messageData);

    //       const { data } = await axios.post(`/api/messages/send/${selectedUser._id}` , messageData)
    //       if(data.success){
    //         setMessages((prevMessages)=> [...prevMessages, data.newMessage])
    //     }  
    //     else{
    //           toast.error(data.message)
    //     }
    //      } catch (error) {
    //         toast.error(error.message)
    //      }
    // }

    const sendMessage = async (messageData) => {
  try {

    const { data } = await axios.post(
      `/api/messages/send/${selectedUser._id}`,
      messageData,
      {
        headers: {
          "Content-Type": "application/json"
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );

    if (data.success) {
      setMessages((prev) => [...prev, data.newMessage]);
      setUsers(prev =>
        prev.map(user =>
          String(user._id) === String(selectedUser._id)
            ? {
                ...user,
                lastMessageAt: data.newMessage.createdAt,
                lastMessagePreview:
                  data.newMessage.audio
                    ? "🎤 Voice Message"
                    : data.newMessage.image
                    ? "📷 Photo"
                    : data.newMessage.text
              }
            : user
        )
      );

    } else {
      toast.error(data.message);
    }

  } catch (error) {
    console.log("❌ FULL ERROR:", error);

    if (error.response) {
      console.log("❌ SERVER ERROR:", error.response.data);
    } else if (error.request) {
      console.log("❌ NO RESPONSE (network issue)");
    } else {
      console.log("❌ ERROR:", error.message);
    }

    toast.error("Message failed to send");
  }
};

    const subscribeToMessages = () => {
        if (!socket) return;

        const onNewMessage = (newMessage) => {
            const senderId = String(newMessage.senderId);
            setUsers(prev =>
              prev.map(user =>
                String(user._id) === senderId
                  ? {
                      ...user,
                      lastMessageAt: newMessage.createdAt,
                      lastMessagePreview:
                        newMessage.audio
                          ? "🎤 Voice Message"
                          : newMessage.image
                          ? "📷 Photo"
                          : newMessage.text
                    }
                  : user
              )
            );

            if (selectedUser && senderId === String(selectedUser._id)) {
                newMessage.seen = true;
                setMessages((prevMessages) => [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            } else {
                setUnseenMessages((prev) => ({
                    ...prev,
                    [senderId]: (prev[senderId] || 0) + 1,
                }));
            }
        };

        const onMessageSeen = ({ messageId }) => {
          setMessages(prev =>
            prev.map(msg =>
              String(msg._id) === String(messageId)
                ? { ...msg, seen: true }
                : msg
            )
          );
        };

        const onMessagesSeen = ({ messageIds }) => {
          setMessages(prev =>
            prev.map(msg =>
              messageIds.some(
                id => String(id) === String(msg._id)
              )
                ? { ...msg, seen: true }
                : msg
            )
          );
        };

        socket.on("newMessage", onNewMessage);
        socket.on("messageSeen", onMessageSeen);
        socket.on("messagesSeen", onMessagesSeen);

        return () => {
        socket.off("newMessage", onNewMessage);
        socket.off("messageSeen", onMessageSeen);
        socket.off("messagesSeen", onMessagesSeen);
};
    };

    const subscribeToFriendEvents = () => {
        if (!socket) return;

        const onNewFriendRequest = () => getRequests();
        const onFriendListUpdated = () => getUsers();

        socket.on("newFriendRequest", onNewFriendRequest);
        socket.on("friendRequestCancelled", onNewFriendRequest);
        socket.on("friendListUpdated", onFriendListUpdated);

        return () => {
            socket.off("newFriendRequest", onNewFriendRequest);
            socket.off("friendRequestCancelled", onNewFriendRequest);
            socket.off("friendListUpdated", onFriendListUpdated);
        };
    };

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


    useEffect(() => {
        const cleanupMessages = subscribeToMessages();
        const cleanupFriends = subscribeToFriendEvents();
        return () => {
            cleanupMessages?.();
            cleanupFriends?.();
        };
    }, [socket, selectedUser]);

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
