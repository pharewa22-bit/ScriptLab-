import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  ArrowRight, 
  PenTool, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  RefreshCw, 
  FileCode 
} from 'lucide-react';
import { ReviewIssue, ScriptReviewResult } from '../types/script';

interface ReviewerViewProps {
  initialScript?: string;
  onEditInStudio: (scriptText: string) => void;
}

export const ReviewerView: React.FC<ReviewerViewProps> = ({
  initialScript = '',
  onEditInStudio,
}) => {
  const [scriptInput, setScriptInput] = useState<string>(initialScript || `INT. COFFEE SHOP - DAY

กาแฟร้อนส่งควันฉุยบนโต๊ะไม้

วินัย (30) นั่งมองออกไปนอกหน้าต่าง เราเห็นฝนเริ่มตกลงมาอย่างหนัก และเขารู้สึกเศร้าใจมากในเวลานี้

วินัย
(พูดด้วยความเสียใจและโกรธแค้น)
ทำไมเรื่องแบบนี้ต้องเกิดขึ้นกับฉันด้วยนะ? ฉันเกลียดทุกคนจริงๆ!`);

  React.useEffect(() => {
    if (initialScript) {
      setScriptInput(initialScript);
    }
  }, [initialScript]);

  const [reviewResult, setReviewResult] = useState<ScriptReviewResult | null>(null);

  // Screenwriter Self-Checklist states
  const [checklist, setChecklist] = useState<{[key: string]: boolean}>({
    sluglines: true,
    actionLines: false,
    noWeSee: false,
    dialogueSubtext: false,
    onePageOneMin: true,
    activeVerbs: true,
  });

  const toggleChecklistItem = (key: string) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Automated Script Linting Algorithm
  const handleAnalyzeScript = () => {
    const text = scriptInput.trim();
    if (!text) return;

    const lines = text.split('\n');
    const issues: ReviewIssue[] = [];
    const strengths: string[] = [];
    const recommendations: string[] = [];

    // 1. Scene Headings check
    const sceneHeadings = text.match(/^(INT\.|EXT\.)/gim) || [];
    if (sceneHeadings.length === 0) {
      issues.push({
        type: 'error',
        title: 'ไม่พบ Scene Heading (Slugline) ที่ถูกต้อง',
        description: 'บทภาพยนตร์ทุกฉากต้องเริ่มต้นด้วย INT. (ภายใน) หรือ EXT. (ภายนอก) ตามด้วยสถานที่และเวลา เช่น INT. COFFEE SHOP - DAY',
      });
    } else {
      strengths.push(`ใช้ Scene Heading ถูกต้องตามมาตรฐาน (${sceneHeadings.length} ฉาก)`);
    }

    // 2. "We see" or "We hear" passive voice check
    const passiveMatches = text.match(/(we see|we hear|เราเห็น|เราได้ยิน|ผู้ชมจะเห็น)/gi);
    if (passiveMatches) {
      issues.push({
        type: 'warning',
        title: 'พบการใช้คำว่า "เราเห็น / เราได้ยิน" (We see / We hear)',
        description: 'บทภาพยนตร์มืออาชีพจะไม่เขียนบอกกล้องตรงๆ ให้บรรยายสิ่งที่ปรากฏโดยตรง เช่น แทนที่จะเขียน "เราเห็นฝนตก" ให้เขียนว่า "สายฝนเทกระหน่ำลงมา"',
        lineSnippet: passiveMatches[0],
      });
    } else {
      strengths.push('ไม่พบคำว่า "เราเห็น / We see" ถ่ายทอดภาพโดยตรงอย่างมืออาชีพ');
    }

    // 3. Action Block Length check
    const blocks = text.split('\n\n');
    let hasLongAction = false;
    blocks.forEach((b) => {
      const bLines = b.trim().split('\n');
      if (bLines.length > 4 && !/^(INT\.|EXT\.)/i.test(b.trim())) {
        hasLongAction = true;
      }
    });

    if (hasLongAction) {
      issues.push({
        type: 'warning',
        title: 'Action Paragraph มีความยาวเกิน 4 บรรทัด',
        description: 'ควรกระจายย่อหน้าบรรยายภาพให้สั้นลง (ไม่เกิน 3-4 บรรทัดต่อย่อหน้า) เพื่อสร้างจังหวะสายตาเสมือนคัตภาพยนตร์',
      });
    } else {
      strengths.push('การแบ่งย่อหน้า Action Line สั้นกระชับ อ่านง่ายสบายตา');
    }

    // 4. On-the-nose emotion words in action or parenthetical
    if (/รู้สึกเศร้า|รู้สึกโกรธ|คิดในใจ|นึกถึงอดีต/i.test(text)) {
      issues.push({
        type: 'tip',
        title: 'พบการบรรยายความรู้สึกในใจตัวละคร',
        description: 'กล้องไม่สามารถถ่ายทอดความคิดในใจได้ ให้แปลงเป็นภาษากาย เช่น มือสั่น ก้มหน้า หรือหลบสายตา',
      });
    }

    // 5. Parenthetical overuse
    const parentheticals = text.match(/\([^)]+\)/g) || [];
    if (parentheticals.length > 3) {
      issues.push({
        type: 'tip',
        title: 'มีคำกำกับอารมณ์ในวงเล็บ (Parenthetical) บ่อยเกินไป',
        description: 'ควรปล่อยให้นักแสดงตีความอารมณ์เอง ใช้ Parenthetical เฉพาะเมื่อบทพูดนั้นขัดแย้งกับอารมณ์จริง เช่น (ยิ้มทั้งน้ำตา)',
      });
    }

    // Recommendations
    if (issues.length === 0) {
      recommendations.push('บทเขียนได้ถูกต้องตามฟอร์แมตสากล พร้อมสำหรับการนำไปซ้อมอ่าน (Table Read)');
    } else {
      recommendations.push('ปรับแก้จุดที่ตรวจพบตามคำแนะนำด้านล่าง แล้วลองกดตรวจทานใหม่อีกครั้ง');
    }
    recommendations.push('ลองนำบทนี้เข้าสู่ห้อง Studio เพื่อพรีวิวหน้าบทแบบ Courier');

    // Score computation
    const errorCount = issues.filter(i => i.type === 'error').length;
    const warningCount = issues.filter(i => i.type === 'warning').length;
    const tipCount = issues.filter(i => i.type === 'tip').length;
    
    let computedScore = 100 - (errorCount * 25) - (warningCount * 15) - (tipCount * 5);
    computedScore = Math.max(30, Math.min(100, computedScore));

    const wordCount = text.split(/\s+/).length;

    setReviewResult({
      score: computedScore,
      sceneCount: sceneHeadings.length,
      wordCount,
      characterCount: text.length,
      dialogueRatio: Math.min(80, Math.max(20, Math.round((text.match(/\n[^\n]+\n/g)?.length || 1) * 8))),
      estimatedMinutes: Math.max(1, Math.round(wordCount / 180)),
      issues,
      strengths,
      recommendations,
    });
  };

  const checklistTotal = Object.keys(checklist).length;
  const checklistChecked = Object.values(checklist).filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Reviewer Header */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-sky-700 dark:text-sky-300 bg-sky-100 dark:bg-sky-950/60 px-2 py-0.5 rounded-md">
              เมนูที่ 4
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-400">Script Linter & Quality Assurance</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">ตรวจทานบทและฟอร์แมต (Script Reviewer)</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            ตรวจสอบรูปแบบ Scene Heading, ความกระชับของ Action Line และหลีกเลี่ยง On-the-nose Dialogue
          </p>
        </div>

        <button
          onClick={handleAnalyzeScript}
          className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>วิเคราะห์บทสคริปต์ทันที</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Script Input & Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Text Input Box */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCode className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>วางบทที่ต้องการตรวจทาน (Paste Your Script)</span>
              </h3>
              <span className="text-xs text-slate-400 dark:text-slate-400">รองรับภาษาไทยและอังกฤษ</span>
            </div>

            <textarea
              value={scriptInput}
              onChange={(e) => setScriptInput(e.target.value)}
              placeholder="วางบทสคริปต์ของคุณที่นี่ เช่น INT. COFFEE SHOP - DAY..."
              rows={12}
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-screenplay text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-relaxed focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 resize-y"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => onEditInStudio(scriptInput)}
                className="text-xs text-orange-600 dark:text-orange-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>นำบทนี้ไปแก้ไขใน Studio</span>
              </button>

              <button
                onClick={handleAnalyzeScript}
                className="px-4 py-2 bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
              >
                กดตรวจทานบท
              </button>
            </div>
          </div>

          {/* Self-Review Checklist for Writers */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  รายการตรวจสอบก่อนส่งบท (Self-Review Checklist)
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 tabular-nums">
                {checklistChecked} จาก {checklistTotal} ข้อ
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { key: 'sluglines', label: 'Scene Heading มี INT./EXT. สถานที่ และเวลา (DAY/NIGHT) ครบทุกฉาก' },
                { key: 'actionLines', label: 'Action Paragraph สั้นกระชับ ไม่เกิน 3-4 บรรทัดต่อย่อหน้า' },
                { key: 'noWeSee', label: 'ตัดคำว่า "เราเห็น" หรือ "We see" ออกทั้งหมด โดยบรรยายภาพโดยตรง' },
                { key: 'dialogueSubtext', label: 'บทสนทนามี Subtext ไม่พูดบอกความรู้สึกตรงเกินไป (No on-the-nose)' },
                { key: 'onePageOneMin', label: 'จัดหน้าตามมาตรฐาน Courier 12pt (1 หน้า ~ 1 นาที)' },
                { key: 'activeVerbs', label: 'ใช้คำกริยาทรงพลัง (Active Verbs) และเป็น Present Tense' },
              ].map(item => (
                <div
                  key={item.key}
                  onClick={() => toggleChecklistItem(item.key)}
                  className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer text-xs sm:text-sm text-slate-700 dark:text-slate-200"
                >
                  {checklist[item.key] ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                  )}
                  <span className={checklist[item.key] ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Analysis Results & Scoring (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {reviewResult ? (
            <div className="space-y-5">
              {/* Score Card */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 transition-colors">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">คะแนนความสมบูรณ์ของบท</h4>
                  <span className={`text-2xl font-extrabold tabular-nums ${
                    reviewResult.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : reviewResult.score >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {reviewResult.score}/100
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      reviewResult.score >= 80 ? 'bg-emerald-500' : reviewResult.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${reviewResult.score}%` }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                  <div className="p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
                    <span className="text-[11px] text-slate-400 dark:text-slate-400 block">จำนวนฉาก</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-sm tabular-nums">{reviewResult.sceneCount}</span>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
                    <span className="text-[11px] text-slate-400 dark:text-slate-400 block">จำนวนคำ</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-sm tabular-nums">{reviewResult.wordCount}</span>
                  </div>
                  <div className="p-2 bg-slate-50 dark:bg-slate-900/60 rounded-xl">
                    <span className="text-[11px] text-slate-400 dark:text-slate-400 block">เวลาฉายราว</span>
                    <span className="font-bold text-slate-800 dark:text-slate-100 text-sm tabular-nums">~{reviewResult.estimatedMinutes} นาที</span>
                  </div>
                </div>
              </div>

              {/* Issues & Warnings List */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 transition-colors">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>จุดที่แนะนำให้ปรับปรุง ({reviewResult.issues.length})</span>
                </h4>

                {reviewResult.issues.length === 0 ? (
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>ไม่พบข้อผิดพลาดด้านฟอร์แมต ยอดเยี่ยมมาก!</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviewResult.issues.map((issue, idx) => (
                      <div 
                        key={idx}
                        className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 ${
                          issue.type === 'error'
                            ? 'bg-red-50/70 dark:bg-red-950/40 border-red-200 dark:border-red-900/50 text-red-900 dark:text-red-200'
                            : issue.type === 'warning'
                            ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'
                            : 'bg-sky-50/70 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900/50 text-sky-900 dark:text-sky-200'
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5">
                          {issue.type === 'error' && <span className="w-2 h-2 rounded-full bg-red-500" />}
                          {issue.type === 'warning' && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                          {issue.type === 'tip' && <span className="w-2 h-2 rounded-full bg-sky-500" />}
                          <span>{issue.title}</span>
                        </div>
                        <p>{issue.description}</p>
                        {issue.lineSnippet && (
                          <div className="font-mono text-[11px] bg-white/70 dark:bg-black/40 px-2 py-0.5 rounded border border-black/5 dark:border-white/10 inline-block mt-1">
                            คำที่พบ: "{issue.lineSnippet}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Strengths Card */}
              {reviewResult.strengths.length > 0 && (
                <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>จุดเด่นของบทที่คุณเขียน</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-emerald-900 dark:text-emerald-200">
                    {reviewResult.strengths.map((str, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3 transition-colors">
              <div className="w-12 h-12 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-800 dark:text-slate-100">พร้อมรับผลการตรวจทานบท</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                คลิกปุ่ม "วิเคราะห์บทสคริปต์ทันที" เพื่อรับคะแนนความถูกต้อง คำแนะนำเรื่องฟอร์แมต และตรวจสอบ Subtext
              </p>
              <button
                onClick={handleAnalyzeScript}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                เริ่มตรวจทานเดี๋ยวนี้
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
