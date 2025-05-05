import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Users,
  Building2,
  Users as UsersIcon,
  ClipboardCheck,
  BarChart3,
  ChevronRight,
  ClipboardList,
  Calendar,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  // ダミーデータ
  const assessmentData = [40, 60, 75, 55, 80, 65, 90];
  const surveyData = [25, 40, 30, 45, 55, 60, 70];
  const months = ["6月", "7月", "8月", "9月", "10月", "11月", "12月"];

  const recentActivities = [
    {
      id: 1,
      user: "鈴木太郎",
      action: "新規メンバーを追加しました",
      time: "10分前",
      avatar: "S",
    },
    {
      id: 2,
      user: "田中花子",
      action: "アセスメントを配信しました",
      time: "1時間前",
      avatar: "T",
    },
    {
      id: 3,
      user: "佐藤次郎",
      action: "グループを編集しました",
      time: "3時間前",
      avatar: "S",
    },
    {
      id: 4,
      user: "伊藤めぐみ",
      action: "サーベイを作成しました",
      time: "昨日",
      avatar: "I",
    },
  ];

  const upcomingSchedules = [
    {
      id: 1,
      title: "リーダーシップアセスメント配信",
      date: "2023年12月10日",
      type: "assessment",
    },
    {
      id: 2,
      title: "エンゲージメントサーベイ配信",
      date: "2023年12月15日",
      type: "survey",
    },
    {
      id: 3,
      title: "四半期パフォーマンスレビュー",
      date: "2023年12月25日",
      type: "review",
    },
  ];

  return (
    <div className="container mx-auto p-6 mt-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-gray-800">ダッシュボード</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline">レポート出力</Button>
              <Button>データ更新</Button>
            </div>
          </div>
          <CardDescription>システムの概要と最近のアクティビティ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">総メンバー数</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,286</div>
                <p className="text-xs text-muted-foreground">+24 先月比</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">グループ数</CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">34</div>
                <p className="text-xs text-muted-foreground">+2 先週比</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  アセスメント回答率
                </CardTitle>
                <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78.5%</div>
                <div className="mt-2">
                  <Progress value={78.5} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  サーベイ完了率
                </CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">64.2%</div>
                <div className="mt-2">
                  <Progress value={64.2} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Chart and Upcoming Schedules */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>半年間の進捗状況</CardTitle>
                <CardDescription>アセスメントとサーベイの完了率</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Placeholder for Chart */}
                <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-gray-500">グラフ表示エリア</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>今後の予定</CardTitle>
                <CardDescription>
                  今後予定されているアセスメント・サーベイ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingSchedules.map((schedule) => (
                    <div key={schedule.id} className="flex items-start space-x-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {schedule.type === "assessment" && (
                          <ClipboardCheck className="h-4 w-4 text-primary" />
                        )}
                        {schedule.type === "survey" && (
                          <ClipboardList className="h-4 w-4 text-primary" />
                        )}
                        {schedule.type === "review" && (
                          <Calendar className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{schedule.title}</p>
                          <Badge variant="outline" className="text-xs">
                            {schedule.type === "assessment"
                              ? "アセスメント"
                              : schedule.type === "survey"
                              ? "サーベイ"
                              : "レビュー"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {schedule.date}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2" size="sm">
                    すべての予定を表示
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>最近のアクティビティ</CardTitle>
              <CardDescription>システム上で行われた最近の操作</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>{activity.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.user}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.action}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2" size="sm">
                  すべてのアクティビティを表示
                  <ChevronRight className="ml-auto h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
