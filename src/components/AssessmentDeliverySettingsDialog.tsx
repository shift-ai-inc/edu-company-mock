import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { AvailableAssessment } from '@/types/assessment';
import { AssessmentDelivery } from '@/types/assessmentDelivery';
import { format, addDays, setHours, setMinutes, isValid, isToday, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssessmentDeliverySettingsDialogProps {
  mode: 'create' | 'edit';
  assessmentForCreate?: AvailableAssessment | null; // Used in create mode
  deliveryForEdit?: AssessmentDelivery | null; // Used in edit mode
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (deliveryDetails: any) => void; // 'any' for now, can be refined based on mode
}

export default function AssessmentDeliverySettingsDialog({
  mode,
  assessmentForCreate,
  deliveryForEdit,
  open,
  onOpenChange,
  onSave,
}: AssessmentDeliverySettingsDialogProps) {
  const [targetGroup, setTargetGroup] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 8));
  const [endTime, setEndTime] = useState('17:00');
  const [reminderTiming, setReminderTiming] = useState<string>('3'); // Default to 3 days
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  const assessmentTitle = mode === 'create' ? assessmentForCreate?.title : deliveryForEdit?.assessment.title;

  useEffect(() => {
    if (open) {
      setIsSubmitting(false);
      if (mode === 'edit' && deliveryForEdit) {
        setTargetGroup(deliveryForEdit.targetGroup);
        
        const startDateTime = deliveryForEdit.deliveryStartDate;
        setStartDate(startDateTime);
        setStartTime(format(startDateTime, 'HH:mm'));

        const endDateTime = deliveryForEdit.deliveryEndDate;
        setEndDate(endDateTime);
        setEndTime(format(endDateTime, 'HH:mm'));
        
        // TODO: Add reminder timing to AssessmentDelivery type and load it here
        // For now, defaulting or keeping previous state if any
        // setReminderTiming(deliveryForEdit.reminderDaysBefore?.toString() || 'none');
        setReminderTiming('3'); // Placeholder, as reminderDaysBefore is not in AssessmentDelivery type yet

      } else if (mode === 'create') {
        setTargetGroup('');
        const tomorrow = addDays(new Date(), 1);
        setStartDate(tomorrow);
        setStartTime('09:00');
        setEndDate(addDays(tomorrow, 7));
        setEndTime('17:00');
        setReminderTiming('3');
      }
    }
  }, [open, mode, assessmentForCreate, deliveryForEdit]);

  const combineDateAndTime = (date: Date | undefined, time: string): Date | null => {
    if (!date || !time) return null;
    const [hours, minutes] = time.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return null;
    let combined = setHours(date, hours);
    combined = setMinutes(combined, minutes);
    return combined;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    const finalStartDate = combineDateAndTime(startDate, startTime);
    const finalEndDate = combineDateAndTime(endDate, endTime);

    if (!assessmentTitle || !targetGroup || !finalStartDate || !finalEndDate || !isValid(finalStartDate) || !isValid(finalEndDate)) {
      toast({
        title: "入力エラー",
        description: "すべての必須項目を正しく入力してください。",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (finalStartDate >= finalEndDate) {
       toast({
         title: "期間エラー",
         description: "終了日時は開始日時より後に設定してください。",
         variant: "destructive",
       });
       setIsSubmitting(false);
       return;
     }

    let deliveryDetails: any;

    if (mode === 'create' && assessmentForCreate) {
      deliveryDetails = {
        assessmentId: assessmentForCreate.id,
        assessmentTitle: assessmentForCreate.title,
        targetGroup,
        deliveryStartDateTime: finalStartDate.toISOString(),
        deliveryEndDateTime: finalEndDate.toISOString(),
        reminderDaysBefore: reminderTiming === 'none' ? null : parseInt(reminderTiming, 10),
      };
      console.log("Creating Assessment Delivery (Mock):", deliveryDetails);
    } else if (mode === 'edit' && deliveryForEdit) {
      deliveryDetails = {
        ...deliveryForEdit, // Preserve existing fields like deliveryId, assessment info
        targetGroup,
        deliveryStartDate: finalStartDate, // Keep as Date objects for internal state update
        deliveryEndDate: finalEndDate,
        // reminderDaysBefore: reminderTiming === 'none' ? null : parseInt(reminderTiming, 10), // If this field is added
      };
      console.log("Updating Assessment Delivery (Mock):", deliveryDetails);
    } else {
      toast({ title: "エラー", description: "無効な操作です。", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    toast({
      title: mode === 'create' ? "配信設定完了 (Mock)" : "配信設定更新 (Mock)",
      description: `「${assessmentTitle}」をグループ「${targetGroup}」に${mode === 'create' ? '配信設定しました' : '更新しました'}。`,
    });

    if (mode === 'create') {
      console.log(`Simulating email notification send for "${assessmentTitle}" to group "${targetGroup}"...`);
      await new Promise(resolve => setTimeout(resolve, 300));
      toast({
        title: "通知メール送信 (Mock)",
        description: `グループ「${targetGroup}」のユーザーにアセスメント開始の通知メールを送信しました。`,
      });
    }

    onSave(deliveryDetails);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  if ((mode === 'create' && !assessmentForCreate) || (mode === 'edit' && !deliveryForEdit)) {
    // This case should ideally not happen if dialog is opened correctly
    return null;
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'アセスメント配信設定' : 'アセスメント配信設定の編集'}</DialogTitle>
          <DialogDescription>
            「{assessmentTitle}」の配信スケジュールと対象を{mode === 'create' ? '設定し、通知メールを送信します' : '編集します'}。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-y-4 gap-x-4 py-4">

            <div className="grid grid-cols-[auto_1fr] items-center gap-x-4">
              <Label htmlFor="targetGroup" className="whitespace-nowrap">
                対象グループ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="targetGroup"
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                placeholder="例: 営業部, 新人研修グループ"
                required
              />
            </div>

            <div className="grid grid-cols-[auto_1fr] items-center gap-x-4">
              <Label htmlFor="startDate" className="whitespace-nowrap">
                開始日時 <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[180px] justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP", { locale: ja }) : <span>日付を選択</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      locale={ja}
                      disabled={(date) => mode === 'create' && Boolean(date < new Date() && !isToday(date))}
                    />
                  </PopoverContent>
                </Popover>
                <div className="relative flex-1">
                   <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                   <Input
                     id="startTime"
                     type="time"
                     value={startTime}
                     onChange={(e) => setStartTime(e.target.value)}
                     className="pl-8 w-full"
                     required
                   />
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-[auto_1fr] items-center gap-x-4">
              <Label htmlFor="endDate" className="whitespace-nowrap">
                終了日時 <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                 <Popover>
                   <PopoverTrigger asChild>
                     <Button
                       variant={"outline"}
                       className={cn(
                         "w-[180px] justify-start text-left font-normal",
                         !endDate && "text-muted-foreground"
                       )}
                     >
                       <CalendarIcon className="mr-2 h-4 w-4" />
                       {endDate ? format(endDate, "PPP", { locale: ja }) : <span>日付を選択</span>}
                     </Button>
                   </PopoverTrigger>
                   <PopoverContent className="w-auto p-0">
                     <Calendar
                       mode="single"
                       selected={endDate}
                       onSelect={setEndDate}
                       initialFocus
                       locale={ja}
                       disabled={(date) => Boolean(startDate && date < startDate)}
                     />
                   </PopoverContent>
                 </Popover>
                 <div className="relative flex-1">
                   <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                   <Input
                     id="endTime"
                     type="time"
                     value={endTime}
                     onChange={(e) => setEndTime(e.target.value)}
                     className="pl-8 w-full"
                     required
                   />
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-[auto_1fr] items-center gap-x-4">
              <Label htmlFor="reminderTiming" className="whitespace-nowrap">
                リマインダー
              </Label>
              <Select value={reminderTiming} onValueChange={setReminderTiming}>
                <SelectTrigger>
                  <SelectValue placeholder="リマインダータイミングを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">なし</SelectItem>
                  <SelectItem value="1">終了日の1日前</SelectItem>
                  <SelectItem value="3">終了日の3日前</SelectItem>
                  <SelectItem value="7">終了日の7日前 (1週間前)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mode === 'create' && (
             <div className="col-span-full mt-2 p-3 bg-gray-50 rounded border border-dashed border-gray-300">
                <p className="text-sm text-gray-600 flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-blue-500"/> 今後のメール機能拡張予定:
                </p>
                 <ul className="list-disc list-inside text-xs text-gray-500 mt-1 space-y-1 pl-5">
                    <li>通知メールテンプレートのカスタマイズ (ロゴ, 説明文)</li>
                    <li>緊急度/重要度に応じたテンプレート選択</li>
                    <li>開封確認機能と未読者へのリマインダー</li>
                    <li>送信エラーの自動検出と再送</li>
                    <li>送信状況のリアルタイムモニタリングと統計</li>
                    <li>配信対象の詳細絞り込み (役職, スコア等)</li>
                    <li>配信前のプレビューと影響範囲表示</li>
                    <li>設定のテンプレート保存</li>
                 </ul>
             </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">キャンセル</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (mode === 'create' ? '設定・送信中...' : '更新中...') : (mode === 'create' ? '設定して通知メールを送信' : '変更を保存')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
