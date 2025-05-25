import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AssessmentDelivery, DeliveryStatus, getDeliveryStatusInfo } from '@/types/assessmentDelivery';
import { getAssessmentDeliveries } from '@/data/mockAssessmentDeliveries';
import { format, differenceInDays, isBefore, parseISO, addDays } from 'date-fns';
import { Search, Edit, MailWarning, CalendarClock, MoreHorizontal, Trash2, Send, Eye } from 'lucide-react'; // Added Eye icon
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NEAR_EXPIRY_DAYS = 3;

export default function AssessmentDeliveryList() {
  const [deliveries, setDeliveries] = useState<AssessmentDelivery[]>([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState<AssessmentDelivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<DeliveryStatus | 'all'>('all');
  const [selectedDeliveries, setSelectedDeliveries] = useState<Set<string>>(new Set());
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<AssessmentDelivery | null>(null);
  const [editedTargetGroup, setEditedTargetGroup] = useState('');
  const [editedEndDate, setEditedEndDate] = useState('');

  const { toast } = useToast();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getAssessmentDeliveries();
        const updatedData = data.map(d => {
          const now = new Date();
          let currentStatus = d.status;
          if (d.status === 'scheduled' && isBefore(d.deliveryStartDate, now)) {
            currentStatus = 'in-progress';
          }
          if (d.status !== 'completed' && isBefore(d.deliveryEndDate, now)) {
             if (d.completedCount < d.totalDelivered) {
                currentStatus = 'expired';
             } else {
                 currentStatus = 'completed';
             }
          }
          return { ...d, status: currentStatus };
        });
        setDeliveries(updatedData);
      } catch (error) {
        console.error("Failed to fetch assessment deliveries:", error);
        toast({
          title: "エラー",
          description: "配信リストの取得に失敗しました。",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  useEffect(() => {
    let result = deliveries.filter(delivery => {
      const matchesSearch =
        delivery.assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.targetGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || delivery.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
    setFilteredDeliveries(result);
  }, [searchTerm, statusFilter, deliveries]);

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    if (checked === true) {
      setSelectedDeliveries(new Set(filteredDeliveries.map(d => d.deliveryId)));
    } else {
      setSelectedDeliveries(new Set());
    }
  };

  const handleSelectRow = (deliveryId: string, checked: boolean) => {
    const newSelected = new Set(selectedDeliveries);
    if (checked) {
      newSelected.add(deliveryId);
    } else {
      newSelected.delete(deliveryId);
    }
    setSelectedDeliveries(newSelected);
  };

  const isAllSelected = filteredDeliveries.length > 0 && selectedDeliveries.size === filteredDeliveries.length;
  const isIndeterminate = selectedDeliveries.size > 0 && selectedDeliveries.size < filteredDeliveries.length;

  const handleEditClick = (delivery: AssessmentDelivery) => {
    setEditingDelivery(delivery);
    setEditedTargetGroup(delivery.targetGroup);
    setEditedEndDate(format(delivery.deliveryEndDate, 'yyyy-MM-dd'));
    setShowEditDialog(true);
  };

  const handleSaveChanges = () => {
    if (!editingDelivery) return;
    setDeliveries(prev => prev.map(d =>
      d.deliveryId === editingDelivery.deliveryId
        ? { ...d, targetGroup: editedTargetGroup, deliveryEndDate: parseISO(editedEndDate + 'T00:00:00') }
        : d
    ));
    toast({
      title: "成功",
      description: `配信「${editingDelivery.assessment.title}」の設定を更新しました。(Mock)`,
    });
    setShowEditDialog(false);
    setEditingDelivery(null);
  };

  const handleSendReminder = (deliveryId: string, assessmentTitle: string) => {
    console.log(`Sending reminder (mock) for: ${assessmentTitle} (ID: ${deliveryId})`);
    toast({
      title: "リマインダー送信 (Mock)",
      description: `「${assessmentTitle}」の未完了者にリマインダーを送信しました。`,
    });
  };

   const handleBulkSendReminders = () => {
    if (selectedDeliveries.size === 0) return;
    const selectedTitles = deliveries
      .filter(d => selectedDeliveries.has(d.deliveryId))
      .map(d => d.assessment.title);
    console.log(`Sending bulk reminders (mock) for IDs: ${Array.from(selectedDeliveries).join(', ')}`);
    toast({
      title: "一括リマインダー送信 (Mock)",
      description: `${selectedDeliveries.size}件の配信にリマインダーを送信しました: ${selectedTitles.join(', ')}`,
    });
    setSelectedDeliveries(new Set());
  };

  const handleBulkExtendDeadline = () => {
     if (selectedDeliveries.size === 0) return;
     const extensionDays = 7;
     console.log(`Extending deadline by ${extensionDays} days (mock) for IDs: ${Array.from(selectedDeliveries).join(', ')}`);
     setDeliveries(prev => prev.map(d =>
        selectedDeliveries.has(d.deliveryId)
        ? { ...d, deliveryEndDate: addDays(d.deliveryEndDate, extensionDays), status: d.status === 'expired' ? 'in-progress' : d.status }
        : d
     ));
     toast({
       title: "一括期限延長 (Mock)",
       description: `${selectedDeliveries.size}件の配信の期限を${extensionDays}日間延長しました。`,
     });
     setSelectedDeliveries(new Set());
   };

   const handleBulkDelete = () => {
     if (selectedDeliveries.size === 0) return;
     console.log(`Deleting deliveries (mock) for IDs: ${Array.from(selectedDeliveries).join(', ')}`);
     setDeliveries(prev => prev.filter(d => !selectedDeliveries.has(d.deliveryId)));
     toast({
       title: "一括削除 (Mock)",
       description: `${selectedDeliveries.size}件の配信を削除しました。`,
       variant: "destructive"
     });
     setSelectedDeliveries(new Set());
   };

  const isNearExpiry = (endDate: Date, status: DeliveryStatus): boolean => {
    if (status !== 'in-progress') return false;
    const daysRemaining = differenceInDays(endDate, new Date());
    return daysRemaining >= 0 && daysRemaining <= NEAR_EXPIRY_DAYS;
  };

  const handleRowClick = (deliveryId: string) => {
    navigate(`/assessment-deliveries/${deliveryId}`);
  };

  return (
    <div className="p-4 sm:p-8">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>
            <h2 className="text-2xl font-semibold text-gray-900">
              アセスメント配信一覧
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="検索 (タイトル, 対象, 作成者)..."
                  className="pl-8 w-[250px] sm:w-[300px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as DeliveryStatus | 'all')}>
                <SelectTrigger className="w-[180px]">
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
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkSendReminders}
                disabled={selectedDeliveries.size === 0}
              >
                <MailWarning className="mr-1.5 h-4 w-4" />
                リマインダー送信
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkExtendDeadline}
                disabled={selectedDeliveries.size === 0}
              >
                <CalendarClock className="mr-1.5 h-4 w-4" />
                期限延長
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={selectedDeliveries.size === 0}
              >
                <Trash2 className="mr-1.5 h-4 w-4" />
                削除
              </Button>
            </div>
          </div>

          <div className="border rounded-md overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead padding="checkbox" className="w-[50px]">
                    <Checkbox
                      checked={isAllSelected || (isIndeterminate ? 'indeterminate' : false)}
                      onCheckedChange={handleSelectAll}
                      aria-label="すべての行を選択"
                    />
                  </TableHead>
                  <TableHead>アセスメント名</TableHead>
                  <TableHead>対象グループ/部署</TableHead>
                  <TableHead>配信期間</TableHead>
                  <TableHead>ステータス</TableHead>
                  <TableHead>進捗 (配信/完了/未完了)</TableHead>
                  <TableHead className="text-right">アクション</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      読み込み中...
                    </TableCell>
                  </TableRow>
                ) : filteredDeliveries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      該当する配信が見つかりません。
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDeliveries.map((delivery) => {
                    const statusInfo = getDeliveryStatusInfo(delivery.status);
                    const nearExpiry = isNearExpiry(delivery.deliveryEndDate, delivery.status);
                    const isSelected = selectedDeliveries.has(delivery.deliveryId);

                    return (
                      <TableRow
                        key={delivery.deliveryId}
                        data-state={isSelected ? "selected" : ""}
                        className={`${nearExpiry ? 'bg-yellow-50 hover:bg-yellow-100' : 'hover:bg-muted/50'} cursor-pointer`}
                        onClick={() => handleRowClick(delivery.deliveryId)} // Make row clickable
                      >
                        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}> {/* Stop propagation for checkbox click */}
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleSelectRow(delivery.deliveryId, !!checked)}
                            aria-label="行を選択"
                          />
                        </TableCell>
                        <TableCell className="font-medium">{delivery.assessment.title}</TableCell>
                        <TableCell>{delivery.targetGroup}</TableCell>
                        <TableCell>
                          {format(delivery.deliveryStartDate, 'yyyy/MM/dd')} - {format(delivery.deliveryEndDate, 'yyyy/MM/dd')}
                          {nearExpiry && <Badge variant="destructive" className="ml-2 animate-pulse">期限間近</Badge>}
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
                        </TableCell>
                        <TableCell>
                          {delivery.totalDelivered} / {delivery.completedCount} / {delivery.incompleteCount}
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}> {/* Stop propagation for actions cell */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">アクションを開く</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>アクション</DropdownMenuLabel>
                               <DropdownMenuItem onClick={() => handleRowClick(delivery.deliveryId)}> {/* Keep consistent with row click */}
                                <Eye className="mr-2 h-4 w-4" />
                                詳細を見る
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditClick(delivery)}>
                                <Edit className="mr-2 h-4 w-4" />
                                編集
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleSendReminder(delivery.deliveryId, delivery.assessment.title)}
                                disabled={delivery.status === 'completed' || delivery.status === 'scheduled'}
                              >
                                <Send className="mr-2 h-4 w-4" />
                                リマインダー送信
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-600 focus:text-red-600 focus:bg-red-100"
                                    onClick={() => {
                                        console.log(`Deleting single delivery (mock): ${delivery.deliveryId}`);
                                        setDeliveries(prev => prev.filter(d => d.deliveryId !== delivery.deliveryId));
                                        toast({ title: "削除 (Mock)", description: `配信「${delivery.assessment.title}」を削除しました。`, variant: "destructive"});
                                    }}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    削除
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>配信設定の編集</DialogTitle>
            <DialogDescription>
              「{editingDelivery?.assessment.title}」の配信設定を変更します。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="targetGroup" className="text-right">
                対象グループ
              </Label>
              <Input
                id="targetGroup"
                value={editedTargetGroup}
                onChange={(e) => setEditedTargetGroup(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                終了日
              </Label>
              <Input
                id="endDate"
                type="date"
                value={editedEndDate}
                onChange={(e) => setEditedEndDate(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>キャンセル</Button>
            <Button onClick={handleSaveChanges}>変更を保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
