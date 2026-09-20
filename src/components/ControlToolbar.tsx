import React, { useState } from 'react';
import {
  Check,
  Dices,
  FastForward,
  Pause,
  Play,
  RotateCcw,
  Sliders,
  StepBack,
  StepForward,
  SkipBack,
} from 'lucide-react';
import { PRESET_ARRAYS } from '../algorithms';

export type SpeedKey = 'very_slow' | 'slow' | 'medium' | 'fast' | 'turbo';

export const SPEED_MAP: Record<SpeedKey, { label: string; delayMs: number }> = {
  very_slow: { label: '0.5x (Chậm)', delayMs: 1500 },
  slow: { label: '0.8x', delayMs: 900 },
  medium: { label: '1.0x (Vừa)', delayMs: 550 },
  fast: { label: '2.0x (Nhanh)', delayMs: 280 },
  turbo: { label: '3.0x (Cực nhanh)', delayMs: 120 },
};

interface ControlToolbarProps {
  // Array management
  currentArray: number[];
  onChangeArray: (newArray: number[]) => void;
  onResetDefaultArray: () => void;

  // Playback state & handlers
  isPlaying: boolean;
  onPlay: () => void;
  onPlayFromStart?: () => void;
  onPause: () => void;
  onReplay: () => void;
  onReset: () => void;
  onStepNext: () => void;
  onStepPrev: () => void;
  onNextLoop: () => void;
  currentStep: number;
  totalSteps: number;
  currentSpeed: SpeedKey;
  onChangeSpeed: (speed: SpeedKey) => void;
  autoPauseAfterLoop: boolean;
  onToggleAutoPauseAfterLoop: (enabled: boolean) => void;
}

export const ControlToolbar: React.FC<ControlToolbarProps> = ({
  currentArray,
  onChangeArray,
  onResetDefaultArray,
  isPlaying,
  onPlay,
  onPlayFromStart,
  onPause,
  onReplay,
  onReset,
  onStepNext,
  onStepPrev,
  onNextLoop,
  currentStep,
  totalSteps,
  currentSpeed,
  onChangeSpeed,
  autoPauseAfterLoop,
  onToggleAutoPauseAfterLoop,
}) => {
  const [isEditingArray, setIsEditingArray] = useState(false);
  const [arrayInput, setArrayInput] = useState(currentArray.join(', '));
  const [inputError, setInputError] = useState<string | null>(null);

  const isFinished = currentStep >= totalSteps - 1;
  const isAtStart = currentStep <= 0;
  const handleStartFromBeginning = onPlayFromStart || onReplay;

  const handleStartEdit = () => {
    setArrayInput(currentArray.join(', '));
    setInputError(null);
    setIsEditingArray(true);
  };

  const handleApplyArrayInput = () => {
    const parts = arrayInput
      .trim()
      .split(/[\s,]+/)
      .filter((s) => s.length > 0);

    const parsed = parts.map((s) => Number(s));

    if (parsed.some((n) => isNaN(n) || !Number.isInteger(n) || n < 1 || n > 99)) {
      setInputError('Số nguyên từ 1 đến 99');
      return;
    }

    if (parsed.length < 3 || parsed.length > 14) {
      setInputError('Cần từ 3 đến 14 số');
      return;
    }

    setInputError(null);
    setIsEditingArray(false);
    onChangeArray(parsed);
  };

  const handleRandomize = () => {
    const len = Math.floor(Math.random() * 5) + 5; // 5 to 9 elements
    const nums: number[] = [];
    while (nums.length < len) {
      nums.push(Math.floor(Math.random() * 30) + 1);
    }
    onChangeArray(nums);
    setIsEditingArray(false);
    setInputError(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-2.5 sm:p-3 shadow-xs shrink-0">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
        {/* Left: Array config */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            Dãy số A:
          </span>

          {isEditingArray ? (
            <div className="flex items-center gap-1.5 flex-wrap">
              <input
                id="input-custom-array"
                type="text"
                value={arrayInput}
                onChange={(e) => setArrayInput(e.target.value)}
                placeholder="VD: 5, 3, 9, 7, 2"
                className="px-2 py-1 border border-blue-400 rounded-lg text-xs font-mono font-bold w-44 focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplyArrayInput();
                  if (e.key === 'Escape') setIsEditingArray(false);
                }}
              />
              <button
                id="btn-apply-custom-array"
                onClick={handleApplyArrayInput}
                className="px-2 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1"
              >
                <Check className="w-3 h-3" />
                <span>Lưu</span>
              </button>
              <button
                id="btn-cancel-custom-array"
                onClick={() => {
                  setIsEditingArray(false);
                  setInputError(null);
                }}
                className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs hover:bg-slate-200"
              >
                Hủy
              </button>
              {inputError && (
                <span className="text-[11px] text-rose-600 font-semibold">{inputError}</span>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 flex-wrap">
              <div
                onClick={handleStartEdit}
                title="Bấm để chỉnh sửa dãy số"
                className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 cursor-pointer hover:border-blue-300 transition-colors"
              >
                {currentArray.map((val, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center justify-center font-mono font-bold text-xs text-slate-800 bg-white border border-slate-300 w-6 h-6 rounded shadow-2xs"
                  >
                    {val}
                  </span>
                ))}
                <Sliders className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </div>

              {/* Preset Selector */}
              <select
                id="select-preset-array"
                aria-label="Chọn mẫu thử"
                onChange={(e) => {
                  const selected = PRESET_ARRAYS.find((p) => p.label === e.target.value);
                  if (selected) {
                    onChangeArray([...selected.array]);
                    setIsEditingArray(false);
                    setInputError(null);
                  }
                }}
                defaultValue=""
                className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 font-medium text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                <option value="" disabled>
                  Mẫu thử...
                </option>
                {PRESET_ARRAYS.map((preset) => (
                  <option key={preset.label} value={preset.label}>
                    {preset.label}
                  </option>
                ))}
              </select>

              {/* Random button */}
              <button
                id="btn-random-array"
                onClick={handleRandomize}
                title="Tạo ngẫu nhiên dãy số mới"
                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                <Dices className="w-3.5 h-3.5" />
              </button>

              {/* Reset to default */}
              <button
                id="btn-reset-default-array"
                onClick={onResetDefaultArray}
                title="Khôi phục dãy mặc định [5, 3, 9, 7, 2]"
                className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Playback controls */}
        <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
          {/* Progress badge */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2 py-1 rounded-lg">
            <span className="font-mono font-bold text-xs text-blue-700 whitespace-nowrap">
              Bước {currentStep + 1}/{totalSteps}
            </span>
            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-150"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Buttons: Reset, Prev, Play/Pause, Next, Next Loop */}
          <div className="flex items-center gap-1">
            <button
              id="btn-reset-step"
              onClick={onReset}
              disabled={isAtStart}
              title="Về trạng thái đầu (Bước 1)"
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-slate-700 transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              id="btn-step-prev"
              onClick={onStepPrev}
              disabled={isAtStart || isPlaying}
              title="Lùi 1 bước"
              className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <StepBack className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lùi</span>
            </button>

            {isPlaying ? (
              <button
                id="btn-pause-playback"
                onClick={onPause}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                title="Tạm dừng mô phỏng"
              >
                <Pause className="w-4 h-4 fill-current" />
                <span>Tạm dừng</span>
              </button>
            ) : isFinished ? (
              <button
                id="btn-replay-playback"
                onClick={handleStartFromBeginning}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                title="Chạy lại từ đầu đến khi có kết quả"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chạy lại từ đầu</span>
              </button>
            ) : currentStep > 0 ? (
              <div className="flex items-center gap-1">
                <button
                  id="btn-resume-playback"
                  onClick={onPlay}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                  title="Tiếp tục chạy đến khi có kết quả"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Tiếp tục</span>
                </button>
                <button
                  id="btn-play-from-start"
                  onClick={handleStartFromBeginning}
                  className="px-2 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-colors"
                  title="Chạy từ đầu đến khi có kết quả"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Chạy từ đầu</span>
                </button>
              </div>
            ) : (
              <button
                id="btn-play-playback"
                onClick={handleStartFromBeginning}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                title="Bắt đầu chạy từ đầu đến khi có kết quả"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Bắt đầu</span>
              </button>
            )}

            <button
              id="btn-step-next"
              onClick={onStepNext}
              disabled={isFinished || isPlaying}
              title="Tiến 1 bước"
              className="px-2 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-slate-700 font-bold text-xs flex items-center gap-1 transition-colors"
            >
              <span className="hidden sm:inline">Tiếp</span>
              <StepForward className="w-3.5 h-3.5" />
            </button>

            <button
              id="btn-next-loop"
              onClick={onNextLoop}
              disabled={isFinished || isPlaying}
              title="Nhảy đến hết vòng lặp ngoài hiện tại"
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:pointer-events-none text-slate-700 transition-colors"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>

          {/* Speed Selector */}
          <select
            id="select-playback-speed"
            aria-label="Tốc độ mô phỏng"
            value={currentSpeed}
            onChange={(e) => onChangeSpeed(e.target.value as SpeedKey)}
            className="text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400"
          >
            <option value="very_slow">0.5x (Chậm)</option>
            <option value="slow">0.8x</option>
            <option value="medium">1.0x (Vừa)</option>
            <option value="fast">2.0x (Nhanh)</option>
            <option value="turbo">3.0x (Cực nhanh)</option>
          </select>

          {/* Auto pause loop toggle */}
          <label
            title="Nếu bật, mô phỏng sẽ tự động tạm dừng khi kết thúc một vòng lặp ngoài. Mặc định tắt để chạy liên tục từ đầu đến khi có kết quả."
            className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 select-none transition-colors"
          >
            <input
              type="checkbox"
              id="checkbox-auto-pause-loop"
              checked={autoPauseAfterLoop}
              onChange={(e) => onToggleAutoPauseAfterLoop(e.target.checked)}
              className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
            />
            <span className="hidden xl:inline">Dừng theo vòng</span>
          </label>
        </div>
      </div>
    </div>
  );
};
