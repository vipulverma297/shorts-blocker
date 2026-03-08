# Shorts Blocker React Native

Cross-platform mobile app to block addictive short-video content on both Android and iOS devices.

## 🚀 Features

- **Cross-Platform**: Works on both Android and iOS
- **Automatic Blocking**: Detects and blocks addictive content automatically
- **Panic Mode**: Temporarily disable blocking for 5 minutes
- **Usage Monitoring**: Track time spent on addictive apps
- **Background Service**: Runs in background to monitor app usage
- **Privacy-Focused**: No data collection, works completely offline

## 📱 Supported Apps

### Android
- YouTube Shorts
- Instagram Reels  
- TikTok For You
- Facebook Reels
- Snapchat Spotlight
- Twitter Spaces

### iOS
- All major social media apps (via Screen Time integration)
- YouTube, Instagram, TikTok, Facebook, Snapchat, Twitter

## 🛠️ Technology Stack

- **React Native** - Cross-platform mobile framework
- **JavaScript/ES6+** - Modern JavaScript
- **Android Native Modules** - Usage Stats & Accessibility APIs
- **iOS Screen Time API** - Native iOS integration
- **AsyncStorage** - Local data persistence
- **Background Jobs** - Background monitoring

## 📋 Requirements

### Android
- Android 5.0 (API 21) or higher
- Usage Stats permission
- Accessibility Service permission

### iOS  
- iOS 12.0 or higher
- Screen Time setup required

## 🚀 Quick Start

### Installation
```bash
# Clone the repository
git clone https://github.com/vipulverma297/shorts-blocker-react-native.git
cd shorts-blocker-react-native

# Install dependencies
npm install

# For Android
npm run android

# For iOS
npm run ios
```

### Setup Instructions

#### Android
1. Install the app
2. Grant Usage Stats permission when prompted
3. Enable Accessibility Service
4. Toggle blocking ON
5. App will automatically block addictive content

#### iOS
1. Install the app
2. Go to Settings > Screen Time
3. Set up Screen Time limits for social media apps
4. Enable "Block at End of Limit"
5. Use app to monitor usage patterns

## 🏗️ Project Structure

```
src/
├── components/          # React Native components
│   ├── Header.js
│   ├── StatusCard.js
│   ├── PanicButton.js
│   └── InstructionsCard.js
├── services/           # Business logic services
│   ├── AppUsageService.js
│   └── AccessibilityService.js
└── screens/            # App screens
```

## 🔧 Configuration

### Android Native Modules
The app uses custom native modules for:
- Usage Stats API monitoring
- Accessibility Service integration
- Background job scheduling

### iOS Integration
Uses iOS Screen Time API for:
- App usage monitoring
- Content blocking
- Parental controls integration

## 📊 Usage Monitoring

The app tracks:
- Time spent on addictive apps
- Number of times addictive content is blocked
- Daily usage patterns
- Panic mode usage

## 🔒 Privacy & Security

- ✅ No data collection or transmission
- ✅ Works completely offline
- ✅ No third-party analytics
- ✅ Open source and transparent
- ✅ Minimal permissions requested

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Android Issues
- **Permissions not granted**: Go to Settings > Apps > Shorts Blocker > Permissions
- **Accessibility service not working**: Enable in Settings > Accessibility > Shorts Blocker
- **Background monitoring not working**: Check battery optimization settings

### iOS Issues
- **Screen Time not working**: Ensure Screen Time is properly set up in device settings
- **App limits not enforced**: Check that "Block at End of Limit" is enabled

## 📞 Support

For issues, questions, or feature requests:
- Create an issue on GitHub
- Check existing issues for solutions
- Join our community discussions

## 🌟 Acknowledgments

- React Native team for the amazing framework
- Contributors who help improve the app
- Users who provide feedback and suggestions

---

**Built with ❤️ to help people reduce screen time and digital addiction**
