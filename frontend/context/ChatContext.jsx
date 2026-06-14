
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
    const [blockedUsers, setBlockedUsers] = useState([]);
    // key value-> userid and no. of msgs

    const {socket, axios} = useContext(AuthContext);


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

  setMessages(prev => [
    ...prev,
    data.newMessage
  ]);

  const preview =
    data.newMessage.text ||
    (data.newMessage.image
      ? "📷 Image"
      : data.newMessage.audio
      ? "🎤 Audio"
      : "");

  setUsers(prev => {

    const updated = prev.map(user => {

        if ( user._id !==selectedUser._id) return user;
        return {
          ...user,
          lastMessagePreview:
            preview,

          lastMessageAt:
            data.newMessage.createdAt
        };
      });

    updated.sort(
      (a, b) =>
        new Date(
          b.lastMessageAt || 0
        ) -
        new Date(
          a.lastMessageAt || 0
        )
    );

    return [...updated];
  });
}
    else {
      toast.error(data.message);
    }

  } catch (error) {
    if (error.response) {
      console.log("SERVER ERROR:", error.response.data);
    } else if (error.request) {
      console.log("NO RESPONSE (network issue)");
    } else {
      console.log("ERROR:", error.message);
    }

   toast.error(
  error.response?.data?.message ||
  "Message failed to send"
);
  }
};

    const subscribeToMessages = () => {
        if (!socket) return;

        const onNewMessage = (newMessage) => {
            const senderId = String(newMessage.senderId);

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

            const preview =
  newMessage.text ||
  (newMessage.image
    ? "📷 Image"
    : newMessage.audio
    ? "🎤 Audio"
    : "");

setUsers(prev => {
  const updated = prev.map(user => {

    if (user._id !== senderId)
      return user;

    return {
      ...user,
      lastMessagePreview: preview,
      lastMessageAt: newMessage.createdAt
    };
  });

  updated.sort(
    (a, b) =>
      new Date(b.lastMessageAt || 0) -
      new Date(a.lastMessageAt || 0)
  );

  return [...updated];
});
        };

        socket.on("newMessage", onNewMessage);
        return () => socket.off("newMessage", onNewMessage);
    };

    // ---------------------------------------
   const subscribeToFriendEvents = () => {
  if (!socket) return;

  const onNewFriendRequest = (request) => {

    setRequests(prev => {

      const exists = prev.some(
        r => r._id === request._id
      );

      if (exists) return prev;

      return [request, ...prev];
    });
  };

  const onFriendRequestCancelled = ({ requestId }) => {

    setRequests(prev =>
      prev.filter(
        req => req._id !== requestId
      )
    );
  };

  const onFriendRemoved = ({ userId }) => {

  setUsers(prev =>
    prev.filter(
      user => user._id !== userId
    )
  );

  setRequests(prev =>
    prev.filter(req =>
      req.sender?._id !== userId
    )
  );

  if (
    selectedUser &&
    selectedUser._id === userId
  ) {
    setSelectedUser(null);
    setMessages([]);
  }
};

    const onUserBlocked = ({ userId }) => {

      // console.log("BLOCK EVENT RECEIVED",userId);

  setUsers(prev =>
    prev.filter(
      user =>
        user._id !== userId
    )
  );

  setRequests(prev =>
    prev.filter(req =>
      req.sender?._id !== userId
    )
  );

  if (
    selectedUser &&
    selectedUser._id === userId
  ) {
    setSelectedUser(null);
    setMessages([]);
  }
};

  socket.on(
    "newFriendRequest",
    onNewFriendRequest
  );

  socket.on(
    "friendRequestCancelled",
    onFriendRequestCancelled
  );

  socket.on(
  "friendRemoved",
  onFriendRemoved
);

socket.on(
  "userBlocked",
  onUserBlocked
);

  return () => {

    socket.off(
      "newFriendRequest",
      onNewFriendRequest
    );

    socket.off(
      "friendRequestCancelled",
      onFriendRequestCancelled
    );

    socket.off(
  "friendRemoved",
  onFriendRemoved
);

    socket.off(
  "userBlocked",
  onUserBlocked
);
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

// get blocked users
const getBlockedUsers = async () => {

  try {

    const { data } =
      await axios.get(
        "/api/friends/blocked"
      );

    if (data.success) {
      setBlockedUsers(
        data.users || []
      );
    }

  } catch (error) {
    toast.error(
      error.message
    );
  }
};

    //fn to respond
    const respondRequest = async (requestId, action) => {
  try {

    const request = requests.find(
      r => r._id === requestId
    );

    await axios.post(
      "/api/friends/respond",
      { requestId, action }
    );

    setRequests(prev =>
      prev.filter(
        r => r._id !== requestId
      )
    );

    if (
      action === "accept" &&
      request?.sender
    ) {

      setUsers(prev => {

        const exists =
          prev.some(
            u =>
              u._id ===
              request.sender._id
          );

        if (exists) return prev;

        return [
          request.sender,
          ...prev
        ];
      });
    }

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
    setUsers,

    selectedUser,
    getUsers,
    getMessages,
    sendMessage,

    setSelectedUser,

    unseenMessages,
    setUnseenMessages,

    requests,
    setRequests,

    getRequests,
    respondRequest,

    blockedUsers,
    setBlockedUsers,
    getBlockedUsers,
}

    return (<ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>)
}