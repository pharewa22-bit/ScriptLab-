import { FlipCardData, ThreeColumnQuizQuestion, ThreeColumnRow } from '../types/script';

export const THREE_COLUMN_FLIP_CARDS: FlipCardData[] = [
  {
    id: 'card-col-1',
    columnNumber: 1,
    title: 'คอลัมน์ที่ 1: ลำดับ & เวลา',
    titleEn: 'Sequence & Timecode',
    subtitle: 'โครงกระดูกและตัวกำหนดจังหวะ (Pacing)',
    iconName: 'Clock',
    accentColor: 'from-amber-500 to-orange-500',
    frontSummary: 'ระบุหมายเลขฉาก (Scene / Cut) และความยาวเวลา (Timecode) เช่น 0:00-0:05 น. เพื่อควบคุมจังหวะการตัดต่อ',
    frontKeyTakeaway: 'ควบคุมความยาวรวมของคลิปไม่ให้ยืดเยื้อ',
    backDetails: {
      definition: 'คอลัมน์แรกทำหน้าที่เป็น "มาตรวัดเวลา" ให้โปรดิวเซอร์ ตากล้อง และ Editor รู้ว่าแต่ละช็อตกินเวลากี่วินาทีในจอ',
      elements: [
        'ลำดับฉาก (Shot/Cut No.): เช่น Scene 01, Cut 02',
        'ช่วงเวลา (Time Range): เช่น 00:00 - 00:03 วินาที',
        'ระยะเวลาช็อต (Duration): เช่น 3 วินาที (3s)'
      ],
      standardCodes: [
        { code: '0:00-0:03', meaning: 'จังหวะ Hook หยุดนิ้วโป้งคนดู' },
        { code: '0:03-0:15', meaning: 'ช่วงปูปัญหา (Pain Point / Setup)' },
        { code: '0:15-0:25', meaning: 'ช่วงนำเสนอทางออก (Product / Climax)' },
        { code: '0:25-0:30', meaning: 'Call To Action (CTA สรุปปิดท้าย)' }
      ],
      proTip: 'สำหรับคลิปสั้น (Shorts/Reels) ช็อตหนึ่งไม่ควรเกิน 2-4 วินาที เพื่อรักษาความตื่นตัวของสายตาคนดู'
    }
  },
  {
    id: 'card-col-2',
    columnNumber: 2,
    title: 'คอลัมน์ที่ 2: ภาพ & มุมกล้อง',
    titleEn: 'Visual & Camera Action',
    subtitle: 'สิ่งที่สายตาของผู้ชมจะมองเห็นในจอ',
    iconName: 'Video',
    accentColor: 'from-blue-500 to-indigo-600',
    frontSummary: 'ระบุขนาดภาพ (CU, MCU, WS), การเคลื่อนที่ของกล้อง (Pan, Tilt, Zoom), การกระทำของตัวละคร และ Motion Graphic (ข้อความบนจอ)',
    frontKeyTakeaway: 'เขียนให้เห็นภาพชัดเจนโดยไม่ต้องใช้คำฟุ่มเฟือย',
    backDetails: {
      definition: 'เป็นคำสั่งภาพสำหรับตากล้อง ฝ่ายศิลป์ และ Graphic Designer เพื่อถ่ายทำหรือตัดต่อกราฟิกให้ตรงจุดประสงค์',
      elements: [
        'ขนาดภาพและมุมกล้อง (Shot Size & Angle)',
        'การกระทำของนักแสดงหรือวัตถุ (Subject Movement)',
        'กราฟิก ข้อความป๊อปอัป (Supers / Motion Graphics)'
      ],
      standardCodes: [
        { code: 'CU (Close-Up)', meaning: 'ภาพระยะใกล้ เน้นอารมณ์สีหน้าหรือจุดสำคัญ' },
        { code: 'MCU (Medium Close-Up)', meaning: 'ภาพระดับหน้าอกขึ้นไป เหมาะกับบทสัมภาษณ์' },
        { code: 'WS (Wide Shot)', meaning: 'ภาพมุมกว้าง เห็นสถานที่และสิ่งแวดล้อมโดยรวม' },
        { code: 'POV (Point of View)', meaning: 'มุมมองแทนสายตาของตัวละคร' },
        { code: 'SUPER / TEXT', meaning: 'ตัวหนังสือพาดหัวลอยบนหน้าจอ' }
      ],
      proTip: 'ระบุคำว่า [TEXT ON SCREEN] เสมอเมื่อต้องการให้ขึ้นตัวหนังสือ เพื่อให้ Editor แยกออกจากคำบรรยายฉาก'
    }
  },
  {
    id: 'card-col-3',
    columnNumber: 3,
    title: 'คอลัมน์ที่ 3: เสียง & บทพากย์',
    titleEn: 'Audio, VO & Sound Effects',
    subtitle: 'สิ่งที่หูของผู้ชมจะได้ยินตลอดวิดีโอ',
    iconName: 'Mic',
    accentColor: 'from-emerald-500 to-teal-600',
    frontSummary: 'บรรจุเสียงบทพากย์ (Voiceover / VO), เสียงพูดของนักแสดง (Sync Dialogue), ดนตรีประกอบ (BGM), และเสียงเอฟเฟกต์ (SFX)',
    frontKeyTakeaway: 'เสียงควบคุมอารมณ์ความรู้สึกได้มากกว่า 50% ของวิดีโอ',
    backDetails: {
      definition: 'พิมพ์เขียวสำหรับ Sound Engineer และนักพากย์เสียง เพื่อคัดเลือกดนตรีและบันทึกเสียงให้สอดคล้องกับภาพแบบเฟรมต่อเฟรม',
      elements: [
        'บทพากย์ / คำพูด (VO หรือ Dialogue)',
        'เสียงประกอบเฉพาะจุด (SFX เช่น เสียงคลิก เสียงระเบิด)',
        'ดนตรีบรรเลงพื้นหลัง (BGM พร้อมระบุอารมณ์เพลง)'
      ],
      standardCodes: [
        { code: 'VO (Voice-Over)', meaning: 'เสียงบรรยายที่ไม่ได้เห็นตัวคนพูดในฉาก' },
        { code: 'SFX (Sound Effects)', meaning: 'เสียงเอฟเฟกต์พิเศษสร้างมิติความสมจริง' },
        { code: 'BGM (Background Music)', meaning: 'ดนตรีประกอบที่เล่นคลอตามบรรยากาศ' },
        { code: 'SYNC', meaning: 'เสียงที่ดังตรงกับปากนักแสดงในกล้อง' }
      ],
      proTip: 'เขียนกำกับอารมณ์เสียงในวงเล็บ เช่น [VO: (เสียงตื่นเต้น เร่งเร้า)] เพื่อให้นักพากย์เข้าใจน้ำเสียงได้ทันที'
    }
  },
  {
    id: 'card-col-4',
    columnNumber: 4,
    title: 'พลังแห่งบท 3 คอลัมน์',
    titleEn: 'The 3-Column Power',
    subtitle: 'ทำไมผู้ผลิตวิดีโอมืออาชีพจึงเลือกใช้?',
    iconName: 'Sparkles',
    accentColor: 'from-purple-500 to-pink-600',
    frontSummary: 'แก้ปัญหา "ภาพกับเสียงไม่ตรงกัน" และช่วยให้ฝ่ายโปรดักชันทำงานขนานกันได้รวดเร็วกว่าบทภาพยนตร์หน้าเดียวถึง 3 เท่า',
    frontKeyTakeaway: 'เห็นความสัมพันธ์ระหว่างตากล้องและเสียงใน 1 บรรทัด',
    backDetails: {
      definition: 'ตาราง 3 คอลัมน์คือเครื่องมือสากลของสายงานวิดีโอโฆษณา, คอนเทนต์ YouTube/TikTok, สารคดี และวิดีโอองค์กร (Corporate Video)',
      elements: [
        'ลดการสื่อสารผิดพลาดระหว่างตากล้องกับคนตัดต่อ',
        'ตรวจจับ Dead Air หรือช่วงที่เสียงขาดหายได้ทันที',
        'คำนวณสปีดคำพูด (WPM: Words Per Minute) ได้แม่นยำ'
      ],
      standardCodes: [
        { code: 'โฆษณา 15-30s', meaning: 'นับความยาวเป๊ะระดับเสี้ยววินาที' },
        { code: 'คลิปรีวิวสินค้า', meaning: 'ตรงจุดระหว่างภาพโชว์ของกับเสียงชม' },
        { code: 'วิดีโอสื่อการสอน', meaning: 'ข้อความบนจอกับเสียงอธิบายสอดรับกัน' }
      ],
      proTip: 'เวลาอ่านบท ให้กวาดสายตาจากซ้ายไปขวาในแนวนอน เพื่อจินตนาการว่าในวินาทีนั้น ผู้ชมกำลังเห็นอะไรและได้ยินอะไรพร้อมกัน'
    }
  }
];

export const THREE_COLUMN_SAMPLE_SCRIPT: ThreeColumnRow[] = [
  {
    id: 'seq-1',
    sequenceNumber: 1,
    timecode: '0:00 - 0:04 (4s)',
    phaseName: 'ช่วงสะกดสายตา (The Hook)',
    shotType: 'CU',
    visualDescription: 'CU (ภาพโคลสอัปใกล้) จอสมาร์ตโฟนในห้องมืด หน้าปัดนาฬิกาดิจิทัลเปลี่ยนจาก 02:59 เป็น 03:00 น. แสงสีฟ้าสะท้อนในแววตาของนักเขียนรุ่นใหม่',
    visualGraphicNote: '[TEXT: ตีสามแล้ว... ไอเดียยังอยู่แค่ในหัว?]',
    audioVoiceover: 'คุณเคยสงสัยไหม... ทำไมภาพยนตร์บางเรื่อง เปลี่ยนชีวิตคนดูได้ในสองชั่วโมง?',
    audioSfx: 'SFX: เสียงนาฬิกาดิจิทัลกระพริบ "ติ๊ด... ติ๊ด..." ดังก้องห้องเงียบ',
    audioBgm: 'BGM: ดนตรีสังเคราะห์เสียงต่ำแบบ Mystery Synth ให้ความรู้สึกลึกลับ',
    voiceGenderHint: 'male'
  },
  {
    id: 'seq-2',
    sequenceNumber: 2,
    timecode: '0:04 - 0:11 (7s)',
    phaseName: 'ช่วงชี้ปัญหา (Pain Point)',
    shotType: 'MCU',
    visualDescription: 'MCU (ระดับอก) ชายหนุ่มนั่งมองหน้าจอคอมพิวเตอร์ที่ว่างเปล่า มือขยำกระดาษโน้ตทิ้งลงตะกร้าที่ล้นทะลัก แสดงสีหน้าสับสน',
    visualGraphicNote: '[TEXT: "มีไอเดีย" ไม่เท่ากับ "เขียนบทเป็น"]',
    audioVoiceover: 'ไม่ใช่เพราะพวกเขามีงบสร้างพันล้าน แต่เพราะเขามี "พิมพ์เขียว" ที่ถูกต้องตั้งแต่บรรทัดแรก',
    audioSfx: 'SFX: เสียงกระดาษถูกขยำ "กร๊อบ" และเสียงถอนหายใจแผ่วเบา',
    audioBgm: 'BGM: เมโลดี้เปียโนนุ่มนวลเริ่มแทรกเข้ามา ดึงอารมณ์ร่วม',
    voiceGenderHint: 'male'
  },
  {
    id: 'seq-3',
    sequenceNumber: 3,
    timecode: '0:11 - 0:22 (11s)',
    phaseName: 'ช่วงนำเสนอทางออก (The Solution)',
    shotType: 'WS',
    visualDescription: 'WS (ภาพมุมกว้าง) แสงแดดยามเช้าสาดส่องเข้ามา จอคอมพิวเตอร์เปิดหน้าเว็บ ScriptLab กราฟิกตาราง 3 คอลัมน์ ลอยสามมิติขึ้นมาเชื่อมต่อภาพและเสียงอย่างสวยงาม',
    visualGraphicNote: '[MOTION GRAPHIC: ScriptLab · ออกแบบบทเสมือนจริง]',
    audioVoiceover: 'ขอแนะนำ ScriptLab พื้นที่เรียนรู้ที่เชื่อมโยงจินตนาการ ลำดับภาพ และเสียงพากย์ ให้คุณเห็นวิดีโอทั้งเรื่องก่อนเริ่มถ่ายทำจริง!',
    audioSfx: 'SFX: เสียง Swoosh พลังบวก และเสียงคีย์บอร์ดพิมพ์คล่องแคล่ว',
    audioBgm: 'BGM: ดนตรีจังหวะ Upbeat Electronic มีพลัง สนุกสนาน',
    voiceGenderHint: 'female'
  },
  {
    id: 'seq-4',
    sequenceNumber: 4,
    timecode: '0:22 - 0:30 (8s)',
    phaseName: 'ช่วงกระตุ้นการกระทำ (Call To Action)',
    shotType: 'Graphic',
    visualDescription: 'Graphic แอนิเมชันโลโก้ ScriptLab เปล่งประกาย พร้อมปุ่ม "เริ่มต้นเรียนรู้ฟรี" มีไอคอนรางวัลและสถิติผู้เรียนสำเร็จ',
    visualGraphicNote: '[TEXT: เริ่มต้นเขียนเรื่องราวของคุณวันนี้ ที่ ScriptLab.app]',
    audioVoiceover: 'หยุดเก็บไอเดียไว้แค่ในความฝัน... ปลดล็อกศักยภาพนักเล่าเรื่องในตัวคุณได้แล้ววันนี้ ที่ ScriptLab!',
    audioSfx: 'SFX: เสียงกระดิ่งความสำเร็จ (Success Chime) ใสกระจ่าง',
    audioBgm: 'BGM: ดนตรีพีคสู่ท่อนจบคอร์ดสว่าง สดใส มีความหวัง',
    voiceGenderHint: 'female'
  }
];

export const THREE_COLUMN_QUIZ_QUESTIONS: ThreeColumnQuizQuestion[] = [
  {
    id: 'tc-quiz-1',
    questionNumber: 1,
    question: 'ในบทวิดีโอแบบ 3 คอลัมน์ คอลัมน์ที่ 1 (ลำดับ & เวลา / Sequence & Timing) ทำหน้าที่สำคัญที่สุดในข้อใด?',
    options: [
      'บอกค่าตัวและรายชื่อนักแสดงในฉาก',
      'กำหนดเลขช็อต จังหวะการตัดต่อ (Pacing) และความยาววินาทีที่แน่นอนของแต่ละช่วง เพื่อควบคุมเวลาคลิป',
      'ใช้เขียนเนื้อร้องของเพลงประกอบ',
      'ใช้คำนวณความสว่างของหลอดไฟในสตูดิโอ'
    ],
    correctIndex: 1,
    explanation: 'คอลัมน์แรกคือเข็มทิศเวลา (Timecode) ช่วยให้ทั้งทีมรู้ว่าแต่ละฉากมีความยาวกี่วินาที และทำให้ผู้กำกับคุมความยาวรวมของคลิปได้แม่นยำ'
  },
  {
    id: 'tc-quiz-2',
    questionNumber: 2,
    question: 'ในคอลัมน์ภาพ (Visual Column) ตัวย่อคำว่า "CU" และ "WS" มีความหมายตรงกับข้อใด?',
    options: [
      'Color Unit และ White Sound',
      'Cut Under และ Wide Screen',
      'Close-Up (ภาพระยะใกล้ เจาะจง) และ Wide Shot (ภาพมุมกว้าง แสดงบรรยากาศ)',
      'Camera Ultra และ Walking Step'
    ],
    correctIndex: 2,
    explanation: 'CU (Close-Up) คือภาพระยะใกล้เน้นสีหน้าหรือวัตถุสำคัญ ส่วน WS (Wide Shot) คือภาพมุมกว้างที่แสดงสภาพแวดล้อมโดยรวมของฉาก'
  },
  {
    id: 'tc-quiz-3',
    questionNumber: 3,
    question: 'ทำไมในคอลัมน์เสียง (Audio Column) จึงต้องระบุทั้งบทพากย์ (VO), เอฟเฟกต์ (SFX), และดนตรี (BGM) ควบคู่กันไป?',
    options: [
      'เพื่อให้ Editor และ Sound Engineer จัดสรรเลเยอร์เสียงและปรับบาลานซ์ความดังได้พอดีกับจังหวะภาพ',
      'เพื่อให้ไฟล์บทมีความหนามากขึ้น',
      'เพราะกฎหมายลิขสิทธิ์บังคับให้ต้องเขียนครบ 3 อย่างเสมอ',
      'เพื่อให้นักแสดงทุกคนต้องพากย์เสียงพร้อมกันในห้องอัด'
    ],
    correctIndex: 0,
    explanation: 'เสียงในวิดีโอมีหลายเลเยอร์ ทั้งเสียงพูด ดนตรีคลอ และเสียงเอฟเฟกต์ การระบุชัดเจนช่วยให้ Sound Engineer มิกซ์เสียงได้สมดุล โดยที่ดนตรีไม่กลบบทพากย์สำคัญ'
  }
];
