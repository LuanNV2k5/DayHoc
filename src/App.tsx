import React, { useEffect, useMemo, useState } from 'react';
import { generateSnapshotsForAlgorithm } from './algorithms';
import { ControlToolbar, SPEED_MAP, SpeedKey } from './components/ControlToolbar';
import { LoopReflectionBanner } from './components/LoopReflectionBanner';
import { Navbar } from './components/Navbar';
import { SideTabPanel } from './components/SideTabPanel';
import { StepExplanation } from './components/StepExplanation';
import { Visualizer } from './components/Visualizer';
import { AlgorithmType } from './types';

export default function App() {
  // Current algorithm & Array
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('insertion');
  const [baseArray, setBaseArray] = useState<number[]>([5, 3, 9, 7, 2]);

  // Generate snapshots and trace table dynamically
  const { snapshots, traceRows } = useMemo(() => {
    return generateSnapshotsForAlgorithm(algorithm, baseArray);
  }, [algorithm, baseArray]);

  // Playback state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<SpeedKey>('medium');
  const [autoPauseAfterLoop, setAutoPauseAfterLoop] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Safe current snapshot accessor
  const currentSnapshot = snapshots[currentStepIndex] || snapshots[0];

  // Auto-play interval effect
  useEffect(() => {
    if (!isPlaying) return;

    if (currentStepIndex >= snapshots.length - 1) {
      setIsPlaying(false);
      return;
    }

    const currentStep = snapshots[currentStepIndex];

    // Check if we should pause after outer loop (only if teacher enabled checkbox)
    if (autoPauseAfterLoop && currentStep.isOuterLoopEnd && currentStepIndex > 0) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => {
        if (prev < snapshots.length - 1) {
          return prev + 1;
        }
        setIsPlaying(false);
        return prev;
      });
    }, SPEED_MAP[speed].delayMs);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, snapshots, speed, autoPauseAfterLoop]);

  // Algorithm or Array switch resets step
  const handleSelectAlgorithm = (newAlgo: AlgorithmType) => {
    setAlgorithm(newAlgo);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleChangeArray = (newArr: number[]) => {
    setBaseArray(newArr);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleResetDefaultArray = () => {
    setBaseArray([5, 3, 9, 7, 2]);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  // Step Controls
  // Khi bấm "Bắt đầu": luôn chạy từ đầu đến khi có kết quả
  const handlePlayFromStart = () => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handleResume = () => {
    if (currentStepIndex >= snapshots.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReplay = () => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleStepNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < snapshots.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepPrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleNextLoop = () => {
    setIsPlaying(false);
    for (let i = currentStepIndex + 1; i < snapshots.length; i++) {
      if (snapshots[i].isOuterLoopEnd || i === snapshots.length - 1) {
        setCurrentStepIndex(i);
        return;
      }
    }
  };

  const handleJumpToSnapshot = (snapshotId: number) => {
    setIsPlaying(false);
    const targetIdx = snapshots.findIndex((s) => s.id === snapshotId);
    if (targetIdx !== -1) {
      setCurrentStepIndex(targetIdx);
    }
  };

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepPrev();
      } else if (e.key === 'r' || e.key === 'R') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Sleek Top Navigation Bar */}
      <Navbar
        currentAlgorithm={algorithm}
        onSelectAlgorithm={handleSelectAlgorithm}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-2.5 sm:p-4 space-y-2.5">
        {/* Unified Action Bar: Array customization & Playback controls */}
        <ControlToolbar
          currentArray={baseArray}
          onChangeArray={handleChangeArray}
          onResetDefaultArray={handleResetDefaultArray}
          isPlaying={isPlaying}
          onPlay={handleResume}
          onPlayFromStart={handlePlayFromStart}
          onPause={handlePause}
          onReplay={handlePlayFromStart}
          onReset={handleReset}
          onStepNext={handleStepNext}
          onStepPrev={handleStepPrev}
          onNextLoop={handleNextLoop}
          currentStep={currentStepIndex}
          totalSteps={snapshots.length}
          currentSpeed={speed}
          onChangeSpeed={setSpeed}
          autoPauseAfterLoop={autoPauseAfterLoop}
          onToggleAutoPauseAfterLoop={setAutoPauseAfterLoop}
        />

        {/* Reflection invariant toast when paused at loop completion */}
        {currentSnapshot.isOuterLoopEnd && (
          <LoopReflectionBanner
            snapshot={currentSnapshot}
            onContinue={handleStepNext}
          />
        )}

        {/* Primary Simulation Layout: Left = Visualizer + Explanation; Right = Code / Trace / Idea */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 items-start">
          {/* Left Column: Visualizer & Step Explanation */}
          <div className="lg:col-span-7 space-y-2.5">
            <Visualizer snapshot={currentSnapshot} />
            <StepExplanation snapshot={currentSnapshot} />
          </div>

          {/* Right Column: Interactive Tabs for Python Code, Loop Trace Table, and Idea */}
          <div className="lg:col-span-5">
            <SideTabPanel
              algorithm={algorithm}
              snapshot={currentSnapshot}
              traceRows={traceRows}
              currentStepId={currentSnapshot.id}
              onJumpToSnapshot={handleJumpToSnapshot}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
