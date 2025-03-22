import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router';

// For icons - in a real app, you would use a library like react-native-vector-icons
// Here I'll create simple SVG components for each icon
import Svg, { Path } from 'react-native-svg';

const ListIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={props.color || "#000"} viewBox="0 0 256 256">
    <Path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
  </Svg>
);
  
const GearIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={props.color || "#000"} viewBox="0 0 256 256">
    <Path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z" />
  </Svg>
);

const HouseIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={props.color || "#6B6B6B"} viewBox="0 0 256 256">
    <Path d="M218.83,103.77l-80-75.48a1.14,1.14,0,0,1-.11-.11,16,16,0,0,0-21.53,0l-.11.11L37.17,103.77A16,16,0,0,0,32,115.55V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V160h32v48a16,16,0,0,0,16,16h48a16,16,0,0,0,16-16V115.55A16,16,0,0,0,218.83,103.77ZM208,208H160V160a16,16,0,0,0-16-16H112a16,16,0,0,0-16,16v48H48V115.55l.11-.1L128,40l79.9,75.43.11.1Z" />
  </Svg>
);

const BellIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={props.color || "#6B6B6B"} viewBox="0 0 256 256">
    <Path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
  </Svg>
);

const CameraIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={props.color || "#000"} viewBox="0 0 256 256">
    <Path d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm-44,76a36,36,0,1,1-36-36A36,36,0,0,1,164,132Z" />
  </Svg>
);

const QuestionIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={props.color || "#6B6B6B"} viewBox="0 0 256 256">
    <Path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
  </Svg>
);

const SunDimIcon = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill={props.color || "#FFF"} viewBox="0 0 256 256">
    <Path d="M120,40V32a8,8,0,0,1,16,0v8a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-8-8A8,8,0,0,0,50.34,61.66Zm0,116.68-8,8a8,8,0,0,0,11.32,11.32l8-8a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l8-8a8,8,0,0,0-11.32-11.32l-8,8A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l8,8a8,8,0,0,0,11.32-11.32ZM40,120H32a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Zm88,88a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-8A8,8,0,0,0,128,208Zm96-88h-8a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Z" />
  </Svg>
);

// Card component for memory exercises
const MemoryCard = ({ title, description, imageUrl, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.cardImage} 
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Tab Bar Item component
const TabBarItem = ({ icon, label, isActive, onPress }) => {
  return (
    <TouchableOpacity style={styles.tabBarItem} onPress={onPress}>
      {icon}
      <Text style={[styles.tabBarLabel, isActive && styles.tabBarLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

function MemoriesScreen() {
  // Get the router for navigation
  const router = useRouter();

  // Add a simple state to ensure the component is properly mounted
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    // Simple timeout to ensure everything is loaded
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Navigate to specific memory game
  const navigateToMemoryGame = (gameId) => {
    router.push(`/(tabs)/memorygame${gameId}`);
  };

  // Show a simple loading state if not ready
  if (!isReady && Platform.OS === 'android') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Get current day and location - in a real app you'd use geolocation services
  const day = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const location = "San Francisco"; // This would come from the device location

  // Memory exercise data
  const memoryExercises = [
    {
      id: 1,
      title: "Memory Game 1",
      description: "Test your memory with this recall exercise",
      imageUrl: "https://cdn.usegalileo.ai/sdxl10/aeaadefa-1f66-45a6-b563-c6fc59420dd6.png"
    },
    {
      id: 2,
      title: "Memory Game 2",
      description: "Practice recall of recent events or conversations",
      imageUrl: "https://cdn.usegalileo.ai/sdxl10/abdd5a60-29e2-4895-ae5f-e2d1c2cbbacc.png"
    },
    {
      id: 3,
      title: "Memory Game 3",
      description: "Challenge yourself with sequence repetition",
      imageUrl: "https://cdn.usegalileo.ai/sdxl10/791bebc2-2348-48fc-ae60-2cfeb143ca83.png"
    },
    {
      id: 4,
      title: "Memory Game 4",
      description: "Associate names with faces in this recognition game",
      imageUrl: "https://cdn.usegalileo.ai/sdxl10/e256d9bb-365d-4826-ac42-42e30150c50d.png"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <ListIcon color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hello Mark</Text>
        <TouchableOpacity>
          <GearIcon color="#000" />
        </TouchableOpacity>
      </View>
      
      {/* Date and Location */}
      <Text style={styles.dateLocation}>Today, {day} in {location}</Text>
      
      {/* Exercise Cards */}
      <ScrollView style={styles.scrollView}>
        {memoryExercises.map(exercise => (
          <MemoryCard 
            key={exercise.id}
            title={exercise.title}
            description={exercise.description}
            imageUrl={exercise.imageUrl}
            onPress={() => navigateToMemoryGame(exercise.id)}
          />
        ))}
        
        {/* Bottom Floating Button */}
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity style={styles.floatingButton}>
            <SunDimIcon color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <View style={{ height: 20 }} />
      </ScrollView>
      
      {/* Add bottom spacing to account for fixed tab bar */}
      <View style={{ height: 80 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight,
      }
    }),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'System',
    fontSize: 18,
    color: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 8,
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  dateLocation: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  cardDescription: {
    fontFamily: 'System',
    fontSize: 16,
    color: '#6B6B6B',
  },/*
  floatingButtonContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  floatingButton: {
    backgroundColor: '#000',
    borderRadius: 28,
    height: 56,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },*/
});

// Simple error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in component:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Something went wrong.</Text>
            <TouchableOpacity
              style={[styles.floatingButton, { marginTop: 20 }]}
              onPress={() => this.setState({ hasError: false })}
            >
              <Text style={{ color: '#FFFFFF', fontFamily: 'System', fontWeight: 'bold' }}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

// Wrap the main component with the error boundary
export default function App() {
  return (
    <ErrorBoundary>
      <MemoriesScreen />
    </ErrorBoundary>
  );
}