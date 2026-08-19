
import { motion, AnimatePresence } from 'framer-motion'
import axios from "axios";
import toast from "react-hot-toast";
import { useContext } from 'react';
import { ChatContext } from '../../../context/ChatContext';

const RequestContainer = ({requestTab, setRequestTab, sentRequests, setSentRequests}) => {

  const { requests , respondRequest}  = useContext(ChatContext)


  return (
      <div>

          {/* 🔹 SUB TABS */}
          <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
            {["incoming", "sent"].map(tab => (
              <button
                key={tab}
                onClick={() => setRequestTab(tab)}
                style={{
                  flex: 1,
                  padding: "6px",
                  borderRadius: 8,
                  background: requestTab === tab ? "var(--accent)" : "rgba(255,255,255,0.05)",
                  color: "white",
                  fontSize: 12,
                  cursor: "pointer"
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 🔹 INCOMING */}
          {requestTab === "incoming" && (
            requests.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                    No incoming requests yet
                  </motion.div>
            ) : (
              requests.map((req) => (
                <div key={req._id} className="user-item" style={{ justifyContent: "space-between" }}>
                  <div>
                    <p>{req.sender.fullName}</p>
                    <p style={{ fontSize: 12, opacity: 0.6 }}>
                      {req.sender.zingleeId}
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>

                    
        {/* Accept Button */}
        <button
          onClick={async () => {
            await respondRequest(req._id, "accept");
        
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid rgba(34,197,94,0.4)",
            background: "rgba(34,197,94,0.1)",
            color: "#22c55e",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(34,197,94,0.2)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(34,197,94,0.1)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ✓ Accept
        </button>

        {/* Reject Button */}
        <button
          onClick={async () => {
            await respondRequest(req._id, "reject");
          }}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "6px 12px",
            borderRadius: 8,
            border: "1px solid rgba(248,113,113,0.4)",
            background: "rgba(248,113,113,0.1)",
            color: "#f87171",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(248,113,113,0.2)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(248,113,113,0.1)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          ✕ Reject
        </button>
      </div>
                </div>
              ))
            )
          )}

          {/* 🔹 SENT */}
          {requestTab === "sent" && (
            sentRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 20 }}>
                No sent requests
              </div>
            ) : (
              sentRequests.map((req) => (
                <div key={req._id} className="user-item" style={{ justifyContent: "space-between" }}>
                  <div>
                    <p>{req.receiver.fullName}</p>
                    <p style={{ fontSize: 12, opacity: 0.6 }}>
                      {req.receiver.zingleeId}
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      await axios.post("/api/friends/cancel", { requestId: req._id });
                      setSentRequests(prev =>
                      prev.filter(r => r._id !== req._id)
                          );
                      toast.success("Request cancelled");
                    }}
                    style={{
                      background: "rgba(248,113,113,0.1)",
                      border: "1px solid rgba(248,113,113,0.3)",
                      color: "#f87171",
                      padding: "4px 10px",
                      borderRadius: 6,
                      cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ))
            )
          )}

        </div>
  )
}

export default RequestContainer