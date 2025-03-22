import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.4;

export default function App() {
  const router = useRouter();
  const [currentDirection, setCurrentDirection] = useState('');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [showDirection, setShowDirection] = useState(false);

  const directions = ['left', 'right'];

  const generateRandomDirection = () => {
    return directions[Math.floor(Math.random() * directions.length)];
  };

  const startGame = () => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    startRound();
  };

  const startRound = () => {
    const newDirection = generateRandomDirection();
    setCurrentDirection(newDirection);
    setShowDirection(true);
    
    setTimeout(() => {
      setShowDirection(false);
    }, 2000); // Increased display time to 2 seconds
  };

  const handleChoice = (choice: string) => {
    if (!started || gameOver || showDirection) return;

    if (choice === currentDirection) {
      setScore(score + 1);
      startRound();
    } else {
      setGameOver(true);
      setStarted(false);
      Alert.alert('Game Over!', `Final Score: ${score}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/memories')}>
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {gameOver ? 'Game Over! Press Start' : 'Right or Left Game'}
        </Text>
      </View>

      {/* Game Description */}
      <Text style={styles.description}>
        Watch the arrow direction and select the correct side after it disappears!
        Each correct answer increases your score!
      </Text>

      {/* Game Board */}
      <Card style={styles.card}>
        <View style={styles.gameContainer}>
          <View style={styles.directionContainer}>
            <Text style={styles.directionText}>
              {showDirection ? (
                currentDirection === 'left' ? '←' : '→'
              ) : (
                '⬤' // Changed question mark to solid circle
              )}
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.directionButton, { backgroundColor: '#3498db' }]}
              onPress={() => handleChoice('left')}
              disabled={gameOver || showDirection}
            >
              <Text style={styles.buttonText}>← LEFT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.directionButton, { backgroundColor: '#e74c3c' }]}
              onPress={() => handleChoice('right')}
              disabled={gameOver || showDirection}
            >
              <Text style={styles.buttonText}>RIGHT →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={startGame}
              disabled={started && !gameOver}>
              <Text style={styles.buttonText}>
                {started && !gameOver ? 'Playing...' : 'Start Game'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>
        </View>
      </Card>
    </SafeAreaView>
  );
}

// Keep all styles the same as original code
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  header: {
    paddingTop: 28,
    paddingLeft: 0,
    paddingRight: 30,
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#2c3e50',
  },
  description: {
    marginHorizontal: 24,
    marginBottom: 16,
    fontSize: 20,
    color: '#666',
    textAlign: 'justify',
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: 'white',
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  directionContainer: {
    height: BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  directionText: {
    fontSize: 80, // Reduced font size
    fontWeight: 'bold',
    color: '#2c3e50',
    includeFontPadding: false, // Better alignment
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  directionButton: {
    width: BUTTON_SIZE,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  startButton: {
    alignItems: 'center',
    width: 200,
    height: 50,
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18, // Slightly larger text
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 20, // Increased score size
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
  },
});