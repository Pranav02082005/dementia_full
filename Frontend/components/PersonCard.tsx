import React from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  TouchableOpacityProps,
  Dimensions,
  ImageSourcePropType
} from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

export type PersonCardProps = TouchableOpacityProps & {
  name: string;
  relationship: string;
  photo: ImageSourcePropType;
  lastSeen?: string;
  conversationCue?: string;
  onViewMemories?: () => void;
  onShowDetails?: () => void;
};

export function PersonCard({
  name,
  relationship,
  photo,
  lastSeen,
  conversationCue,
  onViewMemories,
  onShowDetails,
  ...rest
}: PersonCardProps) {
  const backgroundColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { 
          backgroundColor,
          borderColor
        }
      ]}
      activeOpacity={0.8}
      {...rest}
    >
      {/* Person photo */}
      <Image 
        source={photo} 
        style={styles.photo}
        resizeMode="cover"
      />
      
      {/* Content container */}
      <View style={styles.contentContainer}>
        {/* Name and relationship */}
        <View style={styles.header}>
          <ThemedText type="name" style={styles.name}>
            {name}
          </ThemedText>
          <ThemedText type="large" style={styles.relationship}>
            {relationship}
          </ThemedText>
          {lastSeen && (
            <ThemedText style={styles.lastSeen}>
              Last seen: {lastSeen}
            </ThemedText>
          )}
        </View>
        
        {/* Conversation cue if available */}
        {conversationCue && (
          <View style={[styles.cueContainer, { borderColor }]}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color={tintColor} style={styles.cueIcon} />
            <ThemedText style={styles.cueText}>
              {conversationCue}
            </ThemedText>
          </View>
        )}
        
        {/* Action buttons */}
        <View style={styles.actions}>
          {onViewMemories && (
            <TouchableOpacity 
              style={[styles.actionButton, { borderColor }]}
              onPress={onViewMemories}
            >
              <Ionicons name="images-outline" size={22} color={tintColor} />
              <ThemedText style={{ color: tintColor, marginLeft: 6 }}>
                Memories
              </ThemedText>
            </TouchableOpacity>
          )}
          
          {onShowDetails && (
            <TouchableOpacity 
              style={[styles.actionButton, { borderColor }]}
              onPress={onShowDetails}
            >
              <Ionicons name="information-circle-outline" size={22} color={tintColor} />
              <ThemedText style={{ color: tintColor, marginLeft: 6 }}>
                Details
              </ThemedText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  photo: {
    width: '100%',
    height: width * 0.5,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 12,
  },
  name: {
    marginBottom: 4,
  },
  relationship: {
    marginBottom: 6,
  },
  lastSeen: {
    marginTop: 4,
    opacity: 0.7,
  },
  cueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    padding: 12,
    borderRadius: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  cueIcon: {
    marginRight: 8,
  },
  cueText: {
    flex: 1,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
}); 