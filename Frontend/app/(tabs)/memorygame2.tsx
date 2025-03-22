import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Alert, ScrollView, Dimensions } from 'react-native';
import { Card } from 'react-native-paper';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const words = [
  'BASKETBALL', 'FOOTBALL', 'BASEBALL', 'TENNIS', 'VOLLEYBALL',
  'HOCKEY', 'CRICKET', 'RUGBY', 'GOLF', 'BOXING',
  'SUNFLOWER', 'MOUNTAIN', 'KEYBOARD', 'ELEPHANT', 'LIBRARY',
  'CHOCOLATE', 'AIRPLANE', 'BICYCLE', 'TELEVISION', 'UNIVERSITY',
  'BUTTERFLY', 'HAMBURGER', 'NOTEBOOK', 'HOSPITAL', 'CROCODILE',
  'MICROSCOPE', 'RESTAURANT', 'KANGAROO', 'SPAGHETTI', 'ELEVATOR',
  'CALENDAR', 'ADVENTURE', 'BALLOON', 'CAMERA', 'DIAMOND',
  'FIREWORK', 'GARDEN', 'HARMONY', 'ISLAND', 'JOURNEY',
  'KITCHEN', 'LANGUAGE', 'MACHINE', 'NECKLACE', 'OCEAN',
  'PARROT', 'QUALITY', 'RIVER', 'STATION', 'TEMPLE',
  'UMBRELLA', 'VACATION', 'WATERFALL', 'XYLOPHONE', 'YOGA',
  'ZEBRA', 'ASTRONAUT', 'BROWSER', 'CHEMICAL', 'DIGITAL',
  'ECOSYSTEM', 'FESTIVAL', 'GENERATOR', 'HABITAT', 'INTERNET',
  'JELLYFISH', 'KALEIDOSCOPE', 'LANDSCAPE', 'MAGNETIC', 'NEIGHBOR',
  'ORCHESTRA', 'PYRAMID', 'QUESTION', 'REFLECTION', 'SYMMETRY',
  'TELESCOPE', 'ULTIMATE', 'VIBRANT', 'WHISPER', 'XENON',
  'YELLOW', 'ZIGZAG', 'ALPHABET', 'BACTERIA', 'CARNIVAL',
  'DYNAMITE', 'ECLIPSE', 'FIREFIGHTER', 'GALAXY', 'HURRICANE',
  'ILLUSION', 'JUPITER', 'KILOMETER', 'LEMONADE', 'METROPOLIS'
];

export default function App() {
  const router = useRouter();
  const [currentWord, setCurrentWord] = useState('');
  const [splitParts, setSplitParts] = useState<string[]>([]);
  const [selectedParts, setSelectedParts] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const splitWord = (word: string): string[] => {
    const numSplits = 2 + Math.floor(Math.random() * 3);
    const splitIndices: number[] = [];
    const minLength = 2;
    
    for(let i = 0; i < numSplits - 1; i++) {
      const max = word.length - (numSplits - i - 1) * minLength;
      const min = (i > 0 ? splitIndices[i-1] : 0) + minLength;
      splitIndices.push(Math.floor(Math.random() * (max - min) + min));
    }
    
    const parts: string[] = [];
    let prev = 0;
    splitIndices
      .sort((a, b) => a - b)
      .forEach(index => {
        parts.push(word.slice(prev, index));
        prev = index;
      });
    parts.push(word.slice(prev));
    
    return parts;
  };

  const startGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    const parts = splitWord(randomWord);
    setCurrentWord(randomWord);
    setSplitParts(parts.sort(() => Math.random() - 0.5));
    setSelectedParts([]);
    setGameStarted(true);
  };

  const handlePartPress = (part: string) => {
    if (!gameStarted) return;

    const newSelected = [...selectedParts, part];
    setSelectedParts(newSelected);

    if (newSelected.join('') === currentWord) {
      setScore(score + 1);
      Alert.alert('Correct!', 'Well done! Next word...', [
        { text: 'OK', onPress: startGame }
      ]);
    } else if (newSelected.length === splitParts.length) {
      Alert.alert('Game Over', `Correct word: ${currentWord}`, [
        { text: 'Try Again', onPress: () => setGameStarted(false) }
      ]);
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
          {gameStarted ? 'Combine the parts' : 'Split Words Game'}
        </Text>
      </View>

      {/* Game Description */}
      <Text style={styles.description}>
        Reassemble the split word parts in correct order! Tap the pieces
        in the right sequence to form the original word.
      </Text>

      <Card style={styles.card}>
        <View style={styles.gameContainer}>
          <View style={styles.wordPreviewContainer}>
            <Text style={styles.wordPreview}>
              {selectedParts.length > 0 
                ? selectedParts.join(' ') 
                : (currentWord 
                   ? '_ '.repeat(Math.min(currentWord.length, 15)) 
                   : 'Start game to see word')}
            </Text>
          </View>

          <View style={styles.mainContent}>
            <ScrollView 
              style={styles.partsScrollContainer}
              contentContainerStyle={styles.partsScrollContent}
            >
              <View style={styles.partsContainer}>
                {splitParts.map((part, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.partButton,
                      selectedParts.includes(part) && styles.selectedPart
                    ]}
                    onPress={() => handlePartPress(part)}
                    disabled={!gameStarted || selectedParts.includes(part)}
                  >
                    <Text style={styles.partText}>{part}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.startButton}
              onPress={startGame}
              disabled={gameStarted}
            >
              <Text style={styles.buttonText}>
                {gameStarted ? 'Game in Progress' : 'Start New Game'}
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
    color: '#2c3e50',
  },
  description: {
    marginHorizontal: 24,
    marginBottom: 16,
    fontSize: 18,
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
    padding: 15,
  },
  wordPreviewContainer: {
    marginVertical: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    minHeight: 70,
  },
  mainContent: {
    flex: 1,
    marginVertical: 5,
  },
  partsScrollContainer: {
    flex: 1,
    minHeight: 150,
    maxHeight: 200,
  },
  partsScrollContent: {
    paddingVertical: 10,
  },
  partsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 10,
  },
  partButton: {
    backgroundColor: '#3498db',
    padding: 12,
    margin: 6,
    borderRadius: 8,
    minWidth: 80,
  },
  selectedPart: {
    backgroundColor: '#2ecc71',
    opacity: 0.8,
  },
  partText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  wordPreview: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    letterSpacing: 4,
    minHeight: 30,
  },
  controlsContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  startButton: {
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 40,
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scoreText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 15,
    color: '#7f8c8d',
  },
});