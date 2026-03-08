/**
 * App Usage Service - Monitors app usage and blocks addictive content
 * Works with Android Usage Stats API
 */

import { Platform } from 'react-native';
import { NativeModules } from 'react-native';

const { UsageStatsModule } = NativeModules;

export class AppUsageService {
  static TARGET_APPS = {
    YOUTUBE: 'com.google.android.youtube',
    INSTAGRAM: 'com.instagram.android',
    TIKTOK: 'com.zhiliaoapp.musically',
    FACEBOOK: 'com.facebook.katana',
    SNAPCHAT: 'com.snapchat.android',
    TWITTER: 'com.twitter.android',
  };

  static ADDICTIVE_FEATURES = {
    YOUTUBE_SHORTS: ['Shorts', 'shorts', 'ShortsActivity'],
    INSTAGRAM_REELS: ['Reels', 'reels', 'ReelActivity'],
    TIKTOK_FORYOU: ['ForYou', 'foryou', 'MainActivity'],
    FACEBOOK_REELS: ['Reels', 'reels', 'ReelActivity'],
    SNAPCHAT_SPOTLIGHT: ['Spotlight', 'spotlight'],
    TWITTER_SPACES: ['Spaces', 'spaces'],
  };

  /**
   * Check if usage stats permission is granted
   */
  static async checkUsageStatsPermission() {
    try {
      if (Platform.OS !== 'android') {
        return false;
      }
      
      if (UsageStatsModule) {
        return await UsageStatsModule.checkUsageStatsPermission();
      }
      
      return false;
    } catch (error) {
      console.error('Usage stats permission check error:', error);
      return false;
    }
  }

  /**
   * Request usage stats permission
   */
  static async requestUsageStatsPermission() {
    try {
      if (Platform.OS !== 'android') {
        return false;
      }
      
      if (UsageStatsModule) {
        return await UsageStatsModule.requestUsageStatsPermission();
      }
      
      return false;
    } catch (error) {
      console.error('Usage stats permission request error:', error);
      return false;
    }
  }

  /**
   * Get current foreground app
   */
  static async getCurrentForegroundApp() {
    try {
      if (Platform.OS !== 'android' || !UsageStatsModule) {
        return null;
      }
      
      return await UsageStatsModule.getCurrentForegroundApp();
    } catch (error) {
      console.error('Get current foreground app error:', error);
      return null;
    }
  }

  /**
   * Check if current app is a target app
   */
  static isTargetApp(packageName) {
    return Object.values(this.TARGET_APPS).includes(packageName);
  }

  /**
   * Check if current activity is addictive content
   */
  static isAddictiveContent(packageName, activityName) {
    const features = this.ADDICTIVE_FEATURES[Object.keys(this.TARGET_APPS).find(
      key => this.TARGET_APPS[key] === packageName
    )];

    if (!features) return false;

    return features.some(feature => 
      activityName.toLowerCase().includes(feature.toLowerCase())
    );
  }

  /**
   * Get usage statistics for target apps
   */
  static async getTargetAppsUsage() {
    try {
      if (Platform.OS !== 'android' || !UsageStatsModule) {
        return {};
      }
      
      const usageData = await UsageStatsModule.getUsageStatsForApps(
        Object.values(this.TARGET_APPS)
      );
      
      return usageData;
    } catch (error) {
      console.error('Get target apps usage error:', error);
      return {};
    }
  }

  /**
   * Check if user is spending too much time on addictive content
   */
  static async isAddictiveUsageHigh() {
    try {
      const usageData = await this.getTargetAppsUsage();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let totalTimeToday = 0;
      
      Object.values(usageData).forEach(appUsage => {
        if (appUsage.lastTimeUsed > today.getTime()) {
          totalTimeToday += appUsage.totalTimeInForeground;
        }
      });
      
      // Consider 2+ hours per day as high usage
      return totalTimeToday > (2 * 60 * 60 * 1000); // 2 hours in milliseconds
    } catch (error) {
      console.error('Check addictive usage error:', error);
      return false;
    }
  }

  /**
   * Monitor and block addictive content
   */
  static async monitorAndBlock() {
    try {
      const currentApp = await this.getCurrentForegroundApp();
      
      if (!currentApp) return false;
      
      const { packageName, activityName } = currentApp;
      
      if (!this.isTargetApp(packageName)) return false;
      
      if (this.isAddictiveContent(packageName, activityName)) {
        // Block by going back to home screen
        if (UsageStatsModule) {
          await UsageStatsModule.goBack();
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Monitor and block error:', error);
      return false;
    }
  }

  /**
   * Get daily usage summary
   */
  static async getDailyUsageSummary() {
    try {
      const usageData = await this.getTargetAppsUsage();
      const summary = {};
      
      Object.entries(usageData).forEach(([packageName, data]) => {
        const appName = Object.keys(this.TARGET_APPS).find(
          key => this.TARGET_APPS[key] === packageName
        );
        
        if (appName) {
          summary[appName] = {
            totalTime: data.totalTimeInForeground,
            lastUsed: data.lastTimeUsed,
            launchCount: data.appLaunchCount || 0,
          };
        }
      });
      
      return summary;
    } catch (error) {
      console.error('Get daily usage summary error:', error);
      return {};
    }
  }
}
