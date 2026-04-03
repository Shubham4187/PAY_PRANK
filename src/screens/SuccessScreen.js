import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import {COLORS} from '../utils/theme';
import {saveTransaction, incrementPrankCount, updateLeaderboard} from '../utils/storage';

const {width} = Dimensions.get('window');

const STEPS = [
  {label: 'Connecting to bank...', duration: 900},
  {label: 'Verifying UPI ID...', duration: 700},
  {label: 'Authenticating...', duration: 800},
  {label: 'Processing payment...', duration: 1000},
  {label: 'Confirming with merchant...', duration: 600},
];

const SuccessScreen = ({navigation, route}) => {
  const {merchant, amount, note} = route.params;
  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState('loading'); // loading | success

  const spinAnim = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const checkOpacity = useRef(new Animated.Value(0)).current;
  const amountSlide = useRef(new Animated.Value(30)).current;
  const amountOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const stepOpacity = useRef(new Animated.Value(1)).current;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Spinner
    Animated.loop(
      Animated.timing(spinAnim, {toValue: 1, duration: 900, useNativeDriver: true}),
    ).start();

    // Progress through steps
    let elapsed = 0;
    const totalTime = STEPS.reduce((sum, s) => sum + s.duration, 0);

    STEPS.forEach((step, i) => {
      setTimeout(() => {
        Animated.timing(stepOpacity, {toValue: 0, duration: 150, useNativeDriver: true}).start(() => {
          setStepIndex(i);
          Animated.timing(stepOpacity, {toValue: 1, duration: 200, useNativeDriver: true}).start();
        });
      }, elapsed);

      Animated.timing(progressWidth, {
        toValue: (elapsed + step.duration) / totalTime,
        duration: step.duration,
        delay: elapsed,
        useNativeDriver: false,
      }).start();

      elapsed += step.duration;
    });

    // Show success
    setTimeout(() => {
      setPhase('success');
      spinAnim.stopAnimation();
      showSuccess();
    }, elapsed + 200);
  }, []);

  const showSuccess = async () => {
    // Save prank data
    const txn = {
      id: `TXN${Date.now()}`,
      merchant: merchant.name,
      amount: amount,
      date: 'Just now',
      status: 'success',
    };
    await saveTransaction(txn);
    const count = await incrementPrankCount();
    await updateLeaderboard(count);

    // Ring burst
    Animated.parallel([
      Animated.spring(ringScale, {toValue: 1.4, tension: 40, friction: 5, useNativeDriver: true}),
      Animated.timing(ringOpacity, {
        toValue: 0,
        duration: 700,
        delay: 0,
        useNativeDriver: true,
      }),
    ]).start();

    // Checkmark
    Animated.sequence([
      Animated.spring(checkScale, {toValue: 1.15, tension: 60, friction: 5, useNativeDriver: true}),
      Animated.spring(checkScale, {toValue: 1, tension: 60, friction: 8, useNativeDriver: true}),
    ]).start();
    Animated.timing(checkOpacity, {toValue: 1, duration: 250, useNativeDriver: true}).start();

    // Amount
    Animated.parallel([
      Animated.timing(amountOpacity, {toValue: 1, duration: 400, delay: 300, useNativeDriver: true}),
      Animated.timing(amountSlide, {toValue: 0, duration: 400, delay: 300, useNativeDriver: true}),
    ]).start();

    // Navigate to prank reveal
    setTimeout(() => {
      navigation.replace('PrankReveal', {merchant, amount});
    }, 2200);
  };

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressInterpolated = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  if (phase === 'loading') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />

        <View style={styles.loadingContent}>
          {/* Spinner */}
          <View style={styles.spinnerWrap}>
            <View style={styles.spinnerTrack} />
            <Animated.View
              style={[styles.spinnerFill, {transform: [{rotate: spin}]}]}
            />
            <View style={styles.spinnerCenter}>
              <Text style={styles.spinnerIcon}>💳</Text>
            </View>
          </View>

          <Text style={styles.loadingTitle}>Processing Payment</Text>
          <Animated.Text style={[styles.loadingStep, {opacity: stepOpacity}]}>
            {STEPS[stepIndex].label}
          </Animated.Text>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <Animated.View
              style={[styles.progressFill, {width: progressInterpolated}]}
            />
          </View>

          <View style={styles.merchantRow}>
            <Text style={styles.merchantLabel}>Paying to</Text>
            <Text style={styles.merchantValue}>{merchant.name}</Text>
          </View>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountValue}>₹{amount.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.securityNote}>
          <Text style={styles.securityNoteText}>
            🔐 256-bit encrypted · UPI secured
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />
      <View style={styles.bgDot} />

      <View style={styles.successContent}>
        {/* Ring burst */}
        <Animated.View
          style={[
            styles.ring,
            {
              opacity: ringOpacity,
              transform: [{scale: ringScale}],
            },
          ]}
        />

        {/* Check circle */}
        <Animated.View
          style={[
            styles.checkCircle,
            {opacity: checkOpacity, transform: [{scale: checkScale}]},
          ]}>
          <Text style={styles.checkIcon}>✓</Text>
        </Animated.View>

        <Animated.View
          style={{
            opacity: amountOpacity,
            transform: [{translateY: amountSlide}],
            alignItems: 'center',
          }}>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successAmount}>₹{amount.toFixed(2)}</Text>
          <Text style={styles.successMerchant}>Paid to {merchant.name}</Text>
          <Text style={styles.successTxnId}>
            Txn ID: TXN{Date.now().toString().slice(-8)}
          </Text>
        </Animated.View>

        <View style={styles.revealHint}>
          <Text style={styles.revealHintText}>Revealing in a moment... 🎭</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.dark, alignItems: 'center', justifyContent: 'center'},
  bgDot: {
    position: 'absolute',
    width: 400, height: 400, borderRadius: 200,
    backgroundColor: COLORS.primary, opacity: 0.04,
    top: -100,
  },
  loadingContent: {alignItems: 'center', paddingHorizontal: 40, width: '100%'},
  spinnerWrap: {width: 100, height: 100, marginBottom: 32, alignItems: 'center', justifyContent: 'center'},
  spinnerTrack: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    borderWidth: 4, borderColor: COLORS.border,
  },
  spinnerFill: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    borderWidth: 4, borderColor: 'transparent',
    borderTopColor: COLORS.primary,
  },
  spinnerCenter: {
    width: 68, height: 68, borderRadius: 34,
    backgroundColor: COLORS.darkCard,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  spinnerIcon: {fontSize: 28},
  loadingTitle: {fontSize: 22, fontWeight: '800', color: COLORS.text, marginBottom: 10},
  loadingStep: {fontSize: 14, color: COLORS.textMuted, marginBottom: 28, height: 20},
  progressTrack: {
    width: '100%', height: 4,
    backgroundColor: COLORS.border, borderRadius: 4,
    overflow: 'hidden', marginBottom: 32,
  },
  progressFill: {
    height: '100%', backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  merchantRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    width: '100%', paddingVertical: 10,
    borderBottomWidth: 1, borderColor: COLORS.border,
  },
  amountRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    width: '100%', paddingVertical: 10,
  },
  merchantLabel: {fontSize: 14, color: COLORS.textMuted},
  merchantValue: {fontSize: 14, fontWeight: '700', color: COLORS.text},
  amountLabel: {fontSize: 14, color: COLORS.textMuted},
  amountValue: {fontSize: 14, fontWeight: '700', color: COLORS.primary},
  securityNote: {position: 'absolute', bottom: 48},
  securityNoteText: {fontSize: 13, color: COLORS.textMuted},
  successContent: {alignItems: 'center', paddingHorizontal: 32},
  ring: {
    position: 'absolute',
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 3, borderColor: COLORS.primary,
  },
  checkCircle: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 28,
    shadowColor: COLORS.primary, shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.5, shadowRadius: 20, elevation: 12,
  },
  checkIcon: {fontSize: 46, color: '#fff', fontWeight: '900'},
  successTitle: {fontSize: 24, fontWeight: '900', color: COLORS.text, marginBottom: 10},
  successAmount: {fontSize: 48, fontWeight: '900', color: COLORS.primary, letterSpacing: -2, marginBottom: 8},
  successMerchant: {fontSize: 15, color: COLORS.textLight, marginBottom: 8},
  successTxnId: {fontSize: 12, color: COLORS.textMuted, marginBottom: 40},
  revealHint: {
    backgroundColor: 'rgba(255,217,61,0.1)',
    borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(255,217,61,0.25)',
  },
  revealHintText: {fontSize: 14, color: COLORS.accent, fontWeight: '600'},
});

export default SuccessScreen;
