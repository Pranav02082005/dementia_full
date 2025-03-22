import React from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  Dimensions,
  ImageSourcePropType
} from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;

export type MemoryCardProps = {
  image: ImageSourcePropType;
  caption: string;
  date: string;
  people?: string[];
  location?: string;
  onPress?: () => void;
  onShare?: () => void;
};

export function MemoryCard({
  image,
  caption,
  date,
  people,
  location,
  onPress,
  onShare,
}: MemoryCardProps) {
  const backgroundColor = useThemeColor({}, 'memory');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor, borderColor }
      ]}
      onPress={onPress}
      activeOpacity={0.9}
      disabled={!onPress}
    >
      {/* Memory image */}
      <Image 
        source={image} 
        style={styles.image}
        resizeMode="cover"
      />
      
      {/* Content container */}
      <View style={styles.contentContainer}>
        {/* Date badge */}
        <View style={[styles.dateBadge, { backgroundColor: tintColor }]}>
          <ThemedText style={styles.dateText} darkColor="#FFFFFF" lightColor="#FFFFFF">
            {date}
          </ThemedText>
        </View>
        
        {/* Caption */}
        <ThemedText type="memory" style={styles.caption}>
          {caption}
        </ThemedText>
        
        {/* People tags if available */}
        {people && people.length > 0 && (
          <View style={styles.tagsContainer}>
            <Ionicons name="people-outline" size={18} color={textColor} style={styles.tagIcon} />
            <ThemedText style={styles.tags}>
              {people.join(', ')}
            </ThemedText>
          </View>
        )}
        
        {/* Location if available */}
        {location && (
          <View style={styles.tagsContainer}>
            <Ionicons name="location-outline" size={18} color={textColor} style={styles.tagIcon} />
            <ThemedText style={styles.tags}>
              {location}
            </ThemedText>
          </View>
        )}
        
        {/* Share button */}
        {onShare && (
          <TouchableOpacity 
            style={[styles.shareButton, { borderColor }]}
            onPress={onShare}
          >
            <Ionicons name="share-outline" size={20} color={tintColor} />
            <ThemedText style={{ color: tintColor, marginLeft: 8 }}>
              Share
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 16,
    marginHorizontal: width * 0.05,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: width * 0.6, // Maintain aspect ratio
  },
  contentContainer: {
    padding: 16,
  },
  dateBadge: {
    position: 'absolute',
    top: -15,
    right: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  caption: {
    marginTop: 8,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagIcon: {
    marginRight: 8,
  },
  tags: {
    fontSize: 16,
    opacity: 0.8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 12,
  },
}); 