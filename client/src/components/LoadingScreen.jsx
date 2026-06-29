import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import splashVideo from '../assets/Splashscreen.mp4';

const LoadingScreen = ({ onComplete }) => {
  const [isFinished, setIsFinished] = useState(false);
  const videoRef = useRef(null);

  const handleEnded = useCallback(() => {
    setIsFinished(true);
    setTimeout(() => onComplete(), 500);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="video-loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onEnded={handleEnded}
            className="w-full h-full object-cover"
          >
            <source src={splashVideo} type="video/mp4" />
          </video>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
