import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, FAKE_TRANSACTIONS} from '../utils/theme';
import {getTransactions} from '../utils/storage';

const TransactionHistoryScreen = ({navigation}) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    loadTxns();
  }, []);

  const loadTxns = async () => {
    const txns = await getTransactions();
    setTransactions(txns.length > 0 ? txns : FAKE_TRANSACTIONS);
  };

  const renderItem = ({item, index}) => (
    <View style={[styles.txnCard, index === 0 && styles.firstCard]}>
      <View style={styles.txnLeft}>
        <View style={styles.txnIconWrap}>
          <Text style={styles.txnIcon}>💳</Text>
        </View>
        <View>
          <Text style={styles.txnMerchant}>{item.merchant}</Text>
          <Text style={styles.txnDate}>{item.date}</Text>
          <Text style={styles.txnId}>Txn ID: {item.id}</Text>
        </View>
      </View>
      <View style={styles.txnRight}>
        <Text style={styles.txnAmount}>-₹{item.amount}</Text>
        <View style={styles.txnStatus}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>Prank ✓</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={{width: 44}} />
      </View>

      <View style={styles.banner}>
        <Text style={styles.bannerIcon}>🎭</Text>
        <Text style={styles.bannerText}>
          All transactions are simulated pranks. No real money was involved.
        </Text>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderItem}
        keyExtractor={(item, i) => item.id || String(i)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>😴</Text>
            <Text style={styles.emptyTitle}>No Pranks Yet</Text>
            <Text style={styles.emptyText}>Go scan a QR code and prank someone!</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.dark},
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.darkCard, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  backIcon: {fontSize: 20, color: COLORS.text},
  headerTitle: {fontSize: 17, fontWeight: '700', color: COLORS.text},
  banner: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginBottom: 16,
    backgroundColor: 'rgba(255,217,61,0.08)',
    borderRadius: 14, padding: 14, gap: 10,
    borderWidth: 1, borderColor: 'rgba(255,217,61,0.2)',
  },
  bannerIcon: {fontSize: 18},
  bannerText: {flex: 1, fontSize: 12, color: COLORS.accent, lineHeight: 18},
  list: {paddingHorizontal: 20, paddingBottom: 24},
  txnCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.darkCard, borderRadius: 16,
    padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  firstCard: {borderColor: 'rgba(0,196,140,0.3)'},
  txnLeft: {flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1},
  txnIconWrap: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: 'rgba(0,196,140,0.1)',
    alignItems: 'center', justifyContent: 'center',
  },
  txnIcon: {fontSize: 20},
  txnMerchant: {fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 2},
  txnDate: {fontSize: 12, color: COLORS.textMuted, marginBottom: 2},
  txnId: {fontSize: 10, color: COLORS.border},
  txnRight: {alignItems: 'flex-end'},
  txnAmount: {fontSize: 16, fontWeight: '800', color: COLORS.secondary, marginBottom: 6},
  txnStatus: {flexDirection: 'row', alignItems: 'center', gap: 5},
  statusDot: {width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.primary},
  statusText: {fontSize: 11, fontWeight: '600', color: COLORS.primary},
  emptyState: {alignItems: 'center', paddingTop: 80},
  emptyIcon: {fontSize: 60, marginBottom: 16},
  emptyTitle: {fontSize: 20, fontWeight: '800', color: COLORS.text, marginBottom: 8},
  emptyText: {fontSize: 14, color: COLORS.textMuted, textAlign: 'center'},
});

export default TransactionHistoryScreen;
