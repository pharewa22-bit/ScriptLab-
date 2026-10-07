import React, { useState } from 'react';
import { 
  Bot, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Clock, 
  Video, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Award, 
  ArrowRight, 
  Layers, 
  Zap,
  HelpCircle,
  FileText
} from 'lucide-react';
import { ThreeColumnRow } from '../types/script';

interface AiScriptValidatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  rows: ThreeColumnRow[];
  templateName?: string;
  onPlayVoiceRow: (row: ThreeColumnRow) => void;
  activePlayingId: string | null;
}

interface SceneValidation {
  row: ThreeColumnRow;
  targetSeconds: number;
  wordCount: number;
  charCount: number;
  estimatedSpeakSeconds: number;
  pacingStatus: 'optimal' | 'rushed' | 'dead-air';
  pacingFeedback: string;
  visualStatus: 'clear' | 'needs-detail';
  visualFeedback: string;
  recommendations: string[];
}

export const AiScriptValidatorModal: React.FC<AiScriptValidatorModalProps> = ({
  isOpen,
  onClose,
  rows,
  templateName,
  onPlayVoiceRow,
  activePlayingId,
}) => {
  const [copiedReport, setCopiedReport] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pacing' | 'visual' | 'tips'>('all');

  if (!isOpen) return null;

  // Helper: parse seconds from timecode string
  const parseSecondsFromTimecode = (tc: string): number => {
    // Check if contains (Xs) e.g. (5s) or (10s)
    const secondMatch = tc.match(/\((\d+)s\)/i);
    if (secondMatch) return parseInt(secondMatch[1], 10);

    // Or parse from range like 0:00 - 0:05
    const rangeMatch = tc.match(/0:(\d+)\s*-\s*0:(\d+)/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      return Math.max(2, end - start);
    }
    return 5; // default fallback
  };

  // Perform multi-dimensional analysis on each scene
  const validations: SceneValidation[] = rows.map((row) => {
    const targetSeconds = parseSecondsFromTimecode(row.timecode);
    const text = row.audioVoiceover.trim();
    // Words and characters count
    const words = text ? text.split(/\s+/).filter(Boolean) : [];
    const wordCount = words.length;
    const charCount = text.length;

    // Normal Thai voiceover speaking speed: ~2.5 words per second, or ~14 characters per second
    const estimatedSpeakSeconds = Math.max(1, Math.round(charCount / 13));

    // 1) Pacing & Duration Sync Evaluation
    let pacingStatus: 'optimal' | 'rushed' | 'dead-air' = 'optimal';
    let pacingFeedback = '';

    if (estimatedSpeakSeconds > targetSeconds * 1.35) {
      pacingStatus = 'rushed';
      pacingFeedback = `คำพากย์ยาวเกินไป (${charCount} ตัวอักษร ใช้เวลาราว ${estimatedSpeakSeconds} วิ ในขณะที่ฉากนี้มีเพียง ${targetSeconds} วิ) เสี่ยงทำให้นักพากย์ต้องพูดรัวเกินไปจนคนดูจับใจความไม่ทัน`;
    } else if (estimatedSpeakSeconds < targetSeconds * 0.45 && charCount < 18) {
      pacingStatus = 'dead-air';
      pacingFeedback = `คำพากย์สั้น (${estimatedSpeakSeconds} วิ ในเวลา ${targetSeconds} วิ) มีเวลาว่างมากเกินไป อาจเกิดช่องว่างเงียบ (Dead Air) แนะนำให้เสริมคำอธิบายหรือใส่ SFX/BGM ชูอารมณ์`;
    } else {
      pacingStatus = 'optimal';
      pacingFeedback = `จังหวะคำพากย์สอดคล้องพอดีกับเวลา (${charCount} ตัวอักษร พอดีกับช่วงเวลา ${targetSeconds} วิ ความเร็วการพูดกำลังเป็นธรรมชาติ)`;
    }

    // 2) Visual Direction Clarity Evaluation
    let visualStatus: 'clear' | 'needs-detail' = 'clear';
    let visualFeedback = '';
    const visualText = row.visualDescription.trim();

    const hasShotSize = ['CU', 'MCU', 'WS', 'POV', 'OTS', 'Graphic'].includes(row.shotType);
    const isDescriptive = visualText.length >= 18;
    const hasGraphicNote = !!row.visualGraphicNote.trim();

    if (!hasShotSize || !isDescriptive) {
      visualStatus = 'needs-detail';
      visualFeedback = `คำสั่งภาพยังไม่ชัดเจนเพียงพอ ควรกำหนดขนาดมุมกล้องที่แน่นอน และระบุการกระทำของตัวละครหรือจุดที่กล้องควรโฟกัสให้ทีมถ่ายทำเห็นภาพตรงกัน`;
    } else {
      visualStatus = 'clear';
      visualFeedback = `ระบุขนาดภาพ [${row.shotType}] และคำบรรยายแอ็กชันชัดเจน ${hasGraphicNote ? 'พร้อมข้อความกราฟิกบนจอครบถ้วน' : ''}`;
    }

    // 3) Recommendations per scene
    const recommendations: string[] = [];
    if (pacingStatus === 'rushed') {
      recommendations.push(`ตัดทอนคำฟุ่มเฟือยในบทพากย์ออกประมาณ ${Math.round((estimatedSpeakSeconds - targetSeconds) * 2)} คำ เพื่อให้ทันเวลา ${targetSeconds} วินาที`);
    } else if (pacingStatus === 'dead-air') {
      recommendations.push(`เพิ่มคำขยายความรู้สึก หรือเน้นเสียง Sound Effect (SFX) ในช่วงเวลาที่เหลือ`);
    }
    if (visualStatus === 'needs-detail') {
      recommendations.push(`เพิ่มคำกริยาแอ็กชันที่ตาเห็น (เช่น "ก้าวเข้ามา", "หยิบแก้ว", "สีหน้าตกใจ")`);
    }
    if (!hasGraphicNote) {
      recommendations.push(`ระบุ [TEXT: ...] หากต้องการให้มีข้อความพาดหัวลอยบนจอสำหรับคนดูที่ปิดเสียง`);
    }

    return {
      row,
      targetSeconds,
      wordCount,
      charCount,
      estimatedSpeakSeconds,
      pacingStatus,
      pacingFeedback,
      visualStatus,
      visualFeedback,
      recommendations,
    };
  });

  // Calculate Scores
  const rushedCount = validations.filter(v => v.pacingStatus === 'rushed').length;
  const deadAirCount = validations.filter(v => v.pacingStatus === 'dead-air').length;
  const visualIssueCount = validations.filter(v => v.visualStatus === 'needs-detail').length;

  const pacingScore = Math.max(50, Math.min(100, 100 - (rushedCount * 18) - (deadAirCount * 10)));
  const visualScore = Math.max(50, Math.min(100, 100 - (visualIssueCount * 16)));
  const overallScore = Math.round((pacingScore * 0.5) + (visualScore * 0.5));

  // Generate shareable report text
  const handleCopyReport = () => {
    let report = `=== [ScriptLab AI Assistant Review Report] ===\n`;
    report += `คะแนนความสมบูรณ์รวม: ${overallScore}/100\n`;
    report += `- ความสอดคล้องจังหวะเสียง & เวลา (Pacing): ${pacingScore}%\n`;
    report += `- ความชัดเจนของคำสั่งภาพ (Visual Clarity): ${visualScore}%\n\n`;
    report += `--- ผลการวิเคราะห์รายฉาก ---\n`;
    validations.forEach(v => {
      report += `ฉากที่ ${v.row.sequenceNumber} [${v.row.phaseName}] (${v.row.timecode}):\n`;
      report += `  - จังหวะเสียง: ${v.pacingFeedback}\n`;
      report += `  - คำสั่งภาพ: ${v.visualFeedback}\n`;
      if (v.recommendations.length > 0) {
        report += `  - ข้อแนะนำ: ${v.recommendations.join(', ')}\n`;
      }
      report += `\n`;
    });

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-950/40 dark:via-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  AI Assistant Review (ระบบวิเคราะห์บทอัจฉริยะ)
                </h3>
                <span className="text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Script Validator
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ตรวจสอบความสอดคล้องของคำพากย์กับเวลา, คำสั่งภาพ, และให้คะแนนความสมบูรณ์
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
          {/* Section 1: Overall Completeness Score & Metrics Overview */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-750 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Score Ring / Block */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex flex-col items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums leading-none">
                  {overallScore}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-90 mt-1">
                  / 100
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-slate-900 dark:text-white text-base">
                    {overallScore >= 90
                      ? 'คะแนนยอดเยี่ยม: บทพร้อมถ่ายทำจริง (Production Ready)'
                      : overallScore >= 75
                      ? 'คะแนนดี: ปรับแก้เล็กน้อยเพื่อความสมบูรณ์แบบ'
                      : 'ควรปรับปรุง: จังหวะเสียงหรือคำสั่งภาพยังไม่ลงตัว'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  ประเมินจากบทวิดีโอ 3 คอลัมน์ทั้งหมด {rows.length} ฉาก ตรวจสอบทั้งมิติจังหวะเวลา ภาพ และเสียง
                </p>
              </div>
            </div>

            {/* 2 Dimensional Progress Bars (Required 1 & 2) */}
            <div className="w-full md:w-72 space-y-3 pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 md:pl-6">
              {/* Dim 1: Pacing */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    1) ความยาวคำพากย์กับเวลา
                  </span>
                  <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {pacingScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      pacingScore >= 80 ? 'bg-amber-500' : 'bg-orange-500'
                    }`}
                    style={{ width: `${pacingScore}%` }}
                  />
                </div>
              </div>

              {/* Dim 2: Visual Clarity */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-blue-500" />
                    2) ความชัดเจนของคำสั่งภาพ
                  </span>
                  <span className="font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                    {visualScore}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      visualScore >= 80 ? 'bg-blue-500' : 'bg-indigo-500'
                    }`}
                    style={{ width: `${visualScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs for Analysis */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              ภาพรวมทุกฉาก ({validations.length})
            </button>
            <button
              onClick={() => setActiveTab('pacing')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'pacing'
                  ? 'bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>ความยาวคำพากย์ & สปีด</span>
              {rushedCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'visual'
                  ? 'bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>คำสั่งภาพ & มุมกล้อง</span>
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tips'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ข้อแนะนำปรับปรุง</span>
            </button>
          </div>

          {/* Section 2: Scene-by-Scene Detailed Validation Cards */}
          <div className="space-y-4">
            {validations.map((val) => {
              const isPlaying = activePlayingId === val.row.id;

              return (
                <div 
                  key={val.row.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4 shadow-xs hover:border-amber-400 dark:hover:border-amber-500 transition-all"
                >
                  {/* Card Title & Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        0{val.row.sequenceNumber}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                        ฉากที่ {val.row.sequenceNumber}: {val.row.phaseName}
                      </h4>
                      <span className="font-mono text-xs text-slate-400 dark:text-slate-400">
                        ⏱️ {val.row.timecode}
                      </span>
                    </div>

                    {/* Quick Voice Play Test */}
                    <button
                      onClick={() => onPlayVoiceRow(val.row)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPlaying
                          ? 'bg-amber-500 text-white animate-pulse'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {isPlaying ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-500" />}
                      <span>{isPlaying ? 'หยุดเสียง' : 'ทดสอบฟังเสียง'}</span>
                    </button>
                  </div>

                  {/* 2 Evaluated Dimensions Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Dimension 1: Pacing */}
                    <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      val.pacingStatus === 'rushed'
                        ? 'bg-red-50/60 dark:bg-red-950/40 border-red-200 dark:border-red-800/60 text-red-900 dark:text-red-200'
                        : val.pacingStatus === 'dead-air'
                        ? 'bg-amber-50/60 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200'
                        : 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5 uppercase text-[11px]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>1. ความยาวคำพากย์ & เวลา</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/70 dark:bg-black/40">
                          {val.pacingStatus === 'rushed' && '⚠️ ยาวเกินเวลา'}
                          {val.pacingStatus === 'dead-air' && 'ℹ️ สั้นเกินเวลา'}
                          {val.pacingStatus === 'optimal' && '✅ พอดีกับเวลา'}
                        </span>
                      </div>
                      <p className="leading-relaxed">
                        {val.pacingFeedback}
                      </p>
                      <div className="text-[11px] opacity-80 font-mono pt-1">
                        จำนวน: {val.wordCount} คำ ({val.charCount} ตัวอักษร) · ใช้เวลาราว ~{val.estimatedSpeakSeconds}s จากโควตา {val.targetSeconds}s
                      </div>
                    </div>

                    {/* Dimension 2: Visual Clarity */}
                    <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      val.visualStatus === 'needs-detail'
                        ? 'bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-200'
                        : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="font-bold flex items-center gap-1.5 uppercase text-[11px] text-blue-700 dark:text-blue-400">
                          <Video className="w-3.5 h-3.5" />
                          <span>2. คำสั่งภาพ & มุมกล้อง</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/70 dark:bg-black/40">
                          {val.visualStatus === 'clear' ? '✅ ชัดเจน' : '⚠️ ควรเพิ่มรายละเอียด'}
                        </span>
                      </div>
                      <p className="leading-relaxed">
                        {val.visualFeedback}
                      </p>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                        ขนาดภาพที่เลือก: <strong className="text-slate-800 dark:text-white">{val.row.shotType}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  {val.recommendations.length > 0 && (
                    <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-900/40 text-xs space-y-1">
                      <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        ข้อแนะนำปรับปรุงเฉพาะฉากนี้:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-700 dark:text-slate-300 pl-1">
                        {val.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            💡 AI Assistant Review ประเมินผลตามเกณฑ์มาตรฐานอุตสาหกรรมวิดีโอ 3 คอลัมน์
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyReport}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedReport ? 'คัดลอกรายงานแล้ว!' : 'คัดลอกรายงานผล'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-amber-400 transition-colors cursor-pointer"
            >
              เข้าใจแล้ว ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
