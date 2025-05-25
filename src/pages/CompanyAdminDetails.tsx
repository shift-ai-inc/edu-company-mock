import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { findMockCompanyAdminById, updateMockCompanyAdmin } from '@/data/mockCompanyAdmins';
import { getGroupNamesByIds, mockGroups } from '@/data/mockGroups';
import { CompanyAdministrator, getAuthorityDisplayName } from '@/types/companyAdmin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Edit, Trash2, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EditCompanyAdminDialog from '@/components/EditCompanyAdminDialog';
import { addPermissionLog } from '@/data/mockPermissionLogs';
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

// Helper function to generate a mock temporary password (copied from CompanyAdminList)
const generateMockPassword = (length = 12): string => {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
};


export default function CompanyAdminDetails() {
  const { adminId } = useParams<{ adminId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [admin, setAdmin] = useState<CompanyAdministrator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [resettingAdminId, setResettingAdminId] = useState<string | null>(null);


  useEffect(() => {
    if (!adminId) {
      toast({ title: "Error", description: "Administrator ID is missing.", variant: "destructive" });
      navigate('/company-admins');
      return;
    }
    const foundAdmin = findMockCompanyAdminById(adminId);
    if (foundAdmin) {
      setAdmin(foundAdmin);
    } else {
      toast({ title: "Error", description: "Administrator not found.", variant: "destructive" });
      navigate('/company-admins');
    }
    setIsLoading(false);
  }, [adminId, navigate, toast]);

  const handleSaveChanges = (updatedAdmin: CompanyAdministrator) => {
    const success = updateMockCompanyAdmin(updatedAdmin);
    if (success) {
      setAdmin(updatedAdmin); // Update local state to reflect changes
      addPermissionLog({
        adminId: updatedAdmin.id,
        adminName: updatedAdmin.name,
        changedBy: 'System (Mock User)',
        action: 'admin_updated',
        details: `管理者「${updatedAdmin.name}」の情報が更新されました。`,
      });
      toast({
        title: "更新成功",
        description: `${updatedAdmin.name}さんの情報を更新しました。`,
      });
    } else {
      toast({
        title: "更新失敗",
        description: "情報の更新中にエラーが発生しました。",
        variant: "destructive",
      });
    }
    setIsEditDialogOpen(false);
  };

  const handlePasswordReset = () => {
    if (!admin) return;
    if (resettingAdminId === admin.id) return;

    setResettingAdminId(admin.id);

    const tempPassword = generateMockPassword();
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
      duration: 10000,
    });

    addPermissionLog({
      adminId: admin.id,
      adminName: admin.name,
      changedBy: 'System (Mock User)',
      action: 'password_reset',
      details: `仮パスワードが発行されました。 (メール: ${admin.email})`,
    });

    setTimeout(() => {
      setResettingAdminId(null);
    }, 3000);
  };

  const handleDeleteAdmin = () => {
    if (!admin) return;
    // In a real app, you would call deleteMockCompanyAdmin(admin.id)
    // For now, let's simulate and navigate back
    addPermissionLog({
      adminId: admin.id,
      adminName: admin.name,
      changedBy: 'System (Mock User)',
      action: 'admin_deleted',
      details: `管理者「${admin.name}」が削除されました。 (シミュレーション - 実際には削除されていません)`,
    });
    toast({
      title: "削除処理 (シミュレーション)",
      description: `${admin.name}さんを削除する処理が呼び出されました。一覧ページに戻ります。`,
    });
    navigate('/company-admins');
    // Note: Actual deletion logic (deleteMockCompanyAdmin) is not called here yet
    // to prevent accidental data loss during UI development.
    // It should be added when delete functionality is confirmed.
  };


  if (isLoading) {
    return <div className="p-6 text-center">読み込み中...</div>;
  }

  if (!admin) {
    return <div className="p-6 text-center text-red-500">管理者情報が見つかりません。</div>;
  }

  const affiliatedGroupNames = getGroupNamesByIds(admin.affiliatedGroupIds);

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate('/company-admins')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">企業管理者詳細</h1>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{admin.name}</CardTitle>
            <Badge variant="outline">{getAuthorityDisplayName(admin.authority)}</Badge>
          </div>
          <CardDescription>{admin.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">登録日</h3>
            <p>{new Date(admin.createdAt).toLocaleDateString()}</p>
          </div>
          <Separator />
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">所属グループ</h3>
            {affiliatedGroupNames.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {affiliatedGroupNames.map(groupName => (
                  <Badge key={groupName} variant="secondary">{groupName}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-600">なし</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex flex-wrap gap-2 justify-end">
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> 編集
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={resettingAdminId === admin.id}>
                <KeyRound className="mr-2 h-4 w-4" /> パスワードリセット
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
                <AlertDialogAction onClick={handlePasswordReset}>
                  リセット実行
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> 削除
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>削除確認</AlertDialogTitle>
                <AlertDialogDescription>
                  本当に「{admin.name}」さんを削除しますか？この操作は元に戻せません。
                  <br/>
                  <span className="text-yellow-600 font-medium">注意: これはシミュレーションであり、実際にはデータは削除されません。</span>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>キャンセル</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteAdmin} className="bg-red-600 hover:bg-red-700">
                  削除実行 (シミュレーション)
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

        </CardFooter>
      </Card>

      {isEditDialogOpen && admin && (
        <EditCompanyAdminDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          admin={admin}
          onSave={handleSaveChanges}
          allGroups={mockGroups}
        />
      )}
    </div>
  );
}
