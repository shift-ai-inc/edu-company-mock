import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  LineChart as LineChartIcon, // Rename to avoid conflict with Recharts component
  Download,
  Filter,
  ChevronDown,
  Share2,
  FileText,
  FileBarChart,
  Info,
  Radar as RadarIcon, // Rename to avoid conflict
  AlertTriangle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip, // Rename to avoid conflict
  Legend,
  Cell, // For Pie chart colors
} from "recharts";
import {
  Tooltip as ShadcnTooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Shadcn Tooltip

// Wrapper component to ensure TooltipProvider is available
const Tooltip = ({ children }: { children: React.ReactNode }) => (
  <TooltipProvider delayDuration={100}>
    <ShadcnTooltip>{children}</ShadcnTooltip>
  </TooltipProvider>
);

// --- Mock Data (Adapted for Recharts) ---

// エンゲージメントスコアのデータ (Line Chart)
const engagementData = [
  { name: "6月", 自社: 68, 業界平均: 65 },
  { name: "7月", 自社: 72, 業界平均: 67 },
  { name: "8月", 自社: 70, 業界平均: 68 },
  { name: "9月", 自社: 75, 業界平均: 70 },
  { name: "10月", 自社: 78, 業界平均: 72 },
  { name: "11月", 自社: 82, 業界平均: 73 },
];

// リーダーシップスコアのデータ (Bar Chart)
const leadershipData = [
  { name: "ビジョン構築", 自社: 75, 業界平均: 70 },
  { name: "目標設定", 自社: 68, 業界平均: 65 },
  { name: "コーチング", 自社: 82, 業界平均: 75 },
  { name: "フィードバック", 自社: 70, 業界平均: 68 },
  { name: "業績管理", 自社: 65, 業界平均: 62 },
  { name: "タレント育成", 自社: 78, 業界平均: 72 },
];

// 部署別エンゲージメントスコアのデータ (Pie/Bar Chart)
const departmentData = [
  { name: "経営企画部", value: 85 },
  { name: "人事部", value: 78 },
  { name: "営業部", value: 72 },
  { name: "マーケティング部", value: 80 },
  { name: "開発部", value: 76 },
  { name: "カスタマーサポート部", value: 70 },
];
const PIE_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Amber
  "#6366f1", // Indigo
  "#ec4899", // Pink
  "#f97316", // Orange
];

// スキル評価のデータ（レーダーチャート用）
const skillsData = [
  { subject: "コミュニケーション", 自社: 4.2, 業界平均: 3.9, fullMark: 5 },
  { subject: "問題解決", 自社: 3.8, 業界平均: 3.6, fullMark: 5 },
  { subject: "チームワーク", 自社: 4.0, 業界平均: 3.8, fullMark: 5 },
  { subject: "適応力", 自社: 3.9, 業界平均: 3.7, fullMark: 5 },
  { subject: "リーダーシップ", 自社: 3.5, 業界平均: 3.4, fullMark: 5 },
  { subject: "技術スキル", 自社: 4.1, 業界平均: 3.8, fullMark: 5 },
];

// トレンド分析データ (Line chart)
const trendData = [
  { name: "Q1 '22", エンゲージメント: 65, リーダーシップ: 60, スキル評価: 72 },
  { name: "Q2 '22", エンゲージメント: 68, リーダーシップ: 63, スキル評価: 74 },
  { name: "Q3 '22", エンゲージメント: 70, リーダーシップ: 65, スキル評価: 73 },
  { name: "Q4 '22", エンゲージメント: 72, リーダーシップ: 70, スキル評価: 75 },
  { name: "Q1 '23", エンゲージメント: 74, リーダーシップ: 72, スキル評価: 78 },
  { name: "Q2 '23", エンゲージメント: 78, リーダーシップ: 75, スキル評価: 80 },
  { name: "Q3 '23", エンゲージメント: 80, リーダーシップ: 78, スキル評価: 82 },
  { name: "Q4 '23", エンゲージメント: 82, リーダーシップ: 80, スキル評価: 85 },
];

// 主要指標データ
const keyMetrics = [
  {
    name: "従業員エンゲージメント",
    value: 82,
    change: 4,
    benchmark: 73,
    unit: "%",
    threshold: 70,
  },
  {
    name: "リーダーシップスコア",
    value: 78,
    change: 3,
    benchmark: 72,
    unit: "%",
    threshold: 65,
  },
  {
    name: "離職率",
    value: 5.2,
    change: -1.3,
    benchmark: 8.5,
    unit: "%",
    threshold: 10,
    lowerIsBetter: true,
  },
  {
    name: "従業員NPS",
    value: 42,
    change: 6,
    benchmark: 35,
    unit: "",
    threshold: 30,
  },
];
// --- End Mock Data ---

export default function DataAnalytics() {
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("last_6_months");
  const [selectedMetric, setSelectedMetric] = useState("engagement");
  const [selectedChart, setSelectedChart] = useState("line"); // Default chart type based on metric
  const [selectedCompareType, setSelectedCompareType] = useState("industry");
  const { toast } = useToast();

  // --- Chart Logic ---
  const getChartComponent = () => {
    // Note: Filtering isn't applied to mock data here.
    // In a real app, this function would fetch/filter data based on state.

    switch (selectedMetric) {
      case "engagement":
        return renderLineChart(
          engagementData,
          ["自社", "業界平均"],
          ["#3b82f6", "#6b7280"]
        );
      case "leadership":
        return renderBarChart(
          leadershipData,
          ["自社", "業界平均"],
          ["#3b82f6", "#6b7280"]
        );
      case "department":
        if (selectedChart === "pie") {
          return renderPieChart(departmentData);
        } else {
          // Show department scores as a bar chart if not pie
          return renderBarChart(
            departmentData.map((d) => ({ name: d.name, スコア: d.value })),
            ["スコア"],
            ["#3b82f6"]
          );
        }
      case "skills":
        return renderRadarChart(skillsData);
      case "trend":
        return renderLineChart(
          trendData,
          ["エンゲージメント", "リーダーシップ", "スキル評価"],
          ["#3b82f6", "#10b981", "#f59e0b"]
        );
      default:
        return <p>選択された指標のチャートは利用できません。</p>;
    }
  };

  const renderLineChart = (
    data: any[],
    dataKeys: string[],
    colors: string[]
  ) => (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} />
        <RechartsTooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "0.375rem",
          }}
          labelStyle={{ color: "#1f2937", fontWeight: "bold" }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBarChart = (
    data: any[],
    dataKeys: string[],
    colors: string[]
  ) => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} />
        <RechartsTooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "0.375rem",
          }}
          labelStyle={{ color: "#1f2937", fontWeight: "bold" }}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        {dataKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[index % colors.length]}
            radius={[4, 4, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // Example label
          outerRadius={120} // Adjust size as needed
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={PIE_COLORS[index % PIE_COLORS.length]}
            />
          ))}
        </Pie>
        <RechartsTooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "0.375rem",
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px" }}
          layout="vertical"
          verticalAlign="middle"
          align="right"
        />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderRadarChart = (data: any[]) => (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#e5e7eb" />
        <PolarAngleAxis dataKey="subject" stroke="#6b7280" fontSize={12} />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 5]}
          stroke="#6b7280"
          fontSize={10}
        />
        <Radar
          name="自社"
          dataKey="自社"
          stroke="#3b82f6"
          fill="#3b82f6"
          fillOpacity={0.6}
        />
        <Radar
          name="業界平均"
          dataKey="業界平均"
          stroke="#6b7280"
          fill="#6b7280"
          fillOpacity={0.6}
        />
        <Legend wrapperStyle={{ fontSize: "12px" }} />
        <RechartsTooltip
          contentStyle={{
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "0.375rem",
          }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );

  // --- End Chart Logic ---

  // --- Event Handlers ---
  const handleExport = (format: "pdf" | "csv" | "email") => {
    console.log(`Exporting/Sharing as ${format}...`); // Mock action
    toast({
      title: "エクスポート/共有",
      description: `${
        format === "email" ? "共有" : "エクスポート"
      }処理を開始します。(モック)`,
    });
  };

  // Update selected chart based on metric
  useEffect(() => {
    switch (selectedMetric) {
      case "skills":
        setSelectedChart("radar");
        break;
      case "trend":
      case "engagement":
        setSelectedChart("line");
        break;
      case "department":
        setSelectedChart("pie"); // Default department view to Pie
        break;
      case "leadership":
      default:
        setSelectedChart("bar");
        break;
    }
  }, [selectedMetric]);
  // --- End Event Handlers ---

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          データ分析 (全体結果)
        </h2>

        {/* Filter and Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Metric Selection Tabs */}
            <Tabs
              value={selectedMetric}
              onValueChange={setSelectedMetric}
              className="w-full sm:w-auto"
            >
              <TabsList>
                <TabsTrigger value="engagement">エンゲージメント</TabsTrigger>
                <TabsTrigger value="leadership">リーダーシップ</TabsTrigger>
                <TabsTrigger value="department">部署別</TabsTrigger>
                <TabsTrigger value="skills">スキル評価</TabsTrigger>
                <TabsTrigger value="trend">トレンド分析</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex gap-2 flex-wrap">
            {/* Export/Share Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  レポート/エクスポート
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleExport("pdf")}>
                  <FileText className="mr-2 h-4 w-4" />
                  PDFで出力
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport("csv")}>
                  <FileBarChart className="mr-2 h-4 w-4" />
                  CSVで出力
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleExport("email")}>
                  <Share2 className="mr-2 h-4 w-4" />
                  メールで共有
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  {" "}
                  {/* Mock Placeholder */}
                  <Info className="mr-2 h-4 w-4" />
                  定期レポート設定 (未実装)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  フィルターと表示設定
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">フィルター</h4>
                    <p className="text-sm text-muted-foreground">
                      表示するデータを絞り込みます。(モック)
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="filter-department">部署</Label>
                      <Select
                        value={selectedDepartment}
                        onValueChange={setSelectedDepartment}
                        name="filter-department"
                      >
                        <SelectTrigger
                          id="filter-department"
                          className="col-span-2 h-8"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部署</SelectItem>
                          <SelectItem value="hr">人事部</SelectItem>
                          <SelectItem value="sales">営業部</SelectItem>
                          <SelectItem value="marketing">
                            マーケティング部
                          </SelectItem>
                          <SelectItem value="engineering">開発部</SelectItem>
                          <SelectItem value="support">
                            カスタマーサポート部
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor="filter-period">期間</Label>
                      <Select
                        value={selectedPeriod}
                        onValueChange={setSelectedPeriod}
                        name="filter-period"
                      >
                        <SelectTrigger
                          id="filter-period"
                          className="col-span-2 h-8"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="last_3_months">
                            過去3ヶ月
                          </SelectItem>
                          <SelectItem value="last_6_months">
                            過去6ヶ月
                          </SelectItem>
                          <SelectItem value="last_year">過去1年</SelectItem>
                          <SelectItem value="last_2_years">過去2年</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {/* Add more filters like Role, Age Group if needed */}
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">比較対象</h4>
                    <RadioGroup
                      value={selectedCompareType}
                      onValueChange={setSelectedCompareType}
                      className="mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="department" id="r-department" />
                        <Label htmlFor="r-department">部署間比較</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="industry" id="r-industry" />
                        <Label htmlFor="r-industry">業界平均比較</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="historical" id="r-historical" />
                        <Label htmlFor="r-historical">過去データ比較</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">グラフタイプ</h4>
                    <div className="flex gap-2 mt-2">
                      <Button
                        variant={
                          selectedChart === "bar" ? "secondary" : "outline"
                        }
                        size="icon"
                        onClick={() => setSelectedChart("bar")}
                        title="棒グラフ"
                        disabled={
                          selectedMetric === "skills" ||
                          selectedMetric === "trend" ||
                          selectedMetric === "engagement"
                        } // Disable if not suitable
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={
                          selectedChart === "line" ? "secondary" : "outline"
                        }
                        size="icon"
                        onClick={() => setSelectedChart("line")}
                        title="折れ線グラフ"
                        disabled={
                          selectedMetric === "skills" ||
                          selectedMetric === "department"
                        } // Disable if not suitable
                      >
                        <LineChartIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={
                          selectedChart === "pie" ? "secondary" : "outline"
                        }
                        size="icon"
                        onClick={() => setSelectedChart("pie")}
                        title="円グラフ"
                        disabled={selectedMetric !== "department"} // Only enable for department
                      >
                        <PieChart className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={
                          selectedChart === "radar" ? "secondary" : "outline"
                        }
                        size="icon"
                        onClick={() => setSelectedChart("radar")}
                        title="レーダーチャート"
                        disabled={selectedMetric !== "skills"} // Only enable for skills data
                      >
                        <RadarIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {keyMetrics.map((metric, index) => {
            const isBelowThreshold = metric.lowerIsBetter
              ? metric.value > metric.threshold
              : metric.value < metric.threshold;
            const progressValue =
              metric.benchmark > 0
                ? (metric.value / metric.benchmark) * 100
                : 0;
            const displayProgress = Math.min(100, Math.max(0, progressValue)); // Clamp between 0-100

            return (
              <Card
                key={index}
                className={
                  isBelowThreshold ? "border-destructive border-2" : ""
                }
              >
                <CardHeader className="pb-2 pt-4 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-sm font-medium">
                    {metric.name}
                  </CardTitle>
                  {isBelowThreshold && (
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          閾値 ({metric.threshold}
                          {metric.unit}) を
                          {metric.lowerIsBetter ? "上回って" : "下回って"}います
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metric.value}
                    {metric.unit}
                    <span
                      className={`text-sm ml-2 ${
                        metric.change === 0
                          ? "text-gray-500"
                          : (
                              metric.lowerIsBetter
                                ? metric.change < 0
                                : metric.change > 0
                            )
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {metric.change > 0 ? `+${metric.change}` : metric.change}
                    </span>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-1 flex items-center justify-between">
                        <span>
                          業界平均: {metric.benchmark}
                          {metric.unit}
                        </span>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 cursor-help text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              自社スコア ({metric.value}
                              {metric.unit}) vs 業界平均 ({metric.benchmark}
                              {metric.unit})
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Progress
                        value={displayProgress}
                        className="h-1"
                        indicatorClassName={
                          metric.value >= metric.benchmark
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Chart Area */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {selectedMetric === "engagement" && "エンゲージメントスコア推移"}
              {selectedMetric === "leadership" && "リーダーシップスコア分析"}
              {selectedMetric === "department" &&
                "部署別エンゲージメントスコア"}
              {selectedMetric === "skills" && "スキル評価プロファイル"}
              {selectedMetric === "trend" && "主要指標トレンド分析"}
            </CardTitle>
            <CardDescription>
              {selectedMetric === "engagement" &&
                "過去6ヶ月間のエンゲージメントスコア推移と業界平均比較 (折れ線グラフ)"}
              {selectedMetric === "leadership" &&
                "リーダーシップスキル要素別の評価スコアと業界平均比較 (棒グラフ)"}
              {selectedMetric === "department" &&
                `部署別のエンゲージメントスコア比較 (${
                  selectedChart === "pie" ? "円グラフ" : "棒グラフ"
                })`}
              {selectedMetric === "skills" &&
                "主要スキル評価の自社平均と業界平均比較 (レーダーチャート)"}
              {selectedMetric === "trend" &&
                "過去2年間の四半期ごとの主要指標推移 (折れ線グラフ)"}
              <br />
              <span className="text-xs text-muted-foreground">
                フィルター設定:{" "}
                {selectedDepartment === "all" ? "全部署" : selectedDepartment},{" "}
                {selectedPeriod === "last_6_months"
                  ? "過去6ヶ月"
                  : selectedPeriod}{" "}
                (データはモックです)
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="h-[350px] sm:h-[400px]">{getChartComponent()}</div>
          </CardContent>
        </Card>

        {/* Insights Section */}
        <Card>
          <CardHeader>
            <CardTitle>主要インサイト</CardTitle>
            <CardDescription>
              データ分析から得られた主なインサイト (自動生成モック)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded">
                <h3 className="font-medium text-blue-800">
                  エンゲージメントスコアが過去6ヶ月で14%上昇
                </h3>
                <p className="text-sm text-blue-700">
                  新しいリモートワークポリシーとワークライフバランス施策の導入が主な要因と考えられます。業界平均との差も拡大しています。
                </p>
              </div>
              <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50 rounded">
                <h3 className="font-medium text-red-800">
                  部署間のエンゲージメント格差に注意
                </h3>
                <p className="text-sm text-red-700">
                  経営企画部(+15pt vs
                  平均)と開発部(+6pt)が高スコアを示す一方、カスタマーサポート部(-12pt)は相対的に低いスコアです。閾値を下回っており、改善施策が必要です。
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded">
                <h3 className="font-medium text-green-800">
                  リーダーシップスコアの改善
                </h3>
                <p className="text-sm text-green-700">
                  リーダーシップ研修プログラムの効果が現れ、特に「コーチング」(+14pt)と「フィードバック」(+10pt)項目で大幅な改善が見られます。
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 rounded">
                <h3 className="font-medium text-purple-800">
                  スキル評価：チームワークとコミュニケーションが強み
                </h3>
                <p className="text-sm text-purple-700">
                  「チームワーク」(4.0) と「コミュニケーション」(4.2)
                  は業界平均を上回る強みです。一方、「リーダーシップ」(3.5)
                  は今後の育成課題です。
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-2">
              <span className="text-sm text-muted-foreground">
                最終更新: 2023年12月1日 (モック) | レポート自動生成: 毎月1日
                (設定例)
              </span>
              <Button variant="outline" size="sm" disabled>
                詳細レポートを表示 (未実装)
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
