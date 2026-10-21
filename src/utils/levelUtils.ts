export interface LearnerLevelInfo {
  levelNumber: number;
  levelName: string;
  levelTitleEn: string;
  levelBadgeText: string;
  description: string;
  themeColor: string;
}

export function getLearnerLevel(progressPercent: number): LearnerLevelInfo {
  if (progressPercent >= 100) {
    return {
      levelNumber: 4,
      levelName: 'ผู้เรียนระดับ 4',
      levelTitleEn: 'Master Screenwriter',
      levelBadgeText: 'ระดับ 4: มืออาชีพ',
      description: 'สำเร็จการศึกษาหลักสูตรเขียนบทครบถ้วน พร้อมสร้างสรรค์ผลงานจริง',
      themeColor: 'purple'
    };
  }
  if (progressPercent >= 70) {
    return {
      levelNumber: 3,
      levelName: 'ผู้เรียนระดับ 3',
      levelTitleEn: 'Senior Screenwriter',
      levelBadgeText: 'ระดับ 3: ขั้นสูง',
      description: 'เข้าใจโครงสร้างสามองก์ บทสนทนา และตาราง 3 คอลัมน์อย่างเชี่ยวชาญ',
      themeColor: 'amber'
    };
  }
  if (progressPercent >= 35) {
    return {
      levelNumber: 2,
      levelName: 'ผู้เรียนระดับ 2',
      levelTitleEn: 'Junior Screenwriter',
      levelBadgeText: 'ระดับ 2: ปานกลาง',
      description: 'เข้าใจรูปแบบบทมาตรฐานสากล Slugline Action และตัวละครพื้นฐาน',
      themeColor: 'emerald'
    };
  }
  return {
    levelNumber: 1,
    levelName: 'ผู้เรียนระดับ 1',
    levelTitleEn: 'Beginner Screenwriter',
    levelBadgeText: 'ระดับ 1: พื้นฐาน',
    description: 'เริ่มต้นเรียนรู้พื้นฐานศาสตร์การเขียนบทภาพยนตร์และมัลติมีเดีย',
    themeColor: 'sky'
  };
}
