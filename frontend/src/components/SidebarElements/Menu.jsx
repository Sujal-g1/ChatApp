import { motion, AnimatePresence } from 'framer-motion'
import {Signpost ,UserRound, BellRing,Settings,LogOut,Palette, Share2, Pen,
 Megaphone, FileText, ShieldCheck, Search, X } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

const Menu = ({ menuOpen,setMenuOpen, showThemes, setShowThemes}) => {

 const { logout, authUser } = useContext(AuthContext)

    const navigate = useNavigate();


    // share profile ----------------------
const handleShareInvite = async () => {
  const userId = authUser?.zingleeId || authUser?._id;
  const liveUrl = "https://zingleee.vercel.app";

  const shareText = `Hey! I'm using Zingleee.
    Join using my ID: ${userId}
    // Try it here: ${liveUrl}
`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Join with me on Zingleee",
        text: shareText,
        url: liveUrl,
      });
    } catch (error) {
      console.log("Share cancelled", error);
    }
  } else {
    await navigator.clipboard.writeText(shareText);
    toast.success("Invite copied to clipboard!");
  }

  setMenuOpen(false);
};

  return (
     <div style={{ position: 'relative', flexShrink: 0 }}>
      <button 
        className="icon-btn" 
        onClick={() => setMenuOpen(!menuOpen)} 
        style={{ 
          width: 34, 
          height: 34, 
          fontSize: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        ⋮
      </button>
      <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -8 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute', top: '110%', right: 0, zIndex: 50,
                    background: 'rgba(15,12,40,0.95)', backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14,
                    padding: 8, minWidth: 160,
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                  }}
                >
                  {[
                    { icon: <UserRound />, label: 'Edit Profile', action: () => { navigate('/profile'); setMenuOpen(false) } },
                    { icon:<Palette />, label: 'Themes', action: () => { setShowThemes(!showThemes); setMenuOpen(false) } },
                    { icon: <Megaphone />, label: 'Zingleee voice', action: () => { navigate('/voice'); setMenuOpen(false);},danger: false,},   
                    { icon: <BellRing />, label: 'Notifications', action: () => setMenuOpen(false) },
                    { icon: <Settings />, label: 'Settings', action: () => setMenuOpen(false) },
                    {icon: <Share2 />,label: 'Invite Friends',action: () => handleShareInvite(),danger: false,},
                   { icon: <Signpost />, label: 'How to Use', action: () => {  navigate('/ins'); setMenuOpen(false); }, 
                     danger: false},
                    { icon: <LogOut />, label: 'Logout', action: () => { logout(); setMenuOpen(false) }, danger: true },
                  ].map((item, i) => (
                    <button key={i}
                      onClick={item.action}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        width: '100%', padding: '9px 12px', borderRadius: 10,
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: item.danger ? '#f87171' : 'rgba(255,255,255,0.8)',
                        fontSize: 13, fontFamily: 'Outfit, sans-serif',
                        transition: 'background 0.15s ease', textAlign: 'left',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                      <span>{item.icon}</span> {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
    </AnimatePresence>
          </div>
  )
}

export default Menu