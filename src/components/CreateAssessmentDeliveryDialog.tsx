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
import { format, addDays, setHours, setMinutes, isValid, isToday } from 'date-fns'; // Added isToday import
import { ja } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateAssessmentDeliveryDialogProps {
  assessment: AvailableAssessment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeliveryCreated: (deliveryDetails: any) => void;
}

export default function CreateAssessmentDeliveryDialog({
  assessment,
  open,
  onOpenChange,
  onDeliveryCreated,
}: CreateAssessmentDeliveryDialogProps) {
  const [targetGroup, setTargetGroup] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 8));
  const [endTime, setEndTime] = useState('17:00');
  const [reminderTiming, setReminderTiming] = useState<string>('3');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (open && assessment) {
      setTargetGroup('');
      setStartDate(addDays(new Date(), 1));
      setStartTime('09:00');
      setEndDate(addDays(new Date(), 8));
      setEndTime('17:00');
      setReminderTiming('3');
      setIsSubmitting(false);
    }
  }, [open, assessment]);

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

    if (!assessment || !targetGroup || !finalStartDate || !finalEndDate || !isValid(finalStartDate) || !isValid(finalEndDate)) {
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

    // ** MOCK DELIVERY CREATION **
    const deliveryDetails = {
      assessmentId: assessment.id,
      assessmentTitle: assessment.title,
      targetGroup,
      deliveryStartDateTime: finalStartDate.toISOString(),
      deliveryEndDateTime: finalEndDate.toISOString(),
      reminderDaysBefore: reminderTiming === 'none' ? null : parseInt(reminderTiming, 10),
      // In real app, add createdBy, createdAt, initial status etc.
    };

    console.log("Creating Assessment Delivery (Mock):", deliveryDetails);
    // Simulate API call for saving delivery settings
    await new Promise(resolve => setTimeout(resolve, 500));

    toast({
      title: "配信設定完了 (Mock)",
      description: `「${assessment.title}」をグループ「${targetGroup}」に配信設定しました。`,
    });

    // ** MOCK EMAIL SENDING **
    console.log(`Simulating email notification send for "${assessment.title}" to group "${targetGroup}"...`);
    // Simulate API call or background job trigger for email sending
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate email sending delay

    toast({
      title: "通知メール送信 (Mock)",
      description: `グループ「${targetGroup}」のユーザーにアセスメント開始の通知メールを送信しました。`,
      // In real app, you might link to a monitoring page or show more details
    });
    // --- End Mock Email Sending ---

    onDeliveryCreated(deliveryDetails);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  if (!assessment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Slightly increased max-width for better spacing */}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>アセスメント配信設定</DialogTitle>
          <DialogDescription>
            「{assessment.title}」の配信スケジュールと対象を設定し、通知メールを送信します。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          {/* Use grid-cols-[auto_1fr] for label + input layout */}
          <div className="grid gap-y-4 gap-x-4 py-4"> {/* Adjusted gap */}

            {/* Target Group */}
            <div className="grid grid-cols-[auto_1fr] items-center gap-x-4">
              <Label htmlFor="targetGroup" className="whitespace-nowrap"> {/* Removed text-right, added whitespace-nowrap */}
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

            {/* Start Date & Time */}
            <div className="grid grid-cols-[auto_1fr] items-center gap-x-4">
              <Label htmlFor="startDate" className="whitespace-nowrap"> {/* Removed text-right, added whitespace-nowrap */}
                開始日時 <span className="text-red-500">*</span>
              </Label>
              {/* Use flex for date and time inputs */}
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[180px] justify-start text-left font-normal", // Fixed width for date button
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
                      disabled={(date) => Boolean(date < new Date() && !isToday(date))}
                    />
                  </PopoverContent>
                </Popover>
                <div className="relative flex-1"> {/* Time input takes remaining space */}
                   <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                   <Input
                     id="startTime"
                     type="time"
                     value={startTime}
                     onChange={(e) => setStartTime(e.target.value)}
                     className="pl-8 w-full" // Ensure time input takes full width of its container
                     required
                   />
                 </div>
               </div>
            </div>

            {/* End Date & Time */}
            <div className="grid grid-cols-[auto_1fr] items-center gap-x-4">
              <Label htmlFor="endDate" className="whitespace-nowrap"> {/* Removed text-right, added whitespace-nowrap */}
                終了日時 <span className="text-red-500">*</span>
              </Label>
              {/* Use flex for date and time inputs */}
              <div className="flex items-center gap-2">
                 <Popover>
                   <PopoverTrigger asChild>
                     <Button
                       variant={"outline"}
                       className={cn(
                         "w-[180px] justify-start text-left font-normal", // Fixed width for date button
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
                 <div className="relative flex-1"> {/* Time input takes remaining space */}
                   <Clock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                   <Input
                     id="endTime"
                     type="time"
                     value={endTime}
                     onChange={(e) => setEndTime(e.target.value)}
                     className="pl-8 w-full" // Ensure time input takes full width of its container
                     required
                   />
                 </div>
               </div>
            </div>

            {/* Reminder Timing */}
            <div className="grid grid-cols-[auto_1fr] items-center gap-x-4">
              <Label htmlFor="reminderTiming" className="whitespace-nowrap"> {/* Removed text-right, added whitespace-nowrap */}
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

             {/* Placeholder for Future Features - Spans full width */}
             <div className="col-span-full mt-2 p-3 bg-gray-50 rounded border border-dashed border-gray-300"> {/* Use col-span-full */}
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

          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">キャンセル</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '設定・送信中...' : '設定して通知メールを送信'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
