/**
 * Shorts Blocker React Native App
 * Cross-platform app to block addictive short-video content
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native';
import { BackgroundJob } from 'react-native-background-job';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

// Import components
import Header from './src/components/Header';
import StatusCard from './src/components/StatusCard';
import PanicButton from './src/components/PanicButton';
import InstructionsCard from './src/components/InstructionsCard';

// Import services
import { AppUsageService } from './src/services/AppUsageService';
import { AccessibilityService } from './src/services/AccessibilityService';

const App = () => {
  const [isBlockingEnabled, setIsBlockingEnabled] = useState(false);
  const [isPanicModeActive, setIsPanicModeActive] = useState(false);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [statusText, setStatusText] = useState('Checking permissions...');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Load saved preferences
      const savedBlockingState = await AsyncStorage.getItem('blockingEnabled');
      const savedPanicMode = await AsyncStorage.getItem('panicModeActive');
      
      if (savedBlockingState) {
        setIsBlockingEnabled(JSON.parse(savedBlockingState));
      }
      if (savedPanicMode) {
        const panicEndTime = parseInt(savedPanicMode);
        if (panicEndTime > Date.now()) {
          setIsPanicModeActive(true);
          setStatusText('Panic Mode Active - Blocking Paused');
          // Set timer to exit panic mode
          setTimeout(() => exitPanicMode(), panicEndTime - Date.now());
        } else {
          await AsyncStorage.removeItem('panicModeActive');
        }
      }

      // Check permissions
      await checkPermissions();
      
      // Start background monitoring if blocking is enabled
      if (JSON.parse(savedBlockingState || 'false') && !isPanicModeActive) {
        startBackgroundMonitoring();
      }
    } catch (error) {
      console.error('App initialization error:', error);
      setStatusText('Error initializing app');
    }
  };

  const checkPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        // Check usage stats permission
        const hasUsageStats = await AppUsageService.checkUsageStatsPermission();
        
        // Check accessibility permission
        const hasAccessibility = await AccessibilityService.checkAccessibilityPermission();
        
        if (hasUsageStats && hasAccessibility) {
          setHasPermissions(true);
          setStatusText('Ready to block addictive content');
        } else {
          setHasPermissions(false);
          setStatusText('Permissions required');
        }
      } else {
        // iOS - Screen Time API requires parental controls
        setHasPermissions(false);
        setStatusText('iOS requires Screen Time setup');
      }
    } catch (error) {
      console.error('Permission check error:', error);
      setHasPermissions(false);
      setStatusText('Permission check failed');
    }
  };

  const requestPermissions = async () => {
    try {
      if (Platform.OS === 'android') {
        // Request usage stats permission
        const usageStatsGranted = await AppUsageService.requestUsageStatsPermission();
        
        // Request accessibility permission
        const accessibilityGranted = await AccessibilityService.requestAccessibilityPermission();
        
        if (usageStatsGranted && accessibilityGranted) {
          setHasPermissions(true);
          setStatusText('Permissions granted - Ready to block');
          Alert.alert('Success', 'All permissions granted successfully!');
        } else {
          Alert.alert('Permissions Required', 'Please grant all permissions to enable blocking.');
        }
      } else {
        // iOS - guide user to Screen Time settings
        Alert.alert(
          'iOS Setup Required',
          'On iOS, you need to set up Screen Time restrictions:\n\n1. Go to Settings > Screen Time\n2. Set up Screen Time\n3. Add app limits for social media apps\n4. Enable "Block at End of Limit"',
          [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      console.error('Permission request error:', error);
      Alert.alert('Error', 'Failed to request permissions');
    }
  };

  const toggleBlocking = async (value) => {
    try {
      if (!hasPermissions) {
        Alert.alert('Permissions Required', 'Please grant permissions first.');
        return;
      }

      setIsBlockingEnabled(value);
      await AsyncStorage.setItem('blockingEnabled', JSON.stringify(value));

      if (value && !isPanicModeActive) {
        startBackgroundMonitoring();
        setStatusText('Blocking Active');
      } else {
        stopBackgroundMonitoring();
        setStatusText('Blocking Disabled');
      }
    } catch (error) {
      console.error('Toggle blocking error:', error);
      Alert.alert('Error', 'Failed to toggle blocking');
    }
  };

  const activatePanicMode = async () => {
    try {
      const panicDuration = 5 * 60 * 1000; // 5 minutes
      const panicEndTime = Date.now() + panicDuration;
      
      setIsPanicModeActive(true);
      setIsBlockingEnabled(false);
      await AsyncStorage.setItem('panicModeActive', panicEndTime.toString());
      await AsyncStorage.setItem('blockingEnabled', 'false');
      
      setStatusText('Panic Mode Active - Blocking Paused');
      stopBackgroundMonitoring();
      
      // Set timer to exit panic mode
      setTimeout(() => exitPanicMode(), panicDuration);
      
      Alert.alert('Panic Mode', 'Blocking paused for 5 minutes');
    } catch (error) {
      console.error('Panic mode error:', error);
      Alert.alert('Error', 'Failed to activate panic mode');
    }
  };

  const exitPanicMode = async () => {
    try {
      setIsPanicModeActive(false);
      await AsyncStorage.removeItem('panicModeActive');
      
      // Restore previous blocking state
      const savedBlockingState = await AsyncStorage.getItem('blockingEnabled');
      if (savedBlockingState) {
        const wasBlockingEnabled = JSON.parse(savedBlockingState);
        setIsBlockingEnabled(wasBlockingEnabled);
        
        if (wasBlockingEnabled) {
          startBackgroundMonitoring();
          setStatusText('Blocking Active');
        } else {
          setStatusText('Blocking Disabled');
        }
      }
    } catch (error) {
      console.error('Exit panic mode error:', error);
    }
  };

  const startBackgroundMonitoring = async () => {
    try {
      if (Platform.OS === 'android') {
        // Configure background job for Android
        BackgroundJob.schedule({
          jobKey: 'shortsBlocker',
          period: 5000, // Check every 5 seconds
          exact: true,
          allowExecutionInForeground: true,
        });
      }
    } catch (error) {
      console.error('Background monitoring error:', error);
    }
  };

  const stopBackgroundMonitoring = async () => {
    try {
      if (Platform.OS === 'android') {
        BackgroundJob.cancel({ jobKey: 'shortsBlocker' });
      }
    } catch (error) {
      console.error('Stop background monitoring error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <View style={styles.content}>
        <StatusCard
          statusText={statusText}
          isBlockingEnabled={isBlockingEnabled}
          isPanicModeActive={isPanicModeActive}
        />

        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>Enable Blocking</Text>
          <Switch
            value={isBlockingEnabled}
            onValueChange={toggleBlocking}
            disabled={!hasPermissions || isPanicModeActive}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={isBlockingEnabled ? '#ffffff' : '#f4f3f4'}
          />
        </View>

        {!hasPermissions && (
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermissions}
          >
            <Text style={styles.permissionButtonText}>
              {Platform.OS === 'android' ? 'Grant Permissions' : 'Setup Screen Time'}
            </Text>
          </TouchableOpacity>
        )}

        <PanicButton
          onPress={activatePanicMode}
          disabled={isPanicModeActive || !hasPermissions}
        />

        <InstructionsCard platform={Platform.OS} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  toggleLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  permissionButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
