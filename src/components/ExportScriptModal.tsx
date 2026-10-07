import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Sparkles, 
  Film,
  Layers,
  ArrowRight
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

  if (!isOpen) return null;

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
        output += `  ${row.audioSfx}\n`;
      }
      if (row.audioBgm) {
        output += `  ${row.audioBgm}\n`;
      }
      output += `\n`;
    });

    output += `=================================================================\n`;
    output += `           END OF PRODUCTION SCRIPT - SCRIPTLAB.APP\n`;
    output += `=================================================================\n`;

    return output;
  };

  // Download as .txt file
  const handleDownloadText = () => {
    const textContent = generateFormattedText();
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
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

  // Generate downloadable PDF using jsPDF
  const handleDownloadPdf = () => {
    try {
      setIsGeneratingPdf(true);
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Header Banner
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 30, 'F');

      doc.setTextColor(245, 158, 11); // amber-500
      doc.setFontSize(16);
      doc.text('SCRIPTLAB - 3-COLUMN AV SCRIPT', 14, 14);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text(`Project: Production Call Sheet  |  Total Scenes: ${rows.length}`, 14, 22);

      let yPos = 40;

      rows.forEach((row, index) => {
        // Page break check
        if (yPos > 245) {
          doc.addPage();
          yPos = 20;
        }

        // Scene Header Box
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(14, yPos - 5, 182, 9, 1.5, 1.5, 'F');

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(`SCENE 0${row.sequenceNumber}: ${row.phaseName.toUpperCase()} [${row.shotType}]`, 18, yPos + 1);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        doc.text(`Time: ${row.timecode}`, 155, yPos + 1);

        yPos += 10;

        // Visual description
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('VISUAL:', 18, yPos);
        doc.setFont('helvetica', 'normal');
        const visualLines = doc.splitTextToSize(row.visualDescription, 155);
        doc.text(visualLines, 38, yPos);
        yPos += Math.max(7, visualLines.length * 4.5);

        // Graphic if present
        if (row.visualGraphicNote) {
          doc.setTextColor(37, 99, 235);
          doc.setFontSize(8);
          doc.text(`GRAPHIC: ${row.visualGraphicNote}`, 38, yPos);
          yPos += 5;
        }

        // Audio description
        doc.setTextColor(15, 23, 42);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('AUDIO/VO:', 18, yPos);
        doc.setFont('helvetica', 'italic');
        const audioLines = doc.splitTextToSize(`"${row.audioVoiceover}"`, 155);
        doc.text(audioLines, 38, yPos);
        yPos += Math.max(7, audioLines.length * 4.5);

        // SFX & BGM line
        doc.setTextColor(100, 116, 139);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text(`${row.audioSfx}   |   ${row.audioBgm}`, 38, yPos);
        yPos += 8;

        // Divider
        doc.setDrawColor(226, 232, 240);
        doc.line(14, yPos - 2, 196, yPos - 2);
        yPos += 5;
      });

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text(`Generated by ScriptLab App  -  Page ${i} of ${totalPages}`, 14, 287);
      }

      doc.save(`ScriptLab_3Column_Script_${Date.now()}.pdf`);
      setPdfDownloaded(true);
      setTimeout(() => setPdfDownloaded(false), 2500);
    } catch (err) {
      console.error('PDF generation error:', err);
      alert('ไม่สามารถดาวน์โหลด PDF ผ่านตัวสร้างอัตโนมัติได้ สามารถใช้ปุ่ม "พิมพ์ / บันทึกเป็น PDF" แทนได้ครับ');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Printable HTML Window (Native Print-to-PDF with full Thai font support)
  const handlePrintToPdf = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('กรุณาอนุญาตป๊อปอัปในเบราว์เซอร์เพื่อเปิดหน้าต่างพิมพ์บท');
      return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>ScriptLab - Production Call Sheet</title>
  <link href="https://fonts.googleapis.com/css2?family=Courier+Prime&family=Prompt:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: 'Prompt', sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 13px; line-height: 1.5; }
    .header { border-bottom: 3px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
    .title { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0; }
    .meta { color: #64748b; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th { background: #f1f5f9; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; border: 1px solid #cbd5e1; }
    td { padding: 12px 10px; border: 1px solid #cbd5e1; vertical-align: top; }
    .scene-col { width: 18%; background: #f8fafc; font-weight: 600; }
    .visual-col { width: 42%; }
    .audio-col { width: 40%; font-family: 'Courier Prime', monospace; }
    .shot-badge { display: inline-block; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 11px; font-weight: 700; margin-bottom: 4px; }
    .graphic-note { color: #2563eb; font-size: 11px; margin-top: 6px; font-family: monospace; }
    .audio-sfx { color: #d97706; font-size: 11px; margin-top: 6px; font-family: monospace; }
    .audio-bgm { color: #7c3aed; font-size: 11px; margin-top: 2px; font-family: monospace; }
    .footer { margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 10px; font-size: 10px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="title">SCRIPTLAB · PRODUCTION SCRIPT</h1>
      <div class="meta">3-COLUMN AUDIO/VISUAL SPECIFICATION SHEET</div>
    </div>
    <div class="meta" style="text-align: right;">
      <div>จำนวนฉาก: ${rows.length} ฉาก</div>
      <div>วันที่: ${new Date().toLocaleDateString('th-TH')}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>1. ลำดับฉาก & เวลา</th>
        <th>2. คำบรรยายภาพ & มุมกล้อง</th>
        <th>3. เสียงพากย์ & SFX/BGM</th>
      </tr>
    </thead>
    <tbody>
      ${rows.map(r => `
        <tr>
          <td class="scene-col">
            <span class="shot-badge">[${r.shotType}] 0${r.sequenceNumber}</span>
            <div>${r.phaseName}</div>
            <div style="color: #64748b; font-size: 11px; font-family: monospace; margin-top: 4px;">⏱️ ${r.timecode}</div>
          </td>
          <td class="visual-col">
            <div>${r.visualDescription}</div>
            ${r.visualGraphicNote ? `<div class="graphic-note">${r.visualGraphicNote}</div>` : ''}
          </td>
          <td class="audio-col">
            <div style="font-weight: 700; font-size: 11px; color: #059669; margin-bottom: 4px;">VOICE-OVER:</div>
            <div style="font-size: 12px;">"${r.audioVoiceover}"</div>
            ${r.audioSfx ? `<div class="audio-sfx">${r.audioSfx}</div>` : ''}
            ${r.audioBgm ? `<div class="audio-bgm">${r.audioBgm}</div>` : ''}
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    พิมพ์เขียวบทวิดีโอจาก ScriptLab - พร้อมสำหรับการถ่ายทำและบันทึกเสียงจริง
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 500);
    };
  </script>
</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div 
        className="w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                ส่งออกบทเรียน (Export Script)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                ดาวน์โหลดไฟล์สำหรับนำไปถ่ายทำจริงและจัดทำสื่อโปรดักชัน
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Export Options Grid */}
        <div className="p-6 space-y-4">
          {/* Option 1: PDF Document */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/70 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    ไฟล์เอกสาร PDF (Production Sheet)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    เหมาะสำหรับพิมพ์เป็นใบสั่งงานตากล้องและใบลงเสียงนักพากย์
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded uppercase">
                .PDF
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Native Print / Save to PDF */}
              <button
                onClick={handlePrintToPdf}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>พิมพ์ / บันทึกเป็น PDF (Print Sheet)</span>
              </button>

              {/* Direct PDF Download via jsPDF */}
              <button
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{pdfDownloaded ? 'ดาวน์โหลดแล้ว!' : 'ดาวน์โหลด PDF'}</span>
              </button>
            </div>
          </div>

          {/* Option 2: Text Script (.txt) */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    ไฟล์ข้อความ Text Script (.txt)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    ข้อความจัดฟอร์แมตเรียบร้อย สำหรับเปิดใน Notepad หรือโปรแกรมตัดต่อ
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded uppercase">
                .TXT
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleDownloadText}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ดาวน์โหลดไฟล์ .txt</span>
              </button>

              <button
                onClick={handleCopyText}
                className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedText ? 'คัดลอกแล้ว!' : 'คัดลอกทั้งหมด'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
