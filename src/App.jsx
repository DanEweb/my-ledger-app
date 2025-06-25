import React, { useState, useMemo, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { ChevronsLeft, ChevronsRight, PlusCircle, CreditCard, Home, ShoppingCart, Utensils, Zap, Repeat, Target, Settings, LayoutDashboard, Wallet, FileOutput, Landmark, Trophy, Gift, Sparkles, User, Tag, TrendingUp, TrendingDown, CircleDollarSign, Sun, Moon, Search, X, Calendar, MoreHorizontal, Bot, ChevronLeft, ChevronRight, PiggyBank, BarChart2, Briefcase, Pill, GraduationCap, Popcorn, Building, ShieldCheck } from 'lucide-react';

// Firebase 연동을 위해 firebase.js 파일을 생성하고 아래 2줄의 주석을 해제하세요.
// import { db } from './firebase'; 
// import { doc, collection, onSnapshot, addDoc } from 'firebase/firestore';


// --- 다국어 지원 / Multi-language Support (10, 11번 수정 완료) ---
const translations = {
  ko: {
    appName: '가계부', myLedger: '내 가계부', adminMode: '관리자 모드', dashboard: '대시보드', assets: '자산·부채', recurring: '고정 지출/수입', budgets: '예산', goals: '재무 목표', history: '전체 내역',
    challenges: '챌린지', reports: '리포트', settings: '설정', myCoupons: '내 쿠폰함',
    theme: '테마', lightMode: '라이트 모드', darkMode: '다크 모드',
    dashboardWelcome: '안녕하세요, {name}님! 자산 현황을 요약해 드릴게요.', addTransaction: '내역 추가', totalAssets: '총 자산', monthlyIncome: '조회 기간 수입', monthlyExpenses: '조회 기간 지출', recentHistory: '최근 내역', searchPlaceholder: '내역 검색...',
    assetsTitle: '자산 및 부채 관리', assetsDesc: '전체 자산과 부채 목록입니다.', addAsset: '새 자산/부채 추가',
    recurringTitle: '고정 지출/수입 관리', recurringDesc: '매월 반복되는 수입/지출 목록입니다.', addRecurring: '새 고정 내역 추가', nextPayment: '다음 예정일', 
    budgetsTitle: '예산 관리', budgetsDesc: '카테고리별 예산을 설정하고 지출을 관리하세요.', addBudget: '새 예산 추가', spent: '지출', remaining: '남음', 
    goalsTitle: '재무 목표', goalsDesc: '목표를 설정하고 달성 과정을 추적해 보세요.', addGoal: '새 목표 추가', goalAmount: '목표 금액', savedAmount: '모은 금액', achieved: '달성!',
    historyTitle: '전체 내역 보기', historyDesc: '모든 수입/지출 내역을 검색하고 관리하세요.', allHistory: '전체 내역', showMore: '더보기',
    challengesTitle: '저축 챌린지 & 보상', challengesDesc: '챌린지를 달성하고 직접 설정한 보상을 획득하세요!', couponManagement: '보상 쿠폰 관리', couponManagementDesc: '챌린지 성공 시 받을 나만의 보상을 설정하세요.', challenge: '챌린지', rewardCoupon: '보상 쿠폰', couponNamePlaceholder: '예: 아이스크림 교환권', claimReward: '보상 받기', claimed: '획득 완료', myCouponsTitle: '내 쿠폰함', myCouponsDesc: '챌린지를 통해 획득한 보상 쿠폰 목록입니다.', useCoupon: '사용하기', used: '사용 완료', noCoupons: '아직 획득한 쿠폰이 없어요. 챌린지에 도전해보세요!',
    reportsTitle: '리포트', reportsDesc: '금융 데이터를 심층적으로 분석하고 확인하세요.', incomeExpenseTrend: '월별 수입/지출 추이',
    settingsTitle: '설정', settingsDesc: '계정 정보, 언어 및 데이터를 관리합니다.', profile: '프로필', name: '이름', email: '이메일', save: '저장', dataManagement: '데이터 관리', dataDesc: '데이터를 백업하거나 다른 기기에서 가져올 수 있습니다.', exportCSV: '내보내기 (CSV)', importCSV: '가져오기 (CSV)', language: '언어',
    newTransaction: '새 내역', transactionType: '종류', income: '수입', expense: '지출', date: '날짜', description: '내용', category: '카테고리', amount: '금액', asset: '자산', tags: '태그 (쉼표로 구분)', cancel: '취소', add: '추가',
    newAsset: '새 자산/부채', assetName: '항목 이름', assetType: '자산 종류', liability: '부채', initialBalance: '초기 금액/부채 총액', bank: '은행', card: '카드', cash: '현금', stock: '주식', crypto: '암호화폐', realEstate: '부동산', insurance: '보험',
    newRecurring: '새 고정 내역', recurringName: '항목 이름', paymentCycle: '주기', monthly: '매월', nextDueDate: '다음 예정일',
    newBudget: '새 예산', budgetAmount: '예산 금액',
    newGoal: '새 목표', goalName: '목표 이름', targetAmount: '목표 금액',
    loading: '데이터를 불러오는 중...', select: '선택하세요',
    startDate: '시작일', endDate: '종료일',
    netAssets: '순자산', totalLiabilities: '총 부채', upcomingPayments: '다가오는 고정 지출',
    expenseByCategory: '카테고리별 지출',
    aiFinancialCoach: 'AI 재정 분석',
    coachModalTitle: 'AI 재정 분석 리포트',
    getAdvice: '분석 및 조언 받기',
    analyzing: '당신의 소비 패턴을 분석중입니다...',
    aiGoalPlanner: 'AI 목표 플래너',
    createSavingsPlan: '✨ 목표 달성 계획 생성',
    savingsPlan: '나만의 저축 계획',
    generatingPlan: '계획을 생성중입니다...',
    filterByCategory: '카테고리 필터', filterByTag: '태그 필터', all: '전체',
    reportAnalysis: 'AI 리포트 분석', generateReport: '리포트 생성하기', analyzingReport: '리포트를 분석하고 있습니다...',
    noUpcomingPayments: '다가오는 고정 지출이 없습니다.',
  },
  en: {
    appName: 'Ledger', myLedger: 'My Ledger', adminMode: 'Admin Mode', dashboard: 'Dashboard', assets: 'Assets & Liabilities', recurring: 'Recurring', budgets: 'Budgets', goals: 'Goals', history: 'History',
    challenges: 'Challenges', reports: 'Reports', settings: 'Settings', myCoupons: 'My Coupons',
    theme: 'Theme', lightMode: 'Light Mode', darkMode: 'Dark Mode',
    dashboardWelcome: 'Hello, {name}! Here\'s a summary of your financial status.', addTransaction: 'Add Transaction', totalAssets: 'Total Assets', monthlyIncome: 'Period Income', monthlyExpenses: 'Period Expenses', recentHistory: 'Recent History', searchPlaceholder: 'Search transactions...',
    assetsTitle: 'Manage Assets & Liabilities', assetsDesc: 'This is a list of all your assets and liabilities.', addAsset: 'Add New Asset/Liability',
    recurringTitle: 'Manage Recurring Transactions', recurringDesc: 'This is a list of your monthly recurring income/expenses.', addRecurring: 'Add Recurring Item', nextPayment: 'Next due date',
    budgetsTitle: 'Budget Management', budgetsDesc: 'Set budgets by category and manage your spending.', addBudget: 'Add New Budget', spent: 'Spent', remaining: 'Remaining',
    goalsTitle: 'Financial Goals', goalsDesc: 'Set your goals and track your progress.', addGoal: 'Add New Goal', goalAmount: 'Goal Amount', savedAmount: 'Amount Saved', achieved: 'Achieved!',
    historyTitle: 'View All History', historyDesc: 'Search and manage all your income/expense history.', allHistory: 'All History', showMore: 'Show More',
    challengesTitle: 'Savings Challenges & Rewards', challengesDesc: 'Complete challenges and earn self-set rewards!', couponManagement: 'Reward Coupon Management', couponManagementDesc: 'Set up your own rewards for completing challenges.', challenge: 'Challenge', rewardCoupon: 'Reward Coupon', couponNamePlaceholder: 'e.g., Ice Cream Voucher', claimReward: 'Claim Reward', claimed: 'Claimed', myCouponsTitle: 'My Coupons', myCouponsDesc: 'List of reward coupons earned through challenges.', useCoupon: 'Use Coupon', used: 'Used', noCoupons: 'No coupons yet. Try a challenge!',
    reportsTitle: 'Reports', reportsDesc: 'Analyze and check your financial data in depth.', incomeExpenseTrend: 'Monthly Income/Expense Trend',
    settingsTitle: 'Settings', settingsDesc: 'Manage your account information, language, and data.', profile: 'Profile', name: 'Name', email: 'Email', save: 'Save', dataManagement: 'Data Management', dataDesc: 'Back up your data or import it from other devices.', exportCSV: 'Export (CSV)', importCSV: 'Import (CSV)', language: 'Language',
    newTransaction: 'New Transaction', transactionType: 'Type', income: 'Income', expense: 'Expense', date: 'Date', description: 'Description', category: 'Category', amount: 'Amount', asset: 'Asset', tags: 'Tags (comma-separated)', cancel: 'Cancel', add: 'Add',
    newAsset: 'New Asset/Liability', assetName: 'Item Name', assetType: 'Asset Type', liability: 'Liability', initialBalance: 'Initial Balance/Total Debt', bank: 'Bank', card: 'Card', cash: 'Cash', stock: 'Stock', crypto: 'Crypto', realEstate: 'Real Estate', insurance: 'Insurance',
    newRecurring: 'New Recurring Item', recurringName: 'Item Name', paymentCycle: 'Cycle', monthly: 'Monthly', nextDueDate: 'Next Due Date',
    newBudget: 'New Budget', budgetAmount: 'Budget Amount',
    newGoal: 'New Goal', goalName: 'Goal Name', targetAmount: 'Target Amount',
    loading: 'Loading data...', select: 'Select...',
    startDate: 'Start Date', endDate: 'End Date',
    netAssets: 'Net Assets', totalLiabilities: 'Total Liabilities', upcomingPayments: 'Upcoming Payments',
    expenseByCategory: 'Expenses by Category',
    aiFinancialCoach: 'AI Financial Analysis',
    coachModalTitle: 'AI Financial Analysis Report',
    getAdvice: 'Get Analysis & Advice',
    analyzing: 'Analyzing your spending patterns...',
    aiGoalPlanner: 'AI Goal Planner',
    createSavingsPlan: '✨ Create Savings Plan',
    savingsPlan: 'My Savings Plan',
    generatingPlan: 'Generating plan...',
    filterByCategory: 'Filter by Category', filterByTag: 'Filter by Tag', all: 'All',
    reportAnalysis: 'AI Report Analysis', generateReport: 'Generate Report', analyzingReport: 'Analyzing report...',
    noUpcomingPayments: 'No upcoming recurring payments.',
  },
  ja: {
    appName: '家計簿', myLedger: '私の家計簿', adminMode: '管理者モード', dashboard: 'ダッシュボード', assets: '資産・負債', recurring: '固定支出/収入', budgets: '予算', goals: '財務目標', history: '全履歴',
    challenges: 'チャレンジ', reports: 'レポート', settings: '設定', myCoupons: 'マイクーポン',
    theme: 'テーマ', lightMode: 'ライトモード', darkMode: 'ダークモード',
    dashboardWelcome: '{name}さん、こんにちは！資産状況の概要です。', addTransaction: '履歴追加', totalAssets: '総資産', monthlyIncome: '期間中の収入', monthlyExpenses: '期間中の支出', recentHistory: '最近の履歴', searchPlaceholder: '履歴を検索...',
    assetsTitle: '資産・負債の管理', assetsDesc: 'すべての資産と負債のリストです。', addAsset: '新しい資産/負債を追加',
    recurringTitle: '固定支出/収入の管理', recurringDesc: '毎月繰り返される収入/支出のリストです。', addRecurring: '新しい固定履歴を追加', nextPayment: '次の予定日',
    budgetsTitle: '予算管理', budgetsDesc: 'カテゴリー別に予算を設定し、支出を管理します。', addBudget: '新しい予算を追加', spent: '支出', remaining: '残り',
    goalsTitle: '財務目標', goalsDesc: '目標を設定し、達成過程を追跡します。', addGoal: '新しい目標を追加', goalAmount: '目標金額', savedAmount: '貯金額', achieved: '達成！',
    historyTitle: '全履歴を見る', historyDesc: 'すべての収入/支出履歴を検索・管理します。', allHistory: '全履歴', showMore: 'もっと見る',
    challengesTitle: '貯蓄チャレンジ＆報酬', challengesDesc: 'チャレンジを達成し、自分で設定した報酬を獲得しましょう！', couponManagement: '報酬クーポン管理', couponManagementDesc: 'チャレンジ成功時に受け取る自分だけの報酬を設定します。', challenge: 'チャレンジ', rewardCoupon: '報酬クーポン', couponNamePlaceholder: '例：アイスクリーム引換券', claimReward: '報酬を受け取る', claimed: '獲得完了', myCouponsTitle: 'マイクーポン', myCouponsDesc: 'チャレンジを通じて獲得した報酬クーポンの一覧です。', useCoupon: '使用する', used: '使用済み', noCoupons: 'まだ獲得したクーポンがありません。チャレンジに挑戦してみてください！',
    reportsTitle: 'レポート', reportsDesc: '財務データを詳細に分析・確認します。', incomeExpenseTrend: '月別収入/支出推移',
    settingsTitle: '設定', settingsDesc: 'アカウント情報、言語、データを管理します。', profile: 'プロフィール', name: '名前', email: 'Eメール', save: '保存', dataManagement: 'データ管理', dataDesc: 'データをバックアップしたり、他のデバイスからインポートしたりできます。', exportCSV: 'エクスポート (CSV)', importCSV: 'インポート (CSV)', language: '言語',
    newTransaction: '新しい履歴', transactionType: '種類', income: '収入', expense: '支出', date: '日付', description: '内容', category: 'カテゴリー', amount: '金額', asset: '資産', tags: 'タグ (カンマ区切り)', cancel: 'キャンセル', add: '追加',
    newAsset: '新しい資産/負債', assetName: '項目名', assetType: '資産種類', liability: '負債', initialBalance: '初期金額/負債総額', bank: '銀行', card: 'カード', cash: '現金', stock: '株式', crypto: '暗号資産', realEstate: '不動産', insurance: '保険',
    newRecurring: '新しい固定履歴', recurringName: '項目名', paymentCycle: '周期', monthly: '毎月', nextDueDate: '次の予定日',
    newBudget: '新しい予算', budgetAmount: '予算金額',
    newGoal: '新しい目標', goalName: '目標名', targetAmount: '目標金額',
    loading: 'データを読み込み中...', select: '選択してください',
    startDate: '開始日', endDate: '終了日',
    netAssets: '純資産', totalLiabilities: '総負債', upcomingPayments: '今後の固定支出',
    expenseByCategory: 'カテゴリー別支出',
    aiFinancialCoach: 'AI財務分析',
    coachModalTitle: 'AI財務分析レポート',
    getAdvice: '分析と助言を得る',
    analyzing: 'あなたの消費パターンを分析中です...',
    aiGoalPlanner: 'AI目標プランナー',
    createSavingsPlan: '✨ 目標達成計画を作成',
    savingsPlan: '自分だけの貯蓄計画',
    generatingPlan: '計画を作成中です...',
    filterByCategory: 'カテゴリーで絞り込み', filterByTag: 'タグで絞り込み', all: 'すべて',
    reportAnalysis: 'AIレポート分析', generateReport: 'レポート生成', analyzingReport: 'レポートを分析しています...',
    noUpcomingPayments: '今後の固定支出はありません。',
  }
};
const CATEGORIES = {
    ko: ['급여', '용돈', '사업소득', '식비', '쇼핑', '교통', '주거', '구독', '의료', '교육', '경조사', '엔터테인먼트', '기타'],
    en: ['Salary', 'Allowance', 'Business Income', 'Food', 'Shopping', 'Transport', 'Housing', 'Subscription', 'Medical', 'Education', 'Events', 'Entertainment', 'Other'],
    ja: ['給料', 'お小遣い', '事業所得', '食費', 'ショッピング', '交通', '住居', 'サブスク', '医療', '教育', '冠婚葬祭', 'エンタメ', 'その他']
};
const allChallenges = Array.from({ length: 50 }, (_, i) => ({ id: `chal-${i + 1}`, name: { ko: `챌린지 #${i + 1}`, en: `Challenge #${i + 1}`, ja: `チャレンジ #${i + 1}` }, target: (i % 5 + 1) * 5, progress: 0, isAchieved: false }));

// --- 임시 목업 데이터 (Firebase 연결 전 테스트용) ---
const initialAppData = {
  admin: { 
    id: 'admin', name: '김민준 (관리자)', email: 'admin@example.com', 
    assets: [ { id: 'asset-1', name: '주거래 은행', balance: 50000000, type: 'bank'}, { id: 'asset-debt-1', name: '학자금 대출', balance: -15000000, type: 'liability'} ], 
    transactions: [ {id: 'tx-1', date: '2025-06-25', description: '월급', category: '급여', amount: 5000000, type: 'income', assetId: 'asset-1', tags: ['#월급날']}, {id: 'tx-a2', date: '2025-06-25', description: '점심 식사', category: '식비', amount: 12000, type: 'expense', assetId: 'asset-1', tags: ['#회사앞', '#맛집']} ], 
    recurringTransactions: [{id: 'rec-1', name: '월세', amount: 550000, type: 'expense', category: '주거', nextDueDate: '2025-07-01'}, {id: 'rec-ott', name: 'OTT 구독료', amount: 17000, type: 'expense', category: '구독', nextDueDate: '2025-07-15'}], 
    budgets: [{id: 'bud-1', category: '식비', budget: 400000, spent: 150000 }], 
    goals: [{id: 'goal-1', name: '유럽 여행', target: 5000000, saved: 1200000 }], 
    challenges: allChallenges, userCoupons: [], rewardSettings: { 'chal-1': '아이스크림 교환권' }
  },
  invitedUser1: { 
    id: 'user1', name: '이수진', email: 'user1@example.com', 
    assets: [{ id: 'asset-2', name: '용돈 계좌', balance: 500000, type: 'bank'}], 
    transactions: [{id: 'tx-2', date: '2025-06-24', description: '문구류 구매', category: '쇼핑', amount: 15000, type: 'expense', assetId: 'asset-2', tags: ['#다꾸']}], 
    recurringTransactions: [{id: 'rec-2', name: '스트리밍', amount: 10000, type: 'expense', category: '구독', nextDueDate: '2025-07-10'}], 
    budgets: [{id: 'bud-2', category: '쇼핑', budget: 200000, spent: 85000 }],
    goals: [], challenges: allChallenges, userCoupons: []
  }
};


// --- Helper Components ---
const formatCurrency = (value = 0) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);

// 7, 8번 수정: 아이콘 추가 및 개선
const CATEGORY_ICONS = { '쇼핑': ShoppingCart, '식비': Utensils, '급여': Wallet, '교통': CreditCard, '주거': Home, '구독': Repeat, '의료': Pill, '교육': GraduationCap, '경조사': Gift, '엔터테인먼트': Popcorn, '사업소득': Briefcase, '기타': Zap, };
const ASSET_ICONS = { 'bank': Landmark, 'card': CreditCard, 'cash': Wallet, 'liability': TrendingDown, 'stock': TrendingUp, 'crypto': CircleDollarSign, 'realEstate': Building, 'insurance': ShieldCheck };
const getIcon = (category) => { const Icon = CATEGORY_ICONS[category] || Zap; return <Icon className="h-5 w-5" />; };
const getAssetIcon = (type) => { const Icon = ASSET_ICONS[type] || Wallet; return <Icon className="h-8 w-8" />; };

const CATEGORY_COLORS = { '쇼핑': '#EC4899', '식비': '#F97316', '급여': '#22C55E', '교통': '#3B82F6', '주거': '#8B5CF6', '구독': '#6366F1', '의료': '#E11D48', '교육': '#F59E0B', '경조사': '#14B8A6', '엔터테인먼트': '#D946EF', '사업소득': '#10B981', '기타': '#6B7280', };
const PIE_COLORS = Object.values(CATEGORY_COLORS);

const Modal = ({ isOpen, onClose, title, children }) => {
 useEffect(() => { const handleEsc = (event) => { if (event.keyCode === 27) onClose(); }; window.addEventListener('keydown', handleEsc); return () => window.removeEventListener('keydown', handleEsc); }, [onClose]);
 if (!isOpen) return null;
 return ( <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}> <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-all" onClick={e => e.stopPropagation()}> <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700"> <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2> <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-full"><X size={20} /></button> </div> <div className="p-6">{children}</div> </div> </div> );
};

// 4번 수정: 신규 커스텀 달력 UI 컴포넌트
const CustomDatePicker = ({ selectedDate, onDateChange, onClose }) => {
    const [date, setDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
    const calendarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const changeMonth = (amount) => {
        setDate(new Date(date.getFullYear(), date.getMonth() + amount, 1));
    };

    const daysInMonth = () => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDayIndex = new Date(year, month, 1).getDay();
        return { days, firstDayIndex };
    };

    const { days, firstDayIndex } = daysInMonth();

    return (
        <div ref={calendarRef} className="absolute top-full mt-2 z-20 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronLeft size={20} /></button>
                <div className="font-bold text-lg text-slate-800 dark:text-slate-200">{date.getFullYear()}년 {date.getMonth() + 1}월</div>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronRight size={20} /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {['일', '월', '화', '수', '목', '금', '토'].map(day => <div key={day} className="font-semibold text-slate-500">{day}</div>)}
                {Array.from({ length: firstDayIndex }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {Array.from({ length: days }).map((_, day) => {
                    const dayNumber = day + 1;
                    const fullDate = new Date(date.getFullYear(), date.getMonth(), dayNumber);
                    const isSelected = selectedDate && new Date(selectedDate).toDateString() === fullDate.toDateString();
                    return (
                        <button
                            key={dayNumber}
                            onClick={() => onDateChange(fullDate.toISOString().slice(0, 10))}
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${isSelected ? 'bg-teal-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            {dayNumber}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};


// --- Page Components ---
// 8번 수정: 사이드바 아이콘 교체
const Sidebar = ({ activeView, setActiveView, isCollapsed, setIsCollapsed, t, currentUser, setCurrentUser, theme, setTheme }) => {
    const navItems = [
        { id: 'dashboard', label: t.dashboard, icon: <LayoutDashboard /> },
        { id: 'history', label: t.history, icon: <FileOutput /> },
        { id: 'assets', label: t.assets, icon: <Landmark /> },
        { id: 'recurring', label: t.recurring, icon: <Repeat /> },
        { id: 'budgets', label: t.budgets, icon: <PiggyBank /> },
        { id: 'goals', label: t.goals, icon: <Target /> },
        { id: 'challenges', label: t.challenges, icon: <Trophy /> },
        { id: 'myCoupons', label: t.myCoupons, icon: <Gift /> },
        { id: 'reports', label: t.reports, icon: <BarChart2 /> },
        { id: 'settings', label: t.settings, icon: <Settings /> },
    ];
    return ( <aside className={`relative bg-slate-800 text-slate-100 p-4 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}> <div className={`flex items-center mb-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}> {!isCollapsed && <h1 className="text-2xl font-bold text-white">{t.appName}</h1>} <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg hover:bg-slate-700"> {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />} </button> </div> <div className="border-t border-b border-slate-700 py-4 mb-4"> <button onClick={() => setCurrentUser('admin')} className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${currentUser?.id === 'admin' ? 'bg-sky-600' : 'hover:bg-slate-700'}`}> <User className="h-5 w-5 shrink-0" /> {!isCollapsed && <span className="ml-4 font-bold">{t.myLedger}</span>} </button> <div className="mt-4"> <h3 className={`px-4 text-xs font-semibold uppercase text-slate-400 ${isCollapsed ? 'text-center' : ''}`}>{!isCollapsed && t.adminMode}</h3> <div className="mt-2"> <button onClick={() => setCurrentUser('invitedUser1')} className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${currentUser?.id === 'invitedUser1' ? 'bg-sky-600' : 'hover:bg-slate-700'}`}> <User className="h-5 w-5 shrink-0" /> {!isCollapsed && <span className="ml-4">이수진</span>} </button> </div> </div> </div> <nav className="flex-grow overflow-y-auto"> <ul className="space-y-2">{navItems.map(item => (<li key={item.id}><button onClick={() => setActiveView(item.id)} className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeView === item.id ? 'bg-teal-500' : 'hover:bg-slate-700'} ${isCollapsed ? 'justify-center' : ''}`}><span className="shrink-0">{item.icon}</span>{!isCollapsed && <span className="ml-4 font-medium">{item.label}</span>}</button></li>))}</ul> </nav> <div className={`border-t border-slate-700 pt-4 mt-4 ${isCollapsed ? 'space-y-2' : 'flex justify-between items-center'}`}> <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className={`p-3 rounded-lg hover:bg-slate-700 w-full flex items-center ${isCollapsed ? 'justify-center' : ''}`}> {theme === 'light' ? <Moon /> : <Sun />} {!isCollapsed && <span className="ml-4">{theme === 'light' ? t.darkMode : t.lightMode}</span>} </button> </div> </aside> );
};

// 1, 2, 3번 수정: 대시보드 구조, 기능, 날짜 선택 기능 개선
const Dashboard = ({ userData, t, onAddTransaction, setActiveView, openCoachModal }) => {
    const defaultStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
    const defaultEndDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().slice(0, 10);
    
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [isStartCalendarOpen, setStartCalendarOpen] = useState(false);
    const [isEndCalendarOpen, setEndCalendarOpen] = useState(false);
    
    const { assets = [], transactions = [], budgets = [], recurringTransactions = [] } = userData;
    const { periodIncome, periodExpenses, expenseByCategory } = useMemo(() => {
        const start = new Date(startDate);
        start.setHours(0,0,0,0);
        const end = new Date(endDate);
        end.setHours(23,59,59,999);

        const periodTx = transactions.filter(tx => {
            const txDate = new Date(tx.date);
            return txDate >= start && txDate <= end;
        });

        const income = periodTx.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
        const expense = periodTx.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);

        const categoryData = periodTx
            .filter(tx => tx.type === 'expense')
            .reduce((acc, tx) => {
                acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
                return acc;
            }, {});
        
        const expenseByCategory = Object.entries(categoryData)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        return { periodIncome: income, periodExpenses: expense, expenseByCategory };
    }, [transactions, startDate, endDate]);
    
    const netAssets = useMemo(() => assets.reduce((sum, asset) => sum + asset.balance, 0), [assets]);
    
    const upcomingPayments = useMemo(() => {
        const today = new Date();
        return recurringTransactions
            .filter(r => new Date(r.nextDueDate) >= today)
            .sort((a,b) => new Date(a.nextDueDate) - new Date(b.nextDueDate))
            .slice(0, 3);
    }, [recurringTransactions]);
    
    return (
        <div className="space-y-6">
            <header className="flex flex-wrap justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.dashboard}</h2>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">{t.dashboardWelcome.replace('{name}', userData.name || '')}</p>
                </div>
                 <div className="flex items-center gap-2">
                    <div className="relative">
                        <button onClick={() => setStartCalendarOpen(s => !s)} className="flex items-center gap-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700">
                            <Calendar size={16} /> {startDate}
                        </button>
                        {isStartCalendarOpen && <CustomDatePicker selectedDate={startDate} onDateChange={(date) => { setStartDate(date); setStartCalendarOpen(false); }} onClose={() => setStartCalendarOpen(false)} />}
                    </div>
                    <span>-</span>
                    <div className="relative">
                        <button onClick={() => setEndCalendarOpen(e => !e)} className="flex items-center gap-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700">
                            <Calendar size={16} /> {endDate}
                        </button>
                        {isEndCalendarOpen && <CustomDatePicker selectedDate={endDate} onDateChange={(date) => { setEndDate(date); setEndCalendarOpen(false); }} onClose={() => setEndCalendarOpen(false)} />}
                    </div>
                 </div>
                 <button onClick={onAddTransaction} className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600 transition-colors">
                    <PlusCircle className="h-5 w-5 mr-2" />{t.addTransaction}
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"> <h3 className="font-semibold text-slate-500 dark:text-slate-400">{t.netAssets}</h3> <p className="text-3xl font-bold text-blue-500 mt-2">{formatCurrency(netAssets)}</p> </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"> <h3 className="font-semibold text-slate-500 dark:text-slate-400">{t.budgets}</h3> <p className="text-3xl font-bold text-violet-500 mt-2">{formatCurrency(budgets.reduce((sum, b) => sum + b.budget, 0))}</p> </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"> <h3 className="font-semibold text-slate-500 dark:text-slate-400">{t.monthlyIncome}</h3> <p className="text-3xl font-bold text-green-500 mt-2">{formatCurrency(periodIncome)}</p> </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"> <h3 className="font-semibold text-slate-500 dark:text-slate-400">{t.monthlyExpenses}</h3> <p className="text-3xl font-bold text-red-500 mt-2">{formatCurrency(periodExpenses)}</p> </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200">{t.expenseByCategory}</h3>
                         <button onClick={openCoachModal} className="text-sm flex items-center text-indigo-500 font-semibold hover:text-indigo-600">
                            <Bot size={16} className="mr-1" />{t.aiFinancialCoach}
                        </button>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {expenseByCategory.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                 <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm flex flex-col">
                    <div className="flex justify-between items-center mb-4"> <h3 className="font-semibold text-slate-800 dark:text-slate-200">{t.upcomingPayments}</h3></div>
                    <div className="space-y-3 flex-grow">
                         {upcomingPayments.length > 0 ? upcomingPayments.map(p => (
                            <div key={p.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                                <div>
                                    <p className="font-medium text-slate-700 dark:text-slate-300">{p.name}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{p.nextDueDate}</p>
                                </div>
                                <p className="font-semibold text-red-500">{formatCurrency(p.amount)}</p>
                            </div>
                        )) : <p className="text-sm text-slate-400 text-center pt-8">{t.noUpcomingPayments}</p>}
                    </div>
                </div>
            </div>
             <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm flex flex-col"> <div className="flex justify-between items-center mb-4"> <h3 className="font-semibold text-slate-800 dark:text-slate-200">{t.recentHistory}</h3></div> <div className="space-y-3 flex-grow"> {[...transactions].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 5).map(tx => ( <div key={tx.id} className="flex items-center justify-between text-sm"> <div className="flex items-center gap-3"> <div className={`p-2 rounded-full`} style={{backgroundColor: CATEGORY_COLORS[tx.category] ? `${CATEGORY_COLORS[tx.category]}20` : '#F3F4F6'}}>{getIcon(tx.category)}</div> <div> <p className="font-medium text-slate-700 dark:text-slate-300">{tx.description}</p> <p className="text-xs text-slate-400">{tx.date}</p> </div> </div> <p className={`font-semibold ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}</p> </div> )) } </div> <button onClick={() => setActiveView('history')} className="mt-4 text-sm w-full text-center py-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold text-slate-600 dark:text-slate-300">{t.showMore}</button> </div>
        </div>
    );
};

// 6번 수정: 자산 추가 버튼 UI 개선
const Assets = ({ assets, t, onAddAsset, onAddTransactionForAsset }) => (
    <div className="space-y-6 relative h-full">
        <header className="flex justify-between items-center">
            <div><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.assetsTitle}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.assetsDesc}</p></div>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            {(assets || []).map(asset => (
                <div key={asset.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm group relative">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${asset.balance < 0 ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'}`}>
                            {getAssetIcon(asset.type)}
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{asset.name}</h3>
                           <p className="text-sm text-slate-500 dark:text-slate-400">{t[asset.type] || asset.type}</p>
                        </div>
                    </div>
                    <p className={`text-3xl font-bold mt-4 ${asset.balance < 0 ? 'text-red-500' : 'text-blue-500'}`}>{formatCurrency(asset.balance)}</p>
                    <button onClick={() => onAddTransactionForAsset(asset.id)} className="absolute top-4 right-4 h-8 w-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <PlusCircle size={20} className="text-slate-500" />
                    </button>
                </div>
            ))}
        </div>
         <button onClick={onAddAsset} className="fixed bottom-10 right-10 flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-transform transform hover:scale-110 z-30">
            <PlusCircle size={32} />
        </button>
    </div>
);
const RecurringTransactions = ({ recurring, t, onAddRecurring }) => { return <div className="space-y-6"> <header className="flex justify-between items-center"> <div> <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.recurringTitle}</h2> <p className="text-slate-600 dark:text-slate-400 mt-1">{t.recurringDesc}</p> </div> <button onClick={onAddRecurring} className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"> <PlusCircle className="h-5 w-5 mr-2" />{t.addRecurring} </button> </header> <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm space-y-3"> {(recurring || []).map(r => (<div key={r.id} className="flex justify-between items-center p-4 border border-slate-200 dark:border-slate-700 rounded-lg"><div><p className="font-semibold text-slate-700 dark:text-slate-300">{r.name}</p><p className="text-sm text-slate-500 dark:text-slate-400">{t.nextPayment}: {r.nextDueDate}</p></div><p className={`font-bold text-lg ${r.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>{r.type === 'income' ? '+' : '-'}{formatCurrency(r.amount)}</p></div>))}</div> </div> };
const Budgets = ({ budgets, t, onAddBudget }) => { return <div className="space-y-6"> <header className="flex justify-between items-center"> <div> <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.budgetsTitle}</h2> <p className="text-slate-600 dark:text-slate-400 mt-1">{t.budgetsDesc}</p> </div> <button onClick={onAddBudget} className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"> <PlusCircle className="h-5 w-5 mr-2" />{t.addBudget} </button> </header> <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{(budgets || []).map((item) => { const percentage = item.budget > 0 ? Math.round((item.spent / item.budget) * 100) : 0; const getBarColor = (p) => { if (p > 90) return 'bg-rose-500'; if (p > 75) return 'bg-yellow-500'; return 'bg-teal-500'; }; return (<div key={item.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"><div className="flex justify-between items-start"><div><p className="text-lg font-semibold text-slate-700 dark:text-slate-300">{item.category}</p><p className="text-sm text-slate-500 dark:text-slate-400">{t.spent}: <span className="font-medium text-slate-600 dark:text-slate-300">{formatCurrency(item.spent)}</span></p></div><p className="text-sm font-bold text-slate-600 dark:text-slate-400">{formatCurrency(item.budget)}</p></div><div className="mt-4"><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"><div className={`${getBarColor(percentage)} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div></div><div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mt-2"><span>{percentage}%</span><span>{formatCurrency(item.budget - item.spent)} {t.remaining}</span></div></div></div>)})}</div> </div> };
const Goals = ({ goals, t, onAddGoal }) => { return <div className="space-y-6"> <header className="flex justify-between items-center"> <div> <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.goalsTitle}</h2> <p className="text-slate-600 dark:text-slate-400 mt-1">{t.goalsDesc}</p> </div> <button onClick={onAddGoal} className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"> <PlusCircle className="h-5 w-5 mr-2" />{t.addGoal} </button> </header> <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{(goals || []).map((goal) => { const percentage = goal.target > 0 ? Math.round((goal.saved / goal.target) * 100) : 0; const isAchieved = goal.saved >= goal.target; return (<div key={goal.id} className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between ${isAchieved && 'bg-teal-50 dark:bg-teal-900/50'}`}><div className="flex justify-between items-center"><p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{goal.name}</p>{isAchieved && <span className="text-xs font-bold text-white bg-teal-500 py-1 px-2 rounded-full flex items-center gap-1"><Sparkles className="h-3 w-3" />{t.achieved}</span>}</div><div className="mt-2"><span className="text-sm text-slate-500 dark:text-slate-400">{t.savedAmount}: </span><span className="font-bold text-teal-600 dark:text-teal-400">{formatCurrency(goal.saved)}</span></div><div className="mt-6"><p className="text-right text-sm text-slate-500 dark:text-slate-400">{t.goalAmount}: {formatCurrency(goal.target)}</p><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-2"><div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${Math.min(percentage, 100)}%` }}></div></div><p className="text-right text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">{percentage}%</p></div></div>)})}</div> </div> };

// 4, 5번 수정: 전체내역 필터링 및 날짜 선택 UI 개선
const History = ({ transactions, t, lang }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedTag, setSelectedTag] = useState('');
    const [isStartCalendarOpen, setStartCalendarOpen] = useState(false);
    const [isEndCalendarOpen, setEndCalendarOpen] = useState(false);

    const allTags = useMemo(() => {
        const tags = new Set();
        (transactions || []).forEach(tx => {
            (tx.tags || []).forEach(tag => tags.add(tag));
        });
        return Array.from(tags);
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        return (transactions || [])
            .filter(tx => {
                const txDate = new Date(tx.date);
                if (startDate && txDate < new Date(startDate)) return false;
                if (endDate && txDate > new Date(endDate)) return false;
                if (selectedCategory !== 'All' && tx.category !== selectedCategory) return false;
                if (selectedTag && !(tx.tags || []).includes(selectedTag)) return false;
                
                const searchTermLower = searchTerm.toLowerCase();
                const descMatch = tx.description.toLowerCase().includes(searchTermLower);
                const categoryMatch = tx.category.toLowerCase().includes(searchTermLower);
                const tagsMatch = (tx.tags || []).some(tag => tag.toLowerCase().includes(searchTermLower));
                
                return descMatch || categoryMatch || tagsMatch;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [transactions, startDate, endDate, searchTerm, selectedCategory, selectedTag]);

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.historyTitle}</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{t.historyDesc}</p>
            </header>
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                     <div className="relative">
                        <button onClick={() => setStartCalendarOpen(s => !s)} className="w-full text-left flex items-center gap-2 text-sm font-medium bg-slate-100 dark:bg-slate-700 border border-transparent rounded-lg px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600">
                            <Calendar size={16} /> {startDate || t.startDate}
                        </button>
                        {isStartCalendarOpen && <CustomDatePicker selectedDate={startDate} onDateChange={(date) => { setStartDate(date); setStartCalendarOpen(false); }} onClose={() => setStartCalendarOpen(false)} />}
                    </div>
                    <div className="relative">
                        <button onClick={() => setEndCalendarOpen(e => !e)} className="w-full text-left flex items-center gap-2 text-sm font-medium bg-slate-100 dark:bg-slate-700 border border-transparent rounded-lg px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600">
                           <Calendar size={16} /> {endDate || t.endDate}
                        </button>
                        {isEndCalendarOpen && <CustomDatePicker selectedDate={endDate} onDateChange={(date) => { setEndDate(date); setEndCalendarOpen(false); }} onClose={() => setEndCalendarOpen(false)} />}
                    </div>
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder={t.searchPlaceholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"/>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                     <div>
                        <label className="text-xs text-slate-500">{t.filterByCategory}</label>
                        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500">
                           <option value="All">{t.all}</option>
                           {CATEGORIES[lang].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="text-xs text-slate-500">{t.filterByTag}</label>
                        <select value={selectedTag} onChange={e => setSelectedTag(e.target.value)} className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500">
                           <option value="">{t.all}</option>
                           {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                        </select>
                     </div>
                </div>
                <div className="space-y-2">
                    {filteredTransactions.map(tx => (
                         <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full`} style={{backgroundColor: CATEGORY_COLORS[tx.category] ? `${CATEGORY_COLORS[tx.category]}20` : '#F3F4F6'}}>
                                    {getIcon(tx.category)}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-700 dark:text-slate-300">{tx.description}</p>
                                    <div className="flex items-center gap-2">
                                       <p className="text-sm text-slate-400">{tx.date}</p>
                                       {(tx.tags || []).map(tag => <span key={tag} className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">{tag}</span>)}
                                    </div>
                                </div>
                            </div>
                            <p className={`font-semibold ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>{tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
const Challenges = ({ challenges, userCoupons, rewardSettings, t, lang }) => { return <div className="space-y-6"> <header><div><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.challengesTitle}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.challengesDesc}</p></div></header> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{(challenges || []).map(c => { const isClaimed = (userCoupons || []).some(uc => uc.challengeId === c.id); const reward = (rewardSettings || {})[c.id] || `보상 없음`; return (<div key={c.id} className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-2 ${c.isAchieved ? 'border-amber-400' : 'border-transparent'}`}> <div className="flex items-center gap-4"><Trophy className={`h-10 w-10 ${c.isAchieved ? 'text-amber-500' : 'text-slate-400 dark:text-slate-600'}`}/><div><h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{c.name[lang]}</h3><p className="text-xs text-slate-500 dark:text-slate-400">{t.rewardCoupon}: {reward}</p></div></div> <div className="mt-4"> {c.isAchieved ? ( isClaimed ? ( <button disabled className="w-full py-2 px-4 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed">{t.claimed}</button> ) : ( <button className="w-full py-2 px-4 rounded-lg bg-amber-500 text-white hover:bg-amber-600 font-semibold">{t.claimReward}</button> ) ) : ( <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5"><div className="bg-slate-400 dark:bg-slate-500 h-2.5 rounded-full" style={{width: `${(c.progress / c.target) * 100}%`}}></div></div> )} </div> </div>);})}</div> </div> };
const MyCoupons = ({ coupons, t }) => { return <div className="space-y-6"> <header><div><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.myCouponsTitle}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.myCouponsDesc}</p></div></header> <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"> {(!coupons || coupons.length === 0) ? ( <div className="text-center py-10"><p className="text-slate-500 dark:text-slate-400">{t.noCoupons}</p></div> ) : ( <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{(coupons || []).map(c => ( <div key={c.id} className={`p-6 rounded-xl flex flex-col justify-between ${c.isUsed ? 'bg-slate-100 dark:bg-slate-700' : 'bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/50 dark:to-cyan-900/50'}`}> <div><h3 className={`font-bold text-lg ${c.isUsed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-teal-800 dark:text-teal-200'}`}>{c.name}</h3></div> <div className="mt-4"> {c.isUsed ? <p className="text-center font-bold text-slate-400 dark:text-slate-500 py-2">{t.used}</p> : <button className="w-full py-2 px-4 rounded-lg bg-teal-500 text-white hover:bg-teal-600">{t.useCoupon}</button>} </div> </div> ))}</div> )} </div> </div> };

// 9번 수정: Gemini 리포트 분석 기능 추가 및 그래프 축 문제 개선
const Reports = ({ transactions, t }) => {
    const [analysis, setAnalysis] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleGenerateReport = async () => {
        setIsAnalyzing(true);
        setAnalysis('');
        const prompt = `다음은 나의 한 달간의 거래 내역 데이터입니다: ${JSON.stringify(transactions)}. 이 데이터를 바탕으로 상세한 금융 리포트를 작성해주세요. 다음 항목을 포함해야 합니다: 1. 주요 수입원 분석. 2. 가장 많이 지출한 카테고리 TOP 3와 각 비중. 3. 지난 주 대비 이번 주 소비 변동성. 4. 전반적인 소비 습관에 대한 평가 및 구체적인 절약 팁 2가지. Markdown 형식을 사용해서 명확하고 보기 쉽게 작성해주세요. 한국어로 응답해주세요.`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const result = await response.json();
            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                setAnalysis(result.candidates[0].content.parts[0].text);
            } else {
                setAnalysis(t.analyzingReport + ' 실패');
            }
        } catch (error) {
            console.error("Error fetching Gemini report:", error);
            setAnalysis('오류가 발생했습니다.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    const reportData = useMemo(() => {
        const monthly = (transactions || []).reduce((acc, tx) => {
            const month = new Date(tx.date).toISOString().slice(0, 7);
            if (!acc[month]) acc[month] = { month, income: 0, expense: 0 };
            if (tx.type === 'income') acc[month].income += tx.amount;
            else acc[month].expense += tx.amount;
            return acc;
        }, {});
        return Object.values(monthly).sort((a, b) => a.month.localeCompare(b.month));
    }, [transactions]);

    return (
        <div className="space-y-6">
            <header>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.reportsTitle}</h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{t.reportsDesc}</p>
            </header>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{t.incomeExpenseTrend}</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={reportData} margin={{ top: 5, right: 20, left: 60, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                        <XAxis dataKey="month" tick={{ fill: '#64748b' }} angle={-30} textAnchor="end" height={50} />
                        <YAxis tick={{ fill: '#64748b' }} tickFormatter={(value) => new Intl.NumberFormat('ko-KR', { notation: 'compact' }).format(value)} width={100} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ddd', borderRadius: '10px' }} formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Area type="monotone" dataKey="income" stackId="1" stroke="#2dd4bf" fill="#a7f3d0" name={t.income} />
                        <Area type="monotone" dataKey="expense" stackId="1" stroke="#f43f5e" fill="#fda4af" name={t.expense} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm">
                 <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{t.reportAnalysis}</h3>
                 {!analysis && !isAnalyzing && (
                     <div className="text-center">
                         <p className="text-slate-600 dark:text-slate-300 mb-6">거래 내역을 바탕으로 AI가 심층 분석 리포트를 생성해 드립니다.</p>
                         <button onClick={handleGenerateReport} disabled={isAnalyzing} className="flex mx-auto items-center justify-center bg-indigo-500 text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:bg-indigo-600 transition-colors disabled:bg-indigo-300">
                             <Sparkles className="h-5 w-5 mr-2" />{t.generateReport}
                         </button>
                     </div>
                 )}
                 {isAnalyzing && (
                     <div className="text-center p-8">
                         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                         <p className="mt-4 text-slate-500 dark:text-slate-400">{t.analyzingReport}</p>
                     </div>
                 )}
                 {analysis && (
                     <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">{analysis}</div>
                 )}
            </div>
        </div>
    );
};
const SettingsPage = ({ t, setLanguage, allChallenges, rewardSettings, lang, isAdmin }) => { return ( <div className="space-y-6"> <header><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.settingsTitle}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.settingsDesc}</p></header> {isAdmin && <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm"><h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">{t.couponManagement}</h3><p className="text-slate-600 dark:text-slate-400 mb-4">{t.couponManagementDesc}</p><div className="space-y-4 max-h-96 overflow-y-auto pr-2">{(allChallenges || []).map(c => (<div key={c.id} className="grid grid-cols-2 gap-4 items-center"><label htmlFor={`reward-${c.id}`} className="text-sm font-medium text-slate-700 dark:text-slate-300">{c.name[lang]}</label><input id={`reward-${c.id}`} type="text" value={(rewardSettings || {})[c.id] || ''} placeholder={t.couponNamePlaceholder} className="block w-full bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-md shadow-sm p-2 text-sm"/></div>))}</div></div>} <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm"><h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">{t.language}</h3><div className="flex gap-4"><button onClick={() => setLanguage('ko')} className="flex items-center justify-center gap-2 flex-1 p-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">🇰🇷 한국어</button><button onClick={() => setLanguage('en')} className="flex items-center justify-center gap-2 flex-1 p-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">🇺🇸 English</button><button onClick={() => setLanguage('ja')} className="flex items-center justify-center gap-2 flex-1 p-3 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600">🇯🇵 日本語</button></div></div> </div> ); };
const FinancialCoachModal = ({ isOpen, onClose, t, transactions }) => { const [isLoading, setIsLoading] = useState(false); const [advice, setAdvice] = useState(''); const handleGetAdvice = async () => { setIsLoading(true); setAdvice(''); const recentTx = transactions.slice(-20); const prompt = `다음은 나의 최근 소비 내역입니다: ${JSON.stringify(recentTx)}. 이 소비 패턴을 분석해서, 돈을 절약할 수 있는 구체적이고 실행 가능한 팁 3가지를 한국어로 알려주세요. 각 팁은 제목과 설명으로 구성해주세요.`; try { const chatHistory = [{ role: "user", parts: [{ text: prompt }] }]; const payload = { contents: chatHistory }; const apiKey = ""; const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); const result = await response.json(); if (result.candidates?.[0]?.content?.parts?.[0]?.text) { setAdvice(result.candidates[0].content.parts[0].text); } else { setAdvice('조언을 생성하는 데 실패했습니다. 다시 시도해주세요.'); } } catch (error) { console.error("Error fetching Gemini advice:", error); setAdvice('오류가 발생했습니다. 네트워크 연결을 확인해주세요.'); } finally { setIsLoading(false); } }; return ( <Modal isOpen={isOpen} onClose={onClose} title={t.coachModalTitle}> {isLoading ? ( <div className="text-center p-8"> <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div> <p className="mt-4 text-slate-500 dark:text-slate-400">{t.analyzing}</p> </div> ) : advice ? ( <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{advice}</div> ) : ( <div className="text-center"> <p className="text-slate-600 dark:text-slate-300 mb-6">최근 소비 내역을 바탕으로 AI가 맞춤형 재정 조언을 해드립니다.</p> <button onClick={handleGetAdvice} className="w-full flex justify-center items-center bg-teal-500 text-white font-semibold py-3 px-4 rounded-lg shadow-sm hover:bg-teal-600 transition-colors"> <Sparkles className="h-5 w-5 mr-2" />{t.getAdvice} </button> </div> )} </Modal> ); };
const AddTransactionModal = ({ isOpen, onClose, onSubmit, assets, t, prefilledAsset, lang }) => { const handleSubmit = (e) => { e.preventDefault(); const formData = new FormData(e.target); const data = { type: formData.get('type'), date: formData.get('date'), description: formData.get('description'), amount: parseFloat(formData.get('amount')), category: formData.get('category'), assetId: formData.get('assetId'), tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(Boolean), }; onSubmit(data); }; return ( <Modal isOpen={isOpen} onClose={onClose} title={t.newTransaction}> <form onSubmit={handleSubmit} className="space-y-4"> <div className="grid grid-cols-2 gap-4"> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.transactionType}</label><select name="type" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="expense">{t.expense}</option><option value="income">{t.income}</option></select></div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.date}</label><input type="date" name="date" defaultValue={new Date().toISOString().substring(0, 10)} required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div> </div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.description}</label><input type="text" name="description" placeholder="예: 스타벅스 커피" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div> <div className="grid grid-cols-2 gap-4"> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.category}</label><select name="category" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="">{t.select}</option>{CATEGORIES[lang].map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.amount}</label><input type="number" name="amount" placeholder="5000" step="1" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div> </div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.asset}</label><select name="assetId" defaultValue={prefilledAsset || ""} required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="">{t.select}</option>{(assets || []).map(asset => <option key={asset.id} value={asset.id}>{asset.name}</option>)}</select></div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.tags}</label><input type="text" name="tags" placeholder="예: #카페, #기분전환" className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div> <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">{t.cancel}</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 shadow-sm">{t.add}</button></div> </form> </Modal> ); };

// 7번 수정: 자산 아이콘 종류 추가
const AddAssetModal = ({ isOpen, onClose, onSubmit, t }) => { const handleSubmit = (e) => { e.preventDefault(); const formData = new FormData(e.target); const data = { name: formData.get('name'), type: formData.get('type'), balance: parseFloat(formData.get('balance')), }; onSubmit(data); }; return (<Modal isOpen={isOpen} onClose={onClose} title={t.newAsset}><form onSubmit={handleSubmit} className="space-y-4"><div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.assetName}</label><input type="text" name="name" placeholder="예: 내 월급 통장" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div><div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.assetType}</label><select name="type" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="bank">{t.bank}</option><option value="card">{t.card}</option><option value="cash">{t.cash}</option><option value="stock">{t.stock}</option><option value="crypto">{t.crypto}</option><option value="realEstate">{t.realEstate}</option><option value="insurance">{t.insurance}</option><option value="liability">{t.liability}</option></select></div><div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.initialBalance}</label><input type="number" name="balance" placeholder="부채는 마이너스(-)로 입력" step="1" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div><div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">{t.cancel}</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 shadow-sm">{t.add}</button></div></form></Modal>); };
const AddRecurringModal = ({ isOpen, onClose, onSubmit, t, lang }) => { const handleSubmit = (e) => { e.preventDefault(); const formData = new FormData(e.target); const data = { name: formData.get('name'), amount: parseFloat(formData.get('amount')), category: formData.get('category'), nextDueDate: formData.get('nextDueDate'), type: formData.get('type') }; onSubmit(data); }; return ( <Modal isOpen={isOpen} onClose={onClose} title={t.newRecurring}> <form onSubmit={handleSubmit} className="space-y-4"> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.recurringName}</label><input type="text" name="name" placeholder="예: 넷플릭스 구독료" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div> <div className="grid grid-cols-2 gap-4"> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.amount}</label><input type="number" name="amount" placeholder="17000" step="1" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.transactionType}</label><select name="type" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="expense">{t.expense}</option><option value="income">{t.income}</option></select></div> </div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.category}</label><select name="category" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="">{t.select}</option>{CATEGORIES[lang].map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.nextDueDate}</label><input type="date" name="nextDueDate" defaultValue={new Date().toISOString().substring(0, 10)} required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div> <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">{t.cancel}</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 shadow-sm">{t.add}</button></div> </form> </Modal> ); };
const AddBudgetModal = ({ isOpen, onClose, onSubmit, t, lang }) => { const handleSubmit = (e) => { e.preventDefault(); const formData = new FormData(e.target); const data = { category: formData.get('category'), budget: parseFloat(formData.get('budget')), spent: 0, id: `bud-mock-${Date.now()}` }; onSubmit(data); }; return ( <Modal isOpen={isOpen} onClose={onClose} title={t.newBudget}> <form onSubmit={handleSubmit} className="space-y-4"> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.category}</label><select name="category" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="">{t.select}</option>{CATEGORIES[lang].filter(c => !['급여', '용돈', 'Salary', 'Allowance', '給料', 'お小遣い']).map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.budgetAmount}</label><input type="number" name="budget" placeholder="300000" step="1" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div> <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">{t.cancel}</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 shadow-sm">{t.add}</button></div> </form> </Modal> ); };
const AddGoalModal = ({ isOpen, onClose, onSubmit, t }) => { const [goalName, setGoalName] = useState(''); const [targetAmount, setTargetAmount] = useState(''); const [plan, setPlan] = useState(''); const [isGenerating, setIsGenerating] = useState(false); const handleGeneratePlan = async () => { if (!goalName || !targetAmount) { alert('목표 이름과 목표 금액을 먼저 입력해주세요.'); return; } setIsGenerating(true); setPlan(''); const prompt = `저의 재무 목표는 '${goalName}'을 위해 '${targetAmount}원'을 모으는 것입니다. 이 목표를 달성하기 위한 간단하고 실행 가능한 저축 계획을 3-5단계로 세워주세요. 각 단계는 구체적인 행동을 포함해야 합니다. 한국어로 응답해주세요.`; try { const chatHistory = [{ role: "user", parts: [{ text: prompt }] }]; const payload = { contents: chatHistory }; const apiKey = ""; const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`; const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); const result = await response.json(); if (result.candidates?.[0]?.content?.parts?.[0]?.text) { setPlan(result.candidates[0].content.parts[0].text); } else { setPlan('계획을 생성하는 데 실패했습니다.'); } } catch (error) { setPlan('오류가 발생했습니다.'); } finally { setIsGenerating(false); } }; const handleSubmit = (e) => { e.preventDefault(); onSubmit({ name: goalName, target: parseFloat(targetAmount), saved: 0, plan: plan, id: `goal-mock-${Date.now()}` }); }; return ( <Modal isOpen={isOpen} onClose={onClose} title={t.newGoal}> <form onSubmit={handleSubmit} className="space-y-4"> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.goalName}</label><input type="text" value={goalName} onChange={e => setGoalName(e.target.value)} placeholder="예: 유럽 여행 가기" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.targetAmount}</label><input type="number" value={targetAmount} onChange={e => setTargetAmount(e.target.value)} placeholder="5000000" step="1" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div> <div className="pt-2"> <button type="button" onClick={handleGeneratePlan} disabled={isGenerating} className="w-full flex justify-center items-center bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-indigo-600 transition-colors disabled:bg-indigo-300"> {isGenerating ? t.generatingPlan : t.createSavingsPlan} </button> </div> {plan && ( <div> <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.savingsPlan}</label> <textarea readOnly value={plan} rows="5" className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent text-sm"></textarea> </div> )} <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">{t.cancel}</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 shadow-sm">{t.add}</button></div> </form> </Modal> ); };

// --- Main Application ---
export default function App() {
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('ko');
  const [currentUserKey, setCurrentUserKey] = useState('invitedUser1');
  const [activeView, setActiveView] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({ transaction: false, asset: false, recurring: false, budget: false, goal: false, coach: false });
  const [prefilledAsset, setPrefilledAsset] = useState(null);

  // 12번 수정: 다크/라이트 모드 스위칭 로직 개선
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    setIsLoading(true);
    // In a real app, this would be an API call or Firestore listener
    const storedData = JSON.parse(localStorage.getItem(currentUserKey));
    const dataToUse = storedData || initialAppData[currentUserKey];
    const fullData = { ...initialAppData[currentUserKey], ...dataToUse };
    setTimeout(() => {
      setUserData(fullData);
      setIsLoading(false);
    }, 300);
  }, [currentUserKey]);

  const currentT = useMemo(() => translations[lang] || translations['ko'], [lang]);
  
  const openModal = (modalName) => setModalState(prev => ({ ...prev, [modalName]: true }));
  const closeModal = (modalName) => {
      setModalState(prev => ({ ...prev, [modalName]: false }));
      if(modalName === 'transaction') setPrefilledAsset(null);
  };
  
  const handleAddTransactionForAsset = (assetId) => {
      setPrefilledAsset(assetId);
      openModal('transaction');
  };

  const handleAddData = (collectionName, data) => {
    // In a real app, you'd use addDoc from Firestore here
    const modalKey = collectionName.replace(/s$/, '').replace('Transactio', 'transactio');
    const newItem = { ...data, id: `mock-${collectionName}-${Date.now()}` };
    
    let updatedData = { ...userData, [collectionName]: [...(userData[collectionName] || []), newItem] };

    if (collectionName === 'transactions') {
        const assetIndex = updatedData.assets.findIndex(a => a.id === newItem.assetId);
        if (assetIndex > -1) {
            const asset = updatedData.assets[assetIndex];
            const newBalance = newItem.type === 'income' ? asset.balance + newItem.amount : asset.balance - newItem.amount;
            updatedData.assets[assetIndex] = { ...asset, balance: newBalance };
        }
        if (newItem.type === 'expense') {
            const budgetIndex = updatedData.budgets.findIndex(b => b.category === newItem.category);
            if (budgetIndex > -1) {
                const budget = updatedData.budgets[budgetIndex];
                updatedData.budgets[budgetIndex] = { ...budget, spent: budget.spent + newItem.amount };
            }
        }
    }
    
    localStorage.setItem(currentUserKey, JSON.stringify(updatedData));
    setUserData(updatedData);
    closeModal(modalKey);
  };
  
  const renderContent = () => {
    if (isLoading || !userData) {
      return <div className="w-full h-full flex items-center justify-center"><p className="text-slate-500">{currentT.loading}</p></div>;
    }
    
    switch (activeView) {
      case 'dashboard': return <Dashboard userData={userData} t={currentT} onAddTransaction={() => openModal('transaction')} setActiveView={setActiveView} openCoachModal={() => openModal('coach')} />;
      case 'history': return <History transactions={userData.transactions} t={currentT} lang={lang} />;
      case 'assets': return <Assets assets={userData.assets} t={currentT} onAddAsset={() => openModal('asset')} onAddTransactionForAsset={handleAddTransactionForAsset} />;
      case 'recurring': return <RecurringTransactions recurring={userData.recurringTransactions} t={currentT} onAddRecurring={() => openModal('recurring')} />;
      case 'budgets': return <Budgets budgets={userData.budgets} t={currentT} onAddBudget={() => openModal('budget')} />;
      case 'goals': return <Goals goals={userData.goals} t={currentT} onAddGoal={() => openModal('goal')} />;
      case 'challenges': return <Challenges challenges={userData.challenges} userCoupons={userData.userCoupons} rewardSettings={userData.rewardSettings} t={currentT} lang={lang} />;
      case 'myCoupons': return <MyCoupons coupons={userData.userCoupons} t={currentT} />;
      case 'reports': return <Reports transactions={userData.transactions} t={currentT} />;
      case 'settings': return <SettingsPage t={currentT} setLanguage={setLang} allChallenges={allChallenges} rewardSettings={userData.rewardSettings} lang={lang} isAdmin={currentUserKey === 'admin'} />;
      default: return <Dashboard userData={userData} t={currentT} onAddTransaction={() => openModal('transaction')} setActiveView={setActiveView} openCoachModal={() => openModal('coach')} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 font-sans">
      <Sidebar activeView={activeView} setActiveView={setActiveView} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} t={currentT} currentUser={userData} setCurrentUser={setCurrentUserKey} theme={theme} setTheme={setTheme} />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
        {renderContent()}
      </main>

      <FinancialCoachModal isOpen={modalState.coach} onClose={() => closeModal('coach')} t={currentT} transactions={userData?.transactions || []} />
      <AddTransactionModal isOpen={modalState.transaction} onClose={() => closeModal('transaction')} onSubmit={(data) => handleAddData('transactions', data)} assets={userData?.assets || []} t={currentT} prefilledAsset={prefilledAsset} lang={lang} />
      <AddAssetModal isOpen={modalState.asset} onClose={() => closeModal('asset')} onSubmit={(data) => handleAddData('assets', data)} t={currentT} />
      <AddRecurringModal isOpen={modalState.recurring} onClose={() => closeModal('recurring')} onSubmit={(data) => handleAddData('recurringTransactions', data)} t={currentT} lang={lang} />
      <AddBudgetModal isOpen={modalState.budget} onClose={() => closeModal('budget')} onSubmit={(data) => handleAddData('budgets', data)} t={currentT} lang={lang} />
      <AddGoalModal isOpen={modalState.goal} onClose={() => closeModal('goal')} onSubmit={(data) => handleAddData('goals', data)} t={currentT} />
    </div>
  );
}
