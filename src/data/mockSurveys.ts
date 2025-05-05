import { AvailableSurvey } from '@/types/survey';

export const mockAvailableSurveys: AvailableSurvey[] = [
  {
    id: 'survey-001',
    title: '従業員エンゲージメントサーベイ Q1',
    description: '四半期ごとの従業員エンゲージメントレベルを測定します。',
    category: 'エンゲージメント',
    estimatedTime: 15,
    createdAt: new Date('2023-10-01T09:00:00Z'),
  },
  {
    id: 'survey-002',
    title: '新人研修満足度アンケート',
    description: '新人研修プログラムの効果と満足度を評価します。',
    category: '研修後アンケート',
    estimatedTime: 10,
    createdAt: new Date('2023-11-15T14:30:00Z'),
  },
  {
    id: 'survey-003',
    title: '職場環境に関する意識調査',
    description: '現在の職場環境に関する従業員の意見を収集します。',
    category: '満足度調査',
    estimatedTime: 20,
    createdAt: new Date('2024-01-10T11:00:00Z'),
  },
  {
    id: 'survey-004',
    title: 'リモートワーク実態調査',
    description: 'リモートワークの状況と課題について把握します。',
    category: '満足度調査',
    estimatedTime: 15,
    createdAt: new Date('2024-02-20T16:00:00Z'),
  },
];
