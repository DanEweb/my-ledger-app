import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronsLeft, ChevronsRight, PlusCircle, CreditCard, Home, ShoppingCart, Utensils, Zap, Repeat, Target, Settings, LayoutDashboard, Wallet, FileOutput, Landmark, Trophy, Gift, Sparkles, User, Tag, TrendingUp, TrendingDown, CircleDollarSign, Sun, Moon, Search, X } from 'lucide-react';

// Firebase 연동을 위해 firebase.js 파일을 생성하고 아래 2줄의 주석을 해제하세요.
// import { db } from './firebase'; 
// import { doc, collection, onSnapshot, addDoc } from 'firebase/firestore';

// --- 다국어 지원 / Multi-language Support ---
const translations = {
  ko: {
    appName: '가계부', myLedger: '내 가계부', adminMode: '관리자 모드', dashboard: '대시보드', assets: '자산 관리', recurring: '정기 거래', budgets: '예산', goals: '재무 목표', challenges: '챌린지', reports: '리포트', settings: '설정', myCoupons: '내 쿠폰함',
    theme: '테마', lightMode: '라이트 모드', darkMode: '다크 모드',
    dashboardWelcome: '안녕하세요, {name}님! 자산 현황을 요약해 드릴게요.', addTransaction: '거래 추가', totalAssets: '총 자산', monthlyIncome: '이번 달 수입', monthlyExpenses: '이번 달 지출', recentTransactions: '최근 거래 내역', searchPlaceholder: '거래 내역 검색...',
    assetsTitle: '자산 관리', assetsDesc: '전체 자산 목록과 현황입니다.', addAsset: '새 자산 추가',
    recurringTitle: '정기 거래', recurringDesc: '매월 반복되는 수입/지출 목록입니다.', addRecurring: '새 정기 거래 추가', nextPayment: '다음 결제일', budgetsTitle: '예산 관리', budgetsDesc: '카테고리별 예산을 설정하고 지출을 관리하세요.', addBudget: '새 예산 추가', spent: '지출', remaining: '남음', goalsTitle: '재무 목표', goalsDesc: '목표를 설정하고 달성 과정을 추적해 보세요.', addGoal: '새 목표 추가', goalAmount: '목표 금액', achieved: '달성!',
    challengesTitle: '저축 챌린지 & 보상', challengesDesc: '챌린지를 달성하고 직접 설정한 보상을 획득하세요!', couponManagement: '보상 쿠폰 관리', couponManagementDesc: '챌린지 성공 시 받을 나만의 보상을 설정하세요.', challenge: '챌린지', rewardCoupon: '보상 쿠폰', couponNamePlaceholder: '예: 아이스크림 교환권', claimReward: '보상 받기', claimed: '획득 완료', myCouponsTitle: '내 쿠폰함', myCouponsDesc: '챌린지를 통해 획득한 보상 쿠폰 목록입니다.', useCoupon: '사용하기', used: '사용 완료', noCoupons: '아직 획득한 쿠폰이 없어요. 챌린지에 도전해보세요!',
    reportsTitle: '리포트', reportsDesc: '금융 데이터를 심층적으로 분석하고 확인하세요.', incomeExpenseTrend: '월별 수입/지출 추이', income: '수입', expense: '지출', settingsTitle: '설정', settingsDesc: '계정 정보, 언어 및 데이터를 관리합니다.', profile: '프로필', name: '이름', email: '이메일', save: '저장', dataManagement: '데이터 관리', dataDesc: '데이터를 백업하거나 다른 기기에서 가져올 수 있습니다.', exportCSV: '내보내기 (CSV)', importCSV: '가져오기 (CSV)', language: '언어',
    recurringTag: '#정기결제',
    newTransaction: '새 거래', transactionType: '거래 종류', date: '날짜', description: '내용', category: '카테고리', amount: '금액', asset: '자산', tags: '태그 (쉼표로 구분)', cancel: '취소', add: '추가',
    newAsset: '새 자산', assetName: '자산 이름', assetType: '자산 종류', initialBalance: '초기 잔액', bank: '은행', card: '카드', cash: '현금',
    newRecurring: '새 정기 거래', recurringName: '항목 이름', paymentCycle: '결제 주기', monthly: '매월', nextDueDate: '다음 결제 예정일',
    newBudget: '새 예산', budgetAmount: '예산 금액',
    newGoal: '새 목표', goalName: '목표 이름', targetAmount: '목표 금액',
    loading: '데이터를 불러오는 중...', select: '선택하세요',
  },
  ja: { /* ... 일본어 번역 생략 ... */ }
};
const getChallengeName = (challenge, lang) => (challenge.name || {})[lang] || (challenge.name || {})['ko'];
const allChallenges = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: { ko: `챌린지 #${i + 1}`, ja: `チャレンジ #${i + 1}` }, target: (i % 5 + 1) * 5, progress: 0, isAchieved: false }));
const CATEGORIES = ['급여', '용돈', '식비', '쇼핑', '교통', '주거', '구독', '의료', '교육', '경조사', '기타'];

// --- 임시 목업 데이터 (Firebase 연결 전 테스트용) ---
const initialAppData = {
  admin: { 
    id: 'admin', name: '김민준 (관리자)', email: 'admin@example.com', 
    assets: [{ id: 'asset-1', name: '관리자 은행', balance: 50000000, type: 'bank'}], 
    transactions: [{id: 'tx-1', date: '2025-06-25', description: '월급', category: '급여', amount: 5000000, type: 'income', assetId: 'asset-1'}], 
    recurringTransactions: [], budgets: [], goals: [], userCoupons: [], challenges: []
  },
  invitedUser1: { 
    id: 'user1', name: '이수진', email: 'user1@example.com', 
    assets: [{ id: 'asset-2', name: '수진님 계좌', balance: 500000, type: 'bank'}], 
    transactions: [{id: 'tx-2', date: '2025-06-24', description: '문구류 구매', category: '쇼핑', amount: 15000, type: 'expense', assetId: 'asset-2'}], 
    recurringTransactions: [], budgets: [], goals: [], userCoupons: [], challenges: [] 
  }
};


// --- Helper Components ---
const formatCurrency = (value) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
const getIcon = (category) => { const Icon = CATEGORY_ICONS[category] || Zap; return <Icon className="h-5 w-5" />; };
const getAssetIcon = (type) => { const Icon = ASSET_ICONS[type] || Wallet; return <Icon className="h-6 w-6" />; };
const CATEGORY_ICONS = { '쇼핑': ShoppingCart, '식비': Utensils, '급여': Wallet, '교통': CreditCard, '주거': Home, '구독': Repeat, '기타': Zap };
const ASSET_ICONS = { 'bank': Landmark, 'card': CreditCard, 'cash': Wallet };
const CATEGORY_COLORS = { '쇼핑': 'bg-pink-100 text-pink-600', '식비': 'bg-orange-100 text-orange-600', '급여': 'bg-green-100 text-green-600', '교통': 'bg-blue-100 text-blue-600', '주거': 'bg-purple-100 text-purple-600', '구독': 'bg-indigo-100 text-indigo-600', '기타': 'bg-gray-100 text-gray-600', };
const KPICard = ({ title, value, icon, bgColor, valueColor, showPlus = false }) => ( <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:shadow-lg hover:scale-105"> <div className={`p-3 rounded-full ${bgColor}`}>{icon}</div> <div> <h3 className="text-slate-500 dark:text-slate-400 text-md font-medium">{title}</h3> <p className={`text-2xl font-bold ${valueColor}`}>{showPlus && value > 0 ? '+' : ''}{formatCurrency(value)}</p> </div> </div> );

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEsc = (event) => { if (event.keyCode === 27) onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-all" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-full"><X size={20} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};


// --- Page Components ---
const Sidebar = ({ activeView, setActiveView, isCollapsed, setIsCollapsed, t, currentUser, setCurrentUser }) => {
    const navItems = [
        { id: 'dashboard', label: t.dashboard, icon: <LayoutDashboard /> },
        { id: 'assets', label: t.assets, icon: <Landmark /> },
        { id: 'recurring', label: t.recurring, icon: <Repeat /> },
        { id: 'budgets', label: t.budgets, icon: <Wallet /> },
        { id: 'goals', label: t.goals, icon: <Target /> },
        // Challenges, Coupons, Reports, Settings can be added back here
    ];
    return (
        <aside className={`relative bg-slate-800 text-slate-100 p-4 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}>
            <div className={`flex items-center mb-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && <h1 className="text-2xl font-bold text-white">{t.appName}</h1>}
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg hover:bg-slate-700">
                    {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
                </button>
            </div>
            <div className="border-t border-b border-slate-700 py-4 mb-4">
                <button onClick={() => setCurrentUser('admin')} className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${currentUser?.id === 'admin' ? 'bg-sky-600' : 'hover:bg-slate-700'}`}>
                    <User className="h-5 w-5 shrink-0" />
                    {!isCollapsed && <span className="ml-4 font-bold">{t.myLedger}</span>}
                </button>
                <div className="mt-4">
                    <h3 className={`px-4 text-xs font-semibold uppercase text-slate-400 ${isCollapsed ? 'text-center' : ''}`}>{!isCollapsed && t.adminMode}</h3>
                    <div className="mt-2">
                        <button onClick={() => setCurrentUser('invitedUser1')} className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${currentUser?.id === 'invitedUser1' ? 'bg-sky-600' : 'hover:bg-slate-700'}`}>
                            <User className="h-5 w-5 shrink-0" />
                            {!isCollapsed && <span className="ml-4">이수진</span>}
                        </button>
                    </div>
                </div>
            </div>
            <nav className="flex-grow overflow-y-auto">
                <ul className="space-y-2">{navItems.map(item => (<li key={item.id}><button onClick={() => setActiveView(item.id)} className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeView === item.id ? 'bg-teal-500' : 'hover:bg-slate-700'} ${isCollapsed ? 'justify-center' : ''}`}><span className="shrink-0">{item.icon}</span>{!isCollapsed && <span className="ml-4 font-medium">{item.label}</span>}</button></li>))}</ul>
            </nav>
        </aside>
    );
};
const Dashboard = ({ userData, t, onAddTransaction }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const monthlyIncome = useMemo(() => (userData.transactions || []).filter(tx => tx.type === 'income').reduce((s, a) => s + a.amount, 0), [userData.transactions]);
    const monthlyExpenses = useMemo(() => {
        const regularExpenses = (userData.transactions || []).filter(tx => tx.type === 'expense').reduce((s, a) => s + a.amount, 0);
        const recurringExpenses = (userData.recurringTransactions || []).reduce((s, a) => s + a.amount, 0);
        return regularExpenses + recurringExpenses;
    }, [userData.transactions, userData.recurringTransactions]);
    const totalAssets = useMemo(() => (userData.assets || []).reduce((s, a) => s + a.balance, 0), [userData.assets]);

    const combinedTransactions = useMemo(() => {
        const normalTransactions = userData.transactions || [];
        const virtualRecurringTransactions = (userData.recurringTransactions || []).map(r => ({
            id: `recurring-${r.id}`, date: r.nextDueDate, description: r.name, category: r.category, amount: r.amount, type: 'expense', tags: [t.recurringTag]
        }));
        const all = [...normalTransactions, ...virtualRecurringTransactions];
        all.sort((a, b) => new Date(b.date) - new Date(a.date));
        return all;
    }, [userData.transactions, userData.recurringTransactions, t.recurringTag]);

    const filteredTransactions = useMemo(() => combinedTransactions.filter(tx => tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || (tx.tags && tx.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))), [combinedTransactions, searchTerm]);

    return (
        <div className="space-y-8">
            <header className="flex justify-between items-center"><div><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.dashboard}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.dashboardWelcome.replace('{name}', userData.name)}</p></div> <button onClick={onAddTransaction} className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"><PlusCircle className="h-5 w-5 mr-2" />{t.addTransaction}</button> </header>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> <KPICard title={t.totalAssets} value={totalAssets} icon={<CircleDollarSign className="text-blue-600"/>} bgColor="bg-blue-100 dark:bg-blue-900/50" valueColor="text-blue-600 dark:text-blue-400"/> <KPICard title={t.monthlyIncome} value={monthlyIncome} icon={<TrendingUp className="text-green-600"/>} bgColor="bg-green-100 dark:bg-green-900/50" valueColor="text-green-600 dark:text-green-400" showPlus={true} /> <KPICard title={t.monthlyExpenses} value={-monthlyExpenses} icon={<TrendingDown className="text-rose-600"/>} bgColor="bg-rose-100 dark:bg-rose-900/50" valueColor="text-rose-600 dark:text-rose-400"/> </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm">
                <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t.recentTransactions}</h3><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="text" placeholder={t.searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-100 dark:bg-slate-700 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-teal-500"/></div></div>
                <div className="space-y-2 max-h-96 overflow-y-auto">{filteredTransactions.map((tx) => (<div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"><div className="flex items-center gap-3"><div className={`p-2 rounded-full ${CATEGORY_COLORS[tx.category] || 'bg-gray-100 text-gray-600'}`}>{getIcon(tx.category)}</div><div><p className="font-semibold text-slate-700 dark:text-slate-300">{tx.description}</p><div className="flex items-center gap-2 mt-1"><p className="text-sm text-slate-400 dark:text-slate-500">{tx.date}</p>{tx.tags?.map(tag => <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${tag === t.recurringTag ? 'bg-indigo-200 dark:bg-indigo-600 text-indigo-800 dark:text-indigo-100' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'}`}>{tag}</span>)}</div></div></div><p className={`font-bold ${tx.type === 'income' ? 'text-teal-500' : 'text-rose-500'}`}>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}</p></div>))}</div>
            </div>
        </div>
    );
};
const Assets = ({ assets, t, onAddAsset }) => ( <div className="space-y-8"> <header className="flex justify-between items-center"> <div><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.assetsTitle}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.assetsDesc}</p></div> <button onClick={onAddAsset} className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"><PlusCircle className="h-5 w-5 mr-2" />{t.addAsset}</button> </header> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{(assets || []).map(asset => (<div key={asset.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"><div className="flex items-center gap-3"><div className={`p-3 rounded-full ${asset.balance < 0 ? 'bg-rose-100 dark:bg-rose-900/50' : 'bg-blue-100 dark:bg-blue-900/50'}`}>{getAssetIcon(asset.type)}</div><h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{asset.name}</h3></div><p className={`text-3xl font-bold mt-4 ${asset.balance < 0 ? 'text-rose-500' : 'text-blue-500'}`}>{formatCurrency(asset.balance)}</p></div>))}</div> </div> );
const RecurringTransactions = ({ recurring, t, onAddRecurring }) => { return <div className="space-y-8"> <header className="flex justify-between items-center"> <div> <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.recurringTitle}</h2> <p className="text-slate-600 dark:text-slate-400 mt-1">{t.recurringDesc}</p> </div> <button onClick={onAddRecurring} className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"> <PlusCircle className="h-5 w-5 mr-2" />{t.addRecurring} </button> </header> <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm space-y-3"> {(recurring || []).map(r => (<div key={r.id} className="flex justify-between items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg"><div><p className="font-semibold text-slate-700 dark:text-slate-300">{r.name}</p><p className="text-sm text-slate-500 dark:text-slate-400">{t.nextPayment}: {r.nextDueDate}</p></div><p className="font-bold text-lg text-rose-500">- {formatCurrency(r.amount)}</p></div>))}</div> </div> };
const Budgets = ({ budgets, t, onAddBudget }) => { return <div className="space-y-8"> <header className="flex justify-between items-center"> <div> <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.budgetsTitle}</h2> <p className="text-slate-600 dark:text-slate-400 mt-1">{t.budgetsDesc}</p> </div> <button onClick={onAddBudget} className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"> <PlusCircle className="h-5 w-5 mr-2" />{t.addBudget} </button> </header> <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{(budgets || []).map((item, index) => { const percentage = Math.round((item.spent / item.budget) * 100); const getBarColor = (p) => { if (p > 90) return 'bg-rose-500'; if (p > 75) return 'bg-yellow-500'; return 'bg-teal-500'; }; return (<div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"><div className="flex justify-between items-start"><div><p className="text-lg font-semibold text-slate-700 dark:text-slate-300">{item.category}</p><p className="text-sm text-slate-500 dark:text-slate-400">{t.spent}: <span className="font-medium text-slate-600 dark:text-slate-300">{formatCurrency(item.spent)}</span></p></div><p className="text-sm font-bold text-slate-600 dark:text-slate-400">{formatCurrency(item.budget)}</p></div><div className="mt-4"><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"><div className={`${getBarColor(percentage)} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div></div><div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mt-2"><span>{percentage}%</span><span>{formatCurrency(item.budget - item.spent)} {t.remaining}</span></div></div></div>)})}</div> </div> };
const Goals = ({ goals, t, onAddGoal }) => { return <div className="space-y-8"> <header className="flex justify-between items-center"> <div> <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.goalsTitle}</h2> <p className="text-slate-600 dark:text-slate-400 mt-1">{t.goalsDesc}</p> </div> <button onClick={onAddGoal} className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"> <PlusCircle className="h-5 w-5 mr-2" />{t.addGoal} </button> </header> <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{(goals || []).map((goal, index) => { const percentage = Math.round((goal.saved / goal.target) * 100); const isAchieved = goal.saved >= goal.target; return (<div key={index} className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between ${isAchieved && 'bg-teal-50 dark:bg-teal-900/50'}`}><div className="flex justify-between items-center"><p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{goal.name}</p>{isAchieved && <span className="text-xs font-bold text-white bg-teal-500 py-1 px-2 rounded-full flex items-center gap-1"><Sparkles className="h-3 w-3" />{t.achieved}</span>}</div><p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t.goalAmount}: {formatCurrency(goal.target)}</p><div className="mt-6"><p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{formatCurrency(goal.saved)}</p><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-2"><div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${Math.min(percentage, 100)}%` }}></div></div><p className="text-right text-sm text-slate-500 dark:text-slate-400 mt-1">{percentage}%</p></div></div>)})}</div> </div> };


// --- Main Application ---
export default function App() {
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('ko');
  const [currentUserKey, setCurrentUserKey] = useState('invitedUser1');
  const [activeView, setActiveView] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [modalState, setModalState] = useState({
      transaction: false, asset: false, recurring: false, budget: false, goal: false,
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // =================================================================
  // == FIREBASE REAL-TIME DATA LISTENER (실제 연동 로직) ==
  // =================================================================
  useEffect(() => {
    // [FIX] 'db'가 import되지 않은 경우를 대비한 안전장치
    if (typeof db === 'undefined') {
        console.warn("Firebase 'db' is not initialized. Using mock data.");
        setIsLoading(true);
        const mockData = initialAppData[currentUserKey] || initialAppData.invitedUser1;
        const fullMockData = {
          ...mockData,
          assets: mockData.assets || [],
          transactions: mockData.transactions || [],
          recurringTransactions: mockData.recurringTransactions || [],
          budgets: mockData.budgets || [],
          goals: mockData.goals || [],
        };
        setTimeout(() => {
          setUserData(fullMockData);
          setIsLoading(false);
        }, 300);
        return;
    }

    setIsLoading(true);
    setUserData(null); 

    const userDocRef = doc(db, "users", currentUserKey);
    const collectionsToSync = ["assets", "transactions", "recurringTransactions", "budgets", "goals"];
    
    let initialLoads = collectionsToSync.length + 1;
    const checkLoadingDone = () => {
        initialLoads--;
        if (initialLoads <= 0) {
            setIsLoading(false);
        }
    };

    const unsubscribers = collectionsToSync.map(colName => 
      onSnapshot(collection(userDocRef, colName), (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUserData(prev => ({ ...prev, [colName]: data }));
        checkLoadingDone();
      }, (error) => {
          console.error(`Error fetching ${colName}:`, error);
          setUserData(prev => ({ ...prev, [colName]: [] })); // 에러 발생 시 빈 배열로 설정
          checkLoadingDone();
      })
    );
    
    const unsubProfile = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setUserData(prev => ({ ...prev, ...doc.data() }));
      }
      checkLoadingDone();
    }, (error) => {
        console.error("Error fetching user profile:", error);
        checkLoadingDone();
    });

    return () => {
      unsubscribers.forEach(unsub => unsub());
      unsubProfile();
    };
  }, [currentUserKey]);

  const currentT = useMemo(() => translations[lang], [lang]);
  
  const openModal = (modalName) => setModalState(prev => ({ ...prev, [modalName]: true }));
  const closeModal = (modalName) => setModalState(prev => ({ ...prev, [modalName]: false }));

  const handleAddData = async (collectionName, data) => {
    const modalKey = collectionName.replace(/s$/, '');
    // [FIX] 'db'가 없는 경우를 대비
    if (typeof db === 'undefined') {
        console.log("Mock add:", {collectionName, data});
        closeModal(modalKey);
        return;
    }
    try {
      const userDocRef = doc(db, "users", currentUserKey);
      const subCollectionRef = collection(userDocRef, collectionName);
      await addDoc(subCollectionRef, data);
      console.log(`${collectionName}에 데이터 추가 성공!`);
      closeModal(modalKey);
    } catch (error) {
      console.error("데이터 추가 중 오류 발생: ", error);
      alert("데이터 추가에 실패했습니다.");
    }
  };
  
  const renderContent = () => {
    if (isLoading || !userData) {
      return <div className="w-full h-full flex items-center justify-center"><p className="text-slate-500">{currentT.loading}</p></div>;
    }
    
    switch (activeView) {
      case 'dashboard': return <Dashboard userData={userData} t={currentT} onAddTransaction={() => openModal('transaction')} />;
      case 'assets': return <Assets assets={userData.assets} t={currentT} onAddAsset={() => openModal('asset')} />;
      case 'recurring': return <RecurringTransactions recurring={userData.recurringTransactions} t={currentT} onAddRecurring={() => openModal('recurring')} />;
      case 'budgets': return <Budgets budgets={userData.budgets} t={currentT} onAddBudget={() => openModal('budget')} />;
      case 'goals': return <Goals goals={userData.goals} t={currentT} onAddGoal={() => openModal('goal')} />;
      default: return <Dashboard userData={userData} t={currentT} onAddTransaction={() => openModal('transaction')} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} t={currentT} currentUser={userData} setCurrentUser={setCurrentUserKey} />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto relative">
        <div className="absolute top-6 right-6 z-30">
          <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-md">
            {theme === 'light' ? <Moon className="text-slate-700"/> : <Sun className="text-yellow-400"/>}
          </button>
        </div>
        {renderContent()}
      </main>

      <AddTransactionModal isOpen={modalState.transaction} onClose={() => closeModal('transaction')} onSubmit={(data) => handleAddData('transactions', data)} assets={userData?.assets || []} t={currentT} />
      <AddAssetModal isOpen={modalState.asset} onClose={() => closeModal('asset')} onSubmit={(data) => handleAddData('assets', data)} t={currentT} />
      <AddRecurringModal isOpen={modalState.recurring} onClose={() => closeModal('recurring')} onSubmit={(data) => handleAddData('recurringTransactions', data)} t={currentT} />
      <AddBudgetModal isOpen={modalState.budget} onClose={() => closeModal('budget')} onSubmit={(data) => handleAddData('budgets', data)} t={currentT} />
      <AddGoalModal isOpen={modalState.goal} onClose={() => closeModal('goal')} onSubmit={(data) => handleAddData('goals', data)} t={currentT} />
    </div>
  );
}


// --- 개선된 모달 컴포넌트들 ---
const AddTransactionModal = ({ isOpen, onClose, onSubmit, assets, t }) => {
  const handleSubmit = (e) => { e.preventDefault(); const formData = new FormData(e.target); const data = { type: formData.get('type'), date: formData.get('date'), description: formData.get('description'), amount: parseFloat(formData.get('amount')), category: formData.get('category'), assetId: formData.get('assetId'), tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(Boolean), }; onSubmit(data); };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.newTransaction}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.transactionType}</label><select name="type" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="expense">{t.expense}</option><option value="income">{t.income}</option></select></div>
          <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.date}</label><input type="date" name="date" defaultValue={new Date().toISOString().substring(0, 10)} required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div>
        </div>
        <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.description}</label><input type="text" name="description" placeholder="예: 스타벅스 커피" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div>
        <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.category}</label><select name="category" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="">{t.select}</option>{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.amount}</label><input type="number" name="amount" placeholder="5000" step="100" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div>
        </div>
        <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.asset}</label><select name="assetId" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="">{t.select}</option>{(assets || []).map(asset => <option key={asset.id} value={asset.id}>{asset.name}</option>)}</select></div>
        <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.tags}</label><input type="text" name="tags" placeholder="예: #카페, #기분전환" className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div>
        <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">{t.cancel}</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 shadow-sm">{t.add}</button></div>
      </form>
    </Modal>
  );
};
const AddAssetModal = ({ isOpen, onClose, onSubmit, t }) => {
    const handleSubmit = (e) => { e.preventDefault(); const formData = new FormData(e.target); const data = { name: formData.get('name'), type: formData.get('type'), balance: parseFloat(formData.get('balance')), }; onSubmit(data); };
    return (<Modal isOpen={isOpen} onClose={onClose} title={t.newAsset}><form onSubmit={handleSubmit} className="space-y-4"><div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.assetName}</label><input type="text" name="name" placeholder="예: 내 월급 통장" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div><div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.assetType}</label><select name="type" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="bank">{t.bank}</option><option value="card">{t.card}</option><option value="cash">{t.cash}</option></select></div><div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.initialBalance}</label><input type="number" name="balance" placeholder="1000000" step="1000" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div><div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">{t.cancel}</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 shadow-sm">{t.add}</button></div></form></Modal>);
};
const AddRecurringModal = ({ isOpen, onClose, onSubmit, t }) => {
  const handleSubmit = (e) => { e.preventDefault(); const formData = new FormData(e.target); const data = { name: formData.get('name'), amount: parseFloat(formData.get('amount')), category: formData.get('category'), nextDueDate: formData.get('nextDueDate'), }; onSubmit(data); };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.newRecurring}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.recurringName}</label><input type="text" name="name" placeholder="예: 넷플릭스 구독료" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.amount}</label><input type="number" name="amount" placeholder="17000" step="100" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div>
          <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.category}</label><select name="category" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="">{t.select}</option>{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
        </div>
        <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.nextDueDate}</label><input type="date" name="nextDueDate" defaultValue={new Date().toISOString().substring(0, 10)} required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div>
        <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">{t.cancel}</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 shadow-sm">{t.add}</button></div>
      </form>
    </Modal>
  );
};
const AddBudgetModal = ({ isOpen, onClose, onSubmit, t }) => {
  const handleSubmit = (e) => { e.preventDefault(); const formData = new FormData(e.target); const data = { category: formData.get('category'), budget: parseFloat(formData.get('budget')), spent: 0, }; onSubmit(data); };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.newBudget}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.category}</label><select name="category" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="">{t.select}</option>{CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div>
        <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.budgetAmount}</label><input type="number" name="budget" placeholder="300000" step="10000" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div>
        <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">{t.cancel}</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 shadow-sm">{t.add}</button></div>
      </form>
    </Modal>
  );
};
const AddGoalModal = ({ isOpen, onClose, onSubmit, t }) => {
  const handleSubmit = (e) => { e.preventDefault(); const formData = new FormData(e.target); const data = { name: formData.get('name'), target: parseFloat(formData.get('target')), saved: 0, }; onSubmit(data); };
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.newGoal}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.goalName}</label><input type="text" name="name" placeholder="예: 유럽 여행 가기" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div>
        <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.targetAmount}</label><input type="number" name="target" placeholder="5000000" step="50000" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div>
        <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">{t.cancel}</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 shadow-sm">{t.add}</button></div>
      </form>
    </Modal>
  );
};
