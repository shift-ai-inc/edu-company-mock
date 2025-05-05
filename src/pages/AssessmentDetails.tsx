import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAssessmentDetail } from '@/data/mockAssessmentDetails';
import { AssessmentDetail, getDifficultyText, getSkillLevelText } from '@/types/assessment';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, BarChart2, Target, Brain, HelpCircle, ListChecks, PieChart, CheckSquare, Send, Info, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateAssessmentDeliveryDialog from '@/components/CreateAssessmentDeliveryDialog';
import { useToast } from "@/hooks/use-toast";

export default function AssessmentDetails() {
  // Correctly extract 'assessmentId' from the route parameters
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDeliveryDialogOpen, setIsCreateDeliveryDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Use 'assessmentId' for checks and fetching
    if (!assessmentId) {
      setError("アセスメントIDが指定されていません。");
      setIsLoading(false);
      return;
    }

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Use 'assessmentId' to fetch details
        const details = await getAssessmentDetail(assessmentId);
        if (details) {
          setAssessment(details);
        } else {
          setError("アセスメントが見つかりませんでした。");
        }
      } catch (err) {
        console.error("Failed to fetch assessment details:", err);
        setError("データの取得中にエラーが発生しました。");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [assessmentId]); // Dependency array uses 'assessmentId'

  const handleConfigureDeliveryClick = () => {
    if (assessment) {
      setIsCreateDeliveryDialogOpen(true);
    }
  };

  const handleDeliveryCreated = (details: any) => {
     console.log("Delivery creation successful (from details page):", details);
     // Toast is handled within the dialog component
     // Optionally navigate or refresh data here
  };


  if (isLoading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  if (error) {
     return (
        <div className="p-8">
             <Button variant="outline" size="sm" onClick={() => navigate('/assessments')} className="mb-4">
               <ArrowLeft className="mr-2 h-4 w-4" />
               一覧に戻る
             </Button>
             <Alert variant="destructive">
               <Info className="h-4 w-4" />
               <AlertTitle>エラー</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
        </div>
     );
  }

  if (!assessment) {
    return <div className="p-8 text-center">アセスメントデータが見つかりません。</div>;
  }

  const totalQuestions = assessment.categories.reduce((sum, cat) => sum + cat.questionCount, 0);
  const totalDifficulty = Object.values(assessment.difficultyDistribution).reduce((sum, count) => sum + count, 0);

  return (
    <div className="container mx-auto p-6 lg:p-8 space-y-6">
       {/* Back Button and Actions */}
       <div className="flex justify-between items-center mb-4">
         <Button variant="outline" size="sm" onClick={() => navigate('/assessments')}>
           <ArrowLeft className="mr-2 h-4 w-4" />
           アセスメント一覧に戻る
         </Button>
         <Button size="sm" onClick={handleConfigureDeliveryClick}>
            <Send className="mr-1.5 h-4 w-4" />
            このアセスメントを配信設定
         </Button>
       </div>

      {/* Main Header Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-muted/30 p-6">
          <div className="flex flex-col md:flex-row md:items-start md:gap-6">
            {/* Thumbnail can be added here if needed */}
            {/* <img src={assessment.thumbnailUrl || 'https://via.placeholder.com/100'} alt={assessment.title} className="w-24 h-24 rounded-md object-cover mb-4 md:mb-0" /> */}
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant="secondary">{assessment.category}</Badge>
                <Badge variant="outline">{assessment.type}</Badge>
                {assessment.isPopular && <Badge variant="default" className="bg-yellow-500 text-white">人気</Badge>}
                {assessment.isRecommended && <Badge variant="default" className="bg-green-500 text-white">推奨</Badge>}
              </div>
              <CardTitle className="text-2xl font-bold mb-1">{assessment.title}</CardTitle>
              <CardDescription className="text-base">{assessment.description}</CardDescription>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  <span>所要時間: 約{assessment.estimatedTime}分</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="h-4 w-4" />
                  <span>難易度: {getDifficultyText(assessment.difficulty)}</span>
                </div>
                 <div className="flex items-center gap-1.5">
                   <Users className="h-4 w-4" />
                   <span>対象レベル: {getSkillLevelText(assessment.skillLevel)}</span>
                 </div>
              </div>
               <div className="mt-2 flex flex-wrap gap-1">
                 {assessment.tags.map(tag => (
                   <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                 ))}
               </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Structure, Categories, Difficulty) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Structure Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListChecks className="h-5 w-5 text-primary" />
                アセスメント構成
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{assessment.structureDescription}</p>
              <Separator className="my-4" />
              <h4 className="font-semibold mb-3 text-base">カテゴリ別問題数 (全{totalQuestions}問)</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>カテゴリ名</TableHead>
                    <TableHead className="text-right">問題数</TableHead>
                    <TableHead className="w-[100px] text-right">割合</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessment.categories.map((cat) => (
                    <TableRow key={cat.name}>
                      <TableCell>{cat.name}</TableCell>
                      <TableCell className="text-right">{cat.questionCount}問</TableCell>
                      <TableCell className="text-right">
                        {totalQuestions > 0 ? ((cat.questionCount / totalQuestions) * 100).toFixed(1) : 0}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Separator className="my-4" />
               <h4 className="font-semibold mb-3 text-base">難易度分布 (全{totalDifficulty}問)</h4>
               {totalDifficulty > 0 ? (
                 <div className="space-y-2">
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span>易しい</span>
                       <span>{assessment.difficultyDistribution.easy}問 ({((assessment.difficultyDistribution.easy / totalDifficulty) * 100).toFixed(1)}%)</span>
                     </div>
                     <Progress value={(assessment.difficultyDistribution.easy / totalDifficulty) * 100} className="h-2 bg-green-500" />
                   </div>
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span>普通</span>
                       <span>{assessment.difficultyDistribution.medium}問 ({((assessment.difficultyDistribution.medium / totalDifficulty) * 100).toFixed(1)}%)</span>
                     </div>
                     <Progress value={(assessment.difficultyDistribution.medium / totalDifficulty) * 100} className="h-2 bg-yellow-500" />
                   </div>
                   <div>
                     <div className="flex justify-between text-sm mb-1">
                       <span>難しい</span>
                       <span>{assessment.difficultyDistribution.hard}問 ({((assessment.difficultyDistribution.hard / totalDifficulty) * 100).toFixed(1)}%)</span>
                     </div>
                     <Progress value={(assessment.difficultyDistribution.hard / totalDifficulty) * 100} className="h-2 bg-red-500" />
                   </div>
                 </div>
               ) : (
                 <p className="text-muted-foreground text-sm">難易度分布情報はありません。</p>
               )}
            </CardContent>
          </Card>

          {/* Sample Questions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckSquare className="h-5 w-5 text-primary" />
                サンプル問題
              </CardTitle>
              <CardDescription>実際の問題形式の例を確認できます。</CardDescription>
            </CardHeader>
            <CardContent>
              {assessment.sampleQuestions.length > 0 ? (
                <ul className="space-y-4">
                  {assessment.sampleQuestions.map((q, index) => (
                    <li key={q.id} className="border p-4 rounded-md bg-muted/20">
                      <p className="font-medium mb-1">サンプル {index + 1}</p>
                      <p className="text-sm mb-2">{q.text}</p>
                      <Badge variant="outline" className="text-xs">形式: {q.type}</Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">サンプル問題はありません。</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (Skills, Abilities, Stats) */}
        <div className="space-y-6">
          {/* Target Skills Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                対象スキル
              </CardTitle>
            </CardHeader>
            <CardContent>
              {assessment.targetSkills.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {assessment.targetSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              ) : (
                 <p className="text-muted-foreground text-sm">対象スキル情報はありません。</p>
              )}
            </CardContent>
          </Card>

          {/* Measurable Abilities Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-primary" />
                測定可能な能力
              </CardTitle>
            </CardHeader>
            <CardContent>
               {assessment.measurableAbilities.length > 0 ? (
                 <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                   {assessment.measurableAbilities.map((ability, index) => (
                     <li key={index}>{ability}</li>
                   ))}
                 </ul>
               ) : (
                  <p className="text-muted-foreground text-sm">測定可能な能力情報はありません。</p>
               )}
            </CardContent>
          </Card>

          {/* Statistics Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart2 className="h-5 w-5 text-primary" />
                統計情報
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">総配信回数:</span>
                <span className="font-medium">{assessment.statistics.totalDeliveries?.toLocaleString() ?? 'N/A'} 回</span>
              </div>
              {assessment.statistics.averageScore !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">平均スコア:</span>
                  <span className="font-medium">{assessment.statistics.averageScore.toFixed(1)} 点</span>
                </div>
              )}
              {assessment.statistics.completionRate !== undefined && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">完了率:</span>
                  <span className="font-medium">{assessment.statistics.completionRate.toFixed(1)} %</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">最終配信日:</span>
                <span className="font-medium">{assessment.statistics.lastDelivered ? new Date(assessment.statistics.lastDelivered).toLocaleDateString() : 'N/A'}</span>
              </div>
               <div className="flex justify-between">
                 <span className="text-muted-foreground">総利用回数 (参考):</span>
                 <span className="font-medium">{assessment.usageCount?.toLocaleString() ?? 'N/A'} 回</span>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

       {/* Create Assessment Delivery Dialog */}
       <CreateAssessmentDeliveryDialog
         assessment={assessment} // Pass the full detail object
         open={isCreateDeliveryDialogOpen}
         onOpenChange={setIsCreateDeliveryDialogOpen}
         onDeliveryCreated={handleDeliveryCreated}
       />
    </div>
  );
}
