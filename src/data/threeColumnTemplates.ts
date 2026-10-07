import { ThreeColumnScriptTemplate } from '../types/script';

export const THREE_COLUMN_TEMPLATES: ThreeColumnScriptTemplate[] = [
  {
    id: 'template-commercial',
    name: 'สปอตโฆษณาแบรนด์ & สินค้า (Commercial TVC)',
    category: 'commercial',
    categoryLabel: 'โฆษณา',
    targetMedia: 'TVC & Online Brand Video',
    duration: '30 วินาที (30s)',
    description: 'สูตรโครงสร้างโฆษณาระดับมืออาชีพ: Hook หยุดสายตา (0-5s), สะท้อนปัญหา (5-15s), เปิดตัวฮีโร่สินค้า (15-25s), และ Call To Action ปิดการขาย (25-30s)',
    rows: [
      {
        id: 'row-ad-1',
        sequenceNumber: 1,
        timecode: '0:00 - 0:05 (5s)',
        phaseName: 'Hook หยุดสายตา',
        shotType: 'CU',
        visualDescription: 'CU (โคลสอัปใกล้) หยดน้ำเย็นเกาะผิวขวดเครื่องดื่มสมุนไพรสปาร์คกลิ้ง แสงนีออนสตูดิโอสีเขียวมะนาวสะท้อนพรายฟองซ่า',
        visualGraphicNote: '[TEXT: เหนื่อยล้ามาทั้งวัน... อยากชาร์จพลังทันทีไหม?]',
        audioVoiceover: 'เมื่อพลังงานของคุณเริ่มหมดลง แต่ภารกิจตรงหน้ายังไม่จบ...',
        audioSfx: 'SFX: เสียงน้ำแข็งกระทบแก้ว "กรุ๊งกริ๊ง" และเสียงเปิดฝาดัง "เป๊าะ!"',
        audioBgm: 'BGM: บีท Electronic จังหวะ Deep Bass ลึกลับ ชวนค้นหา',
        voiceGenderHint: 'male'
      },
      {
        id: 'row-ad-2',
        sequenceNumber: 2,
        timecode: '0:05 - 0:15 (10s)',
        phaseName: 'Pain Point สะท้อนปัญหา',
        shotType: 'MCU',
        visualDescription: 'MCU (ระดับอก) ฟรีแลนซ์หนุ่มสาวเอามือกุมขมับ จ้องหน้าจอคอมพิวเตอร์ตอนดึก นาฬิกาบอกเวลาตี 2 สีหน้าอ่อนล้าไร้เรี่ยวแรง',
        visualGraphicNote: '[TEXT: กาแฟแก้วเดิม ไม่ช่วยอีกต่อไป]',
        audioVoiceover: 'อย่าปล่อยให้ไอเดียสร้างสรรค์ของคุณ ต้องสะดุดลงเพราะความเหนื่อยล้าสะสม',
        audioSfx: 'SFX: เสียงนาฬิกาเดิน ติ๊ก-ต็อก และเสียงถอนหายใจแผ่วเบา',
        audioBgm: 'BGM: เมโลดี้เปียโนหน่วงอารมณ์ สะท้อนความกดดัน',
        voiceGenderHint: 'male'
      },
      {
        id: 'row-ad-3',
        sequenceNumber: 3,
        timecode: '0:15 - 0:25 (10s)',
        phaseName: 'Solution เปิดตัวสินค้า',
        shotType: 'WS',
        visualDescription: 'WS (ภาพกว้าง) แสงนีออนสว่างวาบทั่วห้อง ตัวเอกดื่มเครื่องดื่มแล้วยิ้มมั่นใจ คลื่นพลังสีเขียวมรกตแผ่ออกรอบตัวอย่างตื่นตา',
        visualGraphicNote: '[MOTION GRAPHIC: ปลุกพลังสมองด้วยสารสกัดธรรมชาติ 100%]',
        audioVoiceover: 'ขอแนะนำ "EnerVibe" เครื่องดื่มสมุนไพรรุ่นใหม่ รีชาร์จความสดชื่นเต็มพิกัด ให้สมองแล่นไวพร้อมลุยทุกโปรเจกต์!',
        audioSfx: 'SFX: เสียงพลังพวยพุ่ง Swoosh! และเสียงฟองซ่าแตกกระจายสดชื่น',
        audioBgm: 'BGM: ดนตรีจังหวะ Upbeat Pop-Rock เต็มไปด้วยพลังและไฟฝัน',
        voiceGenderHint: 'female'
      },
      {
        id: 'row-ad-4',
        sequenceNumber: 4,
        timecode: '0:25 - 0:30 (5s)',
        phaseName: 'Call To Action (CTA)',
        shotType: 'Graphic',
        visualDescription: 'Graphic โลโก้ EnerVibe เปล่งประกายกลางหน้าจอ พร้อมขวดสินค้า 3 รสชาติ และปุ่มสั่งซื้อด่วน [TEXT: ซื้อ 1 แถม 1 ที่ร้านสะดวกซื้อทุกสาขา]',
        visualGraphicNote: '[TEXT: EnerVibe · ดื่มปุ๊บ ไบรท์ปั๊บ วันนี้!]',
        audioVoiceover: 'เพราะทุกวินาทีมีค่า ปลุกไฟในตัวคุณกับ EnerVibe ดื่มเลย!',
        audioSfx: 'SFX: เสียง Chime ความสำเร็จ และเสียงโซนิคโลโก้ติดหู',
        audioBgm: 'BGM: ท่อนจบคอร์ดสดใส กระแทกจังหวะสุดท้ายชัดเจน',
        voiceGenderHint: 'female'
      }
    ]
  },
  {
    id: 'template-documentary',
    name: 'สารคดีเรื่องเล่าเชิงลึก (Cultural Documentary)',
    category: 'documentary',
    categoryLabel: 'สารคดี',
    targetMedia: 'Documentary & Short Film',
    duration: '60 วินาที (1 นาที)',
    description: 'โครงสร้างสารคดีเน้นอารมณ์และภาพเล่าเรื่อง: ภาพเปิดสร้างบรรยากาศ (0-10s), วิถีชีวิตภูมิปัญญา (10-25s), หัวใจของมรดก (25-45s), และบทสรุปชวนตรึกตรอง (45-60s)',
    rows: [
      {
        id: 'row-doc-1',
        sequenceNumber: 1,
        timecode: '0:00 - 0:10 (10s)',
        phaseName: 'ภาพเปิดบรรยากาศ (Atmosphere)',
        shotType: 'WS',
        visualDescription: 'WS (ภาพมุมกว้างทางอากาศ / Drone Shot) ทะเลหมอกสีขาวนวลโอบล้อมยอดดอยสูง แสงอาทิตย์ยามเช้าทอดลำแสงสีทองพาดผ่านผืนป่าดิบชื้น',
        visualGraphicNote: '[TEXT: สารคดีสั้น: ลมหายใจแห่งยอดดอย]',
        audioVoiceover: 'ลึกเข้าไปในหุบเขาที่สายหมอกไม่เคยหลับใหล... มีเสียงหนึ่งที่ขับขานมานานนับร้อยปี',
        audioSfx: 'SFX: เสียงลมภูเขาพัดเอื่อยหวีดหวิว และเสียงนกป่าร้องกังวาน',
        audioBgm: 'BGM: ดนตรีเครื่องสายพื้นเมืองบรรเลงเคล้าเปียโนแผ่วเบา ชวนเคลิ้มฝัน',
        voiceGenderHint: 'male'
      },
      {
        id: 'row-doc-2',
        sequenceNumber: 2,
        timecode: '0:10 - 0:25 (15s)',
        phaseName: 'วิถีชีวิต & ขั้นตอนการทำ (Process)',
        shotType: 'MCU',
        visualDescription: 'MCU (ระดับอก) คุณตาวัย 72 สวมเสื้อหม้อฮ้อม ก้มลงคัดสรรใบชาสดด้วยมือที่เหี่ยวย่นแต่เปี่ยมด้วยความชำนาญ กลิ่นไอร้อนลอยคลุ้งจากกระทะคั่วดินเผา',
        visualGraphicNote: '[TEXT: คุณตาบุญมี · ทายาทรุ่นที่ 3]',
        audioVoiceover: 'ทุกยอดใบชา ไม่ใช่แค่ผลผลิตทางธรรมชาติ... แต่คือบทสนทนาอันลึกซึ้งระหว่างหัวใจของมนุษย์กับป่าต้นน้ำ',
        audioSfx: 'SFX: เสียงใบชากระทบกระทะร้อนกรอบแกรบ และเสียงเตาฟืนปะทุเปรี๊ยะ',
        audioBgm: 'BGM: ดนตรีบรรเลงอบอุ่น ละเมียดละไม ให้ความรู้สึกเคารพธรรมชาติ',
        voiceGenderHint: 'male'
      },
      {
        id: 'row-doc-3',
        sequenceNumber: 3,
        timecode: '0:25 - 0:45 (20s)',
        phaseName: 'หัวใจของมรดก (Heritage & Heart)',
        shotType: 'CU',
        visualDescription: 'CU (ภาพโคลสอัปใกล้) หยดน้ำชาสีอำพันทองไหลรินลงสู่ถ้วยดินเผา ตัดสลับกับแววตาเปี่ยมรอยยิ้มของเด็กหญิงรุ่นหลานที่กำลังเรียนรู้การชงชาโบราณ',
        visualGraphicNote: '[TEXT: ภูมิปัญญาที่ส่งต่อข้ามกาลเวลา]',
        audioVoiceover: 'เมื่อโลกภายนอกหมุนเร็วขึ้นทุกวัน... แต่ที่นี่ ความสุขกลับวัดได้จากความช้า และความใส่ใจในทุกหยดน้ำชา',
        audioSfx: 'SFX: เสียงน้ำร้อนไหลริน และเสียงถ้วยชากระทบจานรองเบาๆ',
        audioBgm: 'BGM: ท่อนประสานเสียงเชลโล่และไวโอลินไพเราะจับใจ ดึงอารมณ์ซาบซึ้ง',
        voiceGenderHint: 'female'
      },
      {
        id: 'row-doc-4',
        sequenceNumber: 4,
        timecode: '0:45 - 1:00 (15s)',
        phaseName: 'บทสรุปชวนตรึกตรอง (Reflection)',
        shotType: 'WS',
        visualDescription: 'WS (ภาพมุมกว้าง) พระอาทิตย์ลับขอบฟ้าหลังทิวเขา ไร่ชาขั้นบันไดอาบแสงสีส้มแดงทอง ทิ้งเงาครอบครัวยืนมองผืนดิน [TEXT: ติดตามตอนต่อไป]',
        visualGraphicNote: '[TEXT: เพราะรากเหง้า... คือพลังแห่งอนาคต]',
        audioVoiceover: 'เพราะบางเรื่องราว... ยิ่งผ่านกาลเวลา ยิ่งทรงคุณค่า และไม่มีวันเลือนหาย',
        audioSfx: 'SFX: เสียงระฆังวัดบนดอยดังก้องไกล และเสียงลมเย็นพัดผ่านยอดหญ้า',
        audioBgm: 'BGM: คอร์ดดนตรีคลี่คลายอย่างสงบ งดงาม และตราตรึงในใจ',
        voiceGenderHint: 'male'
      }
    ]
  },
  {
    id: 'template-tiktok',
    name: 'คลิปสั้นไวรัลแนวตั้ง (TikTok / Reels / Shorts)',
    category: 'tiktok',
    categoryLabel: 'คลิปสั้น TikTok',
    targetMedia: 'TikTok, IG Reels, YT Shorts (9:16)',
    duration: '15 วินาที (15s Fast Paced)',
    description: 'โครงสร้างคลิปสั้นดูดสายตา: 0-3s Stop-the-scroll Hook แรงๆ, 3-7s เคล็ดลับข้อที่หนึ่ง, 7-11s เคล็ดลับข้อที่สอง, 11-15s Quick Actionable CTA',
    rows: [
      {
        id: 'row-tt-1',
        sequenceNumber: 1,
        timecode: '0:00 - 0:03 (3s)',
        phaseName: 'Stop-the-Scroll Hook',
        shotType: 'CU',
        visualDescription: 'CU (แนวตั้ง 9:16) ครีเอเตอร์ถือมือถือกล้องสั่นเล็กน้อย ทำหน้าตกใจตาโตชี้มาที่หน้าจอ ซูมกระตุกแบบ Snap Zoom รวดเร็ว 2 จังหวะ',
        visualGraphicNote: '[TEXT แดงกระพริบ: 3 ทริกตัดต่อ ที่ครีเอเตอร์ 1M ซ่อนไว้! 😱]',
        audioVoiceover: 'หยุดเลื่อนฟีดเดี๋ยวนี้! ถ้ารู้ 3 สิ่งนี้ ยอดวิวคลิปคุณจะพุ่งสิบเท่า!',
        audioSfx: 'SFX: เสียงเบรกเอี๊ยดลั่น + เสียง Vinyl Scratch หยุดจังหวะกึก!',
        audioBgm: 'BGM: บีท Phonk หนักๆ กระแทกจังหวะมันส์ๆ ทันที',
        voiceGenderHint: 'male'
      },
      {
        id: 'row-tt-2',
        sequenceNumber: 2,
        timecode: '0:03 - 0:07 (4s)',
        phaseName: 'ทริกที่ 1: ตัด Dead Air',
        shotType: 'Graphic',
        visualDescription: 'Graphic ตัดคัตฉับไว สลับภาพหน้าจอ CapCut/Premiere นิ้วชี้จิ้มจุด Waveform ตัดช่องว่างทิ้งหมด แอนิเมชันกรรไกรตัดฉับๆ',
        visualGraphicNote: '[TEXT: ทริกที่ 1: ตัดช่องว่างหายใจให้เหลือ 0 วิ!]',
        audioVoiceover: 'ข้อแรก: ตัดช่วงเว้นวรรคหายใจทิ้งให้หมด อย่าเปิดโอกาสให้คนดูรู้สึกเบื่อแม้แต่วินาทีเดียว!',
        audioSfx: 'SFX: เสียง Pop! Pop! Pop! และเสียงตัดกระดาษฉับๆ',
        audioBgm: 'BGM: บีทเร่งความเร็ว เพิ่มความตื่นเต้น',
        voiceGenderHint: 'male'
      },
      {
        id: 'row-tt-3',
        sequenceNumber: 3,
        timecode: '0:07 - 0:11 (4s)',
        phaseName: 'ทริกที่ 2: เปลี่ยนมุมภาพ',
        shotType: 'POV',
        visualDescription: 'POV แทนสายตา ตัดสลับขนาดภาพทุก 2 วินาที (กว้าง -> โคลสอัป -> มุมเอียง) มีลูกศรสีเหลืองนีออนชี้จุดสายตา',
        visualGraphicNote: '[TEXT: ทริกที่ 2: สลับมุมกล้องทุกๆ 2-3 วินาที]',
        audioVoiceover: 'ข้อสอง: เปลี่ยนมุมกล้องทุกสองวินาที เพื่อรีเซ็ตสมาธิของสายตาคนดู!',
        audioSfx: 'SFX: เสียง Camera Shutter "แชะ! แชะ!" รัวๆ สองจังหวะ',
        audioBgm: 'BGM: บีทเบสไลน์ทึบๆ ชวนโยกหัว',
        voiceGenderHint: 'female'
      },
      {
        id: 'row-tt-4',
        sequenceNumber: 4,
        timecode: '0:11 - 0:15 (4s)',
        phaseName: 'Quick Viral CTA',
        shotType: 'MCU',
        visualDescription: 'MCU ครีเอเตอร์ยิ้มเท่ นิ้วชี้ลงมุมขวาล่างที่ปุ่มบันทึกและปุ่มแชร์ มีสติกเกอร์หัวใจและไฟลุกเด้งระเบิดบนจอ [TEXT: เซฟคลิปไว้ใช้ด่วน!]',
        visualGraphicNote: '[TEXT: กดเซฟคลิป + ฟอล ScriptLab ไว้เลย!]',
        audioVoiceover: 'กดบันทึกคลิปนี้ไว้ใช้ แล้วกดติดตาม ScriptLab ไว้เลยนะคร้าบ!',
        audioSfx: 'SFX: เสียงกระดิ่งแจ้งเตือน Ding! ชัดเจนระดับสตูดิโอ',
        audioBgm: 'BGM: บีทเพลงจบกระแทกจังหวะตบแปะ สะใจ',
        voiceGenderHint: 'male'
      }
    ]
  }
];
