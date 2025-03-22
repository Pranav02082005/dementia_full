import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const exercises = [
  {
    id: '1',
    title: 'Pattern Matching',
    description: 'Match similar patterns to improve visual memory',
    icon: 'grid-outline',
    difficulty: 'Easy',
  },
  {
    id: '2',
    title: 'Word Recall',
    description: 'Remember and repeat words to enhance verbal memory',
    icon: 'text-outline',
    difficulty: 'Medium',
  },
  {
    id: '3',
    title: 'Sequence Memory',
    description: 'Remember and repeat sequences of numbers or colors',
    icon: 'list-outline',
    difficulty: 'Medium',
  },
  {
    id: '4',
    title: 'Picture Memory',
    description: 'Remember and identify pictures shown briefly',
    icon: 'images-outline',
    difficulty: 'Hard',
  },
];

export default function ExercisesScreen() {
  const { colors } = useTheme();
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 24,
    },
    exerciseCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    exerciseTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    exerciseDescription: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.8,
      marginBottom: 12,
    },
    difficultyBadge: {
      position: 'absolute',
      top: 16,
      right: 16,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: colors.primary,
    },
    difficultyText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '600',
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    icon: {
      color: '#FFFFFF',
      fontSize: 24,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Memory Exercises</Text>
      {exercises.map((exercise) => (
        <TouchableOpacity
          key={exercise.id}
          style={[
            styles.exerciseCard,
            selectedExercise === exercise.id && {
              borderColor: colors.primary,
              borderWidth: 2,
            },
          ]}
          onPress={() => setSelectedExercise(exercise.id)}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={exercise.icon as any} style={styles.icon} />
          </View>
          <Text style={styles.exerciseTitle}>{exercise.title}</Text>
          <Text style={styles.exerciseDescription}>{exercise.description}</Text>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>{exercise.difficulty}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
} 