import { Contract } from '@/types/contract';
// Ensure addDays is correctly imported from date-fns
import { addYears, addMonths, subDays, formatISO, addDays } from 'date-fns';

const now = new Date();

export const mockContracts: Contract[] = [
  {
    id: 'contract-001',
    companyName: '株式会社サンプルテック',
    serviceName: 'EduPlatform 年間ライセンス',
    startDate: formatISO(addYears(now, -1)), // Started 1 year ago
    endDate: formatISO(addMonths(now, 6)), // Ends in 6 months
    autoRenew: true,
    totalLicenses: 100,
    usedLicenses: 75,
  },
  {
    id: 'contract-002',
    companyName: '合同会社デモクリエイト',
    serviceName: '導入コンサルティング',
    startDate: formatISO(addMonths(now, -3)), // Started 3 months ago
    endDate: formatISO(addDays(now, 45)), // Ends in 45 days - Uses addDays
    autoRenew: false,
    totalLicenses: 10, // Consulting might not have user licenses, or could be project members
    usedLicenses: 8,
  },
  {
    id: 'contract-003',
    companyName: 'テスト工業株式会社',
    serviceName: 'カスタム開発契約',
    startDate: formatISO(addYears(now, -2)), // Started 2 years ago
    endDate: formatISO(subDays(now, 30)), // Ended 30 days ago
    autoRenew: false,
    totalLicenses: 50,
    usedLicenses: 50, // All used or contract ended
  },
   {
    id: 'contract-004',
    companyName: '架空商事',
    serviceName: 'サポート契約',
    startDate: formatISO(addMonths(now, -11)), // Started 11 months ago
    endDate: formatISO(addMonths(now, 1)), // Ends in 1 month
    autoRenew: true,
    totalLicenses: 200,
    usedLicenses: 185, // High usage
  },
   {
    id: 'contract-005',
    companyName: '株式会社トライアル',
    serviceName: 'EduPlatform 月間ライセンス',
    startDate: formatISO(addDays(now, -15)), // Started 15 days ago - Uses addDays
    endDate: formatISO(addDays(now, 15)), // Ends in 15 days - Uses addDays
    autoRenew: false,
    totalLicenses: 20,
    usedLicenses: 5, // Low usage
  },
];
