import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, gradientClass, delay = 0, subtitle, prefix = '' }) => {
  const targetValue = typeof value === 'number' ? value : 0;
  const [displayValue, setDisplayValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!targetValue) { setDisplayValue(0); return; }
    let startTime;
    const duration = 1000;

    const animate = (now) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * targetValue));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [targetValue]);

  const showValue = typeof value === 'number' ? displayValue : value;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative h-full flex flex-col bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg hover:shadow-2xl rounded-2xl p-5 sm:p-6 hover:-translate-y-2 transition-all duration-500 ease-out cursor-default overflow-hidden"
    >
      {/* Glass highlight overlay */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />

      {/* Gradient glow on hover */}
      <div className={`absolute -inset-2 rounded-[2rem] opacity-0 group-hover:opacity-30 transition-opacity duration-700 blur-2xl pointer-events-none bg-gradient-to-br ${gradientClass || 'from-pink-500 to-pink-600'}`} />

      <div className="relative z-10 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1 min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-semibold text-gray-500/80 uppercase tracking-wider truncate">
              {title}
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight tabular-nums">
              {prefix}{typeof showValue === 'number' ? showValue.toLocaleString() : showValue}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
            )}
          </div>
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ml-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg bg-gradient-to-br ${gradientClass || 'from-pink-500 to-pink-600'}`}>
            <Icon size={20} className="text-white" strokeWidth={2} />
          </div>
        </div>

        <div className="mt-auto">
          <div className="h-1.5 w-full bg-gray-100/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.7, delay: delay + 0.25, ease: 'easeOut' }}
              className={`h-full rounded-full origin-left bg-gradient-to-r ${gradientClass || 'from-pink-500 to-pink-600'}`}
              style={{ width: '60%' }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
