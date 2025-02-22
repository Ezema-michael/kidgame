import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PartyPopper } from "lucide-react";

interface CelebrationOverlayProps {
  isVisible?: boolean;
  message?: string;
  onComplete?: () => void;
}

const CelebrationOverlay = ({
  isVisible = true,
  message = "Great job!",
  onComplete = () => {},
}: CelebrationOverlayProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-pink-100/95 via-blue-100/95 to-purple-100/95 flex items-center justify-center z-50 overflow-hidden"
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            onAnimationComplete={() => {
              setTimeout(onComplete, 1500); // Add delay before moving to next letter
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="mb-8"
            >
              <div className="relative">
                <PartyPopper className="w-24 h-24 text-yellow-500 animate-bounce" />
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-4 h-4 rounded-full`}
                    style={{
                      background: `hsl(${Math.random() * 360}, 80%, 60%)`,
                      top: `${Math.random() * 200 - 100}px`,
                      left: `${Math.random() * 200 - 100}px`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      y: [0, -100],
                      x: [0, (Math.random() - 0.5) * 200],
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.1,
                      repeat: Infinity,
                      repeatDelay: 0.5,
                    }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.h2
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 mb-4 animate-pulse"
            >
              {message}
            </motion.h2>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center space-x-4"
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    delay: 0.5 + i * 0.1,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  className="w-4 h-4 rounded-full bg-yellow-400"
                />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationOverlay;
