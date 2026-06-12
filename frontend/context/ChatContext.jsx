
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";
import { getUserPublicKey } from "../src/lib/keyApi";
import { encryptForUser } from "../src/lib/messageEncryption";
import { decryptFromUser } from "../src/lib/messageEncryption";

export const ChatContext = createContext();

export const ChatProvider = ({children})=>{

    const [messages, setMessages] = useState([]);
    const [users , setUsers] = useState([]);
    const [selectedUser , setSelectedUser] = useState(null);
    const [unseenMessages , setUnseenMessages] = useState({});
    const [requests, setRequests] = useState([]);
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
    const getMessages = async (userId) => {

  try {

    const { data } =
      await axios.get(
        `/api/messages/${userId}`
      );

    if (!data.success) return;

    const decryptedMessages =
      await Promise.all(

        data.messages.map(
          async (msg) => {

            if (
              msg.messageType === "text" &&
              msg.cipherText
            ) {

              try {

                const text =
                  await decryptFromUser(
                    msg.cipherText,
                    msg.nonce,
                    msg.senderPublicKey
                  );

                return {
                  ...msg,
                  text
                };

              } catch {

                return {
                  ...msg,
                  text:
                    "[Unable to decrypt]"
                };

              }

            }

            return msg;

          }
        )
      );

    setMessages(
      decryptedMessages
    );

  } catch (error) {

    toast.error(
      error.message
    );

  }
};


    const sendMessage = async (messageData) => {
  try {

         let payload = { ...messageData };

    if (
      messageData.text &&
      !messageData.image &&
      !messageData.audio
    ) {

      // console.log("SELECTED USER");
      // console.log(selectedUser);

      const receiverPublicKey =
        await getUserPublicKey(
          axios,
          selectedUser._id
        );

      // console.log("RECEIVER PUBLIC KEY:");
      // console.log(receiverPublicKey);

       if (!receiverPublicKey) {
              toast.error( "User encryption key not found");
            return;
          }
      // console.log(receiverPublicKey.length);


      const encrypted =
        await encryptForUser(
          messageData.text,
          receiverPublicKey
        );

      payload = {
        cipherText:
          encrypted.cipherText,

        nonce:
          encrypted.nonce,

        messageType:
          "text"
      };
    }
    // console.log("PAYLOAD BEING SENT");
    // console.log(payload);

    const { data } = await axios.post(
      `/api/messages/send/${selectedUser._id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      }
    );


  
    if (data.success) {

  let messageToShow =
    data.newMessage;

  if (
    messageToShow.messageType === "text"
  ) {

    messageToShow = {
      ...messageToShow,
      text: messageData.text
    };

  }

  setMessages(prev => [
    ...prev,
    messageToShow
  ]);
} 
    else {
      toast.error(data.message);
    }

  } catch (error) {
    // console.log("❌ FULL ERROR:", error);

    if (error.response) {
      // console.log("❌ SERVER ERROR:", error.response.data);
    } else if (error.request) {
      // console.log("❌ NO RESPONSE (network issue)");
    } else {
      // console.log("❌ ERROR:", error.message);
    }

    toast.error("Message failed to send");
  }
};

    const subscribeToMessages = () => {
        if (!socket) return;

        const onNewMessage = async (newMessage) => {
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
                if (
  newMessage.messageType === "text" &&
  newMessage.cipherText
) {

  try {

    const text =
      await decryptFromUser(
        newMessage.cipherText,
        newMessage.nonce,
        newMessage.senderPublicKey
      );

    newMessage.text =
      text;
  }
  catch {
    newMessage.text =
      "[Unable to decrypt]";

  }
}
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
