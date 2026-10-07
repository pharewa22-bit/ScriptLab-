import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Check, 
  HelpCircle, 
  Sparkles, 
  FileCode,
  PenTool,
  RotateCcw
} from 'lucide-react';
import { Lesson } from '../types/script';

interface LessonsViewProps {
  lessons: Lesson[];
  selectedLessonId: string | null;
  onSelectLesson: (id: string | null) => void;
  onCompleteQuiz: (lessonId: string) => void;
  onOpenInStudio: (scriptText: string) => void;
}

export const LessonsView: React.FC<LessonsViewProps> = ({
  lessons,
  selectedLessonId,
  onSelectLesson,
  onCompleteQuiz,
  onOpenInStudio,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [hasSubmittedQuiz, setHasSubmittedQuiz] = useState<boolean>(false);

  const activeLesson = lessons.find(l => l.id === selectedLessonId) || null;

  const filteredLessons = filterCategory === 'all' 
    ? lessons 
    : lessons.filter(l => l.category === filterCategory);

  const handleSelectLessonInternal = (id: string) => {
    onSelectLesson(id);
    setSelectedQuizAnswer(null);
    setHasSubmittedQuiz(false);
  };

  const handleQuizAnswer = (idx: number) => {
    if (hasSubmittedQuiz) return;
    setSelectedQuizAnswer(idx);
  };

  const handleSubmitQuiz = () => {
    if (selectedQuizAnswer === null || !activeLesson) return;
    setHasSubmittedQuiz(true);
    if (selectedQuizAnswer === activeLesson.content.quiz.correctIndex) {
      onCompleteQuiz(activeLesson.id);
    }
  };

  const handleResetQuiz = () => {
    setSelectedQuizAnswer(null);
    setHasSubmittedQuiz(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
              เมนูที่ 1
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-400">คอร์สเรียนหลักสูตรมาตรฐาน</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">บทเรียนการเขียนบทภาพยนตร์ (Screenwriting Lessons)</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            เรียนรู้เทคนิคการเล่าเรื่อง โครงสร้าง 3 องก์ ซับเท็กซ์ในบทสนทนา และรูปแบบมาตรฐานสากล
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-700/80 rounded-xl overflow-x-auto text-xs shrink-0">
          {[
            { id: 'all', label: 'ทั้งหมด' },
            { id: 'basics', label: 'พื้นฐานบท' },
            { id: 'structure', label: 'โครงสร้าง 3 องก์' },
            { id: 'dialogue', label: 'บทสนทนา' },
            { id: 'visuals', label: 'การเขียนฉาก' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                filterCategory === tab.id
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lesson List Cards (4 cols on lg when reading, 12 cols if none selected) */}
        <div className={activeLesson ? 'lg:col-span-4 space-y-3' : 'lg:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-4'}>
          {filteredLessons.map((lesson) => {
            const isSelected = activeLesson?.id === lesson.id;
            return (
              <div
                key={lesson.id}
                onClick={() => handleSelectLessonInternal(lesson.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-400 dark:border-amber-600 shadow-sm' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-500 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                    {lesson.categoryLabel}
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lesson.durationMinutes} นาที
                    </span>
                    {lesson.completed && (
                      <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Check className="w-3.5 h-3.5" />
                        สำเร็จ
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                  {lesson.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {lesson.summary}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>ระดับ: {lesson.level}</span>
                  </div>
                  <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    {isSelected ? 'กำลังอ่าน' : 'คลิกเพื่อเรียน'}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Lesson Viewer (8 cols) */}
        {activeLesson && (
          <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 space-y-8 shadow-xs transition-colors">
            {/* Lesson Title & Metadata */}
            <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-700">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1 rounded-md">
                  {activeLesson.categoryLabel}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  เวลาเรียน {activeLesson.durationMinutes} นาที
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">ระดับ {activeLesson.level}</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                {activeLesson.title}
              </h2>
            </div>

            {/* Overview & Key Points */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>สรุปใจความและหลักการสำคัญ</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                {activeLesson.content.overview}
              </p>

              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  หัวข้อสำคัญที่ต้องจดจำ:
                </h4>
                <ul className="space-y-2">
                  {activeLesson.content.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Script Example Breakdown (Authentic Courier Screenplay style) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span>ตัวอย่างบทสคริปต์ประกอบบทเรียน</span>
                </h3>
                <button
                  onClick={() => onOpenInStudio(`${activeLesson.content.exampleScript.heading}\n\n${activeLesson.content.exampleScript.body}`)}
                  className="text-xs text-amber-700 dark:text-amber-300 font-semibold hover:text-amber-800 dark:hover:text-amber-200 flex items-center gap-1 cursor-pointer bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 px-2.5 py-1 rounded-lg transition-colors border border-amber-200/50 dark:border-amber-800/50"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>ทดลองพิมพ์ใน Studio</span>
                </button>
              </div>

              {/* Screenplay Paper Simulator */}
              <div className="bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800 shadow-inner font-screenplay text-xs sm:text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap">
                <div className="text-amber-400 font-bold mb-3 border-b border-slate-800 pb-2">
                  {activeLesson.content.exampleScript.heading}
                </div>
                <div className="text-slate-200">
                  {activeLesson.content.exampleScript.body}
                </div>
              </div>

              {/* Analysis note */}
              <div className="p-3.5 bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-xl text-xs text-amber-900 dark:text-amber-200 leading-relaxed flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-amber-800 dark:text-amber-300 mb-0.5">วิเคราะห์เทคนิคบทนี้:</span>
                  <span>{activeLesson.content.exampleScript.analysis}</span>
                </div>
              </div>
            </div>

            {/* Pro-Tip Box */}
            <div className="p-4 rounded-xl bg-slate-900 dark:bg-slate-950 text-white border border-slate-800 dark:border-slate-700 space-y-1">
              <span className="text-xs font-bold text-amber-400 tracking-wider">💡 DIRECTOR'S PRO-TIP</span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeLesson.content.proTip}
              </p>
            </div>

            {/* Interactive Knowledge Quiz */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    แบบทดสอบความเข้าใจประจำบท (Quick Quiz)
                  </h4>
                </div>
                {hasSubmittedQuiz && (
                  <button
                    onClick={handleResetQuiz}
                    className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    ลองใหม่
                  </button>
                )}
              </div>

              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {activeLesson.content.quiz.question}
              </p>

              <div className="space-y-2">
                {activeLesson.content.quiz.options.map((opt, optIdx) => {
                  const isSelected = selectedQuizAnswer === optIdx;
                  const isCorrect = optIdx === activeLesson.content.quiz.correctIndex;
                  
                  let optionClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600';
                  if (hasSubmittedQuiz) {
                    if (isCorrect) {
                      optionClass = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionClass = 'bg-red-50 dark:bg-red-950/60 border-red-400 text-red-900 dark:text-red-200';
                    } else {
                      optionClass = 'bg-slate-100/60 dark:bg-slate-850/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500';
                    }
                  } else if (isSelected) {
                    optionClass = 'bg-amber-50 dark:bg-amber-950/50 border-amber-500 text-amber-900 dark:text-amber-200 font-medium shadow-xs';
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={hasSubmittedQuiz}
                      onClick={() => handleQuizAnswer(optIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${optionClass}`}
                    >
                      <span>{opt}</span>
                      {hasSubmittedQuiz && isCorrect && (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {!hasSubmittedQuiz ? (
                <div className="pt-2">
                  <button
                    disabled={selectedQuizAnswer === null}
                    onClick={handleSubmitQuiz}
                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      selectedQuizAnswer !== null
                        ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-xs cursor-pointer'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    ตรวจคำตอบ
                  </button>
                </div>
              ) : (
                <div className={`p-4 rounded-xl text-xs leading-relaxed ${
                  selectedQuizAnswer === activeLesson.content.quiz.correctIndex
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-800'
                }`}>
                  <span className="font-bold block mb-1">
                    {selectedQuizAnswer === activeLesson.content.quiz.correctIndex
                      ? '🎉 ถูกต้องยอดเยี่ยม! คุณเข้าใจหัวข้อนี้อย่างถ่องแท้'
                      : '💡 ยังไม่ถูกต้อง ลองอ่านคำอธิบายด้านล่าง:'}
                  </span>
                  <span>{activeLesson.content.quiz.explanation}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
