import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import {COLORS} from '../utils/theme';
import {getBalance, saveBalance} from '../utils/storage';

const {width, height} = Dimensions.get('window');

const SplashScreen = ({navigation}) => {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const disclaimerOpacity = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.6)).current;
  const ringOpacity = useRef(new Animated.Value(0.4)).current;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Initialize balance
    getBalance().then(bal => saveBalance(bal));

    // Ring pulse
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 1.3,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(ringScale, {
            toValue: 0.6,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity, {
            toValue: 0.4,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ).start();

    // Logo entrance
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(300),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(400),
      Animated.timing(disclaimerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
    ]).start(() => {
      navigation.replace('Home');
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />

      {/* Background gradient dots */}
      <View style={styles.bgDot1} />
      <View style={styles.bgDot2} />

      {/* Pulsing ring */}
      <Animated.View
        style={[
          styles.ring,
          {
            opacity: ringOpacity,
            transform: [{scale: ringScale}],
          },
        ]}
      />

      {/* Logo */}
      <Animated.View
        style={{
          opacity: logoOpacity,
          transform: [{scale: logoScale}],
          alignItems: 'center',
        }}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>💸</Text>
        </View>
        <Text style={styles.appName}>PayPrank</Text>
        <Animated.Text style={[styles.tagline, {opacity: taglineOpacity}]}>
          Fest Fun Payment Simulator
        </Animated.Text>
      </Animated.View>

      {/* Disclaimer */}
      <Animated.View style={[styles.disclaimerBox, {opacity: disclaimerOpacity}]}>
        <Text style={styles.disclaimerIcon}>⚠️</Text>
        <Text style={styles.disclaimerText}>
          This is a simulated app for entertainment purposes only. No real
          payments are processed.
        </Text>
      </Animated.View>

      {/* Bottom dots */}
      <View style={styles.dots}>
        {[0, 1, 2].map(i => (
          <View
            key={i}
            style={[styles.dot, i === 1 && {backgroundColor: COLORS.primary}]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgDot1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: COLORS.primary,
    opacity: 0.04,
    top: -80,
    right: -80,
  },
  bgDot2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.secondary,
    opacity: 0.04,
    bottom: 60,
    left: -60,
  },
  ring: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: COLORS.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  logoEmoji: {
    fontSize: 46,
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  disclaimerBox: {
    position: 'absolute',
    bottom: 80,
    left: 28,
    right: 28,
    backgroundColor: 'rgba(255,107,107,0.12)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,107,107,0.25)',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  disclaimerIcon: {
    fontSize: 16,
    marginTop: 1,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12.5,
    color: '#FF6B6B',
    lineHeight: 18,
    fontWeight: '500',
  },
  dots: {
    position: 'absolute',
    bottom: 36,
    flexDirection: 'row',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
});

export default SplashScreen;
