import React from 'react';
import { mockContracts } from '@/data/mockContracts';
import { Contract } from '@/types/contract';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress'; // Import Progress
import { format, differenceInDays, intervalToDuration, isPast, isValid } from 'date-fns';
import { ja } from 'date-fns/locale'; // Import Japanese locale

// Define Duration type
type Duration = { years: number; months: number; days: number };

// Helper function to format duration
const formatDuration = (duration: Duration): string => {
  const parts: string[] = [];
  if (duration.years && duration.years > 0) parts.push(`${duration.years}年`);
  if (duration.months && duration.months > 0) parts.push(`${duration.months}ヶ月`);
  if (duration.days && duration.days > 0) parts.push(`${duration.days}日`);
  return parts.length > 0 ? parts.join('') : '期間終了';
};

const ContractManagement: React.FC = () => {
  const now = new Date();

  const getContractStatus = (endDate: Date): { text: string; variant: "destructive" } => {
    if (isPast(endDate)) {
      return { text: '契約終了', variant: 'destructive' };
    }
    const daysLeft = differenceInDays(endDate, now);
    // All return values need to have variant: 'destructive' to match the type
    return { text: '契約中', variant: 'destructive' };
  };


  return (
    <div className="container mx-auto p-6 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">契約管理</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>企業名</TableHead>
                  <TableHead>サービス名</TableHead>
                  <TableHead>契約開始日</TableHead>
                  <TableHead>契約終了日</TableHead>
                  <TableHead>残り期間</TableHead>
                  <TableHead>終了まで</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead className="text-right">総ライセンス数</TableHead>
                  <TableHead className="text-right">使用中</TableHead>
                  <TableHead className="text-right">残数</TableHead>
                  <TableHead>使用率</TableHead>
                  {/* Add more headers later: Auto Renew, Actions etc. */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockContracts.map((contract: Contract) => {
                  const startDate = new Date(contract.startDate);
                  const endDate = new Date(contract.endDate);
                  let remainingDurationStr = 'N/A';
                  let countdownStr = 'N/A';
                  let status = { text: '無効な日付', variant: 'destructive' as const };
                  let usagePercentage = 0;
                  let remainingLicenses = 0;

                  if (isValid(startDate) && isValid(endDate)) {
                    status = getContractStatus(endDate); // Calculate status

                    if (isPast(endDate)) {
                      remainingDurationStr = '契約終了';
                      countdownStr = '終了済み';
                    } else {
                      // Calculate remaining duration
                      const duration = intervalToDuration({ start: now, end: endDate });
                      remainingDurationStr = formatDuration(duration);
                      // Calculate countdown in days
                      const daysLeft = differenceInDays(endDate, now);
                      countdownStr = `${daysLeft}日`;
                    }
                  }

                  // Calculate license info
                  if (contract.totalLicenses > 0) {
                    usagePercentage = Math.round((contract.usedLicenses / contract.totalLicenses) * 100);
                    remainingLicenses = contract.totalLicenses - contract.usedLicenses;
                  } else {
                    // Handle cases with 0 total licenses (e.g., consulting)
                    usagePercentage = 0;
                    remainingLicenses = 0;
                  }


                  return (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.companyName}</TableCell>
                      <TableCell>{contract.serviceName}</TableCell>
                      <TableCell>
                        {isValid(startDate) ? format(startDate, 'yyyy年MM月dd日', { locale: ja }) : '無効な日付'}
                      </TableCell>
                      <TableCell>
                        {isValid(endDate) ? format(endDate, 'yyyy年MM月dd日', { locale: ja }) : '無効な日付'}
                      </TableCell>
                      <TableCell>{remainingDurationStr}</TableCell>
                      <TableCell>{countdownStr}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.text}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{contract.totalLicenses.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{contract.usedLicenses.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{remainingLicenses.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                           {/* Display usage percentage */}
                          <Progress value={usagePercentage} className="w-20 h-2" />
                          <span className="text-xs text-muted-foreground">{usagePercentage}%</span>
                        </div>
                      </TableCell>
                      {/* Add more cells later */}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
           {/* Add filtering/sorting options here later */}
           {/* Graphical display, usage graph, department allocation will be added here later */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractManagement;
