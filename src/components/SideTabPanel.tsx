import React, { useEffect, useRef, useState } from 'react';
import {
  Code,
  ExternalLink,
  Info,
  Printer,
  Table,
  Variable,
} from 'lucide-react';
import { ALGORITHM_METAS } from '../algorithms';
import {
  AlgorithmType,
  BubbleTraceRow,
  InsertionTraceRow,
  SelectionTraceRow,
  SnapshotState,
  TraceRow,
} from '../types';

interface SideTabPanelProps {
  algorithm: AlgorithmType;
  snapshot: SnapshotState;
  traceRows: TraceRow[];
  currentStepId: number;
  onJumpToSnapshot: (snapshotId: number) => void;
}

export const SideTabPanel: React.FC<SideTabPanelProps> = ({
  algorithm,
  snapshot,
  traceRows,
  currentStepId,
  onJumpToSnapshot,
}) => {
  const [activeTab, setActiveTab] = useState<'code' | 'trace' | 'idea'>('code');
  const meta = ALGORITHM_METAS[algorithm];
  const activeLineRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll active code line into view smoothly
  useEffect(() => {
    if (activeLineRef.current && activeTab === 'code') {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [snapshot.codeLine, activeTab]);

  const { variables, array } = snapshot;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full min-h-[350px]">
      {/* Tab Navigation Header */}
      <div className="bg-slate-100/80 px-2 pt-2 border-b border-slate-200 flex items-center justify-between gap-1 shrink-0">
        <div className="flex items-center gap-1">
          <button
            id="tab-view-code"
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-t-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'code'
                ? 'bg-white text-blue-700 border-t border-x border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Mã Python & Biến</span>
          </button>

          <button
            id="tab-view-trace"
            onClick={() => setActiveTab('trace')}
            className={`px-3 py-1.5 rounded-t-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'trace'
                ? 'bg-white text-blue-700 border-t border-x border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Bảng Trace ({traceRows.length} vòng)</span>
          </button>

          <button
            id="tab-view-idea"
            onClick={() => setActiveTab('idea')}
            className={`px-3 py-1.5 rounded-t-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'idea'
                ? 'bg-white text-blue-700 border-t border-x border-slate-200 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Ý tưởng</span>
          </button>
        </div>

        {activeTab === 'trace' && (
          <button
            id="btn-print-trace-tab"
            onClick={handlePrint}
            title="In / Xuất bảng trace"
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-200 mb-1"
          >
            <Printer className="w-3 h-3" />
            <span className="hidden sm:inline">In bảng</span>
          </button>
        )}
      </div>

      {/* Tab 1: Python Code & Live Variables */}
      {activeTab === 'code' && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Code Viewer */}
          <div className="p-3.5 bg-slate-50 font-mono text-xs sm:text-sm overflow-y-auto max-h-[340px] sm:max-h-[400px] select-text leading-relaxed border-b border-slate-200 flex-1">
            {meta.textbookCode.map((line) => {
              const isActive = snapshot.codeLine === line.lineNum;
              return (
                <div
                  key={line.lineNum}
                  ref={isActive ? activeLineRef : null}
                  className={`flex items-center py-1 px-2 rounded-md transition-all duration-150 ${
                    isActive
                      ? 'bg-amber-200 text-amber-950 font-bold shadow-2xs border-l-4 border-amber-600'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-6 shrink-0 select-none text-[11px] font-mono text-slate-400 flex items-center gap-0.5">
                    {isActive ? (
                      <span className="text-amber-700 font-black animate-pulse">▶</span>
                    ) : (
                      <span> </span>
                    )}
                    <span>{line.lineNum}</span>
                  </span>

                  <pre className="font-mono text-xs sm:text-sm overflow-x-visible">
                    <code
                      style={{ paddingLeft: `${line.indent * 1.1}rem` }}
                      className="inline-block"
                    >
                      {line.code}
                    </code>
                  </pre>
                </div>
              );
            })}
          </div>

          {/* Synchronized Variables Watch */}
          <div className="p-3 bg-white shrink-0 border-t border-slate-100">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-bold uppercase text-slate-600">
              <Variable className="w-4 h-4 text-blue-600" />
              <span>Giá trị biến hiện hành:</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 font-mono text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500 font-sans">
                  Chỉ số i:
                </span>
                <span className="text-base font-extrabold text-orange-700">
                  {variables.i !== null && variables.i !== undefined ? `i = ${variables.i}` : '—'}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-col">
                <span className="text-[10px] uppercase font-bold text-slate-500 font-sans">
                  Chỉ số j:
                </span>
                <span className="text-base font-extrabold text-blue-700">
                  {variables.j !== null && variables.j !== undefined ? `j = ${variables.j}` : '—'}
                </span>
              </div>

              {algorithm === 'insertion' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-sans">
                    value:
                  </span>
                  <span className="text-base font-extrabold text-purple-700">
                    {variables.value !== null && variables.value !== undefined
                      ? `${variables.value}`
                      : '—'}
                  </span>
                </div>
              )}

              {algorithm === 'selection' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-sans">
                    iMin:
                  </span>
                  <span className="text-base font-extrabold text-purple-700">
                    {variables.iMin !== null && variables.iMin !== undefined
                      ? `${variables.iMin}`
                      : '—'}
                  </span>
                </div>
              )}

              {algorithm === 'bubble' && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2 flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-sans">
                    Cặp so sánh:
                  </span>
                  <span className="text-sm font-extrabold text-purple-700 truncate">
                    {variables.a_j !== null && variables.a_j !== undefined
                      ? `(${variables.a_j}, ${variables.a_j_plus_1})`
                      : '—'}
                  </span>
                </div>
              )}

              <div className="col-span-3 sm:col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-2 flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500 font-sans">
                  Toàn bộ dãy A:
                </span>
                <span className="font-mono font-bold text-slate-900 text-sm bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-2xs">
                  [{array.join(', ')}]
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Trace Table */}
      {activeTab === 'trace' && (
        <div className="flex-1 p-2 overflow-y-auto max-h-[380px]">
          <p className="text-[11px] text-slate-500 mb-2">
            Nhấp vào bất kỳ hàng nào để đưa mô phỏng về cuối vòng lặp đó:
          </p>

          <div className="overflow-x-auto">
            {algorithm === 'insertion' && (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <th className="py-1.5 px-2 border border-slate-200">Vòng i</th>
                    <th className="py-1.5 px-2 border border-slate-200">value</th>
                    <th className="py-1.5 px-2 border border-slate-200">Vị trí chèn</th>
                    <th className="py-1.5 px-2 border border-slate-200">Dãy sau vòng i</th>
                  </tr>
                </thead>
                <tbody>
                  {(traceRows as InsertionTraceRow[]).map((row) => {
                    const isSelected = currentStepId === row.snapshotId;
                    return (
                      <tr
                        key={row.snapshotId}
                        onClick={() => onJumpToSnapshot(row.snapshotId)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-100 font-bold text-blue-950'
                            : 'hover:bg-slate-50 border-b border-slate-200'
                        }`}
                      >
                        <td className="py-1 px-2 border border-slate-200 font-mono font-bold text-orange-700">
                          i = {row.loopIndex}
                        </td>
                        <td className="py-1 px-2 border border-slate-200 font-mono font-bold text-purple-700">
                          {row.value}
                        </td>
                        <td className="py-1 px-2 border border-slate-200 font-mono text-blue-700">
                          A[{row.insertPosition}]
                        </td>
                        <td className="py-1 px-2 border border-slate-200 font-mono font-bold text-slate-900">
                          [{row.arrayAfter.join(', ')}]
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {algorithm === 'selection' && (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <th className="py-1.5 px-2 border border-slate-200">Vòng i</th>
                    <th className="py-1.5 px-2 border border-slate-200">iMin (giá trị)</th>
                    <th className="py-1.5 px-2 border border-slate-200">Đổi chỗ</th>
                    <th className="py-1.5 px-2 border border-slate-200">Dãy sau vòng i</th>
                  </tr>
                </thead>
                <tbody>
                  {(traceRows as SelectionTraceRow[]).map((row) => {
                    const isSelected = currentStepId === row.snapshotId;
                    return (
                      <tr
                        key={row.snapshotId}
                        onClick={() => onJumpToSnapshot(row.snapshotId)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-100 font-bold text-blue-950'
                            : 'hover:bg-slate-50 border-b border-slate-200'
                        }`}
                      >
                        <td className="py-1 px-2 border border-slate-200 font-mono font-bold text-orange-700">
                          i = {row.loopIndex}
                        </td>
                        <td className="py-1 px-2 border border-slate-200 font-mono font-bold text-purple-700">
                          {row.iMin} ({row.minValue})
                        </td>
                        <td className="py-1 px-2 border border-slate-200 text-slate-800">
                          {row.swappedWith}
                        </td>
                        <td className="py-1 px-2 border border-slate-200 font-mono font-bold text-slate-900">
                          [{row.arrayAfter.join(', ')}]
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}

            {algorithm === 'bubble' && (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                    <th className="py-1.5 px-2 border border-slate-200">Vòng i</th>
                    <th className="py-1.5 px-2 border border-slate-200">Cặp đã đổi chỗ</th>
                    <th className="py-1.5 px-2 border border-slate-200">Vùng cố định</th>
                    <th className="py-1.5 px-2 border border-slate-200">Dãy sau vòng</th>
                  </tr>
                </thead>
                <tbody>
                  {(traceRows as BubbleTraceRow[]).map((row) => {
                    const isSelected = currentStepId === row.snapshotId;
                    return (
                      <tr
                        key={row.snapshotId}
                        onClick={() => onJumpToSnapshot(row.snapshotId)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-100 font-bold text-blue-950'
                            : 'hover:bg-slate-50 border-b border-slate-200'
                        }`}
                      >
                        <td className="py-1 px-2 border border-slate-200 font-mono font-bold text-orange-700">
                          i = {row.loopIndex}
                        </td>
                        <td className="py-1 px-2 border border-slate-200 font-mono text-rose-700">
                          {row.swappedPairs.length > 0
                            ? row.swappedPairs.join(', ')
                            : '(Không đổi)'}
                        </td>
                        <td className="py-1 px-2 border border-slate-200 text-emerald-800 font-bold">
                          {row.fixedRange}
                        </td>
                        <td className="py-1 px-2 border border-slate-200 font-mono font-bold text-slate-900">
                          [{row.arrayAfter.join(', ')}]
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Algorithm Idea & Mechanics */}
      {activeTab === 'idea' && (
        <div className="p-3.5 space-y-3 text-xs text-slate-700 overflow-y-auto max-h-[380px]">
          <div>
            <h4 className="font-bold text-slate-900 text-sm">{meta.title} ({meta.englishName})</h4>
            <p className="mt-1 leading-relaxed text-slate-600">{meta.shortIdea}</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-1.5">
            <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">
              Đặc điểm vận hành
            </span>
            {algorithm === 'insertion' && (
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Duyệt i từ 1 đến n-1, lấy giá trị value = A[i].</li>
                <li>Duyệt lùi j = i-1 về 0: dịch các số lớn hơn value sang phải.</li>
                <li>Chèn value vào vị trí thích hợp A[j+1].</li>
                <li>Hiệu quả cao khi dãy đã gần như sắp xếp xong.</li>
              </ul>
            )}
            {algorithm === 'selection' && (
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Duyệt i từ 0 đến n-2.</li>
                <li>Tìm vị trí phần tử nhỏ nhất iMin trong đoạn A[i..n-1].</li>
                <li>Chỉ sau khi duyệt xong toàn bộ đoạn mới đổi chỗ A[i] và A[iMin] đúng 1 lần.</li>
                <li>Số lần đổi chỗ tối đa là n-1 lần.</li>
              </ul>
            )}
            {algorithm === 'bubble' && (
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>Duyệt i từ 0 đến n-2.</li>
                <li>So sánh từng cặp liền kề A[j] và A[j+1] từ đầu đến n-2-i.</li>
                <li>Nếu A[j] &gt; A[j+1] thì đổi chỗ ngay lập tức.</li>
                <li>Sau mỗi vòng i, phần tử lớn nhất nổi về vị trí cuối vùng đang xét.</li>
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
