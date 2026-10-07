import React, { useState } from 'react';
import { 
  BookOpen, 
  PenTool, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Pause, 
  Award, 
  Sparkles, 
  TrendingUp, 
  Volume2, 
  Flame, 
  Check, 
  Compass,
  FileCode,
  Clock,
  Columns3,
  Layers,
  Video,
  Mic
} from 'lucide-react';
import { Lesson, NavigationTab } from '../types/script';
import { audioEngine } from '../utils/audioPlayer';

interface DashboardProps {
  lessons: Lesson[];
  overallProgress: number;
  onNavigate: (tab: NavigationTab) => void;
  onOpenLesson: (lessonId: string) => void;
  onStartExercise: (promptText: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  lessons,
  overallProgress,
  onNavigate,
  onOpenLesson,
  onStartExercise,
}) => {
  // Real Audio playback for multimedia masterclass podcast
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0); // seconds
  const totalAudioSeconds = 125; // 2m 05s
  const audioIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // Play podcast sound effect intro
  const playPodcastChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const notes = [329.63, 392.00, 523.25, 659.25]; // E4, G4, C5, E5
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.6);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.12);
        osc.stop(audioCtx.currentTime + idx * 0.12 + 0.6);
      });
    } catch {
      // Audio context fallback
    }
  };

  const podcastNarration = "ยินดีต้อนรับสู่ สคริปต์แล็บ พอดแคสต์ ครับ ในตอนนี้เราจะมาถอดรหัสเทคนิค โคลด์ โอเพ่น หรือการเปิดฉากแรกในสามนาทีให้สะกดคนดูให้อยู่หมัด การเปิดเรื่องที่ทรงพลังไม่ใช่การเสียเวลาปูพื้นหลังยืดยาว แต่คือการโยนคนดูเข้าสู่ใจกลางความขัดแย้งทันที เพื่อสร้างคำถามและดึงดูดสายตาของผู้ชมตั้งแต่เฟรมแรกครับ";

  const togglePlayAudio = () => {
    if (isPlayingAudio) {
      // Stop real audio
      audioEngine.stopPodcastAudio();
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
      setIsPlayingAudio(false);
    } else {
      // Start Real Audio Output
      setIsPlayingAudio(true);
      audioEngine.startPodcastAudio(podcastNarration, () => {
        setIsPlayingAudio(false);
        if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
        setAudioProgress(totalAudioSeconds);
      });

      // Advance progress timer
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress(prev => {
          if (prev >= totalAudioSeconds) {
            audioEngine.stopPodcastAudio();
            setIsPlayingAudio(false);
            if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };

  React.useEffect(() => {
    return () => {
      audioEngine.stopPodcastAudio();
      if (audioIntervalRef.current) {
        clearInterval(audioIntervalRef.current);
      }
    };
  }, []);

  const completedCount = lessons.filter(l => l.completed).length;

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 text-white shadow-xl border border-slate-800 dark:border-slate-700">
        <div className="absolute inset-0 z-0">
          <img 
            src="/src/assets/images/scriptlab_hero_banner_1791396386201.jpg" 
            alt="ScriptLab Hero Studio" 
            className="w-full h-full object-cover object-center opacity-30 mix-blend-overlay filter blur-[0.5px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-amber-950/40" />
        </div>

        <div className="relative z-10 p-6 md:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>ห้องปฏิบัติการเขียนบทภาพยนตร์ & สื่อสร้างสรรค์</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              ยินดีต้อนรับสู่ <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">ScriptLab</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              พื้นที่ฝึกฝนทักษะการเล่าเรื่องผ่านบทภาพยนตร์และบทวิดีโอมาตรฐานสากล เรียนรู้โครงสร้างบท 3 คอลัมน์ 
              ซับเท็กซ์ในบทสนทนา และฝึกพิมพ์บทในห้องเวิร์กช็อปเสมือนจริง
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('three-column')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Columns3 className="w-4 h-4" />
                <span>เรียนรู้ "บทวิดีโอ 3 คอลัมน์" (ใหม่)</span>
              </button>
              <button
                onClick={() => onNavigate('studio')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm backdrop-blur-xs border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
              >
                <PenTool className="w-4 h-4 text-amber-400" />
                <span>เปิดห้องฝึกเขียนบท</span>
              </button>
            </div>
          </div>

          {/* Screenwriting Golden Quote Card */}
          <div className="w-full lg:w-80 p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>แรงบันดาลใจวันนี้</span>
            </div>
            <p className="text-slate-200 text-sm italic font-screenplay leading-relaxed">
              "A screenplay is not a novel. It is a blueprint for visual emotion and dramatic action."
            </p>
            <div className="text-xs text-slate-400">
              — Syd Field, ปรมาจารย์โครงสร้างบทภาพยนตร์
            </div>
          </div>
        </div>
      </div>

      {/* Featured Masterclass Spotlight: 3-Column Video Script (Prompt 2 Feature) */}
      <div 
        onClick={() => onNavigate('three-column')}
        className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-slate-900 border border-amber-300 dark:border-amber-800/80 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
      >
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Columns3 className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-200/60 dark:bg-amber-900/60 px-2.5 py-0.5 rounded-full">
                หน่วยการเรียนรู้แบบโต้ตอบพิเศษ
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 10 นาที
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              โครงสร้างบทวิดีโอ 3 คอลัมน์ (ลำดับ / ภาพ / เสียง)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              เรียนรู้ตาราง 3 คอลัมน์สำหรับผลิตวิดีโอโฆษณาและคลิปออนไลน์ พร้อมการ์ดโต้ตอบได้ (Flip Card), 
              ปุ่มกดฟังเสียงตัวอย่างการพากย์ (Voice Preview) และแบบทดสอบ 3 ข้อท้ายบท
            </p>
          </div>
        </div>

        <button className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0 transition-colors">
          <span>เริ่มเรียนหน่วยนี้</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Learning Progress Dashboard Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">ความคืบหน้าการเรียนรู้ของคุณ (Learning Progress)</h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              ติดตามสถิติการเรียนรู้บทเรียนและทักษะการเขียนบทภาพยนตร์
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 block">สำเร็จแล้ว</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{completedCount} จาก {lessons.length} บท</span>
            </div>
            <div className="w-16 h-16 rounded-full bg-amber-50 dark:bg-slate-900 border-4 border-amber-500 flex items-center justify-center font-bold text-slate-900 dark:text-white text-sm tabular-nums shadow-xs">
              {overallProgress}%
            </div>
          </div>
        </div>

        {/* Master Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">แถบความก้าวหน้าหลักสูตรโดยรวม</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400 tabular-nums">{overallProgress}% สมบูรณ์</span>
          </div>
          <div className="w-full h-3.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-600">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 rounded-full transition-all duration-700 ease-out shadow-xs"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span>ระดับ 1: พื้นฐาน</span>
            <span>ระดับ 2: ปานกลาง (ปัจจุบัน)</span>
            <span>ระดับ 3: มืออาชีพ</span>
          </div>
        </div>

        {/* Module Progress Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {lessons.map((lesson, idx) => (
            <div 
              key={lesson.id}
              onClick={() => onOpenLesson(lesson.id)}
              className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md transition-all bg-slate-50/50 dark:bg-slate-850/50 hover:bg-white dark:hover:bg-slate-750 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                  โมดูลที่ {idx + 1}
                </span>
                {lesson.completed ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" />
                    ผ่านแล้ว
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">
                    {lesson.progressPercent}%
                  </span>
                )}
              </div>

              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {lesson.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 mb-3">
                {lesson.summary}
              </p>

              {/* Individual module progress bar */}
              <div className="w-full bg-slate-200/80 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    lesson.completed ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${lesson.progressPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Navigation Cards: 4 Main Features requested */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">เข้าใช้งานด่วน (Lab Navigation)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">เลือกพื้นที่การเรียนรู้และการฝึกปฏิบัติงานจริง</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Lessons */}
          <div 
            onClick={() => onNavigate('lessons')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-400 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:bg-amber-500 group-hover:text-white transition-all">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">เมนูที่ 1</div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
              บทเรียนการเขียนบท
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              เรียนรู้ทฤษฎีบทสากล โครงสร้าง 3 องก์ ซับเท็กซ์ และจังหวะภาพยนตร์พร้อมควิซทดสอบ
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>เข้าสู่ห้องเรียน</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Studio */}
          <div 
            onClick={() => onNavigate('studio')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-orange-400 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-all">
              <PenTool className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-1">เมนูที่ 2</div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 transition-colors">
              ห้องฝึกเขียนบท
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              เวิร์กช็อปพิมพ์บทสคริปต์เสมือนจริง จัดหน้าอัตโนมัติตามมาตรฐานพร้อมพรีวิวแบบ Courier
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-orange-600 dark:text-orange-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>เริ่มพิมพ์บท</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Library */}
          <div 
            onClick={() => onNavigate('library')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">เมนูที่ 3</div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
              คลังตัวอย่างบท
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              ศึกษาบทคัดย่อภาพยนตร์หลากหลายแนว พร้อม Director's Notes อธิบายเทคนิคการเล่า
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>เปิดคลังบท</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Reviewer */}
          <div 
            onClick={() => onNavigate('reviewer')}
            className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-400 hover:shadow-lg transition-all group cursor-pointer relative overflow-hidden"
          >
            <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-4 group-hover:bg-sky-500 group-hover:text-white transition-all">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">เมนูที่ 4</div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors">
              ตรวจทานบท
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              ระบบตรวจสอบฟอร์แมต Scene Heading, Action Line และคำกำกับ พร้อม Checklist ส่งประกวด
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400 gap-1 group-hover:translate-x-1 transition-transform">
              <span>ตรวจสอบสคริปต์</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Multimedia Masterclass Audio Clip & Daily Challenge Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Multimedia Learning Podcast Simulator (2 cols) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 border border-slate-700 dark:border-slate-650 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Volume2 className="w-4 h-4" />
                </span>
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  มัลติมีเดียพอดแคสต์ 2 นาที
                </span>
              </div>
              <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" />
                02:05 นาที
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Cold Open: วิธีสะกดคนดูให้อยู่หมัดใน 3 นาทีแรกของภาพยนตร์
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-5">
              ถอดรหัสฉากเปิดอันทรงพลังของภาพยนตร์ระทึกขวัญและดราม่าชั้นครู 
              เหตุใดการโยนคนดูเข้าสู่ใจกลางความขัดแย้ง (In Media Res) จึงได้ผลดีกว่าการปูพื้นหลังยืดยาว
            </p>
          </div>

          {/* Interactive Audio Player Simulation */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlayAudio}
                className="w-11 h-11 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/30 transition-all shrink-0 cursor-pointer"
                aria-label={isPlayingAudio ? 'หยุดเสียง' : 'เล่นเสียง'}
              >
                {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>

              <div className="flex-1 space-y-1.5">
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>00:{audioProgress < 10 ? `0${audioProgress}` : audioProgress}</span>
                  <span>02:05</span>
                </div>
                {/* Audio Waveform visualization */}
                <div className="flex items-center gap-0.5 h-6">
                  {[20, 45, 60, 30, 80, 95, 40, 75, 90, 65, 30, 50, 85, 100, 70, 45, 30, 60, 90, 55, 35, 75, 40, 25, 60, 80, 50, 30].map((h, i) => {
                    const isPlayed = (i / 28) * totalAudioSeconds <= audioProgress;
                    return (
                      <div 
                        key={i} 
                        className={`flex-1 rounded-full transition-all duration-200 ${
                          isPlayed 
                            ? 'bg-amber-400' 
                            : 'bg-slate-700'
                        } ${isPlayingAudio && isPlayed ? 'animate-pulse' : ''}`}
                        style={{ height: `${h}%` }}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                จุดสังเกตสำคัญ: 01:15 — The Inciting Spark
              </span>
              <button 
                onClick={() => onOpenLesson('lesson-1')}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                ดูสคริปต์ประกอบฉาก →
              </button>
            </div>
          </div>
        </div>

        {/* Daily Writing Challenge (1 col) */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-amber-200/80 dark:border-amber-900/60 shadow-xs flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-100/50 dark:bg-amber-900/20 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/50 px-2.5 py-1 rounded-lg">
                <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                ภารกิจเขียนประจำวัน
              </span>
              <span className="text-xs font-semibold text-slate-400">+50 XP</span>
            </div>

            <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
              "Subtext Challenge: บทสนทนาที่ไม่พูดความจริง"
            </h4>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              ฝึกเขียนบทสนทนา 4-6 บรรทัด ระหว่างสองตัวละครที่ต้องซ่อนความรู้สึกผิด 
              ห้ามพูดคำว่า "ขอโทษ" หรือ "ความจริง" แม้แต่คำเดียว!
            </p>

            <div className="p-3 bg-amber-50/60 dark:bg-slate-900/60 rounded-xl border border-amber-100 dark:border-slate-700 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
              <span className="font-semibold block text-amber-800 dark:text-amber-300">ตัวอย่างสถานการณ์:</span>
              <span>ตัวละคร ก เพิ่งทำแจกันโบราณราคาแพงของตัวละคร ข แตก แล้วกำลังพยายามเบี่ยงเบนความสนใจ</span>
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={() => onStartExercise(`INT. LIVING ROOM - EVENING

เศษแจกันโบราณถูกกวาดซ่อนไว้ใต้พรมมุมห้องอย่างลนลาน

กานต์ (28) ยืนกุมมือแน่น เหงื่อซึมที่ขมับ

พิมพ์ (27) เดินถือถาดน้ำชาเข้ามา มองไปรอบๆ ห้อง

พิมพ์
กานต์... วันนี้ห้องดูโปร่งตาแปลกๆ นะ

กานต์
(ยิ้มเจื่อน รีบเดินไปรับถาดน้ำชา)
ผม... ผมเพิ่งจัดห้องใหม่น่ะ แสงตอนเย็นมันสวยดีนะว่าไหม?`)}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <PenTool className="w-3.5 h-3.5 text-amber-400" />
              <span>เริ่มเขียนภารกิจนี้ใน Studio</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
