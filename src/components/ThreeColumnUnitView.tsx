import React, { useState, useEffect, useRef } from 'react';
import { 
  Columns3, 
  Clock, 
  Video, 
  Mic, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  RotateCw, 
  CheckCircle2, 
  HelpCircle, 
  Check, 
  ArrowRight, 
  Info, 
  Eye, 
  Flame, 
  Award,
  Layers,
  ChevronRight,
  Send
} from 'lucide-react';
import { 
  THREE_COLUMN_FLIP_CARDS, 
  THREE_COLUMN_SAMPLE_SCRIPT, 
  THREE_COLUMN_QUIZ_QUESTIONS 
} from '../data/threeColumnData';
import { ThreeColumnRow } from '../types/script';
import { audioEngine } from '../utils/audioPlayer';

interface ThreeColumnUnitViewProps {
  onOpenInStudio?: (scriptText: string) => void;
  onQuizCompleted?: (score: number) => void;
}

export const ThreeColumnUnitView: React.FC<ThreeColumnUnitViewProps> = ({
  onOpenInStudio,
  onQuizCompleted,
}) => {
  // Flip cards state (tracking which card is flipped)
  const [flippedCards, setFlippedCards] = useState<{ [cardId: string]: boolean }>({});

  // Voice Preview States
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState<boolean>(false);
  const [voicePlaybackRate, setVoicePlaybackRate] = useState<number>(1.0);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  // Quiz States
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number | null }>({
    'tc-quiz-1': null,
    'tc-quiz-2': null,
    'tc-quiz-3': null,
  });
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Web Speech synthesis ref
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !('speechSynthesis' in window)) {
      setSpeechSupported(false);
    }
    return () => {
      audioEngine.stopSpeaking();
    };
  }, []);

  const toggleCardFlip = (cardId: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  // Play a gentle audio chime with Web Audio API for audio preview feedback
  const playChime = (frequency = 520, type: OscillatorType = 'sine', duration = 0.25) => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio context may require user gesture or be disabled; silent fallback
    }
  };

  // Speak a text using audioEngine with fallback
  const handlePlayVoice = (row: ThreeColumnRow) => {
    if (activePlayingId === row.id) {
      // Stop
      audioEngine.stopSpeaking();
      setActivePlayingId(null);
      setIsPlayingAll(false);
      return;
    }

    audioEngine.stopSpeaking();
    setActivePlayingId(row.id);

    audioEngine.speakVoiceover(row.audioVoiceover, {
      rate: voicePlaybackRate,
      gender: row.voiceGenderHint,
      onEnd: () => {
        setActivePlayingId(null);
      },
    });
  };

  // Play all rows sequentially
  const handlePlayEntireScript = () => {
    if (isPlayingAll) {
      audioEngine.stopSpeaking();
      setIsPlayingAll(false);
      setActivePlayingId(null);
      return;
    }

    setIsPlayingAll(true);
    let currentIndex = 0;

    const playNext = () => {
      if (currentIndex >= THREE_COLUMN_SAMPLE_SCRIPT.length) {
        setIsPlayingAll(false);
        setActivePlayingId(null);
        return;
      }

      const row = THREE_COLUMN_SAMPLE_SCRIPT[currentIndex];
      setActivePlayingId(row.id);

      audioEngine.speakVoiceover(row.audioVoiceover, {
        rate: voicePlaybackRate,
        gender: row.voiceGenderHint,
        onEnd: () => {
          currentIndex++;
          setTimeout(playNext, 500);
        },
      });
    };

    playNext();
  };

  const handleSelectQuizAnswer = (qId: string, optionIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({
      ...prev,
      [qId]: optionIdx
    }));
  };

  const handleSubmitQuiz = () => {
    const allAnswered = THREE_COLUMN_QUIZ_QUESTIONS.every(q => quizAnswers[q.id] !== null);
    if (!allAnswered) {
      alert('กรุณาตอบคำถามให้ครบทั้ง 3 ข้อก่อนกดส่งตรวจ');
      return;
    }

    setQuizSubmitted(true);
    playChime(784, 'sine', 0.35);

    // Calculate score
    const correctCount = THREE_COLUMN_QUIZ_QUESTIONS.filter(
      q => quizAnswers[q.id] === q.correctIndex
    ).length;

    if (onQuizCompleted) {
      onQuizCompleted(correctCount);
    }
  };

  const handleResetQuiz = () => {
    setQuizAnswers({
      'tc-quiz-1': null,
      'tc-quiz-2': null,
      'tc-quiz-3': null,
    });
    setQuizSubmitted(false);
  };

  const correctQuizScore = THREE_COLUMN_QUIZ_QUESTIONS.filter(
    q => quizAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      {/* Hero Masterclass Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-xl border border-slate-800 dark:border-slate-700">
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/three_column_script_banner_1791396998346.jpg" 
            alt="Three-Column Video Script Production" 
            className="w-full h-full object-cover object-center opacity-25 mix-blend-overlay filter blur-[0.3px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/95 to-amber-950/40" />
        </div>

        <div className="relative z-10 p-6 md:p-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>หน่วยการเรียนรู้แบบโต้ตอบพิเศษ (Interactive Masterclass)</span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              โครงสร้างบทวิดีโอ 3 คอลัมน์ <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200">
                (ลำดับ & เวลา / ภาพ / เสียง)
              </span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              เครื่องมือมาตรฐานที่ผู้กำกับ ครีเอเตอร์ และโปรดักชันทั่วโลกใช้สร้างวิดีโอโฆษณา คลิปสั้น (Reels/TikTok) 
              และสารคดี เพื่อซิงก์ภาพและเสียงให้ลงตัวแบบวินาทีต่อวินาที
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              ระยะเวลาเรียน 10 นาที
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-xs">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              4 การ์ดโต้ตอบ (Flip Cards)
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-xs">
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              เสียงตัวอย่างพากย์จริง (Voice Preview)
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-xs">
              <Award className="w-3.5 h-3.5 text-orange-400" />
              แบบทดสอบวัดผล 3 ข้อท้ายบท
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Interactive Flip Cards (การ์ดเนื้อหาโต้ตอบได้) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                การ์ดเนื้อหาโต้ตอบได้ (Interactive Flip Cards)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              คลิกที่การ์ดเพื่อพลิกดูความหมายเชิงลึก รหัสคำสั่ง และเทคนิคเฉพาะของแต่ละคอลัมน์
            </p>
          </div>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
            <RotateCw className="w-3.5 h-3.5" />
            คลิกการ์ดเพื่อพลิกดูด้านหลัง (3D Flip)
          </span>
        </div>

        {/* 4 Cards Grid with 3D Flip Effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {THREE_COLUMN_FLIP_CARDS.map(card => {
            const isFlipped = !!flippedCards[card.id];
            return (
              <div
                key={card.id}
                onClick={() => toggleCardFlip(card.id)}
                className="h-[360px] perspective-1000 cursor-pointer group select-none"
              >
                <div
                  className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                    isFlipped ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* FRONT SIDE */}
                  <div className="absolute inset-0 backface-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-md text-white bg-gradient-to-r ${card.accentColor}`}>
                          {card.columnNumber <= 3 ? `คอลัมน์ที่ ${card.columnNumber}` : 'หัวใจสำคัญ'}
                        </span>
                        <span className="text-slate-400 dark:text-slate-500 group-hover:text-amber-500 transition-colors">
                          <RotateCw className="w-4 h-4" />
                        </span>
                      </div>

                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center mb-3 text-slate-800 dark:text-slate-100">
                        {card.iconName === 'Clock' && <Clock className="w-6 h-6 text-amber-500" />}
                        {card.iconName === 'Video' && <Video className="w-6 h-6 text-blue-500" />}
                        {card.iconName === 'Mic' && <Mic className="w-6 h-6 text-emerald-500" />}
                        {card.iconName === 'Sparkles' && <Sparkles className="w-6 h-6 text-purple-500" />}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-400 font-medium mb-3">
                        {card.titleEn}
                      </p>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {card.frontSummary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-amber-600 dark:text-amber-400 truncate mr-2">
                        💡 {card.frontKeyTakeaway}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                        พลิก <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>

                  {/* BACK SIDE */}
                  <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 dark:border-slate-700 p-5 flex flex-col justify-between shadow-xl overflow-y-auto">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-amber-400">
                          {card.title} (เจาะลึก)
                        </span>
                        <RotateCw className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
                      </div>

                      <p className="text-[11px] text-slate-300 leading-relaxed">
                        {card.backDetails.definition}
                      </p>

                      {/* Code Examples */}
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          รหัสและตัวย่อมาตรฐาน:
                        </span>
                        {card.backDetails.standardCodes.slice(0, 3).map((codeItem, idx) => (
                          <div key={idx} className="text-[11px] flex items-start gap-1.5">
                            <code className="text-amber-300 font-mono text-[10px] bg-white/10 px-1 py-0.5 rounded shrink-0">
                              {codeItem.code}
                            </code>
                            <span className="text-slate-300 text-[10px] leading-tight truncate">
                              {codeItem.meaning}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800">
                      <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20 text-[10px] text-amber-200 leading-relaxed">
                        <strong>Pro-Tip:</strong> {card.backDetails.proTip}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Interactive 3-Column Script Table with Voice Preview */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                ตัวอย่างบท 3 คอลัมน์จริง & ปุ่มฟังเสียงพากย์ (Voice Preview)
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              คลิกปุ่ม <span className="font-semibold text-emerald-600 dark:text-emerald-400">"ฟังเสียงพากย์"</span> ในแต่ละฉากเพื่อทดสอบการออกเสียงและจังหวะของบทพูด หรือกดเล่นทั้งคลิปต่อเนื่อง
            </p>
          </div>

          {/* Master Voice Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Speed toggle */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl text-xs">
              <span className="text-slate-400 px-1 text-[11px]">สปีด:</span>
              {[1.0, 1.25].map(speed => (
                <button
                  key={speed}
                  onClick={() => setVoicePlaybackRate(speed)}
                  className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    voicePlaybackRate === speed
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            <button
              onClick={handlePlayEntireScript}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                isPlayingAll
                  ? 'bg-amber-600 hover:bg-amber-700 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isPlayingAll ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlayingAll ? 'หยุดเล่นทั้งหมด' : 'เล่นเสียงพากย์ทั้งคลิป (All VO)'}</span>
            </button>
          </div>
        </div>

        {/* 3-Column Table Component */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 w-44 font-bold border-r border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                    <Clock className="w-4 h-4" />
                    <span>1. ลำดับ & เวลา (Time)</span>
                  </div>
                </th>
                <th className="p-4 font-bold border-r border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
                    <Video className="w-4 h-4" />
                    <span>2. ภาพ & ขนาดมุมกล้อง (Visual)</span>
                  </div>
                </th>
                <th className="p-4 font-bold">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <Mic className="w-4 h-4" />
                    <span>3. เสียง & บทพากย์ (Audio / VO / SFX)</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-sans">
              {THREE_COLUMN_SAMPLE_SCRIPT.map((row) => {
                const isPlaying = activePlayingId === row.id;
                return (
                  <tr 
                    key={row.id}
                    className={`transition-colors ${
                      isPlaying 
                        ? 'bg-amber-50/90 dark:bg-amber-950/40 ring-2 ring-amber-400 dark:ring-amber-500' 
                        : 'hover:bg-slate-50/70 dark:hover:bg-slate-750/50'
                    }`}
                  >
                    {/* COLUMN 1: Sequence & Time */}
                    <td className="p-4 align-top border-r border-slate-200 dark:border-slate-700 space-y-1.5 bg-slate-50/40 dark:bg-slate-850/40">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold flex items-center justify-center text-[11px]">
                          0{row.sequenceNumber}
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-100 text-[11px] truncate">
                          {row.phaseName}
                        </span>
                      </div>
                      <div className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                        ⏱️ {row.timecode}
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">
                        ขนาดภาพ: <strong className="text-slate-700 dark:text-slate-300">{row.shotType}</strong>
                      </div>
                    </td>

                    {/* COLUMN 2: Visual */}
                    <td className="p-4 align-top border-r border-slate-200 dark:border-slate-700 space-y-2">
                      <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                        {row.visualDescription}
                      </p>
                      <div className="inline-block bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded text-[11px] font-mono">
                        {row.visualGraphicNote}
                      </div>
                    </td>

                    {/* COLUMN 3: Audio & Voice Preview */}
                    <td className="p-4 align-top space-y-3">
                      {/* Voiceover line */}
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wider uppercase">
                            🎙️ บทพากย์ (VOICE-OVER)
                          </span>
                          
                          {/* Voice Preview Button */}
                          <button
                            onClick={() => handlePlayVoice(row)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isPlaying
                                ? 'bg-amber-500 text-white animate-pulse shadow-xs'
                                : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800/70'
                            }`}
                          >
                            {isPlaying ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5" />
                                <span>กำลังอ่าน... (คลิกหยุด)</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>ฟังเสียงพากย์</span>
                              </>
                            )}
                          </button>
                        </div>

                        <p className="font-screenplay text-slate-900 dark:text-white font-medium text-xs sm:text-sm leading-relaxed">
                          "{row.audioVoiceover}"
                        </p>
                      </div>

                      {/* SFX and BGM */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="text-orange-700 dark:text-orange-300 font-mono bg-orange-50 dark:bg-orange-950/40 px-2 py-1 rounded border border-orange-200 dark:border-orange-900/50">
                          {row.audioSfx}
                        </div>
                        <div className="text-purple-700 dark:text-purple-300 font-mono bg-purple-50 dark:bg-purple-950/40 px-2 py-1 rounded border border-purple-200 dark:border-purple-900/50">
                          {row.audioBgm}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action to send to studio */}
        {onOpenInStudio && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              💡 ต้องการทดลองนำโครงสร้าง 3 คอลัมน์นี้ไปดัดแปลงต่อในห้องฝึกเขียนบทใช่หรือไม่?
            </span>
            <button
              onClick={() => onOpenInStudio(`[SCRIPT 3-COLUMN VIDEO: SCRIPT LAB PROMO]\n\nSCENE 1 (0:00-0:04) | CU ภาพมือถือ | VO: คุณเคยสงสัยไหม ทำไมภาพยนตร์บางเรื่องเปลี่ยนชีวิตคนดูได้?\nSCENE 2 (0:04-0:11) | MCU คนนั่งสับสน | VO: ไม่ใช่เพราะงบพันล้าน แต่เพราะพิมพ์เขียวบทที่ถูกต้อง\nSCENE 3 (0:11-0:22) | WS โปรดักชันสตูดิโอ | VO: ยินดีต้อนรับสู่ ScriptLab แพลตฟอร์มบทเสมือนจริง\nSCENE 4 (0:22-0:30) | GRAPHIC โลโก้ & ปุ่มเริ่ม | VO: ปลดล็อกศักยภาพนักเล่าเรื่องในตัวคุณวันนี้ ที่ ScriptLab!`)}
              className="px-4 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              <span>ส่งโครงสร้างนี้ไปยังห้องฝึกเขียนบท (Studio)</span>
            </button>
          </div>
        )}
      </div>

      {/* SECTION 3: 3-Question Interactive Quiz (แบบทดสอบสั้น 3 ข้อท้ายบทเรียน) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                แบบทดสอบวัดความเข้าใจ 3 ข้อ (Three-Column Script Mastery)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ทำแบบทดสอบเพื่อเช็กความเข้าใจและรับคะแนน XP เพิ่มเติม
              </p>
            </div>
          </div>

          {quizSubmitted && (
            <button
              onClick={handleResetQuiz}
              className="text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 cursor-pointer self-start sm:self-auto bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>ทำแบบทดสอบใหม่อีกครั้ง</span>
            </button>
          )}
        </div>

        {/* 3 Questions List */}
        <div className="space-y-6">
          {THREE_COLUMN_QUIZ_QUESTIONS.map((question, qIdx) => {
            const selectedOpt = quizAnswers[question.id];
            const isCorrect = selectedOpt === question.correctIndex;

            return (
              <div 
                key={question.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/80 space-y-3"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {qIdx + 1}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {question.question}
                  </h3>
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {question.options.map((option, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    let optionStyle = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600';

                    if (quizSubmitted) {
                      if (optIdx === question.correctIndex) {
                        optionStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold ring-1 ring-emerald-500';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-red-50 dark:bg-red-950/60 border-red-400 text-red-900 dark:text-red-200';
                      } else {
                        optionStyle = 'bg-slate-100/50 dark:bg-slate-850/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-900 dark:text-amber-200 font-medium ring-1 ring-amber-500';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={quizSubmitted}
                        onClick={() => handleSelectQuizAnswer(question.id, optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all flex items-start justify-between gap-2 cursor-pointer ${optionStyle}`}
                      >
                        <span>{option}</span>
                        {quizSubmitted && optIdx === question.correctIndex && (
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submit */}
                {quizSubmitted && (
                  <div className={`p-3 rounded-xl text-xs leading-relaxed mt-2 ${
                    isCorrect 
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200' 
                      : 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                  }`}>
                    <span className="font-bold block mb-0.5">
                      {isCorrect ? '✅ ถูกต้อง:' : '💡 เฉลย & คำอธิบาย:'}
                    </span>
                    <span>{question.explanation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit or Result Box */}
        <div className="pt-2">
          {!quizSubmitted ? (
            <button
              onClick={handleSubmitQuiz}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-xs shadow-md shadow-amber-500/20 hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ส่งตรวจคำตอบทั้ง 3 ข้อ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-700">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                  correctQuizScore === 3 ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {correctQuizScore}/3
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    {correctQuizScore === 3
                      ? '🎉 ยอดเยี่ยมมาก! คุณผ่านบทเรียน 3 คอลัมน์แบบเต็ม 100%'
                      : `คุณทำได้ ${correctQuizScore} จาก 3 คะแนน ลองทบทวนจุดที่ผิดแล้วทำซ้ำได้`}
                  </h4>
                  <p className="text-xs text-slate-300">
                    ได้รับ +{correctQuizScore * 30} XP สู่การเป็นวิดีโอสคริปต์มาสเตอร์
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-amber-400 font-semibold bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  หน่วยการเรียนรู้ 3 คอลัมน์: สำเร็จ
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
