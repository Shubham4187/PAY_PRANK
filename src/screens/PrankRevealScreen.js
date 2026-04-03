import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
  Share,
} from 'react-native';
import {COLORS, PRANK_MESSAGES} from '../utils/theme';
import Confetti from '../components/Confetti';
import {getPrankCount} from '../utils/storage';

const {width, height} = Dimensions.get('window');

const PrankRevealScreen = ({navigation, route}) => {
  const {merchant, amount} = route.params;
  const [confettiActive, setConfettiActive] = useState(false);
  const [prankCount, setPrankCount] = useState(0);
  const [message] = useState(
    PRANK_MESSAGES[Math.floor(Math.random() * PRANK_MESSAGES.length)],
  );

  const cardScale = useRef(new Animated.Value(0.7)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const emojiScale = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const btnsOpacity = useRef(new Animated.Value(0)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const bgPulse = useRef(new Animated.Value(0)).current;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getPrankCount().then(setPrankCount);

    // Background pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(bgPulse, {toValue: 1, duration: 2000, useNativeDriver: true}),
        Animated.timing(bgPulse, {toValue: 0, duration: 2000, useNativeDriver: true}),
      ]),
    ).start();

    setTimeout(() => setConfettiActive(true), 200);

    // Card entrance
    Animated.sequence([
      Animated.parallel([
        Animated.spring(cardScale, {toValue: 1, tension: 55, friction: 7, useNativeDriver: true}),
        Animated.timing(cardOpacity, {toValue: 1, duration: 400, useNativeDriver: true}),
      ]),
      Animated.spring(emojiScale, {toValue: 1, tension: 50, friction: 5, useNativeDriver: true}),
      // Shake emoji
      Animated.sequence(
        Array.from({length: 4}).flatMap(() => [
          Animated.timing(shakeAnim, {toValue: 10, duration: 60, useNativeDriver: true}),
          Animated.timing(shakeAnim, {toValue: -10, duration: 60, useNativeDriver: true}),
        ]),
      ),
      Animated.timing(shakeAnim, {toValue: 0, duration: 60, useNativeDriver: true}),
      Animated.timing(textOpacity, {toValue: 1, duration: 400, useNativeDriver: true}),
      Animated.delay(200),
      Animated.timing(btnsOpacity, {toValue: 1, duration: 400, useNativeDriver: true}),
    ]).start();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `😂 I just pranked someone with PayPrank at the college fest! They thought I paid ₹${amount} to ${merchant.name}! Download PayPrank for the fest! 🎭`,
        title: 'PayPrank — Fest Prank App',
      });
    } catch (e) {
      console.warn('Share error', e);
    }
  };

  const bgColor = bgPulse.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,107,107,0.06)', 'rgba(255,107,107,0.10)'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />
      <Confetti active={confettiActive} />

      {/* Animated background */}
      <Animated.View style={[StyleSheet.absoluteFillObject, {backgroundColor: bgColor}]} />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <Animated.View
        style={[
          styles.card,
          {opacity: cardOpacity, transform: [{scale: cardScale}]},
        ]}>

        {/* Big emoji */}
        <Animated.View
          style={{
            transform: [
              {scale: emojiScale},
              {translateX: shakeAnim},
            ],
          }}>
          <Text style={styles.bigEmoji}>😂</Text>
        </Animated.View>

        <Animated.View style={{opacity: textOpacity, alignItems: 'center'}}>
          <Text style={styles.prankTitle}>YOU'VE BEEN PRANKED!</Text>
          <Text style={styles.prankMessage}>{message}</Text>

          <View style={styles.prankDetails}>
            <View style={styles.prankDetailRow}>
              <Text style={styles.prankDetailLabel}>Fake Merchant</Text>
              <Text style={styles.prankDetailValue}>{merchant.name}</Text>
            </View>
            <View style={styles.prankDetailRow}>
              <Text style={styles.prankDetailLabel}>Fake Amount</Text>
              <Text style={[styles.prankDetailValue, {color: COLORS.primary}]}>
                ₹{parseFloat(amount).toFixed(2)}
              </Text>
            </View>
            <View style={[styles.prankDetailRow, {borderBottomWidth: 0}]}>
              <Text style={styles.prankDetailLabel}>Status</Text>
              <Text style={[styles.prankDetailValue, {color: COLORS.accent}]}>
                🎭 100% Fake
              </Text>
            </View>
          </View>

          <View style={styles.disclaimerPill}>
            <Text style={styles.disclaimerText}>
              ⚠️ No real money was transferred. This is PayPrank — a fest entertainment app.
            </Text>
          </View>

          <View style={styles.prankCountWrap}>
            <Text style={styles.prankCountLabel}>Your Prank Count</Text>
            <Text style={styles.prankCount}>{prankCount} 🎭</Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Action buttons */}
      <Animated.View style={[styles.buttons, {opacity: btnsOpacity}]}>
        <TouchableOpacity
          style={styles.shareBtn}
          onPress={handleShare}>
          <Text style={styles.shareBtnText}>🔗 Share the Prank</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.leaderBtn}
          onPress={() => navigation.navigate('Leaderboard')}>
          <Text style={styles.leaderBtnText}>🏆 Leaderboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.homeBtnText}>Prank Someone Else →</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: COLORS.dark,
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 20,
  },
  bgCircle1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: COLORS.secondary, opacity: 0.05,
    top: -80, right: -80,
  },
  bgCircle2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: COLORS.accent, opacity: 0.04,
    bottom: 100, left: -60,
  },
  card: {
    backgroundColor: COLORS.darkCard,
    borderRadius: 28, padding: 28,
    alignItems: 'center', width: '100%',
    borderWidth: 1, borderColor: 'rgba(255,107,107,0.25)',
    shadowColor: COLORS.secondary,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.25, shadowRadius: 24,
    elevation: 12,
    marginBottom: 20,
  },
  bigEmoji: {fontSize: 72, marginBottom: 16},
  prankTitle: {
    fontSize: 26, fontWeight: '900', color: COLORS.secondary,
    letterSpacing: 1, marginBottom: 10, textAlign: 'center',
  },
  prankMessage: {
    fontSize: 16, color: COLORS.textLight,
    textAlign: 'center', lineHeight: 24, marginBottom: 24,
    fontWeight: '500',
  },
  prankDetails: {
    width: '100%', backgroundColor: COLORS.darkCardAlt,
    borderRadius: 16, marginBottom: 16,
    borderWidth: 1, borderColor: COLORS.border,
    overflow: 'hidden',
  },
  prankDetailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderColor: COLORS.border,
  },
  prankDetailLabel: {fontSize: 13, color: COLORS.textMuted},
  prankDetailValue: {fontSize: 13, fontWeight: '700', color: COLORS.text},
  disclaimerPill: {
    backgroundColor: 'rgba(255,107,107,0.1)',
    borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(255,107,107,0.2)',
    marginBottom: 20, width: '100%',
  },
  disclaimerText: {
    fontSize: 12, color: COLORS.secondary,
    textAlign: 'center', lineHeight: 18,
  },
  prankCountWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,217,61,0.08)',
    borderRadius: 12, paddingHorizontal: 20, paddingVertical: 10,
    borderWidth: 1, borderColor: 'rgba(255,217,61,0.2)',
  },
  prankCountLabel: {fontSize: 13, color: COLORS.textMuted},
  prankCount: {fontSize: 20, fontWeight: '900', color: COLORS.accent},
  buttons: {width: '100%', gap: 10},
  shareBtn: {
    backgroundColor: COLORS.darkCard, borderRadius: 16,
    paddingVertical: 15, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  shareBtnText: {fontSize: 15, fontWeight: '700', color: COLORS.text},
  leaderBtn: {
    backgroundColor: 'rgba(155,89,182,0.15)', borderRadius: 16,
    paddingVertical: 15, alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(155,89,182,0.3)',
  },
  leaderBtnText: {fontSize: 15, fontWeight: '700', color: '#C39BD3'},
  homeBtn: {
    backgroundColor: COLORS.primary, borderRadius: 16,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: COLORS.primary, shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  homeBtnText: {fontSize: 16, fontWeight: '800', color: '#fff'},
});

export default PrankRevealScreen;
