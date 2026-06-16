
import { createContext, useContext, useEffect, useState } from "react";
import { encryptMessage, decryptMessage } from "../src/lib/crypto";
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
    const { data } =
      await axios.get(
        `/api/messages/${userId}`
      );

    console.log(
      "MESSAGES FROM SERVER",
      data.messages
    );

    if (data.success) {

  const privateKey = localStorage.getItem( "privateKey" );

  const decryptedMessages =
    data.messages.map(msg => {
      if (
        msg.cipherText &&
        msg.nonce &&
        msg.senderId?.publicKey
      ) {

    const decryptedText = decryptMessage(
            msg.cipherText,
            msg.nonce,
            msg.senderId.publicKey,
            privateKey
          );

        console.log("DECRYPTED:", decryptedText );

        return {
          ...msg,
          text: decryptedText
        };
      }

      return msg;
    });

  setMessages(
    decryptedMessages
  );
}

  } catch (error) {
    toast.error(error.message);
  }
}


    // helper to get public keys
    const getUserPublicKey = async (userId) => {
     const { data } =
    await axios.get(
      `/api/auth/public-key/${userId}`
    );

  return data.publicKey;
    };


    const sendMessage = async (messageData) => {
  try {

    const publicKey = await getUserPublicKey( selectedUser._id );

console.log(
  "RECEIVER PUBLIC KEY",
  publicKey
);

    const receiverPublicKey = await getUserPublicKey( selectedUser._id );

    const senderPrivateKey = localStorage.getItem( "privateKey" );

    console.log( "PRIVATE KEY:", senderPrivateKey );

    console.log( "PRIVATE KEY LENGTH:", senderPrivateKey?.length );

const encrypted =
  encryptMessage(
    messageData.text,
    senderPrivateKey,
    receiverPublicKey
  );

console.log( "ENCRYPTED", encrypted );

    const payload = {
  ...messageData,

  text: undefined,

  cipherText:
    encrypted.cipherText,

  nonce:
    encrypted.nonce
};

const { data } =
  await axios.post(
    `/api/messages/send/${selectedUser._id}`,
    payload
  );


   if (data.success) {

setMessages(prev => [
  ...prev,
  {
    ...data.newMessage,
    text: messageData.text
  }
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

        const onNewMessage = async (newMessage) => {

          console.log( "REALTIME MESSAGE", newMessage );

          console.log( "SELECTED USER", selectedUser?._id );

       const senderId = String( newMessage.senderId?._id || newMessage.senderId );

       console.log( "SENDER ID", senderId );

        if (selectedUser && senderId === String(selectedUser._id)) {
                newMessage.seen = true;

            if ( newMessage.cipherText && newMessage.nonce ) {
            const privateKey = localStorage.getItem( "privateKey" );

          const senderPublicKey = newMessage.senderId.publicKey;

           const decryptedText = decryptMessage( newMessage.cipherText,
                                                newMessage.nonce,
                                                senderPublicKey,
                                                privateKey );

          newMessage.text = decryptedText;
}

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

     getUserPublicKey
}

    return (<ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>)
}