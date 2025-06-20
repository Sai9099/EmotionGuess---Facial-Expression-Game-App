import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, Trophy, Target, Zap, Calendar, Smile, Frown, Angry, Sunrise as Surprise, Meh, Grip as Grimace } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const emotionStats = [
    { name: 'Happy', icon: Smile, score: 92, games: 45, color: '#F59E0B' },
    { name: 'Sad', icon: Frown, score: 78, games: 32, color: '#3B82F6' },
    { name: 'Angry', icon: Angry, score: 85, games: 28, color: '#EF4444' },
    { name: 'Surprised', icon: Surprise, score: 88, games: 38, color: '#8B5CF6' },
    { name: 'Disgusted', icon: Grimace, score: 74, games: 22, color: '#10B981' },
    { name: 'Fearful', icon: Meh, score: 71, games: 19, color: '#F97316' },
  ];

  const weeklyData = [
    { day: 'Mon', score: 85 },
    { day: 'Tue', score: 92 },
    { day: 'Wed', score: 78 },
    { day: 'Thu', score: 95 },
    { day: 'Fri', score: 88 },
    { day: 'Sat', score: 91 },
    { day: 'Sun', score: 87 },
  ];

  const achievements = [
    { title: 'Perfect Score', description: 'Got 100% on an emotion', unlocked: true },
    { title: 'Hot Streak', description: '10 games in a row above 80%', unlocked: true },
    { title: 'Master Actor', description: 'Played all 6 emotions', unlocked: true },
    { title: 'Speed Demon', description: 'Quick reaction time', unlocked: false },
  ];

  const maxScore = Math.max(...weeklyData.map(d => d.score));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Statistics</Text>
          <Text style={styles.subtitle}>Track your emotion detection progress</Text>
        </View>

        {/* Overview Cards */}
        <View style={styles.overviewContainer}>
          <View style={styles.overviewCard}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.overviewGradient}
            >
              <Trophy size={24} color="white" />
              <Text style={styles.overviewValue}>1,247</Text>
              <Text style={styles.overviewLabel}>Total Score</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.overviewCard}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.overviewGradient}
            >
              <Target size={24} color="white" />
              <Text style={styles.overviewValue}>184</Text>
              <Text style={styles.overviewLabel}>Games Played</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Weekly Progress */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color="#6366F1" />
            <Text style={styles.sectionTitle}>Weekly Progress</Text>
          </View>
          
          <View style={styles.chartContainer}>
            {weeklyData.map((item, index) => (
              <View key={index} style={styles.chartItem}>
                <View style={styles.chartBar}>
                  <View 
                    style={[
                      styles.chartFill,
                      { 
                        height: `${(item.score / maxScore) * 100}%`,
                        backgroundColor: item.score >= 90 ? '#10B981' : item.score >= 80 ? '#F59E0B' : '#6366F1'
                      }
                    ]}
                  />
                </View>
                <Text style={styles.chartDay}>{item.day}</Text>
                <Text style={styles.chartScore}>{item.score}%</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Emotion Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emotion Performance</Text>
          
          {emotionStats.map((emotion, index) => {
            const IconComponent = emotion.icon;
            return (
              <View key={index} style={styles.emotionItem}>
                <View style={styles.emotionLeft}>
                  <View style={[styles.emotionIcon, { backgroundColor: `${emotion.color}20` }]}>
                    <IconComponent size={20} color={emotion.color} />
                  </View>
                  <View style={styles.emotionInfo}>
                    <Text style={styles.emotionName}>{emotion.name}</Text>
                    <Text style={styles.emotionGames}>{emotion.games} games</Text>
                  </View>
                </View>
                
                <View style={styles.emotionRight}>
                  <Text style={styles.emotionScore}>{emotion.score}%</Text>
                  <View style={styles.emotionBar}>
                    <View 
                      style={[
                        styles.emotionProgress,
                        { width: `${emotion.score}%`, backgroundColor: emotion.color }
                      ]}
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          
          {achievements.map((achievement, index) => (
            <View key={index} style={[
              styles.achievementItem,
              !achievement.unlocked && styles.achievementLocked
            ]}>
              <View style={[
                styles.achievementIcon,
                { backgroundColor: achievement.unlocked ? '#FEF3C7' : '#F3F4F6' }
              ]}>
                <Trophy size={20} color={achievement.unlocked ? '#F59E0B' : '#9CA3AF'} />
              </View>
              <View style={styles.achievementContent}>
                <Text style={[
                  styles.achievementTitle,
                  !achievement.unlocked && styles.achievementTitleLocked
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  !achievement.unlocked && styles.achievementDescriptionLocked
                ]}>
                  {achievement.description}
                </Text>
              </View>
              {achievement.unlocked && (
                <View style={styles.achievementBadge}>
                  <Text style={styles.achievementBadgeText}>✓</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  overviewContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  overviewCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  overviewGradient: {
    padding: 20,
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginTop: 8,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartItem: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 20,
    height: 80,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartFill: {
    width: '100%',
    borderRadius: 10,
    minHeight: 4,
  },
  chartDay: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 2,
  },
  chartScore: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  emotionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  emotionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emotionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emotionInfo: {
    gap: 2,
  },
  emotionName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  emotionGames: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  emotionRight: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  emotionScore: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  emotionBar: {
    width: 60,
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  emotionProgress: {
    height: '100%',
    borderRadius: 2,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  achievementTitleLocked: {
    color: '#9CA3AF',
  },
  achievementDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  achievementDescriptionLocked: {
    color: '#9CA3AF',
  },
  achievementBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementBadgeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
  },
});