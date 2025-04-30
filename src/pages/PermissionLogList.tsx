import React from 'react';
import { mockPermissionLogs } from '@/data/mockPermissionLogs';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns'; // Using date-fns for formatting

const PermissionLogList: React.FC = () => {

  const getActionDisplayName = (action: PermissionLog['action']): string => {
    switch (action) {
      case 'authority_changed': return '権限変更';
      case 'groups_changed': return '所属グループ変更';
      case 'admin_created': return '管理者作成';
      case 'admin_deleted': return '管理者削除';
      case 'password_reset': return 'パスワードリセット'; // Added display name
      default: return action; // Fallback
    }
  };


  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">権限変更履歴</h1>

      <ScrollArea className="h-[600px] border rounded-lg"> {/* Adjust height as needed */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>日時</TableHead>
              <TableHead>対象管理者</TableHead>
              <TableHead>操作</TableHead>
              <TableHead>詳細</TableHead>
              <TableHead>変更者</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPermissionLogs.length > 0 ? (
              mockPermissionLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {format(new Date(log.timestamp), 'yyyy/MM/dd HH:mm:ss')}
                  </TableCell>
                  <TableCell>{log.adminName} ({log.adminId})</TableCell>
                  <TableCell>{getActionDisplayName(log.action)}</TableCell> {/* Use helper function */}
                  <TableCell className="text-sm">{log.details}</TableCell>
                  <TableCell>{log.changedBy}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                  変更履歴はありません。
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default PermissionLogList;
