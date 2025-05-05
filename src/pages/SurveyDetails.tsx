import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockAvailableSurveys } from '@/data/mockSurveys';
import { mockSurveyDeliveries } from '@/data/mockSurveyDeliveries'; // To simulate adding new delivery
import { AvailableSurvey } from '@/types/survey';
import { SurveyDelivery } from '@/types/surveyDelivery';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // For potential description display/edit
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon, Send, AlertCircle } from "lucide-react";

// Define reminder options
const reminderOptions = [
  { value: 'none', label: 'リマインダーなし' },
  { value: '1', label: '終了日の1日前' },
  { value: '3', label: '終了日の3日前' },
  { value: '7', label: '終了日の7日前' },
];

export default function SurveyDetails() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [survey, setSurvey] = useState<AvailableSurvey | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [targetGroup, setTargetGroup] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 14)); // Default end date 14 days from now
  const [reminderTiming, setReminderTiming] = useState<string>('none');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    // Simulate fetching survey details
    setIsLoading(true);
    const foundSurvey = mockAvailableSurveys.find(s => s.id === surveyId);
    if (foundSurvey) {
      setSurvey(foundSurvey);
    } else {
      // Handle survey not found (e.g., show error, redirect)
      toast({
        title: "エラー",
        description: "指定されたサーベイが見つかりません。",
        variant: "destructive",
      });
      navigate('/surveys'); // Redirect back to list
    }
    setIsLoading(false);
  }, [surveyId, navigate, toast]);

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!targetGroup.trim()) {
      errors.targetGroup = "対象グループは必須です。";
    }
    if (!startDate) {
      errors.startDate = "開始日は必須です。";
    }
    if (!endDate) {
      errors.endDate = "終了日は必須です。";
    }
    if (startDate && endDate && endDate <= startDate) {
      errors.endDate = "終了日は開始日より後に設定してください。";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateDelivery = () => {
    if (!validateForm() || !survey || !startDate || !endDate) {
      toast({
        title: "入力エラー",
        description: "入力内容を確認してください。",
        variant: "destructive",
      });
      return;
    }

    // Simulate creating a new delivery object
    const newDelivery: SurveyDelivery = {
      deliveryId: `sdel-${Date.now()}`, // Simple unique ID generation
      survey: { id: survey.id, title: survey.title, estimatedTime: survey.estimatedTime },
      targetGroup: targetGroup,
      deliveryStartDate: startDate,
      deliveryEndDate: endDate,
      status: 'scheduled', // New deliveries start as scheduled
      totalDelivered: 0, // Will be determined by target group size in reality
      completedCount: 0,
      incompleteCount: 0,
      createdBy: 'システム管理者 (仮)', // Replace with actual user later
      createdAt: new Date(),
    };

    // Simulate adding to mock data (won't persist)
    // In a real app, this would be an API call
    mockSurveyDeliveries.push(newDelivery);
    console.log("Simulated: Added new delivery:", newDelivery);
    console.log("Simulated: Reminder set for:", reminderOptions.find(o => o.value === reminderTiming)?.label);

    // Simulate email sending
    toast({
      title: "配信作成完了 (シミュレーション)",
      description: `サーベイ「${survey.title}」が対象グループ「${targetGroup}」にスケジュールされました。開始日にメールが送信されます。`,
    });

    // Optionally clear form or navigate
    setTargetGroup('');
    setStartDate(new Date());
    setEndDate(addDays(new Date(), 14));
    setReminderTiming('none');
    setFormErrors({});
    // navigate('/survey-deliveries'); // Or navigate to the delivery list
  };

  if (isLoading) {
    return <div className="p-8">読み込み中...</div>;
  }

  if (!survey) {
    // Should have been handled by useEffect redirect, but good practice to check
    return <div className="p-8">サーベイが見つかりません。</div>;
  }

  return (
    <div className="p-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{survey.title}</CardTitle>
          <CardDescription>{survey.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>カテゴリ:</strong> {survey.category}</p>
          <p><strong>想定所要時間:</strong> {survey.estimatedTime}分</p>
          <p><strong>作成日:</strong> {format(survey.createdAt, 'yyyy/MM/dd')}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>新規サーベイ配信作成</CardTitle>
          <CardDescription>このサーベイを新しいグループに配信します。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Target Group */}
          <div className="space-y-1">
            <Label htmlFor="targetGroup">対象グループ</Label>
            <Input
              id="targetGroup"
              placeholder="例: 営業部, 全社, 24卒新入社員"
              value={targetGroup}
              onChange={(e) => setTargetGroup(e.target.value)}
              className={cn(formErrors.targetGroup ? "border-red-500" : "")}
            />
            {formErrors.targetGroup && <p className="text-sm text-red-500 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{formErrors.targetGroup}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-1">
              <Label htmlFor="startDate">開始日</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground",
                      formErrors.startDate ? "border-red-500" : ""
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "yyyy/MM/dd") : <span>日付を選択</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formErrors.startDate && <p className="text-sm text-red-500 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{formErrors.startDate}</p>}
            </div>

            {/* End Date */}
            <div className="space-y-1">
              <Label htmlFor="endDate">終了日</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground",
                      formErrors.endDate ? "border-red-500" : ""
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "yyyy/MM/dd") : <span>日付を選択</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => // Disable dates before start date
                      startDate ? date <= startDate : false
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formErrors.endDate && <p className="text-sm text-red-500 flex items-center"><AlertCircle className="h-4 w-4 mr-1" />{formErrors.endDate}</p>}
            </div>
          </div>

          {/* Reminder Timing */}
          <div className="space-y-1">
            <Label htmlFor="reminderTiming">リマインダータイミング</Label>
            <Select value={reminderTiming} onValueChange={setReminderTiming}>
              <SelectTrigger id="reminderTiming">
                <SelectValue placeholder="リマインダーを選択" />
              </SelectTrigger>
              <SelectContent>
                {reminderOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              未回答者にリマインダーメールを送信するタイミングを設定します（シミュレーション）。
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateDelivery}>
            <Send className="mr-2 h-4 w-4" />
            配信を作成 (シミュレーション)
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
