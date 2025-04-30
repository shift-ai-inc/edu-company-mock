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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, Mail, AlertCircle, ShieldCheck } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showMFA, setShowMFA] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 実際の実装ではここでAPIリクエストを行いますが、
    // デザインモックのためにMFA画面への遷移をシミュレート
    if (email && password) {
      if (email === "admin@example.com" && password === "password") {
        setShowMFA(true);
      } else {
        setError("メールアドレスまたはパスワードが正しくありません。");
      }
    } else {
      setError("メールアドレスとパスワードを入力してください。");
    }
  };

  const handleVerifyMFA = (e: React.FormEvent) => {
    e.preventDefault();
    // 実際の実装ではここでAPIリクエストを行いますが、
    // デザインモックのためにダッシュボードへの遷移をシミュレート
    if (verificationCode === "123456") {
      navigate("/");
    } else {
      setError("認証コードが正しくありません。");
    }
  };

  const handlePasswordReset = () => {
    // 実際の実装ではパスワードリセットフローを開始
    alert("パスワードリセットのリンクをメールで送信しました。");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full">
        {showMFA ? (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                二段階認証
              </CardTitle>
              <CardDescription className="text-center">
                メールに送信された6桁の認証コードを入力してください
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleVerifyMFA}>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="verification-code">認証コード</Label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="verification-code"
                        placeholder="6桁の認証コード"
                        className="pl-10"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    認証する
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <Button
                variant="link"
                className="w-full"
                onClick={() => setShowMFA(false)}
              >
                戻る
              </Button>
            </CardFooter>
          </Card>
        ) : (
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
              <form onSubmit={handleLogin}>
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
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
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">パスワード</Label>
                      <Button
                        variant="link"
                        className="p-0 h-auto text-sm"
                        onClick={handlePasswordReset}
                      >
                        パスワードをお忘れですか？
                      </Button>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    ログイン
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-center w-full text-gray-500">
                デモアカウント：admin@example.com / password
              </div>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
