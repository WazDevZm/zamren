import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { logisticsAPI } from '../../services/api';

export default function LogisticsScreen() {
  const [produce, setProduce] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackingCode, setTrackingCode] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);

  useEffect(() => {
    loadProduce();
  }, []);

  const loadProduce = async () => {
    try {
      const response = await logisticsAPI.getAll();
      setProduce(response.data.data);
    } catch (error) {
      console.error('Error loading produce:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackProduce = async () => {
    if (!trackingCode) return;
    
    try {
      const response = await logisticsAPI.track(trackingCode);
      setTrackingResult(response.data.data);
    } catch (error) {
      console.error('Error tracking produce:', error);
      alert('Tracking code not found');
    }
  };

  const renderProduce = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.trackingCode}>{item.trackingCode}</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.logistics.status) }]}>
          <Text style={styles.badgeText}>{item.logistics.status}</Text>
        </View>
      </View>
      <Text style={styles.cropType}>{item.cropType}</Text>
      <Text style={styles.detail}>
        Quantity: {item.quantity.value} {item.quantity.unit}
      </Text>
      <Text style={styles.detail}>Grade: {item.qualityGrade}</Text>
      {item.collectionPoint && (
        <Text style={styles.detail}>
          Collection: {item.collectionPoint.name}
        </Text>
      )}
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stored': return '#4CAF50';
      case 'delivered': return '#2196F3';
      case 'in_transit': return '#FF9800';
      case 'collected': return '#9C27B0';
      case 'pending': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Logistics & Tracking</Text>
      </View>

      <View style={styles.trackingSection}>
        <Text style={styles.sectionTitle}>Track Produce</Text>
        <View style={styles.trackingInput}>
          <TextInput
            style={styles.input}
            placeholder="Enter tracking code"
            value={trackingCode}
            onChangeText={setTrackingCode}
          />
          <TouchableOpacity style={styles.trackButton} onPress={trackProduce}>
            <Text style={styles.trackButtonText}>Track</Text>
          </TouchableOpacity>
        </View>
        
        {trackingResult && (
          <View style={styles.trackingResult}>
            <Text style={styles.resultTitle}>Tracking Result</Text>
            <Text style={styles.detail}>Crop: {trackingResult.cropType}</Text>
            <Text style={styles.detail}>Status: {trackingResult.logistics.status}</Text>
            <Text style={styles.detail}>
              Farmer: {trackingResult.farmerId?.personalInfo?.firstName}
            </Text>
          </View>
        )}
      </View>

      <FlatList
        data={produce}
        renderItem={renderProduce}
        keyExtractor={(item: any) => item._id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  trackingSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  trackingInput: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  trackButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    justifyContent: 'center',
    borderRadius: 8,
  },
  trackButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  trackingResult: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trackingCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cropType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
