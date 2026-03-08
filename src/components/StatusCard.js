/**
 * Status Card Component - Shows current blocking status
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatusCard = ({ statusText, isBlockingEnabled, isPanicModeActive }) => {
  const getStatusColor = () => {
    if (isPanicModeActive) return '#FF9800';
    if (isBlockingEnabled) return '#4CAF50';
    return '#F44336';
  };

  const getStatusIcon = () => {
    if (isPanicModeActive) return '⏸️';
    if (isBlockingEnabled) return '✅';
    return '❌';
  };

  return (
    <View style={[styles.container, { borderLeftColor: getStatusColor() }]}>
      <View style={styles.statusHeader}>
        <Text style={styles.statusIcon}>{getStatusIcon()}</Text>
        <Text style={styles.statusText}>Status</Text>
      </View>
      <Text style={[styles.statusDescription, { color: getStatusColor() }]}>
        {statusText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginVertical: 10,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusDescription: {
    fontSize: 18,
    fontWeight: '500',
  },
});

export default StatusCard;
