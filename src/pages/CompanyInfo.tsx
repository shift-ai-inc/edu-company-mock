import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Building,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Upload,
  Palette, // Using Palette instead of non-existent Branding icon
  Check,
  Calendar,
  Edit,
  Save,
  Image, // For logo placeholder
  X, // For cancel edit
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"; // Import useToast

// 会社情報の型定義
interface CompanyInfo {
  name: string;
  legalName: string;
  industry: string;
  foundedYear: string;
  employeeCount: string;
  description: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  logoUrl: string | null; // Allow null for no logo
  primaryColor: string;
  // Future fields (placeholders for now)
  corporateNumber?: string;
  billingAddress?: string;
  subdomain?: string;
  language?: string;
}

// サンプル会社情報
const sampleCompanyInfo: CompanyInfo = {
  name: "テクノバンガード株式会社",
  legalName: "テクノバンガード株式会社",
  industry: "情報技術",
  foundedYear: "2010",
  employeeCount: "150",
  description:
    "私たちは革新的なソフトウェアソリューションを提供する企業です。\nクラウドテクノロジー、AI、データ分析分野での専門知識を活かし、企業の課題解決に貢献しています。",
  address: "東京都港区六本木1-1-1 テクノタワー8階",
  postalCode: "106-0032",
  city: "東京",
  country: "日本",
  phone: "03-1234-5678",
  email: "info@technovanguard.co.jp",
  website: "https://www.technovanguard.co.jp",
  logoUrl: null, // Initially no logo
  primaryColor: "#3b82f6", // Default blue
};

const industries = [
  "情報技術",
  "金融",
  "医療",
  "教育",
  "小売",
  "製造",
  "不動産",
  "建設",
  "エンターテイメント",
  "旅行・観光",
  "運輸・物流",
  "エネルギー",
  "農業",
  "その他",
];

export default function CompanyInfo() {
  const [companyInfo, setCompanyInfo] =
    useState<CompanyInfo>(sampleCompanyInfo);
  const [editMode, setEditMode] = useState(false);
  const [tempInfo, setTempInfo] = useState<CompanyInfo>(sampleCompanyInfo);
  const [activeTab, setActiveTab] = useState("basic");
  const [logoPreview, setLogoPreview] = useState<string | null>(sampleCompanyInfo.logoUrl);
  const { toast } = useToast(); // Initialize toast

  // 編集モードの切り替え
  const toggleEditMode = () => {
    if (editMode) {
      // 編集を破棄して元の情報に戻す
      setTempInfo(companyInfo);
      setLogoPreview(companyInfo.logoUrl); // Reset logo preview on cancel
    } else {
      // 編集用に現在の情報をコピー
      setTempInfo({ ...companyInfo });
      setLogoPreview(companyInfo.logoUrl); // Set initial preview for editing
    }
    setEditMode(!editMode);
  };

  // 情報の保存
  const saveChanges = () => {
    // ここでAPI呼び出しをシミュレート
    console.log("Saving company info:", tempInfo);
    setCompanyInfo(tempInfo);
    setEditMode(false);
    toast({
      title: "成功",
      description: "会社情報が正常に保存されました。",
      variant: "default", // Use default variant for success
    });
  };

  // フォームの入力変更ハンドラ
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTempInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Selectコンポーネントの変更ハンドラ
  const handleSelectChange = (name: keyof CompanyInfo, value: string) => {
     setTempInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // カラー選択ハンドラ
  const handleColorChange = (color: string) => {
    setTempInfo((prev) => ({
      ...prev,
      primaryColor: color,
    }));
  };

  // ロゴファイル選択ハンドラ (Mock)
  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate upload and get URL/preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const previewUrl = reader.result as string;
        setLogoPreview(previewUrl);
        setTempInfo((prev) => ({
          ...prev,
          logoUrl: previewUrl, // In real app, this would be the URL after upload
        }));
        toast({
          title: "ロゴ更新",
          description: "ロゴプレビューが更新されました。保存すると反映されます。",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // 現在表示すべき情報（編集モードではtempInfo、それ以外ではcompanyInfo）
  const displayInfo = editMode ? tempInfo : companyInfo;
  const currentLogo = editMode ? logoPreview : companyInfo.logoUrl;

  return (
    <div className="container mx-auto p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">会社情報</h1>
          <div className="flex gap-2">
            {editMode && (
               <Button variant="outline" onClick={toggleEditMode}>
                 <X className="mr-2 h-4 w-4" />
                 キャンセル
               </Button>
            )}
            <Button
              variant={editMode ? "default" : "outline"}
              onClick={editMode ? saveChanges : toggleEditMode}
            >
              {editMode ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  保存
                </>
              ) : (
                <>
                  <Edit className="mr-2 h-4 w-4" />
                  編集
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-lg mb-6">
            <TabsTrigger value="basic">基本情報</TabsTrigger>
            <TabsTrigger value="contact">連絡先</TabsTrigger>
            <TabsTrigger value="branding">ブランディング</TabsTrigger>
          </TabsList>

          {/* 基本情報タブ */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>基本情報</CardTitle>
                <CardDescription>
                  会社の基本的な情報を管理します。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">会社名</Label>
                    {editMode ? (
                      <Input
                        id="name"
                        name="name"
                        value={tempInfo.name}
                        onChange={handleInputChange}
                        placeholder="会社名を入力"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                        <Building className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span>{displayInfo.name || "-"}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="legalName">正式社名</Label>
                    {editMode ? (
                      <Input
                        id="legalName"
                        name="legalName"
                        value={tempInfo.legalName}
                        onChange={handleInputChange}
                        placeholder="正式社名を入力"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                        <Building className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span>{displayInfo.legalName || "-"}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="industry">業種</Label>
                    {editMode ? (
                      <Select
                        value={tempInfo.industry}
                        onValueChange={(value) => handleSelectChange('industry', value)}
                        name="industry"
                      >
                        <SelectTrigger id="industry">
                          <SelectValue placeholder="業種を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                        <span>{displayInfo.industry || "-"}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="foundedYear">設立年</Label>
                    {editMode ? (
                      <Input
                        id="foundedYear"
                        name="foundedYear"
                        value={tempInfo.foundedYear}
                        onChange={handleInputChange}
                        placeholder="例: 2010"
                        type="number" // Use number type for year
                        min="1800" // Reasonable minimum
                        max={new Date().getFullYear()} // Max current year
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                        <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span>{displayInfo.foundedYear ? `${displayInfo.foundedYear}年` : "-"}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeCount">従業員数</Label>
                    {editMode ? (
                      <Input
                        id="employeeCount"
                        name="employeeCount"
                        value={tempInfo.employeeCount}
                        onChange={handleInputChange}
                        placeholder="例: 150"
                        type="number" // Use number type
                        min="0"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                        <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span>{displayInfo.employeeCount ? `${displayInfo.employeeCount}名` : "-"}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">会社概要</Label>
                  {editMode ? (
                    <Textarea
                      id="description"
                      name="description"
                      value={tempInfo.description}
                      onChange={handleInputChange}
                      placeholder="会社概要を入力"
                      rows={5}
                      className="min-h-[100px]"
                    />
                  ) : (
                    <div className="p-3 border rounded-md bg-gray-50 min-h-[100px]">
                      <p className="text-gray-800 whitespace-pre-line">
                        {displayInfo.description || "-"}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 連絡先タブ */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>連絡先情報</CardTitle>
                <CardDescription>会社の連絡先情報を管理します。</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">住所</Label>
                  {editMode ? (
                    <Input
                      id="address"
                      name="address"
                      value={tempInfo.address}
                      onChange={handleInputChange}
                      placeholder="住所を入力"
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                      <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span>{displayInfo.address || "-"}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">郵便番号</Label>
                    {editMode ? (
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={tempInfo.postalCode}
                        onChange={handleInputChange}
                        placeholder="例: 100-0000"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                        <span>{displayInfo.postalCode || "-"}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">市区町村</Label>
                    {editMode ? (
                      <Input
                        id="city"
                        name="city"
                        value={tempInfo.city}
                        onChange={handleInputChange}
                        placeholder="例: 東京都千代田区"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                        <span>{displayInfo.city || "-"}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">国</Label>
                    {editMode ? (
                      <Input
                        id="country"
                        name="country"
                        value={tempInfo.country}
                        onChange={handleInputChange}
                        placeholder="例: 日本"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                        <span>{displayInfo.country || "-"}</span>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="phone">電話番号</Label>
                    {editMode ? (
                      <Input
                        id="phone"
                        name="phone"
                        value={tempInfo.phone}
                        onChange={handleInputChange}
                        placeholder="例: 03-1234-5678"
                        type="tel"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                        <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span>{displayInfo.phone || "-"}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">代表メールアドレス</Label>
                    {editMode ? (
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={tempInfo.email}
                        onChange={handleInputChange}
                        placeholder="例: info@example.com"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                        <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span>{displayInfo.email || "-"}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">ウェブサイト</Label>
                    {editMode ? (
                      <Input
                        id="website"
                        name="website"
                        value={tempInfo.website}
                        onChange={handleInputChange}
                        placeholder="例: https://www.example.com"
                        type="url"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-gray-50 min-h-[36px]">
                        <Globe className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        {displayInfo.website ? (
                           <a
                            href={displayInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate"
                          >
                            {displayInfo.website}
                          </a>
                        ) : (
                          <span>-</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ブランディングタブ */}
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>ブランディング設定</CardTitle>
                <CardDescription>
                  会社のロゴやブランドカラーを設定します。
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>ロゴ</Label>
                  <div className="flex flex-col sm:flex-row items-start gap-6">
                    <div className="border p-2 rounded-md bg-gray-50 flex items-center justify-center w-32 h-32 flex-shrink-0">
                      {currentLogo ? (
                        <img
                          src={currentLogo}
                          alt="会社ロゴ"
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-gray-400 text-center">
                          <Image className="h-10 w-10 mb-2" />
                          <span className="text-xs">ロゴ未設定</span>
                        </div>
                      )}
                    </div>
                    {editMode && (
                      <div className="space-y-2">
                         <Label htmlFor="logo-upload" className="cursor-pointer">
                           <Button asChild variant="outline">
                             <span>
                               <Upload className="mr-2 h-4 w-4" />
                               ロゴをアップロード
                             </span>
                           </Button>
                           <Input
                             id="logo-upload"
                             type="file"
                             className="hidden"
                             accept="image/png, image/jpeg, image/gif, image/svg+xml"
                             onChange={handleLogoChange}
                           />
                         </Label>
                        <p className="text-xs text-muted-foreground">
                          推奨: 正方形, 2MBまで (PNG, JPG, GIF, SVG)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>ブランドカラー</Label>
                  {editMode ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 flex-wrap">
                        <div
                          className="w-10 h-10 rounded border flex-shrink-0"
                          style={{ backgroundColor: tempInfo.primaryColor }}
                        ></div>
                        <Input
                          type="color"
                          value={tempInfo.primaryColor}
                          onChange={(e) => handleColorChange(e.target.value)}
                          className="w-16 h-10 p-1 border-none cursor-pointer"
                          aria-label="カラーピッカー"
                        />
                        <Input
                          value={tempInfo.primaryColor}
                          onChange={(e) => handleColorChange(e.target.value)}
                          className="w-32"
                          placeholder="#3b82f6"
                          aria-label="カラーコード入力"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        クリックして色を選択、またはカラーコードを入力してください。
                      </p>
                      <div className="grid grid-cols-6 gap-2 max-w-xs">
                        {[
                          "#3b82f6", // Blue
                          "#10b981", // Green
                          "#f59e0b", // Amber
                          "#ef4444", // Red
                          "#8b5cf6", // Violet
                          "#ec4899", // Pink
                          "#64748b", // Slate
                          "#334155", // Dark Slate
                        ].map((color) => (
                          <button
                            key={color}
                            type="button"
                            aria-label={`色 ${color} を選択`}
                            className="w-8 h-8 rounded-md cursor-pointer border hover:ring-2 ring-offset-2 ring-primary transition-all focus:outline-none focus:ring-2"
                            style={{ backgroundColor: color }}
                            onClick={() => handleColorChange(color)}
                          ></button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded border"
                        style={{ backgroundColor: displayInfo.primaryColor }}
                      ></div>
                      <span className="font-mono text-sm">
                        {displayInfo.primaryColor}
                      </span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>プレビュー</Label>
                  <div className="border rounded-lg p-4 space-y-4 bg-white shadow-sm">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {currentLogo ? (
                          <AvatarImage src={currentLogo} alt="Logo Preview" />
                        ) : null}
                        <AvatarFallback
                          style={{ backgroundColor: displayInfo.primaryColor, color: getContrastColor(displayInfo.primaryColor) }}
                          className="font-semibold"
                        >
                          {displayInfo.name?.substring(0, 2).toUpperCase() || '??'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-semibold text-lg">{displayInfo.name || "会社名"}</span>
                    </div>
                    <div
                      className="h-2 rounded-full"
                      style={{ backgroundColor: displayInfo.primaryColor }}
                      aria-hidden="true"
                    ></div>
                    <Button
                      style={{
                        backgroundColor: displayInfo.primaryColor,
                        color: getContrastColor(displayInfo.primaryColor),
                        // Add a subtle border if the color is very light
                        border: `1px solid ${isLight(displayInfo.primaryColor) ? 'rgba(0,0,0,0.1)' : 'transparent'}`,
                      }}
                      className="hover:opacity-90 transition-opacity"
                    >
                      ブランドカラーボタン
                    </Button>
                     <Alert style={{ borderColor: displayInfo.primaryColor, backgroundColor: hexToRgba(displayInfo.primaryColor, 0.05) }}>
                       <Palette className="h-4 w-4" style={{ color: displayInfo.primaryColor }}/>
                       <AlertDescription style={{ color: displayInfo.primaryColor }}>
                         これはブランドカラーを使用したアラートの例です。
                       </AlertDescription>
                     </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


// Helper function to determine text color (black or white) based on background color
// Basic contrast check, might need refinement for accessibility standards (WCAG)
function getContrastColor(hexcolor: string): string {
  if (!hexcolor) return '#ffffff'; // Default to white if color is invalid
  hexcolor = hexcolor.replace("#", "");
  if (hexcolor.length === 3) {
    hexcolor = hexcolor.split('').map(hex => hex + hex).join('');
  }
  const r = parseInt(hexcolor.substring(0, 2), 16);
  const g = parseInt(hexcolor.substring(2, 4), 16);
  const b = parseInt(hexcolor.substring(4, 6), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
}

// Helper function to check if a color is light
function isLight(hexcolor: string): boolean {
   if (!hexcolor) return false;
   const contrastColor = getContrastColor(hexcolor);
   return contrastColor === '#000000';
}

// Helper function to convert hex to rgba
function hexToRgba(hex: string, alpha: number): string {
  if (!hex) return `rgba(0,0,0,${alpha})`; // Default to black with alpha if invalid
  let c: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return `rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',')},${alpha})`;
  }
  // Return a default or handle error if hex is invalid
  console.warn("Invalid hex color provided to hexToRgba:", hex);
  return `rgba(0,0,0,${alpha})`; // Fallback
}
