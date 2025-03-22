/**
 * Colors used throughout the dementia app, designed for high contrast and accessibility.
 * Optimized for users with cognitive impairments with careful consideration for both light and dark modes.
 */

const primary = '#0057B8'; // Strong blue - high contrast but not harsh
const secondary = '#FF914D'; // Warm orange - friendly and inviting

export const Colors = {
  light: {
    text: '#1A1A1A', // Near black for high contrast
    background: '#FFFFFF',
    tint: primary,
    icon: '#555555', // Darker gray for better visibility
    tabIconDefault: '#777777',
    tabIconSelected: primary,
    card: '#F7F7F7', // Light gray for card backgrounds
    border: '#E0E0E0', // Light border
    success: '#2E7D32', // Dark green
    error: '#C62828', // Dark red
    button: primary,
    buttonText: '#FFFFFF',
    secondaryButton: '#F0F0F0',
    secondaryButtonText: '#333333',
    reminder: '#FFF8E1', // Soft cream background for reminders
    memory: '#E1F5FE', // Soft blue background for memories
    help: secondary
  },
  dark: {
    text: '#FFFFFF',
    background: '#121212',
    tint: '#60AFFF', // Lighter blue for dark mode
    icon: '#BBBBBB', // Light gray for better visibility
    tabIconDefault: '#999999',
    tabIconSelected: '#60AFFF',
    card: '#1E1E1E', // Dark gray for card backgrounds
    border: '#333333', // Dark border
    success: '#81C784', // Lighter green for dark mode
    error: '#EF5350', // Lighter red for dark mode
    button: '#60AFFF',
    buttonText: '#FFFFFF',
    secondaryButton: '#333333',
    secondaryButtonText: '#FFFFFF',
    reminder: '#3E2723', // Dark warm background
    memory: '#0D47A1', // Dark blue background
    help: '#FFAB40' // Brighter orange for dark mode
  },
};
