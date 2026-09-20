import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { SnapshotState } from '../types';

interface LoopReflectionBannerProps {
  snapshot: SnapshotState;
  onContinue: () => void;
}

export const LoopReflectionBanner: React.FC<LoopReflectionBannerProps> = ({
  snapshot,
  onContinue,
}) => {
  if (!snapshot.isOuterLoopEnd || !snapshot.loopEndQuestion) {
    return null;
  }

  const { loopIndex, takeaway } = snapshot.loopEndQuestion;

  return (
    <div className="bg-amber-50 border border-amber-300 rounded-xl p-2.5 sm:p-3 shadow-xs animate-fade-in my-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-1">
          <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
            ✓
          </div>
          <div className="text-xs sm:text-sm">
            <span className="font-bold text-amber-950 uppercase mr-1.5">
              Đã xong vòng ngoài i = {loopIndex}:
            </span>
            <span className="text-emerald-900 font-bold bg-white/90 px-2 py-0.5 rounded border border-amber-200 inline-block">
              {takeaway}
            </span>
          </div>
        </div>

        <button
          id="btn-continue-after-loop-pause"
          onClick={onContinue}
          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-colors shrink-0"
        >
          <span>Sang vòng tiếp</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
