import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  Layers, 
  Eye, 
  Tv, 
  Film, 
  Smartphone, 
  Clock, 
  Maximize2, 
  Grid, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  Clapperboard,
  Video,
  Mic,
  Music,
  Share2
} from 'lucide-react';
import { ThreeColumnRow } from '../types/script';
import { audioEngine } from '../utils/audioPlayer';

interface StoryboardPreviewProps {
  rows: ThreeColumnRow[];
  scriptTitle?: string;
  onOpenExportModal: () => void;
  onBackToTable: () => void;
}

export const StoryboardPreview: React.FC<StoryboardPreviewProps> = ({
  rows,
  scriptTitle = 'ScriptLab Production Script',
  onOpenExportModal,
  onBackToTable,
}) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'cinema'>('grid');
  const [cinemaIndex, setCinemaIndex] = useState<number>(0);
  const [isAutoplaying, setIsAutoplaying] = useState<boolean>(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const autoplayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Play audio chime for UI feedback
  const playChime = (freq = 580) => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.2);
    } catch {
      // Audio fallback
    }
  };

  // Play voiceover for a single row using audioEngine
  const handlePlayVoice = (row: ThreeColumnRow, onEndCallback?: () => void) => {
    if (playingVoiceId === row.id) {
      audioEngine.stopSpeaking();
      setPlayingVoiceId(null);
      setIsAutoplaying(false);
      return;
    }

    audioEngine.stopSpeaking();
    setPlayingVoiceId(row.id);
    setActiveCardId(row.id);

    audioEngine.speakVoiceover(row.audioVoiceover, {
      gender: row.voiceGenderHint,
      onEnd: () => {
        setPlayingVoiceId(null);
        if (onEndCallback) onEndCallback();
      },
    });
  };

  // Autoplay through the entire storyboard
  const handleToggleAutoplay = () => {
    if (isAutoplaying) {
      audioEngine.stopSpeaking();
      setIsAutoplaying(false);
      setPlayingVoiceId(null);
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
      return;
    }

    setIsAutoplaying(true);
    let curIndex = 0;

    const playNextScene = () => {
      if (curIndex >= rows.length) {
        setIsAutoplaying(false);
        setPlayingVoiceId(null);
        setActiveCardId(null);
        return;
      }

      const currentRow = rows[curIndex];
      setCinemaIndex(curIndex);
      setActiveCardId(currentRow.id);

      handlePlayVoice(currentRow, () => {
        curIndex++;
        autoplayTimerRef.current = setTimeout(playNextScene, 800);
      });
    };

    playNextScene();
  };

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopSpeaking();
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
    };
  }, []);

  // Compute visual background styling depending on shot type
  const getShotVisualGradient = (shotType: string) => {
    switch (shotType) {
      case 'CU':
        return 'from-amber-950/80 via-slate-900 to-slate-950 border-amber-500/40';
      case 'MCU':
        return 'from-blue-950/80 via-slate-900 to-slate-950 border-blue-500/40';
      case 'WS':
        return 'from-emerald-950/80 via-slate-900 to-slate-950 border-emerald-500/40';
      case 'POV':
        return 'from-purple-950/80 via-slate-900 to-slate-950 border-purple-500/40';
      case 'Graphic':
        return 'from-indigo-950/80 via-slate-900 to-slate-950 border-indigo-500/40';
      default:
        return 'from-slate-900 via-slate-900 to-slate-950 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Storyboard Top Bar */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
              🎬 ระบบ Storyboard Preview
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">จำลองการจับคู่ภาพ 16:9 และเสียงพากย์</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            การ์ดสตอรี่บอร์ดโปรดักชัน (Storyboard Deck)
          </h2>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-700/80 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5 text-amber-500" />
              <span>ตารางการ์ด (Grid)</span>
            </button>
            <button
              onClick={() => setViewMode('cinema')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'cinema'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5 text-blue-500" />
              <span>โหมดฉายเดี่ยว (Cinema)</span>
            </button>
          </div>

          {/* Autoplay Storyboard Button */}
          <button
            onClick={handleToggleAutoplay}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs ${
              isAutoplaying
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isAutoplaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            <span>{isAutoplaying ? 'หยุดเล่นสตอรี่บอร์ด' : 'เล่นสตอรี่บอร์ดต่อเนื่อง'}</span>
          </button>

          {/* Export Script Button */}
          <button
            onClick={onOpenExportModal}
            className="px-4 py-2 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs rounded-xl hover:bg-slate-800 dark:hover:bg-amber-400 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export (PDF / Text)</span>
          </button>

          {/* Back to Table Editor */}
          <button
            onClick={onBackToTable}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            กลับสู่ตาราง
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: GRID VIEW (แสดงการ์ดทั้งหมดจับคู่ภาพและเสียง) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rows.map((row, idx) => {
            const isPlaying = playingVoiceId === row.id;
            const isHighlighted = activeCardId === row.id;

            return (
              <div
                key={row.id}
                className={`rounded-3xl border overflow-hidden transition-all duration-300 flex flex-col bg-white dark:bg-slate-800 shadow-sm ${
                  isHighlighted || isPlaying
                    ? 'ring-2 ring-amber-500 dark:ring-amber-400 shadow-xl scale-[1.01]'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                {/* 1. CINEMATIC 16:9 VISUAL FRAME (ส่วนภาพ) */}
                <div className={`relative aspect-video w-full bg-gradient-to-br ${getShotVisualGradient(row.shotType)} border-b text-white p-5 flex flex-col justify-between overflow-hidden select-none`}>
                  {/* Viewfinder Overlay & Grid Lines */}
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Rule of Thirds subtle lines */}
                    <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-20">
                      <div className="border-r border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-b border-white" />
                      <div className="border-r border-white" />
                      <div className="border-r border-white" />
                      <div />
                    </div>
                  </div>

                  {/* Top Bar of Viewfinder */}
                  <div className="relative z-10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[11px] font-mono font-bold text-red-400">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        REC 16:9
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/90 text-slate-950 font-bold text-[11px]">
                        [{row.shotType}]
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{row.timecode}</span>
                    </div>
                  </div>

                  {/* Center Visual Mockup / Action Beat */}
                  <div className="relative z-10 my-auto text-center px-4 space-y-2">
                    <div className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300">
                      🎬 ฉากที่ 0{row.sequenceNumber}: {row.phaseName}
                    </div>

                    <p className="text-xs sm:text-sm font-medium text-slate-100 max-w-md mx-auto line-clamp-3 leading-relaxed drop-shadow-md">
                      {row.visualDescription}
                    </p>
                  </div>

                  {/* Bottom of Viewfinder: Subtitle / Text on Screen */}
                  <div className="relative z-10">
                    {row.visualGraphicNote ? (
                      <div className="bg-black/75 backdrop-blur-md border border-blue-400/40 text-blue-200 text-[11px] px-3 py-1.5 rounded-xl text-center font-mono max-w-sm mx-auto truncate shadow-md">
                        {row.visualGraphicNote}
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-500 text-center font-mono">
                        (ไม่มีกราฟิกตัวหนังสือบนจอ)
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. AUDIO & VO PAIRING DECK (ส่วนเสียงที่จับคู่กัน) */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white dark:bg-slate-800 transition-colors">
                  {/* Dialogue & Voiceover */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                        <Mic className="w-3.5 h-3.5" />
                        บทพากย์เสียง (VOICE-OVER)
                      </span>

                      {/* Voice play button */}
                      <button
                        onClick={() => handlePlayVoice(row)}
                        className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                          isPlaying
                            ? 'bg-amber-500 text-white animate-pulse'
                            : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900'
                        }`}
                      >
                        {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{isPlaying ? 'หยุดอ่าน' : 'ฟังเสียงฉากนี้'}</span>
                      </button>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-700/80 font-screenplay text-xs sm:text-sm text-slate-900 dark:text-white leading-relaxed">
                      "{row.audioVoiceover}"
                    </div>
                  </div>

                  {/* SFX and BGM Tags */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 font-mono border border-orange-200 dark:border-orange-800/60 truncate max-w-[200px]">
                        {row.audioSfx || 'SFX: ไม่มี'}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 font-mono border border-purple-200 dark:border-purple-800/60 truncate max-w-[200px]">
                        {row.audioBgm || 'BGM: ไม่มี'}
                      </span>
                    </div>

                    <span className="text-slate-400 dark:text-slate-400 font-mono text-[11px]">
                      Shot {idx + 1}/{rows.length}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: CINEMA / FOCUS SLIDE MODE (ฉายทีละฉากแบบพรีเซนเทชัน) */}
      {viewMode === 'cinema' && rows[cinemaIndex] && (
        <div className="space-y-6">
          {/* Main Stage Card */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 shadow-xl max-w-4xl mx-auto">
            {/* 16:9 Viewport */}
            <div className={`relative aspect-video w-full bg-gradient-to-br ${getShotVisualGradient(rows[cinemaIndex].shotType)} p-6 sm:p-10 flex flex-col justify-between text-white overflow-hidden`}>
              {/* Overlay Grid */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 border border-white" />
              </div>

              {/* Viewfinder Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-black/70 text-xs font-mono font-bold text-red-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    CINEMA STAGE · 16:9
                  </span>
                  <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-xs">
                    [{rows[cinemaIndex].shotType}]
                  </span>
                </div>

                <div className="font-mono text-xs text-slate-200 bg-black/70 px-3 py-1 rounded backdrop-blur-md">
                  ⏱️ {rows[cinemaIndex].timecode}
                </div>
              </div>

              {/* Center Action Description */}
              <div className="relative z-10 text-center space-y-3 px-4 sm:px-12 my-auto">
                <div className="inline-block px-4 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-bold text-amber-300">
                  ฉากที่ 0{rows[cinemaIndex].sequenceNumber} : {rows[cinemaIndex].phaseName}
                </div>
                <p className="text-sm sm:text-lg font-medium text-slate-100 max-w-xl mx-auto leading-relaxed drop-shadow-md">
                  {rows[cinemaIndex].visualDescription}
                </p>
              </div>

              {/* Subtitle / On Screen Graphic */}
              <div className="relative z-10 text-center">
                {rows[cinemaIndex].visualGraphicNote && (
                  <div className="inline-block bg-black/80 backdrop-blur-md border border-blue-400/40 text-blue-200 text-xs sm:text-sm px-4 py-2 rounded-xl font-mono shadow-lg">
                    {rows[cinemaIndex].visualGraphicNote}
                  </div>
                )}
              </div>
            </div>

            {/* Audio Deck */}
            <div className="p-6 sm:p-8 space-y-5 bg-white dark:bg-slate-800 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  บทพากย์คำพูด (NARRATOR VO)
                </span>

                <button
                  onClick={() => handlePlayVoice(rows[cinemaIndex])}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    playingVoiceId === rows[cinemaIndex].id
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {playingVoiceId === rows[cinemaIndex].id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{playingVoiceId === rows[cinemaIndex].id ? 'หยุดเสียง' : 'ฟังเสียงฉากนี้'}</span>
                </button>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-screenplay text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                "{rows[cinemaIndex].audioVoiceover}"
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2.5 py-1 rounded-md border border-orange-200 dark:border-orange-800">
                    {rows[cinemaIndex].audioSfx}
                  </span>
                  <span className="font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-md border border-purple-200 dark:border-purple-800">
                    {rows[cinemaIndex].audioBgm}
                  </span>
                </div>

                {/* Prev / Next Slide Controls */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={cinemaIndex === 0}
                    onClick={() => {
                      setCinemaIndex(cinemaIndex - 1);
                      playChime(500);
                    }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                    {cinemaIndex + 1} / {rows.length}
                  </span>

                  <button
                    disabled={cinemaIndex === rows.length - 1}
                    onClick={() => {
                      setCinemaIndex(cinemaIndex + 1);
                      playChime(620);
                    }}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
