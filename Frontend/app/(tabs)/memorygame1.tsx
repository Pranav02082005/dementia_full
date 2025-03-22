import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const BUTTON_SIZE = width * 0.35;
const colors = ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f'];

export default function App() {
  const router = useRouter();
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const generateRandomStep = () => Math.floor(Math.random() * 4);

  const startGame = () => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    const newSequence = [generateRandomStep()];
    setSequence(newSequence);
    setUserSequence([]);
    playSequence(newSequence);
  };

  const playSequence = async (seq) => {
    for (let i = 0; i < seq.length; i++) {
      setHighlightedIndex(seq[i]);
      await new Promise(resolve => setTimeout(resolve, 700));
      setHighlightedIndex(-1);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };
  const handleButtonPress = async (index) => {
    if (!started || gameOver) return;

    setHighlightedIndex(index);
    setTimeout(() => setHighlightedIndex(-1), 200);

    const newUserSequence = [...userSequence, index];
    setUserSequence(newUserSequence);

    if (sequence[newUserSequence.length - 1] !== index) {
      setGameOver(true);
      setStarted(false);
      Alert.alert('Game Over!', `Your score: ${score}`);
      return;
    }

    if (newUserSequence.length === sequence.length) {
      setScore(score + 1);
      const newSequence = [...sequence, generateRandomStep()];
      setSequence(newSequence);
      setUserSequence([]);
      await new Promise(resolve => setTimeout(resolve, 1000));
      playSequence(newSequence);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/(tabs)/memories')}>
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>
          {gameOver ? 'Game Over! Press Start' : 'Simon Says Game'}
        </Text>
      </View>

      {/* Game Description */}
      <Text style={styles.description}>
        Watch the sequence and repeat it by pressing the buttons in order.
        Each correct repeat increases the sequence length!
      </Text>

      {/* Game Board */}
      <Card style={styles.card}>
        <View style={styles.gameContainer}>
          <View style={styles.gridContainer}>
            <View style={styles.grid}>
              {colors.map((color, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.button,
                    { backgroundColor: color },
                    highlightedIndex === index && styles.highlightedButton
                  ]}
                  onPress={() => handleButtonPress(index)}
                  disabled={gameOver}
                />
              ))}
            </View>
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
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 280,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    maxWidth: width * 0.85,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2.8,
    margin: 10,
  },
  highlightedButton: {
    opacity: 0.5,
    transform: [{ scale: 0.95 }],
  },
 /* controlsContainer: {
    marginTop: 30,
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },*/
  startButton: {
    alignItems: 'center',
    width: 200,
    height: 50,
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 0,
    position: 'absolute', // Enables precise positioning
    top: 375, // Distance from top of parent
    bottom: 20, // Distance from bottom of parent
    left: 60, // Distance from left edge
    right: 30, // Distance from right edge
    marginTop: 40, // Vertical margin
    marginLeft: 20, // Horizontal margin
    transform: [{ translateY: -50 }], // Vertical adjustment
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
    color: '#2c3e50',
  },
});