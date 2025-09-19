import CombinedMinyanView from '@/components/map/CombinedMinyanView';
import { SimpleCreateMinyanModal } from '@/components/modals/SimpleCreateMinyanModal';
import { useAuth } from '@/contexts/AuthContext';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleCreateMinyan = (location: { latitude: number; longitude: number }) => {
    setSelectedLocation(location);
    setShowCreateModal(true);
  };

  const handleCreateSuccess = () => {
    // The map will refresh automatically when the modal closes
  };

  return (
    <View style={styles.container}>
      <CombinedMinyanView onCreateMinyan={handleCreateMinyan} />
      
      <SimpleCreateMinyanModal
        visible={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedLocation(null);
        }}
        location={selectedLocation}
        onSuccess={handleCreateSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
