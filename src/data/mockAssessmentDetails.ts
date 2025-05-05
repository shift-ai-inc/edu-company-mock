import { AssessmentDetail } from '@/types/assessment';

// Mock detailed data for assessments
export const mockAssessmentDetails: Record<string, AssessmentDetail> = {
  'assess-001': {
    // Basic info (matches AvailableAssessment)
    id: 'assess-001',
    title: 'React基礎スキル診断',
    description: 'Reactの基本的な概念とフックに関する理解度を測定します。コンポーネント、ステート、プロップスなどが含まれます。',
    thumbnailUrl: '/images/react-thumb.png',
    type: 'スキル評価',
    difficulty: 'easy',
    skillLevel: 'beginner',
    estimatedTime: 30,
    isPopular: true,
    isRecommended: true,
    tags: ['React', 'Frontend', 'JavaScript'],
    category: 'スキル診断',
    createdAt: '2023-10-26T10:00:00Z',
    usageCount: 150,
    // Detailed info
    structureDescription: '全25問: 選択式20問、簡単なコード記述問題5問。Reactの基本概念を網羅。',
    categories: [
      { name: 'コンポーネントとProps', questionCount: 8 },
      { name: 'StateとLifecycle', questionCount: 7 },
      { name: 'Hooks (useState, useEffect)', questionCount: 6 },
      { name: 'イベント処理', questionCount: 4 },
    ],
    difficultyDistribution: { easy: 15, medium: 10, hard: 0 },
    sampleQuestions: [
      { id: 'q1-1', text: 'Reactコンポーネント間でデータを渡すための主な仕組みは何ですか？', type: 'multiple-choice' },
      { id: 'q1-2', text: '`useState` フックの基本的な使い方を説明してください。', type: 'text' },
      { id: 'q1-3', text: 'クラスコンポーネントの `componentDidMount` と等価なフックは何ですか？', type: 'multiple-choice' },
    ],
    targetSkills: ['React基本構文', 'コンポーネント設計', '状態管理'],
    measurableAbilities: ['Reactコード読解力', '基本的なHooksの利用能力'],
    statistics: {
      totalDeliveries: 150,
      averageScore: 82.5,
      completionRate: 96.0,
      lastDelivered: '2024-03-15',
    },
  },
  'assess-002': {
    // Basic info
    id: 'assess-002',
    title: 'リーダーシップ・コンピテンシー評価',
    description: 'チームを率いる上で必要なコンピテンシー（意思決定、コミュニケーション、動機付けなど）を評価します。',
    thumbnailUrl: '/images/leadership-thumb.png',
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
    // Detailed info
    structureDescription: '5つのコンピテンシー領域、各領域6問の評価項目 (自己評価、上司評価、同僚評価、部下評価)。自由記述欄あり。',
    categories: [
      { name: 'ビジョン提示力', questionCount: 6 },
      { name: 'チーム育成力', questionCount: 6 },
      { name: '意思決定力', questionCount: 6 },
      { name: 'コミュニケーション力', questionCount: 6 },
      { name: '目標達成力', questionCount: 6 },
    ],
    difficultyDistribution: { easy: 5, medium: 20, hard: 5 }, // Difficulty might represent complexity of behavior/interpretation
    sampleQuestions: [
      { id: 'q2-1', text: 'チームメンバーの意見を積極的に聞き、意思決定に反映していますか？ (1-5で評価)', type: 'rating' },
      { id: 'q2-2', text: '困難な状況でも、チームを鼓舞し、目標達成に向けて導いていますか？ (1-5で評価)', type: 'rating' },
    ],
    targetSkills: ['戦略的思考', '人材育成', '意思決定能力', '対人関係構築', '目標管理'],
    measurableAbilities: ['リーダーシップ行動特性', '周囲からの信頼度', 'チームマネジメント能力'],
    statistics: {
      totalDeliveries: 85,
      // Average score might not be meaningful for 360 feedback
      completionRate: 91.0,
      lastDelivered: '2024-02-28',
    },
  },
  'assess-003': {
    // Basic info
    id: 'assess-003',
    title: '従業員エンゲージメントサーベイ',
    description: '組織全体のエンゲージメントレベル、満足度、改善点を把握するための匿名サーベイです。',
    thumbnailUrl: '/images/engagement-thumb.png',
    type: 'エンゲージメント',
    difficulty: 'easy', // Questions are easy, interpretation might be complex
    skillLevel: 'all',
    estimatedTime: 15,
    isPopular: true,
    isRecommended: false,
    tags: ['HR', 'Survey', 'Engagement'],
    category: 'エンゲージメントサーベイ',
    createdAt: '2024-01-10T09:00:00Z',
    usageCount: 320,
    // Detailed info
    structureDescription: '6つのエンゲージメントドライバーに関する30の質問項目 (5段階評価)。匿名回答形式。',
    categories: [
      { name: '仕事の満足度', questionCount: 5 },
      { name: '上司との関係', questionCount: 5 },
      { name: '同僚との関係', questionCount: 5 },
      { name: '成長機会', questionCount: 5 },
      { name: '会社への貢献感', questionCount: 5 },
      { name: 'ワークライフバランス', questionCount: 5 },
    ],
    difficultyDistribution: { easy: 30, medium: 0, hard: 0 },
    sampleQuestions: [
      { id: 'q3-1', text: '現在の仕事内容にやりがいを感じていますか？ (1-5で評価)', type: 'rating' },
      { id: 'q3-2', text: 'チーム内で意見交換が活発に行われていると感じますか？ (1-5で評価)', type: 'rating' },
    ],
    targetSkills: ['組織診断', '従業員満足度把握'],
    measurableAbilities: ['チームエンゲージメントレベル', '組織課題の特定'],
    statistics: {
      totalDeliveries: 320,
      completionRate: 94.5,
      lastDelivered: '2024-03-10',
    },
  },
  'assess-004': {
    // Basic info
    id: 'assess-004',
    title: 'Pythonデータ分析スキルテスト',
    description: 'Pandas, NumPy を用いた基本的なデータ処理、可視化能力をテストします。',
    thumbnailUrl: '/images/python-data-thumb.png',
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
    // Detailed info
    structureDescription: '全15問: 選択式5問、データ処理問題8問、簡単な可視化問題2問。',
    categories: [
        { name: 'NumPy基礎', questionCount: 3 },
        { name: 'Pandas DataFrame操作', questionCount: 6 },
        { name: 'データクリーニング', questionCount: 4 },
        { name: 'Matplotlib/Seaborn基礎', questionCount: 2 },
    ],
    difficultyDistribution: { easy: 3, medium: 9, hard: 3 },
    sampleQuestions: [
        { id: 'q4-1', text: 'Pandas DataFrameで特定の列を選択する方法は？', type: 'multiple-choice' },
        { id: 'q4-2', text: '与えられたDataFrameの欠損値を平均値で補完するコードを記述してください。', type: 'text' },
        { id: 'q4-3', text: 'Matplotlibを使用して簡単な棒グラフを作成するコードを示してください。', type: 'text' },
    ],
    targetSkills: ['データハンドリング(Pandas)', '数値計算(NumPy)', '基本データ可視化'],
    measurableAbilities: ['Pythonによるデータ処理能力', 'データ分析の基礎知識'],
    statistics: {
        totalDeliveries: 110,
        averageScore: 75.8,
        completionRate: 92.1,
        lastDelivered: '2024-03-01',
    },
  },
   'assess-005': {
    // Basic info
    id: 'assess-005',
    title: 'プロジェクトマネジメント知識確認',
    description: 'プロジェクトの計画、実行、監視、終結に関する基本的な知識を問います。',
    thumbnailUrl: '/images/pm-thumb.png',
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
    // Detailed info
    structureDescription: 'シナリオベースの選択式問題30問。PMBOKガイドの主要知識エリアをカバー。',
     categories: [
      { name: '統合マネジメント', questionCount: 5 },
      { name: 'スコープ管理', questionCount: 5 },
      { name: 'スケジュール管理', questionCount: 6 },
      { name: 'コスト管理', questionCount: 4 },
      { name: 'リスク管理', questionCount: 5 },
      { name: 'コミュニケーション管理', questionCount: 5 },
    ],
    difficultyDistribution: { easy: 20, medium: 10, hard: 0 },
    sampleQuestions: [
      { id: 'q5-1', text: 'プロジェクトのスコープクリープを防ぐために最も重要な活動は？', type: 'multiple-choice' },
      { id: 'q5-2', text: 'WBS (Work Breakdown Structure) を作成する主な目的は何ですか？', type: 'multiple-choice' },
    ],
    targetSkills: ['プロジェクト計画立案', 'リスク特定', '進捗監視', 'ステークホルダー管理'],
    measurableAbilities: ['基本的なプロジェクトマネジメント知識', 'PM用語の理解'],
    statistics: {
      totalDeliveries: 205,
      averageScore: 88.2,
      completionRate: 97.5,
      lastDelivered: '2024-03-18',
    },
  },
   'assess-006': {
    // Basic info
    id: 'assess-006',
    title: '高度なTypeScript型システム理解度テスト',
    description: 'ジェネリクス、条件型、Mapped Typesなど、TypeScriptの高度な型機能に関する理解を深掘りします。',
    thumbnailUrl: '/images/ts-advanced-thumb.png',
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
    // Detailed info
    structureDescription: '全12問: 選択式4問、型定義問題6問、型推論に関する考察問題2問。',
     categories: [
      { name: 'ジェネリクス', questionCount: 4 },
      { name: '条件型と推論 (infer)', questionCount: 3 },
      { name: 'Mapped Types と Utility Types', questionCount: 3 },
      { name: '高度な型ガードと型安全性', questionCount: 2 },
    ],
    difficultyDistribution: { easy: 0, medium: 4, hard: 8 },
    sampleQuestions: [
      { id: 'q6-1', text: '`keyof` と `typeof` 演算子の違いを説明し、具体的な使用例を示してください。', type: 'text' },
      { id: 'q6-2', text: '与えられたインターフェースのすべてのプロパティをオプショナルにするMapped Typeを定義してください。', type: 'text' },
      { id: 'q6-3', text: '条件型を使用して、特定の型がPromiseであるかどうかを判定する型 `IsPromise<T>` を定義してください。', type: 'text' },
    ],
    targetSkills: ['高度な型定義', '型安全性向上', 'ジェネリックプログラミング', '型推論メカニズム理解'],
    measurableAbilities: ['複雑な型システムの設計・読解能力', 'TypeScriptの静的解析能力の活用'],
    statistics: {
      totalDeliveries: 45,
      averageScore: 68.9,
      completionRate: 89.0,
      lastDelivered: '2024-01-25',
    },
  },
};

// Function to simulate fetching details (replace with actual API call later)
export const getAssessmentDetail = async (id: string): Promise<AssessmentDetail | null> => {
  console.log(`Fetching details for assessment ID: ${id}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 150)); // Slightly longer delay for detail fetch
  const detail = mockAssessmentDetails[id];
  if (!detail) {
    console.error(`Assessment detail not found for ID: ${id}`);
    return null;
  }
  // Ensure basic properties match if they exist in both (though they should)
  // This merge isn't strictly necessary if mockAssessmentDetails is comprehensive
  // const baseInfo = mockAvailableAssessments.find(a => a.id === id);
  // return baseInfo ? { ...baseInfo, ...detail } : detail;
  return detail;
};
