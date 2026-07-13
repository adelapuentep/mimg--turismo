import { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [hoverText, setHoverText] = useState('');

  // Raw mouse position
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Fast spring for the main dot
  const fastX = useSpring(cursorX, { damping: 25, stiffness: 300 });
  const fastY = useSpring(cursorY, { damping: 25, stiffness: 300 });

  // Slow spring for the trailing ring
  const trailX = useSpring(cursorX, { damping: 40, stiffness: 200 });
  const trailY = useSpring(cursorY, { damping: 40, stiffness: 200 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest('[data-cursor]');
      if (el) {
        setHovered(true);
        setHoverText(el.getAttribute('data-cursor') || '');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest('[data-cursor]');
      if (el) {
        setHovered(false);
        setHoverText('');
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      {/* Trailing Ring */}
      <motion.div
        className="hidden lg:block fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ x: trailX, y: trailY }}
      >
        <motion.div
          className="rounded-full border border-ink-900/60 flex justify-center items-center"
          animate={{
            width: hovered ? 0 : 36,
            height: hovered ? 0 : 36,
            opacity: hovered ? 0 : 0.35,
            x: hovered ? 0 : -18,
            y: hovered ? 0 : -18,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        />
      </motion.div>

      {/* Primary Dot */}
      <motion.div
        className="hidden lg:block fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{ x: fastX, y: fastY }}
      >
        <motion.div
          className="rounded-full bg-white flex justify-center items-center text-black font-medium text-xs tracking-wide uppercase overflow-hidden"
          animate={{
            width: hovered ? 72 : 12,
            height: hovered ? 72 : 12,
            x: hovered ? -36 : -6,
            y: hovered ? -36 : -6,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          {hovered && hoverText}
        </motion.div>
      </motion.div>
    </>
  );
}
