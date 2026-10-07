import React, { useState } from 'react';
import { 
  FileText, 
  ArrowRight, 
  BookOpen, 
  PenTool, 
  Copy, 
  Check, 
  Sparkles, 
  Tag, 
  Clock, 
  Compass,
  Film
} from 'lucide-react';
import { SAMPLE_SCRIPTS } from '../data/learningContent';
import { ScriptSample } from '../types/script';

interface LibraryViewProps {
  onLoadIntoStudio: (scriptText: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onLoadIntoStudio }) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [selectedScriptId, setSelectedScriptId] = useState<string>(SAMPLE_SCRIPTS[0].id);
  const [copied, setCopied] = useState<boolean>(false);

  const filteredScripts = selectedGenre === 'all'
    ? SAMPLE_SCRIPTS
    : SAMPLE_SCRIPTS.filter(s => s.genre === selectedGenre);

  const activeScript = SAMPLE_SCRIPTS.find(s => s.id === selectedScriptId) || SAMPLE_SCRIPTS[0];

  const handleCopyScript = () => {
    navigator.clipboard.writeText(activeScript.screenplayContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Library Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
              เมนูที่ 3
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-400">Screenplay Vault & Masterpieces</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">คลังตัวอย่างบทภาพยนตร์ (Script Library)</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            สำรวจบทภาพยนตร์คุณภาพหลากหลายแนว พร้อมบทวิเคราะห์ของผู้กำกับ (Director's Commentary)
          </p>
        </div>

        {/* Genre Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl overflow-x-auto text-xs shrink-0">
          {['all', 'Sci-Fi', 'Thriller', 'Rom-Com'].map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                selectedGenre === genre
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {genre === 'all' ? 'ทุกประเภท' : genre}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Script Selection Cards (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider px-1">
            รายการตัวอย่างบท ({filteredScripts.length})
          </h3>

          <div className="space-y-3">
            {filteredScripts.map(script => {
              const isSelected = script.id === activeScript.id;
              return (
                <div
                  key={script.id}
                  onClick={() => setSelectedScriptId(script.id)}
                  className={`rounded-2xl border overflow-hidden transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-600 shadow-sm' 
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-500 hover:shadow-md'
                  }`}
                >
                  <div className="h-32 w-full relative overflow-hidden bg-slate-900">
                    <img 
                      src={script.image} 
                      alt={script.title}
                      className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full">
                        {script.genre}
                      </span>
                      <span className="text-[11px] text-slate-200 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {script.readTime}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {script.title}
                    </h4>
                    <p className="text-xs text-slate-400 dark:text-slate-400 italic">
                      "{script.titleEn}"
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {script.logline}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 text-xs">
                      <span className="text-slate-400 dark:text-slate-400">{script.pages} หน้าบท</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        {isSelected ? 'กำลังอ่าน' : 'อ่านบทนี้'}
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Script Reader (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-8 space-y-6 shadow-xs transition-colors">
          {/* Header & Logline */}
          <div className="space-y-3 pb-6 border-b border-slate-100 dark:border-slate-700">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">
                  {activeScript.genre}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{activeScript.readTime} อ่าน</span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyScript}
                  className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกบท'}</span>
                </button>

                <button
                  onClick={() => onLoadIntoStudio(activeScript.screenplayContent)}
                  className="px-3.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>นำบทไปฝึกต่อใน Studio</span>
                </button>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white leading-snug">
              {activeScript.title} <span className="text-sm font-normal text-slate-400 dark:text-slate-400">({activeScript.titleEn})</span>
            </h3>

            {/* Logline Box */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-bold text-slate-900 dark:text-white mr-1.5">Logline (เรื่องย่อหนึ่งบรรทัด):</span>
              {activeScript.logline}
            </div>
          </div>

          {/* Director's Commentary */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              <Film className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Director's Commentary (มุมมองผู้กำกับและเทคนิคการเขียน):</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed">
              {activeScript.directorNotes}
            </p>
          </div>

          {/* Script Content Viewer (Courier Screenplay Format) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">ตัวอย่างเนื้อหาบทสคริปต์ (Screenplay Draft)</span>
              <span className="font-screenplay">Format: Industry Courier Standard</span>
            </div>

            <div className="bg-slate-900 dark:bg-slate-950 text-slate-100 p-6 sm:p-10 rounded-2xl border border-slate-800 dark:border-slate-700 shadow-inner font-screenplay text-xs sm:text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[500px] overflow-y-auto">
              {activeScript.screenplayContent}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
