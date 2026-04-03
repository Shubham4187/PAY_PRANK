import React, {useEffect, useRef} from 'react';
import {View, Animated, StyleSheet, Dimensions} from 'react-native';
import {CONFETTI_COLORS} from '../utils/theme';

const {width, height} = Dimensions.get('window');

const ConfettiPiece = ({delay, startX, color, shape}) => {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const driftX = (Math.random() - 0.5) * 200;
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height + 50,
          duration: 2800 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: driftX,
          duration: 2800 + Math.random() * 1000,
          useNativeDriver: true,
        }),
        Animated.timing(rotate, {
          toValue: 1,
          duration: 1200 + Math.random() * 800,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(1800),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${360 + Math.random() * 360}deg`],
  });

  const size = 8 + Math.random() * 8;

  return (
    <Animated.View
      style={[
        styles.piece,
        {
          left: startX,
          backgroundColor: color,
          width: shape === 'circle' ? size : size * 1.6,
          height: size,
          borderRadius: shape === 'circle' ? size / 2 : 2,
          opacity,
          transform: [{translateY}, {translateX}, {rotate: spin}],
        },
      ]}
    />
  );
};

const Confetti = ({active}) => {
  if (!active) return null;

  const pieces = Array.from({length: 60}, (_, i) => ({
    id: i,
    delay: Math.random() * 600,
    startX: Math.random() * width,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    shape: Math.random() > 0.5 ? 'rect' : 'circle',
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {pieces.map(p => (
        <ConfettiPiece key={p.id} {...p} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  piece: {
    position: 'absolute',
    top: 0,
  },
});

export default Confetti;
