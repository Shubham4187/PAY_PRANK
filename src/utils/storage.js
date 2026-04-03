import AsyncStorage from '@react-native-async-storage/async-storage';

const PRANK_COUNT_KEY = '@payprank_count';
const LEADERBOARD_KEY = '@payprank_leaderboard';
const BALANCE_KEY = '@payprank_balance';
const TRANSACTIONS_KEY = '@payprank_transactions';

export const getPrankCount = async () => {
  try {
    const val = await AsyncStorage.getItem(PRANK_COUNT_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
};

export const incrementPrankCount = async () => {
  try {
    const current = await getPrankCount();
    const next = current + 1;
    await AsyncStorage.setItem(PRANK_COUNT_KEY, String(next));
    return next;
  } catch {
    return 0;
  }
};

export const getLeaderboard = async () => {
  try {
    const val = await AsyncStorage.getItem(LEADERBOARD_KEY);
    return val ? JSON.parse(val) : getDefaultLeaderboard();
  } catch {
    return getDefaultLeaderboard();
  }
};

export const updateLeaderboard = async (prankCount) => {
  try {
    let board = await getLeaderboard();
    const myEntry = board.find(e => e.isMe);
    if (myEntry) {
      myEntry.pranks = prankCount;
    }
    board.sort((a, b) => b.pranks - a.pranks);
    board = board.map((e, i) => ({...e, rank: i + 1}));
    await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board));
    return board;
  } catch {
    return getDefaultLeaderboard();
  }
};

export const getBalance = async () => {
  try {
    const val = await AsyncStorage.getItem(BALANCE_KEY);
    return val ? parseFloat(val) : generateFakeBalance();
  } catch {
    return generateFakeBalance();
  }
};

export const saveBalance = async balance => {
  try {
    await AsyncStorage.setItem(BALANCE_KEY, String(balance));
  } catch (e) {
    console.warn('saveBalance error', e);
  }
};

export const getTransactions = async () => {
  try {
    const val = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
};

export const saveTransaction = async txn => {
  try {
    const current = await getTransactions();
    const updated = [txn, ...current].slice(0, 20);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('saveTransaction error', e);
  }
};

const generateFakeBalance = () => {
  return parseFloat((Math.random() * 4000 + 500).toFixed(2));
};

const getDefaultLeaderboard = () => [
  {rank: 1, name: 'Riya Sharma', pranks: 12, avatar: '👸', isMe: false},
  {rank: 2, name: 'Arjun Mehta', pranks: 9, avatar: '🧑', isMe: false},
  {rank: 3, name: 'You', pranks: 0, avatar: '😎', isMe: true},
  {rank: 4, name: 'Priya Nair', pranks: 0, avatar: '👩', isMe: false},
  {rank: 5, name: 'Sahil Khan', pranks: 0, avatar: '🧔', isMe: false},
];
