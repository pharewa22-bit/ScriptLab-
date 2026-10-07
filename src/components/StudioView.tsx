import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  Download, 
  Send, 
  Volume2, 
  VolumeX, 
  Eye, 
  Edit3, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Clock, 
  Layers, 
  Video, 
  Mic, 
  Film, 
  Tv, 
  Smartphone, 
  BookOpen,
  FileSpreadsheet,
  Bot,
  Clapperboard,
  FileDown
} from 'lucide-react';
import { ThreeColumnRow } from '../types/script';
import { THREE_COLUMN_TEMPLATES } from '../data/threeColumnTemplates';
import { AiScriptValidatorModal } from './AiScriptValidatorModal';
import { StoryboardPreview } from './StoryboardPreview';
import { ExportScriptModal } from './ExportScriptModal';
import { audioEngine } from '../utils/audioPlayer';

interface StudioViewProps {
  initialScript?: string;
  onSendToReviewer: (scriptContent: string) => void;
}

export const StudioView: React.FC<StudioViewProps> = ({
  initialScript,
  onSendToReviewer,
}) => {
  // Primary state: list of 3-column rows
  const [rows, setRows] = useState<ThreeColumnRow[]>(() => {
    // Try to load saved draft from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('scriptlab_3col_draft');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch {
          // ignore parsing error
        }
      }
    }
    // Default to commercial template
    return THREE_COLUMN_TEMPLATES[0].rows;
  });

  const [activeViewMode, setActiveViewMode] = useState<'table' | 'storyboard' | 'preview'>('table');
  const [activePlayingId, setActivePlayingId] = useState<string | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string>('');
  const [activeTemplateId, setActiveTemplateId] = useState<string>('template-commercial');
  const [isAiReviewOpen, setIsAiReviewOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Play gentle Web Audio chime for actions
  const playUiChime = (freq = 600, duration = 0.15) => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  };

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 2500);
  };

  // Save to LocalStorage
  const handleSaveDraft = () => {
    localStorage.setItem('scriptlab_3col_draft', JSON.stringify(rows));
    playUiChime(700, 0.2);
    showNotification('บันทึกร่างบท 3 คอลัมน์สำเร็จแล้ว');
  };

  // Load Auto-fill Template
  const handleLoadTemplate = (templateId: string) => {
    const template = THREE_COLUMN_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    if (window.confirm(`ต้องการเติมตัวอย่างบท "${template.name}" หรือไม่? ข้อมูลปัจจุบันจะถูกแทนที่ด้วยแม่แบบนี้`)) {
      setRows(JSON.parse(JSON.stringify(template.rows)));
      setActiveTemplateId(templateId);
      playUiChime(640, 0.25);
      showNotification(`โหลดตัวอย่างบท "${template.categoryLabel}" สำเร็จ!`);
    }
  };

  // Add new row at end or specific index
  const handleAddRow = (index?: number) => {
    const nextSeq = rows.length + 1;
    const newRow: ThreeColumnRow = {
      id: `row-custom-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      sequenceNumber: nextSeq,
      timecode: `0:${(nextSeq - 1) * 5 < 10 ? '0' : ''}${(nextSeq - 1) * 5} - 0:${nextSeq * 5 < 10 ? '0' : ''}${nextSeq * 5} (5s)`,
      phaseName: `ฉากที่ ${nextSeq}`,
      shotType: 'MCU',
      visualDescription: 'พิมพ์คำบรรยายสิ่งที่ตาเห็นในฉากนี้ เช่น การกระทำของตัวละคร หรือขนาดภาพ...',
      visualGraphicNote: '[TEXT: ข้อความบนจอหรือกราฟิก]',
      audioVoiceover: 'พิมพ์บทสนทนาหรือคำพากย์ในฉากนี้...',
      audioSfx: 'SFX: เสียงประกอบเฉพาะจุด',
      audioBgm: 'BGM: ดนตรีบรรเลงสร้างอารมณ์',
      voiceGenderHint: 'male'
    };

    if (typeof index === 'number') {
      const updated = [...rows];
      updated.splice(index + 1, 0, newRow);
      // Re-index sequence numbers
      const reindexed = updated.map((r, i) => ({ ...r, sequenceNumber: i + 1 }));
      setRows(reindexed);
    } else {
      setRows([...rows, newRow]);
    }
    playUiChime(550, 0.15);
    showNotification(`เพิ่มแถวฉากที่ ${typeof index === 'number' ? index + 2 : nextSeq} แล้ว`);
  };

  // Delete row
  const handleDeleteRow = (rowId: string) => {
    if (rows.length <= 1) {
      alert('บทสคริปต์ต้องมีอย่างน้อย 1 แถวฉาก');
      return;
    }
    const updated = rows.filter(r => r.id !== rowId).map((r, i) => ({
      ...r,
      sequenceNumber: i + 1
    }));
    setRows(updated);
    playUiChime(420, 0.15);
    showNotification('ลบแถวฉากเรียบร้อย');
  };

  // Duplicate row
  const handleDuplicateRow = (row: ThreeColumnRow, index: number) => {
    const duplicated: ThreeColumnRow = {
      ...row,
      id: `row-dup-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      phaseName: `${row.phaseName} (สำเนา)`
    };
    const updated = [...rows];
    updated.splice(index + 1, 0, duplicated);
    const reindexed = updated.map((r, i) => ({ ...r, sequenceNumber: i + 1 }));
    setRows(reindexed);
    playUiChime(620, 0.15);
    showNotification(`คัดลอกแถวฉากเรียบร้อย`);
  };

  // Move row up or down
  const handleMoveRow = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === rows.length - 1)) {
      return;
    }
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...rows];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    const reindexed = updated.map((r, i) => ({ ...r, sequenceNumber: i + 1 }));
    setRows(reindexed);
    playUiChime(580, 0.1);
  };

  // Update specific field in a row
  const handleUpdateField = (rowId: string, field: keyof ThreeColumnRow, value: string) => {
    setRows(prev => prev.map(r => {
      if (r.id === rowId) {
        return { ...r, [field]: value };
      }
      return r;
    }));
  };

  // Voice preview for this specific row using audioEngine
  const handlePlayVoice = (row: ThreeColumnRow) => {
    if (activePlayingId === row.id) {
      audioEngine.stopSpeaking();
      setActivePlayingId(null);
      return;
    }

    audioEngine.stopSpeaking();
    setActivePlayingId(row.id);

    audioEngine.speakVoiceover(row.audioVoiceover, {
      gender: row.voiceGenderHint,
      onEnd: () => setActivePlayingId(null),
    });
  };

  // Export as CSV
  const handleExportCsv = () => {
    const headers = ['ลำดับฉาก,เวลาและเฟส,ขนาดมุมกล้อง,คำบรรยายภาพและกราฟิก,บทพากย์,เสียงเอฟเฟกต์ (SFX),ดนตรี (BGM)\n'];
    const csvContent = rows.map(r => {
      const safe = (str: string) => `"${str.replace(/"/g, '""')}"`;
      return [
        r.sequenceNumber,
        safe(`${r.phaseName} (${r.timecode})`),
        safe(r.shotType),
        safe(`${r.visualDescription} ${r.visualGraphicNote}`),
        safe(r.audioVoiceover),
        safe(r.audioSfx),
        safe(r.audioBgm)
      ].join(',');
    }).join('\n');

    const blob = new Blob(['\uFEFF' + headers + csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scriptlab_3column_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('ส่งออกไฟล์ตาราง CSV เรียบร้อย');
  };

  // Convert 3-column script to text for the Reviewer
  const handleSendScriptToReviewer = () => {
    let scriptContent = `[SCRIPT 3-COLUMN AV FORMAT: ${activeTemplateId.toUpperCase()}]\n\n`;
    rows.forEach(r => {
      scriptContent += `INT. SCENE 0${r.sequenceNumber} - ${r.phaseName.toUpperCase()} - TIME: ${r.timecode}\n\n`;
      scriptContent += `${r.shotType}: ${r.visualDescription}\n`;
      if (r.visualGraphicNote) scriptContent += `${r.visualGraphicNote}\n\n`;
      scriptContent += `NARRATOR\n(VOICE-OVER)\n${r.audioVoiceover}\n\n`;
      scriptContent += `[${r.audioSfx}] [${r.audioBgm}]\n\n`;
    });

    onSendToReviewer(scriptContent);
  };

  // Compute stats
  const totalWords = rows.reduce((acc, r) => acc + (r.audioVoiceover.trim() ? r.audioVoiceover.trim().split(/\s+/).length : 0), 0);
  const totalShots = rows.length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Studio Header & Navigation */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-950/70 px-2 py-0.5 rounded-md border border-orange-200 dark:border-orange-800">
              เมนูที่ 2 · โปรแกรมแก้ไขบทฝึกปฏิบัติ
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Interactive 3-Column AV Script Studio</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            ห้องฝึกเขียนบทแบบ 3 คอลัมน์ (Script Editor)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
            แก้ไขลำดับฉาก คำบรรยายภาพ/มุมกล้อง และเสียงพากย์ได้แบบเรียลไทม์ พร้อมปุ่มเติมแม่แบบสื่อ 3 ประเภท
          </p>
        </div>

        {/* View Toggle & Reviewer Button */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-700/80 rounded-xl">
            <button
              onClick={() => setActiveViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeViewMode === 'table'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-amber-500" />
              <span>ตาราง 3 คอลัมน์</span>
            </button>
            <button
              onClick={() => setActiveViewMode('storyboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeViewMode === 'storyboard'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clapperboard className="w-3.5 h-3.5 text-amber-500" />
              <span>Storyboard Preview</span>
            </button>
            <button
              onClick={() => setActiveViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeViewMode === 'preview'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-blue-500" />
              <span>พรีวิวบทพิมพ์ดีด</span>
            </button>
          </div>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
            title="ส่งออกบทเรียนเป็น PDF หรือ Text"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>Export (PDF/Text)</span>
          </button>

          <button
            onClick={() => setIsAiReviewOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Bot className="w-4 h-4 text-white" />
            <span>ตรวจทานบท (AI Review)</span>
          </button>

          <button
            onClick={handleSendScriptToReviewer}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-all shadow-xs cursor-pointer"
            title="ส่งต่อไปยังหน้าตรวจทานสคริปต์สากล"
          >
            <Send className="w-3.5 h-3.5" />
            <span>ส่ง Linter สากล</span>
          </button>
        </div>
      </div>

      {/* Auto-fill Template Toolbar (สำหรับสื่อ 3 ประเภท: โฆษณา, สารคดี, และคลิปสั้นสไตล์ TikTok) */}
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-slate-800/90 dark:via-slate-800 dark:to-slate-800/90 p-4 sm:p-5 rounded-2xl border border-amber-200/80 dark:border-slate-700 shadow-xs space-y-3 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
              ปุ่มกดเติมตัวอย่างบทอัตโนมัติ (Auto-fill Template สำหรับสื่อ 3 ประเภท):
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            คลิกเพื่อโหลดโครงสร้างบทมาตรฐานสากลทันที
          </span>
        </div>

        {/* 3 Dedicated Media Template Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Template 1: โฆษณา */}
          <button
            onClick={() => handleLoadTemplate('template-commercial')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
              activeTemplateId === 'template-commercial'
                ? 'bg-white dark:bg-slate-700 border-amber-500 dark:border-amber-400 shadow-xs ring-1 ring-amber-500'
                : 'bg-white/80 dark:bg-slate-850/60 border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-slate-600'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Tv className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  1. สปอตโฆษณา (Commercial)
                </span>
                <span className="text-[10px] bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 px-1.5 py-0.2 rounded font-mono">
                  30s
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-300 line-clamp-1">
                Hook หยุดสายตา · ปัญหา · เปิดตัวสินค้า · CTA
              </p>
            </div>
          </button>

          {/* Template 2: สารคดี */}
          <button
            onClick={() => handleLoadTemplate('template-documentary')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
              activeTemplateId === 'template-documentary'
                ? 'bg-white dark:bg-slate-700 border-emerald-500 dark:border-emerald-400 shadow-xs ring-1 ring-emerald-500'
                : 'bg-white/80 dark:bg-slate-850/60 border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-slate-600'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Film className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  2. สารคดี (Documentary)
                </span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                  60s
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-300 line-clamp-1">
                ภาพมุมกว้าง WS · วิถีชีวิตภูมิปัญญา · มรดก
              </p>
            </div>
          </button>

          {/* Template 3: คลิปสั้น TikTok */}
          <button
            onClick={() => handleLoadTemplate('template-tiktok')}
            className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
              activeTemplateId === 'template-tiktok'
                ? 'bg-white dark:bg-slate-700 border-purple-500 dark:border-purple-400 shadow-xs ring-1 ring-purple-500'
                : 'bg-white/80 dark:bg-slate-850/60 border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-slate-600'
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="space-y-0.5 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  3. คลิปสั้นสไตล์ TikTok
                </span>
                <span className="text-[10px] bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 px-1.5 py-0.2 rounded font-mono">
                  15s
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-300 line-clamp-1">
                Stop-the-Scroll Hook 3s · ตัดคัตไว · ไวรัล
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Editor Action Ribbon & Stats */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-wrap items-center justify-between gap-3 transition-colors">
        <div className="flex flex-wrap items-center gap-2">
          {/* Add Row Button */}
          <button
            onClick={() => handleAddRow()}
            className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>เพิ่มแถวฉากใหม่ (+ Add Scene)</span>
          </button>

          {/* Save Draft Button */}
          <button
            onClick={handleSaveDraft}
            className="px-3 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>บันทึกร่าง</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="px-3 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออก CSV</span>
          </button>

          {/* AI Review Quick Button */}
          <button
            onClick={() => setIsAiReviewOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <Bot className="w-4 h-4 text-white" />
            <span>ตรวจทานบท (AI Review)</span>
          </button>

          {notificationMsg && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-fade-in pl-2">
              <Check className="w-3.5 h-3.5" />
              {notificationMsg}
            </span>
          )}
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>จำนวนฉาก: <strong className="text-slate-800 dark:text-white tabular-nums">{totalShots}</strong></span>
          </span>
          <span className="flex items-center gap-1">
            <Mic className="w-3.5 h-3.5 text-emerald-500" />
            <span>จำนวนคำพากย์: <strong className="text-slate-800 dark:text-white tabular-nums">{totalWords}</strong> คำ</span>
          </span>
        </div>
      </div>

      {/* Main Interactive Workspace Area */}
      {activeViewMode === 'storyboard' ? (
        /* Storyboard Preview Mode */
        <StoryboardPreview
          rows={rows}
          scriptTitle={THREE_COLUMN_TEMPLATES.find(t => t.id === activeTemplateId)?.name}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onBackToTable={() => setActiveViewMode('table')}
        />
      ) : activeViewMode === 'table' ? (
        /* 3-Column Interactive Table Editor */
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 font-bold">
                  {/* Column 1 Header */}
                  <th className="p-4 w-60 border-r border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                      <Clock className="w-4 h-4" />
                      <span>1. ลำดับฉาก & เวลา (Sequence / Time)</span>
                    </div>
                  </th>

                  {/* Column 2 Header */}
                  <th className="p-4 min-w-[280px] border-r border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 text-blue-700 dark:text-blue-400">
                      <Video className="w-4 h-4" />
                      <span>2. คำบรรยายภาพ / มุมกล้อง (Visual / Shot)</span>
                    </div>
                  </th>

                  {/* Column 3 Header */}
                  <th className="p-4 min-w-[320px] border-r border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                      <Mic className="w-4 h-4" />
                      <span>3. เสียงพากย์ / เพลงประกอบ (Audio / VO / SFX)</span>
                    </div>
                  </th>

                  {/* Manage / Actions Header */}
                  <th className="p-4 w-28 text-center text-slate-500 dark:text-slate-400 font-medium">
                    จัดการแถว
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {rows.map((row, idx) => {
                  const isPlaying = activePlayingId === row.id;

                  return (
                    <tr 
                      key={row.id}
                      className={`transition-colors ${
                        isPlaying
                          ? 'bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-400 dark:ring-amber-500'
                          : 'hover:bg-slate-50/70 dark:hover:bg-slate-750/50'
                      }`}
                    >
                      {/* COLUMN 1: ลำดับฉาก & เวลา */}
                      <td className="p-4 align-top border-r border-slate-200 dark:border-slate-700 space-y-2.5 bg-slate-50/40 dark:bg-slate-900/40">
                        <div className="flex items-center justify-between gap-1">
                          <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                            0{row.sequenceNumber}
                          </span>
                          
                          {/* Shot size selector */}
                          <select
                            value={row.shotType}
                            onChange={(e) => handleUpdateField(row.id, 'shotType', e.target.value)}
                            className="text-[11px] font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                          >
                            <option value="CU">CU (Close-Up)</option>
                            <option value="MCU">MCU (Medium Close)</option>
                            <option value="WS">WS (Wide Shot)</option>
                            <option value="POV">POV (แทนสายตา)</option>
                            <option value="OTS">OTS (ข้ามไหล่)</option>
                            <option value="Graphic">Graphic (กราฟิก)</option>
                          </select>
                        </div>

                        {/* Phase Name Input */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 uppercase">
                            ชื่อเฟส / ตอน
                          </label>
                          <input
                            type="text"
                            value={row.phaseName}
                            onChange={(e) => handleUpdateField(row.id, 'phaseName', e.target.value)}
                            placeholder="เช่น Hook, Pain Point"
                            className="w-full text-xs font-semibold bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg p-2 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>

                        {/* Timecode Input */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-slate-400 dark:text-slate-400 uppercase">
                            ช่วงเวลา (Timecode)
                          </label>
                          <input
                            type="text"
                            value={row.timecode}
                            onChange={(e) => handleUpdateField(row.id, 'timecode', e.target.value)}
                            placeholder="เช่น 0:00 - 0:05 (5s)"
                            className="w-full text-xs font-mono bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600 rounded-lg p-2 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                          />
                        </div>
                      </td>

                      {/* COLUMN 2: คำบรรยายภาพ & มุมกล้อง */}
                      <td className="p-4 align-top border-r border-slate-200 dark:border-slate-700 space-y-2.5">
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-blue-700 dark:text-blue-400 uppercase flex items-center justify-between">
                            <span>คำบรรยายภาพและแอ็กชัน</span>
                            <span className="text-slate-400 dark:text-slate-400 font-normal">Present Tense</span>
                          </label>
                          <textarea
                            value={row.visualDescription}
                            onChange={(e) => handleUpdateField(row.id, 'visualDescription', e.target.value)}
                            rows={3}
                            placeholder="ระบุสิ่งที่ปรากฏในจอภาพ การกระทำของตัวละคร แสง และมุมกล้อง..."
                            className="w-full text-xs bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 leading-relaxed focus:ring-1 focus:ring-blue-500 focus:outline-none resize-y"
                          />
                        </div>

                        {/* Text On Screen / Graphic note */}
                        <div className="space-y-1">
                          <label className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase">
                            ข้อความบนจอ (Text on Screen / Super)
                          </label>
                          <input
                            type="text"
                            value={row.visualGraphicNote}
                            onChange={(e) => handleUpdateField(row.id, 'visualGraphicNote', e.target.value)}
                            placeholder="[TEXT: ใส่ข้อความหรือคำโปรยบนจอที่นี่...]"
                            className="w-full text-xs font-mono bg-blue-50/50 dark:bg-slate-850 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-slate-600 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                      </td>

                      {/* COLUMN 3: เสียงพากย์, เพลงประกอบ, SFX */}
                      <td className="p-4 align-top border-r border-slate-200 dark:border-slate-700 space-y-2.5">
                        {/* Voiceover Textarea + Preview Voice Button */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                              บทพากย์เสียง (VOICE-OVER / DIALOGUE)
                            </label>
                            
                            <button
                              onClick={() => handlePlayVoice(row)}
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                                isPlaying
                                  ? 'bg-amber-500 text-white animate-pulse'
                                  : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900'
                              }`}
                              title="ทดสอบฟังเสียงพากย์ด้วย Web Speech API"
                            >
                              {isPlaying ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                              <span>{isPlaying ? 'หยุดเสียง' : 'ฟังเสียงพากย์'}</span>
                            </button>
                          </div>

                          <textarea
                            value={row.audioVoiceover}
                            onChange={(e) => handleUpdateField(row.id, 'audioVoiceover', e.target.value)}
                            rows={3}
                            placeholder="พิมพ์คำพูดหรือบทพากย์ที่ต้องการให้นักพากย์พูด..."
                            className="w-full text-xs font-screenplay bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-600 rounded-lg p-2.5 leading-relaxed focus:ring-1 focus:ring-emerald-500 focus:outline-none resize-y"
                          />
                        </div>

                        {/* Sound Effects & BGM Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-semibold text-orange-700 dark:text-orange-400 block mb-0.5">
                              SFX (เสียงเอฟเฟกต์)
                            </label>
                            <input
                              type="text"
                              value={row.audioSfx}
                              onChange={(e) => handleUpdateField(row.id, 'audioSfx', e.target.value)}
                              placeholder="SFX: เสียงเปิดกระป๋อง..."
                              className="w-full text-[11px] font-mono bg-orange-50/50 dark:bg-slate-850 text-orange-900 dark:text-orange-300 border border-orange-200 dark:border-slate-600 rounded-lg p-1.5 focus:ring-1 focus:ring-orange-500 focus:outline-none"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-semibold text-purple-700 dark:text-purple-400 block mb-0.5">
                              BGM (ดนตรีประกอบ)
                            </label>
                            <input
                              type="text"
                              value={row.audioBgm}
                              onChange={(e) => handleUpdateField(row.id, 'audioBgm', e.target.value)}
                              placeholder="BGM: ดนตรี EDM เร่งจังหวะ..."
                              className="w-full text-[11px] font-mono bg-purple-50/50 dark:bg-slate-850 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-slate-600 rounded-lg p-1.5 focus:ring-1 focus:ring-purple-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      </td>

                      {/* Actions Column: Move, Duplicate, Insert, Delete */}
                      <td className="p-3 align-top text-center space-y-2">
                        <div className="flex flex-col items-center gap-1.5 pt-2">
                          {/* Move Up / Down */}
                          <div className="flex items-center gap-1">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleMoveRow(idx, 'up')}
                              className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="เลื่อนฉากนี้ขึ้น"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={idx === rows.length - 1}
                              onClick={() => handleMoveRow(idx, 'down')}
                              className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                              title="เลื่อนฉากนี้ลง"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Duplicate row */}
                          <button
                            onClick={() => handleDuplicateRow(row, idx)}
                            className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 cursor-pointer"
                            title="ทำสำเนาฉากนี้"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* Insert row right below */}
                          <button
                            onClick={() => handleAddRow(idx)}
                            className="p-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 cursor-pointer"
                            title="แทรกแถวใหม่ใต้ฉากนี้"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete row */}
                          <button
                            onClick={() => handleDeleteRow(row.id)}
                            className="p-1 rounded bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 cursor-pointer"
                            title="ลบแถวฉากนี้"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Action: Add Row */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => handleAddRow()}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border-2 border-dashed border-amber-400 dark:border-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>คลิกเพื่อเพิ่มแถวฉากถัดไป (+ Add Scene {rows.length + 1})</span>
            </button>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              💡 เคล็ดลับ: สามารถคลิกปุ่ม "ฟังเสียงพากย์" เพื่อวัดสปีดความเร็วคำพูดของนักพากย์ได้ทันที
            </div>
          </div>
        </div>
      ) : (
        /* Full Screenplay Preview Mode (Courier Print Standard) */
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 md:p-10 shadow-xs space-y-6 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                พรีวิวรูปแบบเอกสารบทวิดีโอ (Production Script View)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ฟอร์แมตมาตรฐานสำหรับส่งให้ทีมกล้อง นักแสดง และคนตัดต่อ
              </p>
            </div>
            <button
              onClick={() => setActiveViewMode('table')}
              className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold cursor-pointer"
            >
              กลับสู่ตารางแก้ไข
            </button>
          </div>

          <div className="bg-slate-900 dark:bg-slate-950 text-slate-100 rounded-xl p-8 sm:p-12 font-screenplay text-xs sm:text-sm leading-relaxed overflow-x-auto space-y-6 border border-slate-800">
            <div className="border-b border-slate-800 pb-4 text-center space-y-1">
              <h4 className="text-base font-bold text-amber-400">
                [PRODUCTION SCRIPT - 3-COLUMN AV FORMAT]
              </h4>
              <p className="text-xs text-slate-400">
                PROJECT: {THREE_COLUMN_TEMPLATES.find(t => t.id === activeTemplateId)?.name || 'CUSTOM VIDEO SCRIPT'}
              </p>
            </div>

            {rows.map((r) => (
              <div key={r.id} className="space-y-2 border-b border-slate-800/60 pb-5">
                <div className="text-amber-400 font-bold text-xs sm:text-sm">
                  SCENE 0{r.sequenceNumber} · {r.phaseName.toUpperCase()} · {r.timecode}
                </div>

                <div className="text-slate-300">
                  <strong className="text-blue-400">[{r.shotType}]</strong> {r.visualDescription}
                  {r.visualGraphicNote && (
                    <div className="text-blue-300 font-mono text-xs pl-4 mt-1">
                      {r.visualGraphicNote}
                    </div>
                  )}
                </div>

                <div className="pl-6 sm:pl-16 py-1 max-w-lg">
                  <div className="text-slate-200 font-bold">
                    NARRATOR (VO)
                  </div>
                  <div className="text-slate-100 italic">
                    "{r.audioVoiceover}"
                  </div>
                </div>

                <div className="text-xs font-mono text-slate-400 flex flex-wrap gap-4 pt-1">
                  <span className="text-orange-400">{r.audioSfx}</span>
                  <span className="text-purple-400">{r.audioBgm}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Assistant Review Modal */}
      <AiScriptValidatorModal
        isOpen={isAiReviewOpen}
        onClose={() => setIsAiReviewOpen(false)}
        rows={rows}
        templateName={THREE_COLUMN_TEMPLATES.find(t => t.id === activeTemplateId)?.name}
        onPlayVoiceRow={handlePlayVoice}
        activePlayingId={activePlayingId}
      />

      {/* Export Script Modal (PDF & Text) */}
      <ExportScriptModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        rows={rows}
        scriptTitle={THREE_COLUMN_TEMPLATES.find(t => t.id === activeTemplateId)?.name}
      />
    </div>
  );
};
