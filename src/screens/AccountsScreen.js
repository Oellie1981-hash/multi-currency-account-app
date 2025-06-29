import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAccounts, deleteAccount } from '../services/AccountService';
import { formatCurrency } from '../utils/CurrencyUtils';

export default function AccountsScreen({ navigation }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadAccounts();
    });

    return unsubscribe;
  }, [navigation]);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      const accountsData = await getAccounts();
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error loading accounts:', error);
      Alert.alert('Error', 'Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = (accountId, accountName) => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete "${accountName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount(accountId);
              loadAccounts();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  const renderAccount = ({ item }) => (
    <View style={styles.accountCard}>
      <View style={styles.accountHeader}>
        <View style={styles.currencyIcon}>
          <Text style={styles.currencyText}>{item.currency}</Text>
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteAccount(item.id, item.name)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.accountName}>{item.name}</Text>
      <Text style={styles.accountType}>{item.type}</Text>
      
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Current Balance</Text>
        <Text style={styles.balance}>
          {formatCurrency(item.balance, item.currency)}
        </Text>
      </View>
      
      <View style={styles.accountActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="add" size={16} color="#007AFF" />
          <Text style={styles.actionButtonText}>Deposit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="remove" size={16} color="#FF3B30" />
          <Text style={[styles.actionButtonText, { color: '#FF3B30' }]}>
            Withdraw
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="swap-horizontal" size={16} color="#34C759" />
          <Text style={[styles.actionButtonText, { color: '#34C759' }]}>
            Transfer
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Accounts</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddAccount')}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading accounts...</Text>
        </View>
      ) : accounts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="wallet-outline" size={64} color="#C7C7CC" />
          <Text style={styles.emptyTitle}>No Accounts Yet</Text>
          <Text style={styles.emptySubtitle}>
            Add your first account to get started
          </Text>
          <TouchableOpacity
            style={styles.addFirstAccountButton}
            onPress={() => navigation.navigate('AddAccount')}
          >
            <Text style={styles.addFirstAccountText}>Add Account</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={accounts}
          renderItem={renderAccount}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 20,
  },
  accountCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  currencyIcon: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 5,
  },
  accountName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 5,
  },
  accountType: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 15,
  },
  balanceContainer: {
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 5,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  accountActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
  },
  actionButtonText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 30,
  },
  addFirstAccountButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  addFirstAccountText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});