import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AvailableAssessment, AssessmentCategory } from '@/types/assessment';
import { mockAvailableAssessments, getAvailableAssessments } from '@/data/mockAssessments';
import AssessmentDeliverySettingsDialog from '@/components/AssessmentDeliverySettingsDialog'; // Updated import
import { mockAssessmentDeliveries } from '@/data/mockAssessmentDeliveries'; // For mock creation
import { addDays, subDays } from 'date-fns'; // For mock creation
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, PlusCircle, Settings, ListChecks } from 'lucide-react';


const categoryDisplay: Record<AssessmentCategory, string> = {
  technical: "技術スキル",
  personality: "性格・適性",
  cognitive: "認知能力",
  language: "語学",
  others: "その他",
};

export default function AssessmentList() {
  const [assessments, setAssessments] = useState<AvailableAssessment[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<AvailableAssessment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<AssessmentCategory | 'all'>('all');
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [selectedAssessmentForDelivery, setSelectedAssessmentForDelivery] = useState<AvailableAssessment | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await getAvailableAssessments();
        setAssessments(data);
        setFilteredAssessments(data);
      } catch (error) {
        console.error("Failed to fetch assessments:", error);
        toast({
          title: "エラー",
          description: "アセスメント一覧の取得に失敗しました。",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  useEffect(() => {
    let result = assessments.filter(assessment => {
      const matchesSearch =
        assessment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assessment.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || assessment.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
    setFilteredAssessments(result);
  }, [searchTerm, categoryFilter, assessments]);

  const handleCardClick = (assessmentId: string) => {
    navigate(`/assessments/${assessmentId}`);
  };

  const handleOpenDeliveryModal = (assessment: AvailableAssessment, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent card click event
    setSelectedAssessmentForDelivery(assessment);
    setIsDeliveryModalOpen(true);
  };

  const handleDeliveryCreated = (deliveryDetails: any) => {
    // This is a mock creation. In a real app, this would likely involve an API call
    // and then potentially re-fetching deliveries or adding to a local store.
    console.log("Mock Delivery Created in AssessmentList:", deliveryDetails);

    // For demonstration, let's add it to the mockAssessmentDeliveries array
    // This won't automatically update the AssessmentDeliveryList page unless it re-fetches
    // or state is managed globally (e.g. via Zustand, Redux, or React Context).
    const newDelivery = {
      deliveryId: `del-${String(Date.now()).slice(-5)}`, // Generate a mock ID
      assessment: {
        id: deliveryDetails.assessmentId,
        title: deliveryDetails.assessmentTitle,
        estimatedTime: selectedAssessmentForDelivery?.estimatedTime || 0,
      },
      targetGroup: deliveryDetails.targetGroup,
      deliveryStartDate: new Date(deliveryDetails.deliveryStartDateTime),
      deliveryEndDate: new Date(deliveryDetails.deliveryEndDateTime),
      status: 'scheduled' as 'scheduled', // Initial status
      totalDelivered: 0, // Placeholder, might be updated by backend
      completedCount: 0,
      incompleteCount: 0,
      createdBy: '現在のユーザー (Mock)', // Placeholder
      createdAt: new Date(),
    };
    mockAssessmentDeliveries.push(newDelivery); // Adding to the shared mock data source

    // Toast is handled by the dialog itself
    setIsDeliveryModalOpen(false);
    setSelectedAssessmentForDelivery(null);
  };


  if (isLoading) {
    return <div className="p-8 text-center">読み込み中...</div>;
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">利用可能なアセスメント</h1>
        <Button onClick={() => navigate('/assessment-deliveries')}>
          <ListChecks className="mr-2 h-4 w-4" />
          配信状況一覧へ
        </Button>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="アセスメント名、説明で検索..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as AssessmentCategory | 'all')}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="カテゴリを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべてのカテゴリ</SelectItem>
            {Object.entries(categoryDisplay).map(([key, value]) => (
              <SelectItem key={key} value={key}>{value}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredAssessments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">該当するアセスメントが見つかりません。</p>
          <p className="text-sm text-gray-500 mt-2">検索条件やフィルターを変更してみてください。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <Card 
              key={assessment.id} 
              className="flex flex-col hover:shadow-lg transition-shadow duration-200 cursor-pointer bg-card"
              onClick={() => handleCardClick(assessment.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-semibold">{assessment.title}</CardTitle>
                  <Badge variant="secondary" className="whitespace-nowrap">
                    {categoryDisplay[assessment.category]}
                  </Badge>
                </div>
                <CardDescription className="text-xs text-gray-500">
                  約 {assessment.estimatedTime}分
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-700 line-clamp-3">{assessment.description}</p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full"
                  onClick={(e) => handleOpenDeliveryModal(assessment, e)}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  配信設定を行う
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {selectedAssessmentForDelivery && (
        <AssessmentDeliverySettingsDialog
          mode="create"
          assessmentForCreate={selectedAssessmentForDelivery}
          open={isDeliveryModalOpen}
          onOpenChange={setIsDeliveryModalOpen}
          onSave={handleDeliveryCreated}
        />
      )}
    </div>
  );
}
