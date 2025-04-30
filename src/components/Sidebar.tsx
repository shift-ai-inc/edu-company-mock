import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Users2, Settings, BarChart2, ClipboardList, FileText, ShieldCheck, History, Briefcase, Info } from 'lucide-react'; // Added Briefcase, Info icons

const Sidebar: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'ダッシュボード' },
    { path: '/general-users', icon: Users, label: '利用者管理' }, // Updated label/path
    { path: '/groups', icon: Users2, label: 'グループ管理' },
    { path: '/assessments', icon: ClipboardList, label: 'アセスメント一覧' },
    { path: '/assessment-deliveries', icon: FileText, label: '配信管理' },
    { path: '/company-admins', icon: ShieldCheck, label: '企業管理者管理' }, // Added Company Admin
    { path: '/contracts', icon: Briefcase, label: '契約管理' }, // Added Contract Management
    { path: '/permission-logs', icon: History, label: '権限変更履歴' }, // Added Permission Log
    { path: '/company-info', icon: Info, label: '会社情報' }, // Added Company Info
    { path: '/analytics', icon: BarChart2, label: 'データ分析' }, // Added Data Analytics
    // { path: '/companies', icon: Building, label: '企業管理' }, // Assuming this is for super admin
    // { path: '/survey', icon: FileText, label: 'アンケート' }, // Example
    { path: '/settings', icon: Settings, label: '設定' },
  ];

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-800">
        <Link to="/" className="flex items-center ps-2.5 mb-5">
          {/* Replace with your logo if you have one */}
          <span className="self-center text-xl font-semibold whitespace-nowrap text-white">Edu-Company</span>
        </Link>
        <ul className="space-y-2 font-medium">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center p-2 rounded-lg text-white hover:bg-gray-700 group ${
                  location.pathname.startsWith(item.path) && item.path !== '/' || location.pathname === item.path // Highlight parent paths too
                    ? 'bg-gray-700'
                    : ''
                }`}
              >
                <item.icon className="w-5 h-5 text-gray-400 transition duration-75 group-hover:text-white flex-shrink-0" />
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
