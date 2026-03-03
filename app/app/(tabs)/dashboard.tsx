import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { reportsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function DashboardScreen() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await reportsAPI.getDashboard();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>FRA Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, {user?.firstName}</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Farmers"
          value={stats?.totalFarmers || 0}
          color="#4CAF50"
          icon="👨‍🌾"
        />
        <StatCard
          title="Verified Farmers"
          value={stats?.verifiedFarmers || 0}
          color="#2196F3"
          icon="✓"
        />
        <StatCard
          title="Total Farms"
          value={stats?.totalFarms || 0}
          color="#FF9800"
          icon="🌾"
        />
        <StatCard
          title="FISP Beneficiaries"
          value={stats?.fispBeneficiaries || 0}
          color="#9C27B0"
          icon="🎫"
        />
        <StatCard
          title="Pending Payments"
          value={stats?.pendingPayments || 0}
          color="#F44336"
          icon="💰"
        />
        <StatCard
          title="In Transit"
          value={stats?.produceInTransit || 0}
          color="#00BCD4"
          icon="🚚"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Farmers by Province</Text>
        {stats?.farmersByProvince?.map((item: any, index: number) => (
          <View key={index} style={styles.provinceRow}>
            <Text style={styles.provinceName}>{item._id || 'Unknown'}</Text>
            <Text style={styles.provinceCount}>{item.count}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Total Payments</Text>
        <Text style={styles.paymentAmount}>
          ZMW {stats?.totalPaymentsAmount?.toLocaleString() || 0}
        </Text>
      </View>
    </ScrollView>
  );
}

const StatCard = ({ title, value, color, icon }: any) => (
  <View style={[styles.statCard, { borderLeftColor: color }]}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

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
    backgroundColor: '#4CAF50',
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  statCard: {
    width: '47%',
    backgroundColor: '#fff',
    padding: 16,
    margin: '1.5%',
    borderRadius: 8,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  provinceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  provinceName: {
    fontSize: 16,
    color: '#333',
  },
  provinceCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  paymentAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
});
