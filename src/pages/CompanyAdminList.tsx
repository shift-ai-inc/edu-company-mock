import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockCompanyAdmins } from '@/data/mockCompanyAdmins'; // Removed deleteMockCompanyAdmin as it's moved
import { getGroupNamesByIds } from '@/data/mockGroups';
import { CompanyAdministrator, getAuthorityDisplayName } from '@/types/companyAdmin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
// Removed: Edit, Trash2, KeyRound, AlertDialog components and related logic for delete/password reset
// import { useToast } from '@/hooks/use-toast'; // Not needed if actions are removed
// import { addPermissionLog } from '@/data/mockPermissionLogs'; // Not needed if actions are removed

const CompanyAdminList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  // const { toast } = useToast(); // Removed
  const navigate = useNavigate();
  // const [dataVersion, setDataVersion] = useState(0); // Removed, not directly modifying data here anymore
  // const [resettingAdminId, setResettingAdminId] = useState<string | null>(null); // Removed

  const filteredAdmins = useMemo(() => {
    return mockCompanyAdmins.filter(admin =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]); // Removed dataVersion from dependencies

  const handleRowClick = (adminId: string) => {
    navigate(`/company-admins/${adminId}`);
  };

  // handleDelete and handlePasswordReset functions are removed as actions are moved to detail page

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">企業管理者一覧</h1>
        <Button asChild>
          <Link to="/company-admins/create">
            <PlusCircle className="mr-2 h-4 w-4" /> 新規登録
          </Link>
        </Button>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="氏名またはメールアドレスで検索..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>氏名</TableHead>
              <TableHead>メールアドレス</TableHead>
              <TableHead>権限</TableHead>
              <TableHead>所属グループ</TableHead>
              <TableHead>登録日</TableHead>
              {/* <TableHead>アクション</TableHead> Removed Action column */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <TableRow 
                  key={admin.id} 
                  onClick={() => handleRowClick(admin.id)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{getAuthorityDisplayName(admin.authority)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getGroupNamesByIds(admin.affiliatedGroupIds).map(groupName => (
                        <Badge key={groupName} variant="secondary">{groupName}</Badge>
                      ))}
                      {admin.affiliatedGroupIds.length === 0 && <span className="text-xs text-gray-500">なし</span>}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(admin.createdAt).toLocaleDateString()}</TableCell>
                  {/* Removed TableCell for actions */}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-4"> {/* ColSpan reduced */}
                  該当する管理者は見つかりません。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CompanyAdminList;
