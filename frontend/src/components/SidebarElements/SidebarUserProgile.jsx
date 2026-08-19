import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../../assets/assets';
import { AuthContext } from '../../../context/AuthContext';
import { Pen } from 'lucide-react';

const SidebarUserProgile = () => {

     const { authUser } = useContext(AuthContext)

    const navigate = useNavigate();
  return (
     <div style={{
       height: '64px',
        boxSizing: 'border-box',
        padding: '0 16px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', 
        alignItems: 'center', 
        gap: 10,
        flexShrink: 0, 
        background: 'rgba(0,0,0,0.1)',
      }}>
        <img
          src={authUser?.profilePic || assets.avatar_icon}
          alt=""
          onClick={() => navigate('/profile')}
          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)', cursor: 'pointer' }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {authUser?.fullName}
          </p>
          <p style={{ fontSize: 11, color: '#4ade80' }}>● Active</p>
        </div>
        <button className="icon-btn" onClick={() => navigate('/profile')} title="Edit profile" style={{ fontSize: 15 }}>
          <Pen size={18}/>
        </button>
      </div>
  )
}

export default SidebarUserProgile