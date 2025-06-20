import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Settings as SettingsIcon, Camera, Volume2, Smartphone, CircleHelp as HelpCircle, Star, Share2, ChevronRight, User, Shield, Bell } from 'lucide-react-native';

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [autoStart, setAutoStart] = useState(false);

  const settingsGroups = [
    {
      title: 'Game Settings',
      items: [
        {
          icon: Volume2,
          title: 'Sound Effects',
          description: 'Play sounds during gameplay',
          type: 'toggle',
          value: soundEnabled,
          onValueChange: setSoundEnabled,
        },
        {
          icon: Smartphone,
          title: 'Haptic Feedback',
          description: 'Vibration for game interactions',
          type: 'toggle',
          value: hapticsEnabled,
          onValueChange: setHapticsEnabled,
        },
        {
          icon: Camera,
          title: 'Auto-start Games',
          description: 'Automatically start next round',
          type: 'toggle',
          value: autoStart,
          onValueChange: setAutoStart,
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: Bell,
          title: 'Daily Reminders',
          description: 'Get reminded to practice emotions',
          type: 'toggle',
          value: notificationsEnabled,
          onValueChange: setNotificationsEnabled,
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: User,
          title: 'Profile',
          description: 'Manage your profile settings',
          type: 'navigation',
        },
        {
          icon: Shield,
          title: 'Privacy',
          description: 'Privacy and data settings',
          type: 'navigation',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          title: 'Help & FAQ',
          description: 'Get help and find answers',
          type: 'navigation',
        },
        {
          icon: Star,
          title: 'Rate App',
          description: 'Rate us on the App Store',
          type: 'navigation',
        },
        {
          icon: Share2,
          title: 'Share App',
          description: 'Share with friends and family',
          type: 'navigation',
        },
      ],
    },
  ];

  const renderSettingItem = (item: any, index: number) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity 
        key={index}
        style={styles.settingItem}
        activeOpacity={item.type === 'navigation' ? 0.7 : 1}
      >
        <View style={styles.settingLeft}>
          <View style={styles.settingIcon}>
            <IconComponent size={20} color="#6366F1" />
          </View>
          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>{item.title}</Text>
            <Text style={styles.settingDescription}>{item.description}</Text>
          </View>
        </View>
        
        <View style={styles.settingRight}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={item.onValueChange}
              trackColor={{ false: '#F3F4F6', true: '#6366F1' }}
              thumbColor={item.value ? 'white' : '#9CA3AF'}
            />
          ) : (
            <ChevronRight size={20} color="#9CA3AF" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <SettingsIcon size={28} color="#6366F1" />
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>Customize your EmotionGuess experience</Text>
        </View>

        {/* Settings Groups */}
        {settingsGroups.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.settingGroup}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.groupContainer}>
              {group.items.map((item, itemIndex) => renderSettingItem(item, itemIndex))}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>EmotionGuess</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            Practice and improve your facial expression recognition skills with our AI-powered emotion detection game.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  settingGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
    marginBottom: 8,
    marginLeft: 4,
    textTransform: 'uppercase',
  },
  groupContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  settingRight: {
    marginLeft: 12,
  },
  appInfo: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 16,
  },
  appDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 16,
  },
});