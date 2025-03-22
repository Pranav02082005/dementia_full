import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

export type ReminderItemProps = {
  title: string;
  time: string;
  description?: string;
  completed?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  onComplete?: () => void;
  isPriority?: boolean;
};

export function ReminderItem({
  title,
  time,
  description,
  completed = false,
  iconName = 'alarm-outline',
  onPress,
  onComplete,
  isPriority = false,
}: ReminderItemProps) {
  const backgroundColor = useThemeColor({}, 'reminder');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'button');
  const successColor = useThemeColor({}, 'success');

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor,
          borderColor: isPriority ? tintColor : borderColor,
          borderWidth: isPriority ? 2 : 1,
          opacity: completed ? 0.7 : 1
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={completed}
    >
      {/* Left side: Icon */}
      <View style={[styles.iconContainer, { borderColor }]}>
        <Ionicons 
          name={iconName} 
          size={28} 
          color={completed ? successColor : tintColor} 
        />
      </View>
      
      {/* Middle: Content */}
      <View style={styles.contentContainer}>
        <ThemedText type="reminder" style={[styles.title, completed && styles.completedText]}>
          {title}
        </ThemedText>
        
        <ThemedText style={[styles.time, completed && styles.completedText]}>
          {time}
        </ThemedText>
        
        {description && (
          <ThemedText style={[styles.description, completed && styles.completedText]}>
            {description}
          </ThemedText>
        )}
      </View>
      
      {/* Right side: Completion or action */}
      {onComplete && !completed ? (
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={onComplete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="checkmark-circle-outline" size={32} color={tintColor} />
        </TouchableOpacity>
      ) : completed ? (
        <View style={styles.completedIcon}>
          <Ionicons name="checkmark-circle" size={32} color={successColor} />
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    padding: 2, // Extra space to accommodate borders
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderRightWidth: 1,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    paddingVertical: 12,
  },
  title: {
    marginBottom: 4,
  },
  time: {
    marginBottom: 6,
    fontWeight: '500',
  },
  description: {
    opacity: 0.8,
  },
  completeButton: {
    padding: 10,
  },
  completedIcon: {
    padding: 10,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
}); 