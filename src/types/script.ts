export type NavigationTab = 'dashboard' | 'lessons' | 'three-column' | 'studio' | 'library' | 'reviewer';

export interface Lesson {
  id: string;
  title: string;
  category: 'basics' | 'structure' | 'dialogue' | 'visuals';
  categoryLabel: string;
  durationMinutes: number;
  level: 'เริ่มต้น' | 'ปานกลาง' | 'ขั้นสูง';
  completed: boolean;
  progressPercent: number;
  summary: string;
  coverImage?: string;
  content: {
    overview: string;
    keyPoints: string[];
    exampleScript: {
      heading: string;
      body: string;
      analysis: string;
    };
    proTip: string;
    quiz: {
      question: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    };
  };
}

export interface ThreeColumnRow {
  id: string;
  sequenceNumber: number;
  timecode: string;
  phaseName: string;
  shotType: 'CU' | 'MCU' | 'WS' | 'POV' | 'OTS' | 'Graphic' | 'Custom';
  visualDescription: string;
  visualGraphicNote: string;
  audioVoiceover: string;
  audioSfx: string;
  audioBgm: string;
  voiceGenderHint?: 'male' | 'female';
}

export interface ThreeColumnScriptTemplate {
  id: string;
  name: string;
  category: 'commercial' | 'documentary' | 'tiktok';
  categoryLabel: string;
  targetMedia: string;
  duration: string;
  description: string;
  rows: ThreeColumnRow[];
}

export interface FlipCardData {
  id: string;
  columnNumber: number;
  title: string;
  titleEn: string;
  subtitle: string;
  iconName: string;
  accentColor: string;
  frontSummary: string;
  frontKeyTakeaway: string;
  backDetails: {
    definition: string;
    elements: string[];
    standardCodes: { code: string; meaning: string }[];
    proTip: string;
  };
}

export interface ThreeColumnQuizQuestion {
  id: string;
  questionNumber: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ScriptSample {
  id: string;
  title: string;
  titleEn: string;
  genre: 'Drama' | 'Thriller' | 'Sci-Fi' | 'Rom-Com' | 'Short Film';
  logline: string;
  pages: number;
  readTime: string;
  tags: string[];
  image: string;
  directorNotes: string;
  screenplayContent: string;
}

export interface ReviewIssue {
  type: 'error' | 'warning' | 'tip';
  title: string;
  description: string;
  lineSnippet?: string;
  lineNumber?: number;
}

export interface ScriptReviewResult {
  score: number;
  sceneCount: number;
  wordCount: number;
  characterCount: number;
  dialogueRatio: number;
  estimatedMinutes: number;
  issues: ReviewIssue[];
  strengths: string[];
  recommendations: string[];
}
