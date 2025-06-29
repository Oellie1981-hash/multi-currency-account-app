import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const handleNotifications = () => {
    Alert.alert('Notifications', 'Notification settings would open here');
  };

  const handleSecurity = () => {
    Alert.alert('Security', 'Security settings would open here');
  };

  const handleCurrencies = () => {
    Alert.alert('Currencies', 'Currency preferences would open here');
  };

  const handleExport = () => {
    Alert.alert('Export Data', 'Data export functionality would be implemented here');
  };

  const handleSupport = () => {
    Alert.alert('Support', 'Support center would open here');
  };

  const handleAbout = () => {
    Alert.alert(
      'About',
      'Multi-Currency Account App\nVersion 1.0.0\n\nA comprehensive solution for managing multiple currency accounts with real-time exchange rates and transaction tracking.'
    );
  };

  const renderSettingItem = (icon, title, subtitle, onPress, showArrow = true) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#007AFF" />
        </View>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      )}
    </TouchableOpacity>
  );

  const renderSectionHeader = (title) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Settings */}
        {renderSectionHeader('Account')}
        <View style={styles.section}>
          {renderSettingItem(
            'person-circle-outline',
            'Profile',
            'Manage your personal information',
            () => Alert.alert('Profile', 'Profile settings would open here')
          )}
          {renderSettingItem(
            'notifications-outline',
            'Notifications',
            'Push notifications and alerts',
            handleNotifications
          )}
          {renderSettingItem(
            'shield-checkmark-outline',
            'Security',
            'Password, biometrics, and 2FA',
            handleSecurity
          )}
        </View>

        {/* App Settings */}
        {renderSectionHeader('Preferences')}
        <View style={styles.section}>
          {renderSettingItem(
            'globe-outline',
            'Currencies',
            'Default currency and exchange rates',
            handleCurrencies
          )}
          {renderSettingItem(
            'color-palette-outline',
            'Appearance',
            'Theme and display options',
            () => Alert.alert('Appearance', 'Theme settings would open here')
          )}
          {renderSettingItem(
            'language-outline',
            'Language',
            'English',
            () => Alert.alert('Language', 'Language settings would open here')
          )}
        </View>

        {/* Data & Privacy */}
        {renderSectionHeader('Data & Privacy')}
        <View style={styles.section}>
          {renderSettingItem(
            'download-outline',
            'Export Data',
            'Download your account data',
            handleExport
          )}
          {renderSettingItem(
            'trash-outline',
            'Clear Data',
            'Reset all app data',
            () => Alert.alert(
              'Clear Data',
              'This will permanently delete all your data. Are you sure?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear', style: 'destructive' }
              ]
            )
          )}
          {renderSettingItem(
            'document-text-outline',
            'Privacy Policy',
            'How we handle your data',
            () => Alert.alert('Privacy Policy', 'Privacy policy would be displayed here')
          )}
        </View>

        {/* Support */}
        {renderSectionHeader('Support')}
        <View style={styles.section}>
          {renderSettingItem(
            'help-circle-outline',
            'Help Center',
            'FAQs and tutorials',
            handleSupport
          )}
          {renderSettingItem(
            'mail-outline',
            'Contact Us',
            'Get in touch with support',
            () => Alert.alert('Contact', 'Contact form would open here')
          )}
          {renderSettingItem(
            'star-outline',
            'Rate App',
            'Share your feedback',
            () => Alert.alert('Rate App', 'App store rating would open here')
          )}
          {renderSettingItem(
            'information-circle-outline',
            'About',
            'App version and information',
            handleAbout
          )}
        </View>

        {/* Version Info */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.buildText}>Build 2024.1</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 20,
  },
  section: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  versionContainer: {
    alignItems: 'center',
    padding: 30,
  },
  versionText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  buildText: {
    fontSize: 12,
    color: '#C7C7CC',
    marginTop: 4,
  },
});