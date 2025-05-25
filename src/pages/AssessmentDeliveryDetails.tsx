import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockAssessmentDeliveries, getAssessmentDeliveries } from '@/data/mockAssessmentDeliveries';
import { AssessmentDelivery, getDeliveryStatusInfo } from '@/types/assessmentDelivery';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Edit, Send, BarChart3, Users } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format, differenceInDays, isBefore } from 'date-fns';
import AssessmentDeliverySettingsDialog from '@/components/AssessmentDeliverySettingsDialog'; // Import the dialog

// Placeholder for future components or detailed views
const DeliveryAnalyticsPlaceholder = () => (
  <div className="w-full h-48 bg-muted flex items-center justify-center rounded-md">
    <BarChart3 className="h-10 w-10 text-muted-foreground" />
    <p className="ml-3 text-muted-foreground">配信結果分析 (プレースホルダー)</p>
  </div>
);

const ParticipantListPlaceholder = () => (
  <div className="w-full h-32 bg-muted flex items-center justify-center rounded-md">
    <Users className="h-8 w-8 text-muted-foreground" />
    <p className="ml-3 text-muted-foreground">対象者一覧・個別進捗 (プレースホルダー)</p>
  </div>
);


export default function AssessmentDeliveryDetails() {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deliveryDetails, setDeliveryDetails] = useState<AssessmentDelivery | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!deliveryId) {
        console.error("Delivery ID is missing");
        setIsLoading(false);
        toast({ title: "エラー", description: "配信IDが見つかりません。", variant: "destructive" });
        navigate('/assessment-deliveries');
        return;
      }
      setIsLoading(true);
      try {
        const allDeliveries = await getAssessmentDeliveries();
        let foundDelivery = allDeliveries.find(d => d.deliveryId === deliveryId);

        if (foundDelivery) {
          const now = new Date();
          let currentStatus = foundDelivery.status;
          if (foundDelivery.status === 'scheduled' && isBefore(foundDelivery.deliveryStartDate, now)) {
            currentStatus = 'in-progress';
          }
          if (foundDelivery.status !== 'completed' && isBefore(foundDelivery.deliveryEndDate, now)) {
             if (foundDelivery.completedCount < foundDelivery.totalDelivered) {
                currentStatus = 'expired';
             } else {
                 currentStatus = 'completed';
             }
          }
          setDeliveryDetails({ ...foundDelivery, status: currentStatus });
        } else {
          toast({ title: "エラー", description: "アセスメント配信情報が見つかりません。", variant: "destructive" });
          navigate('/assessment-deliveries');
        }
      } catch (error) {
        console.error("Failed to fetch assessment delivery details:", error);
        toast({ title: "エラー", description: "配信詳細の取得に失敗しました。", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [deliveryId, navigate, toast]);

  const handleSendReminder = () => {
    if (!deliveryDetails) return;
    toast({
      title: "リマインダー送信 (Mock)",
      description: `「${deliveryDetails.assessment.title}」の未完了者にリマインダーを送信しました。`,
    });
  };

  const handleEditDelivery = () => {
    if (!deliveryDetails) return;
    setIsEditModalOpen(true);
  };

  const handleDeliverySettingsUpdated = (updatedData: AssessmentDelivery) => {
    // In a real app, you'd likely re-fetch or merge carefully.
    // For mock, we directly update the state.
    // The dialog returns Date objects for start/end dates.
    setDeliveryDetails(prevDetails => {
      if (!prevDetails) return null;
      // Ensure status is re-evaluated if dates change significantly
      const now = new Date();
      let newStatus = updatedData.status;
      if (updatedData.status === 'scheduled' && isBefore(updatedData.deliveryStartDate, now)) {
        newStatus = 'in-progress';
      }
      if (updatedData.status !== 'completed' && isBefore(updatedData.deliveryEndDate, now)) {
         if (updatedData.completedCount < updatedData.totalDelivered) {
            newStatus = 'expired';
         } else {
             newStatus = 'completed';
         }
      } else if (updatedData.status === 'expired' && isBefore(now, updatedData.deliveryEndDate)) {
        // If it was expired but end date is now in future, it becomes in-progress
        newStatus = 'in-progress';
      }


      return {
        ...prevDetails,
        ...updatedData,
        status: newStatus,
      };
    });
    // Update the global mock data (optional, for consistency if navigating away and back)
    const index = mockAssessmentDeliveries.findIndex(d => d.deliveryId === updatedData.deliveryId);
    if (index !== -1) {
      mockAssessmentDeliveries[index] = {
        ...mockAssessmentDeliveries[index],
        targetGroup: updatedData.targetGroup,
        deliveryStartDate: updatedData.deliveryStartDate,
        deliveryEndDate: updatedData.deliveryEndDate,
        // status will be updated on list page load or here if needed
      };
    }
    setIsEditModalOpen(false);
    // Toast is shown by the dialog itself upon successful save
  };


  if (isLoading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  if (!deliveryDetails) {
    return <div className="p-8 text-center text-red-600">アセスメント配信情報が見つかりません。</div>;
  }

  const statusInfo = getDeliveryStatusInfo(deliveryDetails.status);
  const progressPercentage = deliveryDetails.totalDelivered > 0 ? (deliveryDetails.completedCount / deliveryDetails.totalDelivered) * 100 : 0;
  const daysRemaining = differenceInDays(deliveryDetails.deliveryEndDate, new Date());
  const isNearExpiry = deliveryDetails.status === 'in-progress' && daysRemaining >= 0 && daysRemaining <= 3;
  const isExpired = deliveryDetails.status === 'expired' || (deliveryDetails.status !== 'completed' && isBefore(deliveryDetails.deliveryEndDate, new Date()));


  return (
    <div className="p-4 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => navigate('/assessment-deliveries')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-semibold">アセスメント配信詳細</h1>
        <div className="w-10"></div>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl">{deliveryDetails.assessment.title}</CardTitle>
              <CardDescription>配信ID: {deliveryDetails.deliveryId}</CardDescription>
            </div>
            <Badge variant={statusInfo.variant} className="text-sm px-3 py-1 self-start sm:self-center">
              {statusInfo.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div><span className="font-medium text-muted-foreground">対象グループ/部署:</span> {deliveryDetails.targetGroup}</div>
            <div><span className="font-medium text-muted-foreground">作成者:</span> {deliveryDetails.createdBy}</div>
            <div>
              <span className="font-medium text-muted-foreground">配信開始日:</span> {format(deliveryDetails.deliveryStartDate, 'yyyy/MM/dd HH:mm')}
            </div>
            <div>
              <span className="font-medium text-muted-foreground">配信終了日:</span> {format(deliveryDetails.deliveryEndDate, 'yyyy/MM/dd HH:mm')}
              {isNearExpiry && <Badge variant="destructive" className="ml-2 animate-pulse">期限間近</Badge>}
              {isExpired && deliveryDetails.status !== 'completed' && <Badge variant="destructive" className="ml-2">期限切れ</Badge>}
            </div>
            <div><span className="font-medium text-muted-foreground">作成日時:</span> {format(deliveryDetails.createdAt, 'yyyy/MM/dd HH:mm')}</div>
            <div>
                <span className="font-medium text-muted-foreground">アセスメント所要時間:</span> 約{deliveryDetails.assessment.estimatedTime}分
            </div>
          </div>

          <Separator className="my-4" />

          <div>
            <h3 className="text-md font-semibold mb-2">進捗状況</h3>
            <div className="flex items-center justify-between text-sm mb-1">
              <span>完了: {deliveryDetails.completedCount} / 対象: {deliveryDetails.totalDelivered}</span>
              <span>未完了: {deliveryDetails.incompleteCount}</span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
            {deliveryDetails.status === 'in-progress' && !isNearExpiry && !isExpired && daysRemaining > 0 && (
              <p className="text-xs text-muted-foreground mt-1">残り {daysRemaining} 日</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex flex-wrap gap-2 justify-end">
          <Button variant="outline" onClick={handleEditDelivery}>
            <Edit className="mr-2 h-4 w-4" />
            配信設定を編集
          </Button>
          <Button
            onClick={handleSendReminder}
            disabled={deliveryDetails.status === 'completed' || deliveryDetails.status === 'scheduled' || deliveryDetails.status === 'expired'}
          >
            <Send className="mr-2 h-4 w-4" />
            リマインダー送信
          </Button>
          <Button variant="outline" disabled>
            <BarChart3 className="mr-2 h-4 w-4" />
            結果を見る (未実装)
          </Button>
        </CardFooter>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5" />対象者リストと進捗</CardTitle>
          <CardDescription>この配信の対象者一覧と個別の進捗状況を確認します。</CardDescription>
        </CardHeader>
        <CardContent>
          <ParticipantListPlaceholder />
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="flex items-center"><BarChart3 className="mr-2 h-5 w-5" />配信結果分析</CardTitle>
          <CardDescription>この配信の結果に関する集計や分析を表示します。</CardDescription>
        </CardHeader>
        <CardContent>
          <DeliveryAnalyticsPlaceholder />
        </CardContent>
      </Card>

      {deliveryDetails && (
        <AssessmentDeliverySettingsDialog
          mode="edit"
          deliveryForEdit={deliveryDetails}
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          onSave={handleDeliverySettingsUpdated}
        />
      )}
    </div>
  );
}
