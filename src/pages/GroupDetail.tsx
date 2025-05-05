import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { sampleGroups, Group } from './GroupManagement'; // Import mock data and type
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Building, FolderTree, Palette, Type, Settings, Pencil, Trash2, UserPlus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Helper to get group type name
const getGroupTypeName = (type: string) => {
  switch (type) {
    case "department": return "部署";
    case "team": return "チーム";
    case "project": return "プロジェクト";
    default: return type;
  }
};

// Helper to get group icon
const getGroupIcon = (type: string) => {
  switch (type) {
    case "department": return <Building className="h-5 w-5 mr-2 text-gray-600" />;
    case "team": return <Users className="h-5 w-5 mr-2 text-gray-600" />;
    case "project": return <FolderTree className="h-5 w-5 mr-2 text-gray-600" />;
    default: return <Users className="h-5 w-5 mr-2 text-gray-600" />;
  }
};

// --- Edit Group Dialog State ---
// Use Partial<Group> to allow initializing with potentially missing fields if needed
// Or define a specific EditGroupState matching the form fields
interface EditGroupState {
  name: string;
  type: Group["type"] | "";
  parentId: string; // Store as string ("none" or group ID)
  description: string;
  colorCode: string;
  abbreviation: string;
  settings: string;
}

export default function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editGroupData, setEditGroupData] = useState<EditGroupState | null>(null);

  // Find the group from the mock data using the ID from the URL
  // Note: In a real app, this would be an API call.
  // groupId from URL is string, group.id is number in sampleGroups
  // Use let to allow potential updates after edit simulation
  let group = sampleGroups.find(g => g.id.toString() === groupId);

  // Initialize edit form data when dialog opens or group data changes
  useEffect(() => {
    if (group && isEditDialogOpen) {
      setEditGroupData({
        name: group.name,
        type: group.type,
        parentId: group.parentId?.toString() ?? "none",
        description: group.description,
        colorCode: group.colorCode ?? "#cccccc",
        abbreviation: group.abbreviation ?? "",
        settings: group.settings ?? "",
      });
    } else {
      setEditGroupData(null); // Reset when dialog closes or group not found
    }
  }, [group, isEditDialogOpen]);


  if (!group) {
    // Group might have been deleted, show message
    return (
      <div className="p-8 text-center">
        <p className="text-orange-600">グループが見つからないか、削除された可能性があります。</p>
        <Button variant="outline" onClick={() => navigate('/groups')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> グループ一覧に戻る
        </Button>
      </div>
    );
  }

  const parentGroup = group.parentId ? sampleGroups.find(g => g.id === group.parentId) : null;

  // --- Delete Handler ---
  const handleDelete = () => {
    if (!group) return; // Should not happen if button is rendered, but good practice

    if (window.confirm(`グループ「${group.name}」を削除してもよろしいですか？\nこの操作は元に戻せません。（シミュレーション）`)) {
      // Find index in the original mock array
      const index = sampleGroups.findIndex(g => g.id === group!.id);
      if (index > -1) {
        // Simulate deletion by removing from the imported array
        // WARNING: This mutates the imported array directly.
        // This change won't reflect in GroupManagement list without refresh/state management.
        sampleGroups.splice(index, 1);
        console.log("Deleted group from mock data:", group.id);

        toast({
          title: "削除成功（シミュレーション）",
          description: `グループ「${group.name}」が削除されました。一覧画面の更新は反映されません。`,
        });
        // Navigate back to the list after deletion
        navigate('/groups');
      } else {
         toast({
          title: "削除失敗",
          description: `グループ「${group.name}」が見つかりませんでした。`,
          variant: "destructive",
        });
      }
    }
  };

  // --- Edit Handlers ---
  const handleEditClick = () => {
    if (!group) return;
    // Initial data is set via useEffect when isEditDialogOpen becomes true
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditGroupData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleEditSelectChange = (name: keyof EditGroupState) => (value: string) => {
    setEditGroupData((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleUpdateGroup = () => {
    if (!group || !editGroupData) return;

    // Basic Validation
    if (!editGroupData.name || !editGroupData.type) {
      toast({
        title: "エラー",
        description: "グループ名とタイプは必須です。",
        variant: "destructive",
      });
      return;
    }

    // Find index in the original mock array
    const index = sampleGroups.findIndex(g => g.id === group!.id);
    if (index > -1) {
      // Simulate update by modifying the imported array
      // WARNING: This mutates the imported array directly.
      // This change won't reflect in GroupManagement list without refresh/state management.
      const updatedGroup: Group = {
        ...sampleGroups[index], // Keep original ID and other non-editable fields
        name: editGroupData.name,
        type: editGroupData.type as Group["type"],
        parentId: editGroupData.parentId === "none" ? null : parseInt(editGroupData.parentId, 10),
        description: editGroupData.description,
        colorCode: editGroupData.colorCode,
        abbreviation: editGroupData.abbreviation,
        settings: editGroupData.settings,
        // memberCount and createdAt are not typically edited here
      };
      sampleGroups[index] = updatedGroup;
      console.log("Updated group in mock data:", updatedGroup);

      // Force a re-render of this detail page by navigating to the same URL?
      // Or ideally, use state management. For now, just close dialog.
      // To see changes immediately on *this* page, we could update local state,
      // but `group` is derived directly from the (now mutated) `sampleGroups`.
      // A simple re-fetch/re-find might work if the mutation is synchronous.
      // Let's try forcing a re-render by navigating: navigate(0) or similar hack.
      // Better: just close the dialog and inform the user.

      toast({
        title: "更新成功（シミュレーション）",
        description: `グループ「${updatedGroup.name}」の情報が更新されました。一覧画面の更新は反映されません。`,
      });
      setIsEditDialogOpen(false);
      // Force re-render of this component by navigating to self - HACKY
      // navigate(`/groups/${groupId}`, { replace: true }); // This might cause issues
      // Better to just let the user see the updated data when they navigate back or refresh.
      // Or update a local state variable if we introduce one for 'group'.
      // For now, we rely on the fact that `group` is re-calculated on render.

    } else {
       toast({
        title: "更新失敗",
        description: `グループ「${group.name}」が見つかりませんでした。`,
        variant: "destructive",
      });
    }
  };
  // --- End Edit Handlers ---


  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <Button variant="outline" size="sm" onClick={() => navigate('/groups')} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        グループ一覧に戻る
      </Button>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center mb-1">
                {getGroupIcon(group.type)}
                <CardTitle className="text-2xl font-bold">{group.name}</CardTitle>
                {group.abbreviation && (
                  <Badge variant="secondary" className="ml-2">{group.abbreviation}</Badge>
                )}
                {group.colorCode && (
                  <span
                    className="h-5 w-5 rounded-full inline-block border border-gray-300 ml-2"
                    style={{ backgroundColor: group.colorCode }}
                    title={`カラーコード: ${group.colorCode}`}
                  ></span>
                )}
              </div>
              <CardDescription>
                {getGroupTypeName(group.type)} - 作成日: {group.createdAt}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {/* Edit Button triggers Dialog */}
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={handleEditClick}>
                    <Pencil className="mr-2 h-4 w-4" /> 編集
                  </Button>
                </DialogTrigger>
                {/* Edit Dialog Content */}
                <DialogContent className="sm:max-w-[650px]">
                  <DialogHeader>
                    <DialogTitle>グループ情報の編集</DialogTitle>
                    <DialogDescription>
                      グループ「{group.name}」の情報を変更します。
                    </DialogDescription>
                  </DialogHeader>
                  {editGroupData && (
                    <div className="grid gap-6 py-4">
                      {/* Form fields similar to Create Dialog, pre-filled */}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-group-name">グループ名 <span className="text-red-500">*</span></Label>
                          <Input
                            id="edit-group-name"
                            name="name"
                            value={editGroupData.name}
                            onChange={handleEditInputChange}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-group-type">グループタイプ <span className="text-red-500">*</span></Label>
                          <Select
                            name="type"
                            value={editGroupData.type}
                            onValueChange={handleEditSelectChange("type")}
                          >
                            <SelectTrigger id="edit-group-type">
                              <SelectValue placeholder="タイプを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="department">部署</SelectItem>
                              <SelectItem value="team">チーム</SelectItem>
                              <SelectItem value="project">プロジェクト</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-parent-group">親グループ (オプション)</Label>
                          <Select
                            name="parentId"
                            value={editGroupData.parentId}
                            onValueChange={handleEditSelectChange("parentId")}
                          >
                            <SelectTrigger id="edit-parent-group">
                              <SelectValue placeholder="親グループを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">なし</SelectItem>
                              {sampleGroups
                                .filter(g => g.id !== group?.id && g.type === 'department') // Prevent self-parenting, allow only departments
                                .map((g) => (
                                <SelectItem key={g.id} value={g.id.toString()}>
                                  {g.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                       <div className="space-y-2">
                        <Label htmlFor="edit-description">説明</Label>
                        <Textarea
                          id="edit-description"
                          name="description"
                          value={editGroupData.description}
                          onChange={handleEditInputChange}
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                          <Label htmlFor="edit-abbreviation">略称</Label>
                          <Input
                            id="edit-abbreviation"
                            name="abbreviation"
                            value={editGroupData.abbreviation}
                            onChange={handleEditInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-colorCode">カラーコード</Label>
                           <div className="flex items-center gap-2">
                             <Input
                               id="edit-colorCode"
                               name="colorCode"
                               type="color"
                               value={editGroupData.colorCode}
                               onChange={handleEditInputChange}
                               className="w-10 h-9 p-1"
                             />
                             <Input
                               type="text"
                               value={editGroupData.colorCode}
                               onChange={handleEditInputChange}
                               name="colorCode"
                               placeholder="#rrggbb"
                               className="flex-1"
                             />
                           </div>
                        </div>
                      </div>
                       <div className="space-y-2">
                          <Label htmlFor="edit-settings">グループ特有設定 (プレースホルダー)</Label>
                          <Textarea
                            id="edit-settings"
                            name="settings"
                            value={editGroupData.settings}
                            onChange={handleEditInputChange}
                            rows={3}
                            disabled // Keep disabled until fully implemented
                          />
                           <p className="text-xs text-muted-foreground">
                             この機能は現在開発中です。
                           </p>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      キャンセル
                    </Button>
                    <Button onClick={handleUpdateGroup} disabled={!editGroupData}>
                      変更を保存
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete Button */}
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" /> 削除
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Separator />

          {/* Basic Info Section (Displays current group data) */}
          <div>
            <h3 className="text-lg font-semibold mb-3">基本情報</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">グループ名:</span> {group.name}
              </div>
              <div>
                <span className="font-medium text-gray-600">タイプ:</span> {getGroupTypeName(group.type)}
              </div>
              <div>
                <span className="font-medium text-gray-600">親グループ:</span>{' '}
                {parentGroup ? (
                  <Link to={`/groups/${parentGroup.id}`} className="text-blue-600 hover:underline">
                    {parentGroup.name}
                  </Link>
                ) : (
                  '-'
                )}
              </div>
              <div>
                <span className="font-medium text-gray-600">作成日:</span> {group.createdAt}
              </div>
              {group.abbreviation && (
                <div>
                  <span className="font-medium text-gray-600 flex items-center"><Type className="h-4 w-4 mr-1"/>略称:</span> {group.abbreviation}
                </div>
              )}
              {group.colorCode && (
                <div>
                  <span className="font-medium text-gray-600 flex items-center"><Palette className="h-4 w-4 mr-1"/>カラーコード:</span>
                  <span className="inline-block align-middle h-4 w-4 rounded-sm border border-gray-300 ml-1 mr-1" style={{ backgroundColor: group.colorCode }}></span>
                  {group.colorCode}
                </div>
              )}
            </div>
            {group.description && (
              <div className="mt-4">
                <span className="font-medium text-gray-600">説明:</span>
                <p className="text-sm text-gray-700 whitespace-pre-wrap mt-1">{group.description}</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Members Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">メンバー ({group.memberCount}名)</h3>
              <Button variant="outline" size="sm" disabled> {/* TODO: Implement Member Management */}
                <UserPlus className="mr-2 h-4 w-4" /> メンバー管理
              </Button>
            </div>
            {/* TODO: Add member list table or component here */}
            <div className="border rounded-md p-4 text-center text-gray-500 text-sm">
              メンバー表示機能は未実装です。
            </div>
          </div>

          <Separator />

          {/* Settings Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center"><Settings className="h-5 w-5 mr-2"/>グループ設定</h3>
            {group.settings ? (
              <pre className="text-sm bg-gray-100 p-3 rounded-md overflow-x-auto">
                <code>{group.settings}</code> {/* Display settings string */}
              </pre>
            ) : (
              <p className="text-sm text-gray-500">特有の設定はありません。</p>
            )}
             <p className="text-xs text-muted-foreground mt-2">
               （このセクションは将来的に詳細な設定項目を表示・編集する場所になります）
             </p>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
