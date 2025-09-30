import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '@/components/Logo';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import {
    getMaxContentWidth,
    getResponsiveFontSize,
    getResponsiveSpacing,
    SCREEN_DIMENSIONS
} from '@/utils/responsive';

export default function ProfileScreen() {
  const { user, logout, isLoading } = useAuth();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isTablet = SCREEN_DIMENSIONS.isTablet;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colorScheme === 'dark' ? '#0a0a0a' : '#fafafa',
    },
    scrollContainer: {
      flexGrow: 1,
      alignItems: 'center',
    },
    content: {
      width: '100%',
      maxWidth: getMaxContentWidth(),
      paddingHorizontal: getResponsiveSpacing(24),
      paddingTop: getResponsiveSpacing(40),
      paddingBottom: getResponsiveSpacing(40),
      alignSelf: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: getResponsiveSpacing(40),
    },
    profileCard: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: getResponsiveSpacing(24),
      marginBottom: getResponsiveSpacing(24),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    profileHeader: {
      alignItems: 'center',
      marginBottom: getResponsiveSpacing(24),
    },
    profileIcon: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.tint,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: getResponsiveSpacing(16),
      shadowColor: colors.tint,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    profileName: {
      fontSize: getResponsiveFontSize(isTablet ? 28 : 24),
      fontWeight: '700',
      color: colors.text,
      marginBottom: getResponsiveSpacing(8),
      textAlign: 'center',
    },
    profileEmail: {
      fontSize: getResponsiveFontSize(16),
      color: colors.tabIconDefault,
      textAlign: 'center',
    },
    infoSection: {
      marginBottom: getResponsiveSpacing(24),
    },
    sectionTitle: {
      fontSize: getResponsiveFontSize(18),
      fontWeight: '600',
      color: colors.text,
      marginBottom: getResponsiveSpacing(16),
    },
    infoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: getResponsiveSpacing(12),
      borderBottomWidth: 1,
      borderBottomColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
    },
    infoIcon: {
      marginRight: getResponsiveSpacing(12),
      width: 24,
      alignItems: 'center',
    },
    infoLabel: {
      fontSize: getResponsiveFontSize(14),
      fontWeight: '500',
      color: colors.tabIconDefault,
      minWidth: 80,
    },
    infoValue: {
      fontSize: getResponsiveFontSize(14),
      color: colors.text,
      flex: 1,
    },
    statsSection: {
      backgroundColor: colors.background,
      borderRadius: 16,
      padding: getResponsiveSpacing(24),
      marginBottom: getResponsiveSpacing(24),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    statsGrid: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: getResponsiveFontSize(isTablet ? 32 : 28),
      fontWeight: '700',
      color: colors.tint,
    },
    statLabel: {
      fontSize: getResponsiveFontSize(14),
      color: colors.tabIconDefault,
      marginTop: getResponsiveSpacing(4),
      textAlign: 'center',
    },
    logoutButton: {
      backgroundColor: '#FF3B30',
      borderRadius: 12,
      paddingVertical: getResponsiveSpacing(16),
      paddingHorizontal: getResponsiveSpacing(24),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: getResponsiveSpacing(16),
    },
    logoutButtonText: {
      color: 'white',
      fontSize: getResponsiveFontSize(16),
      fontWeight: '600',
      marginLeft: getResponsiveSpacing(8),
    },
  });

  if (!user) {
    return (
      <SafeAreaView style={dynamicStyles.container}>
        <View style={[dynamicStyles.content, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={[dynamicStyles.profileName, { color: colors.tabIconDefault }]}>
            No user data available
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <ScrollView
        contentContainerStyle={dynamicStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={dynamicStyles.content}>
          {/* Header with Logo */}
          <View style={dynamicStyles.header}>
            <Logo size={isTablet ? 100 : 80} />
            <Text style={dynamicStyles.profileName}>Profile</Text>
          </View>

          {/* Profile Card */}
          <View style={dynamicStyles.profileCard}>
            <View style={dynamicStyles.profileHeader}>
              {/* User Icon */}
              <View style={dynamicStyles.profileIcon}>
                <Ionicons 
                  name="person" 
                  size={50} 
                  color="white" 
                />
              </View>
              <Text style={dynamicStyles.profileName}>
                {user.email.split('@')[0]}
              </Text>
              <Text style={dynamicStyles.profileEmail}>
                {user.email}
              </Text>
            </View>

            {/* User Information */}
            <View style={dynamicStyles.infoSection}>
              <Text style={dynamicStyles.sectionTitle}>Account Information</Text>
              
              <View style={dynamicStyles.infoItem}>
                <View style={dynamicStyles.infoIcon}>
                  <Ionicons name="mail" size={20} color={colors.tint} />
                </View>
                <Text style={dynamicStyles.infoLabel}>Email:</Text>
                <Text style={dynamicStyles.infoValue}>{user.email}</Text>
              </View>

              <View style={dynamicStyles.infoItem}>
                <View style={dynamicStyles.infoIcon}>
                  <Ionicons name="call" size={20} color={colors.tint} />
                </View>
                <Text style={dynamicStyles.infoLabel}>Phone:</Text>
                <Text style={dynamicStyles.infoValue}>{user.phone}</Text>
              </View>

              <View style={[dynamicStyles.infoItem, { borderBottomWidth: 0 }]}>
                <View style={dynamicStyles.infoIcon}>
                  <Ionicons name="calendar" size={20} color={colors.tint} />
                </View>
                <Text style={dynamicStyles.infoLabel}>Joined:</Text>
                <Text style={dynamicStyles.infoValue}>
                  {formatDate(user.createdAt)}
                </Text>
              </View>
            </View>
          </View>

          {/* Stats Section */}
          <View style={dynamicStyles.statsSection}>
            <Text style={dynamicStyles.sectionTitle}>Your Activity</Text>
            <View style={dynamicStyles.statsGrid}>
              <View style={dynamicStyles.statItem}>
                <Text style={dynamicStyles.statNumber}>0</Text>
                <Text style={dynamicStyles.statLabel}>Minyanim{'\n'}Created</Text>
              </View>
              <View style={dynamicStyles.statItem}>
                <Text style={dynamicStyles.statNumber}>0</Text>
                <Text style={dynamicStyles.statLabel}>Minyanim{'\n'}Joined</Text>
              </View>
              <View style={dynamicStyles.statItem}>
                <Text style={dynamicStyles.statNumber}>0</Text>
                <Text style={dynamicStyles.statLabel}>Prayers{'\n'}Attended</Text>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            style={dynamicStyles.logoutButton}
            onPress={handleLogout}
            disabled={isLoading}
          >
            <Ionicons name="log-out" size={20} color="white" />
            <Text style={dynamicStyles.logoutButtonText}>
              {isLoading ? 'Logging out...' : 'Logout'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
