import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert, Platform } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RotateCcw, Chrome as Home, Zap } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withSequence,
  withTiming 
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const emotions = [
  { name: 'Happy', emoji: '😊', color: '#F59E0B', description: 'Show your biggest smile!' },
  { name: 'Sad', emoji: '😢', color: '#3B82F6', description: 'Look really sad and disappointed' },
  { name: 'Angry', emoji: '😠', color: '#EF4444', description: 'Show your angriest face!' },
  { name: 'Surprised', emoji: '😲', color: '#8B5CF6', description: 'Act like you\'re shocked!' },
  { name: 'Disgusted', emoji: '🤢', color: '#10B981', description: 'Something smells terrible!' },
  { name: 'Fearful', emoji: '😨', color: '#F97316', description: 'You\'re really scared!' },
];

export default function PlayScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('front');
  const [currentEmotion, setCurrentEmotion] = useState(emotions[0]);
  const [gameState, setGameState] = useState<'waiting' | 'playing' | 'result'>('waiting');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [lastScore, setLastScore] = useState(0);
  
  // Animation values
  const scaleValue = useSharedValue(1);
  const emojiScale = useSharedValue(1);
  const resultOpacity = useSharedValue(0);

  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const triggerHaptics = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleValue.value }],
    };
  });

  const animatedEmojiStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: emojiScale.value }],
    };
  });

  const animatedResultStyle = useAnimatedStyle(() => {
    return {
      opacity: resultOpacity.value,
    };
  });

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            We need camera access to analyze your facial expressions for the game
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const startGame = () => {
    const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
    setCurrentEmotion(randomEmotion);
    setGameState('playing');
    setTimeLeft(5);
    
    // Animate emoji appearance
    emojiScale.value = withSequence(
      withSpring(1.2),
      withSpring(1)
    );

    // Start countdown
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const endGame = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Simulate emotion detection result (in real app, this would come from ML model)
    const detectedScore = Math.floor(Math.random() * 40) + 60; // 60-100% range
    setLastScore(detectedScore);
    setScore(score + detectedScore);
    
    if (detectedScore >= 80) {
      setStreak(streak + 1);
      triggerHaptics();
    } else {
      setStreak(0);
    }
    
    setGameState('result');
    
    // Animate result appearance
    resultOpacity.value = withTiming(1, { duration: 500 });
    
    // Auto-restart after 3 seconds
    setTimeout(() => {
      resultOpacity.value = withTiming(0, { duration: 300 });
      setTimeout(() => setGameState('waiting'), 300);
    }, 3000);
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
    scaleValue.value = withSequence(
      withSpring(0.8),
      withSpring(1)
    );
  };

  const resetGame = () => {
    setScore(0);
    setStreak(0);
    setGameState('waiting');
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <CameraView style={styles.camera} facing={facing}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => router.back()}
          >
            <Home size={24} color="white" />
          </TouchableOpacity>
          
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            {streak > 0 && (
              <View style={styles.streakContainer}>
                <Zap size={16} color="#F59E0B" />
                <Text style={styles.streakText}>{streak}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Game Content */}
        <View style={styles.gameContent}>
          {gameState === 'waiting' && (
            <View style={styles.waitingContainer}>
              <Text style={styles.title}>EmotionGuess</Text>
              <Text style={styles.subtitle}>Express the emotion shown to you!</Text>
              <TouchableOpacity 
                style={styles.startButton}
                onPress={startGame}
                activeOpacity={0.8}
              >
                <Text style={styles.startButtonText}>Start Game</Text>
              </TouchableOpacity>
            </View>
          )}

          {gameState === 'playing' && (
            <View style={styles.playingContainer}>
              <View style={styles.timerContainer}>
                <Text style={styles.timerText}>{timeLeft}</Text>
              </View>
              
              <Animated.View style={[styles.emotionContainer, animatedEmojiStyle]}>
                <Text style={[styles.emotionEmoji, { color: currentEmotion.color }]}>
                  {currentEmotion.emoji}
                </Text>
                <Text style={styles.emotionName}>{currentEmotion.name}</Text>
                <Text style={styles.emotionDescription}>{currentEmotion.description}</Text>
              </Animated.View>
            </View>
          )}

          {gameState === 'result' && (
            <Animated.View style={[styles.resultContainer, animatedResultStyle]}>
              <Text style={styles.resultScore}>{lastScore}%</Text>
              <Text style={styles.resultText}>
                {lastScore >= 90 ? 'Perfect!' : lastScore >= 80 ? 'Great!' : lastScore >= 70 ? 'Good!' : 'Keep trying!'}
              </Text>
              <View style={styles.resultBar}>
                <View 
                  style={[
                    styles.resultProgress, 
                    { 
                      width: `${lastScore}%`,
                      backgroundColor: lastScore >= 80 ? '#10B981' : lastScore >= 60 ? '#F59E0B' : '#EF4444'
                    }
                  ]} 
                />
              </View>
            </Animated.View>
          )}
        </View>

        {/* Bottom Controls */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.controlButton}
            onPress={resetGame}
          >
            <RotateCcw size={24} color="white" />
          </TouchableOpacity>
          
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity 
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <RotateCcw size={24} color="white" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#F9FAFB',
  },
  permissionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scoreText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  streakText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#F59E0B',
  },
  gameContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  waitingContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 32,
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 16,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  playingContainer: {
    alignItems: 'center',
    width: '100%',
  },
  timerContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    borderWidth: 3,
    borderColor: 'white',
  },
  timerText: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: 'white',
  },
  emotionContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 32,
    borderRadius: 24,
    minWidth: width * 0.8,
  },
  emotionEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  emotionName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 8,
  },
  emotionDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  resultContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 32,
    borderRadius: 24,
    minWidth: width * 0.7,
  },
  resultScore: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
    marginBottom: 16,
  },
  resultBar: {
    width: 200,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  resultProgress: {
    height: '100%',
    borderRadius: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flipButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
});