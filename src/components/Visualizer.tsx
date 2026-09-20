import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { SnapshotState } from '../types';
import { SwapArcOverlay } from './SwapArcOverlay';

interface VisualizerProps {
  snapshot: SnapshotState;
  isPresentationMode?: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  snapshot,
  isPresentationMode = false,
}) => {
  const {
    algorithm,
    array,
    elementIds,
    sortedIndices,
    comparedIndices,
    swappingIndices,
    swapDetail,
    shiftingIndex,
    targetSlotIndex,
    liftedValue,
    variables,
    explanation,
  } = snapshot;

  const maxVal = Math.max(...array, liftedValue?.value || 1, 10);
  const n = array.length;

  // Dynamic layout sizing configuration based on array element count
  const layout = React.useMemo(() => {
    if (n <= 5) {
      return {
        colMaxWidth: 'max-w-[75px] sm:max-w-[90px]',
        gap: 'gap-2.5 sm:gap-4 md:gap-5',
        maxHeightPx: isPresentationMode ? 310 : 260,
        minHeightPx: isPresentationMode ? 85 : 70,
        valText: 'text-xl sm:text-2xl md:text-3xl',
        indexText: 'text-xs sm:text-sm py-1',
        badgeClass: 'text-[9px] sm:text-[11px] px-1.5 py-0.5',
        pointerClass: 'text-[10px] px-1.5 py-0.5',
        iconClass: 'w-4 h-4',
        paddingBar: 'p-1.5',
        stageMinHeight: 'min-h-[330px] sm:min-h-[370px]',
        compactBadges: false,
      };
    } else if (n <= 7) {
      return {
        colMaxWidth: 'max-w-[56px] sm:max-w-[68px]',
        gap: 'gap-2 sm:gap-3',
        maxHeightPx: isPresentationMode ? 270 : 225,
        minHeightPx: isPresentationMode ? 75 : 60,
        valText: 'text-lg sm:text-xl md:text-2xl',
        indexText: 'text-xs py-0.5',
        badgeClass: 'text-[9px] sm:text-[10px] px-1 py-0.5',
        pointerClass: 'text-[9px] px-1.5 py-0.5',
        iconClass: 'w-3.5 h-3.5',
        paddingBar: 'p-1 sm:p-1.5',
        stageMinHeight: 'min-h-[290px] sm:min-h-[320px]',
        compactBadges: false,
      };
    } else if (n <= 9) {
      return {
        colMaxWidth: 'max-w-[42px] sm:max-w-[50px]',
        gap: 'gap-1 sm:gap-1.5 md:gap-2',
        maxHeightPx: isPresentationMode ? 230 : 190,
        minHeightPx: isPresentationMode ? 60 : 48,
        valText: 'text-sm sm:text-base md:text-lg',
        indexText: 'text-[10px] sm:text-xs py-0.5',
        badgeClass: 'text-[8.5px] sm:text-[9.5px] px-0.5 py-0.2',
        pointerClass: 'text-[8.5px] px-1 py-0.2',
        iconClass: 'w-3 h-3',
        paddingBar: 'p-0.5 sm:p-1',
        stageMinHeight: 'min-h-[250px] sm:min-h-[280px]',
        compactBadges: true,
      };
    } else {
      // 10 to 14 elements: ultra-compact to fit comfortably without horizontal scroll
      return {
        colMaxWidth: 'max-w-[30px] sm:max-w-[38px]',
        gap: 'gap-0.5 sm:gap-1',
        maxHeightPx: isPresentationMode ? 190 : 160,
        minHeightPx: isPresentationMode ? 48 : 38,
        valText: 'text-xs sm:text-sm',
        indexText: 'text-[9px] py-0.2',
        badgeClass: 'text-[8px] px-0.5 py-0.1',
        pointerClass: 'text-[8px] px-0.5 py-0.1',
        iconClass: 'w-2.5 h-2.5',
        paddingBar: 'p-0.5',
        stageMinHeight: 'min-h-[220px] sm:min-h-[245px]',
        compactBadges: true,
      };
    }
  }, [n, isPresentationMode]);

  const getBarHeight = (val: number) => {
    const ratio = Math.max(0.12, val / maxVal);
    return Math.round(layout.minHeightPx + ratio * (layout.maxHeightPx - layout.minHeightPx));
  };

  // Ensure element keys are strictly unique across all rendered column elements
  const elementKeys = React.useMemo(() => {
    if (elementIds && elementIds.length === array.length) {
      const seen = new Set<number>();
      let hasDuplicates = false;
      for (const id of elementIds) {
        if (id === undefined || seen.has(id)) {
          hasDuplicates = true;
          break;
        }
        seen.add(id);
      }
      if (!hasDuplicates) {
        return elementIds.map((id) => `element-${id}`);
      }
    }
    return array.map((_, idx) => `col-slot-${idx}`);
  }, [elementIds, array]);

  const isSwapActive = swappingIndices.length === 2;
  const swapIdx1 = isSwapActive ? Math.min(swappingIndices[0], swappingIndices[1]) : null;
  const swapIdx2 = isSwapActive ? Math.max(swappingIndices[0], swappingIndices[1]) : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3.5 sm:p-5 shadow-xs flex flex-col justify-between relative overflow-hidden transition-all">
      {/* Top: Real-time Comparison / Action Status Banner */}
      <div className="mb-3">
        {explanation.comparison ? (
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-2.5 text-center shadow-2xs">
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm md:text-base font-extrabold text-amber-950">
              <span className="bg-amber-200/90 px-2 py-0.5 rounded text-amber-900 font-mono text-sm sm:text-base">
                {explanation.comparison.leftText} = {explanation.comparison.leftVal}
              </span>
              <span className="text-amber-800 font-black text-lg">
                {explanation.comparison.op}
              </span>
              <span className="bg-amber-200/90 px-2 py-0.5 rounded text-amber-900 font-mono text-sm sm:text-base">
                {explanation.comparison.rightText} = {explanation.comparison.rightVal}
              </span>
              <span className="text-slate-400 font-bold">→</span>
              <span
                className={`px-2.5 py-0.5 rounded font-black uppercase text-xs sm:text-sm tracking-wider shadow-2xs ${
                  explanation.comparison.result
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {explanation.comparison.result ? 'ĐÚNG (Cần đổi chỗ)' : 'SAI (Giữ nguyên)'}
              </span>
              <span className="text-slate-400 hidden sm:inline">|</span>
              <span className="text-slate-900 font-bold text-xs sm:text-sm underline decoration-amber-400 decoration-2">
                {explanation.comparison.actionText}
              </span>
            </div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 flex items-center justify-between gap-3 text-xs sm:text-sm shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-slate-800 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></span>
              <span className="truncate">{explanation.title}</span>
            </div>
            <span className="text-slate-500 font-medium text-xs bg-slate-200/80 px-2 py-0.5 rounded-full shrink-0 font-mono">
              {explanation.outerLoopInfo}
            </span>
          </div>
        )}
      </div>

      {/* Floating Tray for Insertion Sort "value" (Lifted element) */}
      {algorithm === 'insertion' && liftedValue && (
        <div className="mb-3 flex justify-center">
          <div className="bg-purple-50 border border-purple-400 rounded-xl px-4 py-1.5 flex items-center gap-2.5 shadow-xs">
            <div className="flex items-center gap-1 text-purple-900 font-bold text-xs uppercase tracking-wide">
              <ArrowDown className="w-4 h-4 text-purple-700 animate-bounce" />
              <span>Giá trị đang nhấc (value):</span>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-purple-600 text-white font-extrabold text-base sm:text-lg rounded-lg flex items-center justify-center shadow-xs">
              {liftedValue.value}
            </div>
            <div className="text-xs text-purple-800 font-medium hidden sm:block">
              (tách từ A[{liftedValue.originalIndex}] • vị trí dự kiến chèn:{' '}
              <span className="font-bold text-purple-950 font-mono bg-purple-200/60 px-1.5 py-0.5 rounded">
                A[{liftedValue.currentSlot}]
              </span>
              )
            </div>
          </div>
        </div>
      )}

      {/* Main Bars Display Stage */}
      <div
        className={`relative pt-10 pb-2 px-1 sm:px-2 ${layout.stageMinHeight} flex flex-col justify-end`}
      >
        {/* Subtle Horizontal Reference Grid Lines in background to fill empty space */}
        <div className="absolute inset-x-2 top-8 bottom-16 pointer-events-none flex flex-col justify-between opacity-30 border-b border-dashed border-slate-300">
          <div className="border-b border-dashed border-slate-200 flex justify-between text-[10px] text-slate-400 font-mono">
            <span>100%</span>
            <span>max = {maxVal}</span>
          </div>
          <div className="border-b border-dashed border-slate-200 flex justify-between text-[10px] text-slate-400 font-mono">
            <span>75%</span>
            <span>{Math.round(maxVal * 0.75)}</span>
          </div>
          <div className="border-b border-dashed border-slate-200 flex justify-between text-[10px] text-slate-400 font-mono">
            <span>50%</span>
            <span>{Math.round(maxVal * 0.5)}</span>
          </div>
          <div className="border-b border-dashed border-slate-200 flex justify-between text-[10px] text-slate-400 font-mono">
            <span>25%</span>
            <span>{Math.round(maxVal * 0.25)}</span>
          </div>
        </div>

        {/* Dynamic Curved Swap Arc Overlay when 2 columns are swapping */}
        {isSwapActive && swapIdx1 !== null && swapIdx2 !== null && (
          <SwapArcOverlay
            idx1={swapIdx1}
            idx2={swapIdx2}
            val1={swapDetail?.val1 ?? array[swapIdx1]}
            val2={swapDetail?.val2 ?? array[swapIdx2]}
            totalElements={array.length}
          />
        )}

        {/* Layout Animated Columns Container */}
        <div className={`relative flex items-end justify-center ${layout.gap} w-full z-10`}>
          {array.map((value, idx) => {
            const isSorted = sortedIndices.includes(idx);
            const isComparing = comparedIndices.includes(idx);
            const isSwapping = swappingIndices.includes(idx);
            const isShifting = shiftingIndex === idx;
            const isTargetSlot = targetSlotIndex === idx && algorithm === 'insertion';
            const isIMin = variables.iMin === idx;
            const isPointerI = variables.i === idx;
            const isPointerJ = variables.j === idx;

            // Compute styling
            let barBg = 'bg-slate-100/90 border-slate-300 text-slate-800 shadow-xs';
            let badgeText = layout.compactBadges ? '—' : 'Chưa xếp';
            let badgeColor = 'bg-slate-100 text-slate-500 border-slate-200';

            if (isSorted) {
              barBg = 'bg-emerald-100/90 border-emerald-500 text-emerald-950 shadow-emerald-100';
              badgeText = layout.compactBadges
                ? '✓ Xong'
                : algorithm === 'bubble'
                  ? 'Đã cố định'
                  : 'Đã xếp';
              badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold';
            }

            if (isComparing) {
              barBg =
                'bg-amber-200 border-amber-500 text-amber-950 ring-4 ring-amber-400/80 shadow-amber-200';
              badgeText = layout.compactBadges ? 'So sánh' : 'Đang so sánh';
              badgeColor = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
            }

            if (isSwapping) {
              barBg =
                'bg-rose-100 border-rose-600 text-rose-950 ring-4 ring-rose-400/80 shadow-2xl shadow-rose-500/30';
              badgeText = layout.compactBadges ? 'Đổi ⮂' : 'Đổi chỗ ⮂';
              badgeColor = 'bg-rose-600 text-white border-rose-700 font-bold animate-pulse';
            }

            if (isShifting) {
              barBg =
                'bg-indigo-100 border-indigo-500 text-indigo-950 ring-4 ring-indigo-400/80 shadow-indigo-200';
              badgeText = layout.compactBadges ? 'Dịch →' : 'Dịch phải →';
              badgeColor = 'bg-indigo-600 text-white border-indigo-700 font-bold';
            }

            if (isTargetSlot && liftedValue) {
              badgeText = layout.compactBadges ? 'Chờ' : 'Ô chờ chèn';
              badgeColor = 'bg-purple-100 text-purple-900 border-purple-400 font-bold';
            }

            const barHeight = getBarHeight(value);
            const stableKey = elementKeys[idx] || `col-slot-${idx}`;

            return (
              <motion.div
                layout
                key={stableKey}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 24,
                  mass: 0.8,
                }}
                className={`flex flex-col items-center flex-1 ${layout.colMaxWidth} relative transition-transform ${
                  isSwapping ? '-translate-y-3 sm:-translate-y-4 z-20' : 'z-10'
                }`}
              >
                {/* Visual Swap Direction Indicators on top of swapping columns */}
                {isSwapping && isSwapActive && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-7 px-1.5 py-0.5 rounded-full bg-rose-700 text-white text-[9px] font-black tracking-wider flex items-center gap-1 shadow-md whitespace-nowrap"
                  >
                    {idx === swapIdx1 ? (
                      <>
                        <span>{layout.compactBadges ? '→ Phải' : 'Sang phải'}</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </>
                    ) : (
                      <>
                        <ArrowLeft className="w-2.5 h-2.5" />
                        <span>{layout.compactBadges ? '← Trái' : 'Sang trái'}</span>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Pointer badges on top of bar (i, j, iMin) */}
                <div className="h-7 flex items-center justify-center gap-0.5 mb-1">
                  {isPointerI && (
                    <span
                      className={`bg-orange-600 text-white font-mono font-bold ${layout.pointerClass} rounded-md shadow-xs`}
                      title={`Chỉ số vòng ngoài i = ${variables.i}`}
                    >
                      i
                    </span>
                  )}
                  {isPointerJ && (
                    <span
                      className={`bg-blue-600 text-white font-mono font-bold ${layout.pointerClass} rounded-md shadow-xs`}
                      title={`Chỉ số quét j = ${variables.j}`}
                    >
                      j
                    </span>
                  )}
                  {isIMin && (
                    <span
                      className={`bg-purple-600 text-white font-mono font-bold ${layout.pointerClass} rounded-md shadow-xs flex items-center gap-0.5`}
                      title={`Vị trí nhỏ nhất iMin = ${variables.iMin}`}
                    >
                      <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                      {layout.compactBadges ? 'Min' : 'iMin'}
                    </span>
                  )}
                </div>

                {/* The Vertical Column Bar */}
                <div
                  style={{ height: `${barHeight}px` }}
                  className={`w-full rounded-t-xl border-2 flex flex-col justify-between items-center ${layout.paddingBar} transition-all duration-200 relative select-none ${barBg}`}
                >
                  {/* Number inside/atop bar */}
                  <span
                    className={`font-mono font-black ${layout.valText} leading-none pt-0.5 sm:pt-1`}
                  >
                    {value}
                  </span>

                  {/* Status icon inside bar */}
                  <div className="pb-0.5 sm:pb-1">
                    {isSorted && (
                      <CheckCircle2
                        className={`${layout.iconClass} text-emerald-600 opacity-90`}
                      />
                    )}
                    {isSwapping && (
                      <ArrowUpDown className={`${layout.iconClass} text-rose-700 animate-bounce`} />
                    )}
                    {isShifting && (
                      <ArrowRight className={`${layout.iconClass} text-indigo-700 animate-pulse`} />
                    )}
                  </div>
                </div>

                {/* Bottom Base: Index & Status Tag */}
                <div
                  className={`w-full bg-slate-200/90 border border-slate-300 ${layout.indexText} text-center font-mono font-bold text-slate-800 rounded-b-lg shadow-2xs truncate`}
                >
                  A[{idx}]
                </div>

                {/* State Label below column */}
                <div className="mt-1 w-full flex justify-center">
                  <span
                    className={`${layout.badgeClass} text-center rounded-md border leading-tight block truncate max-w-full font-medium ${badgeColor}`}
                  >
                    {badgeText}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Bubble Sort Fixed Region Banner at bottom right if fixed */}
      {algorithm === 'bubble' && sortedIndices.length > 0 && (
        <div className="mt-3 bg-emerald-50 border border-emerald-300 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-emerald-900 font-semibold">
          <div className="flex items-center gap-2 text-xs">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              Vùng cố định bên phải (A[{sortedIndices[0]}..A[{sortedIndices[sortedIndices.length - 1]}]):
            </span>
          </div>
          <span className="bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-md text-xs font-bold font-mono">
            Đã chốt thứ tự
          </span>
        </div>
      )}

      {/* Compact Legend Bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-200 border border-emerald-400"></span>
          <span>Đã xếp</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-200 border border-amber-400"></span>
          <span>So sánh</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-rose-200 border border-rose-400"></span>
          <span>Đang đổi chỗ ⮂</span>
        </span>
        {algorithm === 'insertion' && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-indigo-200 border border-indigo-400"></span>
            <span>Dịch phải</span>
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <span className="px-1.5 py-0.2 bg-orange-600 text-white rounded font-mono font-bold text-[10px]">
            i
          </span>
          <span>Vòng ngoài</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="px-1.5 py-0.2 bg-blue-600 text-white rounded font-mono font-bold text-[10px]">
            j
          </span>
          <span>Vòng trong</span>
        </span>
        {algorithm === 'selection' && (
          <span className="inline-flex items-center gap-1.5">
            <span className="px-1.5 py-0.2 bg-purple-600 text-white rounded font-mono font-bold text-[10px]">
              iMin
            </span>
            <span>Min</span>
          </span>
        )}
      </div>
    </div>
  );
};
