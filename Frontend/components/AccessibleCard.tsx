import React from 'react';
import { 
  View, 
  StyleSheet, 
  ViewProps, 
  ViewStyle, 
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from './ThemedText';
import { Ionicons } from '@expo/vector-icons';

export type AccessibleCardProps = (ViewProps | TouchableOpacityProps) & {
  title?: string;
  variant?: 'default' | 'reminder' | 'memory' | 'person' | 'help';
  iconName?: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
  style?: ViewStyle;
  children?: React.ReactNode;
};

export function AccessibleCard({
  title,
  variant = 'default',
  iconName,
  onPress,
  style,
  children,
  ...rest
}: AccessibleCardProps) {
  // Get colors based on theme and variant
  const backgroundColor = useThemeColor(
    {}, 
    variant === 'reminder' ? 'reminder' : 
    variant === 'memory' ? 'memory' : 
    variant === 'help' ? 'help' : 
    'card'
  );
  
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor(
    {}, 
    variant === 'reminder' ? 'button' :
    variant === 'memory' ? 'tint' :
    variant === 'help' ? 'buttonText' :
    'icon'
  );

  // Set up container styles based on variant
  const containerStyle = {
    backgroundColor,
    borderColor,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden' as const,
  };

  // Determine icon size
  const iconSize = 24;

  // Content component that's shared between touchable and non-touchable versions
  const CardContent = () => (
    <View style={styles.contentContainer}>
      {/* Header with icon and title */}
      {(title || iconName) && (
        <View style={styles.header}>
          {iconName && (
            <Ionicons 
              name={iconName} 
              size={iconSize} 
              color={iconColor} 
              style={styles.icon} 
            />
          )}
          {title && (
            <ThemedText 
              type="subtitle" 
              style={styles.title}
            >
              {title}
            </ThemedText>
          )}
        </View>
      )}
      
      {/* Card content */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );

  // Render as TouchableOpacity if onPress is provided, otherwise as View
  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.container, containerStyle, style]}
        onPress={onPress}
        activeOpacity={0.7}
        {...(rest as TouchableOpacityProps)}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  // Non-touchable version
  return (
    <View 
      style={[styles.container, containerStyle, style]}
      {...(rest as ViewProps)}
    >
      <CardContent />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    flex: 1,
    marginBottom: 0, // Override default margin
  },
  content: {
    // Content styling if needed
  },
}); 