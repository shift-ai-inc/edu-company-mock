import { useState, useEffect, useMemo } from 'react'; // Import useState, useEffect, useMemo
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_USERS, User } from './GeneralUserList'; // Import mock users and User type
import { mockGroups, getGroupNamesByIds, Group } from '@/data/mockGroups'; // Import groups and helper
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2, KeyRound } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditUserDialog } from '@/components/EditUserDialog'; // Import the edit dialog

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

// Mock Assessment History Data
const mockAssessmentHistory = [
  { id: 'asmt_hist_1', name: '2024年度前期 コンプライアンス理解度テスト', date: '2024/07/15', status: '完了', score: '85%' },
  { id: 'asmt_hist_2', name: '情報セキュリティ基礎知識アセスメント', date: '2024/04/10', status: '完了', score: '92%' },
  { id: 'asmt_hist_3', name: 'リーダーシップスキル評価', date: '2024/08/01', status: '未完了', score: '-' },
];

export default function GeneralUserDetail() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  // State for the user being displayed and the edit dialog
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  // Find the user initially and set state
  useEffect(() => {
    setIsLoading(true);
    const userFound = MOCK_USERS.find((u) => u.id === userId);
    if (userFound) {
      setCurrentUser(userFound);
    } else {
      setCurrentUser(null); // Handle user not found
    }
    setIsLoading(false);
  }, [userId]); // Re-run if userId changes

  // Memoize existing emails for the edit dialog (excluding the current user)
  const existingEmailsForEdit = useMemo(() => {
    if (!currentUser) return [];
    return MOCK_USERS
      .filter(u => u.id !== currentUser.id)
      .map(u => u.email.toLowerCase());
  }, [currentUser]); // Recalculate if currentUser changes

  // Handler for opening the edit dialog
  const handleEdit = () => {
    if (currentUser) {
      setIsEditDialogOpen(true);
    }
  };

  // Handler for updating user data from the modal
  const handleUserUpdate = (updatedUser: User) => {
    setCurrentUser(updatedUser); // Update state for the detail page display

    // --- Update the mock data source ---
    // In a real app, this would be an API call, and the list view
    // might refetch or update based on a global state change.
    // Here, we directly modify the imported array for simplicity.
    const userIndex = MOCK_USERS.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      MOCK_USERS[userIndex] = updatedUser;
    }
    // ------------------------------------

    setIsEditDialogOpen(false); // Close the dialog
  };


  const handleDelete = () => {
    if (!currentUser) return;
    console.log("Deleting user:", currentUser.id);
    // Show confirmation dialog
    if (window.confirm(`ユーザー ${currentUser.name} を削除してもよろしいですか？この操作は元に戻せません。`)) {
        // --- Update the mock data source ---
        const userIndex = MOCK_USERS.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            MOCK_USERS.splice(userIndex, 1); // Remove user from the array
        }
        // ------------------------------------
        console.log("User deleted (mock). Navigating back to list.");
        navigate('/general-users'); // Navigate back to the list after deletion
    }
  };

  const handleResetPassword = () => {
    if (!currentUser) return;
    console.log("Resetting password for user:", currentUser.id);
    alert(`ユーザー ${currentUser.name} のパスワードをリセットしますか？ (実装されていません)`);
    // Call API to trigger password reset email
  };

  // Loading state
  if (isLoading) {
    return <div className="container mx-auto p-6 lg:p-8 text-center">読み込み中...</div>;
  }

  // User not found state
  if (!currentUser) {
    return (
      <div className="container mx-auto p-6 lg:p-8 text-center">
        <p className="text-red-600">ユーザーが見つかりません。</p>
        <Button variant="outline" onClick={() => navigate('/general-users')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> ユーザー一覧に戻る
        </Button>
      </div>
    );
  }

  // Get group names based on current user state
  const groupNames = getGroupNamesByIds(currentUser.groupIds).join(', ');

  return (
    <div className="container mx-auto p-6 lg:p-8 space-y-6">
      {/* Back Button */}
      <div>
        <Button variant="outline" size="sm" onClick={() => navigate('/general-users')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          ユーザー一覧に戻る
        </Button>
      </div>

      {/* User Information Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              {/* Display data from currentUser state */}
              <CardTitle className="text-2xl font-bold text-gray-800">{currentUser.name}</CardTitle>
              <CardDescription>ユーザー詳細情報</CardDescription>
            </div>
            <div className="flex space-x-2 flex-wrap gap-y-2"> {/* Added flex-wrap and gap-y */}
              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" /> 編集
              </Button>
              <Button variant="outline" size="sm" onClick={handleResetPassword}>
                <KeyRound className="mr-2 h-4 w-4" /> パスワードリセット
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> 削除
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Display data from currentUser state */}
          <div>
            <Label className="text-sm font-medium text-gray-500">メールアドレス</Label>
            <p>{currentUser.email}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">ステータス</Label>
            <p>
              <Badge variant={getStatusVariant(currentUser.status)}>
                {getStatusText(currentUser.status)}
              </Badge>
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">所属グループ</Label>
            <p>{groupNames || '未割り当て'}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">最終ログイン</Label>
            <p>{currentUser.lastLogin ?? '未ログイン'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Assessment History Card (Remains unchanged) */}
      <Card>
        <CardHeader>
          <CardTitle>受講履歴</CardTitle>
          <CardDescription>このユーザーが受講したアセスメントやサーベイの履歴</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>アセスメント/サーベイ名</TableHead>
                  <TableHead>実施日</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>スコア</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockAssessmentHistory.length > 0 ? (
                  mockAssessmentHistory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell>
                        <Badge variant={item.status === '完了' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.score}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      受講履歴はありません。
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Render the Edit User Dialog */}
      {currentUser && (
        <EditUserDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          user={currentUser}
          onUserUpdated={handleUserUpdate}
          groups={mockGroups as Group[]} // Pass all available groups
          existingEmails={existingEmailsForEdit} // Pass emails excluding current user's
        />
      )}

    </div>
  );
}

// Helper Label component
const Label: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`}>
    {children}
  </label>
);
