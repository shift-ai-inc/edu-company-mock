import { AvailableAssessment } from '@/types/assessment';

export const mockAvailableAssessments: AvailableAssessment[] = [
  {
    id: 'assess-001',
    title: 'React基礎スキル診断',
    description: 'Reactの基本的な概念とフックに関する理解度を測定します。コンポーネント、ステート、プロップスなどが含まれます。',
    thumbnailUrl: '/images/react-thumb.png', // Placeholder path
    type: 'スキル評価',
    difficulty: 'easy',
    skillLevel: 'beginner',
    estimatedTime: 30,
    isPopular: true,
    isRecommended: true,
    tags: ['React', 'Frontend', 'JavaScript'],
    // Add missing properties based on the updated type in AssessmentList.tsx
    category: 'スキル診断', // Example category
    createdAt: '2023-10-26T10:00:00Z', // Example date
    usageCount: 150, // Example usage count
  },
  {
    id: 'assess-002',
    title: 'リーダーシップ・コンピテンシー評価',
    description: 'チームを率いる上で必要なコンピテンシー（意思決定、コミュニケーション、動機付けなど）を評価します。',
    thumbnailUrl: '/images/leadership-thumb.png', // Placeholder path
    type: '360度評価',
    difficulty: 'medium',
    skillLevel: 'intermediate',
    estimatedTime: 45,
    isPopular: false,
    isRecommended: true,
    tags: ['Leadership', 'Management', 'Soft Skills'],
    category: 'コンピテンシー評価',
    createdAt: '2023-09-15T14:30:00Z',
    usageCount: 85,
  },
  {
    id: 'assess-003',
    title: '従業員エンゲージメントサーベイ',
    description: '組織全体のエンゲージメントレベル、満足度、改善点を把握するための匿名サーベイです。',
    thumbnailUrl: '/images/engagement-thumb.png', // Placeholder path
    type: 'エンゲージメント',
    difficulty: 'easy',
    skillLevel: 'all',
    estimatedTime: 15,
    isPopular: true,
    isRecommended: false,
    tags: ['HR', 'Survey', 'Engagement'],
    category: 'エンゲージメントサーベイ',
    createdAt: '2024-01-10T09:00:00Z',
    usageCount: 320,
  },
  {
    id: 'assess-004',
    title: 'Pythonデータ分析スキルテスト',
    description: 'Pandas, NumPy を用いた基本的なデータ処理、可視化能力をテストします。',
    thumbnailUrl: '/images/python-data-thumb.png', // Placeholder path
    type: 'スキル評価',
    difficulty: 'medium',
    skillLevel: 'intermediate',
    estimatedTime: 60,
    isPopular: false,
    isRecommended: true,
    tags: ['Python', 'Data Science', 'Pandas'],
    category: 'スキル診断',
    createdAt: '2023-11-01T11:00:00Z',
    usageCount: 110,
  },
  {
    id: 'assess-005',
    title: 'プロジェクトマネジメント知識確認',
    description: 'プロジェクトの計画、実行、監視、終結に関する基本的な知識を問います。',
    thumbnailUrl: '/images/pm-thumb.png', // Placeholder path
    type: 'スキル評価',
    difficulty: 'easy',
    skillLevel: 'beginner',
    estimatedTime: 25,
    isPopular: true,
    isRecommended: false,
    tags: ['Project Management', 'PMBOK', 'Agile'],
    category: 'その他',
    createdAt: '2024-02-20T16:00:00Z',
    usageCount: 205,
  },
  {
    id: 'assess-006',
    title: '高度なTypeScript型システム理解度テスト',
    description: 'ジェネリクス、条件型、Mapped Typesなど、TypeScriptの高度な型機能に関する理解を深掘りします。',
    thumbnailUrl: '/images/ts-advanced-thumb.png', // Placeholder path
    type: 'スキル評価',
    difficulty: 'hard',
    skillLevel: 'advanced',
    estimatedTime: 75,
    isPopular: false,
    isRecommended: true,
    tags: ['TypeScript', 'Frontend', 'Backend', 'Type System'],
    category: 'スキル診断',
    createdAt: '2023-12-05T13:15:00Z',
    usageCount: 45,
  },
];
