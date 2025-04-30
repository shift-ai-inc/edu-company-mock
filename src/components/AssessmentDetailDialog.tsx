import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area'; // Assuming you have this or similar
import { Separator } from '@/components/ui/separator';
import { AssessmentDetail, getDifficultyText, getSkillLevelText } from '@/types/assessment';
import { Clock, BarChart3, Target, Brain, Activity, CalendarCheck, Percent } from 'lucide-react';

interface AssessmentDetailDialogProps {
  assessment: AssessmentDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AssessmentDetailDialog({ assessment, isOpen, onClose }: AssessmentDetailDialogProps) {
  if (!assessment) return null;

  const totalQuestions = assessment.categories.reduce((sum, cat) => sum + cat.questionCount, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl mb-1">{assessment.title}</DialogTitle>
          <DialogDescription className="text-sm">
            {assessment.description}
          </DialogDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline">{assessment.type}</Badge>
            <Badge variant="outline">{getDifficultyText(assessment.difficulty)}</Badge>
            <Badge variant="outline">{getSkillLevelText(assessment.skillLevel)}</Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> 推定 {assessment.estimatedTime}分
            </Badge>
             <Badge variant="secondary" className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" /> 全 {totalQuestions} 問
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="py-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">概要</TabsTrigger>
            <TabsTrigger value="structure">構成</TabsTrigger>
            <TabsTrigger value="samples">サンプル</TabsTrigger>
            <TabsTrigger value="stats">統計</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px] mt-4 pr-4"> {/* Adjust height as needed */}
            <TabsContent value="overview">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center"><Target className="mr-2 h-4 w-4" />対象スキル</h4>
                  <div className="flex flex-wrap gap-1">
                    {assessment.targetSkills.map(skill => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                 <div>
                  <h4 className="font-semibold mb-2 flex items-center"><Brain className="mr-2 h-4 w-4" />測定可能な能力</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                     {assessment.measurableAbilities.map(ability => (
                       <li key={ability}>{ability}</li>
                     ))}
                  </ul>
                </div>
                <Separator />
                 <div>
                  <h4 className="font-semibold mb-2">タグ</h4>
                   <div className="flex flex-wrap gap-1">
                    {assessment.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                 </div>
              </div>
            </TabsContent>

            <TabsContent value="structure">
               <div className="space-y-4">
                 <div>
                   <h4 className="font-semibold mb-2">全体構成</h4>
                   <p className="text-sm text-muted-foreground">{assessment.structureDescription}</p>
                 </div>
                 <Separator />
                 <div>
                   <h4 className="font-semibold mb-2">カテゴリ別問題数</h4>
                   <ul className="list-none space-y-1 text-sm">
                     {assessment.categories.map(cat => (
                       <li key={cat.name} className="flex justify-between">
                         <span>{cat.name}</span>
                         <span className="text-muted-foreground">{cat.questionCount} 問</span>
                       </li>
                     ))}
                      <li className="flex justify-between font-medium border-t pt-1 mt-1">
                         <span>合計</span>
                         <span>{totalQuestions} 問</span>
                       </li>
                   </ul>
                 </div>
                 <Separator />
                 <div>
                   <h4 className="font-semibold mb-2">難易度分布</h4>
                   <div className="flex space-x-4 text-sm">
                      <span>易しい: {assessment.difficultyDistribution.easy} 問</span>
                      <span>普通: {assessment.difficultyDistribution.medium} 問</span>
                      <span>難しい: {assessment.difficultyDistribution.hard} 問</span>
                   </div>
                   {/* Consider adding a simple bar chart visualization here later */}
                 </div>
               </div>
            </TabsContent>

            <TabsContent value="samples">
               <div className="space-y-4">
                 <h4 className="font-semibold mb-2">サンプル問題</h4>
                 {assessment.sampleQuestions.length > 0 ? (
                   assessment.sampleQuestions.map((q, index) => (
                     <div key={q.id} className="p-3 border rounded-md bg-muted/50">
                       <p className="text-sm font-medium mb-1">サンプル {index + 1} ({q.type})</p>
                       <p className="text-sm text-muted-foreground">{q.text}</p>
                     </div>
                   ))
                 ) : (
                   <p className="text-sm text-muted-foreground">利用可能なサンプル問題はありません。</p>
                 )}
               </div>
            </TabsContent>

            <TabsContent value="stats">
               <div className="space-y-3 text-sm">
                 <h4 className="font-semibold mb-2 flex items-center"><Activity className="mr-2 h-4 w-4" />過去の実績</h4>
                 <div className="flex items-center justify-between">
                   <span className="text-muted-foreground">総配信回数:</span>
                   <span>{assessment.statistics.totalDeliveries.toLocaleString()} 回</span>
                 </div>
                 {assessment.statistics.averageScore !== undefined && (
                   <div className="flex items-center justify-between">
                     <span className="text-muted-foreground">平均スコア:</span>
                     <span>{assessment.statistics.averageScore.toFixed(1)} 点</span>
                   </div>
                 )}
                 {assessment.statistics.completionRate !== undefined && (
                   <div className="flex items-center justify-between">
                     <span className="text-muted-foreground flex items-center"><Percent className="mr-1 h-3 w-3" />完了率:</span>
                     <span>{assessment.statistics.completionRate.toFixed(1)} %</span>
                   </div>
                 )}
                  {assessment.statistics.lastDelivered && (
                   <div className="flex items-center justify-between">
                     <span className="text-muted-foreground flex items-center"><CalendarCheck className="mr-1 h-3 w-3" />最終配信日:</span>
                     <span>{assessment.statistics.lastDelivered}</span>
                   </div>
                 )}
                 {!assessment.statistics.lastDelivered && (
                    <p className="text-muted-foreground text-xs italic">まだ配信実績はありません。</p>
                 )}
               </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>閉じる</Button>
          {/* Maybe add an "Assign" button here too? Or keep it only on the card */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
