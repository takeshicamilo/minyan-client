import { Minyan, PrayerType } from '@/types/minyan';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface WebViewMapProps {
  minyanim: Minyan[];
  userLocation: { latitude: number; longitude: number } | null;
  onMarkerPress?: (minyan: Minyan) => void;
  onMapPress?: (location: { latitude: number; longitude: number }) => void;
}

function WebViewMap({ minyanim, userLocation, onMarkerPress, onMapPress }: WebViewMapProps) {
  const webViewRef = useRef<WebView>(null);
  const [isWebViewReady, setIsWebViewReady] = useState(false);

  const focusOnUserLocation = () => {
    console.log('Focus button pressed in React Native');
    if (webViewRef.current) {
      const message = JSON.stringify({
        type: 'focusOnUser'
      });
      console.log('Sending focus message to WebView');
      webViewRef.current.postMessage(message);
    } else {
      console.log('WebView ref not available');
    }
  };

  const getMarkerColor = (prayerType: PrayerType): string => {
    switch (prayerType) {
      case PrayerType.SHACHARIT:
        return '#FFD700'; // Gold for morning
      case PrayerType.MINCHA:
        return '#FF6B35'; // Orange for afternoon
      case PrayerType.MAARIV:
        return '#4A90E2'; // Blue for evening
      default:
        return '#8E8E93';
    }
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
            body, html { margin: 0; padding: 0; height: 100%; }
            #map { height: 100vh; width: 100vw; }
            .custom-marker {
                background: white;
                border: 2px solid white;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 12px;
                color: white;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
            .user-marker {
                background: #FF0000;
                border: 3px solid white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            let map;
            let markers = [];
            let userMarker = null;

            function initMap() {
                // Initialize map with a default view (will be updated when user location is received)
                map = L.map('map', {
                    attributionControl: false
                }).setView([0, 0], 2);
                
                // Add OpenStreetMap tiles
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);

                // Handle map clicks
                map.on('click', function(e) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'mapPress',
                        latitude: e.latlng.lat,
                        longitude: e.latlng.lng
                    }));
                });
            }

            function updateUserLocation(lat, lng) {
                console.log('Updating user location to:', lat, lng);
                
                if (userMarker) {
                    map.removeLayer(userMarker);
                }
                
                const userIcon = L.divIcon({
                    className: 'user-marker',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10]
                });
                
                userMarker = L.marker([lat, lng], { icon: userIcon })
                    .bindPopup('Your Location')
                    .addTo(map);
                
                // Always center the map on the user's location
                console.log('Centering map on:', lat, lng);
                map.setView([lat, lng], 15);
                
                // Force map to invalidate size and redraw
                setTimeout(function() {
                    map.invalidateSize();
                }, 100);
            }

            function updateMinyanim(minyanimData) {
                // Clear existing markers
                markers.forEach(marker => map.removeLayer(marker));
                markers = [];

                // Add minyan markers
                minyanimData.forEach(minyan => {
                    const participantCount = minyan.participants ? minyan.participants.length : 0;
                    const color = getMarkerColor(minyan.prayerType);
                    
                    const icon = L.divIcon({
                        className: 'custom-marker',
                        html: \`<div style="background: \${color}; width: 100%; height: 100%; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-direction: column;">
                                <div style="font-size: 10px; line-height: 1;">\${participantCount}/10</div>
                                <div style="font-size: 8px; line-height: 1;">\${minyan.prayerType.charAt(0)}</div>
                            </div>\`,
                        iconSize: [40, 40],
                        iconAnchor: [20, 20]
                    });
                    
                    const marker = L.marker([minyan.latitude, minyan.longitude], { icon })
                        .bindPopup(\`
                            <div>
                                <strong>\${minyan.prayerType} Minyan</strong><br>
                                Participants: \${participantCount}/10<br>
                                Organizer: \${minyan.organizer.email}<br>
                                Time: \${new Date(minyan.startTime).toLocaleTimeString()}
                            </div>
                        \`)
                        .addTo(map);
                    
                    marker.on('click', function() {
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            type: 'markerPress',
                            minyan: minyan
                        }));
                    });
                    
                    markers.push(marker);
                });
            }

            function focusOnUserLocation() {
                console.log('Focus button pressed');
                if (userMarker) {
                    const userLatLng = userMarker.getLatLng();
                    console.log('Focusing on user location:', userLatLng.lat, userLatLng.lng);
                    map.setView([userLatLng.lat, userLatLng.lng], 15);
                    map.invalidateSize();
                } else {
                    console.log('No user marker found');
                }
            }

            function getMarkerColor(prayerType) {
                switch (prayerType) {
                    case 'SHACHARIT': return '#FFD700';
                    case 'MINCHA': return '#FF6B35';
                    case 'MAARIV': return '#4A90E2';
                    default: return '#8E8E93';
                }
            }

            // Initialize map when page loads
            document.addEventListener('DOMContentLoaded', initMap);

            // Listen for messages from React Native
            function handleMessage(event) {
                try {
                    console.log('Received message:', event.data);
                    const data = JSON.parse(event.data);
                    
                    switch (data.type) {
                        case 'updateUserLocation':
                            console.log('Processing updateUserLocation:', data.latitude, data.longitude);
                            updateUserLocation(data.latitude, data.longitude);
                            break;
                        case 'updateMinyanim':
                            console.log('Processing updateMinyanim:', data.minyanim.length, 'minyanim');
                            updateMinyanim(data.minyanim);
                            break;
                        case 'focusOnUser':
                            console.log('Processing focusOnUser');
                            focusOnUserLocation();
                            break;
                        default:
                            console.log('Unknown message type:', data.type);
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            }
            
            window.addEventListener('message', handleMessage);
            
            // Also listen for document messages (different WebView implementations)
            document.addEventListener('message', handleMessage);
        </script>
    </body>
    </html>
  `;

  useEffect(() => {
    // Send user location to map
    if (userLocation && webViewRef.current && isWebViewReady) {
      console.log('Sending user location to WebView:', userLocation);
      const message = JSON.stringify({
        type: 'updateUserLocation',
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      });
      
      webViewRef.current.postMessage(message);
    }
  }, [userLocation, isWebViewReady]);

  useEffect(() => {
    // Send minyanim to map
    if (webViewRef.current && isWebViewReady) {
      const message = JSON.stringify({
        type: 'updateMinyanim',
        minyanim: minyanim
      });
      
      webViewRef.current.postMessage(message);
    }
  }, [minyanim, isWebViewReady]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'markerPress':
          if (onMarkerPress) {
            onMarkerPress(data.minyan);
          }
          break;
        case 'mapPress':
          if (onMapPress) {
            onMapPress({
              latitude: data.latitude,
              longitude: data.longitude
            });
          }
          break;
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ html: htmlContent }}
        style={styles.webview}
        onMessage={handleMessage}
        onLoadEnd={() => {
          console.log('WebView loaded');
          setIsWebViewReady(true);
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        bounces={false}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Focus on user location button */}
      {userLocation && (
        <TouchableOpacity
          style={styles.focusButton}
          onPress={focusOnUserLocation}
        >
          <Ionicons name="locate" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  focusButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default WebViewMap;
