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
  BarChart,
  Calendar,
  Clock,
  Users,
  Mail,
  Copy,
  Trash2,
  ClipboardList,
  Edit,
  ChevronRight,
  Eye,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// サーベイデータの型定義
interface Survey {
  id: number;
  title: string;
  description: string;
  target: string;
  targetCount: number;
  responseCount: number;
  status: "draft" | "scheduled" | "in_progress" | "completed";
  createdAt: string;
  scheduledAt: string | null;
  deadline: string | null;
}

// サンプルサーベイデータ
const sampleSurveys: Survey[] = [
  {
    id: 1,
    title: "従業員エンゲージメントサーベイ",
    description: "社員の満足度と帰属意識を測定",
    target: "全社員",
    targetCount: 150,
    responseCount: 142,
    status: "completed",
    createdAt: "2023-10-01",
    scheduledAt: "2023-10-05",
    deadline: "2023-10-15",
  },
  {
    id: 2,
    title: "リモートワーク環境調査",
    description: "在宅勤務の環境と課題についての調査",
    target: "全社員",
    targetCount: 150,
    responseCount: 98,
    status: "in_progress",
    createdAt: "2023-11-05",
    scheduledAt: "2023-11-10",
    deadline: "2023-11-25",
  },
  {
    id: 3,
    title: "新人研修フィードバック",
    description: "新入社員研修の効果測定と改善点の調査",
    target: "2023年入社社員",
    targetCount: 35,
    responseCount: 0,
    status: "scheduled",
    createdAt: "2023-11-18",
    scheduledAt: "2023-12-01",
    deadline: "2023-12-10",
  },
  {
    id: 4,
    title: "福利厚生満足度調査",
    description: "会社の福利厚生制度への満足度調査",
    target: "全社員",
    targetCount: 150,
    responseCount: 0,
    status: "draft",
    createdAt: "2023-11-20",
    scheduledAt: null,
    deadline: null,
  },
];

// レスポンダー（回答者）のデータ型
interface Responder {
  id: number;
  name: string;
  department: string;
  status: "not_started" | "in_progress" | "completed";
  lastActivity: string | null;
}

// サンプル回答者データ
const sampleResponders: Responder[] = [
  {
    id: 1,
    name: "山田太郎",
    department: "営業部",
    status: "completed",
    lastActivity: "2023-11-12",
  },
  {
    id: 2,
    name: "佐藤花子",
    department: "人事部",
    status: "completed",
    lastActivity: "2023-11-11",
  },
  {
    id: 3,
    name: "鈴木一郎",
    department: "マーケティング部",
    status: "in_progress",
    lastActivity: "2023-11-15",
  },
  {
    id: 4,
    name: "田中美咲",
    department: "開発部",
    status: "not_started",
    lastActivity: null,
  },
  {
    id: 5,
    name: "伊藤健太",
    department: "営業部",
    status: "completed",
    lastActivity: "2023-11-10",
  },
  {
    id: 6,
    name: "渡辺裕子",
    department: "人事部",
    status: "in_progress",
    lastActivity: "2023-11-14",
  },
  {
    id: 7,
    name: "加藤誠",
    department: "営業部",
    status: "not_started",
    lastActivity: null,
  },
  {
    id: 8,
    name: "中村圭介",
    department: "開発部",
    status: "completed",
    lastActivity: "2023-11-13",
  },
];

export default function Survey() {
  const [surveys, setSurveys] = useState<Survey[]>(sampleSurveys);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [currentTab, setCurrentTab] = useState("all");
  const [showTrackingDialog, setShowTrackingDialog] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [responderFilter, setResponderFilter] = useState("all");

  // フィルタリングされたサーベイリスト
  const filteredSurveys = surveys.filter((survey) => {
    const matchesSearch =
      survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      survey.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !selectedStatus || survey.status === selectedStatus;
    const matchesTab =
      currentTab === "all" ||
      (currentTab === "active" &&
        ["scheduled", "in_progress"].includes(survey.status)) ||
      (currentTab === "completed" && survey.status === "completed") ||
      (currentTab === "draft" && survey.status === "draft");

    return matchesSearch && matchesStatus && matchesTab;
  });

  // フィルタリングされた回答者リスト
  const filteredResponders = sampleResponders.filter((responder) => {
    if (responderFilter === "all") return true;
    return responder.status === responderFilter;
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

  // 回答状況に応じたバッジを返す
  const getResponderStatusBadge = (status: string) => {
    switch (status) {
      case "not_started":
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            未回答
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
            回答中
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            回答済
          </Badge>
        );
      default:
        return null;
    }
  };

  // 回答率を計算
  const calculateResponseRate = (survey: Survey) => {
    if (survey.targetCount === 0) return 0;
    return Math.round((survey.responseCount / survey.targetCount) * 100);
  };

  // 回答追跡ダイアログを開く
  const openTrackingDialog = (survey: Survey) => {
    setSelectedSurvey(survey);
    setShowTrackingDialog(true);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          サーベイ配信
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

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新規サーベイ
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
              <SelectItem value="">すべてのステータス</SelectItem>
              <SelectItem value="draft">下書き</SelectItem>
              <SelectItem value="scheduled">予約済</SelectItem>
              <SelectItem value="in_progress">実施中</SelectItem>
              <SelectItem value="completed">完了</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>タイトル</TableHead>
              <TableHead>対象</TableHead>
              <TableHead>回答率</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>作成日</TableHead>
              <TableHead>配信日</TableHead>
              <TableHead>回答期限</TableHead>
              <TableHead className="text-right">アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSurveys.length > 0 ? (
              filteredSurveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{survey.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {survey.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span>{survey.target}</span>
                      <Badge variant="outline" className="ml-1">
                        {survey.targetCount}名
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={calculateResponseRate(survey)}
                        className="h-2 w-24"
                      />
                      <span className="text-sm">
                        {survey.responseCount}/{survey.targetCount} (
                        {calculateResponseRate(survey)}%)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(survey.status)}</TableCell>
                  <TableCell>{survey.createdAt}</TableCell>
                  <TableCell>{survey.scheduledAt || "-"}</TableCell>
                  <TableCell>{survey.deadline || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {survey.status === "completed" ? (
                          <DropdownMenuItem>
                            <BarChart className="mr-2 h-4 w-4" />
                            結果を確認
                          </DropdownMenuItem>
                        ) : (
                          <>
                            {survey.status !== "draft" && (
                              <DropdownMenuItem
                                onClick={() => openTrackingDialog(survey)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                回答状況を確認
                              </DropdownMenuItem>
                            )}
                            {survey.status === "draft" && (
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
                  検索条件に一致するサーベイが見つかりませんでした
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 回答状況追跡ダイアログ */}
      <Dialog open={showTrackingDialog} onOpenChange={setShowTrackingDialog}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>回答状況の追跡</DialogTitle>
            <DialogDescription>
              {selectedSurvey?.title} の回答状況を確認できます。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedSurvey && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      全体の回答率
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={calculateResponseRate(selectedSurvey)}
                        className="h-3 w-40"
                      />
                      <span className="font-medium">
                        {calculateResponseRate(selectedSurvey)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Select
                      value={responderFilter}
                      onValueChange={setResponderFilter}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">すべて</SelectItem>
                        <SelectItem value="completed">回答済</SelectItem>
                        <SelectItem value="in_progress">回答中</SelectItem>
                        <SelectItem value="not_started">未回答</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      リマインダー送信
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>名前</TableHead>
                        <TableHead>部署</TableHead>
                        <TableHead>回答状況</TableHead>
                        <TableHead>最終活動日</TableHead>
                        <TableHead className="text-right">アクション</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredResponders.map((responder) => (
                        <TableRow key={responder.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                  {responder.name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <span>{responder.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{responder.department}</TableCell>
                          <TableCell>
                            {getResponderStatusBadge(responder.status)}
                          </TableCell>
                          <TableCell>{responder.lastActivity || "-"}</TableCell>
                          <TableCell className="text-right">
                            {responder.status !== "completed" && (
                              <Button variant="ghost" size="sm">
                                <Mail className="mr-2 h-3 w-3" />
                                リマインド
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowTrackingDialog(false)}
            >
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
