import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, X } from 'lucide-react';

export const Notification = ({ message, onClose, type = 'success' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed top-4 right-4 z-50"
      >
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg backdrop-blur-md border`}
          style={type === 'success' ? {
            backgroundColor: '#60a5fa33', // translucent blue
            borderColor: '#60a5fa',
            color: '#60a5fa'
          } : {
            backgroundColor: '#ef444433', // translucent red
            borderColor: '#ef4444',
            color: '#ef4444'
          }}
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: type === 'success' ? '#60a5fa' : '#ef4444' }} />
          <span className="text-sm font-medium">{message}</span>
          <button
            onClick={onClose}
            className="ml-2 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" style={{ color: type === 'success' ? '#60a5fa' : '#ef4444' }} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};