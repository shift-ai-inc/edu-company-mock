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
  DialogClose, // Import DialogClose
} from "@/components/ui/dialog";
import { UserPlus, AlertCircle, Mail } from "lucide-react";
import { Group } from "@/types/group"; // Use Group type from types
import { User } from "@/pages/GeneralUserList"; // Use User type

// Define props for the dialog
interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded: (newUser: User) => void;
  existingEmails: string[]; // Receive existing emails as a prop
  groups: Group[];
  contractLimit: number;
  currentUserCount: number;
}

// DO NOT import MOCK_EXISTING_EMAILS here

export function AddUserDialog({
  open,
  onOpenChange,
  onUserAdded,
  existingEmails, // Use the prop
  groups,
  contractLimit,
  currentUserCount,
}: AddUserDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset form when dialog opens or closes
  useEffect(() => {
    if (!open) {
      // Delay reset slightly to allow closing animation
      setTimeout(() => {
        setName("");
        setEmail("");
        setSelectedGroups([]);
        setErrors({});
        setSuccessMessage(null);
        setIsLoading(false);
      }, 300);
    } else {
        // Reset immediately when opening
        setName("");
        setEmail("");
        setSelectedGroups([]);
        setErrors({});
        setSuccessMessage(null);
        setIsLoading(false);
    }
  }, [open]);

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    // 必須チェック
    if (!name.trim()) {
      newErrors.name = "氏名は必須です。";
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "メールアドレスは必須です。";
      isValid = false;
    } else {
      // メール形式チェック
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "有効なメールアドレスを入力してください。";
        isValid = false;
      }
      // メールアドレス重複チェック (using passed existingEmails prop)
      const currentEmailLower = email.toLowerCase();
      if (existingEmails.includes(currentEmailLower)) {
        newErrors.email = "このメールアドレスは既に使用されています。";
        isValid = false;
      }
    }

    if (selectedGroups.length === 0) {
      newErrors.groups = "少なくとも1つのグループを選択してください。";
      isValid = false;
    }

    // 契約人数チェック (using passed counts)
    if (currentUserCount >= contractLimit) {
      newErrors.limit = `契約ユーザー数の上限 (${contractLimit}名) に達しています。`;
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
    // グループ選択エラーをクリア
    if (errors.groups) {
      setErrors((prev) => {
        const { groups, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrors({}); // Reset errors before validation

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);

    // モック: 登録成功
    const newUserId = `usr_${Date.now()}`; // Simple unique ID for mock
    const newUser: User = {
      id: newUserId,
      name,
      email,
      groupIds: selectedGroups,
      lastLogin: null, // Default for new user
      assessmentStatus: "未完了", // Default for new user
      status: "invited", // Start as invited
    };
    console.log("New General User (from modal):", newUser);

    onUserAdded(newUser); // Call the callback to update the list in parent

    setSuccessMessage(
      `ユーザー「${name}」を登録しました。招待メールが ${email} に送信されました。`
    );

    // Close the dialog after a short delay to show the success message
    setTimeout(() => {
        onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>新規ユーザー追加</DialogTitle>
          <DialogDescription>
            新しい企業一般ユーザーの情報を入力してください。<span className="text-red-500"> *</span> は必須項目です。
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Show limit error */}
            {errors.limit && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>エラー</AlertTitle>
                <AlertDescription>{errors.limit}</AlertDescription>
              </Alert>
            )}
            {successMessage && (
              <Alert variant="default" className="bg-green-50 border-green-200">
                <Mail className="h-4 w-4 text-green-700" />
                <AlertTitle className="text-green-800">成功</AlertTitle>
                <AlertDescription className="text-green-700">
                  {successMessage}
                </AlertDescription>
              </Alert>
            )}
             {errors.general && !successMessage && ( // Show general error if needed
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>エラー</AlertTitle>
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                氏名 <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  placeholder="例：鈴木 次郎"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading || !!successMessage} // Disable after success
                  className={`w-full ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                メール <span className="text-red-500">*</span>
              </Label>
               <div className="col-span-3">
                <Input
                  id="email"
                  type="email"
                  placeholder="例：suzuki.jiro@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading || !!successMessage} // Disable after success
                  className={`w-full ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-4 items-start gap-4"> {/* Use items-start for alignment */}
              <Label className="text-right pt-2"> {/* Add padding top */}
                グループ <span className="text-red-500">*</span>
              </Label>
              <div className="col-span-3">
                <div className="space-y-2 rounded-md border p-4 max-h-48 overflow-y-auto">
                  {groups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`group-modal-${group.id}`} // Ensure unique ID for modal checkbox
                        checked={selectedGroups.includes(group.id)}
                        onCheckedChange={() => handleGroupChange(group.id)}
                        disabled={isLoading || !!successMessage} // Disable after success
                      />
                      <Label
                        htmlFor={`group-modal-${group.id}`}
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

            {/* Invitation Alert */}
            {!successMessage && (
                <Alert variant="default" className="mt-4">
                <Mail className="h-4 w-4" />
                <AlertTitle>招待メール</AlertTitle>
                <AlertDescription>
                    登録完了後、入力されたメールアドレス宛に招待メールが自動送信されます。
                </AlertDescription>
                </Alert>
            )}
          </div>
          <DialogFooter>
            {/* Add explicit Close button */}
            <DialogClose asChild>
               <Button type="button" variant="outline" disabled={isLoading}>
                 キャンセル
               </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading || !!errors.limit || !!successMessage}>
              {isLoading ? (
                "処理中..."
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  ユーザーを登録する
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
