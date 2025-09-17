import { Image } from 'expo-image';
import { Alert, StyleSheet } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FormButton } from '@/components/forms/FormButton';
import { useAuth } from '@/contexts/AuthContext';

export default function HomeScreen() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: logout,
        },
      ]
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome, {user?.email?.split('@')[0] || 'User'}!</ThemedText>
        <HelloWave />
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Your Profile</ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Email:</ThemedText> {user?.email}
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Phone:</ThemedText> {user?.phone}
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Member since:</ThemedText> {' '}
          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Minyan App</ThemedText>
        <ThemedText>
          Welcome to your Minyan organizing app! This app helps you coordinate and manage minyan gatherings in your community.
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Getting Started</ThemedText>
        <ThemedText>
          Explore the tabs to discover features for organizing and joining minyan gatherings. 
          Use the Explore tab to learn more about the app's functionality.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <FormButton
          title="Logout"
          onPress={handleLogout}
          loading={isLoading}
          variant="outline"
          style={styles.logoutButton}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  logoutButton: {
    marginTop: 16,
  },
});
