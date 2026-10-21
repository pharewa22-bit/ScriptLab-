/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Sparkles, 
  PenTool, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  LayoutDashboard,
  Flame,
  GraduationCap,
  Sun,
  Moon,
  Columns3,
  Mail,
  BookMarked,
  RefreshCw,
  RotateCcw,
  CheckCircle
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LessonsView } from './components/LessonsView';
import { ThreeColumnUnitView } from './components/ThreeColumnUnitView';
import { StudioView } from './components/StudioView';
import { LibraryView } from './components/LibraryView';
import { ReviewerView } from './components/ReviewerView';
import { ReferencesView } from './components/ReferencesView';
import { INITIAL_LESSONS } from './data/learningContent';
import { CREATOR_INFO } from './data/referencesData';
import { Lesson, NavigationTab } from './types/script';
import { getLearnerLevel } from './utils/levelUtils';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState<boolean>(true);
  
  // Lessons state with localStorage persistence
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('scriptlab_lessons');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // fallback
      }
    }
    return INITIAL_LESSONS;
  });

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>('lesson-1');
  const [studioDraft, setStudioDraft] = useState<string>('');
  const [reviewerDraft, setReviewerDraft] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Sync lessons to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('scriptlab_lessons', JSON.stringify(lessons));
    } catch {
      // quota or private browsing fallback
    }
  }, [lessons]);

  // Toast notification timer
  const showToastMessage = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Close mobile sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Day & Night Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('scriptlab_theme') === 'dark';
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('scriptlab_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('scriptlab_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Toggle sidebar for both mobile drawer and desktop collapse
  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsDesktopSidebarOpen(prev => !prev);
    } else {
      setIsMobileSidebarOpen(prev => !prev);
    }
  };

  // Calculate overall learning progress and dynamic learner level
  const totalWeight = lessons.length * 100;
  const currentWeight = lessons.reduce((acc, l) => acc + l.progressPercent, 0);
  const overallProgressPercent = Math.round((currentWeight / totalWeight) * 100);
  const learnerLevel = getLearnerLevel(overallProgressPercent);
  const streakDays = overallProgressPercent === 0 ? 1 : Math.min(5, Math.max(1, Math.ceil(overallProgressPercent / 20)));

  // Lesson Quiz Completion Handler
  const handleCompleteQuiz = (lessonId: string) => {
    setLessons(prev => prev.map(l => {
      if (l.id === lessonId) {
        return { ...l, completed: true, progressPercent: 100 };
      }
      return l;
    }));
  };

  const handleThreeColumnQuizCompleted = (score: number) => {
    // Increase progress or XP on completion
    if (score >= 2) {
      setLessons(prev => prev.map((l, idx) => {
        if (idx === 1) return { ...l, completed: true, progressPercent: 100 };
        return l;
      }));
    }
  };

  // Progress refresh chime sound (Web Audio API)
  const playRefreshChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.15); // G5
      gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch {
      // Audio context fallback
    }
  };

  // Refresh progress action
  const handleRefreshProgress = () => {
    setIsRefreshing(true);
    playRefreshChime();
    setTimeout(() => {
      try {
        const saved = localStorage.getItem('scriptlab_lessons');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setLessons(parsed);
          }
        }
      } catch {
        // ignore
      }
      setIsRefreshing(false);
      const updatedLevel = getLearnerLevel(overallProgressPercent);
      showToastMessage(`รีเฟรชความคืบหน้ารวมสำเร็จ (${overallProgressPercent}% · ${updatedLevel.levelName})`, 'success');
    }, 450);
  };

  // Reset progress action
  const handleResetProgressRequest = () => {
    setShowResetModal(true);
  };

  const handleConfirmResetProgress = () => {
    const resetLessons = INITIAL_LESSONS.map(l => ({ ...l, completed: false, progressPercent: 0 }));
    setLessons(resetLessons);
    try {
      localStorage.setItem('scriptlab_lessons', JSON.stringify(resetLessons));
    } catch {
      // ignore
    }
    setShowResetModal(false);
    showToastMessage('รีเซ็ตความคืบหน้าเป็น 0% (กลับสู่ผู้เรียนระดับ 1: มือใหม่) สำเร็จแล้ว', 'info');
  };

  // Navigations with data transfer
  const handleOpenLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setCurrentTab('lessons');
  };

  const handleStartExercise = (promptText: string) => {
    setStudioDraft(promptText);
    setCurrentTab('studio');
  };

  const handleSendToStudio = (scriptText: string) => {
    setStudioDraft(scriptText);
    setCurrentTab('studio');
  };

  const handleSendToReviewer = (scriptContent: string) => {
    setReviewerDraft(scriptContent);
    setCurrentTab('reviewer');
  };

  const handleEditInStudioFromReviewer = (scriptText: string) => {
    setStudioDraft(scriptText);
    setCurrentTab('studio');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col antialiased transition-colors duration-200">
      {/* Universal Top Bar Contract: Brand Zone — Nav Links — Primary Action */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between transition-colors">
        {/* Zone 1: Brand title & Universal Hamburger Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleSidebar}
            className="p-2 -ml-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
            title="เปิด/ปิด แถบเมนูด้านข้าง (Toggle Sidebar)"
            aria-label="เปิดปิดเมนูนำทาง"
          >
            <Menu className="w-5 h-5" />
          </button>

          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); setCurrentTab('dashboard'); }}
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            ScriptLab
          </a>
        </div>

        {/* Zone 2: Clean 4-6 text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300">
          <button 
            onClick={() => setCurrentTab('dashboard')} 
            className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer ${currentTab === 'dashboard' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}
          >
            หน้าหลัก
          </button>
          <button 
            onClick={() => setCurrentTab('lessons')} 
            className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer ${currentTab === 'lessons' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}
          >
            บทเรียนการเขียนบท
          </button>
          <button 
            onClick={() => setCurrentTab('three-column')} 
            className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1 ${currentTab === 'three-column' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}
          >
            <span>บทวิดีโอ 3 คอลัมน์</span>
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
          </button>
          <button 
            onClick={() => setCurrentTab('studio')} 
            className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer ${currentTab === 'studio' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}
          >
            ห้องฝึกเขียนบท
          </button>
          <button 
            onClick={() => setCurrentTab('library')} 
            className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer ${currentTab === 'library' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}
          >
            คลังตัวอย่างบท
          </button>
          <button 
            onClick={() => setCurrentTab('reviewer')} 
            className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer ${currentTab === 'reviewer' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}
          >
            ตรวจทานบท
          </button>
          <button 
            onClick={() => setCurrentTab('references')} 
            className={`hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1 ${currentTab === 'references' ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}
          >
            <span>แหล่งอ้างอิง & ติดต่อ</span>
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions + Day/Night Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Day / Night Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer flex items-center justify-center shadow-xs"
            title={isDarkMode ? 'สลับเป็นโหมดกลางวัน (Light Mode)' : 'สลับเป็นโหมดกลางคืน (Dark Mode)'}
            aria-label={isDarkMode ? 'เปิดโหมดกลางวัน' : 'เปิดโหมดกลางคืน'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{learnerLevel.levelName} · Streak {streakDays} วัน</span>
          </div>

          <button
            onClick={() => setCurrentTab('studio')}
            className="px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-amber-500 dark:text-slate-950 dark:hover:bg-amber-400 rounded-xl hover:bg-slate-800 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer whitespace-nowrap"
          >
            <PenTool className="w-3.5 h-3.5 text-amber-400 dark:text-slate-950" />
            <span>เขียนบท</span>
          </button>
        </div>
      </header>

      {/* Main Body Layout with Sidebar & Content */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            setIsMobileSidebarOpen(false);
          }}
          overallProgress={overallProgressPercent}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          isDesktopOpen={isDesktopSidebarOpen}
          onToggleDesktop={() => setIsDesktopSidebarOpen(prev => !prev)}
          onRefreshProgress={handleRefreshProgress}
          onResetProgress={handleResetProgressRequest}
          isRefreshing={isRefreshing}
        />

        {/* Center Main Stage Area (with responsive padding left for desktop sidebar) */}
        <main className={`flex-1 ${isDesktopSidebarOpen ? 'lg:pl-72' : 'lg:pl-0'} w-full min-w-0 flex flex-col justify-between transition-all duration-300 ease-in-out`}>
          <div className="p-4 sm:p-6 lg:p-8 flex-1">
            {currentTab === 'dashboard' && (
              <Dashboard
                lessons={lessons}
                overallProgress={overallProgressPercent}
                onNavigate={setCurrentTab}
                onOpenLesson={handleOpenLesson}
                onStartExercise={handleStartExercise}
                onRefreshProgress={handleRefreshProgress}
                onResetProgress={handleResetProgressRequest}
                isRefreshing={isRefreshing}
              />
            )}

            {currentTab === 'lessons' && (
              <LessonsView
                lessons={lessons}
                selectedLessonId={selectedLessonId}
                onSelectLesson={setSelectedLessonId}
                onCompleteQuiz={handleCompleteQuiz}
                onOpenInStudio={handleSendToStudio}
              />
            )}

            {currentTab === 'three-column' && (
              <ThreeColumnUnitView
                onOpenInStudio={handleSendToStudio}
                onQuizCompleted={handleThreeColumnQuizCompleted}
              />
            )}

            {currentTab === 'studio' && (
              <StudioView
                initialScript={studioDraft}
                onSendToReviewer={handleSendToReviewer}
              />
            )}

            {currentTab === 'library' && (
              <LibraryView
                onLoadIntoStudio={handleSendToStudio}
              />
            )}

            {currentTab === 'reviewer' && (
              <ReviewerView
                initialScript={reviewerDraft}
                onEditInStudio={handleEditInStudioFromReviewer}
              />
            )}

            {currentTab === 'references' && (
              <ReferencesView
                onNavigateTab={setCurrentTab}
              />
            )}
          </div>

          {/* Educational & Creator Contact Footer */}
          <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 text-xs text-slate-500 dark:text-slate-400 flex flex-col md:flex-row items-center justify-between gap-3 transition-colors">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                ScriptLab
              </span>
              <span>·</span>
              <span>มัลติมีเดียเพื่อการเรียนรู้การเขียนบทภาพยนตร์และบทวิดีโอ 3 คอลัมน์</span>
              <span>·</span>
              <button
                onClick={() => setCurrentTab('references')}
                className="text-amber-600 dark:text-amber-400 font-semibold hover:underline cursor-pointer flex items-center gap-1"
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>แหล่งอ้างอิงวิชาการ</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-300">
                <Mail className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold">ติดต่อผู้ทำแอพ:</span>
                <a 
                  href={`mailto:${CREATOR_INFO.email}`} 
                  className="font-mono font-bold hover:underline select-all text-slate-900 dark:text-white"
                  title="ส่งอีเมลติดต่อผู้ทำแอพ"
                >
                  {CREATOR_INFO.email}
                </a>
              </div>

              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                <span>Courier 12pt & 3-Column AV</span>
                <span>·</span>
                <span>โหมด {isDarkMode ? 'กลางคืน (Night)' : 'กลางวัน (Day)'}</span>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* In-app Reset Confirmation Modal (Strictly avoids window.confirm/window.alert) */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">ต้องการรีเซ็ตความคืบหน้าใช่หรือไม่?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                ระดับผู้เรียนจะถูกรีเซ็ตกลับไปเป็น <span className="font-bold text-sky-600 dark:text-sky-400">ผู้เรียนระดับ 1 (Beginner Screenwriter)</span> และคะแนนความคืบหน้าจะเริ่มต้นใหม่ที่ 0%
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                onClick={handleConfirmResetProgress}
                className="flex-1 px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-xs cursor-pointer font-bold"
              >
                ยืนยันรีเซ็ตเป็น 0%
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Bar */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900/95 dark:bg-slate-100 text-white dark:text-slate-900 shadow-2xl text-xs font-semibold border border-slate-700/60 dark:border-slate-300 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
