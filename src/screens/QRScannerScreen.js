import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS, MERCHANTS} from '../utils/theme';

const {width, height} = Dimensions.get('window');
const FRAME_SIZE = width * 0.68;

const QRScannerScreen = ({navigation}) => {
  const [scanning, setScanning] = useState(false);
  const [detected, setDetected] = useState(false);
  const [merchant, setMerchant] = useState(null);

  const scanLine = useRef(new Animated.Value(0)).current;
  const cornerScale = useRef(new Animated.Value(0.8)).current;
  const cornerOpacity = useRef(new Animated.Value(0)).current;
  const resultSlide = useRef(new Animated.Value(100)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Animate corners
    Animated.parallel([
      Animated.spring(cornerScale, {toValue: 1, tension: 50, friction: 6, useNativeDriver: true}),
      Animated.timing(cornerOpacity, {toValue: 1, duration: 400, useNativeDriver: true}),
    ]).start();

    // Scan line loop
    startScanLine();
  }, []);

  const startScanLine = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLine, {toValue: 1, duration: 1800, useNativeDriver: true}),
        Animated.timing(scanLine, {toValue: 0, duration: 1800, useNativeDriver: true}),
      ]),
    ).start();
  };

  const handleScan = () => {
    if (scanning || detected) return;
    setScanning(true);

    // Flash effect
    Animated.sequence([
      Animated.timing(flashOpacity, {toValue: 0.6, duration: 80, useNativeDriver: true}),
      Animated.timing(flashOpacity, {toValue: 0, duration: 200, useNativeDriver: true}),
    ]).start();

    setTimeout(() => {
      const randomMerchant = MERCHANTS[Math.floor(Math.random() * MERCHANTS.length)];
      setMerchant(randomMerchant);
      setDetected(true);
      setScanning(false);

      Animated.parallel([
        Animated.spring(resultSlide, {toValue: 0, tension: 50, friction: 8, useNativeDriver: true}),
        Animated.timing(resultOpacity, {toValue: 1, duration: 300, useNativeDriver: true}),
      ]).start();
    }, 1500);
  };

  const scanLineTranslate = scanLine.interpolate({
    inputRange: [0, 1],
    outputRange: [0, FRAME_SIZE - 4],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Fake camera bg */}
      <View style={styles.cameraView}>
        <View style={styles.cameraNoise} />
        {Array.from({length: 20}).map((_, i) => (
          <View
            key={i}
            style={[
              styles.cameraParticle,
              {
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: 0.04 + Math.random() * 0.08,
                width: 2 + Math.random() * 4,
                height: 2 + Math.random() * 4,
              },
            ]}
          />
        ))}
      </View>

      {/* Dark overlay */}
      <View style={styles.overlay}>
        {/* Top area */}
        <View style={styles.overlayTop} />
        {/* Middle row */}
        <View style={styles.overlayMiddle}>
          <View style={styles.overlaySide} />
          {/* Scanner frame */}
          <Animated.View
            style={[
              styles.scanFrame,
              {
                transform: [{scale: cornerScale}],
                opacity: cornerOpacity,
              },
            ]}>
            {/* Corners */}
            {[
              {top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 4},
              {top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4},
              {bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 4},
              {bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 4},
            ].map((style, i) => (
              <View
                key={i}
                style={[styles.corner, style, {borderColor: detected ? COLORS.primary : '#fff'}]}
              />
            ))}

            {/* Scan line */}
            {!detected && (
              <Animated.View
                style={[
                  styles.scanLine,
                  {transform: [{translateY: scanLineTranslate}]},
                ]}
              />
            )}

            {/* Detected checkmark */}
            {detected && (
              <View style={styles.detectedOverlay}>
                <Text style={styles.detectedCheck}>✓</Text>
              </View>
            )}
          </Animated.View>
          <View style={styles.overlaySide} />
        </View>
        {/* Bottom area */}
        <View style={styles.overlayBottom} />
      </View>

      {/* Flash */}
      <Animated.View
        style={[styles.flash, {opacity: flashOpacity}]}
        pointerEvents="none"
      />

      {/* Header */}
      <SafeAreaView style={styles.header} edges={['top']}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <View style={{width: 44}} />
      </SafeAreaView>

      {/* Prompt */}
      {!detected && (
        <View style={styles.promptContainer}>
          <Text style={styles.promptText}>
            {scanning ? '🔍 Scanning...' : 'Point at any QR code or tap below'}
          </Text>
          <TouchableOpacity
            style={[styles.scanBtn, scanning && styles.scanBtnDisabled]}
            onPress={handleScan}
            disabled={scanning}>
            <Text style={styles.scanBtnText}>
              {scanning ? 'Detecting...' : '📷 Simulate Scan'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Result Card */}
      {detected && merchant && (
        <Animated.View
          style={[
            styles.resultCard,
            {
              opacity: resultOpacity,
              transform: [{translateY: resultSlide}],
            },
          ]}>
          <View style={styles.resultTop}>
            <View style={styles.merchantAvatar}>
              <Text style={styles.merchantAvatarEmoji}>🏪</Text>
            </View>
            <View style={styles.merchantInfo}>
              <Text style={styles.merchantName}>{merchant.name}</Text>
              <Text style={styles.merchantCategory}>{merchant.category}</Text>
              <Text style={styles.merchantId}>ID: {merchant.id}</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.proceedBtn}
            onPress={() => navigation.navigate('Payment', {merchant})}>
            <Text style={styles.proceedBtnText}>Proceed to Pay →</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.rescanBtn}
            onPress={() => {
              setDetected(false);
              setMerchant(null);
              resultSlide.setValue(100);
              resultOpacity.setValue(0);
            }}>
            <Text style={styles.rescanBtnText}>Scan Again</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000'},
  cameraView: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0a1018',
  },
  cameraNoise: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  cameraParticle: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: FRAME_SIZE,
  },
  overlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  overlayBottom: {
    flex: 1.5,
    backgroundColor: 'rgba(0,0,0,0.72)',
  },
  scanFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    position: 'relative',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 5,
  },
  detectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,196,140,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detectedCheck: {
    fontSize: 72,
    color: COLORS.primary,
    fontWeight: '900',
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#fff',
    zIndex: 10,
  },
  header: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 20,
  },
  backBtn: {
    width: 44, height: 44,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: {fontSize: 20, color: '#fff'},
  headerTitle: {fontSize: 17, fontWeight: '700', color: '#fff'},
  promptContainer: {
    position: 'absolute',
    bottom: 60,
    left: 24, right: 24,
    alignItems: 'center',
    zIndex: 20,
  },
  promptText: {
    fontSize: 14, color: 'rgba(255,255,255,0.7)',
    marginBottom: 16, textAlign: 'center',
  },
  scanBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16, paddingHorizontal: 40,
    shadowColor: COLORS.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  scanBtnDisabled: {opacity: 0.6},
  scanBtnText: {fontSize: 16, fontWeight: '700', color: '#fff'},
  resultCard: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.darkCard,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingBottom: 36,
    zIndex: 20,
    borderWidth: 1, borderColor: COLORS.border,
  },
  resultTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 14,
  },
  merchantAvatar: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: 'rgba(0,196,140,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  merchantAvatarEmoji: {fontSize: 28},
  merchantInfo: {flex: 1},
  merchantName: {fontSize: 16, fontWeight: '800', color: COLORS.text, marginBottom: 3},
  merchantCategory: {fontSize: 12, color: COLORS.textMuted, marginBottom: 2},
  merchantId: {fontSize: 11, color: COLORS.textMuted},
  verifiedBadge: {
    backgroundColor: 'rgba(0,196,140,0.15)',
    borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(0,196,140,0.3)',
  },
  verifiedText: {fontSize: 11, fontWeight: '700', color: COLORS.primary},
  proceedBtn: {
    backgroundColor: COLORS.primary, borderRadius: 16,
    paddingVertical: 17, alignItems: 'center', marginBottom: 12,
    shadowColor: COLORS.primary, shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  proceedBtnText: {fontSize: 17, fontWeight: '800', color: '#fff'},
  rescanBtn: {
    backgroundColor: COLORS.darkCardAlt, borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  rescanBtnText: {fontSize: 14, fontWeight: '600', color: COLORS.textMuted},
});

export default QRScannerScreen;
