import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { getSurveyDeliveries, mockSurveyDeliveries } from '@/data/mockSurveyDeliveries'; // Use the same mock data
import { SurveyDelivery, DeliveryStatus, getSurveyDeliveryStatusInfo, RecurrenceFrequency } from '@/types/surveyDelivery'; // Import RecurrenceFrequency
import { format, differenceInHours, isFuture, parseISO } from 'date-fns'; // Import functions for time comparison
// import { utcToZonedTime, format as formatTz } from 'date-fns-tz'; // Example for future timezone support
import {
  Search,
  Filter,
  Edit,
  Trash2, // Use Trash2 for Cancel
  Bell, // Icon for notification/confirmation
  RefreshCw,
  CalendarClock, // For Modify
  XCircle, // Icon for Cancelled status
  Repeat, // Icon for recurring
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button"; // Ensure this is imported

// Define the extended status type including 'paused' and 'cancelled'
type ExtendedStatus = DeliveryStatus | 'paused' | 'cancelled';
type SortKey = keyof SurveyDelivery | 'surveyTitle'; // Add surveyTitle for sorting
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | ExtendedStatus; // Use extended status for filter

// Updated status info function to handle the extended statuses
const getExtendedSurveyDeliveryStatusInfo = (status: ExtendedStatus): { text: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' } => {
  // Reuse the original function if the status is one of the base DeliveryStatus types
  if (status === 'scheduled' || status === 'in-progress' || status === 'completed' || status === 'expired') {
    return getSurveyDeliveryStatusInfo(status);
  }
  // Handle the extended statuses
  switch (status) {
    case 'paused':
      return { text: '一時停止中', variant: 'outline' };
    case 'cancelled':
      return { text: 'キャンセル済', variant: 'destructive' };
    default:
      // This should ideally not be reached if types are correct
      return { text: '不明', variant: 'outline' };
  }
};


export default function SurveyDeliveryManagement() {
  const navigate = useNavigate(); // Initialize useNavigate
  // Use the extended status type for state
  const [deliveries, setDeliveries] = useState<(SurveyDelivery & { status: ExtendedStatus })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('deliveryStartDate'); // Default sort by start date
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc'); // Default ascending
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchData = async () => {
    setIsLoading(true);
    // Simulate fetching data - getSurveyDeliveries now returns the extended type
    const initialData = await getSurveyDeliveries();
    setDeliveries(initialData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAndSortedDeliveries = useMemo(() => {
    let result = deliveries.filter(delivery => {
      const matchesSearch =
        delivery.survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.targetGroup.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    result.sort((a, b) => {
      let compareA: any;
      let compareB: any;

      if (sortKey === 'surveyTitle') {
        compareA = a.survey.title;
        compareB = b.survey.title;
      } else if (sortKey === 'deliveryStartDate' || sortKey === 'deliveryEndDate' || sortKey === 'createdAt') {
        const dateA = typeof a[sortKey] === 'string' ? parseISO(a[sortKey] as string) : a[sortKey];
        const dateB = typeof b[sortKey] === 'string' ? parseISO(b[sortKey] as string) : b[sortKey];
        compareA = dateA instanceof Date ? dateA.getTime() : 0;
        compareB = dateB instanceof Date ? dateB.getTime() : 0;
      } else {
        // Handle potential undefined for optional fields if sorting by them
        compareA = a[sortKey as keyof SurveyDelivery] ?? '';
        compareB = b[sortKey as keyof SurveyDelivery] ?? '';
      }

      let comparison = 0;
      if (compareA > compareB) comparison = 1;
      else if (compareA < compareB) comparison = -1;
      return sortDirection === 'desc' ? comparison * -1 : comparison;
    });

    return result;
  }, [deliveries, searchTerm, statusFilter, sortKey, sortDirection]);

  const handleSortChange = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedRows(checked ? new Set(filteredAndSortedDeliveries.map(d => d.deliveryId)) : new Set());
  };

  const handleSelectRow = (deliveryId: string, checked: boolean) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(deliveryId);
      else newSet.delete(deliveryId);
      return newSet;
    });
  };

  const isAllSelected = filteredAndSortedDeliveries.length > 0 && selectedRows.size === filteredAndSortedDeliveries.length;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < filteredAndSortedDeliveries.length;

  // --- Action Handlers ---

  const handleCancelDelivery = (deliveryId: string) => {
    // logAuditEvent('cancel', deliveryId, currentUser);
    setDeliveries(prevDeliveries =>
      prevDeliveries.map(d =>
        d.deliveryId === deliveryId ? { ...d, status: 'cancelled' } : d
      )
    );
    toast({
      title: "配信キャンセル",
      description: `サーベイ配信ID: ${deliveryId} をキャンセルしました。`,
      variant: "destructive"
    });
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      newSet.delete(deliveryId);
      return newSet;
    });
  };

  const handleModifyDelivery = (deliveryId: string) => {
    // logAuditEvent('modify_attempt', deliveryId, currentUser);
    // Navigate to details page for modification instead of just logging
    navigate(`/survey-deliveries/${deliveryId}`);
    // toast({
    //   title: "配信変更",
    //   description: `サーベイ配信ID: ${deliveryId} の詳細ページに移動します。`,
    // });
  };

  const handleConfirmDelivery = (deliveryId: string) => {
    console.log("Confirm delivery:", deliveryId);
    toast({
      title: "配信スケジュール確認",
      description: `サーベイ配信ID: ${deliveryId} のスケジュールを確認しました。`,
    });
  };

  // --- Helper Functions ---
  const isNearStart = (startDate: Date, status: ExtendedStatus): boolean => {
    if (status !== 'scheduled') return false;
    const now = new Date();
    return isFuture(startDate) && differenceInHours(startDate, now) <= 24;
  };

  const formatDateTime = (date: Date | string | undefined): string => {
    if (!date) return '-';
    try {
      const d = typeof date === 'string' ? parseISO(date) : date;
      return format(d, 'yyyy/MM/dd HH:mm');
    } catch (e) {
      console.error("Error formatting date:", date, e);
      return '無効な日付';
    }
  };

  // Function to handle row click navigation
  const handleRowClick = (deliveryId: string) => {
    navigate(`/survey-deliveries/${deliveryId}`);
  };


  return (
    <TooltipProvider>
      <div className="p-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>サーベイ配信管理</CardTitle>
            <CardDescription>配信予定および繰り返し配信スケジュールを管理します。</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters, Search, and Bulk Actions */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="サーベイ名, 対象グループ..."
                  className="pl-8 w-[250px] bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="ステータス" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">すべてのステータス</SelectItem>
                    <SelectItem value="scheduled">予定</SelectItem>
                    <SelectItem value="in-progress">進行中</SelectItem>
                    <SelectItem value="completed">完了</SelectItem>
                    <SelectItem value="expired">期限切れ</SelectItem>
                    <SelectItem value="paused">一時停止中</SelectItem> {/* Added Paused */}
                    <SelectItem value="cancelled">キャンセル済</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading}>
                   <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>

                {selectedRows.size > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button
                         variant="destructive"
                         size="sm"
                         // Allow cancelling 'scheduled' or 'paused' recurring schedules? Adjust logic if needed.
                         disabled={Array.from(selectedRows).some(id => {
                           const d = deliveries.find(del => del.deliveryId === id);
                           return !(d?.status === 'scheduled' || d?.status === 'paused'); // Example: Allow cancelling paused
                         })}
                       >
                         <Trash2 className="mr-1.5 h-4 w-4" />
                         選択をキャンセル ({selectedRows.size})
                       </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>配信/スケジュールをキャンセルしますか？</AlertDialogTitle>
                        <AlertDialogDescription>
                          選択された {selectedRows.size} 件の配信/スケジュールをキャンセルします。この操作は元に戻せません。
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>いいえ</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            Array.from(selectedRows).forEach(id => {
                              const d = deliveries.find(del => del.deliveryId === id);
                              // Adjust condition based on what can be cancelled
                              if (d?.status === 'scheduled' || d?.status === 'paused') {
                                handleCancelDelivery(id);
                              }
                            });
                          }}
                          className={buttonVariants({ variant: "destructive" })}
                        >
                          はい、キャンセルする
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>

            {/* Survey Delivery Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead padding="checkbox">
                      <Checkbox
                        checked={isAllSelected || isIndeterminate}
                        onCheckedChange={(checked) => handleSelectAll(Boolean(checked))}
                        aria-label="すべての行を選択"
                        indeterminate={isIndeterminate}
                      />
                    </TableHead>
                    <TableHead onClick={() => handleSortChange('surveyTitle')} className="cursor-pointer hover:bg-muted/80">サーベイ名</TableHead>
                    <TableHead onClick={() => handleSortChange('targetGroup')} className="cursor-pointer hover:bg-muted/80">対象グループ</TableHead>
                    <TableHead onClick={() => handleSortChange('deliveryStartDate')} className="cursor-pointer hover:bg-muted/80">開始日時/スケジュール開始</TableHead>
                    <TableHead onClick={() => handleSortChange('deliveryEndDate')} className="cursor-pointer hover:bg-muted/80">終了日時/スケジュール終了</TableHead>
                    <TableHead onClick={() => handleSortChange('status')} className="cursor-pointer hover:bg-muted/80">ステータス</TableHead>
                    <TableHead>アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={7} className="h-24 text-center">読み込み中...</TableCell></TableRow>
                  ) : filteredAndSortedDeliveries.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="h-24 text-center">該当するサーベイ配信が見つかりません。</TableCell></TableRow>
                  ) : (
                    filteredAndSortedDeliveries.map((delivery) => {
                      const statusInfo = getExtendedSurveyDeliveryStatusInfo(delivery.status);
                      const nearStart = isNearStart(delivery.deliveryStartDate, delivery.status);
                      // Adjust conditions based on whether it's a recurring schedule or single delivery
                      const isCancellable = delivery.status === 'scheduled' || delivery.status === 'paused';
                      const isModifiable = delivery.status === 'scheduled' || delivery.status === 'paused' || delivery.status === 'in-progress'; // Allow modifying active schedules/deliveries?

                      return (
                        <TableRow
                          key={delivery.deliveryId}
                          data-state={selectedRows.has(delivery.deliveryId) ? 'selected' : undefined}
                          className={`cursor-pointer ${nearStart ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-muted/50'}`} // Highlight near-start items
                          onClick={() => handleRowClick(delivery.deliveryId)} // Add row click handler
                        >
                          <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}> {/* Stop propagation for checkbox */}
                            <Checkbox
                              checked={selectedRows.has(delivery.deliveryId)}
                              onCheckedChange={(checked) => handleSelectRow(delivery.deliveryId, Boolean(checked))}
                              aria-label="行を選択"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {delivery.isRecurring && <Repeat className="mr-1.5 h-3 w-3 text-muted-foreground" />}
                              {delivery.survey.title}
                            </div>
                          </TableCell>
                          <TableCell>{delivery.targetGroup}</TableCell>
                          <TableCell>{formatDateTime(delivery.deliveryStartDate)}</TableCell>
                          <TableCell>{formatDateTime(delivery.deliveryEndDate)}</TableCell>
                          <TableCell>
                             <div className="flex items-center">
                                <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
                                {nearStart && (
                                  <Tooltip>
                                    <TooltipTrigger asChild onClick={(e) => e.stopPropagation()}>
                                      <Bell className="ml-1.5 h-4 w-4 text-blue-600 animate-pulse" />
                                    </TooltipTrigger>
                                    <TooltipContent><p>配信開始まで24時間以内です</p></TooltipContent>
                                  </Tooltip>
                                )}
                             </div>
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}> {/* Stop propagation for actions cell */}
                            <div className="flex gap-1">
                              {nearStart && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => handleConfirmDelivery(delivery.deliveryId)} title="配信確認">
                                      <Bell className="h-4 w-4 text-blue-600" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>配信スケジュールを確認</p></TooltipContent>
                                </Tooltip>
                              )}
                              {isModifiable && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                     {/* Modify button now navigates */}
                                    <Button variant="ghost" size="icon" onClick={() => handleModifyDelivery(delivery.deliveryId)} title="詳細/変更">
                                      <CalendarClock className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>詳細表示 / スケジュール変更</p></TooltipContent>
                                </Tooltip>
                              )}
                              {isCancellable && (
                                <AlertDialog>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="キャンセル">
                                          <XCircle className="h-4 w-4" />
                                        </Button>
                                      </AlertDialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent><p>配信/スケジュールをキャンセル</p></TooltipContent>
                                  </Tooltip>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>キャンセルしますか？</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        サーベイ「{delivery.survey.title}」の配信/スケジュールをキャンセルします。この操作は元に戻せません。
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>いいえ</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleCancelDelivery(delivery.deliveryId)}
                                        className={buttonVariants({ variant: "destructive" })}
                                      >
                                        はい、キャンセルする
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
