import React from 'react';
import { useParams } from 'react-router-dom';
import { mockContracts } from '@/data/mockContracts';
// import { Contract } from '@/types/contract'; // Not directly needed if using contract from mock
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { format, differenceInDays, intervalToDuration, isPast, isValid, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { AlertTriangle } from 'lucide-react';

// Define Duration type (can be moved to a shared types file if used elsewhere)
type Duration = { years?: number; months?: number; days?: number };

// Helper function to format duration
const formatDuration = (duration: Duration): string => {
  const parts: string[] = [];
  if (duration.years && duration.years > 0) parts.push(`${duration.years}年`);
  if (duration.months && duration.months > 0) parts.push(`${duration.months}ヶ月`);
  if (duration.days && duration.days > 0) parts.push(`${duration.days}日`);
  return parts.length > 0 ? parts.join('') : '期間終了';
};

const ContractManagement: React.FC = () => {
  const { contractId } = useParams<{ contractId: string }>();
  const contract = mockContracts.find(c => c.id === contractId);
  const now = new Date();

  const getContractStatus = (endDate: Date): { text: string; variant: "default" | "destructive" | "secondary" } => {
    if (isPast(endDate)) {
      return { text: '契約終了', variant: 'destructive' };
    }
    // const daysLeft = differenceInDays(endDate, now); // Not directly used for variant here
    return { text: '契約中', variant: 'secondary' };
  };

  if (!contract) {
    return (
      <div className="container mx-auto p-6 mt-6 flex flex-col items-center justify-center h-[calc(100vh-200px)]">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-700 mb-2">契約が見つかりません</h1>
        <p className="text-gray-500">指定されたIDの契約は存在しませんでした。</p>
        {/* Optionally, add a button to navigate back to a contracts list or dashboard */}
      </div>
    );
  }

  const startDate = parseISO(contract.startDate);
  const endDate = parseISO(contract.endDate);
  let remainingDurationStr = 'N/A';
  let countdownStr = 'N/A';
  let status = { text: '無効な日付', variant: 'destructive' as const };
  let usagePercentage = 0;
  let remainingLicenses = 0;

  if (isValid(startDate) && isValid(endDate)) {
    status = getContractStatus(endDate);

    if (isPast(endDate)) {
      remainingDurationStr = '契約終了';
      countdownStr = '終了済み';
    } else {
      const duration = intervalToDuration({ start: now, end: endDate });
      remainingDurationStr = formatDuration(duration);
      const daysLeft = differenceInDays(endDate, now);
      countdownStr = `${daysLeft}日`;
    }
  }

  if (contract.totalLicenses > 0) {
    usagePercentage = Math.round((contract.usedLicenses / contract.totalLicenses) * 100);
    remainingLicenses = contract.totalLicenses - contract.usedLicenses;
  } else {
    usagePercentage = 0;
    remainingLicenses = 0;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 mt-6">
      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-2xl font-bold text-gray-800">
            契約詳細: {contract.serviceName}
          </CardTitle>
          <CardDescription className="text-md text-gray-600">
            企業名: {contract.companyName}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">契約期間</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>開始日:</strong>{' '}
                  {isValid(startDate) ? format(startDate, 'yyyy年MM月dd日', { locale: ja }) : '無効な日付'}
                </p>
                <p>
                  <strong>終了日:</strong>{' '}
                  {isValid(endDate) ? format(endDate, 'yyyy年MM月dd日', { locale: ja }) : '無効な日付'}
                </p>
                <hr className="my-2"/>
                <p>
                  <strong>残り期間:</strong> {remainingDurationStr}
                </p>
                <p>
                  <strong>終了まで:</strong> {countdownStr}
                </p>
                <p>
                  <strong>ステータス:</strong> <Badge variant={status.variant}>{status.text}</Badge>
                </p>
                <p>
                  <strong>自動更新:</strong> {contract.autoRenew ? 'あり' : 'なし'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">ライセンス情報</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>総ライセンス数:</strong> {contract.totalLicenses.toLocaleString()}
                </p>
                <p>
                  <strong>使用中ライセンス数:</strong> {contract.usedLicenses.toLocaleString()}
                </p>
                <p>
                  <strong>残ライセンス数:</strong> {remainingLicenses.toLocaleString()}
                </p>
                <hr className="my-2"/>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <strong>使用率:</strong>
                    <span className="text-xs font-semibold">{usagePercentage}%</span>
                  </div>
                  <Progress value={usagePercentage} className="w-full h-3" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Future sections can be added here, e.g., Contract Documents, Notes, Billing History */}
          {/* 
          <Card>
            <CardHeader><CardTitle className="text-lg font-semibold">契約書類</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">(ここに契約書類のリストやアップロード機能)</p>
            </CardContent>
          </Card>
          */}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractManagement;
