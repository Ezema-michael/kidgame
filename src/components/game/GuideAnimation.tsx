import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface GuideAnimationProps {
  isVisible?: boolean;
  strokePath?: string;
  onComplete?: () => void;
}

const GuideAnimation = ({
  isVisible = true,
  strokePath = "M 50,50 L 200,50 L 200,200 L 50,200 Z",
  onComplete = () => {},
}: GuideAnimationProps) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (isVisible && pathRef.current) {
      const length = pathRef.current.getTotalLength();
      pathRef.current.style.strokeDasharray = `${length} ${length}`;
    }
  }, [isVisible]);

  return (
    <div className="absolute inset-0 bg-white/80 flex items-center justify-center pointer-events-none">
      <div className="relative w-[800px] h-[600px]">
        {/* Hand cursor animation */}
        <motion.div
          className="absolute"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            {/* Animated hand icon */}
            <motion.div
              className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{
                opacity: isVisible ? 1 : 0,
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Path animation */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 800 600"
          fill="none"
        >
          <motion.path
            ref={pathRef}
            d={strokePath}
            stroke="#000"
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: 0,
            }}
            onAnimationComplete={onComplete}
          />
        </svg>
      </div>
    </div>
  );
};

export default GuideAnimation;
