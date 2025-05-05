import { useState, useMemo, useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, UserPlus, Search, Eye, Users, Mail } from "lucide-react"; // Added Mail icon import
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { AddUserDialog } from "@/components/AddUserDialog";
import { BulkUserRegistrationDialog } from "@/components/BulkUserRegistrationDialog"; // Import bulk dialog
import { mockGroups, getGroupNamesByIds } from "@/data/mockGroups";
import { Group } from "@/types/group";

// Define User interface with groupIds
export interface User {
  id: string;
  name: string;
  email: string;
  groupIds: string[]; // Changed from group: string
  status: "active" | "invited" | "inactive";
  lastLogin: string | null; // Allow null for new/invited users
  assessmentStatus?: "未完了" | "完了"; // Optional assessment status
}

// Keep original mock data immutable
const initialMockUsers: User[] = [
  {
    id: "usr_1",
    name: "山田 太郎",
    email: "taro.yamada@example.com",
    groupIds: ["grp_aaa111"], // Use group ID
    status: "active",
    lastLogin: "2024/07/25 10:30",
    assessmentStatus: "完了",
  },
  {
    id: "usr_2",
    name: "佐藤 花子",
    email: "hanako.sato@example.com",
    groupIds: ["grp_ccc333"], // Use group ID
    status: "active",
    lastLogin: "2024/07/24 15:00",
    assessmentStatus: "完了",
  },
  {
    id: "usr_3",
    name: "鈴木 一郎",
    email: "ichiro.suzuki@sample.co.jp",
    groupIds: ["grp_eee555"], // Use group ID
    status: "invited",
    lastLogin: null,
    assessmentStatus: "未完了",
  },
  {
    id: "usr_4",
    name: "田中 美咲",
    email: "misaki.tanaka@example.com",
    groupIds: ["grp_aaa111", "grp_ddd444"], // Multiple groups
    status: "inactive",
    lastLogin: "2024/06/10 09:00",
    assessmentStatus: "未完了",
  },
  {
    id: "usr_5",
    name: "高橋 健太",
    email: "kenta.takahashi@sample.co.jp",
    groupIds: ["grp_ccc333"], // Use group ID
    status: "active",
    lastLogin: "2024/07/25 11:00",
    assessmentStatus: "完了",
  },
];

// Export initial data if needed elsewhere, but manage state internally
// DO NOT export MOCK_EXISTING_EMAILS here
export const MOCK_USERS = [...initialMockUsers]; // This array will be mutated by edit/delete/add actions
export const MOCK_GROUPS = [...mockGroups]; // Export groups if needed

// Mock contract limit
const MOCK_CONTRACT_LIMIT = 10;

// Status badge variants
const getStatusVariant = (
  status: "active" | "invited" | "inactive"
): "default" | "secondary" | "outline" | "destructive" | null | undefined => {
  switch (status) {
    case "active":
      return "default";
    case "invited":
      return "secondary";
    case "inactive":
      return "outline";
    default:
      return "default";
  }
};

// Status text mapping
const getStatusText = (status: "active" | "invited" | "inactive"): string => {
  switch (status) {
    case "active":
      return "アクティブ";
    case "invited":
      return "招待済み";
    case "inactive":
      return "非アクティブ";
    default:
      return status;
  }
};

export default function GeneralUserList() {
  // Manage users in state, initialized with the potentially mutated MOCK_USERS
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isBulkRegisterDialogOpen, setIsBulkRegisterDialogOpen] = useState(false); // State for bulk dialog
  const navigate = useNavigate();

  // Update users state if MOCK_USERS array changes (e.g., after edit/delete on detail page)
  // This is a simple way to keep the list in sync with the mock data source
  useEffect(() => {
    setUsers([...MOCK_USERS]);
  }, []); // Run once on mount, might need more sophisticated state management in real app

  // Memoize existing emails for performance and passing to dialogs
  const existingEmails = useMemo(() => users.map(user => user.email.toLowerCase()), [users]);

  // Update filtering logic for groupIds
  const filteredUsers = users.filter((user) => {
    const groupNames = getGroupNamesByIds(user.groupIds).join(", ").toLowerCase();
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      groupNames.includes(searchTerm.toLowerCase())
    );
  });

  // User deletion (updates local state AND mock data source)
  const handleDeleteUser = (userId: string) => {
    const userToDelete = MOCK_USERS.find(u => u.id === userId);
    if (!userToDelete) return;

    if (window.confirm(`ユーザー ${userToDelete.name} を削除してもよろしいですか？`)) {
      console.log("Deleting user:", userId);
      // Update mock data source
      const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
          MOCK_USERS.splice(userIndex, 1);
      }
      // Update local state
      setUsers(currentUsers => currentUsers.filter((user) => user.id !== userId));
    }
  };

  // Navigate to user detail page
  const handleViewDetails = (userId: string) => {
    console.log("Navigating to details for user:", userId);
    navigate(`/general-users/${userId}`); // Navigate to the detail page
  };

  // Resend invitation (mock)
  const handleResendInvite = (userId: string) => {
    console.log("Resending invite for user:", userId);
    // API call would go here
    alert(`ユーザーID ${userId} の招待を再送しました（シミュレーション）。`);
  };

  // Callback function for when a single user is added via the dialog
  const handleUserAdded = (newUser: User) => {
    // Update mock data source
    MOCK_USERS.push(newUser);
    // Update local state
    setUsers((currentUsers) => [...currentUsers, newUser]);
    setIsAddUserDialogOpen(false); // Close the dialog after adding
  };

  // Callback function for when users are added via bulk registration dialog
  const handleBulkUsersAdded = (newUsers: User[]) => {
    // Update mock data source
    MOCK_USERS.push(...newUsers);
    // Update local state
    setUsers((currentUsers) => [...currentUsers, ...newUsers]);
    setIsBulkRegisterDialogOpen(false); // Close the dialog
  };


  return (
    <div className="container mx-auto p-6 lg:p-8">
       <Card>
         <CardHeader>
           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
             <div>
               <CardTitle className="text-2xl font-bold text-gray-800">
                 企業一般ユーザー一覧
               </CardTitle>
               <CardDescription>
                 登録されている一般ユーザーの確認と管理を行います。 現在 {users.length} / {MOCK_CONTRACT_LIMIT} 名
               </CardDescription>
             </div>
             <div className="flex space-x-2"> {/* Container for buttons */}
               {/* Dialog Trigger for Bulk Register */}
               <Dialog open={isBulkRegisterDialogOpen} onOpenChange={setIsBulkRegisterDialogOpen}>
                 <DialogTrigger asChild>
                   <Button variant="outline">
                     <Users className="mr-2 h-4 w-4" />
                     一括登録
                   </Button>
                 </DialogTrigger>
                 <BulkUserRegistrationDialog
                   open={isBulkRegisterDialogOpen}
                   onOpenChange={setIsBulkRegisterDialogOpen}
                   onUsersAdded={handleBulkUsersAdded}
                   groups={mockGroups as Group[]}
                   contractLimit={MOCK_CONTRACT_LIMIT}
                   currentUserCount={users.length}
                   existingEmails={existingEmails}
                 />
               </Dialog>

               {/* Dialog Trigger for Add User */}
               <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
                 <DialogTrigger asChild>
                   <Button>
                     <UserPlus className="mr-2 h-4 w-4" />
                     ユーザーを追加
                   </Button>
                 </DialogTrigger>
                 <AddUserDialog
                   open={isAddUserDialogOpen}
                   onOpenChange={setIsAddUserDialogOpen}
                   onUserAdded={handleUserAdded}
                   existingEmails={existingEmails}
                   groups={mockGroups as Group[]}
                   contractLimit={MOCK_CONTRACT_LIMIT}
                   currentUserCount={users.length}
                 />
               </Dialog>
             </div>
           </div>
           <div className="mt-4 relative">
             <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input
               type="search"
               placeholder="名前、メールアドレス、グループ名で検索..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="pl-8 w-full sm:w-1/3"
             />
           </div>
         </CardHeader>
         <CardContent>
           <div className="border rounded-lg overflow-hidden">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>氏名</TableHead>
                   <TableHead>メールアドレス</TableHead>
                   <TableHead>グループ</TableHead>
                   <TableHead>ステータス</TableHead>
                   <TableHead>最終ログイン</TableHead>
                   <TableHead className="text-right">操作</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filteredUsers.length > 0 ? (
                   filteredUsers.map((user) => (
                     <TableRow
                       key={user.id}
                       onClick={() => handleViewDetails(user.id)}
                       className="cursor-pointer hover:bg-muted/60"
                     >
                       <TableCell className="font-medium">{user.name}</TableCell>
                       <TableCell>{user.email}</TableCell>
                       <TableCell>{getGroupNamesByIds(user.groupIds).join(', ')}</TableCell>
                       <TableCell>
                         <Badge variant={getStatusVariant(user.status)}>
                           {getStatusText(user.status)}
                         </Badge>
                       </TableCell>
                       <TableCell>{user.lastLogin ?? '-'}</TableCell>
                       <TableCell className="text-right">
                         <DropdownMenu onOpenChange={(open) => { if (open) { event?.stopPropagation(); } }}>
                           <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                             <Button variant="ghost" className="h-8 w-8 p-0">
                               <span className="sr-only">メニューを開く</span>
                               <MoreHorizontal className="h-4 w-4" />
                             </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                             <DropdownMenuLabel>アクション</DropdownMenuLabel>
                             <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewDetails(user.id); }}>
                               <Eye className="mr-2 h-4 w-4" />
                               詳細を表示
                             </DropdownMenuItem>
                             {user.status === "invited" && (
                               <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleResendInvite(user.id); }}>
                                 <Mail className="mr-2 h-4 w-4" /> {/* Now imported */}
                                 招待を再送
                               </DropdownMenuItem>
                             )}
                             <DropdownMenuSeparator />
                             <DropdownMenuItem
                               onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.id); }}
                               className="text-red-600 hover:!text-red-600 hover:!bg-red-50"
                             >
                               削除
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                       </TableCell>
                     </TableRow>
                   ))
                 ) : (
                   <TableRow>
                     <TableCell colSpan={6} className="h-24 text-center">
                       該当するユーザーが見つかりません。
                     </TableCell>
                   </TableRow>
                 )}
               </TableBody>
             </Table>
           </div>
           {/* TODO: Add Pagination component here */}
         </CardContent>
       </Card>
    </div>
  );
}
