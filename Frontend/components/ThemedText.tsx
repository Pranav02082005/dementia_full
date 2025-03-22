import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link' | 'large' | 'extraLarge' | 'reminder' | 'memory' | 'name';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        type === 'large' ? styles.large : undefined,
        type === 'extraLarge' ? styles.extraLarge : undefined,
        type === 'reminder' ? styles.reminder : undefined,
        type === 'memory' ? styles.memory : undefined,
        type === 'name' ? styles.name : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 18,
    lineHeight: 28,
    fontFamily: 'System',
  },
  defaultSemiBold: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    fontFamily: 'System',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    lineHeight: 42,
    fontFamily: 'System',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 32,
    fontFamily: 'System',
    marginBottom: 8,
  },
  link: {
    lineHeight: 30,
    fontSize: 18,
    color: '#0057B8',
    fontFamily: 'System',
    textDecorationLine: 'underline',
  },
  large: {
    fontSize: 22,
    lineHeight: 32,
    fontFamily: 'System',
  },
  extraLarge: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '500',
    fontFamily: 'System',
  },
  reminder: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    fontFamily: 'System',
  },
  memory: {
    fontSize: 20,
    lineHeight: 28,
    fontStyle: 'italic',
    fontFamily: 'System',
  },
  name: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: 'bold',
    fontFamily: 'System',
    letterSpacing: 0.5,
  },
});
