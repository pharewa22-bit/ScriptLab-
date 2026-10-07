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
  Columns3
} from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LessonsView } from './components/LessonsView';
import { ThreeColumnUnitView } from './components/ThreeColumnUnitView';
import { StudioView } from './components/StudioView';
import { LibraryView } from './components/LibraryView';
import { ReviewerView } from './components/ReviewerView';
import { INITIAL_LESSONS } from './data/learningContent';
import { Lesson, NavigationTab } from './types/script';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>('lesson-1');
  const [studioDraft, setStudioDraft] = useState<string>('');
  const [reviewerDraft, setReviewerDraft] = useState<string>('');

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

  // Calculate overall learning progress
  const totalWeight = lessons.length * 100;
  const currentWeight = lessons.reduce((acc, l) => acc + l.progressPercent, 0);
  const overallProgressPercent = Math.round((currentWeight / totalWeight) * 100);

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
        {/* Zone 1: Brand title, single element */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
            aria-label="เปิดเมนูนำทาง"
          >
            {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            <span>Streak 5 วัน</span>
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
          onSelectTab={setCurrentTab}
          overallProgress={overallProgressPercent}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Center Main Stage Area (with padding left for desktop sidebar) */}
        <main className="flex-1 lg:pl-72 w-full min-w-0 flex flex-col justify-between">
          <div className="p-4 sm:p-6 lg:p-8 flex-1">
            {currentTab === 'dashboard' && (
              <Dashboard
                lessons={lessons}
                overallProgress={overallProgressPercent}
                onNavigate={setCurrentTab}
                onOpenLesson={handleOpenLesson}
                onStartExercise={handleStartExercise}
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
          </div>

          {/* Minimalist Educational Footer */}
          <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2 transition-colors">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 dark:text-slate-200">ScriptLab</span>
              <span>·</span>
              <span>มัลติมีเดียเพื่อการเรียนรู้การเขียนบทภาพยนตร์และบทวิดีโอ 3 คอลัมน์</span>
            </div>
            <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500 text-[11px]">
              <span>มาตรฐานฟอร์แมต Courier 12pt & 3-Column AV Script</span>
              <span>·</span>
              <span>โหมด {isDarkMode ? 'กลางคืน (Night)' : 'กลางวัน (Day)'}</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
