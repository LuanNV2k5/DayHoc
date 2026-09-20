import React, { useState } from 'react';
import {
  ArrowUpDown,
  Command,
  HelpCircle,
  Maximize2,
  Minimize2,
  X,
} from 'lucide-react';
import { ALGORITHM_METAS } from '../algorithms';
import { AlgorithmType } from '../types';

interface NavbarProps {
  currentAlgorithm: AlgorithmType;
  onSelectAlgorithm: (algo: AlgorithmType) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentAlgorithm,
  onSelectAlgorithm,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [showShortcutHelp, setShowShortcutHelp] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs shrink-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 h-13 flex items-center justify-between gap-3">
        {/* Logo & App Title */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <ArrowUpDown className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-none">
              Mô phỏng Thuật toán Sắp xếp
            </h1>
            <span className="text-[10px] text-slate-500 font-medium hidden sm:inline leading-tight">
              Trực quan hóa thuật toán & bảng trace thời gian thực
            </span>
          </div>
        </div>

        {/* Algorithm Tabs (Center) */}
        <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1" aria-label="Algorithms">
          {(['insertion', 'selection', 'bubble'] as AlgorithmType[]).map((algoKey) => {
            const meta = ALGORITHM_METAS[algoKey];
            const isActive = currentAlgorithm === algoKey;
            return (
              <button
                key={algoKey}
                id={`tab-algo-${algoKey}`}
                onClick={() => onSelectAlgorithm(algoKey)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                <span>{meta.title}</span>
                <span
                  className={`text-[10px] font-medium hidden md:inline px-1 py-0.2 rounded ${
                    isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-200/70 text-slate-500'
                  }`}
                >
                  {meta.englishName}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Shortcuts modal & Fullscreen */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="btn-shortcuts-help"
            onClick={() => setShowShortcutHelp(true)}
            title="Xem phím tắt điều khiển"
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <Command className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Phím tắt</span>
          </button>

          <button
            id="btn-toggle-fullscreen"
            onClick={onToggleFullscreen}
            title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Dialog */}
      {showShortcutHelp && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-4 shadow-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Command className="w-4 h-4 text-blue-600" />
                <span>Phím tắt điều khiển mô phỏng</span>
              </div>
              <button
                onClick={() => setShowShortcutHelp(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Bắt đầu / Tạm dừng:</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-2xs">
                  Space
                </kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Bước tiếp theo:</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-2xs">
                  → (Mũi tên phải)
                </kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Lùi bước trước:</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-2xs">
                  ← (Mũi tên trái)
                </kbd>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">Về trạng thái đầu:</span>
                <kbd className="px-2 py-0.5 bg-white border border-slate-300 rounded font-mono font-bold text-slate-800 shadow-2xs">
                  R
                </kbd>
              </div>
            </div>

            <button
              onClick={() => setShowShortcutHelp(false)}
              className="w-full py-1.5 bg-blue-600 text-white rounded-lg font-bold text-xs hover:bg-blue-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
