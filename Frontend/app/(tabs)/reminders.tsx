import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  FlatList,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import AddTaskScreen from './addReminder';
import { useRouter } from 'expo-router';

// API URL for backend requests
const API_URL = 'http://172.24.3.22:5000';

// Icon Components
const BellIcon = ({ width, height, color }) => (
  <Svg width={width} height={height} fill={color} viewBox="0 0 256 256">
    <Path d="M221.8,175.94C216.25,166.38,208,139.33,208,104a80,80,0,1,0-160,0c0,35.34-8.26,62.38-13.81,71.94A16,16,0,0,0,48,200H88.81a40,40,0,0,0,78.38,0H208a16,16,0,0,0,13.8-24.06ZM128,216a24,24,0,0,1-22.62-16h45.24A24,24,0,0,1,128,216Z" />
  </Svg>
);

const CalendarIcon = ({ width, height, color }) => (
  <Svg width={width} height={height} fill={color} viewBox="0 0 256 256">
    <Path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" />
  </Svg>
);

const CaretLeft = ({ width, height, color }) => (
  <Svg width={width} height={height} fill={color} viewBox="0 0 256 256">
    <Path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z" />
  </Svg>
);

const CaretRight = ({ width, height, color }) => (
  <Svg width={width} height={height} fill={color} viewBox="0 0 256 256">
    <Path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
  </Svg>
);

const ClockIcon = ({ width, height, color }) => (
  <Svg width={width} height={height} fill={color} viewBox="0 0 256 256">
    <Path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z" />
  </Svg>
);

const PlusIcon = ({ width, height, color }) => (
  <Svg width={width} height={height} fill={color} viewBox="0 0 256 256">
    <Path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
  </Svg>
);

const CheckIcon = ({ width, height, color }) => (
  <Svg width={width} height={height} fill={color} viewBox="0 0 256 256">
    <Path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
  </Svg>
);

// Reminder Item Component
const ReminderItem = ({ item, onToggleComplete }) => {
  return (
    <View style={[styles.reminderItem, item.checked && styles.completedItem]}>
      <View style={styles.reminderLeftContent}>
        <TouchableOpacity
          style={[styles.checkboxContainer, item.checked && styles.checkedContainer]}
          onPress={() => onToggleComplete(item.id)}
        >
          {item.checked && <CheckIcon width={20} height={20} color="#FFFFFF" />}
        </TouchableOpacity>
        <View style={styles.reminderTextContainer}>
          <Text style={[styles.reminderTitle, item.checked && styles.completedText]}>{item.title}</Text>
          <Text style={styles.reminderTime}>{item.time} • {item.date}</Text>
          {item.description && (
            <Text style={styles.reminderDescription} numberOfLines={2}>
              {item.description}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

// Main Reminders Component
const RemindersScreen = () => {
  const [reminders, setReminders] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(true);
  const [dateDetailModalVisible, setDateDetailModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // Get current month and year
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // Fetch reminders from API
  useEffect(() => {
    fetchReminders();
  }, []);

  // Function to fetch reminders from the backend
  const fetchReminders = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/get_reminder`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data) {
        // Convert object of reminders to array with proper dates and sort
        const reminderArray = Object.entries(data.data).map(([id, reminder]) => {
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
          
          const today = new Date();
          const tomorrow = new Date();
          tomorrow.setDate(today.getDate() + 1);
          
          // Format date string
          let dateString = 'Unknown';
          if (
            dateObj.getDate() === today.getDate() &&
            dateObj.getMonth() === today.getMonth() &&
            dateObj.getFullYear() === today.getFullYear()
          ) {
            dateString = 'Today';
          } else if (
            dateObj.getDate() === tomorrow.getDate() &&
            dateObj.getMonth() === tomorrow.getMonth() &&
            dateObj.getFullYear() === tomorrow.getFullYear()
          ) {
            dateString = 'Tomorrow';
          } else {
            dateString = dateObj.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            });
          }
          
          return {
            id,
            title: reminder.title || 'No Title',
            description: reminder.description || '',
            time: reminder.time,
            date: dateString,
            dateObj: dateObj,
            checked: false
          };
        }).sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
        
        setReminders(reminderArray);
      } else {
        // Fallback to sample data if API returns no reminders
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);

        const initialReminders = [
          {
            id: 1,
            title: 'Take medication',
            description: 'Take blood pressure medication with breakfast',
            time: '08:00 AM',
            date: 'Today',
            dateObj: today,
            checked: false
          },
          {
            id: 2,
            title: 'Doctor appointment',
            description: 'Checkup with Dr. Johnson at Memorial Hospital',
            time: '10:30 AM',
            date: 'Tomorrow',
            dateObj: tomorrow,
            checked: false
          },
          {
            id: 3,
            title: 'Call family',
            description: 'Weekly call with children',
            time: '06:00 PM',
            date: 'Today',
            dateObj: today,
            checked: true
          }
        ];

        setReminders(initialReminders);
      }
    } catch (err) {
      console.error('Error fetching reminders:', err);
      
      // Fallback to sample data if API fails
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      const initialReminders = [
        {
          id: 1,
          title: 'Take medication',
          description: 'Take blood pressure medication with breakfast',
          time: '08:00 AM',
          date: 'Today',
          dateObj: today,
          checked: false
        },
        {
          id: 2,
          title: 'Doctor appointment',
          description: 'Checkup with Dr. Johnson at Memorial Hospital',
          time: '10:30 AM',
          date: 'Tomorrow',
          dateObj: tomorrow,
          checked: false
        },
        {
          id: 3,
          title: 'Call family',
          description: 'Weekly call with children',
          time: '06:00 PM',
          date: 'Today',
          dateObj: today,
          checked: true
        }
      ];

      setReminders(initialReminders);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = (newTask) => {
    setReminders([...reminders, newTask]);
  };

  const handleToggleComplete = (id) => {
    setReminders(
      reminders.map(reminder =>
        reminder.id === id
          ? { ...reminder, checked: !reminder.checked }
          : reminder
      )
    );
  };

  // Helper function to get days in month
  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Helper function to get the first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  // Navigate to next month
  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Format date to string for comparison
  const formatDateToString = (date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  // Check if a date has reminders
  const hasRemindersOnDate = (date) => {
    return reminders.some(reminder => {
      const reminderDate = reminder.dateObj;
      return (
        reminderDate.getDate() === date.getDate() &&
        reminderDate.getMonth() === date.getMonth() &&
        reminderDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Get reminders for a specific date
  const getRemindersForDate = (date) => {
    return reminders.filter(reminder => {
      const reminderDate = reminder.dateObj;
      return (
        reminderDate.getDate() === date.getDate() &&
        reminderDate.getMonth() === date.getMonth() &&
        reminderDate.getFullYear() === date.getFullYear()
      );
    }).sort((a, b) => {
      // Sort by completion status first, then by time
      if (a.checked !== b.checked) return a.checked ? 1 : -1;
      return new Date('1970/01/01 ' + a.time).getTime() - new Date('1970/01/01 ' + b.time).getTime();
    });
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setDateDetailModalVisible(true);
  };

  // Render calendar days
  const renderCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear);
    
    // Empty cells before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }
    
    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isToday = 
        date.getDate() === new Date().getDate() && 
        date.getMonth() === new Date().getMonth() && 
        date.getFullYear() === new Date().getFullYear();
      
      const hasReminders = hasRemindersOnDate(date);
      
      days.push(
        <TouchableOpacity 
          key={`day-${i}`} 
          style={styles.dayCell}
          onPress={() => handleDateSelect(date)}
        >
          <View style={[
            styles.dayButton,
            isToday && styles.todayButton,
            formatDateToString(selectedDate) === formatDateToString(date) && styles.selectedDayButton
          ]}>
            <Text style={[
              styles.dayText, 
              isToday && styles.todayText,
              formatDateToString(selectedDate) === formatDateToString(date) && styles.selectedDayText
            ]}>
              {i}
            </Text>
            {hasReminders && <View style={styles.reminderDot} />}
          </View>
        </TouchableOpacity>
      );
    }
    
    return days;
  };

  // Group reminders by date
  const groupedReminders = reminders.reduce((groups, reminder) => {
    const date = reminder.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(reminder);
    return groups;
  }, {});

  // Convert grouped reminders to array for rendering
  const reminderSections = Object.keys(groupedReminders).map(date => ({
    date,
    data: groupedReminders[date].sort((a, b) => {
      // Sort by completion status first, then by time
      if (a.checked !== b.checked) return a.checked ? 1 : -1;
      return new Date('1970/01/01 ' + a.time).getTime() - new Date('1970/01/01 ' + b.time).getTime();
    })
  })).sort((a, b) => {
    // Sort sections by date: Today, Tomorrow, then other dates
    if (a.date === 'Today') return -1;
    if (b.date === 'Today') return 1;
    if (a.date === 'Tomorrow') return -1;
    if (b.date === 'Tomorrow') return 1;
    
    // For other dates, sort chronologically
    const dateA = a.data[0].dateObj;
    const dateB = b.data[0].dateObj;
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          {showCalendar ? (
            <BellIcon width={24} height={24} color="#000" />
          ) : (
            <TouchableOpacity onPress={() => setShowCalendar(true)}>
              <CalendarIcon width={24} height={24} color="#000" />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.headerTitle}>Reminders</Text>
        <TouchableOpacity 
          style={styles.headerRight}
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <Text style={styles.headerRightText}>
            {showCalendar ? "List" : "Calendar"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Loading reminders...</Text>
          </View>
        ) : showCalendar ? (
          /* Calendar View */
          <View style={styles.calendarContainer}>
            <View style={styles.calendarHeaderRow}>
              <TouchableOpacity onPress={goToPreviousMonth}>
                <CaretLeft width={18} height={18} color="#000" />
              </TouchableOpacity>
              <Text style={styles.monthTitle}>
                {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity onPress={goToNextMonth}>
                <CaretRight width={18} height={18} color="#000" />
              </TouchableOpacity>
            </View>
            
            {/* Weekday headers */}
            <View style={styles.weekdayRow}>
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                <Text key={index} style={styles.weekdayText}>{day}</Text>
              ))}
            </View>
            
            {/* Calendar days */}
            <View style={styles.daysGrid}>
              {renderCalendarDays()}
            </View>
            
            {/* All Reminders (sorted by date) */}
            <View style={styles.allRemindersContainer}>
              <Text style={styles.allRemindersTitle}>All Reminders</Text>
              {reminderSections.length > 0 ? (
                reminderSections.map((section, index) => (
                  <View key={index} style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>{section.date}</Text>
                    {section.data.map(item => (
                      <ReminderItem
                        key={item.id}
                        item={item}
                        onToggleComplete={handleToggleComplete}
                      />
                    ))}
                  </View>
                ))
              ) : (
                <Text style={styles.noRemindersText}>No reminders found</Text>
              )}
            </View>
          </View>
        ) : (
          /* List View */
          <>
            {reminderSections.length > 0 ? (
              reminderSections.map((section, index) => (
                <View key={index} style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>{section.date}</Text>
                  {section.data.map(item => (
                    <ReminderItem
                      key={item.id}
                      item={item}
                      onToggleComplete={handleToggleComplete}
                    />
                  ))}
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No reminders yet</Text>
                <Text style={styles.emptySubtext}>Tap the + button to add a reminder</Text>
              </View>
            )}
          </>
        )}

        {/* Bottom padding to ensure content isn't hidden behind the FAB */}
        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setModalVisible(true)}
        >
          <PlusIcon width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Add Task Modal */}
      <AddTaskScreen
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddTask={handleAddTask}
      />

      {/* Date Detail Modal */}
      <Modal
        visible={dateDetailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDateDetailModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dateDetailModal}>
            <View style={styles.dateDetailHeader}>
              <Text style={styles.dateDetailTitle}>
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setDateDetailModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.dateDetailContent}>
              {getRemindersForDate(selectedDate).length > 0 ? (
                getRemindersForDate(selectedDate).map(item => (
                  <ReminderItem
                    key={item.id}
                    item={item}
                    onToggleComplete={handleToggleComplete}
                  />
                ))
              ) : (
                <View style={styles.emptyDateContainer}>
                  <Text style={styles.emptyDateText}>No reminders for this date</Text>
                  <TouchableOpacity 
                    style={styles.addReminderButton}
                    onPress={() => {
                      setDateDetailModalVisible(false);
                      setModalVisible(true);
                    }}
                  >
                    <Text style={styles.addReminderButtonText}>Add Reminder</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 80,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerRightText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 72,
    padding: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  completedItem: {
    opacity: 0.7,
  },
  reminderLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#000',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedContainer: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  reminderTextContainer: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  reminderTime: {
    fontSize: 14,
    color: '#6B6B6B',
    marginBottom: 4,
  },
  reminderDescription: {
    fontSize: 14,
    color: '#6B6B6B',
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#6B6B6B',
  },
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  fab: {
    backgroundColor: '#000',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  bottomSpace: {
    height: 80,
  },
  
  // Calendar styles
  calendarContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 4,
    marginBottom: 8,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  weekdayRow: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 8,
  },
  weekdayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '700',
    color: '#6B6B6B',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 16,
  },
  dayCell: {
    width: '14.28%', // 7 days per row
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: '#000',
  },
  todayButton: {
    borderWidth: 1,
    borderColor: '#000',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  todayText: {
    fontWeight: '700',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  reminderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
    position: 'absolute',
    bottom: 4,
  },
  todayRemindersContainer: {
    width: '100%',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 16,
  },
  todayRemindersTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  noRemindersText: {
    fontSize: 16,
    color: '#6B6B6B',
    textAlign: 'center',
    paddingVertical: 24,
  },
  
  // Date Detail Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  dateDetailModal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '60%',
    maxHeight: '80%',
    paddingBottom: 20,
  },
  dateDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  dateDetailTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  dateDetailContent: {
    flex: 1,
  },
  emptyDateContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyDateText: {
    fontSize: 16,
    color: '#6B6B6B',
    marginBottom: 16,
  },
  addReminderButton: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addReminderButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Updated styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B6B6B',
  },
  allRemindersContainer: {
    width: '100%',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 16,
  },
  allRemindersTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
});

export default RemindersScreen;