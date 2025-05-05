import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, AlertCircle, CheckCircle, Users } from 'lucide-react';
// Removed the incorrect import:
// import { MOCK_EXISTING_EMAILS } from './GeneralUserList'; // <-- REMOVED THIS LINE

// Placeholder for actual user data fetching or state management if needed later
// For now, we assume email validation happens server-side or via a shared utility/hook

export default function BulkUserRegistration() {
  const [csvData, setCsvData] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSuccessMessage(null);
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        // Optional: Read file content for preview or immediate parsing
        const reader = new FileReader();
        reader.onload = (e) => {
          setCsvData(e.target?.result as string);
        };
        reader.readAsText(selectedFile);
      } else {
        setError('CSVファイルを選択してください。');
        setFile(null);
        setCsvData('');
      }
    } else {
      setFile(null);
      setCsvData('');
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    setError(null);
    setSuccessMessage(null);
    setFile(null); // Clear file if pasting
    setCsvData(event.clipboardData.getData('text'));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!file && !csvData.trim()) {
      setError('CSVファイルをアップロードするか、データを貼り付けてください。');
      return;
    }

    setProcessing(true);

    // Simulate processing delay (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // --- Placeholder for actual processing logic ---
    // 1. Parse CSV data (from file or textarea)
    // 2. Validate data (required fields, email format, **email uniqueness - needs API/backend check**)
    // 3. Check against contract limits (needs data source)
    // 4. Send data to backend API for registration
    // 5. Handle API response (success/errors)
    // ---------------------------------------------

    // Mock success scenario
    const processedCount = csvData.split('\n').filter(line => line.trim()).length || (file ? 5 : 0); // Example count
    setSuccessMessage(`${processedCount}件のユーザー登録リクエストを処理しました。詳細はメール通知を確認してください。`);
    setCsvData('');
    setFile(null);
    // Reset file input visually (important!)
    const fileInput = document.getElementById('csv-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';


    // Mock error scenario (example)
    // setError("処理中にエラーが発生しました。行5: メールアドレスが重複しています。");

    setProcessing(false);
  };

  return (
    <div className="container mx-auto p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            一般ユーザー一括登録
          </CardTitle>
          <CardDescription>
            CSVファイルを使用して複数の一般ユーザーを一度に登録します。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && (
            <Alert variant="default" className="mb-4 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-700" />
              <AlertTitle className="text-green-800">成功</AlertTitle>
              <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="csv-upload" className="block text-sm font-medium text-gray-700 mb-2">
                CSVファイルアップロード
              </Label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <Label
                      htmlFor="csv-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>ファイルを選択</span>
                      <Input
                        id="csv-upload"
                        name="csv-upload"
                        type="file"
                        className="sr-only"
                        accept=".csv"
                        onChange={handleFileChange}
                        disabled={processing}
                      />
                    </Label>
                    <p className="pl-1">またはドラッグ＆ドロップ</p>
                  </div>
                  <p className="text-xs text-gray-500">CSVファイルのみ (最大5MB)</p>
                  {file && <p className="text-sm text-gray-700 mt-2">選択中のファイル: {file.name}</p>}
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-gray-500">または</div>

            <div>
              <Label htmlFor="csv-paste" className="block text-sm font-medium text-gray-700 mb-2">
                CSVデータを貼り付け
              </Label>
              <Textarea
                id="csv-paste"
                rows={8}
                placeholder="氏名,メールアドレス,グループID1;グループID2&#10;山田 太郎,taro@example.com,grp_aaa111&#10;佐藤 花子,hanako@example.com,grp_ccc333;grp_ddd444"
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                onPaste={handlePaste}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                disabled={processing || !!file} // Disable if file is selected
              />
              <p className="mt-2 text-sm text-gray-500">
                ヘッダー行は任意です。形式: 氏名,メールアドレス,グループID (複数グループはセミコロン区切り)
              </p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={processing || (!file && !csvData.trim())}>
                {processing ? (
                  "処理中..."
                ) : (
                  <>
                    <Users className="mr-2 h-4 w-4" />
                    一括登録を実行
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
