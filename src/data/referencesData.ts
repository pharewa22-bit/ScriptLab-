export interface ReferenceItem {
  id: string;
  title: string;
  author: string;
  year: string;
  category: 'screenplay_theory' | 'industry_standard' | 'digital_media' | 'pedagogy';
  categoryLabel: string;
  description: string;
  keyContributions: string[];
  link?: string;
}

export interface CreatorContactInfo {
  developerName: string;
  role: string;
  email: string;
  organization: string;
  projectGoal: string;
  version: string;
  license: string;
}

export const CREATOR_INFO: CreatorContactInfo = {
  developerName: 'ผู้พัฒนาแอปพลิเคชัน ScriptLab',
  role: 'ผู้พัฒนาสื่อนวัตกรรมการเรียนรู้ดิจิทัล (Educational Technology & Media Developer)',
  email: 'pharewa22@gmail.com',
  organization: 'โครงการพัฒนานวัตกรรมสื่อการเรียนรู้มัลติมีเดีย ScriptLab (ScriptLab Interactive Multimedia Project)',
  projectGoal: 'ยกระดับทักษะการเล่าเรื่องและการเขียนบทภาพยนตร์และบทวิดีโอ 3 คอลัมน์ (ลำดับ/ภาพ/เสียง) สำหรับนักเรียน นักศึกษา และครีเอเตอร์ยุคใหม่',
  version: 'ScriptLab v1.3 (Interactive Education Edition)',
  license: 'เผยแพร่เพื่อการศึกษาและการวิจัย (Open Educational Resources - Non-Commercial)',
};

export const REFERENCES_LIST: ReferenceItem[] = [
  {
    id: 'ref-1',
    title: 'Screenplay: The Foundations of Screenwriting',
    author: 'Syd Field',
    year: '2005 (Revised Edition)',
    category: 'screenplay_theory',
    categoryLabel: 'ทฤษฎีบทภาพยนตร์คลาสสิก',
    description: 'คัมภีร์พื้นฐานของนักเขียนบทภาพยนตร์ทั่วโลก ผู้วางรากฐานทฤษฎีโครงสร้าง 3 องก์ (Three-Act Paradigm), การวางจุดเปลี่ยนเนื้อเรื่อง (Plot Points 1 & 2) และจุดเริ่มเรื่อง (Inciting Incident)',
    keyContributions: [
      'ทฤษฎีโครงสร้าง 3 องก์ สัดส่วน 1:2:1 (Setup, Confrontation, Resolution)',
      'หลักการ 1 หน้าบท เท่ากับเวลาฉายภาพยนตร์ 1 นาที (1 Page = 1 Minute)',
      'การสร้าง Character Arc และความต้องการหลักของตัวละคร (Dramatic Need)',
    ],
  },
  {
    id: 'ref-2',
    title: 'Story: Substance, Structure, Style and the Principles of Screenwriting',
    author: 'Robert McKee',
    year: '1997',
    category: 'screenplay_theory',
    categoryLabel: 'การสร้างเนื้อเรื่องและซับเท็กซ์',
    description: 'ผลงานระดับตำนานที่เจาะลึกจิตวิทยาการเล่าเรื่อง กลไกความขัดแย้ง 3 ระดับ และการซ่อนความหมายลึกซึ้งไว้ใต้บทสนทนา (Subtext)',
    keyContributions: [
      'มิติของความขัดแย้ง (Inner, Personal, Extra-personal Conflict)',
      'เทคนิคบทสนทนาที่มี Subtext: ตัวละครไม่พูดความจริงตรงๆ (No On-the-Nose Dialogue)',
      'การแบ่งจังหวะเนื้อเรื่องย่อยเป็น Beat, Scene, Sequence, Act และ Story',
    ],
  },
  {
    id: 'ref-3',
    title: 'Save the Cat! The Last Book on Screenwriting That You\'ll Ever Need',
    author: 'Blake Snyder',
    year: '2005',
    category: 'screenplay_theory',
    categoryLabel: 'จังหวะเวลาและ Beat Sheet',
    description: 'คู่มือการกำหนดจังหวะเนื้อเรื่องสมัยใหม่ 15 บีท (Blake Snyder Beat Sheet) และวิธีการเขียน Logline ดึงดูดสายตาภายในบรรทัดเดียว',
    keyContributions: [
      'The Blake Snyder Beat Sheet (BS2) แม่แบบ 15 สเต็ปของภาพยนตร์เชิงพาณิชย์',
      'เทคนิคการเปิดเรื่อง Cold Open และฉากภาพจำ (Opening Image vs Final Image)',
      'การเขียน Logline ที่มี Hook คมชัด สื่อทั้งตัวเอก ความขัดแย้ง และอารมณ์ขัน/ความตึงเครียด',
    ],
  },
  {
    id: 'ref-4',
    title: 'The Screenwriter\'s Bible: A Complete Guide to Writing, Formatting, and Selling Your Script',
    author: 'David Trottier',
    year: '2019 (7th Edition)',
    category: 'industry_standard',
    categoryLabel: 'มาตรฐานฟอร์แมตอุตสาหกรรม',
    description: 'มาตรฐานสากลเรื่องการจัดหน้าบทภาพยนตร์ด้วยฟอนต์ Courier 12pt, การตั้ง Scene Heading (INT./EXT.), Action Paragraphs และ Parentheticals',
    keyContributions: [
      'กฎการเขียน Scene Heading (Slugline): สถานที่ - ช่วงเวลาของวัน (DAY/NIGHT)',
      'การเขียน Action Paragraphs กระชับ ไม่เกิน 3-4 บรรทัด และใช้ Present Tense',
      'ข้อห้ามการใช้คำสั่งกล้องฟุ่มเฟือย (เช่น ห้ามเขียน "We see" หรือ "Camera pans")',
    ],
  },
  {
    id: 'ref-5',
    title: 'Audio-Visual (AV) Column Script Format Guidelines',
    author: 'Broadcast Education Association (BEA) & Writers Guild of America (WGA)',
    year: '2021',
    category: 'industry_standard',
    categoryLabel: 'มาตรฐานบทวิดีโอ 3 คอลัมน์',
    description: 'แนวปฏิบัติการเขียนบทวิดีโอแบบ 3 คอลัมน์สำหรับโทรทัศน์ สปอตโฆษณา และสารคดี เพื่อซิงก์ลำดับเวลา คำบรรยายภาพ และเสียงพากย์/SFX/BGM',
    keyContributions: [
      'โครงสร้าง 3 คอลัมน์: คอลัมน์ที่ 1 (ลำดับ/เวลา), คอลัมน์ที่ 2 (ภาพ/กราฟิก), คอลัมน์ที่ 3 (เสียง/คำพากย์)',
      'สัญลักษณ์ย่อขนาดภาพสากล: CU (Close-Up), MCU (Medium Close-Up), WS (Wide Shot), POV (Point of View)',
      'การกำกับเสียง: VO (Voice-Over), SFX (Sound Effects) และ BGM (Background Music)',
    ],
  },
  {
    id: 'ref-6',
    title: 'Short-Form Video Storytelling & Creative Production Handbook',
    author: 'Digital Content Creator Guild & Mobile Media Lab',
    year: '2023',
    category: 'digital_media',
    categoryLabel: 'การผลิตคลิปสั้นโซเชียลมีเดีย',
    description: 'ทฤษฎีและแนวทางการเล่าเรื่องวิดีโอสั้นยุคใหม่ (TikTok, Instagram Reels, YouTube Shorts) อัตราส่วน 9:16 และกลยุทธ์ 3-Second Hook',
    keyContributions: [
      'กฎ 3 วินาทีแรก (Stop-the-Scroll Hook) เพื่อหยุดนิ้วโป้งคนดู',
      'การใช้อักษรพาดหัวลอยบนจอ (Text on Screen / Super) เพื่อรองรับผู้ชมที่ปิดเสียง',
      'โครงสร้างคลิปสั้น: Hook (0-3s) -> Problem/Story (3-10s) -> Value/Climax (10-13s) -> Call to Action (13-15s)',
    ],
  },
];
