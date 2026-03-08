/**
 * Accessibility Service - Alternative monitoring method
 * Works with Android Accessibility Services
 */

import { Platform, Linking } from 'react-native';
import { NativeModules } from 'react-native';

const { AccessibilityModule } = NativeModules;

export class AccessibilityService {
  /**
   * Check if accessibility service is enabled
   */
  static async checkAccessibilityPermission() {
    try {
      if (Platform.OS !== 'android') {
        return false;
      }
      
      if (AccessibilityModule) {
        return await AccessibilityModule.isAccessibilityServiceEnabled();
      }
      
      return false;
    } catch (error) {
      console.error('Accessibility permission check error:', error);
      return false;
    }
  }

  /**
   * Request accessibility service permission
   */
  static async requestAccessibilityPermission() {
    try {
      if (Platform.OS !== 'android') {
        return false;
      }
      
      if (AccessibilityModule) {
        const granted = await AccessibilityModule.requestAccessibilityService();
        
        if (!granted) {
          // Guide user to accessibility settings
          this.openAccessibilitySettings();
        }
        
        return granted;
      }
      
      return false;
    } catch (error) {
      console.error('Accessibility permission request error:', error);
      return false;
    }
  }

  /**
   * Open accessibility settings
   */
  static openAccessibilitySettings() {
    try {
      if (Platform.OS === 'android') {
        Linking.openSettings();
      }
    } catch (error) {
      console.error('Open accessibility settings error:', error);
    }
  }

  /**
   * Start accessibility monitoring
   */
  static async startMonitoring() {
    try {
      if (Platform.OS !== 'android' || !AccessibilityModule) {
        return false;
      }
      
      return await AccessibilityModule.startMonitoring();
    } catch (error) {
      console.error('Start accessibility monitoring error:', error);
      return false;
    }
  }

  /**
   * Stop accessibility monitoring
   */
  static async stopMonitoring() {
    try {
      if (Platform.OS !== 'android' || !AccessibilityModule) {
        return false;
      }
      
      return await AccessibilityModule.stopMonitoring();
    } catch (error) {
      console.error('Stop accessibility monitoring error:', error);
      return false;
    }
  }

  /**
   * Configure accessibility service settings
   */
  static async configureService() {
    try {
      if (Platform.OS !== 'android' || !AccessibilityModule) {
        return false;
      }
      
      const config = {
        targetApps: [
          'com.google.android.youtube',
          'com.instagram.android',
          'com.zhiliaoapp.musically',
        ],
        targetActivities: [
          'Shorts',
          'Reels',
          'ForYou',
          'ReelActivity',
          'ShortsActivity',
        ],
        cooldownPeriod: 2000, // 2 seconds
      };
      
      return await AccessibilityModule.configureService(config);
    } catch (error) {
      console.error('Configure accessibility service error:', error);
      return false;
    }
  }
}
