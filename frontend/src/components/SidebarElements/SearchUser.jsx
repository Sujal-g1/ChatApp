import React from 'react'
import axios from "axios";
import toast from "react-hot-toast";
import {Search, X}  from 'lucide-react'; 


const SearchUser = ({searchInput, setSearchInput, activeTab, setSearchResults}) => {

    // search users 
const searchUsers = async (query) => {
  if (!query) {
    setSearchResults([]);
    return;
  }

  try {
    const { data } = await axios.get(`/api/auth/search?q=${query}`);
    if (data.success) { 
      setSearchResults(data.users);
    }
  } catch (error) {
    toast.error(error.message);
  }
};


  return (
      <div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 50,
    padding: '9px 14px',
    transition: 'all 0.3s ease',
  }}
  onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
  onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
>
  <span style={{ fontSize: 14, opacity: 0.5 }}>
    <Search size={15} />
  </span>
  <input
    type="text"
    placeholder={activeTab === 'communities' ? 'Search communities...' : 'Search users...'}
    value={searchInput}
    onChange={(e) => {
      setSearchInput(e.target.value);
      searchUsers(e.target.value);
    }}
    style={{
      flex: 1,
      background: 'none',
      border: 'none',
      outline: 'none',
      color: 'white',
      fontFamily: 'Outfit, sans-serif',
      fontSize: 13,
    }}
  />
  {searchInput && (
    <button
      onClick={() => {
        setSearchInput('');
        searchUsers('');
      }}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'rgba(255,255,255,0.4)',
        fontSize: 14,
      }}
    >
      <X  size={15}/>
    </button>
  )}
      </div>
  )
}

export default SearchUser