import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { mockGroups, getGroupNamesByIds } from '@/data/mockGroups'; // Import getGroupNamesByIds
import { findMockCompanyAdminById, updateMockCompanyAdmin } from '@/data/mockCompanyAdmins';
import { AdminAuthority, getAuthorityDisplayName, CompanyAdministrator } from '@/types/companyAdmin';
import { ScrollArea } from '@/components/ui/scroll-area';
import { addPermissionLog } from '@/data/mockPermissionLogs'; // Import logging function
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger, // We'll trigger manually
} from "@/components/ui/alert-dialog";

// Zod schema for validation (same as create)
const adminSchema = z.object({
  name: z.string().min(1, { message: '氏名は必須です' }),
  email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
  authority: z.enum(['system_admin', 'results_viewer'], { required_error: '権限を選択してください' }),
  affiliatedGroupIds: z.array(z.string()).min(0), // Keep for form structure
});

type AdminFormData = z.infer<typeof adminSchema>;

const CompanyAdminEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [admin, setAdmin] = useState<CompanyAdministrator | null>(null);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [show2faDialog, setShow2faDialog] = useState(false);
  const [mock2faCode, setMock2faCode] = useState('');
  const originalAdminData = useRef<CompanyAdministrator | null>(null); // Store original data
  const pendingSubmitData = useRef<AdminFormData | null>(null); // Store data pending 2FA

  const { register, handleSubmit, control, formState: { errors }, reset, watch } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: '',
      email: '',
      authority: undefined,
      affiliatedGroupIds: [],
    },
  });

  const currentAuthority = watch('authority'); // Watch authority for comparison

   // Fetch admin data on component mount
   useEffect(() => {
    if (id) {
      const foundAdmin = findMockCompanyAdminById(id);
      if (foundAdmin) {
        setAdmin(foundAdmin);
        originalAdminData.current = { ...foundAdmin }; // Store original data
        reset({
          name: foundAdmin.name,
          email: foundAdmin.email,
          authority: foundAdmin.authority,
          affiliatedGroupIds: foundAdmin.affiliatedGroupIds,
        });
        setSelectedGroupIds(foundAdmin.affiliatedGroupIds);
      } else {
        toast({
          title: 'エラー',
          description: '指定された管理者が見つかりません。',
          variant: 'destructive',
        });
        navigate('/company-admins');
      }
    }
   }, [id, reset, toast, navigate]);


  const handleGroupChange = (groupId: string) => {
    setSelectedGroupIds(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  // Check if permissions (authority or groups) have changed
  const permissionsChanged = (newData: AdminFormData): boolean => {
    if (!originalAdminData.current) return false;
    const authorityChanged = newData.authority !== originalAdminData.current.authority;
    const groupsChanged =
      JSON.stringify(selectedGroupIds.sort()) !== JSON.stringify(originalAdminData.current.affiliatedGroupIds.sort());
    return authorityChanged || groupsChanged;
  };

  const onSubmit = (data: AdminFormData) => {
     if (!admin || !originalAdminData.current) return;
     setIsSubmitting(true); // Disable button

     if (permissionsChanged(data)) {
       // Permissions changed, require mock 2FA
       pendingSubmitData.current = data; // Store data
       setShow2faDialog(true);
       // Don't proceed with update yet
     } else {
       // Permissions didn't change, proceed directly
       proceedWithUpdate(data);
     }
     // Keep isSubmitting true until dialog is handled or update finishes
  };

  const handle2faSubmit = () => {
    if (mock2faCode === '123456') { // Mock validation
      setShow2faDialog(false);
      if (pendingSubmitData.current) {
        proceedWithUpdate(pendingSubmitData.current);
      }
      setMock2faCode(''); // Clear code
      pendingSubmitData.current = null;
    } else {
      toast({
        title: '認証失敗',
        description: '二段階認証コードが正しくありません。',
        variant: 'destructive',
      });
       // Keep dialog open, allow retry
       setIsSubmitting(false); // Re-enable submit button if 2FA fails immediately
    }
  };

   const handle2faCancel = () => {
    setShow2faDialog(false);
    setMock2faCode('');
    pendingSubmitData.current = null;
    setIsSubmitting(false); // Re-enable submit button
  };

  const proceedWithUpdate = (data: AdminFormData) => {
    if (!admin || !originalAdminData.current) {
        setIsSubmitting(false);
        return;
    };

    const originalAuthority = originalAdminData.current.authority;
    const originalGroupIds = originalAdminData.current.affiliatedGroupIds;
    const newAuthority = data.authority as AdminAuthority;
    const newGroupIds = selectedGroupIds;

    try {
      const updatedAdminData: CompanyAdministrator = {
        ...admin,
        name: data.name,
        email: data.email,
        authority: newAuthority,
        affiliatedGroupIds: newGroupIds,
      };

      const success = updateMockCompanyAdmin(updatedAdminData);

      if (success) {
          toast({
            title: '更新成功',
            description: `${data.name}さんの情報を更新しました。`,
          });

          // Log permission changes if they occurred
          if (newAuthority !== originalAuthority) {
              addPermissionLog({
                  adminId: admin.id,
                  adminName: data.name,
                  changedBy: 'System (Mock User)', // Replace with actual user later
                  action: 'authority_changed',
                  details: `権限を「${getAuthorityDisplayName(originalAuthority)}」から「${getAuthorityDisplayName(newAuthority)}」に変更しました。`
              });
          }
          if (JSON.stringify(newGroupIds.sort()) !== JSON.stringify(originalGroupIds.sort())) {
               const addedGroups = newGroupIds.filter(id => !originalGroupIds.includes(id));
               const removedGroups = originalGroupIds.filter(id => !newGroupIds.includes(id));
               let details = '所属グループを変更しました。';
               if (addedGroups.length > 0) details += ` 追加: ${getGroupNamesByIds(addedGroups).join(', ')}.`;
               if (removedGroups.length > 0) details += ` 削除: ${getGroupNamesByIds(removedGroups).join(', ')}.`;

               addPermissionLog({
                  adminId: admin.id,
                  adminName: data.name,
                  changedBy: 'System (Mock User)', // Replace with actual user later
                  action: 'groups_changed',
                  details: details.trim()
              });
          }

          navigate('/company-admins');
      } else {
           throw new Error("Failed to update admin in mock data.");
      }

    } catch (error) {
      console.error("Error updating admin:", error);
      toast({
        title: '更新失敗',
        description: '管理者の更新中にエラーが発生しました。',
        variant: 'destructive',
      });
    } finally {
        setIsSubmitting(false); // Re-enable button after update attempt
    }
  };


  if (!admin) {
    return <div className="container mx-auto p-6">読み込み中...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">企業管理者編集</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name">氏名</Label>
          <Input
            id="name"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        {/* Authority */}
        <div>
          <Label htmlFor="authority">権限</Label>
          <Controller
            name="authority"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={isSubmitting}
              >
                <SelectTrigger id="authority" className={errors.authority ? 'border-red-500' : ''}>
                  <SelectValue placeholder="権限を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system_admin">{getAuthorityDisplayName('system_admin')}</SelectItem>
                  <SelectItem value="results_viewer">{getAuthorityDisplayName('results_viewer')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.authority && <p className="text-sm text-red-600 mt-1">{errors.authority.message}</p>}
        </div>

        {/* Affiliated Groups */}
        <div>
          <Label>所属グループ（複数選択可）</Label>
          <ScrollArea className="h-40 w-full rounded-md border p-4 mt-1">
             <div className="space-y-2">
                {mockGroups.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`group-${group.id}`}
                      checked={selectedGroupIds.includes(group.id)}
                      onCheckedChange={() => handleGroupChange(group.id)}
                      disabled={isSubmitting}
                    />
                    <Label htmlFor={`group-${group.id}`} className="font-normal">
                      {group.name}
                    </Label>
                  </div>
                ))}
                {mockGroups.length === 0 && <p className="text-sm text-gray-500">利用可能なグループがありません。</p>}
             </div>
          </ScrollArea>
           {/* Display warning if permissions changed */}
           {originalAdminData.current && permissionsChanged(watch()) && (
             <p className="text-sm text-yellow-600 mt-2">
               注意: 権限または所属グループが変更されるため、更新時に二段階認証が必要です。
             </p>
           )}
        </div>


        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => navigate('/company-admins')} disabled={isSubmitting}>
            キャンセル
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '処理中...' : '更新'}
          </Button>
        </div>
      </form>

       {/* Mock 2FA Dialog */}
      <AlertDialog open={show2faDialog} onOpenChange={setShow2faDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>二段階認証</AlertDialogTitle>
            <AlertDialogDescription>
              セキュリティのため、認証アプリに表示されている6桁のコードを入力してください。(モック: 「123456」を入力)
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              type="text"
              placeholder="6桁のコード"
              value={mock2faCode}
              onChange={(e) => setMock2faCode(e.target.value)}
              maxLength={6}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handle2faCancel}>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handle2faSubmit}>認証して更新</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
};

export default CompanyAdminEdit;
