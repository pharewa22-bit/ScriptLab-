import React from 'react';
import { 
  BookOpen, 
  PenTool, 
  FileText, 
  CheckCircle2, 
  LayoutDashboard, 
  Flame, 
  Sparkles,
  Clapperboard,
  ChevronRight,
  GraduationCap,
  Columns3,
  BookMarked,
  Mail,
  X,
  Menu,
  PanelLeftClose
} from 'lucide-react';
import { NavigationTab } from '../types/script';
import { CREATOR_INFO } from '../data/referencesData';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  overallProgress: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  isDesktopOpen?: boolean;
  onToggleDesktop?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  overallProgress,
  isOpenMobile,
  onCloseMobile,
  isDesktopOpen = true,
  onToggleDesktop,
}) => {
  const menuItems: { id: NavigationTab; label: string; numberLabel: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'dashboard',
      label: 'ภาพรวม & แดชบอร์ด',
      numberLabel: 'หน้าหลัก',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'lessons',
      label: 'บทเรียนการเขียนบท',
      numberLabel: '1',
      icon: <BookOpen className="w-5 h-5" />,
      badge: '4 บทเรียน',
    },
    {
      id: 'three-column',
      label: 'บทวิดีโอ 3 คอลัมน์',
      numberLabel: '★',
      icon: <Columns3 className="w-5 h-5" />,
      badge: 'มัลติมีเดีย',
    },
    {
      id: 'studio',
      label: 'ห้องฝึกเขียนบท',
      numberLabel: '2',
      icon: <PenTool className="w-5 h-5" />,
      badge: 'Studio',
    },
    {
      id: 'library',
      label: 'คลังตัวอย่างบท',
      numberLabel: '3',
      icon: <FileText className="w-5 h-5" />,
      badge: '3 ตัวอย่าง',
    },
    {
      id: 'reviewer',
      label: 'ตรวจทานบท',
      numberLabel: '4',
      icon: <CheckCircle2 className="w-5 h-5" />,
      badge: 'Linter',
    },
    {
      id: 'references',
      label: 'แหล่งอ้างอิง & ติดต่อ',
      numberLabel: '5',
      icon: <BookMarked className="w-5 h-5" />,
      badge: 'อ้างอิง/ติดต่อ',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden cursor-pointer transition-opacity"
          onClick={onCloseMobile}
          aria-label="คลิกเพื่อปิดแถบเมนู"
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between
        transition-all duration-300 ease-in-out
        ${isDesktopOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full'}
        ${isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        {/* Brand Lockup + Close/Collapse Button */}
        <div>
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20 shrink-0">
                <Clapperboard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                  ScriptLab
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </span>
                <p className="text-[11px] text-slate-400 dark:text-slate-400 font-medium">Screenplay Learning Lab</p>
              </div>
            </div>

            {/* Close / Collapse Toggle Button right in the sidebar */}
            <button
              onClick={() => {
                if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                  onToggleDesktop?.();
                } else {
                  onCloseMobile();
                }
              }}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="ปิดแถบเมนู (Close Sidebar)"
              aria-label="ปิดแถบเมนู"
            >
              <X className="w-5 h-5 lg:hidden" />
              <PanelLeftClose className="w-5 h-5 hidden lg:block" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1.5" aria-label="เมนูหลัก">
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
              เมนูการเรียนรู้
            </div>
            {menuItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group text-left cursor-pointer
                    ${isActive 
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-200/70 dark:border-amber-800/60 shadow-xs' 
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-transparent'}
                  `}
                >
                  <div className="flex items-center gap-3 truncate">
                    <span className={`
                      flex items-center justify-center w-7 h-7 rounded-lg text-xs font-semibold transition-colors
                      ${isActive 
                        ? 'bg-amber-500 text-white shadow-xs' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'}
                    `}>
                      {item.numberLabel === 'หน้าหลัก' ? item.icon : item.numberLabel}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`
                      text-xs px-2 py-0.5 rounded-full font-medium shrink-0
                      ${isActive 
                        ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300' 
                        : item.id === 'three-column'
                        ? 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Learner Progress & Profile Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="p-3.5 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100">ผู้เรียนระดับ 2</h4>
                  <p className="text-[11px] text-slate-400">Junior Screenwriter</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-900/40">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                <span>5 วัน</span>
              </div>
            </div>

            {/* Overall progress bar */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-slate-500 dark:text-slate-400">ความคืบหน้ารวม</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100 tabular-nums">{overallProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/40 rounded-xl border border-amber-200/80 dark:border-amber-900/50 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-amber-900 dark:text-amber-300 flex items-center gap-1 text-[11px]">
                <Mail className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                ติดต่อผู้ทำแอพ
              </span>
              <button
                onClick={() => onSelectTab('references')}
                className="text-[10px] text-amber-700 dark:text-amber-400 font-bold hover:underline cursor-pointer"
              >
                ดูแหล่งอ้างอิง →
              </button>
            </div>
            <a 
              href={`mailto:${CREATOR_INFO.email}`} 
              className="text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 block truncate"
              title="ส่งอีเมลหาผู้พัฒนา"
            >
              {CREATOR_INFO.email}
            </a>
          </div>

          <div className="text-center text-[10px] text-slate-400 dark:text-slate-500">
            ScriptLab v1.3 · เพื่อการศึกษาและการเรียนรู้
          </div>
        </div>
      </aside>
    </>
  );
};
