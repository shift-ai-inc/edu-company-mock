import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import {
  Edit,
  Trash2,
  UserPlus,
  Search,
  Filter, // Keep Filter icon
  Download,
  ChevronDown,
  MoreHorizontal,
  Users,
  Send, // Icon for Re-invite
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

// --- Mock Data & Types ---

const MOCK_GROUPS = [
  { id: "group1", name: "営業第一グループ" },
  { id: "group2", name: "開発グループ" },
  { id: "group3", name: "マーケティンググループ" },
  { id: "group4", name: "人事グループ" },
];

type AssessmentStatus = "未完了" | "完了" | "期限切れ";
type UserStatus = "active" | "inactive";
type RegistrationStatus = "registered" | "invited"; // New status

interface GeneralUser {
  id: string;
  name: string;
  email: string;
  groupIds: string[];
  lastLogin: Date | null;
  assessmentStatus: AssessmentStatus;
  status: UserStatus;
  registrationStatus: RegistrationStatus; // Added field
}

const initialMockUsers: GeneralUser[] = [
  // Existing users are 'registered'
  { id: "user1", name: "田中 太郎", email: "tanaka@example.com", groupIds: ["group1", "group3"], lastLogin: new Date(2023, 10, 15, 10, 30, 0), assessmentStatus: "完了", status: "active", registrationStatus: "registered" },
  { id: "user2", name: "佐藤 花子", email: "sato@example.com", groupIds: ["group2"], lastLogin: new Date(2023, 9, 20, 15, 0, 0), assessmentStatus: "未完了", status: "active", registrationStatus: "registered" },
  { id: "user3", name: "鈴木 一郎", email: "suzuki@example.com", groupIds: ["group1"], lastLogin: null, assessmentStatus: "期限切れ", status: "inactive", registrationStatus: "registered" }, // Was registered, now inactive
  { id: "user4", name: "高橋 四郎", email: "takahashi@example.com", groupIds: ["group2", "group4"], lastLogin: new Date(2023, 11, 1, 9, 0, 0), assessmentStatus: "完了", status: "active", registrationStatus: "registered" },
  { id: "user5", name: "渡辺 五月", email: "watanabe@example.com", groupIds: ["group3"], lastLogin: new Date(2023, 11, 5, 18, 45, 0), assessmentStatus: "未完了", status: "active", registrationStatus: "registered" },
  // User 6 was inactive, let's make them 'invited' (never registered)
  { id: "user6", name: "伊藤 六郎", email: "ito@example.com", groupIds: [], lastLogin: null, assessmentStatus: "未完了", status: "inactive", registrationStatus: "invited" },
  { id: "user7", name: "山本 七子", email: "yamamoto@example.com", groupIds: ["group1", "group2", "group3", "group4"], lastLogin: new Date(2023, 11, 10, 11, 0, 0), assessmentStatus: "完了", status: "active", registrationStatus: "registered" },
  { id: "user8", name: "中村 八郎", email: "nakamura@example.com", groupIds: ["group4"], lastLogin: new Date(2023, 11, 11, 14, 20, 0), assessmentStatus: "未完了", status: "active", registrationStatus: "registered" },
  // User 9 was inactive, let's make them 'invited' too
  { id: "user9", name: "小林 九子", email: "kobayashi@example.com", groupIds: ["group1"], lastLogin: null, assessmentStatus: "期限切れ", status: "inactive", registrationStatus: "invited" },
  { id: "user10", name: "加藤 十郎", email: "kato@example.com", groupIds: ["group2"], lastLogin: new Date(2023, 11, 12, 16, 0, 0), assessmentStatus: "完了", status: "active", registrationStatus: "registered" },
  { id: "user11", name: "吉田 一一", email: "yoshida@example.com", groupIds: ["group3"], lastLogin: new Date(2023, 11, 13, 8, 15, 0), assessmentStatus: "未完了", status: "active", registrationStatus: "registered" },
  // Add one more invited user
  { id: "user12", name: "斎藤 十二", email: "saito@example.com", groupIds: ["group4"], lastLogin: null, assessmentStatus: "未完了", status: "inactive", registrationStatus: "invited" },
];


const MOCK_EXISTING_EMAILS = [
  "existing@example.com",
  "test@example.com",
  "yamada@example.com",
  ...initialMockUsers.map((u) => u.email.toLowerCase()),
];

const MOCK_CONTRACT_LIMIT = 10;

// --- Helper Functions ---

const getGroupNames = (groupIds: string[]): string => {
  if (!groupIds || groupIds.length === 0) return "-";
  return groupIds
    .map((id) => MOCK_GROUPS.find((g) => g.id === id)?.name)
    .filter(Boolean)
    .join(", ");
};

const formatDate = (date: Date | null): string => {
  if (!date) return "-";
  const pad = (num: number) => num.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const getAssessmentBadgeVariant = (
  status: AssessmentStatus
): "default" | "secondary" | "destructive" => {
  switch (status) {
    case "完了": return "default";
    case "未完了": return "secondary";
    case "期限切れ": return "destructive";
    default: return "secondary";
  }
};

// Combine Status and Registration Status for display badge
const getUserStatusDisplay = (user: GeneralUser): { text: string; variant: "default" | "outline" | "secondary" } => {
  if (user.registrationStatus === 'invited') {
    return { text: '招待中', variant: 'secondary' };
  }
  if (user.status === 'active') {
    return { text: 'アクティブ', variant: 'default' };
  }
  return { text: '非アクティブ', variant: 'outline' }; // Registered but inactive
};


// --- Component ---

export default function GeneralUserList() {
  const [users, setUsers] = useState<GeneralUser[]>(initialMockUsers);
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [registrationFilter, setRegistrationFilter] = useState<RegistrationStatus | "all">("all"); // New filter state
  const [isBulkEditOpen, setIsBulkEditOpen] = useState(false);
  const [bulkEditGroups, setBulkEditGroups] = useState<Record<string, boolean>>({});
  const [bulkEditStatus, setBulkEditStatus] = useState<UserStatus | "keep">("keep");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isBulkEditOpen) {
      setBulkEditGroups({});
      setBulkEditStatus("keep");
    }
  }, [isBulkEditOpen]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = registrationFilter === "all" || user.registrationStatus === registrationFilter;
      return matchesSearch && matchesFilter;
    });
  }, [users, searchTerm, registrationFilter]); // Add registrationFilter dependency

  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedUserIds(new Set(filteredUsers.map((user) => user.id)));
    } else {
      setSelectedUserIds(new Set());
    }
  };

  const handleSelectRow = (userId: string, checked: boolean | "indeterminate") => {
    setSelectedUserIds((prev) => {
      const next = new Set(prev);
      if (checked === true) {
        next.add(userId);
      } else {
        next.delete(userId);
      }
      return next;
    });
  };

  const isAllSelected =
    filteredUsers.length > 0 && selectedUserIds.size === filteredUsers.length;
  const isIndeterminate =
    selectedUserIds.size > 0 && selectedUserIds.size < filteredUsers.length;

  const handleDeleteUser = (userId: string) => {
    const deletedUser = users.find((u) => u.id === userId);
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    setSelectedUserIds((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
    });
    if (deletedUser) {
      const index = MOCK_EXISTING_EMAILS.indexOf(deletedUser.email.toLowerCase());
      if (index > -1) MOCK_EXISTING_EMAILS.splice(index, 1);
      console.log(`AUDIT: User Deleted - ID: ${userId}, Name: ${deletedUser.name}, Email: ${deletedUser.email}`);
      toast({ title: "ユーザー削除", description: `ユーザー「${deletedUser.name}」を削除しました。` });
    }
    // TODO: API call to delete user
  };

  const handleExport = () => {
    console.log("Exporting data (CSV/Excel)...", Array.from(selectedUserIds));
    toast({ title: "エクスポート", description: "エクスポート機能は未実装です。", variant: "destructive" });
  };

  // --- Re-invite Logic ---
  const handleReinviteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user && user.registrationStatus === 'invited') {
      // TODO: Implement actual email sending logic
      // TODO: Allow customization of email template based on urgency/deadline
      console.log(`AUDIT: Re-invitation Sent - ID: ${userId}, Name: ${user.name}, Email: ${user.email}`);
      toast({
        title: "招待メール再送信",
        description: `ユーザー「${user.name}」(${user.email}) に招待メールを再送信しました。(シミュレーション)`,
      });
      // Optionally update user state if needed (e.g., last invited timestamp)
    } else {
       toast({
        title: "エラー",
        description: "このユーザーは再招待できません。",
        variant: "destructive",
      });
    }
  };

  // --- Bulk Edit Logic ---
  const handleBulkEditSave = () => {
    const usersToUpdate = Array.from(selectedUserIds);
    if (usersToUpdate.length === 0) {
      toast({ title: "エラー", description: "編集対象のユーザーが選択されていません。", variant: "destructive" });
      return;
    }

    const changes: Partial<GeneralUser> = {};
    const groupsToAdd = Object.entries(bulkEditGroups)
      .filter(([, checked]) => checked)
      .map(([groupId]) => groupId);

    let newStatus: UserStatus | undefined = undefined;
    if (bulkEditStatus !== "keep") {
      newStatus = bulkEditStatus;
      changes.status = newStatus;
    }

    // --- Contract Limit Check ---
    // Only check if activating users. Invited users becoming active count towards the limit.
    if (newStatus === 'active') {
        const currentActiveCount = users.filter(u => u.status === 'active' && !selectedUserIds.has(u.id)).length;
        // Count users who are currently inactive OR invited and are being set to active
        const newlyActivatedCount = usersToUpdate.filter(id => {
            const u = users.find(usr => usr.id === id);
            return u && (u.status === 'inactive' || u.registrationStatus === 'invited');
        }).length;
        const potentialActiveCount = currentActiveCount + newlyActivatedCount;

        if (potentialActiveCount > MOCK_CONTRACT_LIMIT) {
            toast({
                title: "契約上限エラー",
                description: `操作によりアクティブユーザー数が ${potentialActiveCount} 人となり、契約上限 (${MOCK_CONTRACT_LIMIT}人) を超えます。ステータス変更を調整してください。`,
                variant: "destructive",
                duration: 7000,
            });
            return;
        }
    }
    // --- End Contract Limit Check ---


    const updatedUsers = users.map(user => {
      if (selectedUserIds.has(user.id)) {
        const originalUser = { ...user };
        const updatedUser = { ...user };

        // Apply Status Change
        if (newStatus) {
          updatedUser.status = newStatus;
          // If activating an 'invited' user, mark them as 'registered'
          if (newStatus === 'active' && updatedUser.registrationStatus === 'invited') {
            updatedUser.registrationStatus = 'registered';
            // Potentially set lastLogin or assessmentStatus if needed upon activation
          }
        }

        // Apply Group Change
        if (groupsToAdd.length > 0) {
          const currentGroups = new Set(updatedUser.groupIds);
          groupsToAdd.forEach(groupId => currentGroups.add(groupId));
          updatedUser.groupIds = Array.from(currentGroups);
        }

        // Mock Audit Log
        console.log(`AUDIT: Bulk User Edit - ID: ${user.id}, Name: ${user.name}`);
        if (newStatus && newStatus !== originalUser.status) {
            console.log(`  - Status changed: ${originalUser.status} -> ${newStatus}`);
        }
        if (updatedUser.registrationStatus !== originalUser.registrationStatus) {
             console.log(`  - Registration Status changed: ${originalUser.registrationStatus} -> ${updatedUser.registrationStatus}`);
        }
        if (groupsToAdd.length > 0) {
             const addedGroupNames = groupsToAdd
                .filter(gid => !originalUser.groupIds.includes(gid))
                .map(gid => MOCK_GROUPS.find(g => g.id === gid)?.name || gid)
                .join(', ');
             if (addedGroupNames) {
                console.log(`  - Groups added: ${addedGroupNames}`);
             }
        }

        return updatedUser;
      }
      return user;
    });

    setUsers(updatedUsers);
    toast({ title: "一括編集完了", description: `${usersToUpdate.length}人のユーザー情報が更新されました。` });
    setSelectedUserIds(new Set());
    setIsBulkEditOpen(false);
  };


  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          企業一般ユーザー一覧
        </h2>
        <Button onClick={() => navigate("/general-users/create")}>
          <UserPlus className="mr-2 h-4 w-4" />
          新規ユーザー作成
        </Button>
      </div>

      {/* Toolbar Section */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 md:flex-grow-0">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="名前またはメールで検索..."
            className="pl-8 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center gap-2">
           {/* Registration Status Filter */}
           <div className="flex items-center gap-2">
             <Filter className="h-4 w-4 text-muted-foreground" />
             <Select
                value={registrationFilter}
                onValueChange={(value) => setRegistrationFilter(value as RegistrationStatus | "all")}
             >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="登録ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて表示</SelectItem>
                  <SelectItem value="registered">登録済み</SelectItem>
                  <SelectItem value="invited">招待中 (未登録)</SelectItem>
                </SelectContent>
              </Select>
           </div>

          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            エクスポート
          </Button>

          {/* Bulk Actions Dropdown */}
          <Dialog open={isBulkEditOpen} onOpenChange={setIsBulkEditOpen}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={selectedUserIds.size === 0}>
                  一括操作
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>選択したユーザー ({selectedUserIds.size})</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Users className="mr-2 h-4 w-4" />
                        一括編集
                    </DropdownMenuItem>
                </DialogTrigger>
                <DropdownMenuItem disabled>
                  権限設定 (未実装)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  disabled // Enable carefully
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  削除 (未実装)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Bulk Edit Dialog Content */}
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>ユーザー一括編集</DialogTitle>
                <DialogDescription>
                  選択した {selectedUserIds.size} 人のユーザー情報を一括で変更します。
                  契約上限: {MOCK_CONTRACT_LIMIT}人
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                {/* Group Assignment */}
                <div className="space-y-2">
                   <Label className="font-semibold">グループ割り当て (追加)</Label>
                   <p className="text-sm text-muted-foreground">
                     選択したユーザーを以下のグループに追加します。(削除は未実装)
                   </p>
                   <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 border rounded">
                     {MOCK_GROUPS.map((group) => (
                       <div key={group.id} className="flex items-center space-x-2">
                         <Checkbox
                           id={`bulk-group-${group.id}`}
                           checked={!!bulkEditGroups[group.id]}
                           onCheckedChange={(checked) => {
                             setBulkEditGroups(prev => ({
                               ...prev,
                               [group.id]: checked === true,
                             }));
                           }}
                         />
                         <Label htmlFor={`bulk-group-${group.id}`} className="text-sm font-normal cursor-pointer">
                           {group.name}
                         </Label>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Status Change */}
                <div className="space-y-2">
                  <Label className="font-semibold">ステータス変更</Label>
                   <p className="text-sm text-muted-foreground">
                     「招待中」のユーザーを「アクティブ」にすると「登録済み」になります。
                   </p>
                  <RadioGroup
                    value={bulkEditStatus}
                    onValueChange={(value) => setBulkEditStatus(value as UserStatus | "keep")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="keep" id="status-keep" />
                      <Label htmlFor="status-keep" className="cursor-pointer">変更しない</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="active" id="status-active" />
                      <Label htmlFor="status-active" className="cursor-pointer">アクティブ</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inactive" id="status-inactive" />
                      <Label htmlFor="status-inactive" className="cursor-pointer">非アクティブ</Label>
                    </div>
                  </RadioGroup>
                </div>

                 {/* Permissions Placeholder */}
                 <div className="space-y-2 opacity-50">
                    <Label className="font-semibold">権限設定 (未実装)</Label>
                    <p className="text-sm text-muted-foreground">
                        権限の一括設定は現在利用できません。
                    </p>
                 </div>

              </div>
              <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">キャンセル</Button>
                </DialogClose>
                <Button type="button" onClick={handleBulkEditSave}>変更を保存</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog> {/* End Dialog */}

        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead padding="checkbox" className="w-[50px]">
                <Checkbox
                  checked={
                    isAllSelected ? true : isIndeterminate ? "indeterminate" : false
                  }
                  onCheckedChange={handleSelectAll}
                  aria-label="すべての行を選択"
                />
              </TableHead>
              <TableHead>氏名</TableHead>
              <TableHead>メールアドレス</TableHead>
              <TableHead>所属グループ</TableHead>
              <TableHead>最終ログイン</TableHead>
              <TableHead>アセスメント</TableHead>
              <TableHead>ステータス</TableHead> {/* Combined Status */}
              <TableHead className="text-right w-[120px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center text-muted-foreground h-24"
                >
                  {searchTerm && registrationFilter === 'all' ? "検索結果がありません。" :
                   registrationFilter !== 'all' ? "該当するステータスのユーザーがいません。" :
                   "登録されているユーザーがいません。"}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const statusDisplay = getUserStatusDisplay(user); // Get combined status
                return (
                  <TableRow
                    key={user.id}
                    data-state={selectedUserIds.has(user.id) ? "selected" : ""}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUserIds.has(user.id)}
                        onCheckedChange={(checked) => handleSelectRow(user.id, checked)}
                        aria-label={`ユーザー ${user.name} を選択`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getGroupNames(user.groupIds)}</TableCell>
                    <TableCell>{formatDate(user.lastLogin)}</TableCell>
                    <TableCell>
                      <Badge variant={getAssessmentBadgeVariant(user.assessmentStatus)}>
                        {user.assessmentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusDisplay.variant}>
                        {statusDisplay.text}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">メニューを開く</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>アクション</DropdownMenuLabel>
                          {user.registrationStatus === 'invited' && (
                            <DropdownMenuItem onClick={() => handleReinviteUser(user.id)}>
                              <Send className="mr-2 h-4 w-4" />
                              招待メール再送信
                            </DropdownMenuItem>
                          )}
                          {user.registrationStatus === 'registered' && ( // Only allow edit for registered users for now
                            <DropdownMenuItem
                              onClick={() => navigate(`/general-users/edit/${user.id}`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              編集
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                削除
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>ユーザー削除確認</AlertDialogTitle>
                                <AlertDialogDescription>
                                  ユーザー「{user.name}」({user.email}) を本当に削除しますか？この操作は元に戻せません。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteUser(user.id)}
                                  className={buttonVariants({ variant: "destructive" })}
                                >
                                  削除する
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
       <div className="mt-4 text-center text-sm text-muted-foreground">
            ページネーションは未実装です。 (全 {users.length} 件中 {filteredUsers.length} 件表示)
       </div>
    </div>
  );
}

// Export mock data and types
export { MOCK_GROUPS, MOCK_EXISTING_EMAILS, initialMockUsers as MOCK_USERS };
export type { GeneralUser, AssessmentStatus, UserStatus, RegistrationStatus }; // Export RegistrationStatus
