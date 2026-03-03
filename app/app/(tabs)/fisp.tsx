import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { fispAPI } from '../../services/api';

export default function FISPScreen() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFISP();
  }, []);

  const loadFISP = async () => {
    try {
      const response = await fispAPI.getAll();
      setRecords(response.data.data);
    } catch (error) {
      console.error('Error loading FISP:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderRecord = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.season}>{item.season} {item.year}</Text>
        <View style={[styles.badge, { backgroundColor: getStatusColor(item.eligibilityStatus) }]}>
          <Text style={styles.badgeText}>{item.eligibilityStatus}</Text>
        </View>
      </View>
      
      {item.farmerId && (
        <Text style={styles.farmerName}>
          {item.farmerId.personalInfo?.firstName} {item.farmerId.personalInfo?.lastName}
        </Text>
      )}
      
      <Text style={styles.detail}>
        Total Value: ZMW {item.totalValue?.toLocaleString() || 0}
      </Text>
      <Text style={styles.detail}>
        Vouchers: {item.vouchers?.length || 0}
      </Text>
      
      {item.vouchers && item.vouchers.length > 0 && (
        <View style={styles.vouchersSection}>
          <Text style={styles.vouchersTitle}>Vouchers:</Text>
          {item.vouchers.map((voucher: any, index: number) => (
            <View key={index} style={styles.voucherItem}>
              <Text style={styles.voucherCode}>{voucher.voucherCode}</Text>
              <Text style={styles.voucherDetail}>
                {voucher.inputType} - {voucher.quantity} units
              </Text>
              <View style={[styles.voucherBadge, { backgroundColor: getVoucherStatusColor(voucher.status) }]}>
                <Text style={styles.voucherBadgeText}>{voucher.status}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'eligible': return '#4CAF50';
      case 'pending': return '#FF9800';
      case 'ineligible': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const getVoucherStatusColor = (status: string) => {
    switch (status) {
      case 'redeemed': return '#4CAF50';
      case 'issued': return '#2196F3';
      case 'expired': return '#F44336';
      case 'cancelled': return '#9E9E9E';
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
        <Text style={styles.title}>FISP Programme</Text>
      </View>

      <FlatList
        data={records}
        renderItem={renderRecord}
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
  season: {
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
  farmerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  vouchersSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  vouchersTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  voucherItem: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  voucherCode: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  voucherDetail: {
    fontSize: 14,
    marginTop: 4,
  },
  voucherBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  voucherBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
});
