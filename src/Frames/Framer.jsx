import React from 'react'
import { motion } from 'framer-motion'


function Framer({children}) {
  return (
    
    <motion.div
    initial={{ y: -100, opacity: 0 }} 
    animate={{ y: 0, opacity: 1 }} 
    transition={{ type: "spring", stiffness: 60, damping: 10, duration: 1 }}
    >
            {children}
    </motion.div>
  )
}

export default Framer