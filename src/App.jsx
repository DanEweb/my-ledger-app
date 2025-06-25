import React, { useState, useMemo, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChevronsLeft, ChevronsRight, PlusCircle, CreditCard, Home, ShoppingCart, Utensils, Zap, Repeat, Target, Settings, LayoutDashboard, Wallet, FileOutput, Landmark, Trophy, Gift, Sparkles, User, Tag, TrendingUp, TrendingDown, CircleDollarSign, Sun, Moon, Search, X, Calendar, MoreHorizontal, Bot, ChevronLeft, ChevronRight, PiggyBank, BarChart2, Briefcase, Pill, GraduationCap, Popcorn, Building, ShieldCheck, AlertTriangle, Tv, Bus, Car, Coffee, Gamepad2, Heart, Music, Phone, Plane, School, Train, TreePalm, Video, Wifi, Wind } from 'lucide-react';

// --- 다국어 지원 / Multi-language Support ---
const translations = {
  ko: {
    appName: '가계부', myLedger: '내 가계부', adminMode: '관리자 모드', dashboard: '대시보드', assets: '자산·부채', recurring: '고정 지출/수입', budgets: '예산', goals: '재무 목표', history: '전체 내역',
    challenges: '챌린지', reports: '리포트', settings: '설정', myCoupons: '내 쿠폰함',
    theme: '테마', lightMode: '라이트 모드', darkMode: '다크 모드',
    dashboardWelcome: '안녕하세요, {name}님! 자산 현황을 요약해 드릴게요.', addTransaction: '내역 추가', totalAssets: '총 자산', income: '수입', expense: '지출', recentHistory: '최근 내역', searchPlaceholder: '내역 검색...',
    assetsTitle: '자산 및 부채 관리', assetsDesc: '전체 자산과 부채 목록입니다.', addAsset: '새 자산/부채 추가',
    recurringTitle: '고정 지출/수입 관리', recurringDesc: '매월 반복되는 수입/지출 목록입니다.', addRecurring: '새 고정 내역 추가', nextPayment: '다음 예정일', 
    budgetsTitle: '예산 관리', budgetsDesc: '카테고리별 예산을 설정하고 지출을 관리하세요.', addBudget: '새 예산 추가', spent: '지출', remaining: '남음', budgetExceeded: '예산 초과!',
    goalsTitle: '재무 목표', goalsDesc: '목표를 설정하고 달성 과정을 추적해 보세요.', addGoal: '새 목표 추가', goalAmount: '목표 금액', savedAmount: '모은 금액', achieved: '달성!',
    historyTitle: '전체 내역 보기', historyDesc: '모든 수입/지출 내역을 검색하고 관리하세요.', allHistory: '전체 내역', showMore: '더보기',
    challengesTitle: '저축 챌린지 & 보상', challengesDesc: '챌린지를 달성하고 직접 설정한 보상을 획득하세요!',
    reportsTitle: '리포트', reportsDesc: '금융 데이터를 심층적으로 분석하고 확인하세요.', incomeExpenseTrend: '기간별 수입/지출 추이',
    settingsTitle: '설정', settingsDesc: '계정 정보, 언어 및 데이터를 관리합니다.', language: '언어',
    newTransaction: '새 내역', transactionType: '종류', date: '날짜', description: '내용', category: '카테고리', amount: '금액', asset: '자산', tags: '태그 (쉼표로 구분)', cancel: '취소', add: '추가',
    newAsset: '새 자산/부채', assetName: '항목 이름', assetType: '자산 종류', liability: '부채', initialBalance: '초기 금액/부채 총액', bank: '은행', card: '카드', cash: '현금', stock: '주식', crypto: '암호화폐', realEstate: '부동산', insurance: '보험',
    newRecurring: '새 고정 내역', recurringName: '항목 이름', paymentCycle: '주기', monthly: '매월', nextDueDate: '다음 예정일', icon: '아이콘',
    newBudget: '새 예산', budgetAmount: '예산 금액', categoryName: '카테고리명 (직접 입력)',
    newGoal: '새 목표', goalName: '목표 이름', targetAmount: '목표 금액',
    loading: '데이터를 불러오는 중...', select: '선택하세요',
    startDate: '시작일', endDate: '종료일',
    netAssets: '순자산', totalBudget: '총 예산', budgetUsage: '예산 사용률', upcomingPayments: '다가오는 고정 지출',
    expenseByCategory: '카테고리별 지출 분석',
    aiFinancialCoach: 'AI 재정 분석', coachModalTitle: 'AI 재정 분석 리포트', getAdvice: '분석 및 조언 받기', analyzing: '당신의 소비 패턴을 분석중입니다...',
    filterByCategory: '카테고리 필터', filterByTag: '태그 필터', all: '전체',
    reportAnalysis: 'AI 리포트 분석', generateReport: '리포트 생성하기', analyzingReport: '리포트를 분석하고 있습니다...',
    noUpcomingPayments: '다가오는 고정 지출이 없습니다.', noBudgets: '설정된 예산이 없습니다.', budgetVisualizer: '예산 현황 시각화',
  },
  en: {
    appName: 'Ledger', myLedger: 'My Ledger', adminMode: 'Admin Mode', dashboard: 'Dashboard', assets: 'Assets & Liabilities', recurring: 'Recurring', budgets: 'Budgets', goals: 'Goals', history: 'History',
    challenges: 'Challenges', reports: 'Reports', settings: 'Settings', myCoupons: 'My Coupons',
    theme: 'Theme', lightMode: 'Light Mode', darkMode: 'Dark Mode',
    dashboardWelcome: 'Hello, {name}! Here\'s a summary of your financial status.', addTransaction: 'Add Transaction', totalAssets: 'Total Assets', income: 'Income', expense: 'Expense', recentHistory: 'Recent History', searchPlaceholder: 'Search transactions...',
    assetsTitle: 'Manage Assets & Liabilities', assetsDesc: 'This is a list of all your assets and liabilities.', addAsset: 'Add New Asset/Liability',
    recurringTitle: 'Manage Recurring Transactions', recurringDesc: 'This is a list of your monthly recurring income/expenses.', addRecurring: 'Add Recurring Item', nextPayment: 'Next due date',
    budgetsTitle: 'Budget Management', budgetsDesc: 'Set budgets by category and manage your spending.', addBudget: 'Add New Budget', spent: 'Spent', remaining: 'Remaining', budgetExceeded: 'Budget Exceeded!',
    goalsTitle: 'Financial Goals', goalsDesc: 'Set your goals and track your progress.', addGoal: 'Add New Goal', goalAmount: 'Goal Amount', savedAmount: 'Amount Saved', achieved: 'Achieved!',
    historyTitle: 'View All History', historyDesc: 'Search and manage all your income/expense history.', allHistory: 'All History', showMore: 'Show More',
    challengesTitle: 'Savings Challenges & Rewards', challengesDesc: 'Complete challenges and earn self-set rewards!',
    reportsTitle: 'Reports', reportsDesc: 'Analyze and check your financial data in depth.', incomeExpenseTrend: 'Income/Expense Trend by Period',
    settingsTitle: 'Settings', settingsDesc: 'Manage your account information, language, and data.', language: 'Language',
    newTransaction: 'New Transaction', transactionType: 'Type', date: 'Date', description: 'Description', category: 'Category', amount: 'Amount', asset: 'Asset', tags: 'Tags (comma-separated)', cancel: 'Cancel', add: 'Add',
    newAsset: 'New Asset/Liability', assetName: 'Item Name', assetType: 'Asset Type', liability: 'Liability', initialBalance: 'Initial Balance/Total Debt', bank: 'Bank', card: 'Card', cash: 'Cash', stock: 'Stock', crypto: 'Crypto', realEstate: 'Real Estate', insurance: 'Insurance',
    newRecurring: 'New Recurring Item', recurringName: 'Item Name', paymentCycle: 'Cycle', monthly: 'Monthly', nextDueDate: 'Next Due Date', icon: 'Icon',
    newBudget: 'New Budget', budgetAmount: 'Budget Amount', categoryName: 'Category Name (Custom)',
    newGoal: 'New Goal', goalName: 'Goal Name', targetAmount: 'Target Amount',
    loading: 'Loading data...', select: 'Select...',
    startDate: 'Start Date', endDate: 'End Date',
    netAssets: 'Net Assets', totalBudget: 'Total Budget', budgetUsage: 'Budget Usage', upcomingPayments: 'Upcoming Payments',
    expenseByCategory: 'Expense Analysis by Category',
    aiFinancialCoach: 'AI Financial Analysis', coachModalTitle: 'AI Financial Analysis Report', getAdvice: 'Get Analysis & Advice', analyzing: 'Analyzing your spending patterns...',
    filterByCategory: 'Filter by Category', filterByTag: 'Filter by Tag', all: 'All',
    reportAnalysis: 'AI Report Analysis', generateReport: 'Generate Report', analyzingReport: 'Analyzing report...',
    noUpcomingPayments: 'No upcoming recurring payments.', noBudgets: 'No budgets set.', budgetVisualizer: 'Budget Status Visualization',
  },
  ja: {
    appName: '家計簿', myLedger: '私の家計簿', adminMode: '管理者モード', dashboard: 'ダッシュボード', assets: '資産・負債', recurring: '固定支出/収入', budgets: '予算', goals: '財務目標', history: '全履歴',
    challenges: 'チャレンジ', reports: 'レポート', settings: '設定', myCoupons: 'マイクーポン',
    theme: 'テーマ', lightMode: 'ライトモード', darkMode: 'ダークモード',
    dashboardWelcome: '{name}さん、こんにちは！資産状況の概要です。', addTransaction: '履歴追加', totalAssets: '総資産', income: '収入', expense: '支出', recentHistory: '最近の履歴', searchPlaceholder: '履歴を検索...',
    assetsTitle: '資産・負債の管理', assetsDesc: 'すべての資産と負債のリストです。', addAsset: '新しい資産/負債を追加',
    recurringTitle: '固定支出/収入の管理', recurringDesc: '毎月繰り返される収入/支出のリストです。', addRecurring: '新しい固定履歴を追加', nextPayment: '次の予定日',
    budgetsTitle: '予算管理', budgetsDesc: 'カテゴリー別に予算を設定し、支出を管理します。', addBudget: '新しい予算を追加', spent: '支出', remaining: '残り', budgetExceeded: '予算超過！',
    goalsTitle: '財務目標', goalsDesc: '目標を設定し、達成過程を追跡します。', addGoal: '新しい目標を追加', goalAmount: '目標金額', savedAmount: '貯金額', achieved: '達成！',
    historyTitle: '全履歴を見る', historyDesc: 'すべての収入/支出履歴を検索・管理します。', allHistory: '全履歴', showMore: 'もっと見る',
    challengesTitle: '貯蓄チャレンジ＆報酬', challengesDesc: 'チャレンジを達成し、自分で設定した報酬を獲得しましょう！',
    reportsTitle: 'レポート', reportsDesc: '財務データを詳細に分析・確認します。', incomeExpenseTrend: '期間別収入/支出推移',
    settingsTitle: '設定', settingsDesc: 'アカウント情報、言語、データを管理します。', language: '言語',
    newTransaction: '新しい履歴', transactionType: '種類', date: '日付', description: '内容', category: 'カテゴリー', amount: '金額', asset: '資産', tags: 'タグ (カンマ区切り)', cancel: 'キャンセル', add: '追加',
    newAsset: '新しい資産/負債', assetName: '項目名', assetType: '資産種類', liability: '負債', initialBalance: '初期金額/負債総額', bank: '銀行', card: 'カード', cash: '現金', stock: '株式', crypto: '暗号資産', realEstate: '不動産', insurance: '保険',
    newRecurring: '新しい固定履歴', recurringName: '項目名', paymentCycle: '周期', monthly: '毎月', nextDueDate: '次の予定日', icon: 'アイコン',
    newBudget: '新しい予算', budgetAmount: '予算金額', categoryName: 'カテゴリー名（カスタム）',
    newGoal: '新しい目標', goalName: '目標名', targetAmount: '目標金額',
    loading: 'データを読み込み中...', select: '選択してください',
    startDate: '開始日', endDate: '終了日',
    netAssets: '純資産', totalBudget: '総予算', budgetUsage: '予算使用率', upcomingPayments: '今後の固定支出',
    expenseByCategory: 'カテゴリー別支出分析',
    aiFinancialCoach: 'AI財務分析', coachModalTitle: 'AI財務分析レポート', getAdvice: '分析と助言を得る', analyzing: 'あなたの消費パターンを分析中です...',
    filterByCategory: 'カテゴリーで絞り込み', filterByTag: 'タグで絞り込み', all: 'すべて',
    reportAnalysis: 'AIレポート分析', generateReport: 'レポート生成', analyzingReport: 'レポートを分析しています...',
    noUpcomingPayments: '今後の固定支出はありません。', noBudgets: '予算が設定されていません。', budgetVisualizer: '予算状況の可視化',
  }
};

const CATEGORIES = {
    ko: ['급여', '용돈', '사업소득', '식비', '쇼핑', '교통', '주거', '구독', '의료', '교육', '경조사', '엔터테인먼트', '기타'],
    en: ['Salary', 'Allowance', 'Business Income', 'Food', 'Shopping', 'Transport', 'Housing', 'Subscription', 'Medical', 'Education', 'Events', 'Entertainment', 'Other'],
    ja: ['給料', 'お小遣い', '事業所得', '食費', 'ショッピング', '交通', '住居', 'サブスク', '医療', '教育', '冠婚葬祭', 'エンタメ', 'その他']
};

// 14번 수정: 챌린지 데이터 업데이트
const allChallenges = [
  { "icon": "🌱", "name": "새싹 저축가", "condition": "첫 거래 내역 작성" },
  { "icon": "✍️", "name": "기록의 시작", "condition": "7일 연속 가계부 작성" },
  { "icon": "🗓️", "name": "꾸준함의 대가", "condition": "30일 연속 가계부 작성" },
  { "icon": "☀️", "name": "무지출의 신", "condition": "하루 동안 지출 0원 달성" },
  { "icon": "☕️", "name": "커피값 절약왕", "condition": "5일 연속 카페 지출 없이 보내기" },
  { "icon": "🚕", "name": "택시비 방어자", "condition": "한 달 동안 택시 이용 안 하기" },
  { "icon": "🥡", "name": "배달음식 브레이커", "condition": "2주 연속 배달음식 지출 없이 보내기" },
  { "icon": "🛒", "name": "충동구매 방지턱", "condition": "1주일간 '쇼핑' 카테고리 지출 없이 보내기" },
  { "icon": "🎯", "name": "목표 슬레이어", "condition": "첫 재무 목표 100% 달성" },
  { "icon": "🏹", "name": "명사수", "condition": "예산의 80% 이하로 지출 달성 (월)" },
  { "icon": "🛡️", "name": "예산 가디언", "condition": "3개월 연속 모든 예산 지키기" },
  { "icon": "💰", "name": "100만원 클럽", "condition": "순자산 100만원 돌파" },
  { "icon": "💵", "name": "500만원 클럽", "condition": "순자산 500만원 돌파" },
  { "icon": "🏦", "name": "1000만원 클럽", "condition": "순자산 1000만원 돌파" },
  { "icon": "🚀", "name": "5000만원 클럽", "condition": "순자산 5000만원 돌파" },
  { "icon": "💎", "name": "1억 클럽", "condition": "순자산 1억원 돌파" },
  { "icon": "📈", "name": "우상향 그래프", "condition": "3개월 연속 순자산 증가" },
  { "icon": "📊", "name": "분석의 달인", "condition": "리포트 기능 첫 사용" },
  { "icon": "�", "name": "자동화의 천재", "condition": "정기 거래 첫 등록" },
  { "icon": "💼", "name": "자산 관리사", "condition": "3개 이상 자산 등록" },
  { "icon": "📑", "name": "부채 정복자", "condition": "대출 항목 첫 등록 및 상환 시작" },
  { "icon": "🕊️", "name": "부채 제로", "condition": "등록된 대출 항목 모두 상환 완료" },
  { "icon": "💯", "name": "만점 저축", "condition": "한 달 수입의 50% 이상 저축" },
  { "icon": "🧑‍🍳", "name": "집밥의 왕", "condition": "한 달 식비 예산 50% 이하 사용" },
  { "icon": "🤓", "name": "재테크 꿈나무", "condition": "'금융' 관련 서적 구매 또는 강의 수강" },
  { "icon": "🎁", "name": "선물 장인", "condition": "'경조사/선물' 비용 계획적으로 사용" },
  { "icon": "🧘", "name": "마인드 컨트롤", "condition": "계획에 없던 지출 3번 참기" },
  { "icon": "🏃", "name": "건강과 절약", "condition": "운동 관련 지출(헬스장 등) 꾸준히 하기" },
  { "icon": "📚", "name": "지식 투자자", "condition": "자기계발(책, 강의)에 꾸준히 투자" },
  { "icon": "♻️", "name": "에코 세이버", "condition": "중고 거래로 5만원 이상 절약 또는 수익" },
  { "icon": "🛠️", "name": "DIY 마스터", "condition": "직접 수리/제작하여 3만원 이상 절약" },
  { "icon": "💡", "name": "현명한 소비자", "condition": "쿠폰/포인트 사용하여 1만원 이상 할인받기" },
  { "icon": "🐷", "name": "저금통 채우기", "condition": "매일 1000원씩 한 달 저축 성공" },
  { "icon": "⏳", "name": "타임 캡슐", "condition": "1년 전 오늘보다 순자산 증가" },
  { "icon": "📅", "name": "6개월의 기록", "condition": "6개월 연속 가계부 작성" },
  { "icon": "📆", "name": "1년의 기록", "condition": "1년 연속 가계부 작성" },
  { "icon": "🌅", "name": "얼리버드", "condition": "오전 7시 이전에 거래내역 10회 기록" },
  { "icon": "🌃", "name": "나이트 아울", "condition": "오후 11시 이후에 거래내역 10회 기록" },
  { "icon": "🤝", "name": "기부 천사", "condition": "'기부' 카테고리 지출 5회 달성" },
  { "icon": "✈️", "name": "여행 플래너", "condition": "'여행' 관련 재무 목표 생성" },
  { "icon": "🧑‍💻", "name": "디지털 노마드", "condition": "온라인 부수입 첫 기록" },
  { "icon": "💸", "name": "짠테크 고수", "condition": "한 달 생활비 50만원 이하 달성 (주거비 제외)" },
  { "icon": "🏷️", "name": "태그 마스터", "condition": "10개 이상의 다른 태그 사용" },
  { "icon": "📝", "name": "메모의 달인", "condition": "거래 내역에 메모 20회 이상 작성" },
  { "icon": "🚨", "name": "비상금 완비", "condition": "비상금 목표 100% 달성" },
  { "icon": "🏠", "name": "내 집 마련의 꿈", "condition": "주택 관련 재무 목표 생성" },
  { "icon": "🚗", "name": "마이카 드림", "condition": "자동차 관련 재무 목표 생성" },
  { "icon": "📦", "name": "창고 대방출", "condition": "1년간 사용 안 한 물건 팔아서 수익내기" },
  { "icon": "📵", "name": "디지털 디톡스", "condition": "쇼핑 앱 사용 시간 줄이고 저축하기" },
  { "icon": "🏆", "name": "저축 마스터", "condition": "15개 이상 챌린지 완료" },
  { "icon": "👑", "name": "금융의 지배자", "condition": "30개 이상 챌린지 완료" }
].map((c, i) => ({ ...c, id: `chal-${i+1}`, progress: 0, isAchieved: false, target: 1 }));


// --- 임시 목업 데이터 ---
const initialAppData = {
  admin: { 
    id: 'admin', name: '김민준 (관리자)',
    assets: [ { id: 'asset-1', name: '주거래 은행', balance: 50000000, type: 'bank'}, { id: 'asset-debt-1', name: '학자금 대출', balance: -15000000, type: 'liability'} ], 
    transactions: [ {id: 'tx-1', date: '2025-06-25', description: '월급', category: '급여', amount: 5000000, type: 'income', assetId: 'asset-1', tags: ['#월급날']}, {id: 'tx-a2', date: '2025-06-25', description: '점심 식사', category: '식비', amount: 12000, type: 'expense', assetId: 'asset-1', tags: ['#회사앞', '#맛집']} ], 
    recurringTransactions: [{id: 'rec-1', name: '월세', amount: 550000, type: 'expense', category: '주거', nextDueDate: '2025-07-01', icon: 'Home'}, {id: 'rec-ott', name: 'OTT 구독료', amount: 17000, type: 'expense', category: '구독', nextDueDate: '2025-07-15', icon: 'Tv'}], 
    budgets: [{id: 'bud-1', category: '식비', budget: 400000, spent: 150000, icon: 'Utensils' }], 
    goals: [{id: 'goal-1', name: '유럽 여행', target: 5000000, saved: 1200000, icon: 'Plane' }], 
    challenges: allChallenges,
  },
  invitedUser1: { 
    id: 'user1', name: '이수진',
    assets: [{ id: 'asset-2', name: '용돈 계좌', balance: 500000, type: 'bank'}], 
    transactions: [{id: 'tx-2', date: '2025-06-24', description: '문구류 구매', category: '쇼핑', amount: 15000, type: 'expense', assetId: 'asset-2', tags: ['#다꾸']}], 
    recurringTransactions: [{id: 'rec-2', name: '스트리밍', amount: 10000, type: 'expense', category: '구독', nextDueDate: '2025-07-10', icon: 'Tv'}], 
    budgets: [{id: 'bud-2', category: '쇼핑', budget: 200000, spent: 210000, icon: 'ShoppingCart' }],
    goals: [], challenges: allChallenges,
  }
};


// --- Helper Components & Data ---
// 16번 수정: 금액 표시 색상 변경
const formatCurrency = (value = 0, type) => {
    const colorClass = type === 'income' ? 'text-green-500' : type === 'expense' ? 'text-red-500' : type === 'asset' ? 'text-blue-500' : 'text-slate-800 dark:text-slate-200';
    return <span className={colorClass}>{new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)}</span>;
};

const iconList = { Home, ShoppingCart, Utensils, Wallet, CreditCard, Repeat, Zap, Pill, GraduationCap, Gift, Popcorn, Briefcase, Landmark, TrendingDown, TrendingUp, CircleDollarSign, Building, ShieldCheck, PiggyBank, BarChart2, Tv, Bus, Car, Coffee, Gamepad2, Heart, Music, Phone, Plane, School, Train, TreePalm, Video, Wifi, Wind };
const getLucideIcon = (name) => {
    const Icon = iconList[name];
    return Icon ? <Icon /> : <Zap />;
};

const CATEGORY_ICONS = { '쇼핑': ShoppingCart, '식비': Utensils, '급여': Wallet, '교통': CreditCard, '주거': Home, '구독': Repeat, '의료': Pill, '교육': GraduationCap, '경조사': Gift, '엔터테인먼트': Popcorn, '사업소득': Briefcase, '기타': Zap, };
const ASSET_ICONS = { 'bank': Landmark, 'card': CreditCard, 'cash': Wallet, 'liability': TrendingDown, 'stock': TrendingUp, 'crypto': CircleDollarSign, 'realEstate': Building, 'insurance': ShieldCheck };
const getAssetIcon = (type) => { const Icon = ASSET_ICONS[type] || Wallet; return <Icon className="h-8 w-8" />; };

const CATEGORY_COLORS = { '쇼핑': '#EC4899', '식비': '#F97316', '급여': '#22C55E', '교통': '#3B82F6', '주거': '#8B5CF6', '구독': '#6366F1', '의료': '#E11D48', '교육': '#F59E0B', '경조사': '#14B8A6', '엔터테인먼트': '#D946EF', '사업소득': '#10B981', '기타': '#6B7280', };
const PIE_COLORS = Object.values(CATEGORY_COLORS);

const Modal = ({ isOpen, onClose, title, children }) => {
 if (!isOpen) return null;
 return ( <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4" onClick={onClose}> <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md m-4 transform transition-all" onClick={e => e.stopPropagation()}> <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700"> <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2> <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-full"><X size={20} /></button> </div> <div className="p-6 overflow-y-auto max-h-[80vh]">{children}</div> </div> </div> );
};

// 1, 7번 수정: 달력 UI 및 로직 수정
const CustomDatePicker = ({ selectedDate, onDateChange, onClose }) => {
    const [date, setDate] = useState(selectedDate ? new Date(selectedDate) : new Date());
    const calendarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) onClose();
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const changeMonth = (amount) => setDate(new Date(date.getFullYear(), date.getMonth() + amount, 1));
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const firstDayIndex = new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const handleDateSelect = (day) => {
        const newDate = new Date(date.getFullYear(), date.getMonth(), day);
        onDateChange(newDate.toISOString().slice(0, 10));
    };

    return (
        <div ref={calendarRef} className="absolute top-full mt-2 z-20 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-80">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronLeft size={20} /></button>
                <div className="font-bold text-lg text-slate-800 dark:text-slate-200">{date.getFullYear()}년 {date.getMonth() + 1}월</div>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"><ChevronRight size={20} /></button>
            </div>
            <div className="grid grid-cols-7 gap-y-1 text-center text-sm">
                {['일', '월', '화', '수', '목', '금', '토'].map(day => <div key={day} className="font-semibold text-slate-500 p-2">{day}</div>)}
                {Array.from({ length: firstDayIndex }).map((_, i) => <div key={`empty-${i}`}></div>)}
                {Array.from({ length: daysInMonth }).map((_, day) => {
                    const dayNumber = day + 1;
                    const fullDate = new Date(date.getFullYear(), date.getMonth(), dayNumber);
                    const isSelected = selectedDate && new Date(selectedDate).toDateString() === fullDate.toDateString();
                    return (
                        <button key={dayNumber} onClick={() => handleDateSelect(dayNumber)}
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors mx-auto ${isSelected ? 'bg-teal-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                            {dayNumber}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// 10번 수정: 아이콘 선택 컴포넌트 추가
const IconPicker = ({ onSelectIcon, selectedIcon }) => {
    return (
        <div className="grid grid-cols-6 gap-2 max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-600 p-2 rounded-lg">
            {Object.keys(iconList).map(iconName => (
                <button type="button" key={iconName} onClick={() => onSelectIcon(iconName)}
                    className={`flex justify-center items-center p-2 rounded-md transition-colors ${selectedIcon === iconName ? 'bg-teal-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                    {getLucideIcon(iconName)}
                </button>
            ))}
        </div>
    );
}

// --- Page Components ---
const Sidebar = ({ activeView, setActiveView, isCollapsed, setIsCollapsed, t, currentUser, setCurrentUser, theme, setTheme }) => {
    const navItems = [
        { id: 'dashboard', label: t.dashboard, icon: <LayoutDashboard /> }, { id: 'history', label: t.history, icon: <FileOutput /> }, { id: 'assets', label: t.assets, icon: <Landmark /> },
        { id: 'recurring', label: t.recurring, icon: <Repeat /> }, { id: 'budgets', label: t.budgets, icon: <PiggyBank /> }, { id: 'goals', label: t.goals, icon: <Target /> },
        { id: 'challenges', label: t.challenges, icon: <Trophy /> }, { id: 'reports', label: t.reports, icon: <BarChart2 /> }, { id: 'settings', label: t.settings, icon: <Settings /> },
    ];
    return ( <aside className={`relative bg-slate-800 text-slate-100 p-4 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}> <div className={`flex items-center mb-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}> {!isCollapsed && <h1 className="text-2xl font-bold text-white">{t.appName}</h1>} <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg hover:bg-slate-700"> {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />} </button> </div> <div className="border-t border-b border-slate-700 py-4 mb-4"> <button onClick={() => setCurrentUser('admin')} className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${currentUser?.id === 'admin' ? 'bg-sky-600' : 'hover:bg-slate-700'}`}> <User className="h-5 w-5 shrink-0" /> {!isCollapsed && <span className="ml-4 font-bold">{t.myLedger}</span>} </button> <div className="mt-2"> <button onClick={() => setCurrentUser('invitedUser1')} className={`w-full flex items-center p-3 rounded-lg text-left transition-colors ${currentUser?.id === 'invitedUser1' ? 'bg-sky-600' : 'hover:bg-slate-700'}`}> <User className="h-5 w-5 shrink-0" /> {!isCollapsed && <span className="ml-4">이수진</span>} </button> </div> </div> <nav className="flex-grow overflow-y-auto"> <ul className="space-y-2">{navItems.map(item => (<li key={item.id}><button onClick={() => setActiveView(item.id)} className={`w-full flex items-center p-3 rounded-lg transition-colors ${activeView === item.id ? 'bg-teal-500' : 'hover:bg-slate-700'} ${isCollapsed ? 'justify-center' : ''}`}><span className="shrink-0">{item.icon}</span>{!isCollapsed && <span className="ml-4 font-medium">{item.label}</span>}</button></li>))}</ul> </nav> <div className="border-t border-slate-700 pt-4 mt-4"> <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} className={`p-3 rounded-lg hover:bg-slate-700 w-full flex items-center ${isCollapsed ? 'justify-center' : ''}`}> {theme === 'light' ? <Moon /> : <Sun />} {!isCollapsed && <span className="ml-4">{theme === 'light' ? t.darkMode : t.lightMode}</span>} </button> </div> </aside> );
};

// 2, 3, 4, 5, 6번 수정: 대시보드 대규모 개편
const Dashboard = ({ userData, t, onAddTransaction, setActiveView }) => {
    const defaultStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10);
    const defaultEndDate = new Date().toISOString().slice(0, 10);
    
    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [isStartCalendarOpen, setStartCalendarOpen] = useState(false);
    const [isEndCalendarOpen, setEndCalendarOpen] = useState(false);
    
    const { assets = [], transactions = [], budgets = [], recurringTransactions = [] } = userData;
    const { periodIncome, periodExpenses, expenseByCategory, totalSpentOnBudgets, totalBudgetAmount } = useMemo(() => {
        const start = new Date(startDate); start.setHours(0,0,0,0);
        const end = new Date(endDate); end.setHours(23,59,59,999);

        const periodTx = transactions.filter(tx => { const txDate = new Date(tx.date); return txDate >= start && txDate <= end; });
        const income = periodTx.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
        const expense = periodTx.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);

        const categoryData = periodTx.filter(tx => tx.type === 'expense').reduce((acc, tx) => { acc[tx.category] = (acc[tx.category] || 0) + tx.amount; return acc; }, {});
        const expenseByCategory = Object.entries(categoryData).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
        
        const totalBudgetAmount = budgets.reduce((sum, b) => sum + b.budget, 0);
        const totalSpentOnBudgets = budgets.reduce((sum, b) => sum + b.spent, 0);

        return { periodIncome: income, periodExpenses: expense, expenseByCategory, totalSpentOnBudgets, totalBudgetAmount };
    }, [transactions, budgets, startDate, endDate]);
    
    const netAssets = useMemo(() => assets.reduce((sum, asset) => sum + asset.balance, 0), [assets]);
    const budgetUsage = totalBudgetAmount > 0 ? Math.round((totalSpentOnBudgets / totalBudgetAmount) * 100) : 0;
    
    return (
        <div className="space-y-6">
            <header className="flex flex-wrap justify-between items-center gap-4">
                <div> <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.dashboard}</h2> <p className="text-slate-600 dark:text-slate-400 mt-1">{t.dashboardWelcome.replace('{name}', userData.name || '')}</p> </div>
                 <div className="flex items-center gap-2">
                    <div className="relative"> <button onClick={() => setStartCalendarOpen(s => !s)} className="flex items-center gap-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700"> <Calendar size={16} /> {startDate} </button> {isStartCalendarOpen && <CustomDatePicker selectedDate={startDate} onDateChange={(date) => { setStartDate(date); setStartCalendarOpen(false); }} onClose={() => setStartCalendarOpen(false)} />} </div>
                    <span>-</span>
                    <div className="relative"> <button onClick={() => setEndCalendarOpen(e => !e)} className="flex items-center gap-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700"> <Calendar size={16} /> {endDate} </button> {isEndCalendarOpen && <CustomDatePicker selectedDate={endDate} onDateChange={(date) => { setEndDate(date); setEndCalendarOpen(false); }} onClose={() => setEndCalendarOpen(false)} />} </div>
                 </div>
                 <button onClick={onAddTransaction} className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600 transition-colors"> <PlusCircle className="h-5 w-5 mr-2" />{t.addTransaction} </button>
            </header>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"> <h3 className="font-semibold text-slate-500 dark:text-slate-400">{t.netAssets}</h3> <p className="text-3xl font-bold mt-2">{formatCurrency(netAssets, 'asset')}</p> </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"> <h3 className="font-semibold text-slate-500 dark:text-slate-400">{t.totalBudget}</h3> <p className="text-3xl font-bold text-amber-500 mt-2">{formatCurrency(totalBudgetAmount)}</p> </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"> <h3 className="font-semibold text-slate-500 dark:text-slate-400">{t.income}</h3> <p className="text-3xl font-bold mt-2">{formatCurrency(periodIncome, 'income')}</p> </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm"> <h3 className="font-semibold text-slate-500 dark:text-slate-400">{t.expense}</h3> <p className="text-3xl font-bold mt-2">{formatCurrency(periodExpenses, 'expense')}</p> </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">{t.expenseByCategory}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={expenseByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={110} fill="#8884d8" paddingAngle={3} labelLine={false}
                                 label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                                    const RADIAN = Math.PI / 180;
                                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                    return ( <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize="12"> {`${(percent * 100).toFixed(0)}%`} </text> );
                                }}>
                                {expenseByCategory.map((entry, index) => ( <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || PIE_COLORS[index % PIE_COLORS.length]} /> ))}
                            </Pie>
                            <Tooltip formatter={(value) => new Intl.NumberFormat('ko-KR').format(value) + '원'} />
                            <Legend />
                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold fill-slate-800 dark:fill-slate-200">{formatCurrency(periodExpenses)}</text>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                 <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm flex flex-col space-y-4">
                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{t.budgetUsage}</h3>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
                            <div className={`h-4 rounded-full ${budgetUsage > 100 ? 'bg-red-500' : 'bg-teal-500'}`} style={{ width: `${Math.min(budgetUsage, 100)}%` }}></div>
                        </div>
                        <p className="text-right mt-1 font-bold text-lg">{budgetUsage}%</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">{t.recentHistory}</h3>
                        <div className="space-y-2">
                           {[...transactions].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 3).map(tx => ( <div key={tx.id} className="flex items-center justify-between text-sm"> <div className="flex items-center gap-2"> <div className="p-1.5 rounded-full" style={{backgroundColor: CATEGORY_COLORS[tx.category] ? `${CATEGORY_COLORS[tx.category]}20` : '#F3F4F6'}}>{getLucideIcon(tx.category)}</div> <p className="font-medium text-slate-700 dark:text-slate-300">{tx.description}</p> </div> <p className={`font-semibold text-xs ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>{tx.type === 'income' ? '+' : '-'}{new Intl.NumberFormat('ko-KR').format(tx.amount)}</p> </div> )) }
                           <button onClick={() => setActiveView('history')} className="text-sm w-full text-center py-1.5 mt-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-semibold text-slate-600 dark:text-slate-300">{t.showMore}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 8번 수정: 자산 카드 내 버튼 UI/위치 변경
const Assets = ({ assets, t, onAddTransactionForAsset, onAddAsset }) => (
    <div className="space-y-6">
        <header className="flex justify-between items-center">
            <div><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.assetsTitle}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.assetsDesc}</p></div>
            <button onClick={onAddAsset} className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"><PlusCircle className="h-5 w-5 mr-2" />{t.addAsset}</button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(assets || []).map(asset => (
                <div key={asset.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${asset.balance < 0 ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300' : 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300'}`}>
                            {getAssetIcon(asset.type)}
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{asset.name}</h3>
                           <p className="text-sm text-slate-500 dark:text-slate-400">{t[asset.type] || asset.type}</p>
                        </div>
                    </div>
                    <p className="text-3xl font-bold my-4">{formatCurrency(asset.balance, asset.balance >= 0 ? 'asset' : 'expense')}</p>
                    <button onClick={() => onAddTransactionForAsset(asset.id)} className="absolute -bottom-2 -right-2 h-12 w-12 bg-teal-500 text-white rounded-full flex items-center justify-center transition-transform hover:scale-110">
                        <PlusCircle size={24} />
                    </button>
                </div>
            ))}
        </div>
    </div>
);

// 9번 수정: 고정지출 아이콘 표시
const RecurringTransactions = ({ recurring, t, onAddRecurring }) => {
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div> <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.recurringTitle}</h2> <p className="text-slate-600 dark:text-slate-400 mt-1">{t.recurringDesc}</p> </div>
                <button onClick={onAddRecurring} className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"> <PlusCircle className="h-5 w-5 mr-2" />{t.addRecurring} </button>
            </header>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                {(recurring || []).map(r => (
                    <div key={r.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                        <div className="flex items-center gap-3">
                            <span className="text-teal-500">{getLucideIcon(r.icon)}</span>
                            <div>
                                <p className="font-semibold text-slate-700 dark:text-slate-300">{r.name}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{t.nextPayment}: {r.nextDueDate}</p>
                            </div>
                        </div>
                        <p className="font-bold text-lg">{formatCurrency(r.amount, r.type)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 10, 11, 12, 13번 수정: 예산 페이지 대규모 개편
const Budgets = ({ budgets, t, onAddBudget }) => {
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div> <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.budgetsTitle}</h2> <p className="text-slate-600 dark:text-slate-400 mt-1">{t.budgetsDesc}</p> </div>
                <button onClick={onAddBudget} className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"> <PlusCircle className="h-5 w-5 mr-2" />{t.addBudget} </button>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(budgets || []).map((item) => {
                        const percentage = item.budget > 0 ? Math.round((item.spent / item.budget) * 100) : 0;
                        const isExceeded = percentage > 100;
                        const barColor = isExceeded ? 'bg-red-500' : 'bg-teal-500';
                        return (
                            <div key={item.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <span className="text-teal-500 text-2xl">{getLucideIcon(item.icon)}</span>
                                        <div>
                                            <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">{item.category}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{t.spent}: <span className="font-medium text-slate-600 dark:text-slate-300">{formatCurrency(item.spent)}</span></p>
                                        </div>
                                    </div>
                                    <p className="text-sm font-bold text-slate-600 dark:text-slate-400">{formatCurrency(item.budget)}</p>
                                </div>
                                <div className="mt-4">
                                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                                        <div className={`${barColor} h-2.5 rounded-full`} style={{ width: `${isExceeded ? 100 : percentage}%` }}></div>
                                    </div>
                                    <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mt-2">
                                        <span className={`font-bold ${isExceeded ? 'text-red-500' : ''}`}>{percentage}% {isExceeded && <AlertTriangle className="inline h-4 w-4" />}</span>
                                        <span>{isExceeded ? formatCurrency(item.spent - item.budget) + ` ${t.budgetExceeded}` : formatCurrency(item.budget - item.spent) + ` ${t.remaining}`}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{t.budgetVisualizer}</h3>
                    {budgets.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={budgets} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="category" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} width={80} />
                                <Tooltip formatter={(value) => new Intl.NumberFormat('ko-KR').format(value) + '원'} cursor={{fill: 'rgba(241, 245, 249, 0.5)'}}/>
                                <Bar dataKey="spent" name={t.spent} stackId="a" fill="#3B82F6" background={{ fill: '#eee' }} radius={[4, 4, 4, 4]}/>
                                <Bar dataKey="remaining" name={t.remaining} stackId="a" fill="#a5b4fc" radius={[4, 4, 4, 4]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : <p className="text-center text-slate-500 pt-10">{t.noBudgets}</p>}
                </div>
            </div>
        </div>
    );
};

// 10번 수정: 재무 목표 아이콘 추가
const Goals = ({ goals, t, onAddGoal }) => { return <div className="space-y-6"> <header className="flex justify-between items-center"> <div> <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.goalsTitle}</h2> <p className="text-slate-600 dark:text-slate-400 mt-1">{t.goalsDesc}</p> </div> <button onClick={onAddGoal} className="flex items-center bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg shadow-sm hover:bg-teal-600"> <PlusCircle className="h-5 w-5 mr-2" />{t.addGoal} </button> </header> <div className="grid grid-cols-1 md:grid-cols-3 gap-6">{(goals || []).map((goal) => { const percentage = goal.target > 0 ? Math.round((goal.saved / goal.target) * 100) : 0; const isAchieved = goal.saved >= goal.target; return (<div key={goal.id} className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm flex flex-col justify-between ${isAchieved && 'bg-teal-50 dark:bg-teal-900/50'}`}> <div className="flex justify-between items-center"> <div className="flex items-center gap-3"><span className="text-teal-500 text-2xl">{getLucideIcon(goal.icon)}</span><p className="text-lg font-semibold text-slate-800 dark:text-slate-200">{goal.name}</p></div> {isAchieved && <span className="text-xs font-bold text-white bg-teal-500 py-1 px-2 rounded-full flex items-center gap-1"><Sparkles className="h-3 w-3" />{t.achieved}</span>}</div> <div className="mt-2"><span className="text-sm text-slate-500 dark:text-slate-400">{t.savedAmount}: </span><span className="font-bold text-teal-600 dark:text-teal-400">{formatCurrency(goal.saved)}</span></div> <div className="mt-6"><p className="text-right text-sm text-slate-500 dark:text-slate-400">{t.goalAmount}: {formatCurrency(goal.target)}</p><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-2"><div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${Math.min(percentage, 100)}%` }}></div></div><p className="text-right text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">{percentage}%</p></div></div>)})}</div> </div> };
const History = ({ transactions, t, lang }) => { const [startDate, setStartDate] = useState(''); const [endDate, setEndDate] = useState(''); const [searchTerm, setSearchTerm] = useState(''); const [selectedCategory, setSelectedCategory] = useState('All'); const [selectedTag, setSelectedTag] = useState(''); const [isStartCalendarOpen, setStartCalendarOpen] = useState(false); const [isEndCalendarOpen, setEndCalendarOpen] = useState(false); const allTags = useMemo(() => { const tags = new Set(); (transactions || []).forEach(tx => { (tx.tags || []).forEach(tag => tags.add(tag)); }); return Array.from(tags); }, [transactions]); const filteredTransactions = useMemo(() => { return (transactions || []) .filter(tx => { const txDate = new Date(tx.date); if (startDate && txDate < new Date(startDate)) return false; if (endDate && txDate > new Date(endDate)) return false; if (selectedCategory !== 'All' && tx.category !== selectedCategory) return false; if (selectedTag && !(tx.tags || []).includes(selectedTag)) return false; const searchTermLower = searchTerm.toLowerCase(); const descMatch = tx.description.toLowerCase().includes(searchTermLower); const categoryMatch = tx.category.toLowerCase().includes(searchTermLower); const tagsMatch = (tx.tags || []).some(tag => tag.toLowerCase().includes(searchTermLower)); return descMatch || categoryMatch || tagsMatch; }) .sort((a, b) => new Date(b.date) - new Date(a.date)); }, [transactions, startDate, endDate, searchTerm, selectedCategory, selectedTag]); return ( <div className="space-y-6"> <header> <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.historyTitle}</h2> <p className="text-slate-600 dark:text-slate-400 mt-1">{t.historyDesc}</p> </header> <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-sm"> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4"> <div className="relative"> <button onClick={() => setStartCalendarOpen(s => !s)} className="w-full text-left flex items-center gap-2 text-sm font-medium bg-slate-100 dark:bg-slate-700 border border-transparent rounded-lg px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600"> <Calendar size={16} /> {startDate || t.startDate} </button> {isStartCalendarOpen && <CustomDatePicker selectedDate={startDate} onDateChange={(date) => { setStartDate(date); setStartCalendarOpen(false); }} onClose={() => setStartCalendarOpen(false)} />} </div> <div className="relative"> <button onClick={() => setEndCalendarOpen(e => !e)} className="w-full text-left flex items-center gap-2 text-sm font-medium bg-slate-100 dark:bg-slate-700 border border-transparent rounded-lg px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-600"> <Calendar size={16} /> {endDate || t.endDate} </button> {isEndCalendarOpen && <CustomDatePicker selectedDate={endDate} onDateChange={(date) => { setEndDate(date); setEndCalendarOpen(false); }} onClose={() => setEndCalendarOpen(false)} />} </div> <div className="relative"> <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /> <input type="text" placeholder={t.searchPlaceholder} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"/> </div> </div> <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4"> <div> <label className="text-xs text-slate-500">{t.filterByCategory}</label> <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"> <option value="All">{t.all}</option> {CATEGORIES[lang].map(cat => <option key={cat} value={cat}>{cat}</option>)} </select> </div> <div> <label className="text-xs text-slate-500">{t.filterByTag}</label> <select value={selectedTag} onChange={e => setSelectedTag(e.target.value)} className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"> <option value="">{t.all}</option> {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)} </select> </div> </div> <div className="space-y-2"> {filteredTransactions.map(tx => ( <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50"> <div className="flex items-center gap-3"> <div className={`p-2 rounded-full`} style={{backgroundColor: CATEGORY_COLORS[tx.category] ? `${CATEGORY_COLORS[tx.category]}20` : '#F3F4F6'}}> {getLucideIcon(tx.category)} </div> <div> <p className="font-semibold text-slate-700 dark:text-slate-300">{tx.description}</p> <div className="flex items-center gap-2"> <p className="text-sm text-slate-400">{tx.date}</p> {(tx.tags || []).map(tag => <span key={tag} className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded">{tag}</span>)} </div> </div> </div> <p className="font-semibold">{formatCurrency(tx.amount, tx.type)}</p> </div> ))} </div> </div> </div> ); };
const Challenges = ({ challenges, t }) => { return <div className="space-y-6"> <header><div><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.challengesTitle}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.challengesDesc}</p></div></header> <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">{(challenges || []).map(c => (<div key={c.id} className={`bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-2 ${c.isAchieved ? 'border-amber-400' : 'border-transparent'}`}> <div className="flex flex-col items-center text-center"> <span className="text-5xl mb-3">{c.icon}</span> <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{c.name}</h3> <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{c.condition}</p> </div> </div>))}</div> </div> };

// 15번 수정: 리포트 페이지 그래프, 날짜 선택 기능 개선
const Reports = ({ transactions, t }) => {
    const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0,10));
    const [endDate, setEndDate] = useState(new Date().toISOString().slice(0,10));
    const [isStartCalendarOpen, setStartCalendarOpen] = useState(false);
    const [isEndCalendarOpen, setEndCalendarOpen] = useState(false);

    const reportData = useMemo(() => {
        const start = new Date(startDate); start.setHours(0,0,0,0);
        const end = new Date(endDate); end.setHours(23,59,59,999);
        const filteredTx = (transactions || []).filter(tx => { const txDate = new Date(tx.date); return txDate >= start && txDate <= end; });

        const daily = filteredTx.reduce((acc, tx) => {
            const day = tx.date;
            if (!acc[day]) acc[day] = { date: day, income: 0, expense: 0 };
            if (tx.type === 'income') acc[day].income += tx.amount;
            else acc[day].expense += tx.amount;
            return acc;
        }, {});
        return Object.values(daily).sort((a,b) => a.date.localeCompare(b.date));
    }, [transactions, startDate, endDate]);

    return (
        <div className="space-y-6">
            <header className="flex flex-wrap justify-between items-center gap-4">
                <div> <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.reportsTitle}</h2> <p className="text-slate-600 dark:text-slate-400 mt-1">{t.reportsDesc}</p> </div>
                <div className="flex items-center gap-2">
                    <div className="relative"> <button onClick={() => setStartCalendarOpen(s => !s)} className="flex items-center gap-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700"> <Calendar size={16} /> {startDate} </button> {isStartCalendarOpen && <CustomDatePicker selectedDate={startDate} onDateChange={(date) => { setStartDate(date); setStartCalendarOpen(false); }} onClose={() => setStartCalendarOpen(false)} />} </div>
                    <span>-</span>
                    <div className="relative"> <button onClick={() => setEndCalendarOpen(e => !e)} className="flex items-center gap-2 text-sm font-medium bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700"> <Calendar size={16} /> {endDate} </button> {isEndCalendarOpen && <CustomDatePicker selectedDate={endDate} onDateChange={(date) => { setEndDate(date); setEndCalendarOpen(false); }} onClose={() => setEndCalendarOpen(false)} />} </div>
                </div>
            </header>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">{t.incomeExpenseTrend}</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={reportData} margin={{ top: 5, right: 20, left: 60, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                        <XAxis dataKey="date" tick={{ fill: '#64748b' }} angle={-30} textAnchor="end" height={50} />
                        <YAxis tick={{ fill: '#64748b' }} tickFormatter={(value) => new Intl.NumberFormat('ko-KR', { notation: 'compact' }).format(value)} width={100} />
                        <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', border: '1px solid #ddd', borderRadius: '10px' }} formatter={(value, name) => [new Intl.NumberFormat('ko-KR').format(value) + '원', t[name]]} />
                        <Legend />
                        <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} name="income"/>
                        <Line type="monotone" dataKey="expense" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} name="expense"/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
const SettingsPage = ({ t, setLanguage, lang }) => { return ( <div className="space-y-6"> <header><h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{t.settingsTitle}</h2><p className="text-slate-600 dark:text-slate-400 mt-1">{t.settingsDesc}</p></header> <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm"><h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-4 mb-6">{t.language}</h3><div className="flex gap-4"><button onClick={() => setLanguage('ko')} className={`flex items-center justify-center gap-2 flex-1 p-3 rounded-lg transition-colors ${lang === 'ko' ? 'bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>🇰🇷 한국어</button><button onClick={() => setLanguage('en')} className={`flex items-center justify-center gap-2 flex-1 p-3 rounded-lg transition-colors ${lang === 'en' ? 'bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>🇺🇸 English</button><button onClick={() => setLanguage('ja')} className={`flex items-center justify-center gap-2 flex-1 p-3 rounded-lg transition-colors ${lang === 'ja' ? 'bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600'}`}>🇯🇵 日本語</button></div></div> </div> ); };

// --- Modals ---
const AddTransactionModal = ({ isOpen, onClose, onSubmit, assets, t, prefilledAsset, lang }) => { const handleSubmit = (e) => { e.preventDefault(); const formData = new FormData(e.target); const data = { type: formData.get('type'), date: formData.get('date'), description: formData.get('description'), amount: parseFloat(formData.get('amount')), category: formData.get('category'), assetId: formData.get('assetId'), tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(Boolean), }; onSubmit(data); }; return ( <Modal isOpen={isOpen} onClose={onClose} title={t.newTransaction}> <form onSubmit={handleSubmit} className="space-y-4"> <div className="grid grid-cols-2 gap-4"> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.transactionType}</label><select name="type" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="expense">{t.expense}</option><option value="income">{t.income}</option></select></div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.date}</label><input type="date" name="date" defaultValue={new Date().toISOString().substring(0, 10)} required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div> </div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.description}</label><input type="text" name="description" placeholder="예: 스타벅스 커피" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div> <div className="grid grid-cols-2 gap-4"> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.category}</label><select name="category" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="">{t.select}</option>{CATEGORIES[lang].map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.amount}</label><input type="number" name="amount" placeholder="5000" step="1" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div> </div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.asset}</label><select name="assetId" defaultValue={prefilledAsset || ""} required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="">{t.select}</option>{(assets || []).map(asset => <option key={asset.id} value={asset.id}>{asset.name}</option>)}</select></div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.tags}</label><input type="text" name="tags" placeholder="예: #카페, #기분전환" className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div> <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">{t.cancel}</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 shadow-sm">{t.add}</button></div> </form> </Modal> ); };
const AddAssetModal = ({ isOpen, onClose, onSubmit, t }) => { const handleSubmit = (e) => { e.preventDefault(); const formData = new FormData(e.target); const data = { name: formData.get('name'), type: formData.get('type'), balance: parseFloat(formData.get('balance')), }; onSubmit(data); }; return (<Modal isOpen={isOpen} onClose={onClose} title={t.newAsset}><form onSubmit={handleSubmit} className="space-y-4"><div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.assetName}</label><input type="text" name="name" placeholder="예: 내 월급 통장" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div><div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.assetType}</label><select name="type" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500"><option value="bank">{t.bank}</option><option value="card">{t.card}</option><option value="cash">{t.cash}</option><option value="stock">{t.stock}</option><option value="crypto">{t.crypto}</option><option value="realEstate">{t.realEstate}</option><option value="insurance">{t.insurance}</option><option value="liability">{t.liability}</option></select></div><div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.initialBalance}</label><input type="number" name="balance" placeholder="부채는 마이너스(-)로 입력" step="1" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-teal-500" /></div><div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-200 dark:bg-slate-600 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500">{t.cancel}</button><button type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-teal-500 rounded-lg hover:bg-teal-600 shadow-sm">{t.add}</button></div></form></Modal>); };
const AddRecurringModal = ({ isOpen, onClose, onSubmit, t, lang }) => {
    const [icon, setIcon] = useState('Repeat');
    const handleSubmit = (e) => { e.preventDefault(); const formData = new FormData(e.target); const data = { name: formData.get('name'), amount: parseFloat(formData.get('amount')), category: formData.get('category'), nextDueDate: formData.get('nextDueDate'), type: formData.get('type'), icon }; onSubmit(data); };
    return ( <Modal isOpen={isOpen} onClose={onClose} title={t.newRecurring}> <form onSubmit={handleSubmit} className="space-y-4"> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.recurringName}</label><input type="text" name="name" placeholder="예: 넷플릭스 구독료" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700" /></div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.icon}</label><IconPicker onSelectIcon={setIcon} selectedIcon={icon} /></div> <div className="grid grid-cols-2 gap-4"> <div><label>{t.amount}</label><input type="number" name="amount" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700" /></div> <div><label>{t.transactionType}</label><select name="type" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700"><option value="expense">{t.expense}</option><option value="income">{t.income}</option></select></div> </div> <div><label>{t.category}</label><select name="category" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700"><option value="">{t.select}</option>{CATEGORIES[lang].map(cat => <option key={cat} value={cat}>{cat}</option>)}</select></div> <div><label>{t.nextDueDate}</label><input type="date" name="nextDueDate" defaultValue={new Date().toISOString().substring(0, 10)} required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700" /></div> <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg">{t.cancel}</button><button type="submit" className="px-4 py-2 text-white bg-teal-500 rounded-lg">{t.add}</button></div> </form> </Modal> );
};
const AddBudgetModal = ({ isOpen, onClose, onSubmit, t }) => {
    const [icon, setIcon] = useState('ShoppingCart');
    const handleSubmit = (e) => { e.preventDefault(); const formData = new FormData(e.target); const data = { category: formData.get('category'), budget: parseFloat(formData.get('budget')), spent: 0, icon, id: `bud-mock-${Date.now()}` }; onSubmit(data); };
    return ( <Modal isOpen={isOpen} onClose={onClose} title={t.newBudget}> <form onSubmit={handleSubmit} className="space-y-4"> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.categoryName}</label><input type="text" name="category" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700" /></div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.icon}</label><IconPicker onSelectIcon={setIcon} selectedIcon={icon} /></div> <div><label>{t.budgetAmount}</label><input type="number" name="budget" placeholder="300000" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700" /></div> <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg">{t.cancel}</button><button type="submit" className="px-4 py-2 text-white bg-teal-500 rounded-lg">{t.add}</button></div> </form> </Modal> );
};
const AddGoalModal = ({ isOpen, onClose, onSubmit, t }) => {
    const [icon, setIcon] = useState('Target');
    const handleSubmit = (e) => { e.preventDefault(); const formData = new FormData(e.target); onSubmit({ name: formData.get('name'), target: parseFloat(formData.get('target')), saved: 0, icon, id: `goal-mock-${Date.now()}` }); };
    return ( <Modal isOpen={isOpen} onClose={onClose} title={t.newGoal}> <form onSubmit={handleSubmit} className="space-y-4"> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.goalName}</label><input type="text" name="name" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700" /></div> <div><label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{t.icon}</label><IconPicker onSelectIcon={setIcon} selectedIcon={icon} /></div> <div><label>{t.targetAmount}</label><input type="number" name="target" placeholder="5000000" required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700" /></div> <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg">{t.cancel}</button><button type="submit" className="px-4 py-2 text-white bg-teal-500 rounded-lg">{t.add}</button></div> </form> </Modal> );
};

// --- Main Application ---
export default function App() {
  const [theme, setTheme] = useState('light');
  const [lang, setLang] = useState('ko');
  const [currentUserKey, setCurrentUserKey] = useState('invitedUser1');
  const [activeView, setActiveView] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({ transaction: false, asset: false, recurring: false, budget: false, goal: false });
  const [prefilledAsset, setPrefilledAsset] = useState(null);

  // 17번 수정: 다크/라이트 모드 기능 수정
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    setIsLoading(true);
    const storedData = JSON.parse(localStorage.getItem(currentUserKey));
    const dataToUse = storedData || initialAppData[currentUserKey];
    setUserData(dataToUse);
    setIsLoading(false);
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
    const modalKey = collectionName.replace(/s$/, '').replace('Transactio', 'transactio');
    closeModal(modalKey);
  };
  
  const renderContent = () => {
    if (isLoading || !userData) {
      return <div className="w-full h-full flex items-center justify-center"><p className="text-slate-500">{currentT.loading}</p></div>;
    }
    
    switch (activeView) {
      case 'dashboard': return <Dashboard userData={userData} t={currentT} onAddTransaction={() => openModal('transaction')} setActiveView={setActiveView} />;
      case 'history': return <History transactions={userData.transactions} t={currentT} lang={lang} />;
      case 'assets': return <Assets assets={userData.assets} t={currentT} onAddAsset={() => openModal('asset')} onAddTransactionForAsset={handleAddTransactionForAsset} />;
      case 'recurring': return <RecurringTransactions recurring={userData.recurringTransactions} t={currentT} onAddRecurring={() => openModal('recurring')} />;
      case 'budgets': return <Budgets budgets={userData.budgets} t={currentT} onAddBudget={() => openModal('budget')} />;
      case 'goals': return <Goals goals={userData.goals} t={currentT} onAddGoal={() => openModal('goal')} />;
      case 'challenges': return <Challenges challenges={userData.challenges} t={currentT} />;
      case 'reports': return <Reports transactions={userData.transactions} t={currentT} />;
      case 'settings': return <SettingsPage t={currentT} setLanguage={setLang} lang={lang} />;
      default: return <Dashboard userData={userData} t={currentT} onAddTransaction={() => openModal('transaction')} setActiveView={setActiveView} />;
    }
  };

  return (
    <div className={`flex h-screen font-sans ${theme}`}>
      <div className="flex h-screen w-full bg-slate-100 dark:bg-slate-900">
          <Sidebar activeView={activeView} setActiveView={setActiveView} isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} t={currentT} currentUser={userData} setCurrentUser={setCurrentUserKey} theme={theme} setTheme={setTheme} />
          <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
            {renderContent()}
          </main>

          <AddTransactionModal isOpen={modalState.transaction} onClose={() => closeModal('transaction')} onSubmit={(data) => handleAddData('transactions', data)} assets={userData?.assets || []} t={currentT} prefilledAsset={prefilledAsset} lang={lang} />
          <AddAssetModal isOpen={modalState.asset} onClose={() => closeModal('asset')} onSubmit={(data) => handleAddData('assets', data)} t={currentT} />
          <AddRecurringModal isOpen={modalState.recurring} onClose={() => closeModal('recurring')} onSubmit={(data) => handleAddData('recurringTransactions', data)} t={currentT} lang={lang} />
          <AddBudgetModal isOpen={modalState.budget} onClose={() => closeModal('budget')} onSubmit={(data) => handleAddData('budgets', data)} t={currentT} />
          <AddGoalModal isOpen={modalState.goal} onClose={() => closeModal('goal')} onSubmit={(data) => handleAddData('goals', data)} t={currentT} />
      </div>
    </div>
  );
}
�