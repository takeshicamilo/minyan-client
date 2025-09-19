import { FormButton } from '@/components/forms/FormButton';
import { apiService } from '@/services/api';
import { CreateMinyanRequest, PrayerType } from '@/types/minyan';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface SimpleCreateMinyanModalProps {
  visible: boolean;
  onClose: () => void;
  location: { latitude: number; longitude: number } | null;
  onSuccess: () => void;
}

export function SimpleCreateMinyanModal({ visible, onClose, location, onSuccess }: SimpleCreateMinyanModalProps) {
  const [prayerType, setPrayerType] = useState<PrayerType>(PrayerType.MINCHA);
  const [startTimeHour, setStartTimeHour] = useState('18');
  const [startTimeMinute, setStartTimeMinute] = useState('00');
  const [loading, setLoading] = useState(false);

  const handleCreateMinyan = async () => {
    if (!location) {
      Alert.alert('Error', 'Location is required');
      return;
    }

    const hour = parseInt(startTimeHour);
    const minute = parseInt(startTimeMinute);

    if (isNaN(hour) || hour < 0 || hour > 23 || isNaN(minute) || minute < 0 || minute > 59) {
      Alert.alert('Error', 'Please enter a valid time (HH:MM format)');
      return;
    }

    setLoading(true);

    try {
      const now = new Date();
      const startTime = new Date();
      startTime.setHours(hour, minute, 0, 0);
      
      // If the time is in the past today, set it for tomorrow
      if (startTime < now) {
        startTime.setDate(startTime.getDate() + 1);
      }
      
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

      const minyanData: CreateMinyanRequest = {
        prayerType,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        latitude: location.latitude,
        longitude: location.longitude,
      };

      await apiService.createMinyan(minyanData);
      
      Alert.alert('Success', 'Minyan created successfully!');
      onSuccess();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create minyan');
    } finally {
      setLoading(false);
    }
  };

  const getPrayerTypeLabel = (type: PrayerType): string => {
    switch (type) {
      case PrayerType.SHACHARIT:
        return 'Shacharit (Morning)';
      case PrayerType.MINCHA:
        return 'Mincha (Afternoon)';
      case PrayerType.MAARIV:
        return 'Maariv (Evening)';
      default:
        return type;
    }
  };

  const prayerTypes = [PrayerType.SHACHARIT, PrayerType.MINCHA, PrayerType.MAARIV];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Minyan</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prayer Type</Text>
            <View style={styles.prayerTypeContainer}>
              {prayerTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.prayerTypeButton,
                    prayerType === type && styles.selectedPrayerType
                  ]}
                  onPress={() => setPrayerType(type)}
                >
                  <Text style={[
                    styles.prayerTypeText,
                    prayerType === type && styles.selectedPrayerTypeText
                  ]}>
                    {getPrayerTypeLabel(type)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Start Time</Text>
            <View style={styles.timeContainer}>
              <TextInput
                style={styles.timeInput}
                value={startTimeHour}
                onChangeText={setStartTimeHour}
                placeholder="18"
                keyboardType="numeric"
                maxLength={2}
              />
              <Text style={styles.timeSeparator}>:</Text>
              <TextInput
                style={styles.timeInput}
                value={startTimeMinute}
                onChangeText={setStartTimeMinute}
                placeholder="00"
                keyboardType="numeric"
                maxLength={2}
              />
            </View>
            <Text style={styles.timeHelp}>Enter time in 24-hour format (HH:MM)</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.locationText}>
              {location
                ? `📍 ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`
                : 'No location selected'}
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <FormButton
              title="Create Minyan"
              onPress={handleCreateMinyan}
              loading={loading}
              disabled={!location}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  cancelButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 50,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  prayerTypeContainer: {
    gap: 8,
  },
  prayerTypeButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  selectedPrayerType: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  prayerTypeText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedPrayerTypeText: {
    color: 'white',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 18,
    textAlign: 'center',
    minWidth: 60,
  },
  timeSeparator: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  timeHelp: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  buttonContainer: {
    marginVertical: 30,
    marginBottom: 50,
  },
});
