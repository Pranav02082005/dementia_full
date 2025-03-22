import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
  Animated,
  Linking,
  Alert
} from 'react-native';
import { useFonts } from 'expo-font';
import Svg, { Path } from 'react-native-svg';
import { useRouter } from 'expo-router';

// Define our color palettes
const LIGHT_COLORS = {
  background: '#FFFFFF',
  text: '#000000',
  secondaryText: '#6B6B6B',
  card: '#FFFFFF',
  primaryButton: '#000000',
  primaryButtonText: '#FFFFFF',
  secondaryButton: '#EEEEEE',
  secondaryButtonText: '#000000',
  tabBar: '#FFFFFF',
  tabBarBorder: '#EEEEEE',
  activeTabText: '#000000',
  inactiveTabText: '#6B6B6B',
  icon: '#000000',
  settingsIcon: '#000000',
  statusBar: 'dark-content',
};

const DARK_COLORS = {
  background: '#121212',
  text: '#FFFFFF',
  secondaryText: '#BBBBBB',
  card: '#1E1E1E',
  primaryButton: '#FFFFFF',
  primaryButtonText: '#000000',
  secondaryButton: '#333333',
  secondaryButtonText: '#FFFFFF',
  tabBar: '#121212',
  tabBarBorder: '#333333',
  activeTabText: '#FFFFFF',
  inactiveTabText: '#BBBBBB',
  icon: '#FFFFFF',
  settingsIcon: '#FFFFFF',
  statusBar: 'light-content',
};

// Icon components
const ListIcon = (props: { color: string; fill?: string }) => (
  <Svg width={24} height={24} fill={props.fill || props.color} viewBox="0 0 256 256" {...props}>
    <Path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
  </Svg>
);

const GearIcon = (props: { color: string; fill?: string }) => (
  <Svg width={24} height={24} fill={props.fill || props.color} viewBox="0 0 256 256" {...props}>
    <Path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Zm-16.1-6.5a73.93,73.93,0,0,1,0,8.68,8,8,0,0,0,1.74,5.48l14.19,17.73a91.57,91.57,0,0,1-6.23,15L187,173.11a8,8,0,0,0-5.1,2.64,74.11,74.11,0,0,1-6.14,6.14,8,8,0,0,0-2.64,5.1l-2.51,22.58a91.32,91.32,0,0,1-15,6.23l-17.74-14.19a8,8,0,0,0-5-1.75h-.48a73.93,73.93,0,0,1-8.68,0,8,8,0,0,0-5.48,1.74L100.45,215.8a91.57,91.57,0,0,1-15-6.23L82.89,187a8,8,0,0,0-2.64-5.1,74.11,74.11,0,0,1-6.14-6.14,8,8,0,0,0-5.1-2.64L46.43,170.6a91.32,91.32,0,0,1-6.23-15l14.19-17.74a8,8,0,0,0,1.74-5.48,73.93,73.93,0,0,1,0-8.68,8,8,0,0,0-1.74-5.48L40.2,100.45a91.57,91.57,0,0,1,6.23-15L69,82.89a8,8,0,0,0,5.1-2.64,74.11,74.11,0,0,1,6.14-6.14A8,8,0,0,0,82.89,69L85.4,46.43a91.32,91.32,0,0,1,15-6.23l17.74,14.19a8,8,0,0,0,5.48,1.74,73.93,73.93,0,0,1,8.68,0,8,8,0,0,0,5.48-1.74L155.55,40.2a91.57,91.57,0,0,1,15,6.23L173.11,69a8,8,0,0,0,2.64,5.1,74.11,74.11,0,0,1,6.14,6.14,8,8,0,0,0,5.1,2.64l22.58,2.51a91.32,91.32,0,0,1,6.23,15l-14.19,17.74A8,8,0,0,0,199.87,123.66Z" />
  </Svg>
);

const HouseIcon = (props: { color: string }) => (
  <Svg width={24} height={24} fill={props.color} viewBox="0 0 256 256" {...props}>
    <Path d="M224,115.55V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.55a16,16,0,0,1,5.17-11.78l80-75.48.11-.11a16,16,0,0,1,21.53,0,1.14,1.14,0,0,0,.11.11l80,75.48A16,16,0,0,1,224,115.55Z" />
  </Svg>
);

const BellIcon = (props: { color: string }) => (
  <Svg width={24} height={24} fill={props.color} viewBox="0 0 256 256" {...props}>
    <Path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216ZM48,184c7.7-13.24,16-43.92,16-80a64,64,0,1,1,128,0c0,36.05,8.28,66.73,16,80Z" />
  </Svg>
);

const CameraIcon = (props: { color: string }) => (
  <Svg width={24} height={24} fill={props.color} viewBox="0 0 256 256" {...props}>
    <Path d="M208,56H180.28L166.65,35.56A8,8,0,0,0,160,32H96a8,8,0,0,0-6.65,3.56L75.71,56H48A24,24,0,0,0,24,80V192a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V80A24,24,0,0,0,208,56Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V80a8,8,0,0,1,8-8H80a8,8,0,0,0,6.66-3.56L100.28,48h55.43l13.63,20.44A8,8,0,0,0,176,72h32a8,8,0,0,1,8,8ZM128,88a44,44,0,1,0,44,44A44.05,44.05,0,0,0,128,88Zm0,72a28,28,0,1,1,28-28A28,28,0,0,1,128,160Z" />
  </Svg>
);

const QuestionIcon = (props: { color: string }) => (
  <Svg width={24} height={24} fill={props.color} viewBox="0 0 256 256" {...props}>
    <Path d="M140,180a12,12,0,1,1-12-12A12,12,0,0,1,140,180ZM128,72c-22.06,0-40,16.15-40,36v4a8,8,0,0,0,16,0v-4c0-11,10.77-20,24-20s24,9,24,20-10.77,20-24,20a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-.72c18.24-3.35,32-17.9,32-35.28C168,88.15,150.06,72,128,72Zm104,56A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88,88,0,1,0-88,88A88.1,88.1,0,0,0,216,128Z" />
  </Svg>
);

const MoonIcon = (props: { color: string }) => (
  <Svg width={24} height={24} fill={props.color} viewBox="0 0 256 256" {...props}>
    <Path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z" />
  </Svg>
);

const SunIcon = (props: { color: string }) => (
  <Svg width={24} height={24} fill={props.color} viewBox="0 0 256 256" {...props}>
    <Path d="M120,40V32a8,8,0,0,1,16,0v8a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-8-8A8,8,0,0,0,50.34,61.66Zm0,116.68-8,8a8,8,0,0,0,11.32,11.32l8-8a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l8-8a8,8,0,0,0-11.32-11.32l-8,8A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l8,8a8,8,0,0,0,11.32-11.32ZM40,120H32a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Zm88,88a8,8,0,0,0-8,8v8a8,8,0,0,0,16,0v-8A8,8,0,0,0,128,208Zm96-88h-8a8,8,0,0,0,0,16h8a8,8,0,0,0,0-16Z" />
  </Svg>
);

// Define type for reminder
interface Reminder {
  id: string;
  date: string;
  time: string;
  dateObj: Date;
  [key: string]: any; // For any other properties
}

// Main component
const GalileoDesign = () => {
  // Get the router for navigation
  const router = useRouter();

  // States
  const [isReady, setIsReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [colors, setColors] = useState(LIGHT_COLORS);
  const [upcomingReminders, setUpcomingReminders] = useState<Reminder[]>([]);
  const [isLoadingReminders, setIsLoadingReminders] = useState(true);

  // Toggle theme with animation
  const toggleTheme = () => {
    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // Toggle theme
      setIsDarkMode(!isDarkMode);
      // Set colors based on theme
      setColors(!isDarkMode ? DARK_COLORS : LIGHT_COLORS);
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  };

  // Set initial colors
  useEffect(() => {
    setColors(isDarkMode ? DARK_COLORS : LIGHT_COLORS);
  }, []);

  // Simple timeout to ensure everything is loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Fetch reminders
  useEffect(() => {
    fetchReminders();
  }, []);

  // Function to fetch reminders from the backend
  const fetchReminders = async () => {
    setIsLoadingReminders(true);
    
    try {
      // Use the same API URL that is used in people.tsx
      const response = await fetch(`http://172.24.3.22:5000/get_reminder`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        // Get tomorrow's date
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const dayAfterTomorrow = new Date(tomorrow);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
        
        // Filter reminders for tomorrow
        const tomorrowReminders = Object.entries(data.data)
          .map(([id, reminder]: [string, any]) => {
            // Clean up date if it has extra quotes
            let reminderDate = reminder.date;
            if (typeof reminderDate === 'string') {
              reminderDate = reminderDate.trim().replace(/^["'](.*)["']$/, '$1');
            }
            
            // Ensure time is properly formatted
            let reminderTime = reminder.time;
            if (typeof reminderTime === 'string') {
              reminderTime = reminderTime.trim();
            }
            
            // Create a date object from the cleaned values
            let dateObj;
            try {
              dateObj = new Date(`${reminderDate}T${reminderTime}`);
              // If the date is invalid, try an alternative format
              if (isNaN(dateObj.getTime())) {
                // Try to extract the time portion from the time string (e.g., "08:00 AM" -> "08:00")
                const timeParts = reminderTime.split(' ');
                let hours = 0;
                let minutes = 0;
                
                if (timeParts.length > 0) {
                  const [h, m] = timeParts[0].split(':');
                  hours = parseInt(h, 10);
                  minutes = parseInt(m, 10);
                  
                  // Handle AM/PM
                  if (timeParts.length > 1 && timeParts[1].toUpperCase() === 'PM' && hours < 12) {
                    hours += 12;
                  }
                  if (timeParts.length > 1 && timeParts[1].toUpperCase() === 'AM' && hours === 12) {
                    hours = 0;
                  }
                }
                
                dateObj = new Date(reminderDate);
                dateObj.setHours(hours, minutes);
              }
            } catch (e) {
              console.error('Error parsing date:', e);
              dateObj = new Date(); // Fallback to current date/time
            }
            
            return {
              id,
              ...reminder,
              dateObj: dateObj
            };
          })
          .filter(reminder => {
            const reminderDate = new Date(reminder.dateObj);
            reminderDate.setHours(0, 0, 0, 0);
            return reminderDate.getTime() === tomorrow.getTime();
          })
          .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
        
        setUpcomingReminders(tomorrowReminders as Reminder[]);
      } else {
        setUpcomingReminders([]);
      }
    } catch (error: any) {
      console.error('Error fetching reminders:', error);
      setUpcomingReminders([]);
    } finally {
      setIsLoadingReminders(false);
    }
  };

  // Format time to display
  const formatReminderTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Get current day and location
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });
  const location = "Bengaluru"; // This would be dynamic in a real app

  // Add function to launch external app
  const launchARAssistanceApp = async () => {
    try {
      // For Android APK, we need to try multiple approaches
      const appPackageName = "com.urvi_all_you"; // Replace with the actual package name of the APK
      const appScheme = "urvi_all_you://";
      
      // Determine if running on Android
      const isAndroid = Platform.OS === 'android';
      
      if (isAndroid) {
        // Try package-specific intent for Android
        const intentUrl = `intent://scan/#Intent;scheme=urvi_all_you;package=${appPackageName};end`;
        const packageUrl = `package:${appPackageName}`;
        
        // Try different launch methods in sequence
        try {
          // First try standard URL scheme
          const isSupported = await Linking.canOpenURL(appScheme);
          if (isSupported) {
            await Linking.openURL(appScheme);
            return;
          }
        } catch (e) {
          console.log("Standard URL scheme failed:", e);
        }
        
        try {
          // Then try package URL (may open Play Store if available)
          const isPackageSupported = await Linking.canOpenURL(packageUrl);
          if (isPackageSupported) {
            await Linking.openURL(packageUrl);
            return;
          }
        } catch (e) {
          console.log("Package URL failed:", e);
        }
        
        try {
          // Then try intent URL
          const isIntentSupported = await Linking.canOpenURL(intentUrl);
          if (isIntentSupported) {
            await Linking.openURL(intentUrl);
            return;
          }
        } catch (e) {
          console.log("Intent URL failed:", e);
        }
        
        // If all the above methods fail, show a more detailed error message
        Alert.alert(
          "Can't Launch App",
          "Due to Expo Go limitations, the AR Assistance app can't be directly launched. You may need to exit Expo Go and open the urvi_all_you app manually.",
          [{ text: "OK" }]
        );
      } else {
        // For iOS, try the standard URL scheme
        const isSupported = await Linking.canOpenURL(appScheme);
        if (isSupported) {
          await Linking.openURL(appScheme);
        } else {
          Alert.alert(
            "App Not Found",
            "The AR Assistance app is not installed on your device.",
            [{ text: "OK" }]
          );
        }
      }
    } catch (error) {
      console.error("Failed to open AR Assistance app:", error);
      Alert.alert(
        "Launch Information",
        "If you have the AR Assistance app installed, please exit Expo Go and launch it directly from your home screen.",
        [{ text: "OK" }]
      );
    }
  };

  // Show a simple loading state if not ready
  if (!isReady && Platform.OS === 'android') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={colors.background} 
      />
      <Animated.View style={[styles.mainContainer, { opacity: fadeAnim }]}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.background }]}>
            <View style={styles.iconContainer}>
              <ListIcon color={colors.icon} />
            </View>
            <Text style={[styles.headerTitle, { color: colors.text }]}>MemoAR</Text>
            <View style={styles.headerRightContainer}>
              <TouchableOpacity 
                style={[styles.themeToggleButton, { backgroundColor: isDarkMode ? '#FFFFFF' : '#000000' }]} 
                onPress={toggleTheme}
              >
                {isDarkMode ? (
                  <SunIcon color="#000000" />
                ) : (
                  <MoonIcon color="#FFFFFF" />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingsButton}>
                <GearIcon color={colors.settingsIcon} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Today's info */}
          <Text style={[styles.todayText, { color: colors.text }]}>Today, {dayOfWeek} in {location}</Text>

          {/* Main card */}
          <View style={styles.cardContainer}>
            <View style={[styles.card, { backgroundColor: colors.card, 
              shadowColor: isDarkMode ? '#000000' : '#000000' }]}>
              <Image
                source={{ uri: "https://cdn.usegalileo.ai/sdxl10/aeaadefa-1f66-45a6-b563-c6fc59420dd6.png" }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardContent}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>Reminders</Text>
                <View style={styles.reminderContainer}>
                  {isLoadingReminders ? (
                    <Text style={[styles.reminderText, { color: colors.secondaryText }]}>
                      Loading reminders...
                    </Text>
                  ) : upcomingReminders.length > 0 ? (
                    <View>
                      <Text style={[styles.reminderSubtitle, { color: colors.text }]}>
                        Tomorrow's schedule:
                      </Text>
                      {upcomingReminders.map((reminder, index) => (
                        <Text key={reminder.id} style={[styles.reminderText, { color: colors.secondaryText }]}>
                          {formatReminderTime(reminder.time)} - {reminder.title}
                          {index < upcomingReminders.length - 1 ? ', ' : ''}
                        </Text>
                      ))}
                    </View>
                  ) : (
                    <Text style={[styles.reminderText, { color: colors.secondaryText }]}>
                      No reminders for tomorrow
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.primaryButton, { backgroundColor: colors.primaryButton }]}
              onPress={() => router.push('/people?action=recognize')}
            >
              <Text style={[styles.primaryButtonText, { color: colors.primaryButtonText }]}>
                Recognize
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.secondaryButton, { backgroundColor: colors.secondaryButton }]}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.secondaryButtonText }]}>
                Memory Exercise
              </Text>
            </TouchableOpacity>
          </View>

          {/* Help Button */}
          <View style={styles.helpButtonContainer}>
            <TouchableOpacity 
              style={[styles.helpButton, { backgroundColor: colors.primaryButton }]}
              onPress={launchARAssistanceApp}
            >
              <Text style={[styles.helpButtonText, { color: colors.primaryButtonText }]}>
                AR Assistance
              </Text>
            </TouchableOpacity>
          </View>

          {/* Add bottom spacing */}
          <View style={{ height: 80 }} />
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggleButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginRight: 8,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontFamily: 'System',
    fontSize: 26,
    left: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  todayText: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  cardContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'column',
    borderRadius: 12,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 16,
    minWidth: 288,
  },
  cardTitle: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  reminderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 4,
  },
  reminderText: {
    fontFamily: 'System',
    fontSize: 16,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  primaryButton: {
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  secondaryButton: {
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  helpButtonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  helpButton: {
    height: 40,
    bottom:7,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  helpButtonText: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'System',
    fontSize: 18,
  },
  reminderSubtitle: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reminderTime: {
    fontSize: 14,
    color: '#6B6B6B',
    marginRight: 8,
  },
});

// Define types for ErrorBoundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.log('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const colors = this.props.isDarkMode ? DARK_COLORS : LIGHT_COLORS;
      
      return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.text }]}>Something went wrong.</Text>
            <TouchableOpacity
              style={[styles.primaryButton, { marginTop: 20, backgroundColor: colors.primaryButton }]}
              onPress={() => this.setState({ hasError: false })}
            >
              <Text style={[styles.primaryButtonText, { color: colors.primaryButtonText }]}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

// Wrap the main component with the error boundary
const AppWithErrorBoundary = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  return (
    <ErrorBoundary isDarkMode={isDarkMode}>
      <GalileoDesign />
    </ErrorBoundary>
  );
};

export default AppWithErrorBoundary;