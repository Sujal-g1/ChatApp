import React, { useContext, useMemo, } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from "axios";
import toast from "react-hot-toast";
import { ChatContext } from '../../../context/ChatContext';
import assets from '../../assets/assets';

const FriendsContainer = ({ friendTab,setFriendTab,searchInput }) => {

    const { users , selectedUser, setSelectedUser, unseenMessages, setUnseenMessages,  blockedUsers,
  setBlockedUsers,} = useContext(ChatContext)

      const sortedUsers = useMemo(() => {
        return [...users].sort((a, b) => {
          const lastA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
          const lastB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    
          if (lastA !== lastB) {
            return lastB - lastA;
          }
    
          return a.fullName.localeCompare(b.fullName);
        });
      }, [users]);
    
      const filteredUsers = searchInput
        ? sortedUsers.filter(u => u.fullName.toLowerCase().includes(searchInput.toLowerCase()))
        : sortedUsers


  return (
    <>
     <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 10
        }}
      >
        {["friends", "blocked"].map(tab => (
          <button
            key={tab}
            onClick={() =>
              setFriendTab(tab)
            }
            style={{
              flex: 1,
              padding: "6px",
              borderRadius: 8,
              background:
                friendTab === tab
                  ? "var(--accent)"
                  : "rgba(255,255,255,0.05)",

              color: "white",
              fontSize: 12,
              cursor: "pointer"
            }}
          >
            {tab}
          </button>
        ))}
               </div>

              {/* friends  */}
              {friendTab === "friends" && (
              filteredUsers.length === 0 ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                    No friends yet
                  </motion.div>
                ) : (

                  filteredUsers.map((user, idx) => (
                    <motion.div
                      key={user._id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className={`user-item ${selectedUser?._id === user._id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedUser(user)
                        setUnseenMessages(prev => ({ ...prev, [user._id]: 0 }))
                      }}
                    >
                      <>
        <img src={user?.profilePic || assets.avatar_icon}
          alt=""
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />

        <div
          style={{
            flex: 1,
            minWidth: 0,
            marginLeft: 10
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <p
              style={{
                fontWeight: 600,
                margin: 0
              }}
            >
              {user.fullName}
            </p>

            {user.lastMessageAt && (
              <span
                style={{
                  fontSize: 11,
                  opacity: 0.6
                }}
              >
                {new Date(user.lastMessageAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <p
              style={{
                fontSize: 12,
                opacity: 0.6,
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {user.lastMessagePreview || "Start chatting"}
            </p>

            {unseenMessages[user._id] > 0 && (
              <div
                style={{
                  minWidth: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "var(--accent)",
                  color: "white",
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {unseenMessages[user._id]}
              </div>
            )}
          </div>
        </div>
      </>
                    </motion.div>
                  ))
                )
              )}


              {/* blocked */}
              {friendTab === "blocked" && (
              blockedUsers.length === 0 ? (

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                    No Blocked users
                </motion.div>
              ) : (

          blockedUsers.map(user => (
            <div
              key={user._id}
              className="user-item"
              style={{
                justifyContent:
                  "space-between"
              }}
            >

              <div>
                <p>{user.fullName}</p>

                <p
                  style={{
                    fontSize: 12,
                    opacity: 0.6
                  }}
                >
                  {user.zingleeId}
                </p>
              </div>

              <button
                onClick={async () => {

                  try {

                    await axios.post(
                      "/api/friends/unblock",
                      {
                        targetUserId:
                          user._id
                      }
                    );

                    setBlockedUsers(
                      prev =>
                        prev.filter(
                          u =>
                            u._id !==
                            user._id
                        )
                    );

                    toast.success(
                      "User unblocked"
                    );

                  } catch (error) {

                    toast.error(
                      error.response?.data?.message ||
                      error.message
                    );
                  }
                }}
                style={{
                  background: "rgba(34,197,94,0.1)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  color: "#22c55e",
                  padding: "4px 10px",
                  borderRadius: 6,
                  cursor: "pointer"
                }}
              >
                Unblock
              </button>

            </div>

          )) ) )}

    
    </>
  )
}

export default FriendsContainer