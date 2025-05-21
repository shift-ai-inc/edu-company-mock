import React from 'react'; // Removed useState, useEffect
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Users2,
  Settings,
  BarChart2,
  ClipboardList,
  ListChecks,
  Send,
  ShieldCheck,
  // History, // Removed as Permission Logs are commented out
  FileText,
  Building,
  // ChevronDown, // Removed
  // ChevronRight, // Removed
  LucideIcon,
  List,
  PieChart,
  UserCheck,
  TrendingUp,
  LogOut,
} from 'lucide-react';

// Define the type for navigation items, allowing for children
interface NavItem {
  id: string; // Unique ID for state management
  path?: string; // Optional: Parent items might not have a direct path
  icon: LucideIcon;
  label: string;
  children?: NavItem[];
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  // Removed useState for expandedItems
  // Removed toggleExpand function

  // Define navigation structure with hierarchy and updated icons
  const navItems: NavItem[] = [
    // { id: 'dashboard', path: '/dashboard', icon: LayoutDashboard, label: 'ダッシュボード' }, // Removed dashboard
    { id: 'users', path: '/general-users', icon: Users, label: '利用者管理' },
    { id: 'groups', path: '/groups', icon: Users2, label: 'グループ管理' },
    {
      id: 'assessments',
      icon: ClipboardList,
      label: 'アセスメント管理',
      children: [
        { id: 'assessment-list', path: '/assessments', icon: ListChecks, label: 'アセスメント一覧' },
        { id: 'assessment-deliveries', path: '/assessment-deliveries', icon: Send, label: '配信管理' },
      ],
    },
    // { // Removed surveys
    //   id: 'surveys',
    //   icon: ClipboardList,
    //   label: 'サーベイ管理',
    //   children: [
    //     { id: 'survey-list', path: '/surveys', icon: List, label: 'サーベイ一覧' },
    //     { id: 'survey-deliveries', path: '/survey-deliveries', icon: Send, label: '配信管理' },
    //   ],
    // },
		{
      id: 'analytics',
      icon: BarChart2,
      label: 'データ分析',
      children: [
        { id: 'overall-results', path: '/results/overall', icon: PieChart, label: '全体結果' },
        { id: 'group-results', path: '/results/groups', icon: Users2, label: 'グループ毎の結果' },
        { id: 'user-results', path: '/results/users', icon: UserCheck, label: '企業一般ユーザーの結果' },
        { id: 'benchmark', path: '/results/benchmark', icon: TrendingUp, label: 'ベンチマークとの比較' },
      ],
    },
    { id: 'company-admins', path: '/company-admins', icon: ShieldCheck, label: '企業管理者管理' },
    { id: 'contracts', path: '/contracts', icon: FileText, label: '契約管理' },
    // { id: 'permission-logs', path: '/permission-logs', icon: History, label: '権限変更履歴' },
    { id: 'company-info', path: '/company-info', icon: Building, label: '会社情報' },
    { id: 'settings', path: '/settings', icon: Settings, label: '設定' },
    { id: 'logout', path: '/login', icon: LogOut, label: 'ログアウト' },
  ];

  // Determine if a parent or its child is active for styling
   const isItemActive = (item: NavItem): boolean => {
     // Check if the item's own path matches
     if (item.path && location.pathname === item.path) {
        // Special case for logout: only active if path is exactly /login
       if (item.id === 'logout') {
           return location.pathname === '/login';
       }
       return true;
     }

     // Check if any child's path matches exactly or if the current path starts with a child's path
     if (item.children) {
        return item.children.some(child =>
            child.path && (location.pathname === child.path || location.pathname.startsWith(child.path + '/'))
        );
     }

     return false;
   };

   // Removed useEffect hook for auto-expansion

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-800 flex flex-col">
        <div>
          <Link to="/" className="flex items-center ps-2.5 mb-5">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">Edu-Company</span>
          </Link>
          <ul className="space-y-2 font-medium">
            {/* Render main nav items excluding logout */}
            {navItems.filter(item => item.id !== 'logout').map((item) => (
              <li key={item.id}>
                {item.children ? (
                  // Parent item with children - Render as a non-clickable header
                  <>
                    <div // Changed from button to div
                      className={`flex items-center w-full p-2 text-base text-white rounded-lg transition duration-75 group ${
                        isItemActive(item) ? 'bg-gray-700' : '' // Style parent if it or a child is active
                      }`}
                      // Removed onClick handler
                      // Removed aria attributes
                    >
                      <item.icon className={`w-5 h-5 text-gray-400 transition duration-75 group-hover:text-white flex-shrink-0 ${isItemActive(item) ? 'text-white' : ''}`} />
                      <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap truncate">{item.label}</span>
                      {/* Removed Chevron icon */}
                    </div>
                    {/* Child items - Always visible */}
                    <ul id={`dropdown-${item.id}`} className="py-1 space-y-1"> {/* Removed 'hidden' class logic */}
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            to={child.path!}
                            className={`flex items-center w-full p-2 text-white transition duration-75 rounded-lg pl-11 group hover:bg-gray-700 ${
                              location.pathname === child.path! ? 'bg-gray-600' : '' // Highlight active child
                            }`}
                            onClick={(e) => {
                              // Keep stopPropagation just in case, though parent is not clickable now
                              e.stopPropagation();
                            }}
                          >
                            <child.icon className="w-4 h-4 mr-2 text-gray-400 group-hover:text-white flex-shrink-0" />
                            <span className="truncate">{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  // Regular item without children
                  <Link
                    to={item.path!}
                    className={`flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group ${
                      location.pathname === item.path! ? 'bg-gray-700' : '' // Highlight active item
                    }`}
                  >
                    <item.icon className={`w-5 h-5 text-gray-400 transition duration-75 group-hover:text-white flex-shrink-0 ${location.pathname === item.path! ? 'text-white' : ''}`} />
                    <span className="ms-3 flex-1 truncate">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
        {/* Logout Item - Placed at the bottom */}
        <ul className="pt-4 mt-auto space-y-2 font-medium border-t border-gray-700">
          {navItems.filter(item => item.id === 'logout').map((item) => (
             <li key={item.id}>
               <Link
                 to={item.path!}
                 className={`flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group ${
                   isItemActive(item) ? 'bg-gray-700' : ''
                 }`}
               >
                 <item.icon className={`w-5 h-5 text-gray-400 transition duration-75 group-hover:text-white flex-shrink-0 ${isItemActive(item) ? 'text-white' : ''}`} />
                 <span className="ms-3 flex-1 truncate">{item.label}</span>
               </Link>
             </li>
           ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
