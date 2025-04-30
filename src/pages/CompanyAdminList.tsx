import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockCompanyAdmins, deleteMockCompanyAdmin } from '@/data/mockCompanyAdmins';
import { mockGroups, getGroupNamesByIds } from '@/data/mockGroups';
import { CompanyAdministrator, getAuthorityDisplayName } from '@/types/companyAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Edit, Trash2, KeyRound } from 'lucide-react'; // Import KeyRound icon
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
import { useToast } from '@/hooks/use-toast';
import { addPermissionLog } from '@/data/mockPermissionLogs'; // Import logging function

// Helper function to generate a mock temporary password
const generateMockPassword = (length = 12): string => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
};

const CompanyAdminList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();
  const [dataVersion, setDataVersion] = useState(0);
  // State to manage which admin's reset button is temporarily disabled
  const [resettingAdminId, setResettingAdminId] = useState<string | null>(null);

  const filteredAdmins = useMemo(() => {
    console.log("Filtering admins, data version:", dataVersion);
    return mockCompanyAdmins.filter(admin =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, dataVersion]);

  const handleDelete = (adminId: string, adminName: string) => {
    const success = deleteMockCompanyAdmin(adminId);
    if (success) {
      // Log deletion
      addPermissionLog({
        adminId: adminId,
        adminName: adminName,
        changedBy: 'System (Mock User)',
        action: 'admin_deleted',
        details: `管理者「${adminName}」が削除されました。`,
      });
      toast({
        title: "削除成功",
        description: `${adminName}さんを削除しました。`,
      });
      setDataVersion(prev => prev + 1);
    } else {
      toast({
        title: "削除失敗",
        description: `${adminName}さんの削除中にエラーが発生しました。`,
        variant: "destructive",
      });
    }
  };

  const handlePasswordReset = (admin: CompanyAdministrator) => {
    // Simple rate limit: prevent immediate consecutive clicks for the same admin
    if (resettingAdminId === admin.id) return;

    setResettingAdminId(admin.id); // Disable button temporarily

    const tempPassword = generateMockPassword();

    // Simulate sending email and log the action
    console.log(`Simulating password reset for ${admin.name} (${admin.email}). Temporary Password: ${tempPassword}`);
    toast({
      title: "仮パスワード発行 (シミュレーション)",
      description: (
        <div>
          <p>管理者「{admin.name}」({admin.email}) に仮パスワードを送信しました (実際の送信は行われません)。</p>
          <p className="font-mono bg-gray-100 p-1 rounded text-sm my-1">仮パスワード: {tempPassword}</p>
          <p className="text-xs text-gray-600">
            注意: このパスワードは24時間有効です。初回ログイン時に新しいパスワードの設定が必要です。
            (パスワードポリシー: 最低8文字、大文字、小文字、数字、記号を含むこと)
          </p>
        </div>
      ),
      duration: 10000, // Show longer for readability
    });

    // Add to permission log
    addPermissionLog({
      adminId: admin.id,
      adminName: admin.name,
      changedBy: 'System (Mock User)', // Replace with actual user later
      action: 'password_reset',
      details: `仮パスワードが発行されました。 (メール: ${admin.email})`,
    });

    // Re-enable the button after a short delay to prevent spamming
    setTimeout(() => {
      setResettingAdminId(null);
    }, 3000); // Re-enable after 3 seconds
  };


  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">企業管理者一覧</h1>
        <Button asChild>
          <Link to="/company-admins/create">
            <PlusCircle className="mr-2 h-4 w-4" /> 新規登録
          </Link>
        </Button>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="氏名またはメールアドレスで検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>氏名</TableHead>
              <TableHead>メールアドレス</TableHead>
              <TableHead>権限</TableHead>
              <TableHead>所属グループ</TableHead>
              <TableHead>登録日</TableHead>
              <TableHead>アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{getAuthorityDisplayName(admin.authority)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getGroupNamesByIds(admin.affiliatedGroupIds).map(groupName => (
                        <Badge key={groupName} variant="secondary">{groupName}</Badge>
                      ))}
                      {admin.affiliatedGroupIds.length === 0 && <span className="text-xs text-gray-500">なし</span>}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {/* Edit Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/company-admins/edit/${admin.id}`)}
                      >
                        <Edit className="mr-1 h-4 w-4" /> 編集
                      </Button>

                      {/* Password Reset Button */}
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={resettingAdminId === admin.id} // Disable temporarily
                          >
                            <KeyRound className="mr-1 h-4 w-4" /> リセット
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>パスワードリセット確認</AlertDialogTitle>
                            <AlertDialogDescription>
                              本当に「{admin.name}」さんのパスワードをリセットし、仮パスワードをメール ({admin.email}) に送信しますか？
                              <br/>
                              <span className="text-yellow-600 font-medium">注意: これはシミュレーションであり、実際のメール送信やパスワード変更は行われません。</span>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handlePasswordReset(admin)}>
                              リセット実行
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      {/* Delete Button */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="mr-1 h-4 w-4" /> 削除
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>削除確認</AlertDialogTitle>
                            <AlertDialogDescription>
                              本当に「{admin.name}」さんを削除しますか？この操作は元に戻せません。
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(admin.id, admin.name)}>
                              削除
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                  該当する管理者は見つかりません。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
       {/* Optional: Add pagination if needed */}
    </div>
  );
};

export default CompanyAdminList;
