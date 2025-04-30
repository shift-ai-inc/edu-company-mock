import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { mockGroups } from '@/data/mockGroups';
import { addMockCompanyAdmin } from '@/data/mockCompanyAdmins'; // Import the add function
import { AdminAuthority, getAuthorityDisplayName } from '@/types/companyAdmin';
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea

// Zod schema for validation
const adminSchema = z.object({
  name: z.string().min(1, { message: '氏名は必須です' }),
  email: z.string().email({ message: '有効なメールアドレスを入力してください' }),
  authority: z.enum(['system_admin', 'results_viewer'], { required_error: '権限を選択してください' }),
  affiliatedGroupIds: z.array(z.string()).min(0), // Allow zero groups initially, can refine later if needed
});

type AdminFormData = z.infer<typeof adminSchema>;

const CompanyAdminCreate: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, control, formState: { errors } } = useForm<AdminFormData>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      name: '',
      email: '',
      authority: undefined, // Ensure it's initially undefined for the placeholder
      affiliatedGroupIds: [],
    },
  });

  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupIds(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const onSubmit = (data: AdminFormData) => {
    const temporaryPassword = Math.random().toString(36).slice(-8); // Generate mock password

    try {
      const newAdminData = {
        ...data,
        affiliatedGroupIds: selectedGroupIds, // Use state for group IDs
        authority: data.authority as AdminAuthority, // Cast authority
      };

      // Add admin to mock data
      addMockCompanyAdmin(newAdminData);

      // Simulate sending email
      console.log(`--- Mock Email Sent ---`);
      console.log(`To: ${data.email}`);
      console.log(`Subject: アカウント登録完了のお知らせ`);
      console.log(`Body: ${data.name}様\n\n企業管理者アカウントが登録されました。\n初回ログイン情報は以下の通りです。\n\nメールアドレス: ${data.email}\n仮パスワード: ${temporaryPassword}\n\nログイン後、パスワードを変更してください。`);
      console.log(`-----------------------`);


      toast({
        title: '登録成功',
        description: `${data.name}さんを企業管理者として登録し、招待メールを送信しました（シミュレーション）。`,
      });
      navigate('/company-admins'); // Redirect to the list page
    } catch (error) {
      console.error("Error creating admin:", error);
      toast({
        title: '登録失敗',
        description: '管理者の登録中にエラーが発生しました。',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">新規企業管理者登録</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name">氏名</Label>
          <Input
            id="name"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                    />
                    <Label htmlFor={`group-${group.id}`} className="font-normal">
                      {group.name}
                    </Label>
                  </div>
                ))}
                {mockGroups.length === 0 && <p className="text-sm text-gray-500">利用可能なグループがありません。</p>}
             </div>
          </ScrollArea>
           {/* Although not strictly required by schema, you might add validation feedback here if needed */}
        </div>


        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={() => navigate('/company-admins')}>
            キャンセル
          </Button>
          <Button type="submit">登録</Button>
        </div>
      </form>
    </div>
  );
};

export default CompanyAdminCreate;
