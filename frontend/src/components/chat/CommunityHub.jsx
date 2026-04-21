import React, { useEffect, useState, useContext } from "react";
import { ChatContext } from "../../../context/ChatContext";
import axios from "axios";
import toast from "react-hot-toast";

const CommunityHub = () => {
  const { setSelectedCommunity, getCommunities } = useContext(ChatContext);

  const [publicCommunities, setPublicCommunities] = useState([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const getPublicCommunities = async () => {
    const { data } = await axios.get("/api/community/public");
    if (data.success) setPublicCommunities(data.communities);
  };

  useEffect(() => {
    getPublicCommunities();
  }, []);

  const createCommunity = async () => {
    const { data } = await axios.post("/api/community/create", {
      name,
      description,
      type: "private",
    });

    if (data.success) {
      toast.success("Created");
      getCommunities();
    }
  };

  const joinCommunity = async () => {
    const { data } = await axios.post("/api/community/join", { code });

    if (data.success) {
      toast.success("Joined");
      getCommunities();
    }
  };

  return (
    <div className="p-6 space-y-6">

      <h2 className="text-lg font-semibold">Public Communities</h2>

      {publicCommunities.map((comm) => (
        <div
          key={comm._id}
          onClick={() => setSelectedCommunity(comm)}
          className="p-3 bg-white/10 rounded cursor-pointer"
        >
          {comm.name}
        </div>
      ))}

      <div>
        <h3>Create</h3>
        <input placeholder="name" onChange={(e)=>setName(e.target.value)} />
        <input placeholder="desc" onChange={(e)=>setDescription(e.target.value)} />
        <button onClick={createCommunity}>Create</button>
      </div>

      <div>
        <h3>Join</h3>
        <input placeholder="code" onChange={(e)=>setCode(e.target.value)} />
        <button onClick={joinCommunity}>Join</button>
      </div>

    </div>
  );
};

export default CommunityHub;