export type InternId =
  | 'webdev'
  | 'mobile'
  | 'design'
  | 'pm'
  | 'productowner'
  | 'operations'
  | 'qa'
  | 'devops'
  | 'bizdev';

export type DeptHeadId =
  | 'dh_webdev'
  | 'dh_mobile'
  | 'dh_design'
  | 'dh_pm'
  | 'dh_po'
  | 'dh_operations'
  | 'dh_qa'
  | 'dh_devops'
  | 'dh_bizdev';

export type CharacterId = InternId | DeptHeadId | 'boss' | 'tv' | 'narrator';

export interface InternInfo {
  id: InternId;
  name: string;
  shortName: string;
  role: string;
  department: string;
  color: string;
  glowColor: string;
  prefix: string; // Sprite filename prefix e.g. "WebDevFrame"
  hairColor: string;
  shirtColor: string;
  accessories?: string;
}

export interface DeptHeadInfo {
  id: DeptHeadId;
  name: string;
  shortName: string;
  department: string;
  color: string;
  suitColor: string;
  tieColor: string;
  hairColor: string;
}

export interface BossInfo {
  id: 'boss';
  name: string;
  title: string;
  suitColor: string;
  tieColor: string;
  corrupted: boolean;
}

export interface DialogueLine {
  speakerId: CharacterId;
  speakerName: string;
  speakerTitle?: string;
  text: string;
  isGlitchy?: boolean;
  voicePitch?: number; // for procedural speech blips
  duration?: number; // auto-advance duration in seconds if auto-playing
}

export interface SceneMeta {
  id: 1 | 2 | 3 | 4 | 5;
  title: string;
  subtitle: string;
  environment: 'corporate_bright' | 'corporate_tour' | 'corporate_work' | 'hallway_and_void' | 'dark_repository';
}
