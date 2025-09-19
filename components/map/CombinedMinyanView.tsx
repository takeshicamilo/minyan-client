import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Minyan, PrayerType } from '@/types/minyan';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import WebViewMap from './WebViewMap';

interface CombinedMinyanViewProps {
  onCreateMinyan?: (location: { latitude: number; longitude: number }) => void;
}

function CombinedMinyanView({ onCreateMinyan }: CombinedMinyanViewProps) {
  const { user } = useAuth();
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [minyanim, setMinyanim] = useState<Minyan[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  useEffect(() => {
    initializeLocation();
  }, []);

  useEffect(() => {
    if (location) {
      loadNearbyMinyanim();
    }
  }, [location]);

  const initializeLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required', 
          'To show nearby minyanim and center the map on your location, please enable location permissions in your device settings.',
          [
            { text: 'OK' }
          ]
        );
        // Set a default location (Jerusalem) if permission denied
        setLocation({
          coords: {
            latitude: 31.7683,
            longitude: 35.2137,
            altitude: null,
            accuracy: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        } as Location.LocationObject);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      console.log('Got user location:', currentLocation.coords);
      setLocation(currentLocation);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Could not get your current location');
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyMinyanim = async () => {
    if (!location) return;

    try {
      const response = await apiService.getNearbyMinyanim({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        radius: 5,
      });
      
      setMinyanim(response.minyanim);
    } catch (error) {
      console.error('Error loading nearby minyanim:', error);
    }
  };

  const handleCreateMinyan = (mapLocation: { latitude: number; longitude: number }) => {
    if (onCreateMinyan) {
      onCreateMinyan(mapLocation);
    }
  };

  const handleJoinMinyan = async (minyan: Minyan) => {
    const isParticipant = minyan.participants?.some(p => p.user.id === user?.id);
    
    try {
      if (isParticipant) {
        await apiService.leaveMinyan(minyan.id);
        Alert.alert('Success', 'You have left the minyan');
      } else {
        await apiService.joinMinyan(minyan.id);
        Alert.alert('Success', 'You have joined the minyan');
      }
      
      loadNearbyMinyanim();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An error occurred');
    }
  };

  const handleMarkerPress = (minyan: Minyan) => {
    const participantCount = minyan.participants?.length || 0;
    const isOrganizer = minyan.organizer.id === user?.id;
    const isParticipant = minyan.participants?.some(p => p.user.id === user?.id);
    
    Alert.alert(
      `${minyan.prayerType} Minyan`,
      `Participants: ${participantCount}/10\nOrganizer: ${minyan.organizer.email}\nTime: ${new Date(minyan.startTime).toLocaleTimeString()}`,
      [
        { text: 'Cancel', style: 'cancel' },
        ...(isOrganizer ? [] : [
          {
            text: isParticipant ? 'Leave' : 'Join',
            onPress: () => handleJoinMinyan(minyan),
          }
        ])
      ]
    );
  };

  const getPrayerTypeColor = (prayerType: PrayerType): string => {
    switch (prayerType) {
      case PrayerType.SHACHARIT:
        return '#FFD700';
      case PrayerType.MINCHA:
        return '#FF6B35';
      case PrayerType.MAARIV:
        return '#4A90E2';
      default:
        return '#8E8E93';
    }
  };

  const formatDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with toggle buttons */}
      <View style={styles.header}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'map' && styles.activeToggle]}
            onPress={() => setViewMode('map')}
          >
            <Ionicons 
              name="map" 
              size={20} 
              color={viewMode === 'map' ? 'white' : '#007AFF'} 
            />
            <Text style={[styles.toggleText, viewMode === 'map' && styles.activeToggleText]}>
              Map
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.toggleButton, viewMode === 'list' && styles.activeToggle]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons 
              name="list" 
              size={20} 
              color={viewMode === 'list' ? 'white' : '#007AFF'} 
            />
            <Text style={[styles.toggleText, viewMode === 'list' && styles.activeToggleText]}>
              List
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={loadNearbyMinyanim}
        >
          <Ionicons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Content based on view mode */}
      {viewMode === 'map' ? (
        <WebViewMap
          minyanim={minyanim}
          userLocation={location ? {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          } : null}
          onMarkerPress={handleMarkerPress}
          onMapPress={handleCreateMinyan}
        />
      ) : (
        <ScrollView style={styles.listContainer}>
          {location && (
            <View style={styles.locationInfo}>
              <Text style={styles.locationText}>
                📍 Your location: {location.coords.latitude.toFixed(4)}, {location.coords.longitude.toFixed(4)}
              </Text>
            </View>
          )}

          {minyanim.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No minyanim nearby</Text>
              <Text style={styles.emptySubtext}>Be the first to create one!</Text>
            </View>
          ) : (
            minyanim.map((minyan) => {
              const participantCount = minyan.participants?.length || 0;
              const isOrganizer = minyan.organizer.id === user?.id;
              const isParticipant = minyan.participants?.some(p => p.user.id === user?.id);
              const distance = location ? formatDistance(
                location.coords.latitude,
                location.coords.longitude,
                minyan.latitude,
                minyan.longitude
              ) : '';

              return (
                <View key={minyan.id} style={styles.minyanCard}>
                  <View style={styles.minyanHeader}>
                    <View style={[styles.prayerTypeBadge, { backgroundColor: getPrayerTypeColor(minyan.prayerType) }]}>
                      <Text style={styles.prayerTypeText}>{minyan.prayerType}</Text>
                    </View>
                    <Text style={styles.participantCount}>{participantCount}/10</Text>
                  </View>
                  
                  <Text style={styles.minyanTime}>
                    🕐 {new Date(minyan.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                  
                  <Text style={styles.minyanOrganizer}>
                    👤 Organized by: {minyan.organizer.email}
                  </Text>
                  
                  {distance && (
                    <Text style={styles.minyanDistance}>📍 {distance} away</Text>
                  )}
                  
                  <View style={styles.minyanActions}>
                    {!isOrganizer && (
                      <TouchableOpacity
                        style={[
                          styles.actionButton,
                          isParticipant ? styles.leaveButton : styles.joinButton
                        ]}
                        onPress={() => handleJoinMinyan(minyan)}
                      >
                        <Text style={styles.actionButtonText}>
                          {isParticipant ? 'Leave' : 'Join'}
                        </Text>
                      </TouchableOpacity>
                    )}
                    
                    {isOrganizer && (
                      <Text style={styles.organizerBadge}>You're the organizer</Text>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Create Minyan Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => {
          if (location) {
            handleCreateMinyan({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }
        }}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.createButtonText}>Create Minyan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    padding: 4,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  activeToggle: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  activeToggleText: {
    color: 'white',
  },
  refreshButton: {
    padding: 5,
  },
  locationInfo: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  locationText: {
    fontSize: 12,
    color: '#1976d2',
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  minyanCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  minyanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  prayerTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  prayerTypeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  participantCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  minyanTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  minyanOrganizer: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  minyanDistance: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  minyanActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButton: {
    backgroundColor: '#34C759',
  },
  leaveButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  organizerBadge: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 12,
  },
  createButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default CombinedMinyanView;
