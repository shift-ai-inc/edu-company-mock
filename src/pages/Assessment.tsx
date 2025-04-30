import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Plus,
  MoreHorizontal,
  FileText,
  Calendar,
  Clock,
  Users,
  Mail,
  Copy,
  Trash2,
  Clipboard,
  ClipboardCheck,
  BarChart,
  ChevronRight,
  Edit,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// アセスメントデータの型定義
interface Assessment {
  id: number;
  title: string;
  type: string;
  target: string;
  targetCount: number;
  completionRate: number;
  status: "draft" | "scheduled" | "in_progress" | "completed";
  createdAt: string;
  scheduledAt: string | null;
}

// サンプルアセスメントデータ
const sampleAssessments: Assessment[] = [
  {
    id: 1,
    title: "リーダーシップスキル評価",
    type: "360度評価",
    target: "管理職",
    targetCount: 28,
    completionRate: 85,
    status: "completed",
    createdAt: "2023-11-01",
    scheduledAt: "2023-11-05",
  },
  {
    id: 2,
    title: "チームエンゲージメント評価",
    type: "自己評価",
    target: "全社員",
    targetCount: 124,
    completionRate: 62,
    status: "in_progress",
    createdAt: "2023-11-15",
    scheduledAt: "2023-11-20",
  },
  {
    id: 3,
    title: "プロジェクトマネジメントスキル",
    type: "スキル評価",
    target: "プロジェクトマネージャー",
    targetCount: 15,
    completionRate: 0,
    status: "scheduled",
    createdAt: "2023-11-25",
    scheduledAt: "2023-12-01",
  },
  {
    id: 4,
    title: "新入社員オンボーディング評価",
    type: "自己評価",
    target: "新入社員",
    targetCount: 12,
    completionRate: 0,
    status: "draft",
    createdAt: "2023-11-28",
    scheduledAt: null,
  },
  {
    id: 5,
    title: "営業スキル評価",
    type: "スキル評価",
    target: "営業部",
    targetCount: 36,
    completionRate: 90,
    status: "completed",
    createdAt: "2023-10-10",
    scheduledAt: "2023-10-15",
  },
];

// アセスメントテンプレートの型定義
interface AssessmentTemplate {
  id: number;
  title: string;
  type: string;
  description: string;
  questionCount: number;
}

// サンプルテンプレートデータ
const sampleTemplates: AssessmentTemplate[] = [
  {
    id: 1,
    title: "リーダーシップ評価",
    type: "360度評価",
    description: "リーダーシップスキルを多角的に評価",
    questionCount: 25,
  },
  {
    id: 2,
    title: "コミュニケーション評価",
    type: "スキル評価",
    description: "コミュニケーション能力を評価",
    questionCount: 20,
  },
  {
    id: 3,
    title: "プロジェクト管理評価",
    type: "スキル評価",
    description: "プロジェクト管理スキルを評価",
    questionCount: 18,
  },
  {
    id: 4,
    title: "チームワーク評価",
    type: "360度評価",
    description: "チーム内での協力関係を評価",
    questionCount: 15,
  },
];

// グループデータの型定義
interface Group {
  id: number;
  name: string;
  type: string;
  memberCount: number;
}

// サンプルグループデータ
const sampleGroups: Group[] = [
  { id: 1, name: "経営企画部", type: "department", memberCount: 12 },
  { id: 2, name: "人事部", type: "department", memberCount: 8 },
  { id: 3, name: "マーケティング部", type: "department", memberCount: 15 },
  { id: 4, name: "テクニカルチーム", type: "team", memberCount: 6 },
  { id: 5, name: "営業部", type: "department", memberCount: 25 },
];

export default function Assessment() {
  const [assessments, setAssessments] =
    useState<Assessment[]>(sampleAssessments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all"); // Changed initial value
  const [selectedType, setSelectedType] = useState<string>("all"); // Changed initial value
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState("all");

  // 作成ダイアログの複数ステップを管理
  const [createStep, setCreateStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);
  const [scheduleType, setScheduleType] = useState<string>("now");
  const [messageText, setMessageText] = useState("");

  // フィルタリングされたアセスメントリスト
  const filteredAssessments = assessments.filter((assessment) => {
    const matchesSearch = assessment.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || assessment.status === selectedStatus; // Updated check
    const matchesType =
      selectedType === "all" || assessment.type === selectedType; // Updated check
    const matchesTab =
      currentTab === "all" ||
      (currentTab === "active" &&
        ["scheduled", "in_progress"].includes(assessment.status)) ||
      (currentTab === "completed" && assessment.status === "completed") ||
      (currentTab === "draft" && assessment.status === "draft");

    return matchesSearch && matchesStatus && matchesType && matchesTab;
  });

  // ステータスに応じたバッジを返す
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            下書き
          </Badge>
        );
      case "scheduled":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            予約済
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            実施中
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            完了
          </Badge>
        );
      default:
        return null;
    }
  };

  // グループの選択状態を切り替える
  const toggleGroup = (groupId: number) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  // 作成フォームをリセット
  const resetCreateForm = () => {
    setCreateStep(1);
    setSelectedTemplate(null);
    setSelectedGroups([]);
    setScheduleType("now");
    setMessageText("");
  };

  // 作成ダイアログを閉じる
  const handleCloseDialog = () => {
    setShowCreateDialog(false);
    resetCreateForm();
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          アセスメント配信
        </h2>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <Tabs
              value={currentTab}
              onValueChange={setCurrentTab}
              className="w-full sm:w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">すべて</TabsTrigger>
                <TabsTrigger value="active">進行中</TabsTrigger>
                <TabsTrigger value="completed">完了</TabsTrigger>
                <TabsTrigger value="draft">下書き</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            新規アセスメント
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 items-center mt-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="タイトルで検索..."
              className="pl-8 w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="ステータス" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのステータス</SelectItem> {/* Changed value */}
              <SelectItem value="draft">下書き</SelectItem>
              <SelectItem value="scheduled">予約済</SelectItem>
              <SelectItem value="in_progress">実施中</SelectItem>
              <SelectItem value="completed">完了</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="アセスメント種類" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべての種類</SelectItem> {/* Changed value */}
              <SelectItem value="360度評価">360度評価</SelectItem>
              <SelectItem value="自己評価">自己評価</SelectItem>
              <SelectItem value="スキル評価">スキル評価</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>タイトル</TableHead>
              <TableHead>種類</TableHead>
              <TableHead>対象</TableHead>
              <TableHead>完了率</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>作成日</TableHead>
              <TableHead>配信日</TableHead>
              <TableHead className="text-right">アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAssessments.length > 0 ? (
              filteredAssessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell>
                    <div className="font-medium">{assessment.title}</div>
                  </TableCell>
                  <TableCell>{assessment.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{assessment.target}</span>
                      <Badge variant="outline" className="ml-1">
                        {assessment.targetCount}名
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={assessment.completionRate}
                        className="h-2 w-24"
                      />
                      <span className="text-sm">
                        {assessment.completionRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(assessment.status)}</TableCell>
                  <TableCell>{assessment.createdAt}</TableCell>
                  <TableCell>{assessment.scheduledAt || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {assessment.status === "completed" ? (
                          <DropdownMenuItem>
                            <BarChart className="mr-2 h-4 w-4" />
                            結果を確認
                          </DropdownMenuItem>
                        ) : (
                          <>
                            {assessment.status !== "draft" && (
                              <DropdownMenuItem>
                                <ClipboardCheck className="mr-2 h-4 w-4" />
                                回答状況
                              </DropdownMenuItem>
                            )}
                            {assessment.status === "draft" && (
                              <>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  編集
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="mr-2 h-4 w-4" />
                                  今すぐ配信
                                </DropdownMenuItem>
                              </>
                            )}
                          </>
                        )}
                        <DropdownMenuItem>
                          <Copy className="mr-2 h-4 w-4" />
                          複製
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          削除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-gray-500"
                >
                  検索条件に一致するアセスメントが見つかりませんでした
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* アセスメント作成ダイアログ */}
      <Dialog open={showCreateDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>新規アセスメント作成</DialogTitle>
            <DialogDescription>
              {createStep === 1 &&
                "ステップ 1/3: テンプレートを選択してください"}
              {createStep === 2 &&
                "ステップ 2/3: 配信対象と配信スケジュールを設定してください"}
              {createStep === 3 &&
                "ステップ 3/3: 配信メッセージを設定してください"}
            </DialogDescription>
          </DialogHeader>

          {/* ステップ1: テンプレート選択 */}
          {createStep === 1 && (
            <div className="py-4">
              <div className="grid grid-cols-1 gap-4">
                {sampleTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer hover:border-primary transition-colors ${
                      selectedTemplate === template.id ? "border-primary" : ""
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium">{template.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {template.description}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{template.type}</Badge>
                          <Badge variant="outline">
                            {template.questionCount}問
                          </Badge>
                          <Checkbox
                            checked={selectedTemplate === template.id}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ステップ2: 配信対象とスケジュール設定 */}
          {createStep === 2 && (
            <div className="py-4">
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">配信対象を選択</h3>
                  <div className="grid grid-cols-1 gap-3 max-h-[200px] overflow-y-auto border rounded-md p-3">
                    {sampleGroups.map((group) => (
                      <div
                        key={group.id}
                        className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedGroups.includes(group.id)}
                            onCheckedChange={() => toggleGroup(group.id)}
                          />
                          <span>{group.name}</span>
                        </div>
                        <Badge variant="outline">{group.memberCount}名</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm font-medium">配信スケジュール</h3>
                  <RadioGroup
                    value={scheduleType}
                    onValueChange={setScheduleType}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="now" id="now" />
                      <Label htmlFor="now">今すぐ配信</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="scheduled" id="scheduled" />
                      <Label htmlFor="scheduled">日時を指定して配信</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="recurring" id="recurring" />
                      <Label htmlFor="recurring">定期的に配信</Label>
                    </div>
                  </RadioGroup>

                  {scheduleType === "scheduled" && (
                    <div className="ml-6 space-y-2">
                      <Label htmlFor="scheduled-date">配信日時</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input id="scheduled-date" type="date" />
                        <Input id="scheduled-time" type="time" />
                      </div>
                    </div>
                  )}

                  {scheduleType === "recurring" && (
                    <div className="ml-6 space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="frequency">頻度</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="頻度を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">毎週</SelectItem>
                            <SelectItem value="monthly">毎月</SelectItem>
                            <SelectItem value="quarterly">
                              四半期ごと
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="start-date">開始日</Label>
                        <Input id="start-date" type="date" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="end-after">終了条件</Label>
                        </div>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="終了条件を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="never">終了なし</SelectItem>
                            <SelectItem value="count">回数指定</SelectItem>
                            <SelectItem value="date">日付指定</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ステップ3: 配信メッセージ設定 */}
          {createStep === 3 && (
            <div className="py-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="message-subject">メール件名</Label>
                  <Input
                    id="message-subject"
                    placeholder="例：「リーダーシップスキル評価」のご協力をお願いします"
                    defaultValue="「リーダーシップスキル評価」のご協力をお願いします"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message-body">メール本文</Label>
                  <Textarea
                    id="message-body"
                    placeholder="配信メッセージを入力してください"
                    rows={6}
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    defaultValue={`お世話になっております。人事部です。

今回、組織力強化の一環として「リーダーシップスキル評価」を実施いたします。
以下のリンクよりアクセスし、評価にご協力ください。

所要時間：約15分
回答期限：2023年12月15日

ご不明点がございましたら、人事部までお問い合わせください。
ご協力のほど、よろしくお願いいたします。`}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="send-reminder">リマインダーを送信</Label>
                  <Switch id="send-reminder" defaultChecked />
                </div>
                <div className="ml-6 space-y-2">
                  <Label htmlFor="reminder-days">回答期限の何日前</Label>
                  <Select defaultValue="3">
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1日前</SelectItem>
                      <SelectItem value="2">2日前</SelectItem>
                      <SelectItem value="3">3日前</SelectItem>
                      <SelectItem value="5">5日前</SelectItem>
                      <SelectItem value="7">7日前</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between">
            {createStep > 1 ? (
              <Button
                variant="outline"
                onClick={() => setCreateStep((prev) => prev - 1)}
              >
                戻る
              </Button>
            ) : (
              <div />
            )}
            {createStep < 3 ? (
              <Button
                onClick={() => setCreateStep((prev) => prev + 1)}
                disabled={
                  (createStep === 1 && selectedTemplate === null) ||
                  (createStep === 2 && selectedGroups.length === 0)
                }
              >
                次へ
              </Button>
            ) : (
              <Button onClick={handleCloseDialog}>作成して配信</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
