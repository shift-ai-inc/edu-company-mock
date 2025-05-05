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
  PlusCircle,
  Upload,
  Download,
  Filter,
  MoreHorizontal,
  Mail,
  KeyRound,
  EyeOff,
  Trash2,
  UserPlus,
  FileUp,
  Users,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "pending" | "inactive";
  lastLogin: string;
}

// サンプルユーザーデータ
const sampleUsers: User[] = [
  {
    id: 1,
    name: "山田太郎",
    email: "yamada@example.com",
    role: "管理者",
    department: "経営企画部",
    status: "active",
    lastLogin: "2024/03/20",
  },
  {
    id: 2,
    name: "佐藤花子",
    email: "sato@example.com",
    role: "一般ユーザー",
    department: "人事部",
    status: "active",
    lastLogin: "2024/03/19",
  },
  {
    id: 3,
    name: "鈴木一郎",
    email: "suzuki@example.com",
    role: "リーダー",
    department: "営業部",
    status: "active",
    lastLogin: "2024/03/18",
  },
  {
    id: 4,
    name: "田中美咲",
    email: "tanaka@example.com",
    role: "管理者",
    department: "IT部",
    status: "pending",
    lastLogin: "2024/03/17",
  },
  {
    id: 5,
    name: "伊藤健太",
    email: "ito@example.com",
    role: "一般ユーザー",
    department: "マーケティング部",
    status: "inactive",
    lastLogin: "2024/03/15",
  },
  {
    id: 6,
    name: "渡辺裕子",
    email: "watanabe@example.com",
    role: "一般ユーザー",
    department: "財務部",
    status: "active",
    lastLogin: "2024/03/15",
  },
  {
    id: 7,
    name: "加藤誠",
    email: "kato@example.com",
    role: "リーダー",
    department: "開発部",
    status: "active",
    lastLogin: "2024/03/14",
  },
  {
    id: 8,
    name: "中村圭介",
    email: "nakamura@example.com",
    role: "一般ユーザー",
    department: "営業部",
    status: "active",
    lastLogin: "2024/03/13",
  },
];

// サンプル部署データ
const departments = [
  "経営企画部",
  "人事部",
  "営業部",
  "IT部",
  "マーケティング部",
  "財務部",
  "開発部",
  "カスタマーサポート部",
];

// サンプル役割データ
const roles = [
  { id: "admin", name: "管理者", description: "すべての機能にアクセス可能" },
  {
    id: "leader",
    name: "リーダー",
    description: "チームメンバー管理とデータ閲覧",
  },
  { id: "user", name: "一般ユーザー", description: "基本機能のみ使用可能" },
];

export default function UserManagement({
  register = false,
  permissions = false,
}) {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [showAddUserDialog, setShowAddUserDialog] = useState(register);
  const [showBulkImportDialog, setShowBulkImportDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] =
    useState(permissions);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // フィルタリングされたユーザーリスト
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    const matchesStatus = !selectedStatus || user.status === selectedStatus;
    const matchesDepartment =
      !selectedDepartment || user.department === selectedDepartment;

    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleDeleteSelected = () => {
    if (
      window.confirm(
        `選択した${selectedUsers.length}名のメンバーを削除しますか？`
      )
    ) {
      setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
      setSelectAll(false);
    }
  };

  const handleBulkStatusChange = (
    status: "active" | "pending" | "inactive"
  ) => {
    if (selectedUsers.length === 0) return;

    setUsers(
      users.map((user) =>
        selectedUsers.includes(user.id) ? { ...user, status } : user
      )
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            有効
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            保留中
          </Badge>
        );
      case "inactive":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            無効
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">メンバー管理</CardTitle>
          <CardDescription>メンバーの検索、追加、編集、削除を行います。</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap gap-2 items-center">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="メンバーを検索..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="役割" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">すべての役割</SelectItem>
                    <SelectItem value="管理者">管理者</SelectItem>
                    <SelectItem value="リーダー">リーダー</SelectItem>
                    <SelectItem value="一般ユーザー">一般ユーザー</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="ステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">すべてのステータス</SelectItem>
                    <SelectItem value="active">有効</SelectItem>
                    <SelectItem value="pending">保留中</SelectItem>
                    <SelectItem value="inactive">無効</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="部署" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">すべての部署</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <UserPlus className="mr-2 h-4 w-4" />
                      メンバー追加
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setShowAddUserDialog(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      個別登録
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowBulkImportDialog(true)}>
                      <FileUp className="mr-2 h-4 w-4" />
                      一括インポート (CSV)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      <MoreHorizontal className="mr-2 h-4 w-4" />
                      その他
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => setShowPermissionsDialog(true)}
                    >
                      <UserCheck className="mr-2 h-4 w-4" />
                      権限設定
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="mr-2 h-4 w-4" />
                      CSVエクスポート
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={handleDeleteSelected}
                      disabled={selectedUsers.length === 0}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      選択したメンバーを削除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {selectedUsers.length > 0 && (
            <div className="bg-blue-50 p-3 mb-4 rounded-lg flex justify-between items-center">
              <div className="text-sm">
                <span className="font-medium">{selectedUsers.length}</span>{" "}
                名のメンバーを選択中
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange("active")}
                >
                  有効にする
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkStatusChange("inactive")}
                >
                  無効にする
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600"
                  onClick={handleDeleteSelected}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  削除
                </Button>
              </div>
            </div>
          )}

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectAll}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>名前</TableHead>
                  <TableHead>メールアドレス</TableHead>
                  <TableHead>部署</TableHead>
                  <TableHead>役割</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>最終ログイン</TableHead>
                  <TableHead className="text-right">アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => handleSelectUser(user.id)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            user.role === "管理者"
                              ? "bg-blue-100 text-blue-800"
                              : user.role === "リーダー"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>編集</DropdownMenuItem>
                            <DropdownMenuItem>
                              <KeyRound className="mr-2 h-4 w-4" />
                              パスワードリセット
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="mr-2 h-4 w-4" />
                              メール送信
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
                      検索条件に一致するメンバーが見つかりませんでした
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* --- Dialogs remain unchanged --- */}

      {/* 個別メンバー追加ダイアログ */}
      <Dialog open={showAddUserDialog} onOpenChange={setShowAddUserDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>新規メンバー登録</DialogTitle>
            <DialogDescription>
              メンバー情報を入力し、アカウントを作成します。登録後、認証情報がメールで送信されます。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">氏名</Label>
                <Input id="name" placeholder="例：山田太郎" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">メールアドレス</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="例：yamada@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">部署</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="部署を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">役割</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="役割を選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="send-invite">招待メールを送信</Label>
                <Switch id="send-invite" defaultChecked />
              </div>
              <p className="text-sm text-muted-foreground">
                有効にすると、登録時に招待メールが自動送信されます
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddUserDialog(false)}
            >
              キャンセル
            </Button>
            <Button onClick={() => setShowAddUserDialog(false)}>
              <UserPlus className="mr-2 h-4 w-4" />
              メンバーを登録
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 一括インポートダイアログ */}
      <Dialog
        open={showBulkImportDialog}
        onOpenChange={setShowBulkImportDialog}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>メンバー一括インポート</DialogTitle>
            <DialogDescription>
              CSVファイルをアップロードして、複数のメンバーを一度に登録できます。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-gray-400 mb-2" />
                <h3 className="text-lg font-medium">CSVファイルをドロップ</h3>
                <p className="text-sm text-gray-500 mb-4">または</p>
                <Button variant="outline">ファイルを選択</Button>
              </div>
            </div>
            <Alert>
              <AlertDescription>
                CSVファイルは以下の列を含める必要があります：氏名、メールアドレス、部署、役割
              </AlertDescription>
            </Alert>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="send-invite-bulk">招待メールを送信</Label>
                <Switch id="send-invite-bulk" defaultChecked />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                有効にすると、登録時に招待メールが自動送信されます
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBulkImportDialog(false)}
            >
              キャンセル
            </Button>
            <Button onClick={() => setShowBulkImportDialog(false)}>
              インポート
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 権限設定ダイアログ */}
      <Dialog
        open={showPermissionsDialog}
        onOpenChange={setShowPermissionsDialog}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>役割と権限の設定</DialogTitle>
            <DialogDescription>
              各役割に対する権限を設定してください。設定は全メンバーに即時適用されます。
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="admin">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="admin">管理者</TabsTrigger>
              <TabsTrigger value="leader">リーダー</TabsTrigger>
              <TabsTrigger value="user">一般ユーザー</TabsTrigger>
            </TabsList>
            <TabsContent value="admin" className="space-y-4 py-4">
              <Alert className="bg-blue-50 text-blue-800 border-blue-200">
                <AlertDescription>
                  管理者はすべての機能にフルアクセスできます。慎重に割り当ててください。
                </AlertDescription>
              </Alert>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h4 className="font-medium">メンバー管理</h4>
                    <p className="text-sm text-muted-foreground">
                      メンバーの追加・編集・削除
                    </p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h4 className="font-medium">グループ管理</h4>
                    <p className="text-sm text-muted-foreground">
                      グループの作成・編集・削除
                    </p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h4 className="font-medium">アセスメント配信</h4>
                    <p className="text-sm text-muted-foreground">
                      アセスメントの作成・配信・結果確認
                    </p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">データ分析</h4>
                    <p className="text-sm text-muted-foreground">
                      すべてのデータおよびレポートの閲覧
                    </p>
                  </div>
                  <Switch defaultChecked disabled />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="leader" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h4 className="font-medium">メンバー管理</h4>
                    <p className="text-sm text-muted-foreground">
                      メンバーの追加・編集・削除
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h4 className="font-medium">グループ管理</h4>
                    <p className="text-sm text-muted-foreground">
                      グループの作成・編集・削除
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h4 className="font-medium">アセスメント配信</h4>
                    <p className="text-sm text-muted-foreground">
                      アセスメントの作成・配信・結果確認
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">データ分析</h4>
                    <p className="text-sm text-muted-foreground">
                      すべてのデータおよびレポートの閲覧
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="user" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h4 className="font-medium">メンバー管理</h4>
                    <p className="text-sm text-muted-foreground">
                      メンバーの追加・編集・削除
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h4 className="font-medium">グループ管理</h4>
                    <p className="text-sm text-muted-foreground">
                      グループの作成・編集・削除
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <h4 className="font-medium">アセスメント配信</h4>
                    <p className="text-sm text-muted-foreground">
                      アセスメントの作成・配信・結果確認
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">データ分析</h4>
                    <p className="text-sm text-muted-foreground">
                      すべてのデータおよびレポートの閲覧
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPermissionsDialog(false)}
            >
              キャンセル
            </Button>
            <Button onClick={() => setShowPermissionsDialog(false)}>
              権限を保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
