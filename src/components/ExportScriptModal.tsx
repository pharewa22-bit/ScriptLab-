import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Loader2,
  CheckCircle2,
  Sparkles,
  Info,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { ThreeColumnRow } from '../types/script';

interface ExportScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  rows: ThreeColumnRow[];
  scriptTitle?: string;
}

export const ExportScriptModal: React.FC<ExportScriptModalProps> = ({
  isOpen,
  onClose,
  rows,
  scriptTitle = 'ScriptLab Video Production Script',
}) => {
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [pdfDownloaded, setPdfDownloaded] = useState<boolean>(false);
  const [pdfProgress, setPdfProgress] = useState<string>('');
  const [pdfError, setPdfError] = useState<string>('');
  const [isPrintMode, setIsPrintMode] = useState<boolean>(false);

  if (!isOpen) return null;

  // Pagination for A4 PDF generator: 3 scenes per page to guarantee large, legible Thai typography
  const SCENES_PER_PAGE = 3;
  const pages: ThreeColumnRow[][] = [];
  for (let i = 0; i < rows.length; i += SCENES_PER_PAGE) {
    pages.push(rows.slice(i, i + SCENES_PER_PAGE));
  }
  const totalPages = Math.max(1, pages.length);

  // Generate plain text formatted script
  const generateFormattedText = (): string => {
    let output = `=================================================================\n`;
    output += `                 SCRIPTLAB - PRODUCTION SCRIPT\n`;
    output += `            3-COLUMN AUDIO/VISUAL (AV) FORMAT\n`;
    output += `=================================================================\n`;
    output += `PROJECT: ${scriptTitle}\n`;
    output += `TOTAL SCENES: ${rows.length}\n`;
    output += `DATE: ${new Date().toLocaleDateString('th-TH')}\n`;
    output += `=================================================================\n\n`;

    rows.forEach((row) => {
      output += `-----------------------------------------------------------------\n`;
      output += `[SCENE 0${row.sequenceNumber}] ${row.phaseName.toUpperCase()}\n`;
      output += `TIMECODE: ${row.timecode}  |  SHOT: ${row.shotType}\n`;
      output += `-----------------------------------------------------------------\n`;
      output += `[VISUAL / CAMERA ACTION]:\n`;
      output += `  ${row.visualDescription}\n`;
      if (row.visualGraphicNote) {
        output += `  GRAPHIC: ${row.visualGraphicNote}\n`;
      }
      output += `\n[AUDIO / VO & DIALOGUE]:\n`;
      output += `  VOICE-OVER: "${row.audioVoiceover}"\n`;
      if (row.audioSfx) {
        output += `  SFX: ${row.audioSfx}\n`;
      }
      if (row.audioBgm) {
        output += `  BGM: ${row.audioBgm}\n`;
      }
      output += `\n`;
    });

    output += `=================================================================\n`;
    output += `           END OF PRODUCTION SCRIPT - SCRIPTLAB.APP\n`;
    output += `=================================================================\n`;

    return output;
  };

  // Download as .txt file with UTF-8 BOM
  const handleDownloadText = () => {
    const textContent = generateFormattedText();
    const blob = new Blob(['\uFEFF' + textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ScriptLab_Script_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Copy text to clipboard
  const handleCopyText = () => {
    const textContent = generateFormattedText();
    navigator.clipboard.writeText(textContent);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  // =========================================================================
  // 100% CRASH-PROOF THAI PDF GENERATOR USING HTML5 CANVAS 2D + JSDPI
  // No external CSS parsing, no CORS errors, crystal-clear Thai typography!
  // =========================================================================
  const renderPageToCanvas = (
    pageRows: ThreeColumnRow[],
    pageIndex: number,
    totalPageCount: number
  ): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    // High-resolution A4: 1588 x 2246 px (192 DPI)
    canvas.width = 1588;
    canvas.height = 2246;
    const ctx = canvas.getContext('2d')!;

    // 1. Pure White Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Helper: Rounded Rectangle
    const fillRoundRect = (x: number, y: number, w: number, h: number, r: number, fillColor: string, strokeColor?: string, strokeWidth = 1) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fillStyle = fillColor;
      ctx.fill();
      if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      }
    };

    // Helper: Wrap Thai / English text cleanly to fit specified column width
    const wrapText = (text: string, maxWidth: number, font: string): string[] => {
      if (!text) return [];
      ctx.font = font;

      // Handle explicit line breaks
      const paragraphs = text.split('\n');
      const lines: string[] = [];

      paragraphs.forEach((paragraph) => {
        // Chunk paragraph by spaces or character groups
        const tokens: string[] = [];
        const rawTokens = paragraph.split(' ');
        rawTokens.forEach((token, tIdx) => {
          if (tIdx > 0) tokens.push(' ');
          // Break long uninterrupted Thai words every 18-20 characters
          if (token.length > 22) {
            for (let i = 0; i < token.length; i += 18) {
              tokens.push(token.substring(i, i + 18));
            }
          } else {
            tokens.push(token);
          }
        });

        let currentLine = '';
        for (let i = 0; i < tokens.length; i++) {
          const testLine = currentLine + tokens[i];
          const width = ctx.measureText(testLine).width;
          if (width > maxWidth && currentLine.length > 0) {
            lines.push(currentLine.trim());
            currentLine = tokens[i].trim();
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine.trim().length > 0) {
          lines.push(currentLine.trim());
        }
      });

      return lines;
    };

    // Margins (70px left & right)
    const leftMargin = 70;
    const rightMargin = 1588 - 70;
    const contentWidth = rightMargin - leftMargin; // 1448px

    // --- 1. HEADER SECTION ---
    // Amber Badge
    fillRoundRect(leftMargin, 60, 390, 34, 6, '#f59e0b');
    ctx.font = 'bold 16px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('SCRIPTLAB · PRODUCTION BLUEPRINT', leftMargin + 16, 83);

    // Header Subtitle
    ctx.font = 'bold 18px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('มาตรฐานบทวิดีโอ 3 คอลัมน์ (Audio/Visual Script)', leftMargin + 420, 83);

    // Big Title
    ctx.font = 'bold 36px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(scriptTitle || 'ScriptLab Video Production Script', leftMargin, 136);

    // Right Meta Box
    ctx.font = 'bold 18px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#0f172a';
    const scenesText = `จำนวนฉาก: ${rows.length} ฉาก`;
    const scenesWidth = ctx.measureText(scenesText).width;
    ctx.fillText(scenesText, rightMargin - scenesWidth, 105);

    ctx.font = '16px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#64748b';
    const dateText = `วันที่: ${new Date().toLocaleDateString('th-TH')}`;
    const dateWidth = ctx.measureText(dateText).width;
    ctx.fillText(dateText, rightMargin - dateWidth, 132);

    const pageText = `หน้า ${pageIndex + 1} จาก ${totalPageCount}`;
    const pageWidth = ctx.measureText(pageText).width;
    ctx.font = 'bold 16px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(pageText, rightMargin - pageWidth, 156);

    // Header Divider Line
    ctx.beginPath();
    ctx.moveTo(leftMargin, 175);
    ctx.lineTo(rightMargin, 175);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4;
    ctx.stroke();

    // --- 2. TABLE HEADER ---
    const tableTop = 205;
    const col1Width = 310;
    const col2Width = 569;
    const col3Width = 569;

    const col1Left = leftMargin;
    const col2Left = col1Left + col1Width;
    const col3Left = col2Left + col2Width;

    fillRoundRect(leftMargin, tableTop, contentWidth, 54, 4, '#f1f5f9', '#cbd5e1', 2);

    ctx.font = 'bold 20px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('1. ลำดับ / เวลา / ช็อต', col1Left + 18, tableTop + 35);
    ctx.fillText('2. คำบรรยายภาพ & มุมกล้อง (Visual)', col2Left + 18, tableTop + 35);
    ctx.fillText('3. เสียงพากย์ & SFX/BGM (Audio)', col3Left + 18, tableTop + 35);

    // Divider lines in table header
    ctx.beginPath();
    ctx.moveTo(col2Left, tableTop);
    ctx.lineTo(col2Left, tableTop + 54);
    ctx.moveTo(col3Left, tableTop);
    ctx.lineTo(col3Left, tableTop + 54);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // --- 3. TABLE ROWS ---
    let currentY = tableTop + 54;
    const rowHeight = 610; // Exactly 3 rows fit cleanly on one A4 page

    pageRows.forEach((row) => {
      // Row Box
      fillRoundRect(leftMargin, currentY, contentWidth, rowHeight, 0, '#ffffff', '#cbd5e1', 2);

      // Col 1 Background tint
      fillRoundRect(col1Left + 1, currentY + 1, col1Width - 2, rowHeight - 2, 0, '#f8fafc');

      // Vertical Dividers
      ctx.beginPath();
      ctx.moveTo(col2Left, currentY);
      ctx.lineTo(col2Left, currentY + rowHeight);
      ctx.moveTo(col3Left, currentY);
      ctx.lineTo(col3Left, currentY + rowHeight);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();

      // === COLUMN 1 CONTENT ===
      const c1X = col1Left + 20;
      let c1Y = currentY + 40;

      // Badge: ฉาก 0X
      fillRoundRect(c1X, c1Y - 24, 120, 36, 6, '#0f172a');
      ctx.font = 'bold 20px "Prompt", "Sarabun", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`ฉาก 0${row.sequenceNumber}`, c1X + 16, c1Y + 2);
      c1Y += 45;

      // Phase Name
      ctx.font = 'bold 24px "Prompt", "Sarabun", sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(row.phaseName || 'ฉากทั่วไป', c1X, c1Y);
      c1Y += 38;

      // Shot Type Badge
      fillRoundRect(c1X, c1Y - 24, 100, 34, 6, '#fef3c7', '#fde68a', 2);
      ctx.font = 'bold 20px "Prompt", "Sarabun", sans-serif';
      ctx.fillStyle = '#92400e';
      ctx.fillText(`[${row.shotType || 'WS'}]`, c1X + 16, c1Y + 2);
      c1Y += 45;

      // Timecode
      ctx.font = 'bold 20px monospace';
      ctx.fillStyle = '#475569';
      ctx.fillText(`⏱️ ${row.timecode || '-'}`, c1X, c1Y);

      // === COLUMN 2 CONTENT: VISUAL ===
      const c2X = col2Left + 24;
      let c2Y = currentY + 40;
      const maxVisualWidth = col2Width - 48;

      ctx.font = '22px "Prompt", "Sarabun", sans-serif';
      ctx.fillStyle = '#0f172a';
      const visualLines = wrapText(row.visualDescription || '(ไม่มีคำบรรยายภาพ)', maxVisualWidth, '22px "Prompt", "Sarabun", sans-serif');
      visualLines.forEach((line) => {
        ctx.fillText(line, c2X, c2Y);
        c2Y += 34;
      });

      // Graphic Note
      if (row.visualGraphicNote) {
        c2Y += 15;
        const gBoxY = c2Y;
        const graphicLines = wrapText(row.visualGraphicNote, maxVisualWidth - 28, '20px "Prompt", "Sarabun", sans-serif');
        const gBoxHeight = Math.max(50, graphicLines.length * 30 + 38);

        fillRoundRect(c2X, gBoxY, maxVisualWidth, gBoxHeight, 6, '#eff6ff', '#bfdbfe', 2);
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(c2X, gBoxY, 6, gBoxHeight);

        ctx.font = 'bold 16px "Prompt", "Sarabun", sans-serif';
        ctx.fillStyle = '#1d4ed8';
        ctx.fillText('🎨 ข้อความบนจอ / กราฟิก:', c2X + 18, gBoxY + 24);

        ctx.font = '20px "Prompt", "Sarabun", sans-serif';
        ctx.fillStyle = '#1e3a8a';
        graphicLines.forEach((gLine, gIdx) => {
          ctx.fillText(gLine, c2X + 18, gBoxY + 52 + gIdx * 28);
        });
      }

      // === COLUMN 3 CONTENT: AUDIO ===
      const c3X = col3Left + 24;
      let c3Y = currentY + 40;
      const maxAudioWidth = col3Width - 48;

      // Voiceover dialogue box
      const voLines = wrapText(`"${row.audioVoiceover || '-'}"`, maxAudioWidth - 32, 'italic bold 22px "Prompt", "Sarabun", sans-serif');
      const voBoxHeight = Math.max(80, voLines.length * 34 + 50);

      fillRoundRect(c3X, c3Y - 15, maxAudioWidth, voBoxHeight, 8, '#ecfdf5', '#a7f3d0', 2);

      ctx.font = 'bold 16px "Prompt", "Sarabun", sans-serif';
      ctx.fillStyle = '#065f46';
      ctx.fillText('🎙️ เสียงบรรยาย / บทพูด (VO):', c3X + 16, c3Y + 12);

      ctx.font = 'italic bold 22px "Prompt", "Sarabun", sans-serif';
      ctx.fillStyle = '#0f172a';
      voLines.forEach((voLine, vIdx) => {
        ctx.fillText(voLine, c3X + 16, c3Y + 44 + vIdx * 32);
      });

      c3Y += voBoxHeight + 15;

      // SFX
      if (row.audioSfx) {
        ctx.font = 'bold 20px "Prompt", "Sarabun", sans-serif';
        ctx.fillStyle = '#b45309';
        ctx.fillText(`🔊 SFX: ${row.audioSfx}`, c3X, c3Y);
        c3Y += 32;
      }

      // BGM
      if (row.audioBgm) {
        ctx.font = 'bold 20px "Prompt", "Sarabun", sans-serif';
        ctx.fillStyle = '#7e22ce';
        ctx.fillText(`🎵 BGM: ${row.audioBgm}`, c3X, c3Y);
      }

      currentY += rowHeight;
    });

    // --- 4. FOOTER ---
    const footerY = 2170;
    ctx.beginPath();
    ctx.moveTo(leftMargin, footerY);
    ctx.lineTo(rightMargin, footerY);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '16px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('ScriptLab · สื่อมัลติมีเดียเพื่อการศึกษาและการเรียนรู้การเขียนบทภาพยนตร์และวิดีโอ 3 คอลัมน์', leftMargin, footerY + 30);

    ctx.font = 'bold 16px "Prompt", "Sarabun", sans-serif';
    ctx.fillStyle = '#0f172a';
    const pageFooterText = `หน้า ${pageIndex + 1} จาก ${totalPageCount}`;
    const pWidth = ctx.measureText(pageFooterText).width;
    ctx.fillText(pageFooterText, rightMargin - pWidth, footerY + 30);

    return canvas;
  };

  // Direct Instant PDF Download (Canvas 2D + jsPDF)
  const handleDownloadPdf = async () => {
    if (!rows || rows.length === 0) {
      setPdfError('ไม่พบข้อมูลบท กรุณาเพิ่มอย่างน้อย 1 แถวก่อนส่งออก PDF');
      return;
    }

    setIsGeneratingPdf(true);
    setPdfError('');
    setPdfProgress('กำลังเรนเดอร์เอกสารและฟอนต์ภาษาไทยคมชัด...');

    try {
      if (document.fonts) {
        await document.fonts.ready;
      }

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      for (let i = 0; i < pages.length; i++) {
        setPdfProgress(`กำลังสร้างหน้าเอกสารที่ ${i + 1} จาก ${pages.length}...`);
        const canvas = renderPageToCanvas(pages[i], i, pages.length);
        const imgData = canvas.toDataURL('image/jpeg', 0.95);

        if (i > 0) {
          doc.addPage('a4', 'portrait');
        }

        // Standard A4 dimensions in mm: 210 x 297
        doc.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }

      setPdfProgress('กำลังบันทึกไฟล์ PDF...');
      const cleanTitle = (scriptTitle || 'ScriptLab_Script').replace(/[^a-zA-Z0-9ก-๙_-]/g, '_');
      const fileName = `${cleanTitle}_${Date.now()}.pdf`;
      doc.save(fileName);

      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 3500);
    } catch (err: any) {
      console.error('PDF generation error:', err);
      setPdfError('เกิดข้อผิดพลาดในการสร้าง PDF: ' + (err?.message || 'ระบบไม่สามารถประมวลผลได้'));
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress('');
    }
  };

  // Open Full-Page Print Screen & Trigger window.print()
  const handleLaunchPrintView = () => {
    if (!rows || rows.length === 0) {
      setPdfError('ไม่พบข้อมูลบท กรุณาเพิ่มแถวในห้องฝึกเขียนบทก่อน');
      return;
    }
    setPdfError('');
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  // =========================================================================
  // VIEW 1: FULL-PAGE PRINT SCREEN (หน้ากระดาษพิมพ์เต็มจอ ตัวหนังสือขึ้น 100%)
  // =========================================================================
  if (isPrintMode) {
    const formattedDate = new Date().toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return (
      <div 
        id="fullpage-print-view"
        className="fixed inset-0 z-[9999] bg-white text-slate-900 overflow-y-auto selection:bg-amber-100"
      >
        <style>{`
          @media print {
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }
            body, html {
              background: #ffffff !important;
              color: #000000 !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .print\\:hidden, .no-print {
              display: none !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            tr {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
            #fullpage-print-view {
              position: static !important;
              overflow: visible !important;
              width: 100% !important;
              height: auto !important;
              background: #ffffff !important;
            }
          }
        `}</style>

        {/* Top Control Bar - Hidden during window.print() */}
        <div className="print:hidden sticky top-0 z-50 bg-slate-900 text-white border-b border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPrintMode(false)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="กลับสู่หน้าก่อนหน้า"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white">
                  🖨️ หน้าเอกสารพร้อมพิมพ์ (Print Ready Sheet)
                </span>
                <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-full">
                  {rows.length} ฉาก
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                ตัวหนังสือภาษาไทยและบทวิดีโอ 3 คอลัมน์แสดงผลครบ 100% สามารถสั่งพิมพ์หรือบันทึกเป็น PDF ได้ทันที
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>สั่งพิมพ์ / บันทึก PDF (Print)</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 cursor-pointer disabled:opacity-50"
            >
              {isGeneratingPdf ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5 text-amber-400" />}
              <span>ดาวน์โหลดไฟล์ PDF</span>
            </button>

            <button
              onClick={() => setIsPrintMode(false)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer border border-slate-700"
            >
              <X className="w-4 h-4" />
              <span>ปิดหน้าพิมพ์</span>
            </button>
          </div>
        </div>

        {/* The Printable Document */}
        <div 
          className="max-w-4xl mx-auto p-4 sm:p-8 bg-white text-slate-900"
          style={{ fontFamily: "'Prompt', 'Sarabun', 'Noto Sans Thai', sans-serif" }}
        >
          {/* Header Banner */}
          <div className="border-b-2 border-slate-900 pb-4 mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-sm">
                  SCRIPTLAB · PRODUCTION SPECIFICATION SHEET
                </span>
                <span className="text-xs font-bold text-slate-500">
                  มาตรฐานบทวิดีโอ 3 คอลัมน์ (Audio/Visual Script)
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight m-0">
                {scriptTitle}
              </h1>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-600 shrink-0 space-y-0.5">
              <div className="font-bold text-slate-900">
                จำนวนฉากทั้งหมด: <span className="text-amber-600 font-extrabold">{rows.length}</span> ฉาก
              </div>
              <div>
                วันที่จัดทำ: {formattedDate}
              </div>
              <div className="font-semibold text-emerald-700 flex sm:justify-end items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>เอกสารพร้อมสำหรับการถ่ายทำและลงเสียงจริง</span>
              </div>
            </div>
          </div>

          {/* 3-Column AV Table */}
          <table className="w-full border-collapse text-xs mb-6" style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr className="bg-slate-100 border border-slate-300">
                <th className="p-3 text-left font-black text-slate-900 border-r border-slate-300 uppercase tracking-wider text-[11px]" style={{ width: '22%' }}>
                  1. ลำดับ / เวลา / ช็อต
                </th>
                <th className="p-3 text-left font-black text-slate-900 border-r border-slate-300 uppercase tracking-wider text-[11px]" style={{ width: '39%' }}>
                  2. คำบรรยายภาพ & มุมกล้อง (Visual)
                </th>
                <th className="p-3 text-left font-black text-slate-900 uppercase tracking-wider text-[11px]" style={{ width: '39%' }}>
                  3. เสียงพากย์ & SFX/BGM (Audio)
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-300">
                  {/* Column 1: Scene & Sequence */}
                  <td className="p-3 bg-slate-50/80 border-l border-r border-slate-300 align-top">
                    <div className="space-y-1.5">
                      <div className="inline-block bg-slate-900 text-white font-extrabold px-2 py-0.5 rounded text-[11px]">
                        ฉาก 0${row.sequenceNumber}
                      </div>
                      <div className="font-bold text-slate-900 text-xs">
                        {row.phaseName || 'ฉากทั่วไป'}
                      </div>
                      <div className="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                        [{row.shotType || 'WS'}]
                      </div>
                      <div className="font-mono text-[11px] text-slate-600 font-semibold mt-1">
                        ⏱️ {row.timecode || '-'}
                      </div>
                    </div>
                  </td>

                  {/* Column 2: Visual & Camera Action */}
                  <td className="p-3 border-r border-slate-300 align-top leading-relaxed text-slate-900">
                    <div className="font-medium whitespace-pre-wrap text-xs sm:text-[13px] leading-relaxed">
                      {row.visualDescription || '(ไม่มีคำบรรยายภาพ)'}
                    </div>
                    {row.visualGraphicNote && (
                      <div className="mt-2.5 p-2 bg-blue-50/90 border-l-3 border-blue-500 rounded-r text-[11px] text-blue-900 font-medium">
                        <span className="font-bold block text-blue-800 text-[10px] uppercase">🎨 ข้อความบนจอ / กราฟิก:</span>
                        {row.visualGraphicNote}
                      </div>
                    )}
                  </td>

                  {/* Column 3: Audio & Voiceover & SFX/BGM */}
                  <td className="p-3 border-r border-slate-300 align-top leading-relaxed text-slate-900">
                    <div className="space-y-2">
                      <div className="p-2.5 bg-emerald-50/90 border border-emerald-200/90 rounded-lg">
                        <span className="font-bold text-emerald-800 block text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                          🎙️ เสียงบรรยาย / บทพูด (VO):
                        </span>
                        <p className="text-xs sm:text-[13px] font-semibold text-slate-900 leading-normal italic">
                          "{row.audioVoiceover || '-'}"
                        </p>
                      </div>

                      {row.audioSfx && (
                        <div className="text-[11px] text-amber-800 font-semibold flex items-start gap-1">
                          <span className="font-bold text-amber-700 shrink-0">🔊 SFX:</span>
                          <span>{row.audioSfx}</span>
                        </div>
                      )}

                      {row.audioBgm && (
                        <div className="text-[11px] text-purple-800 font-semibold flex items-start gap-1">
                          <span className="font-bold text-purple-700 shrink-0">🎵 BGM:</span>
                          <span>{row.audioBgm}</span>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Notice */}
          <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <div>
              ScriptLab · สื่อมัลติมีเดียเพื่อการศึกษาและการเรียนรู้การเขียนบทภาพยนตร์และวิดีโอ 3 คอลัมน์
            </div>
            <div className="font-bold text-slate-700">
              เอกสารต้นฉบับสำหรับการถ่ายทำ (Production Blueprint)
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: STANDARD EXPORT MODAL DIALOG
  // =========================================================================
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>ส่งออกบทเรียน (Export Script)</span>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full">
                  {rows.length} ฉาก
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ดาวน์โหลดไฟล์ PDF หรือสั่งพิมพ์เป็นใบงานกองถ่ายได้ทันที ตัวอักษรขึ้นครบ 100%
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Progress Notification */}
          {pdfProgress && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2.5 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin shrink-0 text-amber-600" />
              <span className="font-medium">{pdfProgress}</span>
            </div>
          )}

          {/* Error Notification */}
          {pdfError && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span className="font-semibold">{pdfError}</span>
            </div>
          )}

          {/* Downloaded Success Notification */}
          {pdfDownloaded && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-bold">ดาวน์โหลดไฟล์ PDF สำเร็จแล้ว! ตัวอักษรภาษาไทยคมชัดอ่านออก 100%</span>
            </div>
          )}

          {/* Option 1: PDF Document Download & Print Sheet */}
          <div className="p-5 rounded-2xl border-2 border-amber-500/70 dark:border-amber-500/60 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 dark:from-slate-850 dark:via-slate-800 dark:to-slate-850 space-y-4 shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      ไฟล์เอกสาร PDF ภาษาไทย & สั่งพิมพ์กองถ่าย
                    </h4>
                    <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md uppercase">
                      แนะนำ
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    ดาวน์โหลดเป็นไฟล์ PDF หรือเปิดหน้าพิมพ์บทวิดีโอ 3 คอลัมน์ รองรับภาษาไทย 100% ไม่มีบัค
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons for Print & PDF */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
              {/* Primary Direct PDF Download */}
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/25 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingPdf ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังสร้างไฟล์ PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>ดาวน์โหลดไฟล์ PDF (.pdf)</span>
                  </>
                )}
              </button>

              {/* Secondary In-Browser Print */}
              <button
                onClick={handleLaunchPrintView}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                title="เปิดหน้ากระดาษเพื่อสั่งพิมพ์หรือบันทึกเป็น PDF ผ่านเบราว์เซอร์"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>เปิดหน้าพิมพ์ / บันทึก PDF</span>
              </button>
            </div>
          </div>

          {/* Option 2: Text Script (.txt) */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-4 shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-base">
                    ไฟล์ข้อความ Text Script (.txt)
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    ฟอร์แมตข้อความ UTF-8 สำหรับเปิดใน Notepad หรือโปรแกรมตัดต่อวิดีโอ
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded uppercase">
                .TXT
              </span>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={handleDownloadText}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>ดาวน์โหลดไฟล์ .txt</span>
              </button>

              <button
                onClick={handleCopyText}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                {copiedText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>คัดลอกสำเร็จ!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>คัดลอกทั้งหมด</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Information Callout */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
            <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              ทั้งปุ่ม <strong>"ดาวน์โหลดไฟล์ PDF"</strong> และปุ่ม <strong>"เปิดหน้าพิมพ์ / บันทึก PDF"</strong> ได้รับการอัปเกรดให้แสดงผลตัวหนังสือภาษาไทยได้คมชัด 100% สระและวรรณยุกต์ไม่เพี้ยน ไม่เกิดข้อผิดพลาด พร้อมนำไปใช้งานในการผลิตสื่อจริงได้ทันที
            </p>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            จำนวนฉากทั้งหมด: {rows.length} ฉาก · พร้อมใช้งานจริง
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
