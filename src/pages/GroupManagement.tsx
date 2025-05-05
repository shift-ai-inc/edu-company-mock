import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
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
  Users,
  FolderTree,
  Building,
  ChevronRight,
  Pencil,
  Trash2,
  UserPlus,
  ChevronDown,
  Palette, // Icon for color
  Type, // Icon for abbreviation
  Settings, // Icon for settings
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
  DialogTrigger, // Import DialogTrigger
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast"; // Import useToast

// グループデータの型定義 (拡張) - Export this type
export interface Group {
  id: number;
  name: string;
  type: "department" | "team" | "project";
  parentId: number | null;
  memberCount: number; // 所属ユーザー数
  description: string; // 説明
  createdAt: string; // 作成日
  colorCode?: string; // 追加: カラーコード
  abbreviation?: string; // 追加: 略称
  settings?: string; // 追加: グループ特有設定 (例: JSON string or simple text)
}

// メンバーデータの型定義
interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
}

// サンプルグループデータ (拡張) - Export this data
export const sampleGroups: Group[] = [
  {
    id: 1,
    name: "経営企画部",
    type: "department",
    parentId: null,
    memberCount: 12,
    description: "経営戦略の策定と実行を担当",
    createdAt: "2023-04-01",
    colorCode: "#FF5733",
    abbreviation: "経企",
    settings: '{"autoAssignAssessment": true}',
  },
  {
    id: 2,
    name: "人事部",
    type: "department",
    parentId: null,
    memberCount: 8,
    description: "採用、研修、労務管理を担当",
    createdAt: "2023-04-01",
    colorCode: "#33FF57",
    abbreviation: "人事",
  },
  {
    id: 3,
    name: "マーケティング部",
    type: "department",
    parentId: null,
    memberCount: 15,
    description: "マーケティング戦略と実行を担当",
    createdAt: "2023-04-01",
    colorCode: "#3357FF",
    abbreviation: "マケ",
    settings: '{"defaultNotification": "email"}',
  },
  {
    id: 4,
    name: "営業部",
    type: "department",
    parentId: null,
    memberCount: 25,
    description: "新規顧客開拓と既存顧客管理を担当",
    createdAt: "2023-04-01",
    colorCode: "#FF33A1",
    abbreviation: "営業",
  },
  {
    id: 5,
    name: "テクニカルチーム",
    type: "team",
    parentId: 3,
    memberCount: 6,
    description: "技術的なマーケティング施策を担当",
    createdAt: "2023-06-15",
    colorCode: "#F3FF33",
    abbreviation: "技",
  },
  {
    id: 6,
    name: "コンテンツチーム",
    type: "team",
    parentId: 3,
    memberCount: 4,
    description: "コンテンツ制作と管理を担当",
    createdAt: "2023-06-15",
    colorCode: "#33FFF3",
    abbreviation: "コン",
  },
  {
    id: 7,
    name: "西日本営業チーム",
    type: "team",
    parentId: 4,
    memberCount: 12,
    description: "西日本地域の営業を担当",
    createdAt: "2023-05-10",
    colorCode: "#FF8C33",
    abbreviation: "西営",
  },
  {
    id: 8,
    name: "東日本営業チーム",
    type: "team",
    parentId: 4,
    memberCount: 13,
    description: "東日本地域の営業を担当",
    createdAt: "2023-05-10",
    colorCode: "#8C33FF",
    abbreviation: "東営",
  },
  {
    id: 9,
    name: "新規事業開発プロジェクト",
    type: "project",
    parentId: 1,
    memberCount: 5,
    description: "新規事業の企画と立ち上げを担当",
    createdAt: "2023-07-01",
    colorCode: "#33FF8C",
    abbreviation: "新事",
  },
];

// サンプルメンバーデータ
const sampleMembers: Member[] = [
  {
    id: 1,
    name: "山田太郎",
    email: "yamada@example.com",
    role: "管理者",
    department: "経営企画部",
  },
  {
    id: 2,
    name: "佐藤花子",
    email: "sato@example.com",
    role: "一般ユーザー",
    department: "人事部",
  },
  {
    id: 3,
    name: "鈴木一郎",
    email: "suzuki@example.com",
    role: "リーダー",
    department: "マーケティング部",
  },
  {
    id: 4,
    name: "田中美咲",
    email: "tanaka@example.com",
    role: "管理者",
    department: "マーケティング部",
  },
  {
    id: 5,
    name: "伊藤健太",
    email: "ito@example.com",
    role: "一般ユーザー",
    department: "テクニカルチーム",
  },
  {
    id: 6,
    name: "渡辺裕子",
    email: "watanabe@example.com",
    role: "一般ユーザー",
    department: "コンテンツチーム",
  },
  {
    id: 7,
    name: "加藤誠",
    email: "kato@example.com",
    role: "リーダー",
    department: "西日本営業チーム",
  },
  {
    id: 8,
    name: "中村圭介",
    email: "nakamura@example.com",
    role: "一般ユーザー",
    department: "東日本営業チーム",
  },
];

// --- Create Group Dialog State ---
interface CreateGroupState {
  name: string;
  type: Group["type"] | "";
  parentId: string; // Store as string ("none" or group ID)
  description: string;
  colorCode: string;
  abbreviation: string;
  settings: string;
}

const initialCreateGroupState: CreateGroupState = {
  name: "",
  type: "",
  parentId: "none",
  description: "",
  colorCode: "#cccccc", // Default color
  abbreviation: "",
  settings: "",
};

export default function GroupManagement() {
  const [groups, setGroups] = useState<Group[]>(sampleGroups);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all"); // Default to 'all'
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [showAddMembersDialog, setShowAddMembersDialog] = useState(false);
  const [showOrganizationDialog, setShowOrganizationDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [createGroupData, setCreateGroupData] = useState<CreateGroupState>(initialCreateGroupState);
  const { toast } = useToast(); // Initialize toast
  const navigate = useNavigate(); // Initialize navigate

  // フィルタリングされたグループリスト
  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || group.type === selectedType;
    return matchesSearch && matchesType;
  });

  // グループタイプに応じたアイコンを返す
  const getGroupIcon = (type: string) => {
    switch (type) {
      case "department": return <Building className="h-4 w-4" />;
      case "team": return <Users className="h-4 w-4" />;
      case "project": return <FolderTree className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  // グループタイプの日本語表記を返す
  const getGroupTypeName = (type: string) => {
    switch (type) {
      case "department": return "部署";
      case "team": return "チーム";
      case "project": return "プロジェクト";
      default: return type;
    }
  };

  // 親グループの名前を取得
  const getParentName = (parentId: number | null) => {
    if (parentId === null) return "-";
    const parent = groups.find((g) => g.id === parentId);
    return parent ? parent.name : "-";
  };

  // チェックボックスの変更ハンドラ
  const handleMemberToggle = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  // --- Create Group Logic ---
  const handleCreateGroupInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateGroupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateGroupSelectChange = (name: keyof CreateGroupState) => (value: string) => {
    setCreateGroupData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateGroup = () => {
    // Basic Validation
    if (!createGroupData.name || !createGroupData.type) {
      toast({
        title: "エラー",
        description: "グループ名とタイプは必須です。",
        variant: "destructive",
      });
      return;
    }

    // Mock Group Creation
    const newGroup: Group = {
      id: Math.max(0, ...groups.map(g => g.id)) + 1, // Simple ID generation
      name: createGroupData.name,
      type: createGroupData.type as Group["type"], // Assert type after validation
      parentId: createGroupData.parentId === "none" ? null : parseInt(createGroupData.parentId, 10),
      memberCount: 0, // Starts with 0 members
      description: createGroupData.description,
      createdAt: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      colorCode: createGroupData.colorCode,
      abbreviation: createGroupData.abbreviation,
      settings: createGroupData.settings,
    };

    setGroups((prev) => [...prev, newGroup]);
    // Also update the exported sampleGroups if it's intended to be the single source of truth
    // sampleGroups.push(newGroup); // Be careful with direct mutation if imported elsewhere
    setShowCreateGroupDialog(false);
    setCreateGroupData(initialCreateGroupState); // Reset form
    toast({
      title: "成功",
      description: `グループ「${newGroup.name}」が作成されました。`,
    });
  };
  // --- End Create Group Logic ---

  // --- Row Click Navigation ---
  const handleRowClick = (groupId: number) => {
    navigate(`/groups/${groupId}`);
  };
  // --- End Row Click Navigation ---

  return (
    <div className="p-8">
      {/* Header and Toolbar */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          グループ管理
        </h2>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Search and Filter */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="グループを検索..."
                className="pl-8 w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="グループタイプ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">すべてのタイプ</SelectItem>
                <SelectItem value="department">部署</SelectItem>
                <SelectItem value="team">チーム</SelectItem>
                <SelectItem value="project">プロジェクト</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowOrganizationDialog(true)}>
              <FolderTree className="mr-2 h-4 w-4" />
              組織図を表示
            </Button>
            <Button onClick={() => setShowCreateGroupDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              新規グループ
            </Button>
          </div>
        </div>
      </div>

      {/* Group Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>グループ名</TableHead>
              <TableHead>タイプ</TableHead>
              <TableHead>親グループ</TableHead>
              <TableHead>メンバー数</TableHead>
              <TableHead>説明</TableHead>
              <TableHead>作成日</TableHead>
              <TableHead className="text-right">アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <TableRow
                  key={group.id}
                  onClick={() => handleRowClick(group.id)} // Add onClick handler
                  className="cursor-pointer hover:bg-muted/60" // Add cursor and hover styles
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* Display Color Code */}
                      {group.colorCode && (
                        <span
                          className="h-4 w-4 rounded-full inline-block border border-gray-300"
                          style={{ backgroundColor: group.colorCode }}
                          title={`カラーコード: ${group.colorCode}`}
                        ></span>
                      )}
                      {getGroupIcon(group.type)}
                      <span className="font-medium">{group.name}</span>
                      {/* Display Abbreviation */}
                      {group.abbreviation && (
                        <Badge variant="secondary" title={`略称: ${group.abbreviation}`}>
                          {group.abbreviation}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getGroupTypeName(group.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getParentName(group.parentId)}</TableCell>
                  <TableCell>{group.memberCount}</TableCell>
                  <TableCell className="max-w-[250px] truncate" title={group.description}>
                    {group.description || "-"}
                  </TableCell>
                  <TableCell>{group.createdAt}</TableCell>
                  <TableCell className="text-right">
                    {/* Stop propagation on dropdown trigger */}
                    <DropdownMenu onOpenChange={(open) => { if (open) { event?.stopPropagation(); } }}>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation(); // Stop propagation here too
                            setSelectedGroup(group);
                            setSelectedMembers([]);
                            setShowAddMembersDialog(true);
                          }}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          メンバー追加/表示
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled onClick={(e) => e.stopPropagation()}> {/* TODO: Implement Edit */}
                          <Pencil className="mr-2 h-4 w-4" />
                          編集
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled onClick={(e) => e.stopPropagation()}> {/* TODO: Implement Settings View/Edit */}
                           <Settings className="mr-2 h-4 w-4" />
                           設定
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" disabled onClick={(e) => e.stopPropagation()}> {/* TODO: Implement Delete */}
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
                <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                  {searchQuery || selectedType !== 'all'
                    ? "条件に一致するグループが見つかりませんでした。"
                    : "グループが登録されていません。"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 新規グループ作成ダイアログ (Enhanced) */}
      <Dialog
        open={showCreateGroupDialog}
        onOpenChange={(isOpen) => {
          setShowCreateGroupDialog(isOpen);
          if (!isOpen) setCreateGroupData(initialCreateGroupState); // Reset form on close
        }}
      >
        <DialogContent className="sm:max-w-[650px]">
          <DialogHeader>
            <DialogTitle>新規グループの作成</DialogTitle>
            <DialogDescription>
              グループ情報を入力して、新しいグループを作成します。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-group-name">グループ名 <span className="text-red-500">*</span></Label>
                <Input
                  id="create-group-name"
                  name="name"
                  placeholder="例：マーケティング部"
                  value={createGroupData.name}
                  onChange={handleCreateGroupInputChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-group-type">グループタイプ <span className="text-red-500">*</span></Label>
                <Select
                  name="type"
                  value={createGroupData.type}
                  onValueChange={handleCreateGroupSelectChange("type")}
                >
                  <SelectTrigger id="create-group-type">
                    <SelectValue placeholder="タイプを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="department">部署</SelectItem>
                    <SelectItem value="team">チーム</SelectItem>
                    <SelectItem value="project">プロジェクト</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-parent-group">親グループ (オプション)</Label>
                <Select
                  name="parentId"
                  value={createGroupData.parentId}
                  onValueChange={handleCreateGroupSelectChange("parentId")}
                >
                  <SelectTrigger id="create-parent-group">
                    <SelectValue placeholder="親グループを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">なし</SelectItem>
                    {groups
                      .filter(g => g.type === 'department') // Example: Only allow departments as parents
                      .map((group) => (
                      <SelectItem key={group.id} value={group.id.toString()}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="create-description">説明</Label>
              <Textarea
                id="create-description"
                name="description"
                placeholder="グループの説明や目的を入力してください"
                value={createGroupData.description}
                onChange={handleCreateGroupInputChange}
                rows={3}
              />
            </div>
            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="create-abbreviation">略称</Label>
                <Input
                  id="create-abbreviation"
                  name="abbreviation"
                  placeholder="例: マケ部"
                  value={createGroupData.abbreviation}
                  onChange={handleCreateGroupInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-colorCode">カラーコード</Label>
                 <div className="flex items-center gap-2">
                   <Input
                     id="create-colorCode"
                     name="colorCode"
                     type="color" // Use color input type
                     value={createGroupData.colorCode}
                     onChange={handleCreateGroupInputChange}
                     className="w-10 h-9 p-1" // Adjust size
                   />
                   <Input
                     type="text"
                     value={createGroupData.colorCode}
                     onChange={handleCreateGroupInputChange}
                     name="colorCode"
                     placeholder="#rrggbb"
                     className="flex-1"
                   />
                 </div>
              </div>
            </div>
             {/* Group Specific Settings (Placeholder) */}
             <div className="space-y-2">
                <Label htmlFor="create-settings">グループ特有設定 (プレースホルダー)</Label>
                <Textarea
                  id="create-settings"
                  name="settings"
                  placeholder="例: アセスメント自動割当ルール (JSON形式など)"
                  value={createGroupData.settings}
                  onChange={handleCreateGroupInputChange}
                  rows={3}
                  disabled // Keep disabled until fully implemented
                />
                 <p className="text-xs text-muted-foreground">
                   この機能は現在開発中です。将来的に、アセスメントルールなどを設定できるようになります。
                 </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateGroupDialog(false)}
            >
              キャンセル
            </Button>
            <Button onClick={handleCreateGroup}>
              グループを作成
            </Button>
            {/* TODO: Add "Create and Add Members" button? */}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* メンバー追加/表示ダイアログ (No changes needed here for now) */}
      <Dialog
        open={showAddMembersDialog}
        onOpenChange={setShowAddMembersDialog}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>メンバー管理: {selectedGroup?.name}</DialogTitle>
            <DialogDescription>
              グループメンバーの表示と追加を行います。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {/* TODO: Display current members */}
            <h4 className="text-lg font-semibold mb-2">現在のメンバー</h4>
            <p className="text-sm text-muted-foreground mb-4">（表示機能は未実装）</p>

            <h4 className="text-lg font-semibold mb-2 border-t pt-4">メンバーを追加</h4>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input placeholder="追加するメンバーを検索..." className="pl-8" />
            </div>
            <div className="border rounded-md max-h-[300px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>名前</TableHead>
                    <TableHead>メールアドレス</TableHead>
                    <TableHead>現在の部署</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedMembers.includes(member.id)}
                          onCheckedChange={() => handleMemberToggle(member.id)}
                          aria-label={`Select member ${member.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{member.name[0]}</AvatarFallback>
                          </Avatar>
                          <span>{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.department}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <div className="mr-auto text-sm text-gray-500">
              {selectedMembers.length}名のメンバーを選択中
            </div>
            <Button
              variant="outline"
              onClick={() => setShowAddMembersDialog(false)}
            >
              キャンセル
            </Button>
            <Button
              onClick={() => {
                console.log("Adding members:", selectedMembers, "to group:", selectedGroup?.id);
                // TODO: Implement actual member addition logic (update group.memberCount, etc.)
                const updatedGroups = groups.map(g => {
                    if (g.id === selectedGroup?.id) {
                        // This is a mock update, real implementation would involve user-group mapping
                        return { ...g, memberCount: g.memberCount + selectedMembers.length };
                    }
                    return g;
                });
                setGroups(updatedGroups);
                // Also update the exported sampleGroups if needed
                // const sampleIndex = sampleGroups.findIndex(g => g.id === selectedGroup?.id);
                // if (sampleIndex > -1) sampleGroups[sampleIndex].memberCount += selectedMembers.length;
                setShowAddMembersDialog(false);
                toast({ title: "成功", description: `${selectedMembers.length}名のメンバーが追加されました（モック）。` });
              }}
              disabled={selectedMembers.length === 0}
            >
              選択したメンバーを追加
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 組織図ダイアログ (No changes needed here) */}
      <Dialog
        open={showOrganizationDialog}
        onOpenChange={setShowOrganizationDialog}
      >
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>組織図</DialogTitle>
            <DialogDescription>
              組織のグループ階層構造を表示します。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 h-[400px] overflow-auto border rounded-md p-4 space-y-4">
            {groups
              .filter((group) => group.parentId === null)
              .map((department) => (
                <div key={department.id}>
                  <div className="flex items-center gap-2 font-semibold">
                    <Building className="h-5 w-5 text-gray-700" />
                    <span>{department.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {department.memberCount}名
                    </Badge>
                  </div>
                  <div className="pl-6 mt-2 space-y-2 border-l ml-2.5">
                    {groups
                      .filter((group) => group.parentId === department.id)
                      .map((subGroup) => (
                        <div key={subGroup.id} className="flex items-center gap-2 pt-1">
                           <div className="w-3 border-b mr-1"></div>
                           {getGroupIcon(subGroup.type)}
                           <span>{subGroup.name}</span>
                           <Badge variant="outline" className="ml-auto">
                             {subGroup.memberCount}名
                           </Badge>
                        </div>
                      ))}
                     {groups.filter((group) => group.parentId === department.id).length === 0 && (
                        <div className="text-sm text-gray-500 italic pl-4">サブグループなし</div>
                     )}
                  </div>
                </div>
              ))}
             {groups.filter((group) => group.parentId === null).length === 0 && (
                 <div className="text-center text-gray-500">部署が登録されていません。</div>
             )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowOrganizationDialog(false)}
            >
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Export sample groups and type for potential use elsewhere (like GroupDetail)
// export { sampleGroups }; // Already exported above
// export type { Group }; // Already exported above
