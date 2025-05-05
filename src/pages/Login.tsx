import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, Mail, AlertCircle, CheckCircle } from "lucide-react";

type AuthView = "login" | "resetRequest" | "resetConfirmation";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentView, setCurrentView] = useState<AuthView>("login");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const clearMessages = () => {
    setError("");
    setSuccessMessage("");
  };

  // Modified Login Handler - No validation, direct navigation
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    clearMessages(); // Clear any previous messages
    console.log("Login button clicked, navigating to dashboard...");
    // Directly navigate to the root, which redirects to dashboard
    navigate("/");
  };

  // Password Reset Request Handler (remains the same)
  const handlePasswordResetRequest = (e: React.FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email) {
      setError("メールアドレスを入力してください。");
      return;
    }
    console.log("Requesting password reset for:", email);
    setSuccessMessage(
      `${email} にパスワードリセット用のリンクを送信しました。メールを確認してください。`
    );
    setCurrentView("resetConfirmation");
  };

  const renderLogin = () => (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          SHIFT AI企業管理ポータル
        </CardTitle>
        <CardDescription className="text-center">
          アカウント情報を入力してログインしてください
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* The form still calls handleLogin on submit */}
        <form onSubmit={handleLogin}>
          {error && ( // Error display remains for password reset flow
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {successMessage && ( // Success message display remains for password reset flow
            <Alert variant="default" className="mb-4 bg-green-100 border-green-300">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">メールアドレス</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // Removed required attribute
                />
              </div>
            </div>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">パスワード</Label>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-sm"
                  onClick={() => {
                    clearMessages();
                    setCurrentView("resetRequest");
                  }}
                >
                  パスワードをお忘れですか？
                </Button>
              </div>
              <div className="relative">
                <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="パスワード"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // Removed required attribute
                />
              </div>
            </div>
            {/* Button type is submit, triggering the form's onSubmit */}
            <Button type="submit" className="w-full">
              ログイン
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );

  const renderResetRequest = () => (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          パスワードリセット
        </CardTitle>
        <CardDescription className="text-center">
          登録されているメールアドレスを入力してください。パスワードリセット用のリンクを送信します。
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handlePasswordResetRequest}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="reset-email">メールアドレス</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10"
                  value={email} // Use the same email state
                  onChange={(e) => setEmail(e.target.value)}
                  required // Keep required for reset request
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              リセットリンクを送信
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          variant="link"
          className="w-full"
          onClick={() => {
            clearMessages();
            setCurrentView("login");
          }}
        >
          ログインに戻る
        </Button>
      </CardFooter>
    </Card>
  );

   const renderResetConfirmation = () => (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          <CheckCircle className="inline-block h-6 w-6 mr-2 text-green-500" />
          メールを確認してください
        </CardTitle>
        <CardDescription className="text-center px-4">
          {successMessage}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
         {/* Optionally add instructions like "Didn't receive email?" */}
      </CardContent>
      <CardFooter>
        <Button
          variant="link"
          className="w-full"
          onClick={() => {
            clearMessages();
            setCurrentView("login");
          }}
        >
          ログインに戻る
        </Button>
      </CardFooter>
    </Card>
  );


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full">
        {currentView === "login" && renderLogin()}
        {currentView === "resetRequest" && renderResetRequest()}
        {currentView === "resetConfirmation" && renderResetConfirmation()}
      </div>
    </div>
  );
}
