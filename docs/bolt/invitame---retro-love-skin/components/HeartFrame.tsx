
import React from 'react';
import { motion } from 'framer-motion';

interface HeartFrameProps {
  imageUrl: string;
  bgColor: string;
  className?: string;
}

export const HeartFrame: React.FC<HeartFrameProps> = ({ imageUrl, bgColor, className }) => {
  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {/* Background Floating Heart (Decoration) */}
      <motion.div 
        animate={{ 
          rotate: [0, 5, 0, -5, 0],
          y: [0, -10, 0]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        className="absolute inset-[-10px] bg-[#2C1810]/5 heart-mask z-0"
      />

      {/* Main Solid Heart Frame */}
      <div className="relative z-10 p-2 bg-[#F2E8DF] border-4 border-[#2C1810]">
         <div className="aspect-[4/5] relative overflow-hidden bg-gray-200">
            <img 
              src={imageUrl} 
              alt="Couple" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
         </div>
         {/* Overlaid Red Heart Detail */}
         <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -bottom-4 -right-4 w-20 h-20 bg-[#A63F24] heart-mask flex items-center justify-center text-[#F2E8DF] shadow-lg"
         >
           <span className="font-handwritten text-2xl -rotate-12">Love</span>
         </motion.div>
      </div>
    </motion.div>
  );
};
