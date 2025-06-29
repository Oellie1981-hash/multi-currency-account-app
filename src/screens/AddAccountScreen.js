import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { addAccount } from '../services/AccountService';
import { SUPPORTED_CURRENCIES } from '../utils/CurrencyUtils';

const ACCOUNT_TYPES = [
  'Checking',
  'Savings',
  'Investment',
  'Business',
  'Credit Card',
];

export default function AddAccountScreen({ navigation }) {
  const [accountName, setAccountName] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedType, setSelectedType] = useState('Checking');
  const [initialBalance, setInitialBalance] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveAccount = async () => {
    if (!accountName.trim()) {
      Alert.alert('Error', 'Please enter an account name');
      return;
    }

    if (!initialBalance.trim()) {
      Alert.alert('Error', 'Please enter an initial balance');
      return;
    }

    const balance = parseFloat(initialBalance);
    if (isNaN(balance) || balance < 0) {
      Alert.alert('Error', 'Please enter a valid balance amount');
      return;
    }

    setLoading(true);
    try {
      await addAccount({
        name: accountName.trim(),
        currency: selectedCurrency,
        type: selectedType,
        balance: balance,
      });

      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Add New Account</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.form}>
          {/* Account Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Name</Text>
            <TextInput
              style={styles.textInput}
              value={accountName}
              onChangeText={setAccountName}
              placeholder="Enter account name"
              placeholderTextColor="#C7C7CC"
            />
          </View>

          {/* Currency Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Currency</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.currencyScroll}
            >
              {SUPPORTED_CURRENCIES.map((currency) => (
                <TouchableOpacity
                  key={currency.code}
                  style={[
                    styles.currencyOption,
                    selectedCurrency === currency.code && styles.selectedCurrency
                  ]}
                  onPress={() => setSelectedCurrency(currency.code)}
                >
                  <Text style={styles.currencySymbol}>{currency.symbol}</Text>
                  <Text
                    style={[
                      styles.currencyCode,
                      selectedCurrency === currency.code && styles.selectedCurrencyText
                    ]}
                  >
                    {currency.code}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Account Type */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Account Type</Text>
            <View style={styles.typeGrid}>
              {ACCOUNT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeOption,
                    selectedType === type && styles.selectedType
                  ]}
                  onPress={() => setSelectedType(type)}
                >
                  <Text
                    style={[
                      styles.typeText,
                      selectedType === type && styles.selectedTypeText
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Initial Balance */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Initial Balance</Text>
            <View style={styles.balanceInputContainer}>
              <Text style={styles.currencyPrefix}>
                {SUPPORTED_CURRENCIES.find(c => c.code === selectedCurrency)?.symbol}
              </Text>
              <TextInput
                style={styles.balanceInput}
                value={initialBalance}
                onChangeText={setInitialBalance}
                placeholder="0.00"
                placeholderTextColor="#C7C7CC"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, loading && styles.disabledButton]}
          onPress={handleSaveAccount}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  placeholder: {
    width: 34,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  currencyScroll: {
    marginHorizontal: -5,
  },
  currencyOption: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    minWidth: 70,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  selectedCurrency: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  currencyCode: {
    fontSize: 12,
    color: '#8E8E93',
  },
  selectedCurrencyText: {
    color: 'white',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  typeOption: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    margin: 5,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    minWidth: '45%',
    alignItems: 'center',
  },
  selectedType: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  selectedTypeText: {
    color: 'white',
  },
  balanceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingLeft: 15,
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginRight: 10,
  },
  balanceInput: {
    flex: 1,
    padding: 15,
    paddingLeft: 0,
    fontSize: 16,
  },
  footer: {
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#C7C7CC',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});