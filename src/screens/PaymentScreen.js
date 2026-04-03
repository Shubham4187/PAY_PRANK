import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../utils/theme';

const QUICK_AMOUNTS = [50, 100, 200, 500, 1000];

const PaymentScreen = ({navigation, route}) => {
  const {merchant} = route.params;
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const btnScale = useRef(new Animated.Value(1)).current;

  const handleAmountChange = val => {
    const cleaned = val.replace(/[^0-9.]/g, '');
    if (cleaned.split('.').length > 2) return;
    setAmount(cleaned);
    if (error) setError('');
  };

  const handlePay = () => {
    const val = parseFloat(amount);
    if (!amount || isNaN(val) || val <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (val > 100000) {
      setError('Amount too large for a prank! Keep it realistic 😄');
      return;
    }

    Keyboard.dismiss();

    Animated.sequence([
      Animated.timing(btnScale, {toValue: 0.94, duration: 80, useNativeDriver: true}),
      Animated.timing(btnScale, {toValue: 1, duration: 120, useNativeDriver: true}),
    ]).start(() => {
      navigation.navigate('Success', {
        merchant,
        amount: val,
        note: note || 'Payment',
      });
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Send Money</Text>
          <View style={{width: 44}} />
        </View>

        {/* Merchant Info */}
        <View style={styles.merchantCard}>
          <View style={styles.merchantAvatar}>
            <Text style={styles.merchantEmoji}>🏪</Text>
          </View>
          <View>
            <Text style={styles.merchantName}>{merchant.name}</Text>
            <Text style={styles.merchantCategory}>{merchant.category}</Text>
          </View>
          <View style={styles.lockBadge}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        </View>

        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Enter Amount</Text>
          <View style={[styles.amountInputWrap, error && styles.amountInputError]}>
            <Text style={styles.rupee}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={COLORS.border}
              autoFocus
              maxLength={8}
            />
          </View>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Quick amounts */}
          <View style={styles.quickAmounts}>
            {QUICK_AMOUNTS.map(q => (
              <TouchableOpacity
                key={q}
                style={[styles.quickChip, amount === String(q) && styles.quickChipActive]}
                onPress={() => {setAmount(String(q)); setError('');}}>
                <Text
                  style={[
                    styles.quickChipText,
                    amount === String(q) && styles.quickChipTextActive,
                  ]}>
                  ₹{q}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Note */}
        <View style={styles.noteSection}>
          <Text style={styles.noteLabel}>Add Note (optional)</Text>
          <TextInput
            style={styles.noteInput}
            value={note}
            onChangeText={setNote}
            placeholder="What's this for?"
            placeholderTextColor={COLORS.textMuted}
            maxLength={50}
          />
        </View>

        {/* Security notice */}
        <View style={styles.securityRow}>
          <Text style={styles.securityIcon}>🎭</Text>
          <Text style={styles.securityText}>
            Powered by PayPrank Fest Engine — Simulated & Safe
          </Text>
        </View>

        {/* Pay Button */}
        <View style={styles.payBtnWrap}>
          <Animated.View style={{transform: [{scale: btnScale}]}}>
            <TouchableOpacity
              style={[styles.payBtn, !amount && styles.payBtnDisabled]}
              onPress={handlePay}
              activeOpacity={0.9}>
              <Text style={styles.payBtnText}>
                Pay {amount ? `₹${parseFloat(amount).toFixed(2)}` : ''}
              </Text>
              <Text style={styles.payBtnArrow}>→</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
    backgroundColor: COLORS.darkCard,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  backIcon: {fontSize: 20, color: COLORS.text},
  headerTitle: {fontSize: 17, fontWeight: '700', color: COLORS.text},
  merchantCard: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginTop: 8, marginBottom: 32,
    backgroundColor: COLORS.darkCard, borderRadius: 18,
    padding: 16, gap: 14,
    borderWidth: 1, borderColor: COLORS.border,
  },
  merchantAvatar: {
    width: 52, height: 52, borderRadius: 14,
    backgroundColor: 'rgba(0,196,140,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
  merchantEmoji: {fontSize: 24},
  merchantName: {fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 3},
  merchantCategory: {fontSize: 12, color: COLORS.textMuted},
  lockBadge: {marginLeft: 'auto'},
  lockIcon: {fontSize: 18},
  amountSection: {paddingHorizontal: 24},
  amountLabel: {fontSize: 13, color: COLORS.textMuted, fontWeight: '600', marginBottom: 14},
  amountInputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 2, borderBottomColor: COLORS.border,
    paddingBottom: 8, marginBottom: 6,
  },
  amountInputError: {borderBottomColor: COLORS.error},
  rupee: {fontSize: 36, fontWeight: '700', color: COLORS.textMuted, marginRight: 8, marginTop: 4},
  amountInput: {flex: 1, fontSize: 52, fontWeight: '900', color: COLORS.text},
  errorText: {fontSize: 12, color: COLORS.error, marginTop: 6, marginBottom: 4},
  quickAmounts: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 20,
  },
  quickChip: {
    paddingHorizontal: 16, paddingVertical: 9,
    backgroundColor: COLORS.darkCard, borderRadius: 10,
    borderWidth: 1, borderColor: COLORS.border,
  },
  quickChipActive: {backgroundColor: COLORS.primary, borderColor: COLORS.primary},
  quickChipText: {fontSize: 13, fontWeight: '600', color: COLORS.textMuted},
  quickChipTextActive: {color: '#fff'},
  noteSection: {paddingHorizontal: 24, marginTop: 28},
  noteLabel: {fontSize: 13, color: COLORS.textMuted, fontWeight: '600', marginBottom: 10},
  noteInput: {
    backgroundColor: COLORS.darkCard, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 15, color: COLORS.text,
    borderWidth: 1, borderColor: COLORS.border,
  },
  securityRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, marginTop: 20, gap: 8,
  },
  securityIcon: {fontSize: 14},
  securityText: {fontSize: 12, color: COLORS.textMuted},
  payBtnWrap: {
    position: 'absolute', bottom: 32, left: 20, right: 20,
  },
  payBtn: {
    backgroundColor: COLORS.primary, borderRadius: 18,
    paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: COLORS.primary, shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4, shadowRadius: 16, elevation: 10,
  },
  payBtnDisabled: {opacity: 0.5},
  payBtnText: {fontSize: 19, fontWeight: '900', color: '#fff'},
  payBtnArrow: {fontSize: 19, color: '#fff', fontWeight: '900'},
});

export default PaymentScreen;
