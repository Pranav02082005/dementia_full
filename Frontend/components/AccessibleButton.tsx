import React from 'react';
import { 
  TouchableOpacity, 
  View, 
  StyleSheet, 
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

export type AccessibleButtonProps = TouchableOpacityProps & {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'help';
  size?: 'small' | 'medium' | 'large';
  iconName?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function AccessibleButton({
  label,
  variant = 'primary',
  size = 'medium',
  iconName,
  iconPosition = 'left',
  style,
  textStyle,
  ...rest
}: AccessibleButtonProps) {
  const backgroundColor = useThemeColor(
    {}, 
    variant === 'primary' ? 'button' : 
    variant === 'secondary' ? 'secondaryButton' : 
    variant === 'help' ? 'help' : 'background'
  );
  
  const textColor = useThemeColor(
    {}, 
    variant === 'primary' ? 'buttonText' : 
    variant === 'secondary' ? 'secondaryButtonText' : 
    variant === 'help' ? 'buttonText' : 'tint'
  );

  const borderColor = useThemeColor({}, 'tint');

  let buttonStyle: ViewStyle = {};
  let paddingSize: ViewStyle = {};
  let textSize: 'default' | 'large' | 'extraLarge' = 'default';

  // Determine size styling
  switch (size) {
    case 'small':
      paddingSize = { paddingVertical: 8, paddingHorizontal: 16 };
      textSize = 'default';
      break;
    case 'medium':
      paddingSize = { paddingVertical: 12, paddingHorizontal: 24 };
      textSize = 'large';
      break;
    case 'large':
      paddingSize = { paddingVertical: 16, paddingHorizontal: 32 };
      textSize = 'extraLarge';
      break;
  }

  // Determine variant styling
  switch (variant) {
    case 'primary':
      buttonStyle = { 
        backgroundColor,
        borderRadius: 8,
      };
      break;
    case 'secondary':
      buttonStyle = { 
        backgroundColor,
        borderRadius: 8,
      };
      break;
    case 'outline':
      buttonStyle = { 
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor,
        borderRadius: 8,
      };
      break;
    case 'help':
      buttonStyle = {
        backgroundColor,
        borderRadius: 100,
      };
      break;
  }

  const iconSize = size === 'small' ? 20 : size === 'medium' ? 24 : 28;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        buttonStyle,
        paddingSize,
        style,
      ]}
      activeOpacity={0.7}
      {...rest}
    >
      <View style={styles.buttonContent}>
        {iconName && iconPosition === 'left' && (
          <Ionicons 
            name={iconName} 
            size={iconSize} 
            color={textColor} 
            style={styles.iconLeft} 
          />
        )}
        <ThemedText 
          type={textSize} 
          style={[{ color: textColor }, textStyle]}
        >
          {label}
        </ThemedText>
        {iconName && iconPosition === 'right' && (
          <Ionicons 
            name={iconName} 
            size={iconSize} 
            color={textColor} 
            style={styles.iconRight} 
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48, // Minimum height for touch target
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
}); 