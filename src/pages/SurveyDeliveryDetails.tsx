import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSurveyDeliveryDetails, mockSurveyDeliveries } from '@/data/mockSurveyDeliveries'; // Assuming mock data source
import { SurveyDelivery, DeliveryStatus, RecurrenceFrequency, getSurveyDeliveryStatusInfo, getFrequencyText } from '@/types/surveyDelivery';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Play, Pause, BarChart, Users, CalendarClock, Repeat, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns'; // For date formatting

// Placeholder for Trend Chart Component
const TrendChartPlaceholder = () => (
  <div className="w-full h-64 bg-muted flex items-center justify-center rounded-md">
    <BarChart className="h-12 w-12 text-muted-foreground" />
    <p className="ml-4 text-muted-foreground">トレンド分析グラフ (プレースホルダー)</p>
  </div>
);

// Placeholder for Delivery History Data
const mockDeliveryHistory = [
  { instanceId: 'sdel-inst-005', date: '2024/07/01 09:00', status: '完了', completed: 45, total: 50 },
  { instanceId: 'sdel-inst-004', date: '2024/06/01 09:00', status: '完了', completed: 48, total: 50 },
  { instanceId: 'sdel-inst-003', date: '2024/05/01 09:00', status: '完了', completed: 42, total: 48 },
  // ... more history
];

export default function SurveyDeliveryDetails() {
  const { deliveryId } = useParams<{ deliveryId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deliveryDetails, setDeliveryDetails] = useState<(SurveyDelivery & { status: DeliveryStatus | 'paused' | 'cancelled' }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDynamicGroup, setIsDynamicGroup] = useState(false); // Local state for toggle simulation

  useEffect(() => {
    const fetchDetails = async () => {
      if (!deliveryId) {
        console.error("Delivery ID is missing");
        setIsLoading(false);
        toast({ title: "エラー", description: "配信IDが見つかりません。", variant: "destructive" });
        navigate('/survey-deliveries'); // Redirect if no ID
        return;
      }
      setIsLoading(true);
      const data = await getSurveyDeliveryDetails(deliveryId);
      if (data) {
        setDeliveryDetails(data);
        setIsDynamicGroup(data.dynamicGroup ?? false); // Initialize local state
      } else {
        toast({ title: "エラー", description: "配信情報が見つかりません。", variant: "destructive" });
        navigate('/survey-deliveries'); // Redirect if not found
      }
      setIsLoading(false);
    };
    fetchDetails();
  }, [deliveryId, navigate, toast]);

  const handleToggleDynamicGroup = (checked: boolean) => {
    if (!deliveryDetails) return;
    // Simulate update
    setIsDynamicGroup(checked);
    setDeliveryDetails(prev => prev ? { ...prev, dynamicGroup: checked } : null);
    toast({
      title: "設定変更",
      description: `動的グループ更新を${checked ? '有効' : '無効'}にしました。`,
    });
    // In real app: Call API to update schedule settings
    // logAuditEvent('toggle_dynamic_group', deliveryId, currentUser, { enabled: checked });
  };

  const handlePauseResume = () => {
    if (!deliveryDetails || !deliveryDetails.isRecurring) return;

    const isCurrentlyPaused = deliveryDetails.status === 'paused';
    const newStatus = isCurrentlyPaused ? 'scheduled' : 'paused'; // Assuming it resumes to 'scheduled' or its original active state
    const actionText = isCurrentlyPaused ? '再開' : '一時停止';

    // Simulate update
    setDeliveryDetails(prev => prev ? { ...prev, status: newStatus } : null);
    toast({
      title: `スケジュール${actionText}`,
      description: `繰り返し配信スケジュールを${actionText}しました。`,
    });
    // In real app: Call API to update schedule status
    // logAuditEvent(isCurrentlyPaused ? 'resume_schedule' : 'pause_schedule', deliveryId, currentUser);
  };

  if (isLoading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  if (!deliveryDetails) {
    // Already handled in useEffect, but good practice
    return <div className="p-8 text-center text-red-600">配信情報が見つかりません。</div>;
  }

  const statusInfo = getSurveyDeliveryStatusInfo(deliveryDetails.status);
  const frequencyText = getFrequencyText(deliveryDetails.frequency);

  return (
    <div className="p-8 space-y-6">
      {/* Header and Back Button */}
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold">サーベイ配信詳細</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Main Details Card */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{deliveryDetails.survey.title}</CardTitle>
              <CardDescription>配信スケジュールID: {deliveryDetails.deliveryId}</CardDescription>
            </div>
            <Badge variant={statusInfo.variant} className="text-sm px-3 py-1">
              {statusInfo.text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><span className="font-medium text-muted-foreground">対象グループ:</span> {deliveryDetails.targetGroup}</div>
            <div><span className="font-medium text-muted-foreground">作成者:</span> {deliveryDetails.createdBy}</div>
            <div><span className="font-medium text-muted-foreground">スケジュール開始日:</span> {format(deliveryDetails.deliveryStartDate, 'yyyy/MM/dd HH:mm')}</div>
            <div><span className="font-medium text-muted-foreground">スケジュール終了日:</span> {deliveryDetails.deliveryEndDate ? format(deliveryDetails.deliveryEndDate, 'yyyy/MM/dd HH:mm') : '未定'}</div>
            <div><span className="font-medium text-muted-foreground">作成日時:</span> {format(deliveryDetails.createdAt, 'yyyy/MM/dd HH:mm')}</div>
          </div>

          {/* Recurring Settings Section */}
          {deliveryDetails.isRecurring && (
            <>
              <Separator className="my-4" />
              <h3 className="text-lg font-semibold mb-2 flex items-center"><Repeat className="mr-2 h-5 w-5" />繰り返し設定</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div><span className="font-medium text-muted-foreground">頻度:</span> {frequencyText}</div>
                {/* Placeholder for more detailed schedule conditions */}
                {/* <div><span className="font-medium text-muted-foreground">詳細条件:</span> {deliveryDetails.recurrenceDetails || 'N/A'}</div> */}
                <div className="flex items-center space-x-2">
                   <Switch
                     id="dynamic-group-switch"
                     checked={isDynamicGroup}
                     onCheckedChange={handleToggleDynamicGroup}
                     aria-label="動的グループ更新"
                   />
                   <Label htmlFor="dynamic-group-switch" className="flex items-center">
                     <Users className="mr-1.5 h-4 w-4" /> 動的グループ更新
                     <span className="text-xs text-muted-foreground ml-1">(新メンバーを自動追加)</span>
                   </Label>
                 </div>
              </div>
            </>
          )}
        </CardContent>
        {/* Actions for Recurring Schedules */}
        {deliveryDetails.isRecurring && (deliveryDetails.status === 'scheduled' || deliveryDetails.status === 'in-progress' || deliveryDetails.status === 'paused') && (
          <CardFooter className="border-t pt-4">
            <Button
              onClick={handlePauseResume}
              variant={deliveryDetails.status === 'paused' ? "default" : "outline"}
            >
              {deliveryDetails.status === 'paused' ? (
                <Play className="mr-2 h-4 w-4" />
              ) : (
                <Pause className="mr-2 h-4 w-4" />
              )}
              {deliveryDetails.status === 'paused' ? 'スケジュールを再開' : 'スケジュールを一時停止'}
            </Button>
            {/* Add Edit Schedule Button here if needed */}
          </CardFooter>
        )}
      </Card>

      {/* Delivery History Section (Placeholder) */}
      {deliveryDetails.isRecurring && (
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center"><CalendarClock className="mr-2 h-5 w-5" />配信履歴</CardTitle>
            <CardDescription>この繰り返しスケジュールによって実行された過去の配信インスタンス。</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>配信日時</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead className="text-right">完了/対象</TableHead>
                  {/* <TableHead>アクション</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDeliveryHistory.length > 0 ? (
                  mockDeliveryHistory.map((instance) => (
                    <TableRow key={instance.instanceId}>
                      <TableCell>{instance.date}</TableCell>
                      <TableCell>
                        <Badge variant={instance.status === '完了' ? 'outline' : 'secondary'}>{instance.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{instance.completed} / {instance.total}</TableCell>
                      {/* <TableCell><Button variant="link" size="sm">詳細</Button></TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center">配信履歴はありません。</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Trend Analysis Section (Placeholder) */}
       {deliveryDetails.isRecurring && (
        <Card className="bg-card">
          <CardHeader>
            <CardTitle className="flex items-center"><BarChart className="mr-2 h-5 w-5" />トレンド分析</CardTitle>
            <CardDescription>繰り返し配信されたサーベイ結果の傾向を表示します。</CardDescription>
          </CardHeader>
          <CardContent>
            <TrendChartPlaceholder />
            {/* Add more detailed analysis or data tables here */}
          </CardContent>
        </Card>
       )}

    </div>
  );
}
