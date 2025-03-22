import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StatusBar, SafeAreaView, StyleSheet, Modal, Alert, Platform, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Video, ResizeMode } from 'expo-av';

// API URL for backend requests
const API_URL = 'http://172.24.3.22:5000';

// Define types for our data
interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: string | number;
  interest: string;
  imageUrl: string;
  videoUrl?: string;
}

interface FlashcardProps {
  member: FamilyMember;
  index: number;
  total: number;
  onPress: () => void;
}

interface RecognizedPerson {
  status: string;
  data: {
    name: string;
    relation: string;
    age: string | number;
    interest: string;
    image_url: string;
    video_url?: string;
  };
  conversation_starter?: string;
}

const PeopleYouKnow = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { colors } = useTheme();
  const [selectedPerson, setSelectedPerson] = useState<FamilyMember | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [recognizedPerson, setRecognizedPerson] = useState<RecognizedPerson | null>(null);
  const [recognitionModalVisible, setRecognitionModalVisible] = useState(false);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null);
  const videoRef = useRef(null);
  
  // State for family members fetched from the backend
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [initialRecognizeTriggered, setInitialRecognizeTriggered] = useState(false);
  
  // State for reminders
  const [reminders, setReminders] = useState<any[]>([]);
  const [isLoadingReminders, setIsLoadingReminders] = useState(true);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        setHasCameraPermission(status === 'granted');
      }
    })();

    // Fetch family member details
    fetchFamilyMembers();
    
    // Fetch reminders
    fetchReminders();
  }, []);

  // Check if we need to trigger recognition (only once)
  useEffect(() => {
    const shouldRecognize = params.action === 'recognize';
    
    if (shouldRecognize && !isLoading && !initialRecognizeTriggered && !isRecognizing) {
      setInitialRecognizeTriggered(true);
      // Use setTimeout to ensure we don't trigger immediately during render
      setTimeout(() => {
        startRecognition();
      }, 300);
    }
  }, [params, isLoading, initialRecognizeTriggered, isRecognizing]);

  // Function to fetch family members with IDs 2, 3, and 4
  const fetchFamilyMembers = async () => {
    setIsLoading(true);
    setError(null);
    
    const familyIds = [2, 3, 4];
    let fetchedMembers: FamilyMember[] = [];
    
    try {
      for (const id of familyIds) {
        const response = await fetch(`${API_URL}/get_family_details/${id}`);
        const data = await response.json();
        
        if (data.status === 'success' && data.data) {
          fetchedMembers.push({
            id: id.toString(),
            name: data.data.name || 'Unknown',
            relation: data.data.relation || 'Unknown',
            age: data.data.age || 'Unknown',
            interest: data.data.interest || 'No interests provided',
            imageUrl: data.data.image_url || 'https://cdn.usegalileo.ai/sdxl10/b96ad95d-ae8d-4d94-9c69-b70b118d98fe.png',
            videoUrl: data.data.video_url || '',
          });
        }
      }
      
      setFamilyMembers(fetchedMembers);
    } catch (err) {
      console.error('Error fetching family members:', err);
      setError('Failed to fetch family members. Please try again later.');
      
      // Fallback to mock data if API fails
      setFamilyMembers([
    {
      id: '2',
      name: 'Jordan',
      age: 30,
      relation: 'Daughter',
          interest: 'Hiking and medicine',
      imageUrl: 'https://cdn.usegalileo.ai/sdxl10/af2f3c85-979e-468a-a231-51bfabc0f8cb.png',
    },
    {
      id: '3',
      name: 'Israel',
      age: 28,
      relation: 'Grandson',
          interest: 'Basketball and pasta',
      imageUrl: 'https://cdn.usegalileo.ai/sdxl10/b96ad95d-ae8d-4d94-9c69-b70b118d98fe.png',
    },
        {
          id: '4',
          name: 'Martin',
          age: 25,
          relation: 'Son',
          interest: 'Chess and software engineering',
          imageUrl: 'https://cdn.usegalileo.ai/sdxl10/e7e8551b-65a6-42dc-83b1-92e9fba7544c.png',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecognition = async () => {
    try {
      setIsRecognizing(true);
      
      // Show processing message
      Alert.alert("Processing", "Starting facial recognition...");
      
      // Go directly to detection endpoint
      await recognizeFace();
    } catch (error: any) {
      setIsRecognizing(false);
      Alert.alert("Error", "Failed to start recognition: " + error.message);
    }
  };

  // Function to call the facial recognition API
  const recognizeFace = async () => {
    try {
      // Call the detection endpoint
      console.log("Calling detection endpoint...");
      const response = await fetch(`${API_URL}/detection`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Detection response:", data);
      
      // Check if recognition was successful
      if (data.status === 'success' && data.data) {
        // Convert backend response format to our format if needed
        const recognizedData: RecognizedPerson = {
          status: data.status,
          data: data.data,
          conversation_starter: data["conversation starter"] || 
            "Hey, I remember you mentioned loving chess tournaments last summer. Have you played any games recently?"
        };
        
        console.log("Conversation starter:", recognizedData.conversation_starter);
        setRecognizedPerson(recognizedData);
        setRecognitionModalVisible(true);
      } else {
        Alert.alert('Recognition Failed', 'Could not recognize any family member.');
      }
    } catch (error: any) {
      console.error('Face recognition error:', error);
      Alert.alert('Recognition Error', error.message || 'Failed to process facial recognition.');
    } finally {
      setIsRecognizing(false);
    }
  };

  // Function to play a video
  const playVideo = (videoUrl: string) => {
    setCurrentVideoUrl(videoUrl);
    setVideoModalVisible(true);
  };

  // Function to show details of the selected flashcard
  const showFlashcardDetails = (person: FamilyMember) => {
    setSelectedPerson(person);
    setDetailModalVisible(true);
  };

  // Flashcard component
  const FlashcardComponent = ({ member, index, total, onPress }: FlashcardProps) => (
    <TouchableOpacity
      style={styles.flashcardContainer}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.flashcardIndicator}>
        {Array.from({ length: total }).map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.indicatorDot, 
              i === index ? styles.activeDot : styles.inactiveDot
            ]} 
          />
        ))}
      </View>
      
      <View style={styles.flashcardContent}>
        <Image
          source={{ uri: member.imageUrl }}
          style={styles.flashcardImage}
          resizeMode="cover"
        />
        
        <View style={styles.flashcardInfo}>
          <Text style={styles.flashcardName}>{member.name}</Text>
          <View style={styles.flashcardDetail}>
            <Text style={styles.detailLabel}>Relation:</Text>
            <Text style={styles.detailValue}>{member.relation}</Text>
          </View>
          <View style={styles.flashcardDetail}>
            <Text style={styles.detailLabel}>Age:</Text>
            <Text style={styles.detailValue}>{member.age}</Text>
          </View>
          <View style={styles.flashcardDetail}>
            <Text style={styles.detailLabel}>Interests:</Text>
            <Text style={styles.detailValue}>{member.interest}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.flashcardNav}>
        <TouchableOpacity 
          style={[styles.navButton, index === 0 && styles.disabledButton]}
          onPress={(e) => {
            e.stopPropagation();
            setActiveIndex(prev => prev > 0 ? prev - 1 : prev);
          }}
          disabled={index === 0}
        >
          <Feather name="chevron-left" size={24} color={index === 0 ? "#ccc" : "#000"} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.navButton, index === total - 1 && styles.disabledButton]}
          onPress={(e) => {
            e.stopPropagation();
            setActiveIndex(prev => prev < total - 1 ? prev + 1 : prev);
          }}
          disabled={index === total - 1}
        >
          <Feather name="chevron-right" size={24} color={index === total - 1 ? "#ccc" : "#000"} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Component for each person card
  const PersonCard = ({ person }: { person: FamilyMember }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => {
        setSelectedPerson(person);
        setDetailModalVisible(true);
      }}
    >
      <View style={styles.cardContent}>
        <View style={styles.infoContainer}>
          <Text style={styles.nameText}>{person.name}</Text>
          <Text style={styles.ageText}>Age: {person.age}</Text>
          <Text style={styles.relationText}>{person.relation}</Text>
          <Text style={styles.lastSeenText}>Interests: {person.interest}</Text>
        </View>
        <Image
          source={{ uri: person.imageUrl }}
          style={styles.personImage}
          resizeMode="cover"
        />
      </View>
    </TouchableOpacity>
  );

  // Function to fetch reminders from the backend
  const fetchReminders = async () => {
    setIsLoadingReminders(true);
    
    try {
      const response = await fetch(`${API_URL}/get_reminder`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        // Convert object of reminders to array and sort by date
        const reminderArray = Object.entries(data.data).map(([id, reminder]: [string, any]) => {
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
            date: dateObj
          };
        }).sort((a, b) => a.date.getTime() - b.date.getTime());
        
        setReminders(reminderArray);
      } else {
        console.log('No reminders found');
        setReminders([]);
      }
    } catch (error: any) {
      console.error('Error fetching reminders:', error);
    } finally {
      setIsLoadingReminders(false);
    }
  };

  // Format date to display
  const formatReminderDate = (dateObj: Date) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    if (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    ) {
      return 'Today';
    } else if (
      dateObj.getDate() === tomorrow.getDate() &&
      dateObj.getMonth() === tomorrow.getMonth() &&
      dateObj.getFullYear() === tomorrow.getFullYear()
    ) {
      return 'Tomorrow';
    } else {
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  // Format time to display
  const formatReminderTime = (dateObj: Date) => {
    return dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconContainer}>
          <Feather name="menu" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Family Members</Text>
        <TouchableOpacity style={styles.iconContainer}>
          <Feather name="settings" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.mainScrollView}
        contentContainerStyle={styles.mainScrollViewContent}
      >
        {/* Flashcard View */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Loading family members...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={48} color="red" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={fetchFamilyMembers}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : familyMembers.length > 0 ? (
          <View style={styles.flashcardWrapper}>
            <FlashcardComponent 
              member={familyMembers[activeIndex]}
              index={activeIndex}
              total={familyMembers.length}
              onPress={() => showFlashcardDetails(familyMembers[activeIndex])}
            />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No family members found</Text>
          </View>
        )}

        {/* Toggle button for showing all members */}
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setShowAllMembers(!showAllMembers)}
        >
          <Text style={styles.toggleButtonText}>
            {showAllMembers ? "Hide All Members" : "Show All Members"}
          </Text>
          <Feather 
            name={showAllMembers ? "chevron-up" : "chevron-down"} 
            size={18} 
            color="#007AFF" 
          />
        </TouchableOpacity>

        {/* Content - List of all members (conditionally shown) */}
        {showAllMembers && (
          <>
            <Text style={styles.sectionTitle}>All Family Members</Text>
            <View style={styles.allMembersContainer}>
              {familyMembers.map(person => (
          <PersonCard key={person.id} person={person} />
        ))}
            </View>
          </>
        )}

        {/* Reminders Section */}
        <View style={styles.remindersSection}>
          <Text style={styles.sectionTitle}>Upcoming Reminders</Text>
          
          {isLoadingReminders ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#000" />
              <Text style={styles.loadingText}>Loading reminders...</Text>
            </View>
          ) : reminders.length > 0 ? (
            <View style={styles.remindersContainer}>
              {reminders.slice(0, 3).map((reminder, index) => (
                <View key={reminder.id || index} style={styles.reminderItem}>
                  <View style={styles.reminderDateTimeContainer}>
                    <Text style={styles.reminderDate}>
                      {formatReminderDate(reminder.date)}
                    </Text>
                    <Text style={styles.reminderTime}>
                      {formatReminderTime(reminder.date)}
                    </Text>
                  </View>
                  <View style={styles.reminderContent}>
                    <Text style={styles.reminderTitle}>{reminder.title}</Text>
                    {reminder.description && (
                      <Text style={styles.reminderDescription} numberOfLines={1}>
                        {reminder.description}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
              
              {reminders.length > 3 && (
                <TouchableOpacity
                  style={styles.viewAllRemindersButton}
                  onPress={() => router.push('/reminders')}
                >
                  <Text style={styles.viewAllRemindersText}>
                    View all reminders
                  </Text>
                  <Feather name="chevron-right" size={16} color="#007AFF" />
                </TouchableOpacity>
              )}
            </View>
          ) : (
            <View style={styles.emptyRemindersContainer}>
              <Text style={styles.emptyRemindersText}>No upcoming reminders</Text>
              <TouchableOpacity
                style={styles.addReminderButton}
                onPress={() => router.push('/reminders')}
              >
                <Text style={styles.addReminderText}>Add Reminder</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed footer with button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.recognizeButton}
          onPress={startRecognition}
          disabled={isRecognizing}
        >
          {isRecognizing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
          <Feather name="camera" size={24} color="white" />
          <Text style={styles.buttonText}>Recognize</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Person Detail Modal */}
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        {selectedPerson && (
          <View style={styles.modalOverlay}>
            <View style={styles.personDetailModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedPerson.name}</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setDetailModalVisible(false)}
                >
                  <Feather name="x" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <Image
                  source={{ uri: selectedPerson.imageUrl }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />

                <View style={styles.detailSection}>
                  <Text style={styles.modalDetailLabel}>Age</Text>
                  <Text style={styles.detailText}>{selectedPerson.age}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.modalDetailLabel}>Relation</Text>
                  <Text style={styles.detailText}>{selectedPerson.relation}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.modalDetailLabel}>Interests</Text>
                  <Text style={styles.detailText}>{selectedPerson.interest}</Text>
                </View>

                {selectedPerson.videoUrl && (
                <View style={styles.detailSection}>
                    <Text style={styles.modalDetailLabel}>Video</Text>
                    <TouchableOpacity 
                      style={styles.videoButton}
                      onPress={() => playVideo(selectedPerson.videoUrl || '')}
                    >
                      <Feather name="video" size={20} color="white" />
                      <Text style={styles.videoButtonText}>Play Video</Text>
                    </TouchableOpacity>
                </View>
                )}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => {
                    // In a real app, this would initiate a call
                    alert(`Calling ${selectedPerson.name}...`);
                  }}
                >
                  <Feather name="phone" size={20} color="white" />
                  <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>

      {/* Recognition Result Modal */}
      <Modal
        visible={recognitionModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setRecognitionModalVisible(false)}
      >
        {recognizedPerson && (
          <View style={styles.modalOverlay}>
            <View style={styles.personDetailModal}>
              <View style={styles.modalHeader}>
                <Text style={styles.recognitionTitle}>Person Recognized!</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setRecognitionModalVisible(false)}
                >
                  <Feather name="x" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalContent}>
                <View style={styles.recognitionNameRelation}>
                  <Text style={styles.recognitionName}>{recognizedPerson.data.name}</Text>
                  <Text style={styles.recognitionRelation}>{recognizedPerson.data.relation}</Text>
                </View>

                <Image
                  source={{ uri: recognizedPerson.data.image_url }}
                  style={styles.modalImage}
                  resizeMode="cover"
                />

                <View style={styles.conversationStarter}>
                  <Text style={styles.conversationStarterLabel}>Conversation Starter:</Text>
                  <Text style={styles.conversationStarterText}>
                    "{recognizedPerson.conversation_starter || "Ask them about their recent activities and interests."}"
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.modalDetailLabel}>Age</Text>
                  <Text style={styles.detailText}>{recognizedPerson.data.age}</Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.modalDetailLabel}>Interests</Text>
                  <Text style={styles.detailText}>{recognizedPerson.data.interest}</Text>
                </View>
                
                {recognizedPerson.data.video_url && (
                  <View style={styles.detailSection}>
                    <Text style={styles.modalDetailLabel}>Video</Text>
                    <TouchableOpacity 
                      style={styles.videoButton}
                      onPress={() => playVideo(recognizedPerson.data.video_url || '')}
                    >
                      <Feather name="video" size={20} color="white" />
                      <Text style={styles.videoButtonText}>Play Video</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => {
                    // In a real app, this would initiate a call
                    alert(`Calling ${recognizedPerson.data.name}...`);
                  }}
                >
                  <Feather name="phone" size={20} color="white" />
                  <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Modal>

      {/* Video Modal */}
      <Modal
        visible={videoModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setVideoModalVisible(false)}
      >
        <View style={styles.videoModalOverlay}>
          <View style={styles.videoModalContainer}>
            <View style={styles.videoModalHeader}>
              <Text style={styles.videoModalTitle}>Family Video</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setVideoModalVisible(false)}
              >
                <Feather name="x" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.videoContainer}>
              {currentVideoUrl && (
                <Video
                  ref={videoRef}
                  source={{ uri: currentVideoUrl }}
                  style={styles.video}
                  useNativeControls
                  resizeMode={ResizeMode.CONTAIN}
                  isLooping
                  shouldPlay
                />
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    letterSpacing: -0.3,
    fontFamily: 'System',
  },
  iconContainer: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainScrollView: {
    flex: 1,
  },
  mainScrollViewContent: {
    paddingBottom: 100, // Give extra padding for the footer
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 80, // Give extra padding for the footer
  },
  cardContainer: {
    padding: 15,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    gap: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContainer: {
    flex: 2,
    flexDirection: 'column',
    gap: 4,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 6,
  },
  ageText: {
    fontSize: 14,
    color: '#6B6B6B',
    lineHeight: 20,
    marginBottom: 2,
  },
  relationText: {
    fontSize: 14,
    color: '#6B6B6B',
    lineHeight: 20,
    marginBottom: 2,
  },
  lastSeenText: {
    fontSize: 12,
    color: '#6B6B6B',
    lineHeight: 18,
    marginTop: 4,
  },
  personImage: {
    flex: 1,
    borderRadius: 12,
    aspectRatio: 16 / 9,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'flex-end',
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  recognizeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 10,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  toggleButtonText: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginRight: 6,
  },
  allMembersContainer: {
    marginBottom: 20,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  personDetailModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    padding: 16,
  },
  modalImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  detailSection: {
    marginBottom: 16,
  },
  modalDetailLabel: {
    fontSize: 14,
    color: '#6B6B6B',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    color: '#000000',
    lineHeight: 24,
    textAlign: 'center',
    backgroundColor: "rgba(190, 188, 188, 0.34)",
    borderRadius: 12,
    padding: 10,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    alignItems: 'center',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
    width: '80%',
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
    marginTop: 8,
  },
  videoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Loading state
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  
  // Error state
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  
  // Empty state
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  
  // Flashcard styles
  flashcardWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  flashcardContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  flashcardIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#000',
  },
  inactiveDot: {
    backgroundColor: '#ddd',
  },
  flashcardContent: {
    padding: 16,
  },
  flashcardImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  flashcardInfo: {
    gap: 12,
  },
  flashcardName: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  flashcardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 8,
    width: 70,
  },
  detailValue: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  flashcardNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  navButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  bottomPadding: {
    height: 100, // Ensure enough space at the bottom
  },
  // Recognition modal specific styles
  recognitionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  recognitionNameRelation: {
    alignItems: 'center',
    marginBottom: 16,
  },
  recognitionName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  recognitionRelation: {
    fontSize: 20,
    color: '#666',
    fontWeight: '500',
  },
  conversationStarter: {
    backgroundColor: '#f5f7ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  conversationStarterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  conversationStarterText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#333',
    lineHeight: 26,
  },
  // Video modal styles
  videoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoModalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  videoModalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 10,
  },
  videoModalTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  // Reminders section styles
  remindersSection: {
    marginTop: 20,
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  remindersContainer: {
    marginTop: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    paddingVertical: 8,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  reminderDateTimeContainer: {
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  reminderDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  reminderTime: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  reminderDescription: {
    fontSize: 14,
    color: '#6B6B6B',
  },
  viewAllRemindersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
  },
  viewAllRemindersText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginRight: 4,
  },
  emptyRemindersContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyRemindersText: {
    fontSize: 16,
    color: '#6B6B6B',
    marginBottom: 12,
  },
  addReminderButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addReminderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default PeopleYouKnow;