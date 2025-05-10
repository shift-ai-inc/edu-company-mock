import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input"; // No longer needed for company name/timezone
// import { Label } from "@/components/ui/label"; // No longer needed for company name/timezone
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label"; // Keep for Notification and Security settings
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you'd clear tokens, user state, etc.
    navigate("/login");
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">設定</h2>

      <div className="grid gap-6">
        {/* General Settings Card Removed */}

        <Card>
          <CardHeader>
            <CardTitle>通知設定</CardTitle>
            <CardDescription>
              通知の受信設定を管理します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>メール通知</Label>
                <p className="text-sm text-muted-foreground">
                  重要な更新をメールで受け取ります
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>ブラウザ通知</Label>
                <p className="text-sm text-muted-foreground">
                  ブラウザでプッシュ通知を受け取ります
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>セキュリティ設定</CardTitle>
            <CardDescription>
              アカウントのセキュリティ設定を管理します
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>二段階認証</Label>
                <p className="text-sm text-muted-foreground">
                  ログイン時に追加の認証を要求します
                </p>
              </div>
              <Switch />
            </div>
            <div className="pt-4">
              <Button variant="outline">
                パスワードを変更
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>アカウント操作</CardTitle>
            <CardDescription>
              アカウントからのログアウトを行います
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={handleLogout}>
              ログアウト
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
