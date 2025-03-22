import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert, Image } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryItems = [
  {
    id: 1,
    type: 'photo',
    source: require('./assets/th.jpg'),
    caption: 'Family Vacation 2020',
    questions: [
      {
        question: "Where was this vacation?",
        options: ["Paris", "Hawaii", "New York", "Tokyo"],
        correct: 1
      },
      {
        question: "Who was present?",
        options: ["Immediate family", "Extended family", "Friends", "Colleagues"],
        correct: 0
      }
    ]
  },
  {
    id: 2,
    type: 'text',
    source: 'Our first date at the coffee shop',
    caption: 'First Date Memory',
    questions: [
      {
        question: "What did we order?",
        options: ["Cappuccino", "Latte", "Espresso", "Hot Chocolate"],
        correct: 3
      }
    ]
  },
  // Add more items with verification questions
];

export default function App() {
  const [currentMemory, setCurrentMemory] = useState(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [progress, setProgress] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const savedData = await AsyncStorage.getItem('@memory_lane_leaderboard');
      if (savedData) setLeaderboard(JSON.parse(savedData));
    } catch (e) {
      console.error('Error loading leaderboard:', e);
    }
  };

  const saveScore = async () => {
    const newEntry = { date: new Date().toLocaleDateString(), score };
    const updated = [...leaderboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 10);
    try {
      await AsyncStorage.setItem('@memory_lane_leaderboard', JSON.stringify(updated));
      setLeaderboard(updated);
    } catch (e) {
      console.error('Error saving score:', e);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCurrentQuestion(0);
    setProgress(0);
    showNextMemory();
  };

  const verifyMemory = (selectedOption) => {
    const currentQuiz = currentMemory.questions[currentQuestion];
    const isCorrect = selectedOption === currentQuiz.correct;

    if (isCorrect) {
      setScore(prev => prev + 10);
      Alert.alert('Verified!', 'Your memory checks out!');
    } else {
      Alert.alert('Mismatch', 'That doesn\'t match our records');
    }

    if (currentQuestion < currentMemory.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setProgress(prev => prev + (100 / memoryItems.length));
      showNextMemory();
      setCurrentQuestion(0);
    }
  };

  const showNextMemory = () => {
    const remaining = memoryItems.filter(item => !item.used);
    if (remaining.length === 0) {
      endGame();
      return;
    }
    const randomIndex = Math.floor(Math.random() * remaining.length);
    setCurrentMemory({ ...remaining[randomIndex], used: true });
  };

  const endGame = () => {
    setGameStarted(false);
    saveScore();
    Alert.alert('Game Over', 'Final Verification Score: ${score}');
    memoryItems.forEach(item => delete item.used);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => {}}>
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {gameStarted ? 'Memory Verification' : 'Memory Lane Game'}
        </Text>
      </View>

      {/* Game Description */}
      <Text style={styles.description}>
        Relive your precious memories! View photos, listen to music, or read texts,
        and answer questions about them. Each correct answer increases your score!
      </Text>

      <ProgressBar progress={progress / 100} color="#4CAF50" style={styles.progress} />

      <Card style={styles.card}>
        {currentMemory ? (
          <View style={styles.content}>
            {currentMemory.type === 'photo' && (
              <Image source={currentMemory.source} style={styles.memoryImage} />
            )}
            {currentMemory.type === 'text' && (
              <Text style={styles.memoryText}>{currentMemory.source}</Text>
            )}

            <Text style={styles.caption}>{currentMemory.caption}</Text>

            <View style={styles.quizContainer}>
              <Text style={styles.question}>
                {currentMemory.questions[currentQuestion].question}
              </Text>
              {currentMemory.questions[currentQuestion].options.map((option, index) => (
                <TouchableOpacity
                  key={index} 
                  style={styles.optionButton}
                  onPress={() => verifyMemory(index)}
                >
                  <Text style={styles.optionText}>{option}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.instructions}>Start verifying your memories!</Text>
        )}

        <View style={styles.controls}>
          {!gameStarted && (
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.buttonText}>Begin Verification</Text>
            </TouchableOpacity>
          )}
          {gameStarted && (
            <TouchableOpacity style={styles.startButton} onPress={endGame}>
              <Text style={styles.buttonText}>End Session</Text>
            </TouchableOpacity>
          )}
        </View>
      </Card>

      <View style={styles.leaderboard}>
        <Text style={styles.leaderboardTitle}>Top Verifications</Text>
        {leaderboard.map((entry, index) => (
          <Text key={index} style={styles.leaderboardEntry}>
            {entry.date}: {entry.score} points
          </Text>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 28,
    paddingLeft: 0,
    paddingRight: 30,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  backButton: {
    marginRight: 10,
  },
  arrow: {
    fontSize: 35,
    color: 'black',
  },
  title: {
    flex: 1,
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
  },
  description: {
    marginHorizontal: 24,
    marginBottom: 16,
    fontSize: 20,
    color: '#666',
    textAlign: 'justify',
  },
  progress: {
    height: 10,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: 'white',
  },
  content: {
    alignItems: 'center',
  },
  memoryImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 15,
  },
  memoryText: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
  },
  caption: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  quizContainer: {
    width: '100%',
    marginVertical: 15,
  },
  question: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 0,
    color: '#444',
  },
  optionButton: {
    backgroundColor: 'EFEFEF',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
  },
  optionText: {
    fontSize: 14,
    color: 'black',
  },
  controls: {
    marginTop: 0,
  },
  startButton: {
    alignItems: 'center',
    width: 200,
    height: 50,
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  leaderboard: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 10,
    elevation: 2,
  },
  leaderboardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  leaderboardEntry: {
    fontSize: 14,
    color: '#666',
    marginVertical: 3,
  },
});