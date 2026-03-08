/**
 * Instructions Card Component - Shows setup instructions
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const InstructionsCard = ({ platform }) => {
  const getAndroidInstructions = () => [
    '1. Enable Usage Stats permission',
    '2. Enable Accessibility Service',
    '3. Grant all requested permissions',
    '4. Toggle blocking to ON',
    '5. App will automatically block addictive content',
  ];

  const getIOSInstructions = () => [
    '1. Go to Settings > Screen Time',
    '2. Set up Screen Time if not already done',
    '3. Tap "App Limits"',
    '4. Add social media apps (YouTube, Instagram, TikTok)',
    '5. Set time limits (e.g., 30 minutes)',
    '6. Enable "Block at End of Limit"',
    '7. Use this app to monitor usage patterns',
  ];

  const instructions = platform === 'android' ? getAndroidInstructions() : getIOSInstructions();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setup Instructions</Text>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {instructions.map((instruction, index) => (
          <Text key={index} style={styles.instruction}>
            {instruction}
          </Text>
        ))}
      </ScrollView>
      
      <View style={styles.supportedApps}>
        <Text style={styles.supportedTitle}>Supported Apps:</Text>
        <Text style={styles.app}>• YouTube Shorts</Text>
        <Text style={styles.app}>• Instagram Reels</Text>
        <Text style={styles.app}>• TikTok For You</Text>
        <Text style={styles.app}>• Facebook Reels</Text>
        <Text style={styles.app}>• Snapchat Spotlight</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  scrollView: {
    maxHeight: 120,
  },
  instruction: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 4,
  },
  supportedApps: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  supportedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  app: {
    fontSize: 14,
    color: '#555',
    marginBottom: 2,
  },
});

export default InstructionsCard;
