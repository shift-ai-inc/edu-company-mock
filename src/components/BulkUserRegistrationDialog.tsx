import React, { useState, useCallback, useEffect } from 'react'; // Import useEffect
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // For file input styling
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Upload, AlertCircle, CheckCircle, Users } from 'lucide-react'; // Removed Mail import
import { Group } from '@/types/group';
import { User } from '@/pages/GeneralUserList'; // Use User type

// Define props for the dialog
interface BulkUserRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUsersAdded: (newUsers: User[]) => void; // Callback on successful addition
  groups: Group[]; // All available groups (needed for mock assignment)
  contractLimit: number;
  currentUserCount: number;
  existingEmails: string[]; // All existing emails
}

// Mock users to be added during simulation
const MOCK_BULK_USERS_DATA = [
  { name: '一括 太郎', email: 'bulk.taro@example.com', groupIds: ['grp_aaa111', 'grp_bbb222'] },
  { name: '一括 花子', email: 'bulk.hanako@sample.co.jp', groupIds: ['grp_ccc333'] },
  { name: '一括 次郎', email: 'bulk.jiro@example.com', groupIds: ['grp_ddd444', 'grp_eee555'] },
];

export function BulkUserRegistrationDialog({
  open,
  onOpenChange,
  onUsersAdded,
  groups, // Keep groups prop if needed for validation/display later
  contractLimit,
  currentUserCount,
  existingEmails,
}: BulkUserRegistrationDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [processingMessage, setProcessingMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setError(null); // Clear previous errors on new file selection
      setSuccessMessage(null);
      setProcessingMessage(null);
    }
  };

  const resetDialogState = useCallback(() => {
      setSelectedFile(null);
      setIsLoading(false);
      setError(null);
      setSuccessMessage(null);
      setProcessingMessage(null);
      // Reset the file input visually if possible (browser security might prevent full reset)
      const fileInput = document.getElementById('bulk-file-upload') as HTMLInputElement;
      if (fileInput) {
          fileInput.value = '';
      }
  }, []);


  // Reset state when dialog is closed
  useEffect(() => {
    if (!open) {
      // Delay reset slightly to allow closing animation
      const timer = setTimeout(() => {
        resetDialogState();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [open, resetDialogState]);


  const handleBulkRegister = async () => {
    if (!selectedFile) {
      setError("ファイルを選択してください。");
      return;
    }

    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);
    setProcessingMessage("ファイルを処理中...");

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // --- Mock Logic ---
    const usersToAdd = MOCK_BULK_USERS_DATA;
    const numUsersToAdd = usersToAdd.length;

    // 1. Check Contract Limit
    if (currentUserCount + numUsersToAdd > contractLimit) {
      setError(`登録しようとしているユーザー数 (${numUsersToAdd}名) が契約上限 (${contractLimit}名) を超えます。現在の登録数: ${currentUserCount}名`);
      setIsLoading(false);
      setProcessingMessage(null);
      return;
    }

    // 2. Check for Email Conflicts
    const newEmailsLower = usersToAdd.map(u => u.email.toLowerCase());
    const conflictingEmails = newEmailsLower.filter(email => existingEmails.includes(email));
    if (conflictingEmails.length > 0) {
       setError(`以下のメールアドレスは既に登録されています: ${conflictingEmails.join(', ')}`);
       setIsLoading(false);
       setProcessingMessage(null);
       return;
    }

    // 3. Simulate User Creation & Email Sending
    setProcessingMessage(`ユーザーを登録し、招待メールを送信中...`);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate email sending delay

    const newUsers: User[] = usersToAdd.map((userData, index) => {
      console.log(`Simulating invitation email sent to: ${userData.email}`); // Simulate email sending
      return {
        id: `usr_bulk_${Date.now()}_${index}`, // Generate unique ID
        name: userData.name,
        email: userData.email,
        groupIds: userData.groupIds.filter(gid => groups.some(g => g.id === gid)), // Ensure group IDs exist
        status: 'invited', // New users are invited
        lastLogin: null,
        assessmentStatus: '未完了', // Default assessment status
      };
    });

    // --- End Mock Logic ---

    onUsersAdded(newUsers); // Pass new users to parent component
    setSuccessMessage(`${newUsers.length}名のユーザーが正常に登録され、招待メールが送信されました（シミュレーション）。`);
    setIsLoading(false);
    setProcessingMessage(null);

    // Close dialog after success
    setTimeout(() => {
      onOpenChange(false);
    }, 2500);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ユーザー一括登録</DialogTitle>
          <DialogDescription>
            CSVまたはExcelファイルを使用してユーザーを一括登録します。(現在はシミュレーションです)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {error && !successMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
             <Alert variant="default" className="bg-green-50 border-green-200">
               <CheckCircle className="h-4 w-4 text-green-700" />
               <AlertTitle className="text-green-800">成功</AlertTitle>
               <AlertDescription className="text-green-700">
                 {successMessage}
               </AlertDescription>
             </Alert>
          )}
           {processingMessage && !error && !successMessage && (
             <Alert variant="default" className="bg-blue-50 border-blue-200">
               <Upload className="h-4 w-4 text-blue-700 animate-pulse" />
               <AlertTitle className="text-blue-800">処理中</AlertTitle>
               <AlertDescription className="text-blue-700">
                 {processingMessage}
               </AlertDescription>
             </Alert>
           )}

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="bulk-file-upload">ファイルを選択</Label>
            <Input
              id="bulk-file-upload"
              type="file"
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" // Accept CSV and Excel types
              onChange={handleFileChange}
              disabled={isLoading || !!successMessage}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
            />
             <p className="text-xs text-muted-foreground">
               CSVまたはExcelファイルを選択してください。
             </p>
          </div>

        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isLoading}>
              キャンセル
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleBulkRegister}
            disabled={!selectedFile || isLoading || !!successMessage}
          >
            {isLoading ? (
              "登録中..."
            ) : (
              <>
                <Users className="mr-2 h-4 w-4" />
                一括登録を実行
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
