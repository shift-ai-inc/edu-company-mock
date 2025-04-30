import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, PlusCircle } from "lucide-react";

// 仮のデータ
const companies = [
  { id: 1, name: "株式会社テクノロジー", industry: "IT", employees: 250, status: "アクティブ" },
  { id: 2, name: "グローバル商事", industry: "商社", employees: 1500, status: "アクティブ" },
  { id: 3, name: "未来建設", industry: "建設", employees: 800, status: "休止中" },
  { id: 4, name: "エコソリューションズ", industry: "環境", employees: 120, status: "アクティブ" },
  { id: 5, name: "デジタルメディア", industry: "メディア", employees: 450, status: "審査中" },
];

export default function Companies() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">企業管理</h2>
        {/* 操作バー */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="企業を検索..."
                className="pl-8 w-[300px]"
              />
            </div>
          </div>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            新規企業を追加
          </Button>
        </div>
      </div>

      {/* テーブル */}
      <div className="bg-white shadow rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>企業名</TableHead>
              <TableHead>業界</TableHead>
              <TableHead>従業員数</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="text-right">アクション</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell className="font-medium">{company.name}</TableCell>
                <TableCell>{company.industry}</TableCell>
                <TableCell>{company.employees.toLocaleString()}人</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    company.status === "アクティブ" ? "bg-green-100 text-green-800" :
                    company.status === "休止中" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {company.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    詳細
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
