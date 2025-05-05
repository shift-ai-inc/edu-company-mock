import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockGroups, Group } from '@/data/mockGroups';
import { BarChart, Users, TrendingUp, Target } from 'lucide-react';

// Define the structure for group results data
interface GroupResult {
  groupId: string;
  groupName: string;
  averageScore: number;
  completionRate: number;
  highestArea: string;
  lowestArea: string;
  trend: number; // Positive or negative trend percentage
}

// Mock function to generate results for selected groups and time period
const generateMockResults = (groupIds: string[], timePeriod: string): GroupResult[] => {
  console.log(`Generating mock results for groups: ${groupIds.join(', ')} and time period: ${timePeriod}`);
  // 日本語の分野名を追加
  const areas = ['コミュニケーション', '問題解決', 'チームワーク', 'リーダーシップ'];
  return groupIds.map(id => {
    const group = mockGroups.find(g => g.id === id);
    if (!group) return null;

    const baseScore = 50 + (parseInt(id, 16) % 30);
    const timeFactor = timePeriod === 'last3months' ? 1 : timePeriod === 'last6months' ? 1.1 : 1.2;
    const randomFactor = Math.random() * 10 - 5;

    return {
      groupId: id,
      groupName: group.name,
      averageScore: Math.max(0, Math.min(100, Math.round(baseScore * timeFactor + randomFactor))),
      completionRate: Math.max(60, Math.min(100, Math.round(80 * timeFactor + Math.random() * 20))),
      highestArea: areas[parseInt(id, 16) % 4], // 日本語の分野名を使用
      lowestArea: areas[(parseInt(id, 16) + 1) % 4], // 日本語の分野名を使用 (Lowest Areaも調整)
      trend: Math.round((Math.random() * 10 - 4) * (timeFactor > 1 ? 1.5 : 1)),
    };
  }).filter((result): result is GroupResult => result !== null);
};


const GroupResults: React.FC = () => {
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>(mockGroups.map(g => g.id));
  const [timePeriod, setTimePeriod] = useState<string>('last6months');

  const handleCheckboxChange = (groupId: string, checked: boolean) => {
    setSelectedGroupIds(prev =>
      checked ? [...prev, groupId] : prev.filter(id => id !== groupId)
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedGroupIds(checked ? mockGroups.map(g => g.id) : []);
  };

  const results = useMemo(() => {
    return generateMockResults(selectedGroupIds, timePeriod);
  }, [selectedGroupIds, timePeriod]);

  const renderAsciiChart = (data: GroupResult[]) => {
    if (!data.length) return "表示するデータがありません。";
    let chart = "グループ平均スコア:\n";
    const maxScore = 100;
    const scale = 50;

    data.forEach(item => {
      const barLength = Math.round((item.averageScore / maxScore) * scale);
      const bar = '#'.repeat(barLength);
      const padding = ' '.repeat(scale - barLength);
      // グループ名の長さを考慮してパディングを調整 (例: 20文字まで)
      const groupNamePadded = item.groupName.padEnd(20);
      chart += `${groupNamePadded} |${bar}${padding}| ${item.averageScore}%\n`;
    });
    return chart;
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">グループ結果分析</h1>

      <Card>
        <CardHeader>
          <CardTitle>フィルター</CardTitle>
          <CardDescription>分析するグループと期間を選択してください。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label htmlFor="time-period">期間:</Label>
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger id="time-period" className="w-[180px]">
                <SelectValue placeholder="期間を選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last3months">過去3ヶ月</SelectItem>
                <SelectItem value="last6months">過去6ヶ月</SelectItem>
                <SelectItem value="last12months">過去12ヶ月</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>グループ選択:</Label>
            <div className="mt-2 p-4 border rounded-md max-h-60 overflow-y-auto space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="select-all"
                  checked={selectedGroupIds.length === mockGroups.length}
                  onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                />
                <Label htmlFor="select-all" className="font-medium">すべて選択</Label>
              </div>
              <hr className="my-2" />
              {mockGroups.map((group) => (
                <div key={group.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`group-${group.id}`}
                    checked={selectedGroupIds.includes(group.id)}
                    onCheckedChange={(checked) => handleCheckboxChange(group.id, Boolean(checked))}
                  />
                  <Label htmlFor={`group-${group.id}`}>{group.name}</Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Display Area */}
      <Card>
        <CardHeader>
          <CardTitle>分析結果</CardTitle>
          <CardDescription>選択されたグループと期間の結果を表示しています。</CardDescription>
        </CardHeader>
        <CardContent>
          {results.length > 0 ? (
            <div className="space-y-4">
              {/* Placeholder for actual charts/visualizations */}
              <div className="p-4 bg-gray-50 rounded border">
                <h3 className="font-semibold mb-2 flex items-center"><BarChart className="mr-2 h-5 w-5" /> スコア比較 (プレースホルダー)</h3>
                <pre className="text-xs font-mono whitespace-pre-wrap">{renderAsciiChart(results)}</pre>
                <p className="text-sm text-muted-foreground mt-2">注: これはプレースホルダーのASCIIチャートです。実際のチャートコンポーネントに置き換えてください。</p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map(result => (
                  <Card key={result.groupId} className="bg-card">
                    <CardHeader>
                      <CardTitle className="text-lg">{result.groupName}</CardTitle>
                      <CardDescription>分析サマリー</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                      <p className="flex items-center"><Users className="mr-2 h-4 w-4 text-blue-500" /> 平均スコア: <strong>{result.averageScore}%</strong></p>
                      <p className="flex items-center"><TrendingUp className="mr-2 h-4 w-4 text-green-500" /> 完了率: <strong>{result.completionRate}%</strong></p>
                      <p className="flex items-center"><Target className="mr-2 h-4 w-4 text-yellow-500" /> 最も高い分野: {result.highestArea}</p>
                      <p className="flex items-center"><Target className="mr-2 h-4 w-4 text-red-500" /> 最も低い分野: {result.lowestArea}</p>
                      <p className="flex items-center">
                        傾向: <span className={`ml-1 font-semibold ${result.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {result.trend >= 0 ? `+${result.trend}` : result.trend}%
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <p>グループが選択されていないか、選択された基準で利用可能なデータがありません。</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupResults;
