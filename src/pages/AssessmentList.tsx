import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { mockAvailableAssessments } from '@/data/mockAssessments'; // Assuming mock data exists
import { AvailableAssessment } from '@/types/assessment';
import { Search, Filter, ArrowUpDown, Clock, Users, Send, Info } from 'lucide-react'; // Added Info icon
// import AssessmentDetailDialog from '@/components/AssessmentDetailDialog'; // Keep if needed, but page is primary now
import CreateAssessmentDeliveryDialog from '@/components/CreateAssessmentDeliveryDialog'; // Import create delivery dialog
import { useToast } from "@/hooks/use-toast"; // Import useToast

// Define types for sorting and filtering
type SortKey = 'title' | 'estimatedTime' | 'category' | 'createdAt';
type SortDirection = 'asc' | 'desc';
type CategoryFilter = 'all' | 'スキル診断' | 'コンピテンシー評価' | 'エンゲージメントサーベイ' | 'その他';

export default function AssessmentList() {
  const [assessments, setAssessments] = useState<AvailableAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  // const [selectedAssessmentDetail, setSelectedAssessmentDetail] = useState<AvailableAssessment | null>(null); // Keep if dialog is used
  // const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false); // Keep if dialog is used
  const [assigningAssessment, setAssigningAssessment] = useState<AvailableAssessment | null>(null); // State for create dialog
  const [isCreateDeliveryDialogOpen, setIsCreateDeliveryDialogOpen] = useState(false); // State for create dialog visibility

  const { toast } = useToast(); // Initialize toast
  const navigate = useNavigate(); // Initialize navigate

  // Fetch mock data on mount
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAssessments(mockAvailableAssessments);
      setIsLoading(false);
    }, 50); // Short delay for loading simulation
  }, []);

  // Filtering and Sorting Logic
  const filteredAndSortedAssessments = useMemo(() => {
    let result = assessments.filter(assessment => {
      const matchesSearch =
        assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || assessment.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    result.sort((a, b) => {
      let compareA = a[sortKey];
      let compareB = b[sortKey];

      // Handle date sorting correctly
      if (sortKey === 'createdAt') {
        compareA = new Date(a.createdAt).getTime();
        compareB = new Date(b.createdAt).getTime();
      } else if (sortKey === 'estimatedTime') {
        // Ensure numeric comparison for time
        compareA = Number(a.estimatedTime);
        compareB = Number(b.estimatedTime);
      }


      let comparison = 0;
      if (compareA > compareB) {
        comparison = 1;
      } else if (compareA < compareB) {
        comparison = -1;
      }

      return sortDirection === 'desc' ? comparison * -1 : comparison;
    });

    return result;
  }, [assessments, searchTerm, categoryFilter, sortKey, sortDirection]);

  const handleSortChange = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  // Navigate to the details page
  const handleViewDetails = (assessmentId: string) => {
    navigate(`/assessments/${assessmentId}`);
  };

  // --- Delivery Creation Handling ---
  const handleConfigureDeliveryClick = (assessment: AvailableAssessment) => {
    setAssigningAssessment(assessment);
    setIsCreateDeliveryDialogOpen(true);
  };

  const handleDeliveryCreated = (details: any) => {
     console.log("Delivery creation successful (in parent list):", details);
     // Optionally, you could refresh the delivery list or navigate there
     // For now, just log it. The dialog handles the toast.
  };
  // --- End Delivery Creation Handling ---


  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        アセスメント一覧
      </h2>

      {/* Filters and Sorting Controls */}
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="検索 (タイトル, 説明, カテゴリ)..."
            className="pl-8 w-[300px] bg-white" // Added bg-white
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as CategoryFilter)}>
            <SelectTrigger className="w-[180px] bg-white"> {/* Added bg-white */}
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="カテゴリ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべてのカテゴリ</SelectItem>
              <SelectItem value="スキル診断">スキル診断</SelectItem>
              <SelectItem value="コンピテンシー評価">コンピテンシー評価</SelectItem>
              <SelectItem value="エンゲージメントサーベイ">エンゲージメントサーベイ</SelectItem>
              <SelectItem value="その他">その他</SelectItem>
            </SelectContent>
          </Select>

          {/* Sorting Buttons */}
          <Button variant="outline" size="sm" onClick={() => handleSortChange('title')}>
            タイトル
            {sortKey === 'title' && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />}
          </Button>
           <Button variant="outline" size="sm" onClick={() => handleSortChange('estimatedTime')}>
             所要時間
             {sortKey === 'estimatedTime' && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />}
           </Button>
           <Button variant="outline" size="sm" onClick={() => handleSortChange('createdAt')}>
             作成日
             {sortKey === 'createdAt' && <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />}
           </Button>
        </div>
      </div>

      {/* Assessment Cards Grid */}
      {isLoading ? (
        <div className="text-center py-10">読み込み中...</div>
      ) : filteredAndSortedAssessments.length === 0 ? (
        <div className="text-center py-10 text-gray-500">該当するアセスメントが見つかりません。</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedAssessments.map((assessment) => (
            <Card key={assessment.id} className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                   <CardTitle className="text-lg">{assessment.title}</CardTitle>
                   <Badge variant="secondary">{assessment.category}</Badge>
                </div>
                <CardDescription className="text-sm line-clamp-3 h-[60px]">{assessment.description}</CardDescription> {/* Fixed height */}
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-500" />
                    <span>所要時間: 約{assessment.estimatedTime}分</span>
                  </div>
                  {/* Placeholder for usage count - replace with real data */}
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-gray-500" />
                    <span>利用回数: {assessment.usageCount?.toLocaleString() ?? 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleViewDetails(assessment.id)}>
                  <Info className="mr-1.5 h-4 w-4" />
                  詳細
                </Button>
                <Button size="sm" onClick={() => handleConfigureDeliveryClick(assessment)}>
                  <Send className="mr-1.5 h-4 w-4" />
                  配信設定
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Assessment Detail Dialog (Optional - can be removed if page is sufficient) */}
      {/*
      <AssessmentDetailDialog
        assessment={selectedAssessmentDetail}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
      */}

       {/* Create Assessment Delivery Dialog */}
       <CreateAssessmentDeliveryDialog
         assessment={assigningAssessment}
         open={isCreateDeliveryDialogOpen}
         onOpenChange={setIsCreateDeliveryDialogOpen}
         onDeliveryCreated={handleDeliveryCreated}
       />

    </div>
  );
}
