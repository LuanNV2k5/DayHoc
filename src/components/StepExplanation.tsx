import React from 'react';
import { Info, Lightbulb } from 'lucide-react';
import { SnapshotState } from '../types';

interface StepExplanationProps {
  snapshot: SnapshotState;
}

export const StepExplanation: React.FC<StepExplanationProps> = ({ snapshot }) => {
  const { algorithm, explanation, variables } = snapshot;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs">
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 mb-2.5">
        <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-800 uppercase tracking-wide">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Chi tiết diễn giải sư phạm</span>
        </div>
        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
          {explanation.outerLoopInfo}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs sm:text-sm">
        {/* State of loop & pointers */}
        <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex flex-col justify-center space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Vòng lặp ngoài (i):</span>
            <span className="font-mono font-extrabold text-orange-700 bg-orange-100/60 px-2 py-0.5 rounded">
              {variables.i !== null && variables.i !== undefined ? `i = ${variables.i}` : '—'}
            </span>
          </div>

          {algorithm === 'insertion' && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Giá trị nhấc (value):</span>
              <span className="font-mono font-extrabold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded">
                {variables.value !== null && variables.value !== undefined
                  ? `value = ${variables.value}`
                  : '—'}
              </span>
            </div>
          )}

          {algorithm === 'selection' && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Chỉ số nhỏ nhất (iMin):</span>
              <span className="font-mono font-extrabold text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded">
                {variables.iMin !== null && variables.iMin !== undefined
                  ? `iMin = ${variables.iMin} (A[iMin] = ${variables.a_iMin})`
                  : '—'}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Con trỏ duyệt (j):</span>
            <span className="font-mono font-extrabold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
              {variables.j !== null && variables.j !== undefined ? `j = ${variables.j}` : '—'}
            </span>
          </div>
        </div>

        {/* Action result & rule */}
        <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-200 flex flex-col justify-center space-y-2">
          <div className="text-slate-800 leading-normal">
            <span className="text-slate-500 font-medium">Hành động: </span>
            <span className="font-bold text-slate-900">{explanation.actionResult}</span>
          </div>

          {explanation.pedagogicalTip && (
            <div className="text-xs text-blue-950 bg-blue-50 border border-blue-200/80 p-2 rounded-lg flex items-start gap-1.5 leading-snug">
              <Lightbulb className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                <strong>Ghi nhớ:</strong> {explanation.pedagogicalTip}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
