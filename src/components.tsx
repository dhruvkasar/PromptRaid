import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

export const AnimatedCounter = ({ value, duration = 1.5 }: AnimatedCounterProps) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);
      
      // Easing function (easeOutQuart)
      const easeOut = 1 - Math.pow(1 - percentage, 4);
      
      setDisplayValue(Math.floor(easeOut * value));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{displayValue}</span>;
};

interface ScoreBarProps {
  label: string;
  score: number;
  colorClass: string;
  delay?: number;
}

export const ScoreBar = ({ label, score, colorClass, delay = 0 }: ScoreBarProps) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between font-display font-bold uppercase mb-1 text-sm">
        <span>{label}</span>
        <span><AnimatedCounter value={score} />/100</span>
      </div>
      <div className="h-6 w-full bg-white brutal-border relative overflow-hidden">
        <motion.div 
          className={`absolute top-0 left-0 h-full ${colorClass} border-r-4 border-black`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
        />
      </div>
    </div>
  );
};
