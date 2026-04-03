import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Animated,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../utils/theme';
import {getLeaderboard, getPrankCount} from '../utils/storage';

const RANK_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
const RANK_EMOJI = ['🥇', '🥈', '🥉'];

const LeaderboardRow = ({item, index, delay}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(30)).current;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {toValue: 1, duration: 400, delay, useNativeDriver: true}),
      Animated.timing(slide, {toValue: 0, duration: 350, delay, useNativeDriver: true}),
    ]).start();
  }, []);

  const isTop3 = item.rank <= 3;

  return (
    <Animated.View
      style={[
        styles.row,
        item.isMe && styles.myRow,
        isTop3 && styles.topRow,
        {opacity, transform: [{translateY: slide}]},
      ]}>
      <View style={styles.rankWrap}>
        {isTop3 ? (
          <Text style={styles.rankEmoji}>{RANK_EMOJI[item.rank - 1]}</Text>
        ) : (
          <Text style={[styles.rankNum, item.isMe && {color: COLORS.primary}]}>
            {item.rank}
          </Text>
        )}
      </View>

      <View style={styles.avatarWrap}>
        <Text style={styles.avatar}>{item.avatar}</Text>
        {item.isMe && <View style={styles.meDot} />}
      </View>

      <View style={styles.nameWrap}>
        <Text style={[styles.name, item.isMe && {color: COLORS.primary}]}>
          {item.name}
          {item.isMe ? ' (You)' : ''}
        </Text>
        <Text style={styles.prankLabel}>
          {item.pranks === 0 ? 'No pranks yet' : `${item.pranks} prank${item.pranks === 1 ? '' : 's'}`}
        </Text>
      </View>

      <View style={[styles.scoreWrap, isTop3 && {backgroundColor: RANK_COLORS[item.rank - 1] + '20'}]}>
        <Text style={[styles.score, isTop3 && {color: RANK_COLORS[item.rank - 1]}]}>
          {item.pranks}
        </Text>
        <Text style={styles.scoreLabel}>pranks</Text>
      </View>
    </Animated.View>
  );
};

const LeaderboardScreen = ({navigation}) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myCount, setMyCount] = useState(0);

  const titleAnim = useRef(new Animated.Value(0)).current;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadData();
    Animated.timing(titleAnim, {toValue: 1, duration: 600, useNativeDriver: true}).start();
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', loadData);
    return unsub;
  }, [navigation]);

  const loadData = async () => {
    const board = await getLeaderboard();
    setLeaderboard(board);
    const count = await getPrankCount();
    setMyCount(count);
  };

  const topThree = leaderboard.filter(e => e.rank <= 3);
  const rest = leaderboard.filter(e => e.rank > 3);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.dark} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prank Leaderboard</Text>
        <View style={{width: 44}} />
      </View>

      {/* Podium */}
      <Animated.View style={[styles.podiumSection, {opacity: titleAnim}]}>
        <Text style={styles.podiumTitle}>🏆 Prank Champions</Text>
        <Text style={styles.podiumSub}>College Fest Edition</Text>

        <View style={styles.podium}>
          {/* 2nd place */}
          {topThree[1] && (
            <View style={[styles.podiumBlock, styles.podiumSecond]}>
              <Text style={styles.podiumAvatar}>{topThree[1].avatar}</Text>
              <Text style={styles.podiumName} numberOfLines={1}>{topThree[1].name}</Text>
              <View style={[styles.podiumBar, {height: 70, backgroundColor: '#C0C0C0'}]}>
                <Text style={styles.podiumRank}>🥈</Text>
                <Text style={styles.podiumScore}>{topThree[1].pranks}</Text>
              </View>
            </View>
          )}
          {/* 1st place */}
          {topThree[0] && (
            <View style={[styles.podiumBlock, styles.podiumFirst]}>
              <Text style={styles.podiumCrown}>👑</Text>
              <Text style={styles.podiumAvatar}>{topThree[0].avatar}</Text>
              <Text style={styles.podiumName} numberOfLines={1}>{topThree[0].name}</Text>
              <View style={[styles.podiumBar, {height: 100, backgroundColor: '#FFD700'}]}>
                <Text style={styles.podiumRank}>🥇</Text>
                <Text style={styles.podiumScore}>{topThree[0].pranks}</Text>
              </View>
            </View>
          )}
          {/* 3rd place */}
          {topThree[2] && (
            <View style={[styles.podiumBlock, styles.podiumThird]}>
              <Text style={styles.podiumAvatar}>{topThree[2].avatar}</Text>
              <Text style={styles.podiumName} numberOfLines={1}>{topThree[2].name}</Text>
              <View style={[styles.podiumBar, {height: 50, backgroundColor: '#CD7F32'}]}>
                <Text style={styles.podiumRank}>🥉</Text>
                <Text style={styles.podiumScore}>{topThree[2].pranks}</Text>
              </View>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Rest of leaderboard */}
      <View style={styles.listSection}>
        <Text style={styles.listTitle}>Full Rankings</Text>
        {rest.map((item, i) => (
          <LeaderboardRow key={item.name} item={item} index={i} delay={i * 80} />
        ))}
      </View>

      {/* My stats footer */}
      <View style={styles.myStats}>
        <Text style={styles.myStatsText}>
          Your pranks this fest: <Text style={styles.myStatsNum}>{myCount} 🎭</Text>
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('QRScanner')}>
          <Text style={styles.myStatsCta}>Prank more →</Text>
        </TouchableOpacity>
      </View>
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
  podiumSection: {
    paddingHorizontal: 24, paddingTop: 8, paddingBottom: 4,
    alignItems: 'center',
  },
  podiumTitle: {fontSize: 22, fontWeight: '900', color: COLORS.text, marginBottom: 4},
  podiumSub: {fontSize: 13, color: COLORS.textMuted, marginBottom: 20},
  podium: {
    flexDirection: 'row', alignItems: 'flex-end',
    justifyContent: 'center', gap: 12, width: '100%',
  },
  podiumBlock: {alignItems: 'center', flex: 1},
  podiumFirst: {},
  podiumSecond: {},
  podiumThird: {},
  podiumCrown: {fontSize: 20, marginBottom: 2},
  podiumAvatar: {fontSize: 28, marginBottom: 4},
  podiumName: {
    fontSize: 11, fontWeight: '700', color: COLORS.textLight,
    marginBottom: 6, textAlign: 'center',
  },
  podiumBar: {
    width: '100%', borderTopLeftRadius: 8, borderTopRightRadius: 8,
    alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  podiumRank: {fontSize: 18, marginTop: 8},
  podiumScore: {fontSize: 20, fontWeight: '900', color: '#fff', marginBottom: 8},
  listSection: {paddingHorizontal: 20, flex: 1},
  listTitle: {
    fontSize: 13, fontWeight: '700', color: COLORS.textMuted,
    marginBottom: 12, marginTop: 16, textTransform: 'uppercase', letterSpacing: 1,
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.darkCard, borderRadius: 14,
    padding: 14, marginBottom: 8, gap: 12,
    borderWidth: 1, borderColor: COLORS.border,
  },
  myRow: {borderColor: 'rgba(0,196,140,0.4)', backgroundColor: 'rgba(0,196,140,0.05)'},
  topRow: {},
  rankWrap: {width: 28, alignItems: 'center'},
  rankEmoji: {fontSize: 20},
  rankNum: {fontSize: 15, fontWeight: '800', color: COLORS.textMuted},
  avatarWrap: {position: 'relative'},
  avatar: {fontSize: 24},
  meDot: {
    position: 'absolute', bottom: -2, right: -2,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: COLORS.primary, borderWidth: 1.5, borderColor: COLORS.darkCard,
  },
  nameWrap: {flex: 1},
  name: {fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 2},
  prankLabel: {fontSize: 11, color: COLORS.textMuted},
  scoreWrap: {
    backgroundColor: COLORS.darkCardAlt, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 6, alignItems: 'center',
  },
  score: {fontSize: 18, fontWeight: '900', color: COLORS.text},
  scoreLabel: {fontSize: 9, color: COLORS.textMuted, fontWeight: '600'},
  myStats: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 14,
    backgroundColor: COLORS.darkCard,
    borderTopWidth: 1, borderColor: COLORS.border,
  },
  myStatsText: {fontSize: 13, color: COLORS.textMuted},
  myStatsNum: {fontWeight: '800', color: COLORS.primary},
  myStatsCta: {fontSize: 13, fontWeight: '700', color: COLORS.primary},
});

export default LeaderboardScreen;
