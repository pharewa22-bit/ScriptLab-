import React, { useState } from 'react';
import { 
  BookMarked, 
  Mail, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Send, 
  User, 
  ShieldCheck, 
  Award, 
  FileText, 
  Columns3, 
  PenTool, 
  HelpCircle,
  MessageSquare,
  Building,
  Heart
} from 'lucide-react';
import { CREATOR_INFO, REFERENCES_LIST, ReferenceItem } from '../data/referencesData';
import { NavigationTab } from '../types/script';
import { audioEngine } from '../utils/audioPlayer';

interface ReferencesViewProps {
  onNavigateTab?: (tab: NavigationTab) => void;
}

export const ReferencesView: React.FC<ReferencesViewProps> = ({ onNavigateTab }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [inquiryName, setInquiryName] = useState<string>('');
  const [inquiryEmail, setInquiryEmail] = useState<string>('');
  const [inquirySubject, setInquirySubject] = useState<string>('สอบถามเรื่องการใช้งาน / ข้อเสนอแนะ ScriptLab');
  const [inquiryMessage, setInquiryMessage] = useState<string>('');
  const [inquirySubmitted, setInquirySubmitted] = useState<boolean>(false);
  const [inquiryError, setInquiryError] = useState<string>('');

  // Copy email to clipboard
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CREATOR_INFO.email);
    setCopiedEmail(true);
    audioEngine.playChime(750, 'sine', 0.2);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  // Submit quick inquiry message
  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryMessage.trim()) {
      setInquiryError('กรุณากรอกชื่อและข้อความที่ต้องการติดต่อให้ครบถ้วน');
      return;
    }

    setInquiryError('');
    setInquirySubmitted(true);
    audioEngine.playChime(880, 'triangle', 0.3);

    // Provide mailto link fallback with pre-filled content
    const mailtoUrl = `mailto:${CREATOR_INFO.email}?subject=${encodeURIComponent(inquirySubject)}&body=${encodeURIComponent(
      `ชื่อผู้ติดต่อ: ${inquiryName}\nอีเมลติดต่อกลับ: ${inquiryEmail || 'ไม่ระบุ'}\n\nข้อความ:\n${inquiryMessage}\n\n(ส่งผ่านฟอร์ม ScriptLab Web Application)`
    )}`;
    
    // Open email client
    window.location.href = mailtoUrl;
  };

  const filteredReferences = selectedCategory === 'all'
    ? REFERENCES_LIST
    : REFERENCES_LIST.filter(r => r.category === selectedCategory);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/70 px-2.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
              แหล่งอ้างอิงวิชาการ & ข้อมูลผู้จัดทำ
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-400">Bibliography & Developer Contact</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            แหล่งอ้างอิงผลงานและที่อยู่ติดต่อผู้พัฒนา
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            รวบรวมทฤษฎีบทภาพยนตร์คลาสสิก มาตรฐานอุตสาหกรรมวิดีโอ 3 คอลัมน์สากล 
            และข้อมูลสำหรับติดต่อผู้สร้างสรรค์แอปพลิเคชัน ScriptLab เพื่อการศึกษา
          </p>
        </div>

        {/* Quick Contact Badge */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <a
            href={`mailto:${CREATOR_INFO.email}`}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>ส่งอีเมลหาผู้พัฒนา</span>
          </a>

          <button
            onClick={handleCopyEmail}
            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{copiedEmail ? 'คัดลอกอีเมลแล้ว!' : 'คัดลอกอีเมล'}</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: ข้อมูลผู้จัดทำและที่อยู่ติดต่อ (Developer & Contact Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Creator Info Card (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20 font-bold text-lg shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                  {CREATOR_INFO.developerName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {CREATOR_INFO.role}
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full shrink-0">
              Verified Creator
            </span>
          </div>

          {/* Contact Details Grid */}
          <div className="space-y-4 text-xs sm:text-sm">
            {/* Primary Email (Highlighted as requested) */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  อีเมลติดต่อผู้ทำแอพ (Official Contact Email)
                </span>
                <div className="font-mono text-base font-bold text-slate-900 dark:text-white select-all">
                  {CREATOR_INFO.email}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 border border-amber-300/60 dark:border-slate-600 transition-colors cursor-pointer"
                  title="คัดลอกที่อยู่อีเมล"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedEmail ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
                </button>
                <a
                  href={`mailto:${CREATOR_INFO.email}`}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ส่งเมล</span>
                </a>
              </div>
            </div>

            {/* Organization / Project Affiliation */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                สังกัดโครงการและหน่วยงาน (Affiliation & Initiative)
              </span>
              <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                {CREATOR_INFO.organization}
              </p>
            </div>

            {/* Project Goal */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                เป้าหมายและเจตนารมณ์การพัฒนา (Project Mission)
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
                {CREATOR_INFO.projectGoal}
              </p>
            </div>

            {/* Licensing and Education Notice */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>{CREATOR_INFO.license}</span>
              </span>
              <span className="font-mono text-[11px]">{CREATOR_INFO.version}</span>
            </div>
          </div>
        </div>

        {/* Quick Message Form (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-xs flex flex-col justify-between transition-colors">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="w-8 h-8 rounded-xl bg-orange-100 dark:bg-orange-950/70 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  ฟอร์มส่งข้อความติดต่อด่วน
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ส่งข้อความตรงถึง {CREATOR_INFO.email}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitInquiry} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  ชื่อผู้ติดต่อ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={inquiryName}
                  onChange={(e) => setInquiryName(e.target.value)}
                  placeholder="เช่น สมชาย ใจดี / ครูผู้สอน / นักศึกษา"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  อีเมลของคุณสำหรับติดต่อกลับ
                </label>
                <input
                  type="email"
                  value={inquiryEmail}
                  onChange={(e) => setInquiryEmail(e.target.value)}
                  placeholder="เช่น your-email@example.com"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  หัวข้อเรื่อง
                </label>
                <input
                  type="text"
                  value={inquirySubject}
                  onChange={(e) => setInquirySubject(e.target.value)}
                  placeholder="ระบุหัวข้อที่ต้องการติดต่อ"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  ข้อความ / ข้อเสนอแนะ / แจ้งข้อผิดพลาด <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  placeholder="พิมพ์ข้อความที่ต้องการสอบถามหรือเสนอแนะเพิ่มเติม..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500 resize-y"
                />
              </div>

              {inquiryError && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                  <span className="font-bold">⚠️</span>
                  <span>{inquiryError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-bold rounded-xl hover:bg-slate-800 dark:hover:bg-amber-400 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>ส่งข้อความไปยัง {CREATOR_INFO.email}</span>
              </button>
            </form>
          </div>

          {inquirySubmitted && (
            <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>ส่งข้อความสำเร็จ! ระบบได้เปิดโปรแกรมส่งเมลไปยัง {CREATOR_INFO.email} แล้ว</span>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: แหล่งอ้างอิงงานและมาตรฐานวิชาการ (Academic & Industry References) */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
              <BookMarked className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                รายการแหล่งอ้างอิงงานและมาตรฐานวิชาการ (Academic Bibliography)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                หลักสูตรและหนังสืออ้างอิงที่นำมาใช้สังเคราะห์เป็นเนื้อหาและเครื่องมือใน ScriptLab
              </p>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-700/80 rounded-xl text-xs overflow-x-auto shrink-0">
            {[
              { id: 'all', label: 'ทั้งหมด (6)' },
              { id: 'screenplay_theory', label: 'ทฤษฎีบทภาพยนตร์' },
              { id: 'industry_standard', label: 'มาตรฐานอุตสาหกรรม' },
              { id: 'digital_media', label: 'สื่อคลิปสั้นโซเชียล' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === tab.id
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* References Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReferences.map((ref, idx) => (
            <div
              key={ref.id}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-xs hover:shadow-md hover:border-amber-400 dark:hover:border-amber-500 transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/70 px-2.5 py-0.5 rounded-full uppercase">
                    {ref.categoryLabel}
                  </span>
                  <span className="font-mono text-xs text-slate-400 dark:text-slate-400">
                    {ref.year}
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {ref.title}
                  </h4>
                  <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                    โดย {ref.author}
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {ref.description}
                </p>

                {/* Key Contributions in ScriptLab */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-700 space-y-1.5 text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
                    💡 สิ่งที่นำมาประยุกต์ใช้ใน ScriptLab:
                  </span>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300 pl-1">
                    {ref.keyContributions.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Navigation Jump Button */}
              {onNavigateTab && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => {
                      if (ref.id === 'ref-5') onNavigateTab('three-column');
                      else if (ref.id === 'ref-4') onNavigateTab('studio');
                      else onNavigateTab('lessons');
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-700/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 text-slate-700 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>{ref.id === 'ref-5' ? 'ไปที่หน่วยเรียน 3 คอลัมน์' : ref.id === 'ref-4' ? 'ไปที่ห้องฝึกเขียนบท' : 'ไปที่บทเรียนหลัก'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Open Citation Standard Footer Notice */}
      <div className="p-6 rounded-3xl bg-slate-900 text-slate-200 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Award className="w-4 h-4" />
          <span>การอ้างอิงทางวิชาการและการคุ้มครองทรัพย์สินทางปัญญา (Academic Citation Policy)</span>
        </div>
        <p className="text-xs leading-relaxed text-slate-300">
          เนื้อหา การจัดหมวดหมู่ และบทเรียนใน ScriptLab ได้รับการพัฒนาขึ้นโดยอ้างอิงจากหลักเกณฑ์และทฤษฎีมาตรฐานของอุตสาหกรรมภาพยนตร์สากล
          (Writers Guild of America, BEA, และทฤษฎีของ Syd Field, Robert McKee, Blake Snyder) เพื่อประโยชน์สำหรับการเรียนรู้ การวิจัย และการสอนในห้องเรียนมัลติมีเดีย
          หากต้องการสอบถามข้อมูลลิขสิทธิ์หรือข้อเสนอแนะเพิ่มเติม กรุณาติดต่อผู้พัฒนาได้โดยตรงที่ <strong className="text-amber-400 font-mono underline select-all">{CREATOR_INFO.email}</strong>
        </p>
      </div>
    </div>
  );
};
