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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getSurveyDeliveries, mockSurveyDeliveries } from '@/data/mockSurveyDeliveries';
import { SurveyDelivery, DeliveryStatus, getSurveyDeliveryStatusInfo } from '@/types/surveyDelivery';
import { format, differenceInDays, isBefore, addDays } from 'date-fns';
import {
  Search,
  Filter,
  Edit,
  Send,
  AlertTriangle,
  CalendarClock,
  RefreshCw,
  Trash2,
  Eye, // Icon for View Details
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SortKey = keyof SurveyDelivery | 'progress';
type SortDirection = 'asc' | 'desc';
type StatusFilter = 'all' | DeliveryStatus;

export default function SurveyList() {
  const [deliveries, setDeliveries] = useState<SurveyDelivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchData = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const updatedData = mockSurveyDeliveries.map(d => ({ ...d }));
      updatedData.forEach(d => {
        d.incompleteCount = d.totalDelivered - d.completedCount;
        if (d.incompleteCount < 0) d.incompleteCount = 0;
      });
      setDeliveries(updatedData);
      setIsLoading(false);
    }, 50);
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

      if (sortKey === 'progress') {
        compareA = a.totalDelivered > 0 ? (a.completedCount / a.totalDelivered) : 0;
        compareB = b.totalDelivered > 0 ? (b.completedCount / b.totalDelivered) : 0;
      } else if (sortKey === 'deliveryStartDate' || sortKey === 'deliveryEndDate' || sortKey === 'createdAt') {
        compareA = new Date(a[sortKey]).getTime();
        compareB = new Date(b[sortKey]).getTime();
      } else if (sortKey === 'survey') {
         compareA = a.survey.title;
         compareB = b.survey.title;
      } else {
        compareA = a[sortKey as keyof SurveyDelivery];
        compareB = b[sortKey as keyof SurveyDelivery];
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
  const handleViewDetails = (surveyId: string) => {
    navigate(`/surveys/${surveyId}`); // Navigate to details page
  };

  const handleEdit = (deliveryId: string) => {
    console.log("Edit delivery:", deliveryId);
    toast({ title: "編集機能 (未実装)", description: `サーベイ配信ID: ${deliveryId}` });
    // TODO: Implement edit dialog or navigate to edit page for the *delivery*
  };

  const handleSendReminder = (deliveryId: string | string[]) => {
    const ids = Array.isArray(deliveryId) ? deliveryId : [deliveryId];
    console.log("Send reminder for:", ids);
    toast({ title: "リマインダー送信 (シミュレーション)", description: `対象ID: ${ids.join(', ')}` });
  };

   const handleExtendDeadline = (deliveryIds: string[]) => {
     console.log("Extend deadline for:", deliveryIds);
     const newEndDate = format(addDays(new Date(), 7), 'yyyy/MM/dd');
     toast({ title: "期限延長 (シミュレーション)", description: `対象ID: ${deliveryIds.join(', ')} を ${newEndDate} まで延長しました。` });
     setSelectedRows(new Set());
   };

  // --- Helper Functions ---
  const isNearExpiry = (endDate: Date, status: DeliveryStatus): boolean => {
    if (status !== 'in-progress' && status !== 'scheduled') return false;
    const today = new Date();
    const daysRemaining = differenceInDays(endDate, today);
    return daysRemaining >= 0 && daysRemaining <= 3;
  };

  const calculateProgress = (completed: number, total: number): number => {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  };


  return (
    <TooltipProvider> {/* Ensure TooltipProvider wraps the component */}
      <div className="p-8">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>サーベイ配信一覧</CardTitle>
            <CardDescription>配信済みおよび配信予定のサーベイ状況を確認・管理します。</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters, Search, and Bulk Actions */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              {/* Search */}
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
                 {/* Status Filter */}
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
                  </SelectContent>
                </Select>

                {/* Refresh Button */}
                <Button variant="outline" size="icon" onClick={fetchData} disabled={isLoading}>
                   <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>

                {/* Bulk Actions (conditionally rendered) */}
                {selectedRows.size > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExtendDeadline(Array.from(selectedRows))}
                    >
                      <CalendarClock className="mr-1.5 h-4 w-4" />
                      期限延長 ({selectedRows.size})
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendReminder(Array.from(selectedRows))}
                    >
                      <Send className="mr-1.5 h-4 w-4" />
                      リマインダー ({selectedRows.size})
                    </Button>
                     {/*
                     <Button variant="destructive" size="sm" onClick={() => console.log('Bulk delete', selectedRows)}>
                       <Trash2 className="mr-1.5 h-4 w-4" />
                       削除 ({selectedRows.size})
                     </Button>
                     */}
                  </>
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
                    <TableHead onClick={() => handleSortChange('survey')} className="cursor-pointer hover:bg-muted/80">サーベイ名</TableHead>
                    <TableHead onClick={() => handleSortChange('targetGroup')} className="cursor-pointer hover:bg-muted/80">対象グループ</TableHead>
                    <TableHead onClick={() => handleSortChange('deliveryStartDate')} className="cursor-pointer hover:bg-muted/80">開始日</TableHead>
                    <TableHead onClick={() => handleSortChange('deliveryEndDate')} className="cursor-pointer hover:bg-muted/80">終了日</TableHead>
                    <TableHead onClick={() => handleSortChange('status')} className="cursor-pointer hover:bg-muted/80">ステータス</TableHead>
                    <TableHead onClick={() => handleSortChange('progress')} className="cursor-pointer hover:bg-muted/80">進捗</TableHead>
                    <TableHead>アクション</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        読み込み中...
                      </TableCell>
                    </TableRow>
                  ) : filteredAndSortedDeliveries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        該当するサーベイ配信が見つかりません。
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAndSortedDeliveries.map((delivery) => {
                      const statusInfo = getSurveyDeliveryStatusInfo(delivery.status);
                      const progress = calculateProgress(delivery.completedCount, delivery.totalDelivered);
                      const nearExpiry = isNearExpiry(delivery.deliveryEndDate, delivery.status);
                      const isExpired = delivery.status === 'expired' || (delivery.status !== 'completed' && isBefore(delivery.deliveryEndDate, new Date()));

                      return (
                        <TableRow
                          key={delivery.deliveryId}
                          data-state={selectedRows.has(delivery.deliveryId) ? 'selected' : undefined}
                          className={nearExpiry ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-muted/50'} // Add hover effect
                          // Make row clickable to navigate to survey details
                          // Note: Clicking interactive elements inside the row (checkbox, buttons) will stop propagation
                          // onClick={() => handleViewDetails(delivery.survey.id)} // Apply click handler to the row
                          // style={{ cursor: 'pointer' }} // Add pointer cursor to indicate clickability
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={selectedRows.has(delivery.deliveryId)}
                              onCheckedChange={(checked) => handleSelectRow(delivery.deliveryId, Boolean(checked))}
                              aria-label="行を選択"
                              onClick={(e) => e.stopPropagation()} // Prevent row click when clicking checkbox
                            />
                          </TableCell>
                          {/* Make Survey Title clickable */}
                          <TableCell
                             className="font-medium cursor-pointer hover:underline"
                             onClick={() => handleViewDetails(delivery.survey.id)}
                           >
                             {delivery.survey.title}
                           </TableCell>
                          <TableCell>{delivery.targetGroup}</TableCell>
                          <TableCell>{format(delivery.deliveryStartDate, 'yyyy/MM/dd')}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                               {format(delivery.deliveryEndDate, 'yyyy/MM/dd')}
                               {nearExpiry && !isExpired && (
                                 <Tooltip>
                                   <TooltipTrigger asChild>
                                     <AlertTriangle className="ml-1.5 h-4 w-4 text-yellow-600" />
                                   </TooltipTrigger>
                                   <TooltipContent>
                                     <p>期限間近</p>
                                   </TooltipContent>
                                 </Tooltip>
                               )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={progress} className="w-[100px]" aria-label={`${progress}% 完了`} />
                              <span className="text-xs text-muted-foreground">
                                {delivery.completedCount}/{delivery.totalDelivered}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}> {/* Prevent row click */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => handleViewDetails(delivery.survey.id)} title="詳細表示">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>サーベイ詳細・新規配信</p></TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" onClick={() => handleEdit(delivery.deliveryId)} title="配信編集">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent><p>この配信を編集 (未実装)</p></TooltipContent>
                              </Tooltip>
                              {/* Show reminder button only for non-completed/non-expired */}
                              {(delivery.status === 'in-progress' || delivery.status === 'scheduled') && !isExpired && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => handleSendReminder(delivery.deliveryId)} title="リマインダー送信">
                                      <Send className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent><p>リマインダー送信 (シミュレーション)</p></TooltipContent>
                                </Tooltip>
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
