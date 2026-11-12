import type { InternInfo, DeptHeadInfo, BossInfo } from '../types/cutscene';

export const INTERNS: InternInfo[] = [
  {
    id: 'webdev',
    name: 'Web Dev Intern',
    shortName: 'WebDev',
    role: 'Frontend Construction & Web Architecture',
    department: 'Web Engineering',
    color: '#5BFFB1',
    glowColor: 'rgba(91, 255, 177, 0.7)',
    prefix: 'WebDevFrame',
    hairColor: '#38BDF8',
    shirtColor: '#059669',
    accessories: 'Headphones'
  },
  {
    id: 'mobile',
    name: 'Mobile Dev Intern',
    shortName: 'MobileDev',
    role: 'Handheld Agility & Touch Interfaces',
    department: 'Mobile Engineering',
    color: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.7)',
    prefix: 'MobileDevFrame',
    hairColor: '#F43F5E',
    shirtColor: '#9F1239',
    accessories: 'Smartwatch'
  },
  {
    id: 'design',
    name: 'Design Intern',
    shortName: 'Design',
    role: 'Visual Design, Wireframes & UI Aesthetics',
    department: 'Design & UX',
    color: '#FACC15',
    glowColor: 'rgba(250, 204, 21, 0.7)',
    prefix: 'DesignFrame',
    hairColor: '#FDE047',
    shirtColor: '#854D0E',
    accessories: 'Stylus Pen'
  },
  {
    id: 'pm',
    name: 'PM Intern',
    shortName: 'PM',
    role: 'Timeline Scheduling & Sprint Velocity',
    department: 'Product Management',
    color: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.7)',
    prefix: 'PMFrame',
    hairColor: '#D97706',
    shirtColor: '#78350F',
    accessories: 'Notepad'
  },
  {
    id: 'productowner',
    name: 'Product Owner',
    shortName: 'PO',
    role: 'Backlog Prioritization & User Stories',
    department: 'Product Strategy',
    color: '#A855F7',
    glowColor: 'rgba(168, 85, 247, 0.7)',
    prefix: 'POFrame',
    hairColor: '#C084FC',
    shirtColor: '#581C87',
    accessories: 'Lanyard'
  },
  {
    id: 'operations',
    name: 'Operations Intern',
    shortName: 'Operations',
    role: 'Hardware Reliability & System Stability',
    department: 'Operations',
    color: '#14B8A6',
    glowColor: 'rgba(20, 184, 166, 0.7)',
    prefix: 'OPsFrame',
    hairColor: '#2DD4BF',
    shirtColor: '#134E4A',
    accessories: 'Multimeter'
  },
  {
    id: 'qa',
    name: 'QA Intern',
    shortName: 'QA',
    role: 'Edge Case Testing & Bug Hunting',
    department: 'Quality Assurance',
    color: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.7)',
    prefix: 'QAFrame',
    hairColor: '#7DD3FC',
    shirtColor: '#075985',
    accessories: 'Magnifying Badge'
  },
  {
    id: 'devops',
    name: 'DevOps Intern',
    shortName: 'DevOps',
    role: 'CI/CD Pipelines & Server Infrastructure',
    department: 'DevOps & Cloud',
    color: '#F97316',
    glowColor: 'rgba(249, 115, 22, 0.7)',
    prefix: 'DevOpsFrame',
    hairColor: '#FB923C',
    shirtColor: '#9A3412',
    accessories: 'Server Keycard'
  },
  {
    id: 'bizdev',
    name: 'Biz Dev Intern',
    shortName: 'BizDev',
    role: 'Market Metrics & Client Relations',
    department: 'Business Development',
    color: '#94A3B8',
    glowColor: 'rgba(148, 163, 184, 0.7)',
    prefix: 'BDFrame',
    hairColor: '#CBD5E1',
    shirtColor: '#1E293B',
    accessories: 'Suit Pin'
  }
];

export const DEPARTMENT_HEADS: DeptHeadInfo[] = [
  {
    id: 'dh_webdev',
    name: 'Web Dev Lead',
    shortName: 'Lead Web',
    department: 'Web Engineering',
    color: '#5BFFB1',
    suitColor: '#1e293b',
    tieColor: '#5BFFB1',
    hairColor: '#475569'
  },
  {
    id: 'dh_mobile',
    name: 'Mobile Dev Lead',
    shortName: 'Lead Mobile',
    department: 'Mobile Engineering',
    color: '#F43F5E',
    suitColor: '#334155',
    tieColor: '#F43F5E',
    hairColor: '#334155'
  },
  {
    id: 'dh_design',
    name: 'Design Director',
    shortName: 'Head Design',
    department: 'Design & UX',
    color: '#FACC15',
    suitColor: '#1e293b',
    tieColor: '#FACC15',
    hairColor: '#78350F'
  },
  {
    id: 'dh_pm',
    name: 'Lead PM',
    shortName: 'Lead PM',
    department: 'Product Management',
    color: '#F59E0B',
    suitColor: '#0f172a',
    tieColor: '#F59E0B',
    hairColor: '#64748B'
  },
  {
    id: 'dh_po',
    name: 'Principal PO',
    shortName: 'Head PO',
    department: 'Product Strategy',
    color: '#A855F7',
    suitColor: '#1e1b4b',
    tieColor: '#A855F7',
    hairColor: '#581C87'
  },
  {
    id: 'dh_operations',
    name: 'VP of Operations',
    shortName: 'Head Ops',
    department: 'Operations',
    color: '#14B8A6',
    suitColor: '#0f2922',
    tieColor: '#14B8A6',
    hairColor: '#0f766e'
  },
  {
    id: 'dh_devops',
    name: 'DevOps Lead',
    shortName: 'Lead DevOps',
    department: 'DevOps & Cloud',
    color: '#F97316',
    suitColor: '#1e293b',
    tieColor: '#F97316',
    hairColor: '#9a3412'
  },
  {
    id: 'dh_bizdev',
    name: 'Biz Dev Lead',
    shortName: 'Head BizDev',
    department: 'Business Development',
    color: '#94A3B8',
    suitColor: '#020617',
    tieColor: '#94A3B8',
    hairColor: '#334155'
  },
  {
    id: 'dh_qa',
    name: 'QA Director',
    shortName: 'Head QA',
    department: 'Quality Assurance',
    color: '#38BDF8',
    suitColor: '#0c2238',
    tieColor: '#38BDF8',
    hairColor: '#0284c7'
  }
];

export const BOSS: BossInfo = {
  id: 'boss',
  name: 'The Boss',
  title: 'Executive Director — MAKE Technology',
  suitColor: '#090d16',
  tieColor: '#e11d48',
  corrupted: false
};
