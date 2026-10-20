import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Eye, 
  Loader2,
  CheckCircle2,
  Sparkles,
  Info,
  Layers,
  AlertCircle
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
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
  const [activeTab, setActiveTab] = useState<'export' | 'preview'>('export');
  
  // Dedicated ref for the offscreen rendering container (used by html2canvas)
  const pdfRenderRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Pagination: Split scenes into chunks of 3 scenes per A4 page to prevent overflow and ensure large, legible Thai typography
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

  // Download as .txt file with UTF-8 BOM for perfect Thai reading in any editor
  const handleDownloadText = () => {
    const textContent = generateFormattedText();
    // Add UTF-8 BOM so Notepad and Windows text editors correctly identify Thai encoding
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

  // High-Quality Thai PDF Generation using html2canvas & jsPDF
  const handleDownloadPdf = async () => {
    if (!rows || rows.length === 0) {
      setPdfError('ไม่พบข้อมูลบท กรุณาเพิ่มอย่างน้อย 1 แถวก่อนส่งออก PDF');
      return;
    }

    setIsGeneratingPdf(true);
    setPdfError('');
    setPdfProgress('กำลังเตรียมเรนเดอร์ภาษาไทยคมชัด...');

    try {
      // Ensure all web fonts are loaded
      if (document.fonts) {
        await document.fonts.ready;
      }

      // Small delay to ensure styles and DOM tree are settled
      await new Promise(resolve => setTimeout(resolve, 150));

      const container = pdfRenderRef.current;
      if (!container) {
        throw new Error('ไม่พบองค์ประกอบหน้าสำหรับเรนเดอร์ PDF');
      }

      const pageElements = container.querySelectorAll<HTMLElement>('.pdf-export-sheet');
      if (!pageElements || pageElements.length === 0) {
        throw new Error('ไม่พบหน้าเอกสารสำหรับแปลงเป็น PDF');
      }

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      for (let i = 0; i < pageElements.length; i++) {
        setPdfProgress(`กำลังแปลงหน้าที่ ${i + 1} จาก ${pageElements.length}...`);
        const pageEl = pageElements[i];

        // Capture with html2canvas at 2x scale for crisp Thai typography
        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
          width: 794,
          height: 1123,
          windowWidth: 794,
        });

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
      setPdfError('เกิดข้อผิดพลาดในการสร้าง PDF อัตโนมัติ: ' + (err?.message || 'ระบบไม่สามารถประมวลผลได้'));
    } finally {
      setIsGeneratingPdf(false);
      setPdfProgress('');
    }
  };

  // Generate complete HTML string for the native print dialog
  const generatePrintableHtml = (): string => {
    const formattedDate = new Date().toLocaleDateString('th-TH', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    const rowsHtml = rows.map((r) => `
      <tr style="page-break-inside: avoid; break-inside: avoid; border-bottom: 1px solid #cbd5e1;">
        <td style="width: 20%; padding: 10px; background-color: #f8fafc; border: 1px solid #cbd5e1; vertical-align: top;">
          <div style="display: inline-block; background: #0f172a; color: #ffffff; font-weight: 800; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-bottom: 4px;">
            ฉาก 0${r.sequenceNumber}
          </div>
          <div style="font-weight: 700; color: #0f172a; font-size: 12px; margin-bottom: 2px;">
            ${r.phaseName || 'ฉากทั่วไป'}
          </div>
          <div style="display: inline-block; background: #fef3c7; color: #92400e; font-weight: 700; font-size: 10px; padding: 1px 6px; border-radius: 4px; margin-bottom: 4px;">
            [${r.shotType || 'WS'}]
          </div>
          <div style="font-family: monospace; font-size: 11px; color: #475569; font-weight: 600;">
            ⏱️ ${r.timecode || '-'}
          </div>
        </td>

        <td style="width: 40%; padding: 10px; border: 1px solid #cbd5e1; vertical-align: top; line-height: 1.5; color: #0f172a;">
          <div style="font-size: 12px; font-weight: 500; white-space: pre-wrap;">
            ${r.visualDescription || '(ไม่มีคำบรรยายภาพ)'}
          </div>
          ${r.visualGraphicNote ? `
            <div style="margin-top: 8px; padding: 6px 8px; background: #eff6ff; border-left: 3px solid #3b82f6; border-radius: 0 4px 4px 0; font-size: 11px; color: #1e40af;">
              <strong style="display: block; font-size: 10px; text-transform: uppercase;">🎨 ข้อความบนจอ / กราฟิก:</strong>
              ${r.visualGraphicNote}
            </div>
          ` : ''}
        </td>

        <td style="width: 40%; padding: 10px; border: 1px solid #cbd5e1; vertical-align: top; line-height: 1.5; color: #0f172a;">
          <div style="padding: 8px 10px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; margin-bottom: 6px;">
            <div style="font-weight: 700; font-size: 10px; color: #065f46; text-transform: uppercase; margin-bottom: 3px;">
              🎙️ เสียงบรรยาย / บทพูด (VO):
            </div>
            <div style="font-size: 12px; font-weight: 600; color: #0f172a; font-style: italic;">
              "${r.audioVoiceover || '-'}"
            </div>
          </div>
          ${r.audioSfx ? `
            <div style="font-size: 11px; color: #b45309; font-weight: 600; margin-top: 4px;">
              🔊 SFX: ${r.audioSfx}
            </div>
          ` : ''}
          ${r.audioBgm ? `
            <div style="font-size: 11px; color: #7e22ce; font-weight: 600; margin-top: 2px;">
              🎵 BGM: ${r.audioBgm}
            </div>
          ` : ''}
        </td>
      </tr>
    `).join('');

    return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <title>${scriptTitle} - ScriptLab Production Script</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 10px;
      font-family: 'Prompt', 'Sarabun', 'Noto Sans Thai', sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 12px;
      line-height: 1.5;
    }
    .header-box {
      border-bottom: 2px solid #0f172a;
      padding-bottom: 12px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .badge {
      display: inline-block;
      background: #f59e0b;
      color: #ffffff;
      font-size: 9px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      margin: 0;
    }
    .subtitle {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }
    .meta-box {
      text-align: right;
      font-size: 11px;
      color: #475569;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }
    th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-size: 11px;
      font-weight: 800;
      padding: 8px 10px;
      text-align: left;
      border: 1px solid #cbd5e1;
    }
    .footer {
      margin-top: 20px;
      border-top: 1px solid #cbd5e1;
      padding-top: 8px;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="header-box">
    <div>
      <div class="badge">SCRIPTLAB · PRODUCTION SPECIFICATION SHEET</div>
      <h1 class="title">${scriptTitle}</h1>
      <div class="subtitle">โครงสร้างบทวิดีโอ 3 คอลัมน์มาตรฐานสากล (Audio/Visual Script)</div>
    </div>
    <div class="meta-box">
      <div><strong>จำนวนฉาก:</strong> ${rows.length} ฉาก</div>
      <div><strong>วันที่:</strong> ${formattedDate}</div>
      <div style="color: #059669; font-weight: 700; margin-top: 2px;">✓ พร้อมสำหรับการถ่ายทำจริง</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 20%;">1. ลำดับ / เวลา / ช็อต</th>
        <th style="width: 40%;">2. คำบรรยายภาพ & มุมกล้อง (Visual)</th>
        <th style="width: 40%;">3. เสียงพากย์ & SFX/BGM (Audio)</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="footer">
    <div>ScriptLab · สื่อมัลติมีเดียเพื่อการศึกษาและการเรียนรู้การเขียนบทภาพยนตร์และวิดีโอ</div>
    <div>พิมพ์เมื่อ: ${formattedDate}</div>
  </div>
</body>
</html>`;
  };

  // Robust Native Print: Uses a standalone isolated iframe to guarantee all content renders without popup blockers or app CSS collisions
  const handleNativePrint = () => {
    if (!rows || rows.length === 0) {
      setPdfError('ไม่พบข้อมูลบท กรุณาเพิ่มแถวในห้องฝึกเขียนบทก่อน');
      return;
    }

    setPdfProgress('กำลังเปิดหน้าต่างพิมพ์บท...');
    setPdfError('');

    try {
      let iframe = document.getElementById('scriptlab-print-frame') as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = 'scriptlab-print-frame';
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.style.border = '0';
        iframe.style.opacity = '0';
        iframe.style.pointerEvents = 'none';
        document.body.appendChild(iframe);
      }

      const frameDoc = iframe.contentWindow?.document;
      if (!frameDoc) {
        window.print();
        return;
      }

      const printHtml = generatePrintableHtml();

      frameDoc.open();
      frameDoc.write(printHtml);
      frameDoc.close();

      // Give browser time to load fonts & parse styles, then trigger print
      setTimeout(() => {
        setPdfProgress('');
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          // Fallback to window.print if iframe print restricted
          window.print();
        }
      }, 500);
    } catch (err: any) {
      console.error('Print error:', err);
      window.print();
    }
  };

  return (
    <>
      {/* Main Modal Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
        <div 
          className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]"
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
                  <span>ส่งออกบทเรียน (Export Production Script)</span>
                  <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full">
                    {rows.length} ฉากพร้อมส่งออก
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ดาวน์โหลดไฟล์ PDF ภาษาไทยคมชัดอ่านออก 100% หรือสั่งพิมพ์เป็นใบงานกองถ่ายได้ทันที
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

          {/* Modal Tab Switcher */}
          <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <button
              onClick={() => setActiveTab('export')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'export'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>ปุ่มดาวน์โหลดและสั่งพิมพ์</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`pb-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors border-b-2 cursor-pointer ${
                activeTab === 'preview'
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>ดูตัวอย่างหน้ากระดาษ PDF ({totalPages} หน้า A4)</span>
            </button>
          </div>

          {/* Scrollable Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
            {/* TAB 1: Export Options */}
            {activeTab === 'export' && (
              <div className="space-y-4">
                {/* PDF Status / Progress Notification */}
                {pdfProgress && (
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2.5 animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0 text-amber-600" />
                    <span className="font-medium">{pdfProgress}</span>
                  </div>
                )}

                {/* PDF Error Notification */}
                {pdfError && (
                  <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                    <span className="font-semibold">{pdfError}</span>
                  </div>
                )}

                {/* PDF Downloaded Success */}
                {pdfDownloaded && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-bold">ดาวน์โหลดไฟล์ PDF สำเร็จแล้ว! ตัวอักษรภาษาไทยคมชัดอ่านออก 100%</span>
                  </div>
                )}

                {/* Option 1: PDF Document (Primary Option) */}
                <div className="p-5 rounded-2xl border-2 border-amber-400/70 dark:border-amber-500/60 bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 dark:from-slate-850 dark:via-slate-800 dark:to-slate-850 space-y-4 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">
                            ไฟล์เอกสาร PDF & สั่งพิมพ์ (Production Call Sheet)
                          </h4>
                          <span className="text-[10px] font-extrabold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/80 px-2 py-0.5 rounded-md uppercase">
                            ภาษาไทย 100%
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          จัดรูปแบบ A4 มาตรฐาน 3 คอลัมน์ (ลำดับ / ภาพ / เสียง) รองรับภาษาไทยสมบูรณ์แบบ
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Checklist */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-amber-200/60 dark:border-slate-700">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>ภาษาไทยอ่านออก 100%</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>ตัดแบ่งหน้า A4 อัตโนมัติ</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>พิมพ์ใบสั่งงานตากล้อง/เสียง</span>
                    </div>
                  </div>

                  {/* Action Buttons for PDF & Print */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                    {/* Primary Button: Download PDF File */}
                    <button
                      onClick={handleDownloadPdf}
                      disabled={isGeneratingPdf}
                      className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-amber-500/25 cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingPdf ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>กำลังสร้างไฟล์ PDF ภาษาไทย...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>ดาวน์โหลดไฟล์ PDF (.pdf)</span>
                        </>
                      )}
                    </button>

                    {/* Secondary Button: Native Browser Print to PDF */}
                    <button
                      onClick={handleNativePrint}
                      className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
                      title="เปิดหน้าต่างสั่งพิมพ์ของเบราว์เซอร์ เพื่อพิมพ์ลงกระดาษหรือบันทึกเป็น PDF"
                    >
                      <Printer className="w-4 h-4 text-amber-400" />
                      <span>พิมพ์ / บันทึกผ่านเบราว์เซอร์</span>
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
                          ไฟล์ข้อความและบทตัดต่อ Text Script (.txt)
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          ฟอร์แมตข้อความ UTF-8 สำหรับนำไปใช้ในโปรแกรมตัดต่อ (Premiere, Final Cut, CapCut) หรือ Notepad
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
                      <span>ดาวน์โหลดไฟล์ .txt (UTF-8)</span>
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
                    ระบบได้รับการปรับปรุงและแก้ไขปัญหาสั่งพิมพ์ว่างเปล่าเรียบร้อยแล้ว: ตอนนี้เมื่อกด <strong>"พิมพ์ / บันทึกผ่านเบราว์เซอร์"</strong> หน้าพิมพ์จะโหลดบทครบทุกฉากและตัวหนังสือภาษาไทยขึ้น 100% และเมื่อกด <strong>"ดาวน์โหลดไฟล์ PDF"</strong> ระบบจะบันทึกไฟล์ PDF ความละเอียดสูงให้อ่านออกทันที
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: Live Document Preview */}
            {activeTab === 'preview' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <Eye className="w-4 h-4 text-amber-500" />
                    <span>ตัวอย่างเอกสารจริงที่จะบันทึกเป็น PDF ({totalPages} หน้า A4)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDownloadPdf}
                      disabled={isGeneratingPdf}
                      className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ดาวน์โหลด PDF ตอนนี้</span>
                    </button>
                    <button
                      onClick={handleNativePrint}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      <span>สั่งพิมพ์</span>
                    </button>
                  </div>
                </div>

                {/* Visual Scrollable Container for Preview */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-x-auto p-4 bg-slate-100 dark:bg-slate-950 flex flex-col items-center gap-6">
                  {pages.map((pageRows, pageIdx) => (
                    <div 
                      key={pageIdx}
                      className="shadow-xl rounded-sm transform scale-90 sm:scale-100 origin-top transition-transform"
                    >
                      {/* Render Visual Preview using the exact same page component */}
                      <RenderPdfSheet 
                        rows={pageRows} 
                        pageNumber={pageIdx + 1} 
                        totalPages={totalPages} 
                        scriptTitle={scriptTitle}
                        totalScenesCount={rows.length}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              จำนวนฉากทั้งหมด: {rows.length} ฉาก · {totalPages} หน้า A4
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

      {/* Offscreen Render Container: Placed at z-index: -50 with full opacity so html2canvas captures 100% visible pixels without negative coordinate glitches */}
      <div 
        ref={pdfRenderRef}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: -50,
          pointerEvents: 'none',
          opacity: 1,
          width: '794px',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
        aria-hidden="true"
      >
        {pages.map((pageRows, pageIdx) => (
          <RenderPdfSheet 
            key={pageIdx}
            rows={pageRows} 
            pageNumber={pageIdx + 1} 
            totalPages={totalPages} 
            scriptTitle={scriptTitle}
            totalScenesCount={rows.length}
          />
        ))}
      </div>
    </>
  );
};

// Reusable A4 Sheet Renderer with 100% Readable Thai Typography
interface RenderPdfSheetProps {
  rows: ThreeColumnRow[];
  pageNumber: number;
  totalPages: number;
  scriptTitle: string;
  totalScenesCount: number;
}

const RenderPdfSheet: React.FC<RenderPdfSheetProps> = ({
  rows,
  pageNumber,
  totalPages,
  scriptTitle,
  totalScenesCount,
}) => {
  return (
    <div 
      className="pdf-export-sheet bg-white text-slate-900 border border-slate-300 box-border"
      style={{
        width: '794px',
        minHeight: '1123px',
        padding: '36px 40px',
        fontFamily: "'Prompt', 'Sarabun', 'Noto Sans Thai', 'Tahoma', sans-serif",
        color: '#0f172a',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Page Header */}
      <div className="border-b-2 border-slate-900 pb-3 mb-4 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-sm">
              SCRIPTLAB · PRODUCTION BLUEPRINT
            </span>
            <span className="text-[11px] font-bold text-slate-500">
              มาตรฐานบทวิดีโอ 3 คอลัมน์ (AV Format)
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-950 tracking-tight leading-tight m-0">
            {scriptTitle || 'ScriptLab Video Production Script'}
          </h1>
        </div>

        <div className="text-right text-xs text-slate-600 shrink-0">
          <div className="font-bold text-slate-900">
            จำนวนฉากทั้งหมด: <span className="text-amber-600">{totalScenesCount}</span> ฉาก
          </div>
          <div>
            วันที่จัดทำ: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
          </div>
          <div className="font-semibold text-slate-700 mt-0.5">
            หน้า {pageNumber} จาก {totalPages}
          </div>
        </div>
      </div>

      {/* 3-Column AV Table */}
      <table className="w-full border-collapse text-xs mb-4" style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr className="bg-slate-100 border border-slate-300">
            <th className="p-2.5 text-left font-bold text-slate-800 border-r border-slate-300 uppercase tracking-wider text-[11px]" style={{ width: '20%' }}>
              1. ลำดับ / เวลา / ช็อต
            </th>
            <th className="p-2.5 text-left font-bold text-slate-800 border-r border-slate-300 uppercase tracking-wider text-[11px]" style={{ width: '40%' }}>
              2. คำบรรยายภาพ & มุมกล้อง (Visual)
            </th>
            <th className="p-2.5 text-left font-bold text-slate-800 uppercase tracking-wider text-[11px]" style={{ width: '40%' }}>
              3. เสียงพากย์ & เพลง/SFX (Audio)
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-300">
              {/* Column 1: Scene & Sequence */}
              <td className="p-3 bg-slate-50/70 border-l border-r border-slate-300 align-top">
                <div className="space-y-1.5">
                  <div className="inline-block bg-slate-800 text-white font-extrabold px-2 py-0.5 rounded text-[11px]">
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
                <div className="font-medium whitespace-pre-wrap text-xs">
                  {row.visualDescription || '(ไม่มีคำบรรยายภาพ)'}
                </div>
                {row.visualGraphicNote && (
                  <div className="mt-2.5 p-2 bg-blue-50/80 border-l-2 border-blue-500 rounded-r text-[11px] text-blue-900 font-medium">
                    <span className="font-bold block text-blue-800 text-[10px] uppercase">🎨 ข้อความบนจอ / กราฟิก:</span>
                    {row.visualGraphicNote}
                  </div>
                )}
              </td>

              {/* Column 3: Audio & Voiceover & SFX/BGM */}
              <td className="p-3 border-r border-slate-300 align-top leading-relaxed text-slate-900">
                <div className="space-y-2">
                  <div className="p-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-lg">
                    <span className="font-bold text-emerald-800 block text-[10px] uppercase tracking-wider mb-1 flex items-center gap-1">
                      🎙️ เสียงบรรยาย / บทพูด (VO):
                    </span>
                    <p className="text-xs font-semibold text-slate-900 leading-normal italic">
                      "{row.audioVoiceover || '-'}"
                    </p>
                  </div>

                  {row.audioSfx && (
                    <div className="text-[11px] text-amber-800 font-medium flex items-start gap-1">
                      <span className="font-bold text-amber-700 shrink-0">🔊 SFX:</span>
                      <span>{row.audioSfx}</span>
                    </div>
                  )}

                  {row.audioBgm && (
                    <div className="text-[11px] text-purple-800 font-medium flex items-start gap-1">
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

      {/* Page Footer */}
      <div className="mt-auto pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
        <div>
          ScriptLab · สื่อมัลติมีเดียเพื่อการศึกษาและการเรียนรู้การเขียนบทภาพยนตร์และวิดีโอ
        </div>
        <div className="font-bold text-slate-700">
          หน้า {pageNumber} จาก {totalPages}
        </div>
      </div>
    </div>
  );
};
