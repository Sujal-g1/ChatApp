import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from '../context/AuthContext.jsx'
import { ChatProvider } from '../context/ChatContext.jsx'
import { NetworkProvider } from '../context/NetworkContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <NetworkProvider>
    <AuthProvider>
      <ChatProvider>
        <App />
      </ChatProvider>
    </AuthProvider>
  </NetworkProvider>
  </BrowserRouter>
)