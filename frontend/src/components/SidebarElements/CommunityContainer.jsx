import { motion, AnimatePresence } from 'framer-motion'

const CommunityContainer = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
     style={{ textAlign: 'center', padding: '40px 20px', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
     Communities coming soon
    </motion.div>

  )
}

export default CommunityContainer