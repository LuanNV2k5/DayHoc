import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeftRight } from 'lucide-react';

interface SwapArcOverlayProps {
  idx1: number;
  idx2: number;
  val1: number;
  val2: number;
  totalElements: number;
}

export const SwapArcOverlay: React.FC<SwapArcOverlayProps> = ({
  idx1,
  idx2,
  val1,
  val2,
  totalElements,
}) => {
  const leftIdx = Math.min(idx1, idx2);
  const rightIdx = Math.max(idx1, idx2);
  const leftVal = idx1 < idx2 ? val1 : val2;
  const rightVal = idx1 < idx2 ? val2 : val1;

  // Calculate percentage center positions
  const leftPercent = ((leftIdx + 0.5) / totalElements) * 100;
  const rightPercent = ((rightIdx + 0.5) / totalElements) * 100;
  const centerPercent = (leftPercent + rightPercent) / 2;
  const spanDistance = rightIdx - leftIdx;
  const isCompact = totalElements >= 8;

  return (
    <div className="absolute top-2 left-0 right-0 h-20 pointer-events-none z-20 overflow-visible">
      {/* SVG Curved Swap Arcs */}
      <svg className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="swapGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
          <marker
            id="arrowRight"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444" />
          </marker>
          <marker
            id="arrowLeft"
            viewBox="0 0 10 10"
            refX="4"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 10 1 L 0 5 L 10 9 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Top curved path (left to right) */}
        <motion.path
          d={`M ${leftPercent}% 45 Q ${centerPercent}% ${Math.max(5, 30 - spanDistance * 4)} ${rightPercent}% 45`}
          fill="none"
          stroke="url(#swapGradient)"
          strokeWidth={isCompact ? 2.5 : 3}
          strokeDasharray="6 4"
          markerEnd="url(#arrowRight)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />

        {/* Bottom return curved path (right to left) */}
        <motion.path
          d={`M ${rightPercent}% 55 Q ${centerPercent}% ${Math.min(75, 60 + spanDistance * 4)} ${leftPercent}% 55`}
          fill="none"
          stroke="#f43f5e"
          strokeWidth={isCompact ? 2 : 2.5}
          strokeDasharray="4 3"
          markerEnd="url(#arrowLeft)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.85 }}
          transition={{ duration: 0.35, delay: 0.08, ease: 'easeOut' }}
        />
      </svg>

      {/* Floating Interactive Badge in the middle of swap */}
      <motion.div
        initial={{ scale: 0.8, y: -10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        style={{ left: `${centerPercent}%` }}
        className={`absolute top-1 -translate-x-1/2 bg-rose-600 text-white font-bold rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 whitespace-nowrap ${
          isCompact ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <ArrowLeftRight className={`${isCompact ? 'w-3 h-3' : 'w-3.5 h-3.5'} animate-spin`} />
        <span>
          {isCompact ? `A[${leftIdx}] ⇄ A[${rightIdx}]` : `Đổi chỗ: A[${leftIdx}] ⇄ A[${rightIdx}]`}
        </span>
        <span className="bg-rose-800/80 px-1 py-0.2 rounded font-mono text-[10px]">
          {leftVal} ⇄ {rightVal}
        </span>
      </motion.div>
    </div>
  );
};
