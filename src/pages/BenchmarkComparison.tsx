import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge"; // To highlight differences

// --- Mock Data Structures ---
// Replace with actual data fetching and types

// Example structure for own results (could be company, dept, or individual)
interface OwnResultData {
  id: string; // e.g., 'company', 'dept-hr', 'user-123'
  name: string; // e.g., '自社全体', '人事部', '山田 太郎'
  type: 'company' | 'department' | 'individual';
  scores: { [key: string]: number }; // Skill scores
}

// Example structure for benchmark data
interface BenchmarkData {
  id: string; // e.g., 'industry-it-medium', 'region-tokyo-all'
  name: string; // e.g., 'IT業界 (中規模)', '東京都 全業種'
  scores: {
    average: { [key: string]: number };
    percentiles: { // Example percentiles
      p25: { [key: string]: number };
      p50: { [key: string]: number }; // Median
      p75: { [key: string]: number };
    };
  };
}

// Mock data for demonstration
const mockOwnCompanyResult: OwnResultData = {
  id: 'company',
  name: '自社全体',
  type: 'company',
  scores: {
    'リーダーシップ': 75,
    'コミュニケーション': 80,
    '問題解決': 68,
    '技術スキル': 72,
    '適応性': 78,
  },
};

// Mock benchmark data (replace with actual fetched data based on filters)
const mockBenchmarkItMedium: BenchmarkData = {
  id: 'industry-it-medium',
  name: 'IT業界 (従業員100-500名)',
  scores: {
    average: { 'リーダーシップ': 72, 'コミュニケーション': 75, '問題解決': 70, '技術スキル': 78, '適応性': 75 },
    percentiles: {
      p25: { 'リーダーシップ': 65, 'コミュニケーション': 68, '問題解決': 62, '技術スキル': 70, '適応性': 68 },
      p50: { 'リーダーシップ': 72, 'コミュニケーション': 75, '問題解決': 70, '技術スキル': 78, '適応性': 75 },
      p75: { 'リーダーシップ': 80, 'コミュニケーション': 82, '問題解決': 78, '技術スキル': 85, '適応性': 82 },
    },
  },
};

// --- Component ---

const BenchmarkComparison: React.FC = () => {
  const [comparisonScope, setComparisonScope] = useState<'company' | 'department' | 'individual'>('company');
  const [selectedScopeId, setSelectedScopeId] = useState<string>('company'); // ID of the company/dept/user
  const [selectedIndustry, setSelectedIndustry] = useState<string>('it');
  const [selectedSize, setSelectedSize] = useState<string>('medium');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // TODO: Fetch own results based on comparisonScope and selectedScopeId
  const ownResult = mockOwnCompanyResult; // Use mock data for now

  // TODO: Fetch benchmark data based on selected filters (industry, size, region)
  const benchmarkData = mockBenchmarkItMedium; // Use mock data for now

  // TODO: Implement logic to calculate percentiles for own scores against benchmark distribution
  const calculatePercentile = (skill: string, score: number): number | string => {
    // Placeholder logic - requires actual benchmark distribution data
    if (!benchmarkData) return 'N/A';
    const p25 = benchmarkData.scores.percentiles.p25[skill];
    const p50 = benchmarkData.scores.percentiles.p50[skill];
    const p75 = benchmarkData.scores.percentiles.p75[skill];
    if (score >= p75) return '>75th';
    if (score >= p50) return '50th-75th';
    if (score >= p25) return '25th-50th';
    return '<25th';
  };

  // TODO: Implement logic to identify significant differences and suggest actions
  const getComparisonHighlight = (skill: string, score: number): React.ReactNode => {
    if (!benchmarkData) return null;
    const avg = benchmarkData.scores.average[skill];
    const diff = score - avg;
    // Example highlighting logic (adjust thresholds as needed)
    if (diff > 5) return <Badge variant="default" className="bg-green-500 hover:bg-green-600">強み (vs 平均)</Badge>;
    if (diff < -5) return <Badge variant="destructive">弱み (vs 平均)</Badge>;
    return null;
  };

  const getSuggestedActions = (skill: string, score: number): string[] => {
      // Placeholder logic - requires more sophisticated rules/AI
      if (!benchmarkData) return [];
      const avg = benchmarkData.scores.average[skill];
      if (score < avg - 5) { // Example condition for suggesting action
          switch (skill) {
              case '問題解決': return ['問題解決フレームワーク研修の受講', 'OJTでの実践機会の増加'];
              case '技術スキル': return ['最新技術トレンドの学習', '資格取得支援制度の活用'];
              default: return [`${skill}向上のための個別学習プラン検討`];
          }
      }
      return [];
  };


  // Placeholder for Comparison Chart
  const ComparisonChartPlaceholder = () => (
    <div className="h-80 p-4 bg-gray-100 rounded text-center text-gray-500 flex items-center justify-center">
      [比較チャート表示エリア: 自社スコア vs ベンチマーク平均/パーセンタイル]
      {/* TODO: Integrate a charting library (e.g., Bar chart, Radar chart) */}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">ベンチマークとの比較</h1>

      {/* Filter Selection Card */}
      <Card>
        <CardHeader>
          <CardTitle>比較対象とベンチマークの選択</CardTitle>
          <CardDescription>比較したい対象（自社全体、部署、個人）と、比較するベンチマークの条件を選択してください。</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Scope Selection */}
          <Select value={comparisonScope} onValueChange={(value) => setComparisonScope(value as any)}>
            <SelectTrigger>
              <SelectValue placeholder="比較対象を選択..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="company">自社全体</SelectItem>
              <SelectItem value="department">部署</SelectItem>
              {/* <SelectItem value="individual">個人</SelectItem> */}
              {/* TODO: If scope is department or individual, add another select to choose which one */}
            </SelectContent>
          </Select>

          {/* Benchmark Filters */}
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger>
              <SelectValue placeholder="業種を選択..." />
            </SelectTrigger>
            <SelectContent>
              {/* TODO: Populate with actual industry options */}
              <SelectItem value="all">全業種</SelectItem>
              <SelectItem value="it">IT・通信</SelectItem>
              <SelectItem value="manufacturing">製造業</SelectItem>
              <SelectItem value="finance">金融</SelectItem>
              <SelectItem value="retail">小売</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger>
              <SelectValue placeholder="企業規模を選択..." />
            </SelectTrigger>
            <SelectContent>
              {/* TODO: Populate with actual size options */}
              <SelectItem value="all">全規模</SelectItem>
              <SelectItem value="small">~100名</SelectItem>
              <SelectItem value="medium">100-500名</SelectItem>
              <SelectItem value="large">500名~</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger>
              <SelectValue placeholder="地域を選択..." />
            </SelectTrigger>
            <SelectContent>
              {/* TODO: Populate with actual region options */}
              <SelectItem value="all">全国</SelectItem>
              <SelectItem value="tokyo">東京都</SelectItem>
              <SelectItem value="osaka">大阪府</SelectItem>
              <SelectItem value="global">グローバル</SelectItem>
            </SelectContent>
          </Select>

          {/* TODO: Add a button to trigger comparison update if needed, or update automatically on change */}
          {/* <Button onClick={handleCompare}>比較実行</Button> */}
        </CardContent>
      </Card>

      {/* Comparison Results Card */}
      {ownResult && benchmarkData && (
        <Card>
          <CardHeader>
            <CardTitle>比較結果: {ownResult.name} vs {benchmarkData.name}</CardTitle>
            <CardDescription>選択されたベンチマークとの比較結果を表示します。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comparison Chart */}
            <ComparisonChartPlaceholder />

            {/* Comparison Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>スキル項目</TableHead>
                  <TableHead className="text-right">自社スコア</TableHead>
                  <TableHead className="text-right">ベンチマーク平均</TableHead>
                  <TableHead className="text-right">パーセンタイル</TableHead>
                  <TableHead>差異ハイライト</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(ownResult.scores).map(([skill, score]) => (
                  <TableRow key={skill}>
                    <TableCell className="font-medium">{skill}</TableCell>
                    <TableCell className="text-right">{score}</TableCell>
                    <TableCell className="text-right">{benchmarkData.scores.average[skill] ?? 'N/A'}</TableCell>
                    <TableCell className="text-right">{calculatePercentile(skill, score)}</TableCell>
                    <TableCell>{getComparisonHighlight(skill, score)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Strengths/Weaknesses Summary based on Benchmark */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <Card className="border-green-200 border-2">
                 <CardHeader><CardTitle className="text-green-700">相対的な強み (vs ベンチマーク)</CardTitle></CardHeader>
                 <CardContent>
                   <ul className="list-disc pl-5 space-y-1">
                     {Object.entries(ownResult.scores)
                       .filter(([skill, score]) => (benchmarkData.scores.average[skill] !== undefined && score > benchmarkData.scores.average[skill]! + 5)) // Example threshold
                       .map(([skill]) => <li key={skill}>{skill}</li>)
                     }
                     {Object.entries(ownResult.scores).filter(([skill, score]) => (benchmarkData.scores.average[skill] !== undefined && score > benchmarkData.scores.average[skill]! + 5)).length === 0 && (
                        <p className="text-sm text-muted-foreground">該当する項目はありません。</p>
                     )}
                   </ul>
                 </CardContent>
               </Card>
               <Card className="border-red-200 border-2">
                 <CardHeader><CardTitle className="text-red-700">相対的な弱み (vs ベンチマーク)</CardTitle></CardHeader>
                 <CardContent>
                   <ul className="list-disc pl-5 space-y-1">
                     {Object.entries(ownResult.scores)
                       .filter(([skill, score]) => (benchmarkData.scores.average[skill] !== undefined && score < benchmarkData.scores.average[skill]! - 5)) // Example threshold
                       .map(([skill]) => <li key={skill}>{skill}</li>)
                     }
                      {Object.entries(ownResult.scores).filter(([skill, score]) => (benchmarkData.scores.average[skill] !== undefined && score < benchmarkData.scores.average[skill]! - 5)).length === 0 && (
                        <p className="text-sm text-muted-foreground">該当する項目はありません。</p>
                     )}
                   </ul>
                 </CardContent>
               </Card>
            </div>

            {/* Suggested Actions */}
            <Card>
              <CardHeader>
                <CardTitle>改善のためのアクション提案</CardTitle>
                <CardDescription>ベンチマーク比較に基づき、特に差異が大きい項目について具体的なアクションを提案します。</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {Object.entries(ownResult.scores)
                    .flatMap(([skill, score]) =>
                      getSuggestedActions(skill, score).map((action, index) => (
                        <li key={`${skill}-${index}`} className="border-l-4 border-blue-500 pl-3 py-1">
                          <span className="font-semibold">{skill}:</span> {action}
                        </li>
                      ))
                    )
                  }
                   {Object.entries(ownResult.scores).flatMap(([skill, score]) => getSuggestedActions(skill, score)).length === 0 && (
                        <p className="text-sm text-muted-foreground">現在、具体的なアクション提案はありません。</p>
                   )}
                </ul>
              </CardContent>
            </Card>

          </CardContent>
        </Card>
      )}

      {/* Placeholder if no data is loaded */}
      {(!ownResult || !benchmarkData) && (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            比較対象とベンチマークを選択して、比較結果を表示してください。
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BenchmarkComparison;
