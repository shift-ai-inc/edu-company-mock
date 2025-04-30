import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, AlertCircle, Mail, Save, Users, ArrowLeft } from "lucide-react";
// Import mock data and types from GeneralUserList
import { MOCK_GROUPS, MOCK_EXISTING_EMAILS, MOCK_USERS, GeneralUser } from "./GeneralUserList";

// These might need adjustment based on actual API/state management
const MOCK_CONTRACT_LIMIT = 10; // 契約上のユーザー上限数
// Calculate current users based on the imported mock list
let MOCK_CURRENT_USERS = MOCK_USERS.length;

export default function GeneralUserManagement() {
  const { userId } = useParams<{ userId?: string }>(); // Get userId from URL params
  const navigate = useNavigate();
  const isEditMode = Boolean(userId);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [initialEmail, setInitialEmail] = useState<string | null>(null); // Store initial email for edit mode validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (isEditMode && userId) {
      setIsLoading(true);
      // Simulate fetching user data
      // IMPORTANT: Use a *copy* of the mock user to avoid direct mutation issues if needed elsewhere
      const userToEdit = MOCK_USERS.find((user) => user.id === userId);
      if (userToEdit) {
        setName(userToEdit.name);
        setEmail(userToEdit.email);
        setInitialEmail(userToEdit.email.toLowerCase()); // Store initial email
        setSelectedGroups([...userToEdit.groupIds]); // Use spread to create a copy
        setNotFound(false);
      } else {
        // User not found
        setNotFound(true);
        setErrors({ general: "指定されたユーザーが見つかりません。" });
      }
      setIsLoading(false);
    }
     // Reset form for create mode or when switching between users
     if (!isEditMode) {
        setName("");
        setEmail("");
        setSelectedGroups([]);
        setInitialEmail(null);
        setErrors({});
        setSuccessMessage(null);
        setNotFound(false);
     }
  }, [userId, isEditMode]); // Rerun effect when userId or mode changes

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
      // メールアドレス重複チェック (モック)
      // 編集モードの場合、自分の元のメールアドレスは重複チェックから除外
      const currentEmailLower = email.toLowerCase();
      const isEmailChanged = isEditMode && initialEmail !== currentEmailLower;
      if (
        (!isEditMode || isEmailChanged) &&
        MOCK_EXISTING_EMAILS.includes(currentEmailLower)
      ) {
        newErrors.email = "このメールアドレスは既に使用されています。";
        isValid = false;
      }
    }

    if (selectedGroups.length === 0) {
      newErrors.groups = "少なくとも1つのグループを選択してください。";
      isValid = false;
    }

    // 契約人数チェック (モック) - 新規登録時のみチェック
    if (!isEditMode && MOCK_CURRENT_USERS >= MOCK_CONTRACT_LIMIT) {
      newErrors.limit = `契約ユーザー数の上限 (${MOCK_CONTRACT_LIMIT}名) に達しています。`;
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

    if (notFound) return; // Don't submit if user wasn't found in edit mode

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsLoading(false);

    if (isEditMode && userId) {
      // モック: 更新成功
      console.log("Updated General User:", { userId, name, email, selectedGroups });
      // Update mock data arrays (MOCK_USERS and MOCK_EXISTING_EMAILS)
      const userIndex = MOCK_USERS.findIndex(u => u.id === userId);
      if (userIndex > -1) {
        // Update email in MOCK_EXISTING_EMAILS if changed
        const oldEmail = MOCK_USERS[userIndex].email.toLowerCase();
        const newEmail = email.toLowerCase();
        if (oldEmail !== newEmail) {
            const emailIndex = MOCK_EXISTING_EMAILS.indexOf(oldEmail);
            if (emailIndex > -1) {
                MOCK_EXISTING_EMAILS.splice(emailIndex, 1);
            }
            if (!MOCK_EXISTING_EMAILS.includes(newEmail)) {
                MOCK_EXISTING_EMAILS.push(newEmail);
            }
        }
        // Update user in MOCK_USERS (keep existing lastLogin, assessmentStatus, status)
        MOCK_USERS[userIndex] = {
            ...MOCK_USERS[userIndex], // Preserve other fields
            name,
            email,
            groupIds: selectedGroups
        };
      }

      setSuccessMessage(`ユーザー「${name}」の情報を更新しました。`);
      // Optionally navigate back to list after update
      setTimeout(() => navigate("/general-users/list"), 1500); // Navigate back after showing success

    } else {
      // モック: 登録成功
      const newUserId = `user${Date.now()}`; // Simple unique ID for mock
      // Create new user with default status values
      const newUser: GeneralUser = {
          id: newUserId,
          name,
          email,
          groupIds: selectedGroups,
          lastLogin: null, // Default for new user
          assessmentStatus: "未完了", // Default for new user
          status: "active" // Default for new user
      };
      console.log("New General User:", newUser);

      // Update mock data arrays
      MOCK_USERS.push(newUser);
      MOCK_EXISTING_EMAILS.push(email.toLowerCase());
      MOCK_CURRENT_USERS++; // Increment user count

      setSuccessMessage(
        `ユーザー「${name}」を登録しました。招待メールが ${email} に送信されました。`
      );
      // Reset form after successful creation
      setName("");
      setEmail("");
      setSelectedGroups([]);
       // Optionally navigate back to list after creation
      setTimeout(() => navigate("/general-users/list"), 1500); // Navigate back after showing success
    }
  };

  const pageTitle = isEditMode ? "企業一般ユーザー編集" : "企業一般ユーザー作成";
  const cardTitle = isEditMode ? "ユーザー情報編集" : "新規ユーザー情報";
  const cardDescription = isEditMode
    ? "ユーザー情報を編集してください。"
    : "新しい企業一般ユーザーの情報を入力してください。";
  const submitButtonText = isEditMode ? "更新する" : "ユーザーを登録する";
  const submitButtonIcon = isEditMode ? Save : UserPlus;

  if (isLoading && isEditMode && !notFound) {
      return (
          <div className="p-8 text-center">
              ユーザー情報を読み込み中...
          </div>
      )
  }

  if (notFound) {
     return (
        <div className="p-8">
             <h2 className="text-2xl font-semibold text-gray-900 mb-6">{pageTitle}</h2>
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>エラー</AlertTitle>
                <AlertDescription>{errors.general || "指定されたユーザーが見つかりません。"}</AlertDescription>
             </Alert>
             <Button onClick={() => navigate("/general-users/list")} variant="outline" className="mt-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                ユーザー一覧に戻る
             </Button>
        </div>
     )
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-6 gap-4">
         <Button variant="outline" size="icon" onClick={() => navigate("/general-users/list")}>
            <ArrowLeft className="h-4 w-4" />
         </Button>
         <h2 className="text-2xl font-semibold text-gray-900">{pageTitle}</h2>
      </div>


      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{cardTitle}</CardTitle>
          <CardDescription>
            {cardDescription}
            {!isEditMode && <span className="text-red-500"> *</span>}
            {isEditMode && " "}
            {isEditMode ? "" : "は必須項目です。"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Show limit error only on creation */}
            {!isEditMode && errors.limit && (
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
             {errors.general && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>エラー</AlertTitle>
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">
                氏名 {!isEditMode && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="name"
                placeholder="例：鈴木 次郎"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                メールアドレス {!isEditMode && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="例：suzuki.jiro@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                所属グループ {!isEditMode && <span className="text-red-500">*</span>}
              </Label>
              <div className="space-y-2 rounded-md border p-4 max-h-48 overflow-y-auto">
                {MOCK_GROUPS.map((group) => (
                  <div key={group.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`group-${group.id}`}
                      checked={selectedGroups.includes(group.id)}
                      onCheckedChange={() => handleGroupChange(group.id)}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor={`group-${group.id}`}
                      className="font-normal cursor-pointer" // Make label clickable
                    >
                      {group.name}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.groups && (
                <p className="text-sm text-red-500">{errors.groups}</p>
              )}
            </div>

            {/* Show invitation alert only on creation */}
            {!isEditMode && (
                <Alert variant="default">
                <Mail className="h-4 w-4" />
                <AlertTitle>招待メール</AlertTitle>
                <AlertDescription>
                    登録完了後、入力されたメールアドレス宛に招待メールが自動送信されます。
                </AlertDescription>
                </Alert>
            )}
          </CardContent>
          <CardFooter className="flex justify-end"> {/* Align button to the right */}
            <Button type="submit" disabled={isLoading || (!isEditMode && !!errors.limit)}>
              {isLoading ? (
                "処理中..."
              ) : (
                <>
                  <submitButtonIcon className="mr-2 h-4 w-4" />
                  {submitButtonText}
                </>
              )}
            </Button>
             {/* Removed "Back to List" button from footer, added back arrow to header */}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
