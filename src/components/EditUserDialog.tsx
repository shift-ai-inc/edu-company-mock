import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Edit, AlertCircle, Save } from "lucide-react";
import { Group } from "@/types/group";
import { User } from "@/pages/GeneralUserList"; // Use User type

// Define props for the dialog
interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null; // User to edit
  onUserUpdated: (updatedUser: User) => void; // Callback on successful update
  groups: Group[]; // All available groups
  existingEmails: string[]; // All existing emails excluding the current user's
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  onUserUpdated,
  groups,
  existingEmails,
}: EditUserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill form when dialog opens and user data is available
  useEffect(() => {
    if (open && user) {
      setName(user.name);
      setEmail(user.email);
      setSelectedGroups(user.groupIds);
      setErrors({});
      setSuccessMessage(null);
      setIsLoading(false);
    } else if (!open) {
      // Optional: Reset form fields on close after a delay
      setTimeout(() => {
        setName("");
        setEmail("");
        setSelectedGroups([]);
        setErrors({});
        setSuccessMessage(null);
        setIsLoading(false);
      }, 300);
    }
  }, [open, user]);

  const validateForm = (): boolean => {
    if (!user) return false; // Should not happen if dialog is open

    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "氏名は必須です。";
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "メールアドレスは必須です。";
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "有効なメールアドレスを入力してください。";
        isValid = false;
      }
      // Check for duplicates, excluding the user's original email if it hasn't changed
      const currentEmailLower = email.toLowerCase();
      if (currentEmailLower !== user.email.toLowerCase() && existingEmails.includes(currentEmailLower)) {
        newErrors.email = "このメールアドレスは既に使用されています。";
        isValid = false;
      }
    }

    if (selectedGroups.length === 0) {
      newErrors.groups = "少なくとも1つのグループを選択してください。";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleGroupChange = (groupId: string) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
    if (errors.groups) {
      setErrors((prev) => {
        const { groups, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSuccessMessage(null);
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);

    // Create updated user object
    const updatedUser: User = {
      ...user, // Spread existing user data (like id, status, lastLogin)
      name,
      email,
      groupIds: selectedGroups,
    };

    console.log("Updated General User (from modal):", updatedUser);
    onUserUpdated(updatedUser); // Call the callback to update in parent

    setSuccessMessage(`ユーザー「${name}」の情報が更新されました。`);

    // Close the dialog after a short delay
    setTimeout(() => {
      onOpenChange(false);
    }, 1500);
  };

  if (!user) return null; // Don't render if no user data

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>ユーザー情報編集</DialogTitle>
          <DialogDescription>
            ユーザー情報を編集します。<span className="text-red-500"> *</span> は必須項目です。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {successMessage && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <Save className="h-4 w-4 text-green-700" />
                <AlertTitle className="text-green-800">成功</AlertTitle>
                <AlertDescription className="text-green-700">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}
             {errors.general && !successMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>エラー</AlertTitle>
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                氏名 <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading || !!successMessage}
                  className={`w-full ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                メール <span className="text-red-500">*</span>
              </Label>
               <div className="col-span-3">
                <Input
                  id="edit-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || !!successMessage}
                  className={`w-full ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                グループ <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <div className="space-y-2 rounded-md border p-4 max-h-48 overflow-y-auto">
                  {groups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-group-${group.id}`}
                        checked={selectedGroups.includes(group.id)}
                        onCheckedChange={() => handleGroupChange(group.id)}
                        disabled={isLoading || !!successMessage}
                      />
                      <Label
                        htmlFor={`edit-group-${group.id}`}
                        className="font-normal cursor-pointer"
                      >
                        {group.name}
                      </Label>
                    </div>
                  ))}
                </div>
                {errors.groups && (
                  <p className="text-sm text-red-500 mt-1">{errors.groups}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
               <Button type="button" variant="outline" disabled={isLoading}>
                 キャンセル
               </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading || !!successMessage}>
              {isLoading ? (
                "保存中..."
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  変更を保存
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
