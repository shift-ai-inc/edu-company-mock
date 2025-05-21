import React, { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronRight,
  Menu,
  // LayoutDashboard, // Removed Dashboard icon
  Users,
  Users2,
  ClipboardList,
  ListChecks,
  Send,
  // List as IconList, // Removed List icon (used by Survey)
  BarChart2,
  PieChart,
  UserCheck,
  TrendingUp,
  ShieldCheck,
  FileText,
  Building,
  Settings,
  LucideIcon,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Toaster } from "@/components/ui/toaster";
import { mockContracts } from '@/data/mockContracts'; // Import mockContracts

interface NavSubItem {
  label: string;
  path: string;
  icon?: LucideIcon;
}

interface NavItem {
  icon: LucideIcon;
  label: string;
  path?: string;
  basePath?: string;
  subItems?: NavSubItem[];
}

// Determine a default contract ID for the "契約管理" link
const defaultContractId = mockContracts.length > 0 ? mockContracts[0].id : 'no-contract-available';

const sidebarItems: NavItem[] = [
  // { icon: LayoutDashboard, label: 'ダッシュボード', path: '/dashboard' }, // Removed Dashboard
  { icon: Users, label: '利用者管理', path: '/general-users' },
  { icon: Users2, label: 'グループ管理', path: '/groups' },
  {
    icon: ClipboardList,
    label: 'アセスメント管理',
    basePath: '/assessments-root',
    subItems: [
      { label: 'アセスメント一覧', path: '/assessments', icon: ListChecks },
      { label: '配信管理', path: '/assessment-deliveries', icon: Send },
    ],
  },
  // { // Removed Survey Management
  //   icon: IconList, 
  //   label: 'サーベイ管理',
  //   basePath: '/surveys-root',
  //   subItems: [
  //     { label: 'サーベイ一覧', path: '/surveys', icon: IconList },
  //     { label: '配信管理', path: '/survey-deliveries', icon: Send },
  //   ],
  // },
  {
    icon: BarChart2,
    label: 'データ分析',
    basePath: '/results',
    subItems: [
      { label: '全体結果', path: '/results/overall', icon: PieChart },
      { label: 'グループ毎の結果', path: '/results/groups', icon: Users2 },
      { label: '企業一般ユーザーの結果', path: '/results/users', icon: UserCheck },
      { label: 'ベンチマークとの比較', path: '/results/benchmark', icon: TrendingUp },
    ],
  },
  { icon: ShieldCheck, label: '企業管理者管理', path: '/company-admins' },
  { icon: Building, label: '会社情報', path: '/company-info' },
  { icon: FileText, label: '契約管理', path: `/contracts/${defaultContractId}` }, // Updated path to first contract's detail
  { icon: Settings, label: '設定', path: '/settings' },
];

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [openDropdown, setOpenDropdown] = useState<string[]>(() =>
    sidebarItems
      .filter((item) => item.subItems && item.basePath)
      .map((item) => item.basePath!)
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isActiveParent = (basePath: string | undefined) => {
    if (!basePath) return false;
    const parentItem = sidebarItems.find(item => item.basePath === basePath);
    if (parentItem && parentItem.subItems) {
      return parentItem.subItems.some(subItem => isActiveSubItem(subItem.path));
    }
    return false;
  };

  const isActiveSubItem = (path: string) => { // path here is item.path from sidebarItems
    if (currentPath === path) return true;

    // For "契約管理", if its defined path starts with /contracts/ (e.g., /contracts/default-id),
    // make it active if currentPath is any /contracts/* page.
    if (path.startsWith('/contracts/') && currentPath.startsWith('/contracts/')) {
      return true;
    }
    
    // Handle parent active state if child route is active for other items
    if (path === "/assessments" && (currentPath.startsWith("/assessments/") && !currentPath.includes("/deliveries"))) {
      return true;
    }
    // if (path === "/surveys" && (currentPath.startsWith("/surveys/") && !currentPath.includes("/deliveries"))) { // Removed survey logic
    //   return true;
    // }
    if (path === "/general-users" && currentPath.startsWith("/general-users/")) return true;
    if (path === "/groups" && currentPath.startsWith("/groups/")) return true;
    if (path === "/company-admins" && currentPath.startsWith("/companies/") && currentPath.includes("/admins")) return true;
    if (path === "/company-info" && currentPath.startsWith("/companies/") && currentPath.includes("/info")) return true;
    
    return false;
  };

  const handleParentClick = (item: NavItem) => {
    if (item.subItems && item.basePath) {
      setOpenDropdown((prevOpen) =>
        prevOpen.includes(item.basePath!)
          ? prevOpen.filter((p) => p !== item.basePath)
          : [...prevOpen, item.basePath!]
      );
    } else if (item.path) {
      navigate(item.path);
      setIsMobileSidebarOpen(false);
    }
  };

  const handleSubItemClick = (path: string) => {
    navigate(path);
    setIsMobileSidebarOpen(false);
  };

  const isTakingAssessment = currentPath.startsWith("/assessments/take/");
  const isTakingSurvey = currentPath.startsWith("/surveys/take/");
  const showSidebar = !isTakingAssessment && !isTakingSurvey;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-semibold text-gray-900">企業管理者</h1>
      </div>
      <nav className="flex-grow p-4 overflow-y-auto">
        {sidebarItems.map((item, index) => (
          <div key={index} className="mb-1">
            <Button
              variant={
                (item.path && isActiveSubItem(item.path)) ||
                (item.basePath && isActiveParent(item.basePath) && item.subItems && openDropdown.includes(item.basePath))
                  ? "secondary"
                  : "ghost"
              }
              className="w-full justify-start"
              onClick={() => handleParentClick(item)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.label}
              {item.subItems && item.basePath && (
                <span className="ml-auto">
                  {openDropdown.includes(item.basePath) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </span>
              )}
            </Button>

            {item.subItems &&
              item.basePath &&
              openDropdown.includes(item.basePath) && (
                <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-4">
                  {item.subItems.map((subItem, subIndex) => (
                    <Button
                      key={subIndex}
                      variant={
                        isActiveSubItem(subItem.path) ? "secondary" : "ghost"
                      }
                      size="sm"
                      className={`w-full justify-start text-sm ${
                        isActiveSubItem(subItem.path)
                          ? "bg-gray-100 font-semibold"
                          : ""
                      }`}
                      onClick={() => handleSubItemClick(subItem.path)}
                    >
                      {subItem.icon && <subItem.icon className="mr-2 h-3 w-3 opacity-75" />}
                      {subItem.label}
                    </Button>
                  ))}
                </div>
              )}
          </div>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100"> {/* Outer container */}
      <div className="flex"> {/* Flex container for desktop sidebar + main content area */}
        
        {/* Desktop Sidebar: Conditionally rendered, sticky, fixed width */}
        {showSidebar && (
          <aside className="hidden md:flex w-64 h-screen bg-white shadow-lg flex-col print:hidden sticky top-0">
            <SidebarContent />
          </aside>
        )}

        {/* Main Content Wrapper: Grows to fill space, contains mobile header and scrollable main content */}
        <div className="flex-grow flex flex-col min-w-0"> {/* min-w-0 helps prevent flex item overflow issues */}
          
          {/* Mobile Header: Fixed position, overlays content on mobile */}
          <header className="md:hidden fixed top-0 left-0 right-0 bg-white shadow h-16 flex items-center justify-between px-4 z-20 print:hidden">
            <h1 className="text-lg font-semibold text-gray-900">企業管理者</h1>
            {showSidebar && ( /* Only show menu toggle if sidebar is active for the page */
              <Sheet
                open={isMobileSidebarOpen}
                onOpenChange={setIsMobileSidebarOpen}
              >
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <SidebarContent />
                </SheetContent>
              </Sheet>
            )}
          </header>

          {/* Scrollable Main Content Area */}
          <main
            className={`flex-grow pt-16 md:pt-0 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden print:pt-0 print:pl-0`}
          >
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default Layout;
