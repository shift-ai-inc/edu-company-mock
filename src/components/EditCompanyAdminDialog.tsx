import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CompanyAdministrator, AdminAuthority, getAuthorityDisplayName } from '@/types/companyAdmin';
import { Group } from '@/types/group';

interface EditCompanyAdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  admin: CompanyAdministrator;
  onSave: (updatedAdmin: CompanyAdministrator) => void;
  allGroups: Group[];
}

export default function EditCompanyAdminDialog({
  open,
  onOpenChange,
  admin,
  onSave,
  allGroups,
}: EditCompanyAdminDialogProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [authority, setAuthority] = useState<AdminAuthority>('results_viewer');
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (admin) {
      setName(admin.name);
      setEmail(admin.email);
      setAuthority(admin.authority);
      setSelectedGroupIds([...admin.affiliatedGroupIds]);
    }
  }, [admin, open]); // Re-initialize form when admin or open state changes

  const handleGroupChange = (groupId: string) => {
    setSelectedGroupIds(prev =>
      prev.includes(groupId) ? prev.filter(id => id !== groupId) : [...prev, groupId]
    );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    // Basic validation
    if (!name.trim() || !email.trim()) {
      // In a real app, show specific error messages
      alert("氏名とメールアドレスは必須です。");
      setIsSubmitting(false);
      return;
    }

    const updatedAdmin: CompanyAdministrator = {
      ...admin,
      name,
      email,
      authority,
      affiliatedGroupIds: selectedGroupIds,
    };
    onSave(updatedAdmin);
    setIsSubmitting(false);
    // onOpenChange(false); // Dialog close is handled by onSave in parent or DialogClose
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>管理者情報の編集</DialogTitle>
          <DialogDescription>「{admin?.name}」さんの情報を変更します。</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right col-span-1">
                氏名 <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right col-span-1">
                メールアドレス <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="authority" className="text-right col-span-1">
                権限 <span className="text-red-500">*</span>
              </Label>
              <Select
                value={authority}
                onValueChange={(value) => setAuthority(value as AdminAuthority)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="権限を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system_admin">{getAuthorityDisplayName('system_admin')}</SelectItem>
                  <SelectItem value="results_viewer">{getAuthorityDisplayName('results_viewer')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right col-span-1 pt-2">所属グループ</Label>
              <ScrollArea className="h-32 col-span-3 rounded-md border p-2">
                {allGroups.length > 0 ? allGroups.map(group => (
                  <div key={group.id} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`group-${group.id}`}
                      checked={selectedGroupIds.includes(group.id)}
                      onCheckedChange={() => handleGroupChange(group.id)}
                    />
                    <label
                      htmlFor={`group-${group.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {group.name}
                    </label>
                  </div>
                )) : (
                  <p className="text-sm text-muted-foreground">利用可能なグループがありません。</p>
                )}
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">キャンセル</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '保存中...' : '変更を保存'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
