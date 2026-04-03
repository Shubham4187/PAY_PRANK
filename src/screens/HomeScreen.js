import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  StatusBar,
  Dimensions,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, FAKE_TRANSACTIONS} from '../utils/theme';
import {getBalance, saveBalance, getPrankCount, getTransactions} from '../utils/storage';

const {width} = Dimensions.get('window');

const QuickAction = ({icon, label, onPress, color}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {toValue: 0.92, duration: 80, useNativeDriver: true}),
      Animated.timing(scale, {toValue: 1, duration: 120, useNativeDriver: true}),
    ]).start(() => onPress());
  };
  return (
    <Animated.View style={{transform: [{scale}]}}>
      <TouchableOpacity style={styles.quickAction} onPress={handlePress} activeOpacity={0.9}>
        <View style={[styles.quickActionIcon, {backgroundColor: color + '22'}]}>
          <Text style={styles.quickActionEmoji}>{icon}</Text>
        </View>
        <Text style={styles.quickActionLabel}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const HomeScreen = ({navigation}) => {
  const [balance, setBalance] = useState('0.00');
  const [prankCount, setPrankCount] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newBalance, setNewBalance] = useState('');

  const balanceOpacity = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(40)).current;
  const actionsSlide = useRef(new Animated.Value(60)).current;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadData();
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(balanceOpacity, {toValue: 1, duration: 500, useNativeDriver: true}),
        Animated.timing(cardSlide, {toValue: 0, duration: 500, useNativeDriver: true}),
      ]),
      Animated.timing(actionsSlide, {toValue: 0, duration: 400, useNativeDriver: true}),
    ]).start();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadData);
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const bal = await getBalance();
    setBalance(bal.toFixed(2));
    const count = await getPrankCount();
    setPrankCount(count);
    const txns = await getTransactions();
    setTransactions(txns.length > 0 ? txns : FAKE_TRANSACTIONS);
  };

  const handleSetBalance = () => {
    const val = parseFloat(newBalance);
    if (!isNaN(val) && val >= 0) {
      saveBalance(val);
      setBalance(val.toFixed(2));
      setEditModalVisible(false);
      setNewBalance('');
    } else {
      Alert.alert('Invalid Amount', 'Please enter a valid number.');
    }
  };

  const randomizeBalance = () => {
    const val = parseFloat((Math.random() * 9000 + 500).toFixed(2));
    saveBalance(val);
    setBalance(val.toFixed(2));
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey there 👋</Text>
            <Text style={styles.headerSub}>Ready to prank?</Text>
          </View>
          <TouchableOpacity
            style={styles.prankBadge}
            onPress={() => navigation.navigate('Leaderboard')}>
            <Text style={styles.prankBadgeEmoji}>🎭</Text>
            <Text style={styles.prankBadgeText}>{prankCount}</Text>
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <Animated.View
          style={[
            styles.balanceCard,
            {opacity: balanceOpacity, transform: [{translateY: cardSlide}]},
          ]}>
          <View style={styles.balanceCardBg} />
          <View style={styles.balanceRow}>
            <View>
              <Text style={styles.balanceLabel}>PayPrank Wallet</Text>
              <View style={styles.balanceValueRow}>
                <Text style={styles.balanceCurrency}>₹</Text>
                <Text style={styles.balanceValue}>
                  {balanceVisible ? balance : '••••••'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setBalanceVisible(v => !v)}>
              <Text style={styles.eyeIcon}>{balanceVisible ? '👁️' : '🙈'}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardDivider} />

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={styles.cardActionBtn}
              onPress={() => setEditModalVisible(true)}>
              <Text style={styles.cardActionIcon}>✏️</Text>
              <Text style={styles.cardActionText}>Set Balance</Text>
            </TouchableOpacity>
            <View style={styles.cardActionDivider} />
            <TouchableOpacity style={styles.cardActionBtn} onPress={randomizeBalance}>
              <Text style={styles.cardActionIcon}>🎲</Text>
              <Text style={styles.cardActionText}>Randomize</Text>
            </TouchableOpacity>
          </View>

          {/* Decorative elements */}
          <View style={styles.cardCircle1} />
          <View style={styles.cardCircle2} />
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View
          style={[styles.actionsSection, {transform: [{translateY: actionsSlide}]}]}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <QuickAction
              icon="📷"
              label="Scan QR"
              color={COLORS.primary}
              onPress={() => navigation.navigate('QRScanner')}
            />
            <QuickAction
              icon="💸"
              label="Send Money"
              color={COLORS.accent}
              onPress={() =>
                navigation.navigate('Payment', {
                  merchant: {name: 'Custom Merchant', id: 'CUSTOM', category: '💳 Payment'},
                })
              }
            />
            <QuickAction
              icon="📋"
              label="History"
              color={COLORS.secondary}
              onPress={() => navigation.navigate('TransactionHistory')}
            />
            <QuickAction
              icon="🏆"
              label="Leaderboard"
              color="#9B59B6"
              onPress={() => navigation.navigate('Leaderboard')}
            />
          </View>
        </Animated.View>

        {/* Prank Stats */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>🎭 Prank Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{prankCount}</Text>
              <Text style={styles.statLabel}>Total Pranks</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {prankCount > 0 ? '🔥' : '😴'}
              </Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {prankCount >= 10 ? '🥇' : prankCount >= 5 ? '🥈' : '🎯'}
              </Text>
              <Text style={styles.statLabel}>Badge</Text>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.txnSection}>
          <View style={styles.txnHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {transactions.slice(0, 4).map((txn, i) => (
            <View key={txn.id || i} style={styles.txnItem}>
              <View style={styles.txnIconWrap}>
                <Text style={styles.txnIcon}>💳</Text>
              </View>
              <View style={styles.txnInfo}>
                <Text style={styles.txnMerchant}>{txn.merchant}</Text>
                <Text style={styles.txnDate}>{txn.date}</Text>
              </View>
              <Text style={styles.txnAmount}>-₹{txn.amount}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Edit Balance Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Set Wallet Balance</Text>
            <Text style={styles.modalSub}>Enter any amount to display</Text>
            <View style={styles.modalInput}>
              <Text style={styles.modalCurrency}>₹</Text>
              <TextInput
                style={styles.modalTextInput}
                value={newBalance}
                onChangeText={setNewBalance}
                keyboardType="numeric"
                placeholder="e.g. 5000"
                placeholderTextColor={COLORS.textMuted}
                autoFocus
              />
            </View>
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => {setEditModalVisible(false); setNewBalance('');}}>
                <Text style={styles.modalBtnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalBtnSet]}
                onPress={handleSetBalance}>
                <Text style={styles.modalBtnSetText}>Set Balance</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {flex: 1, backgroundColor: COLORS.dark},
  container: {flex: 1, backgroundColor: COLORS.dark},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {fontSize: 22, fontWeight: '800', color: COLORS.text},
  headerSub: {fontSize: 13, color: COLORS.textMuted, marginTop: 2},
  prankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.darkCard,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  prankBadgeEmoji: {fontSize: 16},
  prankBadgeText: {fontSize: 16, fontWeight: '800', color: COLORS.text},
  balanceCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: COLORS.primaryDark,
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  balanceCardBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#009E72',
    opacity: 0.6,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceLabel: {fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '600', marginBottom: 8},
  balanceValueRow: {flexDirection: 'row', alignItems: 'flex-start'},
  balanceCurrency: {fontSize: 22, color: '#fff', fontWeight: '700', marginTop: 6, marginRight: 2},
  balanceValue: {fontSize: 44, color: '#fff', fontWeight: '900', letterSpacing: -2},
  eyeBtn: {padding: 8},
  eyeIcon: {fontSize: 22},
  cardDivider: {height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginVertical: 16},
  cardActions: {flexDirection: 'row', alignItems: 'center'},
  cardActionBtn: {flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6},
  cardActionIcon: {fontSize: 16},
  cardActionText: {fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: '600'},
  cardActionDivider: {width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 16},
  cardCircle1: {
    position: 'absolute', width: 140, height: 140, borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)', top: -40, right: -20,
  },
  cardCircle2: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.04)', bottom: -20, right: 80,
  },
  actionsSection: {paddingHorizontal: 24, marginTop: 28},
  sectionTitle: {fontSize: 17, fontWeight: '700', color: COLORS.text, marginBottom: 16},
  actionsRow: {flexDirection: 'row', justifyContent: 'space-between'},
  quickAction: {alignItems: 'center', gap: 8},
  quickActionIcon: {
    width: 62, height: 62, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  quickActionEmoji: {fontSize: 26},
  quickActionLabel: {fontSize: 12, color: COLORS.textLight, fontWeight: '600'},
  statsCard: {
    marginHorizontal: 20, marginTop: 24,
    backgroundColor: COLORS.darkCard, borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: COLORS.border,
  },
  statsTitle: {fontSize: 15, fontWeight: '700', color: COLORS.text, marginBottom: 16},
  statsRow: {flexDirection: 'row', alignItems: 'center'},
  statItem: {flex: 1, alignItems: 'center'},
  statValue: {fontSize: 26, fontWeight: '900', color: COLORS.text, marginBottom: 4},
  statLabel: {fontSize: 11, color: COLORS.textMuted, fontWeight: '600'},
  statDivider: {width: 1, height: 36, backgroundColor: COLORS.border},
  txnSection: {paddingHorizontal: 20, marginTop: 24},
  txnHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14},
  seeAll: {fontSize: 13, color: COLORS.primary, fontWeight: '600'},
  txnItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.darkCard, borderRadius: 14,
    padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  txnIconWrap: {
    width: 42, height: 42, borderRadius: 12,
    backgroundColor: 'rgba(0,196,140,0.12)',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  txnIcon: {fontSize: 18},
  txnInfo: {flex: 1},
  txnMerchant: {fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: 3},
  txnDate: {fontSize: 12, color: COLORS.textMuted},
  txnAmount: {fontSize: 15, fontWeight: '700', color: COLORS.secondary},
  bottomSpacer: {height: 32},
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.darkCard,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 28, paddingBottom: 40,
  },
  modalTitle: {fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 6},
  modalSub: {fontSize: 13, color: COLORS.textMuted, marginBottom: 24},
  modalInput: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.darkCardAlt, borderRadius: 14,
    paddingHorizontal: 18, paddingVertical: 14, marginBottom: 24,
    borderWidth: 1, borderColor: COLORS.border,
  },
  modalCurrency: {fontSize: 22, fontWeight: '700', color: COLORS.textMuted, marginRight: 8},
  modalTextInput: {flex: 1, fontSize: 24, fontWeight: '800', color: COLORS.text},
  modalBtns: {flexDirection: 'row', gap: 12},
  modalBtn: {flex: 1, borderRadius: 14, paddingVertical: 16, alignItems: 'center'},
  modalBtnCancel: {backgroundColor: COLORS.darkCardAlt, borderWidth: 1, borderColor: COLORS.border},
  modalBtnCancelText: {fontSize: 15, fontWeight: '700', color: COLORS.textMuted},
  modalBtnSet: {backgroundColor: COLORS.primary},
  modalBtnSetText: {fontSize: 15, fontWeight: '700', color: '#fff'},
});

export default HomeScreen;
