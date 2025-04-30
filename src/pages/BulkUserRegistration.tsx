import React, { useState, useCallback, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  UploadCloud,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Download,
  Users,
  Mail,
} from "lucide-react";
import { MOCK_GROUPS, MOCK_EXISTING_EMAILS } from "./GeneralUserList"; // Import shared mock data

// --- Constants and Types ---
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_MIME_TYPES = {
  "text/csv": [".csv"],
  // TODO: Add Excel support later
  // 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  // 'application/vnd.ms-excel': ['.xls'],
};
const MOCK_CONTRACT_LIMIT = 100; // Example contract limit
const MOCK_CURRENT_USER_COUNT = MOCK_EXISTING_EMAILS.length; // Example current user count

interface CsvRowData {
  name: string;
  email: string;
  groups: string; // Comma-separated group names or IDs
}

interface ValidatedUser extends CsvRowData {
  rowIndex: number; // Original row index (1-based)
  isValid: boolean;
  errors: string[];
  groupIds?: string[]; // Resolved group IDs if valid
}

interface ValidationResult {
  validUsers: ValidatedUser[];
  invalidUsers: ValidatedUser[];
  totalRows: number;
  fileName: string;
}

interface ImportSummary {
  totalProcessed: number;
  successfullyImported: number;
  failedImports: number;
  contractLimitReached?: boolean;
  errors: { rowIndex: number; email: string; messages: string[] }[];
}

// --- Helper Functions ---
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const generateCsvTemplate = (): string => {
  const header = ["name", "email", "groups"];
  const example = ["田中 太郎", "new.user@example.com", "営業部,プロジェクトA"]; // Example with multiple groups
  return Papa.unparse([header, example], { quotes: true });
};

const downloadCsvTemplate = () => {
  const csvData = generateCsvTemplate();
  const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "bulk_user_template.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- Component ---
export default function BulkUserRegistration() {
  const [file, setFile] = useState<File | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [partialImport, setPartialImport] = useState(true);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const processFile = useCallback((uploadedFile: File) => {
    setIsProcessing(true);
    setValidationResult(null);
    setImportSummary(null);
    setProgress(10); // Initial progress

    Papa.parse<CsvRowData>(uploadedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setProgress(30);
        const validatedData: ValidatedUser[] = [];
        const allEmailsInFile = new Set<string>();
        const duplicateEmailsInFile = new Set<string>();

        // First pass: check for duplicates within the file
        results.data.forEach(row => {
            const email = row.email?.trim().toLowerCase();
            if (email) {
                if (allEmailsInFile.has(email)) {
                    duplicateEmailsInFile.add(email);
                }
                allEmailsInFile.add(email);
            }
        });

        // Second pass: validation
        results.data.forEach((row, index) => {
          const rowIndex = index + 1; // 1-based index for user feedback
          const errors: string[] = [];
          const name = row.name?.trim();
          const email = row.email?.trim().toLowerCase();
          const groupsString = row.groups?.trim();
          let groupIds: string[] | undefined = undefined;

          // Basic field checks
          if (!name) errors.push("氏名が空です。");
          if (!email) errors.push("メールアドレスが空です。");
          else if (!validateEmail(email)) errors.push("メールアドレスの形式が無効です。");
          else if (MOCK_EXISTING_EMAILS.includes(email)) errors.push("このメールアドレスは既に登録されています。");
          else if (duplicateEmailsInFile.has(email)) errors.push("ファイル内でメールアドレスが重複しています。");

          if (!groupsString) errors.push("グループが指定されていません。");
          else {
            // Group validation
            const groupNames = groupsString.split(',').map(g => g.trim()).filter(Boolean);
            const resolvedIds: string[] = [];
            const invalidGroupNames: string[] = [];

            groupNames.forEach(gn => {
              const foundGroup = MOCK_GROUPS.find(g => g.name.toLowerCase() === gn.toLowerCase());
              if (foundGroup) {
                resolvedIds.push(foundGroup.id);
              } else {
                invalidGroupNames.push(gn);
              }
            });

            if (invalidGroupNames.length > 0) {
              errors.push(`存在しないグループ名: ${invalidGroupNames.join(', ')}`);
            } else if (resolvedIds.length === 0) {
               errors.push("有効なグループが指定されていません。");
            } else {
              groupIds = resolvedIds;
            }
          }

          validatedData.push({
            ...row, // Keep original data
            name: name || '',
            email: email || '',
            groups: groupsString || '',
            rowIndex,
            isValid: errors.length === 0,
            errors,
            groupIds,
          });
        });
        setProgress(60);

        const validUsers = validatedData.filter(u => u.isValid);
        const invalidUsers = validatedData.filter(u => !u.isValid);

        setValidationResult({
          validUsers,
          invalidUsers,
          totalRows: results.data.length,
          fileName: uploadedFile.name,
        });
        setProgress(100);
        setIsProcessing(false);
      },
      error: (error) => {
        console.error("CSV Parsing Error:", error);
        toast({
          title: "ファイル処理エラー",
          description: `CSVファイルの解析中にエラーが発生しました: ${error.message}`,
          variant: "destructive",
        });
        setIsProcessing(false);
        setProgress(0);
      },
    });
  }, [toast]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: any[]) => {
      setFile(null);
      setValidationResult(null);
      setImportSummary(null);
      setProgress(0);

      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        let message = "無効なファイルです。";
        if (rejection.errors[0]?.code === "file-too-large") {
          message = `ファイルサイズが大きすぎます (${(MAX_FILE_SIZE / 1024 / 1024).toFixed()}MB上限)。`;
        } else if (rejection.errors[0]?.code === "file-invalid-type") {
          message = "ファイル形式が無効です。CSVファイルをアップロードしてください。";
        }
        toast({ title: "アップロードエラー", description: message, variant: "destructive" });
        return;
      }

      if (acceptedFiles.length > 0) {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        processFile(uploadedFile);
      }
    },
    [processFile, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_MIME_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const handleImport = () => {
    if (!validationResult) return;

    setIsProcessing(true);
    setImportSummary(null);
    setProgress(0);

    const usersToImport = partialImport
      ? validationResult.validUsers
      : validationResult.validUsers.length === validationResult.totalRows
      ? validationResult.validUsers
      : [];

    if (!partialImport && validationResult.invalidUsers.length > 0) {
       toast({
          title: "インポート中止",
          description: "ファイルに無効なデータが含まれています。修正するか、「部分的な登録を許可」を有効にしてください。",
          variant: "warning",
        });
       setIsProcessing(false);
       return;
    }

    if (usersToImport.length === 0) {
       toast({
          title: "インポート対象なし",
          description: "インポートできる有効なユーザーデータがありません。",
          variant: "warning",
        });
       setIsProcessing(false);
       return;
    }

    // Mock Contract Limit Check
    const availableSlots = MOCK_CONTRACT_LIMIT - MOCK_CURRENT_USER_COUNT;
    let importableCount = usersToImport.length;
    let contractLimitReached = false;
    if (importableCount > availableSlots) {
        importableCount = availableSlots;
        contractLimitReached = true;
        toast({
            title: "契約上限警告",
            description: `契約ユーザー数の上限(${MOCK_CONTRACT_LIMIT}名)に達するため、最初の${importableCount}名のみ登録されます。`,
            variant: "warning",
            duration: 10000, // Longer duration
        });
    }

    const finalUsersToImport = usersToImport.slice(0, importableCount);
    const summary: ImportSummary = {
      totalProcessed: validationResult.totalRows,
      successfullyImported: 0,
      failedImports: validationResult.invalidUsers.length + (usersToImport.length - finalUsersToImport.length),
      contractLimitReached: contractLimitReached,
      errors: validationResult.invalidUsers.map(u => ({ rowIndex: u.rowIndex, email: u.email, messages: u.errors })),
    };

    // Mock Import Process (Simulate API calls)
    const importPromises = finalUsersToImport.map((user, index) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          console.log(`[Mock Import] Registering user: ${user.email}, Name: ${user.name}, Groups: ${user.groupIds?.join(', ')}`);
          console.log(`[Mock Email] Sending invitation to: ${user.email}`);
          // Add email to mock list to prevent re-import in same session
          if (!MOCK_EXISTING_EMAILS.includes(user.email)) {
              MOCK_EXISTING_EMAILS.push(user.email);
          }
          summary.successfullyImported++;
          setProgress(Math.round(((index + 1) / finalUsersToImport.length) * 100));
          resolve();
        }, 50 * index); // Simulate network delay
      });
    });

    Promise.all(importPromises)
      .then(() => {
        setImportSummary(summary);
        toast({
          title: "インポート完了",
          description: `${summary.successfullyImported}名のユーザーが正常に登録されました。`,
        });
      })
      .catch((error) => {
        console.error("Import Error:", error);
        toast({
          title: "インポートエラー",
          description: "ユーザーの登録中に予期せぬエラーが発生しました。",
          variant: "destructive",
        });
        // Update summary with potential failures if needed
        setImportSummary(summary); // Show partial results even on error
      })
      .finally(() => {
        setIsProcessing(false);
        setProgress(0); // Reset progress after completion or error
        setFile(null); // Clear file after import
        setValidationResult(null); // Clear validation results
      });
  };

  const canImport = useMemo(() => {
      if (!validationResult) return false;
      if (partialImport) return validationResult.validUsers.length > 0;
      return validationResult.invalidUsers.length === 0 && validationResult.validUsers.length > 0;
  }, [validationResult, partialImport]);


  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        企業一般ユーザー一括登録
      </h2>

      {/* Step 1: Upload */}
      <div className="mb-8 p-6 border rounded-lg bg-white shadow">
        <h3 className="text-lg font-medium mb-4">1. ファイルアップロード</h3>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <Button variant="outline" onClick={downloadCsvTemplate}>
            <Download className="mr-2 h-4 w-4" />
            テンプレート (CSV)
          </Button>
          {/* TODO: Add sample data display */}
          <Button variant="link" disabled>サンプルデータ表示 (未実装)</Button>
        </div>
        <div
          {...getRootProps()}
          className={`p-10 border-2 border-dashed rounded-md text-center cursor-pointer hover:border-primary transition-colors ${
            isDragActive ? "border-primary bg-primary/10" : "border-gray-300"
          } ${file ? "border-green-500 bg-green-50" : ""}`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          {isDragActive ? (
            <p className="text-primary font-semibold">ここにファイルをドロップ...</p>
          ) : file ? (
             <div className="text-green-700 font-medium">
                <FileText className="inline-block mr-2 h-5 w-5" />
                {file.name} ({(file.size / 1024).toFixed(1)} KB)
             </div>
          ) : (
            <p className="text-gray-500">
              ここにCSVファイルをドラッグ＆ドロップするか、クリックして選択してください。
              <br />
              <span className="text-sm">(最大 { (MAX_FILE_SIZE / 1024 / 1024).toFixed()}MB)</span>
            </p>
          )}
        </div>
        {isProcessing && !importSummary && (
            <div className="mt-4">
                <Progress value={progress} className="w-full" />
                <p className="text-sm text-center text-muted-foreground mt-1">ファイルを処理中...</p>
            </div>
        )}
      </div>

      {/* Step 2: Validation Results */}
      {validationResult && !importSummary && (
        <div className="mb-8 p-6 border rounded-lg bg-white shadow">
          <h3 className="text-lg font-medium mb-4">2. データ検証結果</h3>
          <Alert variant={validationResult.invalidUsers.length > 0 ? "warning" : "success"} className="mb-4">
            {validationResult.invalidUsers.length > 0 ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            <AlertTitle>
              {validationResult.invalidUsers.length > 0 ? "検証エラーあり" : "検証完了"}
            </AlertTitle>
            <AlertDescription>
              ファイル「{validationResult.fileName}」から {validationResult.totalRows} 件のデータを読み込みました。
              有効: {validationResult.validUsers.length} 件、無効: {validationResult.invalidUsers.length} 件。
              {validationResult.invalidUsers.length > 0 && " 下記のエラーを確認してください。"}
            </AlertDescription>
          </Alert>

          {validationResult.invalidUsers.length > 0 && (
            <div className="max-h-60 overflow-y-auto border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">行番号</TableHead>
                    <TableHead>メールアドレス</TableHead>
                    <TableHead>エラー内容</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {validationResult.invalidUsers.map((user) => (
                    <TableRow key={user.rowIndex} className="bg-red-50 hover:bg-red-100">
                      <TableCell>{user.rowIndex}</TableCell>
                      <TableCell>{user.email || "(空)"}</TableCell>
                      <TableCell>
                        {user.errors.map((err, i) => (
                          <div key={i} className="text-red-700">{err}</div>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between">
             <div className="flex items-center space-x-2">
                <Checkbox
                    id="partialImport"
                    checked={partialImport}
                    onCheckedChange={(checked) => setPartialImport(Boolean(checked))}
                    disabled={isProcessing}
                />
                <label
                    htmlFor="partialImport"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    部分的な登録を許可 (エラー行をスキップして有効な行のみ登録)
                </label>
             </div>
            <Button onClick={handleImport} disabled={!canImport || isProcessing}>
              {isProcessing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Users className="mr-2 h-4 w-4" />
              )}
              {partialImport && validationResult.invalidUsers.length > 0
                ? `${validationResult.validUsers.length} 件を登録`
                : `全 ${validationResult.validUsers.length} 件を登録`}
            </Button>
          </div>
        </div>
      )}

       {/* Step 3: Import Summary */}
      {importSummary && (
        <div className="mb-8 p-6 border rounded-lg bg-white shadow">
          <h3 className="text-lg font-medium mb-4">3. インポート結果サマリー</h3>
           <Alert variant={importSummary.failedImports > 0 || importSummary.contractLimitReached ? "warning" : "success"} className="mb-4">
             {importSummary.failedImports > 0 || importSummary.contractLimitReached ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
             <AlertTitle>インポート完了</AlertTitle>
             <AlertDescription>
                処理総数: {importSummary.totalProcessed} 件<br/>
                <CheckCircle className="h-4 w-4 inline-block text-green-600 mr-1" /> 成功: {importSummary.successfullyImported} 件<br/>
                <AlertCircle className="h-4 w-4 inline-block text-red-600 mr-1" /> 失敗/スキップ: {importSummary.failedImports} 件
                {importSummary.contractLimitReached && <div className="mt-1 text-orange-700 font-medium">契約ユーザー数の上限に達したため、一部のユーザーは登録されませんでした。</div>}
             </AlertDescription>
           </Alert>

           {importSummary.errors.length > 0 && (
             <>
                <h4 className="text-md font-medium mt-4 mb-2">エラー詳細:</h4>
                <div className="max-h-60 overflow-y-auto border rounded-md">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="w-[80px]">元行番号</TableHead>
                        <TableHead>メールアドレス</TableHead>
                        <TableHead>エラー内容</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {importSummary.errors.map((err) => (
                        <TableRow key={err.rowIndex} className="bg-red-50 hover:bg-red-100">
                        <TableCell>{err.rowIndex}</TableCell>
                        <TableCell>{err.email || "(空)"}</TableCell>
                        <TableCell>
                            {err.messages.map((msg, i) => (
                            <div key={i} className="text-red-700">{msg}</div>
                            ))}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </div>
             </>
           )}
            <div className="mt-6 text-right">
                <Button onClick={() => { setFile(null); setValidationResult(null); setImportSummary(null); }}>
                    別のファイルをアップロード
                </Button>
            </div>
        </div>
      )}

    </div>
  );
}
