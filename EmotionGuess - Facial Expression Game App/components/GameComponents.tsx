import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Smile, Frown, Angry, Sunrise as Surprise, Meh, Grip as Grimace } from 'lucide-react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export interface Emotion {
  name: string;
  emoji: string;
  color: string;
  description: string;
  icon: any;
}

export const emotions: Emotion[] = [
  { 
    name: 'Happy', 
    emoji: '😊', 
    color: '#F59E0B', 
    description: 'Show your biggest smile!',
    icon: Smile 
  },
  { 
    name: 'Sad', 
    emoji: '😢', 
    color: '#3B82F6', 
    description: 'Look really sad and disappointed',
    icon: Frown 
  },
  { 
    name: 'Angry', 
    emoji: '😠', 
    color: '#EF4444', 
    description: 'Show your angriest face!',
    icon: Angry 
  },
  { 
    name: 'Surprised', 
    emoji: '😲', 
    color: '#8B5CF6', 
    description: 'Act like you\'re shocked!',
    icon: Surprise 
  },
  { 
    name: 'Disgusted', 
    emoji: '🤢', 
    color: '#10B981', 
    description: 'Something smells terrible!',
    icon: Grimace 
  },
  { 
    name: 'Fearful', 
    emoji: '😨', 
    color: '#F97316', 
    description: 'You\'re really scared!',
    icon: Meh 
  },
];

interface EmotionCardProps {
  emotion: Emotion;
  onPress?: () => void;
  style?: any;
}

export function EmotionCard({ emotion, onPress, style }: EmotionCardProps) {
  const scaleValue = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  const handlePress = () => {
    scaleValue.value = withSpring(0.95, {}, () => {
      scaleValue.value = withSpring(1);
    });
    onPress?.();
  };

  return (
    <Animated.View style={[animatedStyle, style]}>
      <TouchableOpacity 
        style={styles.emotionCard}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[emotion.color, `${emotion.color}DD`]}
          style={styles.emotionGradient}
        >
          <Text style={styles.emotionEmoji}>{emotion.emoji}</Text>
          <Text style={styles.emotionName}>{emotion.name}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  color?: string;
}

export function ScoreDisplay({ score, maxScore = 100, color = '#6366F1' }: ScoreDisplayProps) {
  const percentage = Math.min((score / maxScore) * 100, 100);
  
  return (
    <View style={styles.scoreDisplay}>
      <Text style={styles.scoreValue}>{score}</Text>
      <View style={styles.scoreBar}>
        <View 
          style={[
            styles.scoreProgress,
            { width: `${percentage}%`, backgroundColor: color }
          ]}
        />
      </View>
    </View>
  );
}

interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

export function Timer({ timeLeft, totalTime }: TimerProps) {
  const percentage = (timeLeft / totalTime) * 100;
  const color = percentage > 50 ? '#10B981' : percentage > 25 ? '#F59E0B' : '#EF4444';

  return (
    <View style={styles.timerContainer}>
      <View style={[styles.timerCircle, { borderColor: color }]}>
        <Text style={[styles.timerText, { color }]}>{timeLeft}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  emotionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
  },
  emotionGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  emotionEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emotionName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  scoreDisplay: {
    alignItems: 'center',
    minWidth: 80,
  },
  scoreValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  scoreBar: {
    width: 60,
    height: 4,
    backgroundColor: '#F3F4F6',
    borderRadius: 2,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    borderRadius: 2,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  timerText: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
});