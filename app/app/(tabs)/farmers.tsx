import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { farmerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { router } from 'expo-router';

export default function FarmersScreen() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    try {
      const response = await farmerAPI.getAll();
      setFarmers(response.data.data);
    } catch (error) {
      console.error('Error loading farmers:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderFarmer = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/farmer/${item._id}`)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.farmerName}>
          {item.personalInfo.firstName} {item.personalInfo.lastName}
        </Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.verificationStatus) }]}>
          <Text style={styles.badgeText}>{item.verificationStatus}</Text>
        </View>
      </View>
      <Text style={styles.detail}>ID: {item.nationalId}</Text>
      <Text style={styles.detail}>Phone: {item.personalInfo.phone}</Text>
      <Text style={styles.detail}>
        Location: {item.address.district}, {item.address.province}
      </Text>
    </TouchableOpacity>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'rejected': return '#F44336';
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
        <Text style={styles.title}>Registered Farmers</Text>
        {(user?.role === 'admin' || user?.role === 'agent') && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/farmer/register')}
          >
            <Text style={styles.addButtonText}>+ Add Farmer</Text>
          </TouchableOpacity>
        )}
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Search farmers..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={farmers}
        renderItem={renderFarmer}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  searchInput: {
    margin: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
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
  farmerName: {
    fontSize: 18,
    fontWeight: 'bold',
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
  detail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
