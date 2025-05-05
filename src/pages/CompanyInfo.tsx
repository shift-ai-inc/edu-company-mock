import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Calendar,
  Edit,
  Save,
  X, // For cancel edit
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast"; // Import useToast

// 会社情報の型定義 (ブランディング関連を削除)
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
  // Future fields (placeholders for now)
  corporateNumber?: string;
  billingAddress?: string;
  subdomain?: string;
  language?: string;
}

// サンプル会社情報 (ブランディング関連を削除)
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
  const { toast } = useToast(); // Initialize toast

  // 編集モードの切り替え
  const toggleEditMode = () => {
    if (editMode) {
      // 編集を破棄して元の情報に戻す
      setTempInfo(companyInfo);
    } else {
      // 編集用に現在の情報をコピー
      setTempInfo({ ...companyInfo });
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

  // 現在表示すべき情報（編集モードではtempInfo、それ以外ではcompanyInfo）
  const displayInfo = editMode ? tempInfo : companyInfo;

  return (
    <div className="container mx-auto p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
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

        {/* 基本情報カード */}
        <Card className="mb-6">
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

        {/* 連絡先情報カード */}
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

      </div>
    </div>
  );
}
