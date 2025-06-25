import React, { useState, useMemo, useEffect } from 'react';
import { AreaChart, Area, BarChart, Bar, Cell, CartesianGrid, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ChevronsLeft, ChevronsRight, PlusCircle, CreditCard, Home, ShoppingCart, Utensils, Zap, Repeat, Target, Settings, LayoutDashboard, Wallet, FileOutput, Landmark, Trophy, Gift, Sparkles, User, Tag, TrendingUp, TrendingDown, CircleDollarSign, Sun, Moon, Search } from 'lucide-react';

// --- 다국어 지원 / Multi-language Support ---
const translations = {
  ko: {
    appName: '가계부',
    myLedger: '내 가계부', adminMode: '관리자 모드', dashboard: '대시보드', assets: '자산 관리', recurring: '정기 거래', budgets: '예산', goals: '재무 목표', challenges: '챌린지', reports: '리포트', settings: '설정', myCoupons: '내 쿠폰함',
    theme: '테마', lightMode: '라이트 모드', darkMode: '다크 모드',
    dashboardWelcome: '안녕하세요, {name}님! 자산 현황을 요약해 드릴게요.', addTransaction: '거래 추가', totalAssets: '총 자산', monthlyIncome: '이번 달 수입', monthlyExpenses: '이번 달 지출', recentTransactions: '최근 거래 내역', searchPlaceholder: '거래 내역 검색...',
    assetsTitle: '자산 관리', assetsDesc: '전체 자산 목록과 현황입니다.', addAsset: '새 자산 추가',
    recurringTitle: '정기 거래', recurringDesc: '매월 반복되는 수입/지출 목록입니다.', addRecurring: '새 정기 거래 추가', nextPayment: '다음 결제일', budgetsTitle: '예산 관리', budgetsDesc: '카테고리별 예산을 설정하고 지출을 관리하세요.', addBudget: '새 예산 추가', spent: '지출', remaining: '남음', goalsTitle: '재무 목표', goalsDesc: '목표를 설정하고 달성 과정을 추적해 보세요.', addGoal: '새 목표 추가', goalAmount: '목표 금액', achieved: '달성!',
    challengesTitle: '저축 챌린지 & 보상', challengesDesc: '챌린지를 달성하고 직접 설정한 보상을 획득하세요!', couponManagement: '보상 쿠폰 관리', couponManagementDesc: '챌린지 성공 시 받을 나만의 보상을 설정하세요.', challenge: '챌린지', rewardCoupon: '보상 쿠폰', couponNamePlaceholder: '예: 아이스크림 교환권', claimReward: '보상 받기', claimed: '획득 완료', myCouponsTitle: '내 쿠폰함', myCouponsDesc: '챌린지를 통해 획득한 보상 쿠폰 목록입니다.', useCoupon: '사용하기', used: '사용 완료', noCoupons: '아직 획득한 쿠폰이 없어요. 챌린지에 도전해보세요!',
    reportsTitle: '리포트', reportsDesc: '금융 데이터를 심층적으로 분석하고 확인하세요.', incomeExpenseTrend: '월별 수입/지출 추이', income: '수입', expense: '지출', settingsTitle: '설정', settingsDesc: '계정 정보, 언어 및 데이터를 관리합니다.', profile: '프로필', name: '이름', email: '이메일', save: '저장', dataManagement: '데이터 관리', dataDesc: '데이터를 백업하거나 다른 기기에서 가져올 수 있습니다.', exportCSV: '내보내기 (CSV)', importCSV: '가져오기 (CSV)', language: '언어',
    recurringTag: '#정기결제',
  },
  ja: {
    appName: '家計簿',
    myLedger: '私の家計簿', adminMode: '管理者モード', dashboard: 'ダッシュボード', assets: '資産管理', recurring: '定期取引', budgets: '予算', goals: '財務目標', challenges: 'チャレンジ', reports: 'レポート', settings: '設定', myCoupons: 'マイクーポン',
    theme: 'テーマ', lightMode: 'ライトモード', darkMode: 'ダークモード',
    dashboardWelcome: 'こんにちは、{name}さん！資産状況を要約します。', addTransaction: '取引追加', totalAssets: '総資産', monthlyIncome: '今月の収入', monthlyExpenses: '今月の支出', recentTransactions: '最近の取引履歴', searchPlaceholder: '取引履歴を検索...',
    assetsTitle: '資産管理', assetsDesc: '全ての資産リストと現況です。', addAsset: '新しい資産を追加',
    recurringTitle: '定期取引', recurringDesc: '毎月繰り返される収入/支出のリストです。', addRecurring: '新しい定期取引を追加', nextPayment: '次の支払日', budgetsTitle: '予算管理', budgetsDesc: 'カテゴリ別に予算を設定し、支出を管理します。', addBudget: '新しい予算を追加', spent: '支出', remaining: '残り', goalsTitle: '財務目標', goalsDesc: '目標を設定し、達成過程を追跡します。', addGoal: '新しい目標を追加', goalAmount: '目標金額', achieved: '達成！',
    challengesTitle: '貯蓄チャレンジ＆報酬', challengesDesc: 'チャレンジを達成し、自分で設定した報酬を獲得しましょう！', couponManagement: '報酬クーポン管理', couponManagementDesc: 'チャレンジ成功時に受け取る自分だけの報酬を設定してください。', challenge: 'チャレンジ', rewardCoupon: '報酬クーポン', couponNamePlaceholder: '例：アイスクリーム引換券', claimReward: '報酬を受け取る', claimed: '獲得済み', myCouponsTitle: 'マイクーポン', myCouponsDesc: 'チャレンジを通じて獲得した報酬クーポンリストです。', useCoupon: '使用する', used: '使用済み', noCoupons: 'まだ獲得したクーポンがありません。チャレンジに挑戦してみてください！',
    reportsTitle: 'レポート', reportsDesc: '金融データを深く分析し、確認します。', incomeExpenseTrend: '月別収入/支出の推移', income: '収入', expense: '支出', settingsTitle: '設定', settingsDesc: 'アカウント情報、言語、データを管理します。', profile: 'プロフィール', name: '名前', email: 'メールアドレス', save: '保存', dataManagement: 'データ管理', dataDesc: 'データをバックアップしたり、他のデバイスからインポートしたりできます。', exportCSV: 'エクスポート (CSV)', importCSV: 'インポート (CSV)', language: '言語',
    recurringTag: '#定期決済',
  }
};
const getChallengeName = (challenge, lang) => challenge.name[lang] || challenge.name['ko'];

// --- 목업 데이터 / Mock Data ---
const allChallenges = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: { ko: `챌린지 #${i + 1}`, ja: `チャレンジ #${i + 1}` }, target: (i % 5 + 1) * 5, progress: 0, isAchieved: false }));
const appData = {
  admin: {
    id: 'admin', name: '김민준 (관리자)', email: 'admin@example.com',
    assets: [{ id: 1, name: '관리자 주거래 은행', balance: 50000000, type: 'bank' }, { id: 3, name: '관리자 신용카드', balance: -1500000, type: 'card' }],
    transactions: [{ id: 101, date: '2025-06-25', description: '관리자 수입', category: '급여', amount: 5000000, type: 'income', assetId: 1 }],
    recurringTransactions: [{ id: 1001, name: '관리비', amount: 150000, category: '주거', nextDueDate: '2025-07-05' }], 
    budgets: [], goals: [], userCoupons: [],
    challenges: allChallenges.map(c => ({...c, progress: c.id < 5 ? c.target : Math.floor(Math.random() * c.target), isAchieved: c.id < 5})),
    rewardSettings: { 1: '아이스크림 1개 교환권', 10: '내가 좋아하는 케이크 1조각' },
  },
  invitedUser1: {
    id: 'user1', name: '이수진', email: 'user1@example.com',
    assets: [{ id: 2, name: '수진님 용돈 계좌', balance: 500000, type: 'bank' }],
    transactions: [{ id: 201, date: '2025-06-24', description: '문구류 구매', category: '쇼핑', amount: 15000, type: 'expense', assetId: 2, tags: ['#학용품'] }],
    recurringTransactions: [{ id: 2001, name: '스트리밍', amount: 10000, category: '구독', nextDueDate: '2025-07-10' }],
    budgets: [{ category: '식비', spent: 50000, budget: 200000 }],
    goals: [{ name: '새 노트북', saved: 150000, target: 1200000 }],
    userCoupons: [{ id: 1001, name: '아이스크림 1개 교환권', isUsed: false, challengeId: 1 }],
    challenges: allChallenges.map(c => ({...c, progress: c.id < 2 ? c.target : 0, isAchieved: c.id < 2 })),
  }
};

// --- 헬퍼 컴포넌트 & 함수 / Helper Components & Functions ---
const KPICard = ({ title, value, icon, bgColor, valueColor, showPlus = false }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4 transition-all hover:shadow-lg hover:scale-105">
        <div className={`p-3 rounded-full ${bgColor}`}>{icon}</div>
        <div>
            <h3 className="text-slate-500 dark:text-slate-400 text-md font-medium">{title}</h3>
            <p className={`text-2xl font-bold ${valueColor}`}>{showPlus && value > 0 ? '+' : ''}{formatCurrency(value)}</p>
        </div>
    </div>
);
const formatCurrency = (value) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
const CATEGORY_ICONS = { '쇼핑': ShoppingCart, '식비': Utensils, '급여': Wallet, '교통': CreditCard, '주거': Home, '구독': Repeat, '기타': Zap };
const getIcon = (category) => { const Icon = CATEGORY_ICONS[category] || Zap; return <Icon className="h-5 w-5" />; };
const ASSET_ICONS = { 'bank': Landmark, 'card': CreditCard, 'cash': Wallet };
const getAssetIcon = (type) => { const Icon = ASSET_ICONS[type] || Wallet; return <Icon className="h-6 w-6" />; };
const CATEGORY_COLORS = { '쇼핑': 'bg-pink-100 text-pink-600', '식비': 'bg-orange-100 text-orange-600', '급여': 'bg-green-100 text-green-600', '교통': 'bg-blue-100 text-blue-600', '주거': 'bg-purple-100 text-purple-600', '구독': 'bg-indigo-100 text-indigo-600', '기타': 'bg-gray-100 text-gray-600', };

// --- 메인 앱 페이지 / Main App Pages ---
const Sidebar = ({ activeView, setActiveView, isCollapsed, setIsCollapsed, t, currentUser, setCurrentUser }) => {
    const navItems = [ { id: 'dashboard', label: t.dashboard, icon: <LayoutDashboard /> }, { id: 'assets', label: t.assets, icon: <Landmark /> }, { id: 'recurring', label: t.recurring, icon: <Repeat /> }, { id: 'budgets', label: t.budgets, icon: <Wallet /> }, { id: 'goals', label: t.goals, icon: <Target /> }, { id: 'challenges', label: t.challenges, icon: <Trophy />}, { id: 'myCoupons', label: t.myCoupons, icon: <Gift />}, { id: 'reports', label: t.reports, icon: <FileOutput />}, { id: 'settings', label: t.settings, icon: <Settings /> }, ];
    return ( <aside className={`relative bg-slate-800 text-slate-100 p-4 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}> <div className={`flex items-center mb-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>{!isCollapsed && <h1 className="text-2xl font-bold text-white">{t.appName}</h1>}<button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg hover:bg-slate-700">{isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}</button></div> <div className="border-t border-b border-slate-700 py-4 mb-4"> <button onClick={() => setCurrentUser('admin')} className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${currentUser.id === 'admin' ? 'bg-sky-600' : 'hover:bg-slate-700'}`}> <User className="h-5 w-5 shrink-0" /> {!isCollapsed && <span className="ml-4 font-bold">{t.myLedger}</span>} </button> <div className="mt-4"> <h3 className={`px-4 text-xs font-semibold uppercase text-slate-400 ${isCollapsed ? 'text-center' : ''}`}>{!isCollapsed && t.adminMode}</h3> <div className="mt-2"> <button onClick={() => setCurrentUser('invitedUser1')} className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${currentUser.id === 'user1' ? 'bg-sky-600' : 'hover:bg-slate-700'}`}> <User className="h-5 w-5 shrink-0" /> {!isCollapsed && <span className="ml-4">{appData.invitedUser1.name}</span>} </button> </div> </div> </div> <nav className="flex-grow overflow-y-auto"> <ul className="space-y-2">{navItems.map(item => (<li key={item.id}><button onClick={() => setActiveView(item.id)} className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeView === item.id ? 'bg-teal-500' : 'hover:bg-slate-700'} ${isCollapsed ? 'justify-center' : ''}`}><span className="shrink-0">{item.icon}</span>{!isCollapsed && <span className="ml-4 font-medium">{item.label}</span>}</button></li>))}</ul> </nav> </aside> );
};

const Dashboard = ({ userData, t, canEdit }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const monthlyIncome = useMemo(() => userData.transactions.filter(tx => tx.type === 'income').reduce((s, a) => s + a.amount, 0), [userData.transactions]);
    const monthlyExpenses = useMemo(() => {
        const regularExpenses = userData.transactions.filter(tx => tx.type === 'expense').reduce((s, a) => s + a.amount, 0);
        const recurringExpenses = userData.recurringTransactions.reduce((s, a) => s + a.amount, 0);
        return regularExpenses + recurringExpenses;
    }, [userData.transactions, userData.recurringTransactions]);
    const totalAssets = useMemo(() => userData.assets.reduce((s, a) => s + a.balance, 0), [userData.assets]);

    // [수정] 정기 결제 내역을 일반 거래 내역과 통합하고 날짜순으로 정렬합니다.
    const combinedTransactions = useMemo(() => {
        const normalTransactions = userData.transactions;
        const virtualRecurringTransactions = userData.recurringTransactions.map(r => ({
            id: `recurring-${r.id}`,
            date: r.nextDueDate,
            description: r.name,
            category: r.category,
            amount: r.amount,
            type: 'expense',
            tags: [t.recurringTag]
        }));

        const all = [...normalTransactions, ...virtualRecurringTransactions];
        // 날짜를 기준으로 내림차순 정렬 (최신순)
        all.sort((a, b) => new Date(b.date) - new Date(a.date));
        return all;
    }, [userData.transactions, userData.recurringTransactions, t.recurringTag]);


    // [수정] 통합된 거래 내역을 기반으로 검색을 수행합니다.
    const filteredTransactions = useMemo(() => combinedTransactions.filter(tx => 
        tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.tags && tx.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    ), [combinedTransactions, searchTerm]);

    return ( <div className="space-y-8"> <header className="flex justify-between items-center"><div><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.dashboard}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.dashboardWelcome.replace('{name}', userData.name)}</p></div> {canEdit && <button className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"><PlusCircle className="h-5 w-5 mr-2" />{t.addTransaction}</button>} </header> <div className="grid grid-cols-1 md:grid-cols-3 gap-6"> <KPICard title={t.totalAssets} value={totalAssets} icon={<CircleDollarSign className="text-blue-600"/>} bgColor="bg-blue-100 dark:bg-blue-900/50" valueColor="text-blue-600 dark:text-blue-400"/> <KPICard title={t.monthlyIncome} value={monthlyIncome} icon={<TrendingUp className="text-green-600"/>} bgColor="bg-green-100 dark:bg-green-900/50" valueColor="text-green-600 dark:text-green-400" showPlus={true} /> <KPICard title={t.monthlyExpenses} value={-monthlyExpenses} icon={<TrendingDown className="text-rose-600"/>} bgColor="bg-rose-100 dark:bg-rose-900/50" valueColor="text-rose-600 dark:text-rose-400"/> </div> <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"> <div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t.recentTransactions}</h3><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400"/><input type="text" placeholder={t.searchPlaceholder} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-slate-100 dark:bg-slate-700 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-teal-500"/></div></div> <div className="space-y-2 max-h-96 overflow-y-auto">{filteredTransactions.map((tx) => (<div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"><div className="flex items-center gap-3"><div className={`p-2 rounded-full ${CATEGORY_COLORS[tx.category]}`}>{getIcon(tx.category)}</div><div><p className="font-semibold text-slate-700 dark:text-slate-300">{tx.description}</p><div className="flex items-center gap-2 mt-1"><p className="text-sm text-slate-400 dark:text-slate-500">{tx.date}</p>{tx.tags?.map(tag => <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${tag === t.recurringTag ? 'bg-indigo-200 dark:bg-indigo-600 text-indigo-800 dark:text-indigo-100' : 'bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300'}`}>{tag}</span>)}</div></div></div><p className={`font-bold ${tx.type === 'income' ? 'text-teal-500' : 'text-rose-500'}`}>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}</p></div>))}</div></div> </div> );
};

const Assets = ({ assets, t, canEdit }) => ( <div className="space-y-8"> <header className="flex justify-between items-center"><div><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.assetsTitle}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.assetsDesc}</p></div>{canEdit && <button className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"><PlusCircle className="h-5 w-5 mr-2" />{t.addAsset}</button>}</header> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{assets.map(asset => (<div key={asset.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"><div className="flex items-center gap-3"><div className={`p-3 rounded-full ${asset.balance < 0 ? 'bg-rose-100 dark:bg-rose-900/50' : 'bg-blue-100 dark:bg-blue-900/50'}`}>{getAssetIcon(asset.type)}</div><h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{asset.name}</h3></div><p className={`text-3xl font-bold mt-4 ${asset.balance < 0 ? 'text-rose-500' : 'text-blue-500'}`}>{formatCurrency(asset.balance)}</p></div>))}</div> </div> );

const RecurringTransactions = ({ recurring, t, canEdit }) => ( <div className="space-y-8"> <header className="flex justify-between items-center"><div><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.recurringTitle}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.recurringDesc}</p></div>{canEdit && <button className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"><PlusCircle className="h-5 w-5 mr-2" />{t.addRecurring}</button>}</header> <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm space-y-3">{recurring.map(r => (<div key={r.id} className="flex justify-between items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg"><div><p className="font-semibold text-slate-700 dark:text-slate-300">{r.name}</p><p className="text-sm text-slate-500 dark:text-slate-400">{t.nextPayment}: {r.nextDueDate}</p></div><p className="font-bold text-lg text-rose-500">- {formatCurrency(r.amount)}</p></div>))}</div> </div> );

const Budgets = ({ budgets, t, canEdit }) => {
    const getBarColor = (percentage) => {
        if (percentage > 90) return 'bg-rose-500';
        if (percentage > 75) return 'bg-yellow-500';
        return 'bg-teal-500';
    }
    return ( <div className="space-y-8"> <header className="flex justify-between items-center"><div><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.budgetsTitle}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.budgetsDesc}</p></div>{canEdit && <button className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"><PlusCircle className="h-5 w-5 mr-2" />{t.addBudget}</button>}</header> <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{budgets.map((item, index) => { const percentage = Math.round((item.spent / item.budget) * 100); return (<div key={index} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"><div className="flex justify-between items-start"><div><p className="text-lg font-semibold text-slate-700 dark:text-slate-300">{item.category}</p><p className="text-sm text-slate-500 dark:text-slate-400">{t.spent}: <span className="font-medium text-slate-600 dark:text-slate-300">{formatCurrency(item.spent)}</span></p></div><p className="text-sm font-bold text-slate-600 dark:text-slate-400">{formatCurrency(item.budget)}</p></div><div className="mt-4"><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"><div className={`${getBarColor(percentage)} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div></div><div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mt-2"><span>{percentage}%</span><span>{formatCurrency(item.budget - item.spent)} {t.remaining}</span></div></div></div>)})}</div> </div> );
};

const Goals = ({ goals, t, canEdit }) => ( <div className="space-y-8"> <header className="flex justify-between items-center"><div><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.goalsTitle}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.goalsDesc}</p></div>{canEdit && <button className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"><PlusCircle className="h-5 w-5 mr-2" />{t.addGoal}</button>}</header> <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{goals.map((goal, index) => { const percentage = Math.round((goal.saved / goal.target) * 100); const isAchieved = goal.saved >= goal.target; return (<div key={index} className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between ${isAchieved && 'bg-teal-50 dark:bg-teal-900/50'}`}><div className="flex justify-between items-center"><p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{goal.name}</p>{isAchieved && <span className="text-xs font-bold text-white bg-teal-500 py-1 px-2 rounded-full flex items-center gap-1"><Sparkles className="h-3 w-3" />{t.achieved}</span>}</div><p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t.goalAmount}: {formatCurrency(goal.target)}</p><div className="mt-6"><p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{formatCurrency(goal.saved)}</p><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-2"><div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${Math.min(percentage, 100)}%` }}></div></div><p className="text-right text-sm text-slate-500 dark:text-slate-400 mt-1">{percentage}%</p></div></div>)})}</div> </div> );

const Reports = ({ transactions, t }) => {
    const reportData = useMemo(() => { const monthly = transactions.reduce((acc, tx) => { const month = new Date(tx.date).toISOString().slice(0, 7); if (!acc[month]) acc[month] = { month, income: 0, expense: 0 }; if (tx.type === 'income') acc[month].income += tx.amount; else acc[month].expense += tx.amount; return acc; }, {}); return Object.values(monthly).sort((a,b) => a.month.localeCompare(b.month)); }, [transactions]);
    return ( <div className="space-y-8"> <header> <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.reportsTitle}</h2> <p className="text-slate-600 dark:text-slate-400 mt-1">{t.reportsDesc}</p> </header> <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"> <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{t.incomeExpenseTrend}</h3> <ResponsiveContainer width="100%" height={300}> <AreaChart data={reportData}><CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" /><XAxis dataKey="month" tick={{fill: '#64748b'}} /><YAxis tick={{fill: '#64748b'}} tickFormatter={(value) => formatCurrency(value)} /><Tooltip contentStyle={{backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #ddd'}} formatter={(value) => formatCurrency(value)}/><Legend /><Area type="monotone" dataKey="income" stackId="1" stroke="#2dd4bf" fill="#a7f3d0" name={t.income}/><Area type="monotone" dataKey="expense" stackId="1" stroke="#f43f5e" fill="#fda4af" name={t.expense}/></AreaChart> </ResponsiveContainer> </div> </div> );
};

const Challenges = ({ challenges, userCoupons, rewardSettings, onClaimReward, t, lang, canEdit }) => ( <div className="space-y-8"> <header><div><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.challengesTitle}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.challengesDesc}</p></div></header> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{challenges.map(c => { const isClaimed = userCoupons.some(uc => uc.challengeId === c.id); const reward = rewardSettings[c.id] || `보상 없음`; return (<div key={c.id} className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-2 ${c.isAchieved ? 'border-amber-400' : 'border-transparent'}`}> <div className="flex items-center gap-4"><Trophy className={`h-10 w-10 ${c.isAchieved ? 'text-amber-500' : 'text-slate-400 dark:text-slate-600'}`}/><div><h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{getChallengeName(c, lang)}</h3><p className="text-xs text-slate-500 dark:text-slate-400">{t.rewardCoupon}: {reward}</p></div></div> <div className="mt-4"> {c.isAchieved ? ( isClaimed ? ( <button disabled className="w-full py-2 px-4 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed">{t.claimed}</button> ) : ( canEdit ? <button onClick={() => onClaimReward(c.id)} className="w-full py-2 px-4 rounded-lg bg-amber-500 text-white hover:bg-amber-600 font-semibold">{t.claimReward}</button> : <button disabled className="w-full py-2 px-4 rounded-lg bg-amber-500 text-white opacity-50">{t.achieved}</button> ) ) : ( <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"><div className="bg-slate-400 dark:bg-slate-500 h-2.5 rounded-full" style={{width: `${(c.progress / c.target) * 100}%`}}></div></div> )} </div> </div>);})}</div> </div> );

const MyCoupons = ({ coupons, onUseCoupon, t, canEdit }) => ( <div className="space-y-8"> <header><div><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.myCouponsTitle}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.myCouponsDesc}</p></div></header> <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"> {coupons.length === 0 ? ( <div className="text-center py-10"><p className="text-slate-500 dark:text-slate-400">{t.noCoupons}</p></div> ) : ( <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{coupons.map(c => ( <div key={c.id} className={`p-6 rounded-xl flex flex-col justify-between ${c.isUsed ? 'bg-slate-100 dark:bg-slate-700' : 'bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50'}`}> <div><h3 className={`font-bold text-lg ${c.isUsed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-teal-800 dark:text-teal-200'}`}>{c.name}</h3></div> <div className="mt-4"> {c.isUsed ? <p className="text-center font-bold text-slate-400 dark:text-slate-500 py-2">{t.used}</p> : (canEdit ? <button onClick={() => onUseCoupon(c.id)} className="w-full py-2 px-4 rounded-lg bg-teal-500 text-white hover:bg-teal-600">{t.useCoupon}</button> : <div/>)} </div> </div> ))}</div> )} </div> </div> );

const SettingsPage = ({ t, setLanguage, allChallenges, rewardSettings, onRewardSettingChange, lang, isAdmin, theme, setTheme }) => {
    return ( <div className="space-y-8"> <header><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.settingsTitle}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.settingsDesc}</p></header> {isAdmin && <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm"><h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">{t.couponManagement}</h3><p className="text-slate-600 dark:text-slate-400 mb-4">{t.couponManagementDesc}</p><div className="space-y-4 max-h-96 overflow-y-auto pr-2">{allChallenges.map(c => (<div key={c.id} className="grid grid-cols-2 gap-4 items-center"><label htmlFor={`reward-${c.id}`} className="text-sm font-medium text-slate-700 dark:text-slate-300">{getChallengeName(c, lang)}</label><input id={`reward-${c.id}`} type="text" value={rewardSettings[c.id] || ''} onChange={(e) => onRewardSettingChange(c.id, e.target.value)} placeholder={t.couponNamePlaceholder} className="block w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 text-sm"/></div>))}</div></div>} <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm"><h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">{t.theme}</h3><div className="flex gap-4"><button onClick={() => setTheme('light')} className="flex items-center justify-center gap-2 flex-1 p-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"><Sun/> {t.lightMode}</button><button onClick={() => setTheme('dark')} className="flex items-center justify-center gap-2 flex-1 p-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600"><Moon/> {t.darkMode}</button></div></div> <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm"><h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">{t.language}</h3><div className="flex gap-4"><button onClick={() => setLanguage('ko')} className="flex items-center justify-center gap-2 flex-1 p-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">🇰🇷 한국어</button><button onClick={() => setLanguage('ja')} className="flex items-center justify-center gap-2 flex-1 p-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">🇯🇵 日本語</button></div></div> </div> );
};

export default function App() {
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('ko');
  const [currentUserKey, setCurrentUserKey] = useState('admin');
  const [activeView, setActiveView] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [data, setData] = useState(appData);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const currentUserData = data[currentUserKey];
  const currentT = useMemo(() => translations[lang], [lang]);
  const isAdmin = currentUserKey === 'admin';
  // [수정] admin 외 다른 사용자도 편집 권한을 가질 수 있도록 수정
  // 여기서는 admin이 아닐 경우(초대된 사용자일 경우)에만 편집 가능하도록 설정
  const canEdit = currentUserKey !== 'admin';

  const handleClaimReward = (challengeId) => {
      // 관리자는 보상을 받을 수 없음
      if(currentUserKey === 'admin') return; 
      const rewardName = data.admin.rewardSettings[challengeId] || `${getChallengeName(allChallenges.find(c => c.id === challengeId), lang)} 달성!`;
      const newCoupon = { id: Date.now(), name: rewardName, isUsed: false, challengeId: challengeId };
      setData(prev => ({ ...prev, [currentUserKey]: { ...prev[currentUserKey], userCoupons: [...prev[currentUserKey].userCoupons, newCoupon] }}));
  };
  const handleUseCoupon = (couponId) => setData(prev => ({ ...prev, [currentUserKey]: { ...prev[currentUserKey], userCoupons: prev[currentUserKey].userCoupons.map(c => c.id === couponId ? { ...c, isUsed: true } : c) }}));
  const handleRewardSettingChange = (challengeId, name) => setData(prev => ({ ...prev, admin: { ...prev.admin, rewardSettings: {...prev.admin.rewardSettings, [challengeId]: name} }}));
  
  const renderContent = () => {
    if (!currentUserData) return <div>Loading...</div>;
    switch (activeView) {
      case 'dashboard': return <Dashboard userData={currentUserData} t={currentT} canEdit={canEdit} />;
      case 'assets': return <Assets assets={currentUserData.assets} t={currentT} canEdit={canEdit} />;
      case 'recurring': return <RecurringTransactions recurring={currentUserData.recurringTransactions} t={currentT} canEdit={canEdit} />;
      case 'budgets': return <Budgets budgets={currentUserData.budgets} t={currentT} canEdit={canEdit} />;
      case 'goals': return <Goals goals={currentUserData.goals} t={currentT} canEdit={canEdit} />;
      case 'challenges': return <Challenges challenges={currentUserData.challenges} userCoupons={currentUserData.userCoupons || []} rewardSettings={data.admin.rewardSettings} onClaimReward={handleClaimReward} t={currentT} lang={lang} canEdit={canEdit} />;
      case 'myCoupons': return <MyCoupons coupons={currentUserData.userCoupons || []} onUseCoupon={handleUseCoupon} t={currentT} canEdit={canEdit} />;
      case 'reports': return <Reports transactions={currentUserData.transactions} t={currentT} />;
      case 'settings': return <SettingsPage t={currentT} setLanguage={setLang} allChallenges={allChallenges} rewardSettings={data.admin.rewardSettings} onRewardSettingChange={handleRewardSettingChange} lang={lang} isAdmin={isAdmin} theme={theme} setTheme={setTheme} />;
      default: return <Dashboard userData={currentUserData} t={currentT} canEdit={canEdit} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} t={currentT} currentUser={currentUserData} setCurrentUser={setCurrentUserKey} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="absolute top-4 right-8 z-10">
            <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-md">
                {theme === 'light' ? <Moon className="text-slate-700"/> : <Sun className="text-yellow-400"/>}
            </button>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}
