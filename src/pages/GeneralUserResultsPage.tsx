import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress"; // For goal tracking visualization
import { Download, FileText } from 'lucide-react'; // Icons for buttons

// Placeholder data structure - replace with actual data fetching and types
interface UserResultData {
  userId: string;
  userName: string; // May need anonymization based on viewer permissions
  assessmentName: string;
  date: string;
  scores: { [key: string]: number }; // e.g., { 'Leadership': 80, 'Communication': 75, ... }
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  averageScores?: { [key: string]: number }; // For comparison
  historicalData?: { date: string; scores: { [key: string]: number } }[];
  goals?: { description: string; targetScore?: number; currentProgress?: number; deadline?: string }[];
}

// Mock data for demonstration
const mockUserResult: UserResultData = {
  userId: 'user123',
  userName: '山田 太郎', // Displayed based on permissions
  assessmentName: 'リーダーシップスキル評価 2024 Q1',
  date: '2024-03-15',
  scores: {
    '戦略思考': 70,
    'チーム指導': 85,
    'コミュニケーション': 75,
    '問題解決': 65,
    '意思決定': 80,
  },
  strengths: ['チーム指導', '意思決定'],
  weaknesses: ['問題解決'],
  recommendations: [
    '問題解決能力向上のための研修参加を推奨します。',
    'コミュニケーションスキルを活かして、部門間の連携を強化しましょう。',
  ],
  averageScores: {
    '戦略思考': 68,
    'チーム指導': 78,
    'コミュニケーション': 72,
    '問題解決': 70,
    '意思決定': 75,
  },
  historicalData: [
    { date: '2023-09-15', scores: { '戦略思考': 65, 'チーム指導': 80, 'コミュニケーション': 70, '問題解決': 60, '意思決定': 78 } },
    { date: '2024-03-15', scores: { '戦略思考': 70, 'チーム指導': 85, 'コミュニケーション': 75, '問題解決': 65, '意思決定': 80 } },
  ],
  goals: [
    { description: '問題解決スキルを向上させ、スコア75を目指す', targetScore: 75, currentProgress: 65, deadline: '2024-09-30' },
    { description: '部門横断プロジェクトを主導する', deadline: '2024-12-31' },
  ],
};


const GeneralUserResultsPage: React.FC = () => {
  // TODO: Implement actual user selection and data fetching based on permissions
  // TODO: Implement access control check here - redirect or show error if not authorized
  const [selectedResultDate, setSelectedResultDate] = useState<string>(mockUserResult.date); // Example state for selecting results
  const userResult = mockUserResult; // Use mock data for now

  const handleDownloadPdf = () => {
    // TODO: Implement PDF generation logic
    console.log("Downloading PDF for:", userResult.userName, selectedResultDate);
    alert("PDFダウンロード機能は未実装です。");
  };

  const handleGenerateSummary = () => {
    // TODO: Implement 1on1 summary generation logic
    console.log("Generating 1on1 summary for:", userResult.userName, selectedResultDate);
    alert("1on1サマリー生成機能は未実装です。");
  };

  // Placeholder for Radar Chart component
  const RadarChartPlaceholder = () => (
    <div className="h-64 lg:h-80 p-4 bg-gray-100 rounded text-center text-gray-500 flex items-center justify-center">
      [レーダーチャート表示エリア]
      {/* TODO: Integrate a charting library (e.g., Recharts, Chart.js) */}
    </div>
  );

  // Placeholder for Time Series Chart component
  const TimeSeriesChartPlaceholder = () => (
    <div className="h-64 p-4 bg-gray-100 rounded text-center text-gray-500 flex items-center justify-center">
      [経時変化グラフ表示エリア]
      {/* TODO: Integrate a charting library */}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* User Info and Result Selection */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>個別ユーザー結果詳細</CardTitle>
            {/* TODO: Display user name based on permissions */}
            <CardDescription>ユーザー: {userResult.userName}</CardDescription>
          </div>
          {/* TODO: Populate Select with available result dates for this user */}
          <Select value={selectedResultDate} onValueChange={setSelectedResultDate}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="結果を選択" />
            </SelectTrigger>
            <SelectContent>
              {userResult.historicalData?.map(data => (
                 <SelectItem key={data.date} value={data.date}>
                   {userResult.assessmentName.replace(/ \d{4} Q\d/, '')} ({data.date}) {/* Example naming */}
                 </SelectItem>
              ))}
              {/* Add current result if not in history */}
              {!userResult.historicalData?.some(h => h.date === userResult.date) && (
                 <SelectItem value={userResult.date}>
                   {userResult.assessmentName} ({userResult.date})
                 </SelectItem>
              )}
            </SelectContent>
          </Select>
        </CardHeader>
      </Card>

      {/* Main Content Area with Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-5">
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="details">詳細分析</TabsTrigger>
          <TabsTrigger value="comparison">比較</TabsTrigger>
          <TabsTrigger value="goals">目標</TabsTrigger>
          <TabsTrigger value="actions">アクション</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>スキル概要（レーダーチャート）</CardTitle>
              <CardDescription>{userResult.assessmentName} ({selectedResultDate})</CardDescription>
            </CardHeader>
            <CardContent>
              <RadarChartPlaceholder />
              {/* TODO: Pass selected result data to the chart */}
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>強み</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {userResult.strengths.map((strength, index) => <li key={index}>{strength}</li>)}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>弱み（改善領域）</CardTitle></CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1">
                  {userResult.weaknesses.map((weakness, index) => <li key={index}>{weakness}</li>)}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6 mt-4">
          <Card>
            <CardHeader><CardTitle>改善推奨事項</CardTitle></CardHeader>
            <CardContent>
              <ul className="list-decimal pl-5 space-y-2">
                {userResult.recommendations.map((rec, index) => <li key={index}>{rec}</li>)}
              </ul>
            </CardContent>
          </Card>
          {/* Add more detailed score breakdowns if necessary */}
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="space-y-6 mt-4">
          <Card>
            <CardHeader><CardTitle>平均との比較</CardTitle></CardHeader>
            <CardContent>
              {/* TODO: Implement comparison visualization (e.g., bar chart, table) */}
              <div className="space-y-2">
                {Object.entries(userResult.scores).map(([skill, score]) => (
                  <div key={skill}>
                    <span className="font-medium">{skill}:</span> {score}
                    {userResult.averageScores && (
                      <span className="text-sm text-muted-foreground ml-2">
                        (平均: {userResult.averageScores[skill] ?? 'N/A'})
                        {userResult.averageScores[skill] !== undefined && score > userResult.averageScores[skill]! && <span className="text-green-600"> ↑</span>}
                        {userResult.averageScores[skill] !== undefined && score < userResult.averageScores[skill]! && <span className="text-red-600"> ↓</span>}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-gray-100 rounded text-center text-gray-500">
                [平均比較グラフ表示エリア]
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>経時変化</CardTitle></CardHeader>
            <CardContent>
              <TimeSeriesChartPlaceholder />
              {/* TODO: Pass historical data to the chart */}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="space-y-6 mt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>目標設定と達成度</CardTitle>
              <Button size="sm">新しい目標を設定</Button> {/* TODO: Implement goal setting modal/form */}
            </CardHeader>
            <CardContent>
              {userResult.goals && userResult.goals.length > 0 ? (
                <ul className="space-y-4">
                  {userResult.goals.map((goal, index) => (
                    <li key={index} className="border p-4 rounded-md">
                      <p className="font-medium">{goal.description}</p>
                      {goal.targetScore !== undefined && goal.currentProgress !== undefined && (
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>進捗</span>
                            <span>{goal.currentProgress} / {goal.targetScore}</span>
                          </div>
                          <Progress value={(goal.currentProgress / goal.targetScore) * 100} className="w-full" />
                        </div>
                      )}
                      {goal.deadline && <p className="text-sm text-muted-foreground mt-1">期限: {goal.deadline}</p>}
                       {/* TODO: Add Edit/Delete buttons */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>設定されている目標はありません。</p>
              )}
              <div className="mt-4 p-4 bg-gray-100 rounded text-center text-gray-500">
                [目標達成度グラフ表示エリア - オプション]
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Actions Tab */}
        <TabsContent value="actions" className="space-y-6 mt-4">
          <Card>
            <CardHeader><CardTitle>レポートと面談</CardTitle></CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-4">
              <Button onClick={handleDownloadPdf} className="w-full md:w-auto">
                <Download className="mr-2 h-4 w-4" /> PDFダウンロード
              </Button>
              <Button onClick={handleGenerateSummary} variant="outline" className="w-full md:w-auto">
                <FileText className="mr-2 h-4 w-4" /> 1on1サマリー生成
              </Button>
            </CardContent>
            <CardContent className="mt-4">
              <p className="text-sm text-muted-foreground">
                結果レポートをダウンロードしたり、1on1面談用のサマリーシートを生成したりできます。<br/>
                （これらの機能は現在プレースホルダーです）
              </p>
            </CardContent>
          </Card>
          {/* Add other action-related items if needed */}
        </TabsContent>
      </Tabs>

      {/* Access Control Note */}
      {/*
        IMPORTANT: Access Control Implementation Needed!
        - Data fetching logic must verify if the logged-in user has permission to view this specific user's results.
        - This might involve checking manager-subordinate relationships or specific roles/permissions.
        - Sensitive information like user name might need to be anonymized depending on the viewer's role.
      */}
    </div>
  );
};

export default GeneralUserResultsPage;
