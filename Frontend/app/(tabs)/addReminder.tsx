import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Modal
} from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';

// Define types
interface TimeOption {
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

interface TaskItem {
  id: number;
  title: string;
  description: string;
  time: string;
  date: string;
  dateObj: Date;
  checked: boolean;
  backendId?: string; // Optional property for backend ID
}

interface AddTaskScreenProps {
  visible: boolean;
  onClose: () => void;
  onAddTask: (task: TaskItem) => void;
}

// Define the API URL based on the device IP address
// For the Flask backend running on your machine
const API_URL = 'http://172.24.3.22:5000';

// Icon components
const ArrowLeftIcon = () => (
  <Svg width={24} height={24} fill="black" viewBox="0 0 256 256">
    <Path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
  </Svg>
);

const PlusIcon = () => (
  <Svg width={24} height={24} fill="white" viewBox="0 0 256 256">
    <Path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z" />
  </Svg>
);

// Time selector component
const TimeSelector = ({ options, selectedValue, onSelect }: TimeOption) => {
  return (
    <View style={styles.timeGroup}>
      {options.map((option: string, index: number) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.timeOption,
            selectedValue === option ? styles.timeOptionSelected : null
          ]}
          onPress={() => onSelect(option)}
        >
          <Text 
            style={[
              styles.timeOptionText,
              selectedValue === option ? styles.timeOptionTextSelected : styles.timeOptionTextUnselected
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const AddTaskScreen = ({ visible, onClose, onAddTask }: AddTaskScreenProps) => {
  const [taskName, setTaskName] = useState('');
  const [notes, setNotes] = useState('');
  const [attachments, setAttachments] = useState('');

  // Time state
  const [hour, setHour] = useState('06');
  const [minute, setMinute] = useState('30');
  const [period, setPeriod] = useState('AM');

  // Date state - default to today
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0); // 0 = Today, 1 = Tomorrow, etc.

  // Generate date options for the next 7 days
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(today.getDate() + i);
    return {
      index: i,
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      date: date
    };
  });

  const handleGoBack = () => {
    // Reset form and close modal
    
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setTaskName('');
    setNotes('');
    setAttachments('');
    setHour('06');
    setMinute('30');
    setPeriod('AM');
    setSelectedDate(today);
    setSelectedDateIndex(0);
  };

  const handleDateSelect = (index: number) => {
    setSelectedDateIndex(index);
    setSelectedDate(dateOptions[index].date);
  };

  const handleAddTask = () => {
    console.log('API_URL:', API_URL)
    // Format the date - use "Today" or "Tomorrow" for those days, otherwise use the date format
    let formattedDate;
    if (selectedDateIndex === 0) {
      formattedDate = 'Today';
    } else if (selectedDateIndex === 1) {
      formattedDate = 'Tomorrow';
    } else {
      formattedDate = selectedDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }

    // Convert the date to a format for the backend - ensure it's clean without quotes
    const backendDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    const backendTime = `${hour}:${minute} ${period}`;

    console.log('Sending date to backend:', backendDate);
    
    // Create a new task object
    const newTask: TaskItem = {
      id: Date.now(), // Use timestamp as a simple unique ID
      title: taskName,
      description: notes,
      time: `${hour}:${minute} ${period}`,
      date: formattedDate,
      dateObj: selectedDate, // Store the actual date object for sorting
      checked: false
      // backendId will be added later after successful API call
    };

    // Create form data for backend
    const formData = new FormData();
    formData.append('title', taskName);
    formData.append('description', notes);
    formData.append('date', backendDate); // Send the clean date string
    formData.append('time', backendTime);

    // Send the data to the backend
    console.log(`Sending reminder to ${API_URL}/create_reminder`);
    fetch(`${API_URL}/create_reminder`, {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      console.log('Response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      // If the backend returned a reminder_id, we could add it to our local task
      if (data.reminder_id) {
        newTask.backendId = data.reminder_id;
      }
    })
    .catch(error => {
      console.error('Error creating reminder on server:', error);
      // Still add the task locally even if the backend request fails
    })
    .finally(() => {
      // Pass the new task to the parent component
      onAddTask(newTask);

      // Reset form and close modal
      resetForm();
      onClose();
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleGoBack}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <ArrowLeftIcon />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add new task</Text>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Task Name Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Task Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="E.g., Wakeup"
              placeholderTextColor="#6B6B6B"
              value={taskName}
              onChangeText={setTaskName}
            />
          </View>

          {/* Date Selector */}
          <Text style={styles.sectionTitle}>Date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScrollView}
            contentContainerStyle={styles.dateScrollContent}
          >
            {dateOptions.map((option) => (
              <TouchableOpacity
                key={option.index}
                style={[
                  styles.dateOption,
                  selectedDateIndex === option.index ? styles.dateOptionSelected : null
                ]}
                onPress={() => handleDateSelect(option.index)}
              >
                <Text
                  style={[
                    styles.dateOptionText,
                    selectedDateIndex === option.index ? styles.dateOptionTextSelected : styles.dateOptionTextUnselected
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Time Selector */}
          <Text style={styles.sectionTitle}>Time</Text>
          <View style={styles.timeContainer}>
            {/* Hours */}
            <TimeSelector
              options={['05', '06', '07', '08', '09', '10', '11', '12']}
              selectedValue={hour}
              onSelect={setHour}
            />

            {/* Minutes */}
            <TimeSelector
              options={['00', '15', '30', '45']}
              selectedValue={minute}
              onSelect={setMinute}
            />

            {/* AM/PM */}
            <TimeSelector
              options={['AM', 'PM']}
              selectedValue={period}
              onSelect={setPeriod}
            />
          </View>

          {/* Notes Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Tap here to add notes"
              placeholderTextColor="#6B6B6B"
              multiline={true}
              numberOfLines={4}
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* Attachments Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Attachments</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Tap here to add files"
              placeholderTextColor="#6B6B6B"
              value={attachments}
              onChangeText={setAttachments}
            />
          </View>

          {/* Add some padding at the bottom for better scrolling */}
          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Add button */}
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            style={[
              styles.addButton,
              !taskName.trim() ? styles.addButtonDisabled : null
            ]}
            onPress={handleAddTask}
            disabled={!taskName.trim()}
          >
            <PlusIcon />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  addButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    height: 56,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#DEDEDE',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    minHeight: 144, // Equivalent to min-h-36 in Tailwind
    backgroundColor: '#FFFFFF',
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    color: 'black',
  },
  timeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  timeGroup: {
    flex: 1,
  },
  timeOption: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  timeOptionSelected: {
    backgroundColor: '#EEEEEE',
  },
  timeOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timeOptionTextSelected: {
    color: 'black',
  },
  timeOptionTextUnselected: {
    color: '#C4C4C4',
  },
  dateScrollView: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  dateScrollContent: {
    paddingRight: 16,
  },
  dateOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DEDEDE',
  },
  dateOptionSelected: {
    backgroundColor: 'black',
    borderColor: 'black',
  },
  dateOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dateOptionTextSelected: {
    color: 'white',
  },
  dateOptionTextUnselected: {
    color: '#6B6B6B',
  },
  addButtonContainer: {
    alignItems: 'flex-end',
    padding: 20,
  },
  addButton: {
    backgroundColor: 'black',
    borderRadius: 28,
    height: 56,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 80,
  },
});

export default AddTaskScreen;