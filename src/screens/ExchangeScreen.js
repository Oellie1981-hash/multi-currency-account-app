import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAccounts } from '../services/AccountService';
import { 
  SUPPORTED_CURRENCIES, 
  calculateExchangeAmount, 
  formatCurrency,
  getExchangeRate 
} from '../utils/CurrencyUtils';

export default function ExchangeScreen() {
  const [accounts, setAccounts] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('');
  const [exchangeResult, setExchangeResult] = useState(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  useEffect(() => {
    if (amount && !isNaN(parseFloat(amount))) {
      calculateExchange();
    } else {
      setExchangeResult(null);
    }
  }, [amount, fromCurrency, toCurrency]);

  const loadAccounts = async () => {
    try {
      const accountsData = await getAccounts();
      setAccounts(accountsData);
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  const calculateExchange = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setExchangeResult(null);
      return;
    }

    const result = calculateExchangeAmount(numericAmount, fromCurrency, toCurrency);
    setExchangeResult(result);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleExchange = () => {
    if (!exchangeResult) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    Alert.alert(
      'Exchange Confirmation',
      `Exchange ${exchangeResult.formattedOriginal} to ${exchangeResult.formattedConverted}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exchange', onPress: performExchange },
      ]
    );
  };

  const performExchange = () => {
    // In a real app, this would integrate with a payment processor
    Alert.alert(
      'Exchange Successful',
      `Successfully exchanged ${exchangeResult.formattedOriginal} to ${exchangeResult.formattedConverted}`,
      [{ text: 'OK' }]
    );
  };

  const renderCurrencySelector = (selectedCurrency, onSelect, title) => (
    <View style={styles.currencySelector}>
      <Text style={styles.selectorTitle}>{title}</Text>
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
            onPress={() => onSelect(currency.code)}
          >
            <Text style={styles.currencySymbol}>{currency.symbol}</Text>
            <Text
              style={[
                styles.currencyCode,
                selectedCurrency === currency.code && styles.selectedText
              ]}
            >
              {currency.code}
            </Text>
            <Text
              style={[
                styles.currencyName,
                selectedCurrency === currency.code && styles.selectedText
              ]}
            >
              {currency.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Currency Exchange</Text>
        <Text style={styles.subtitle}>Convert between currencies</Text>
      </View>

      <View style={styles.exchangeCard}>
        {/* From Currency */}
        {renderCurrencySelector(fromCurrency, setFromCurrency, 'From')}

        {/* Amount Input */}
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencyPrefix}>
              {SUPPORTED_CURRENCIES.find(c => c.code === fromCurrency)?.symbol}
            </Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#C7C7CC"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Swap Button */}
        <View style={styles.swapContainer}>
          <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
            <Ionicons name="swap-vertical" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* To Currency */}
        {renderCurrencySelector(toCurrency, setToCurrency, 'To')}

        {/* Exchange Rate Display */}
        <View style={styles.rateSection}>
          <Text style={styles.rateLabel}>Exchange Rate</Text>
          <Text style={styles.rateValue}>
            1 {fromCurrency} = {getExchangeRate(fromCurrency, toCurrency).toFixed(4)} {toCurrency}
          </Text>
        </View>

        {/* Result Display */}
        {exchangeResult && (
          <View style={styles.resultSection}>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>You pay:</Text>
              <Text style={styles.resultValue}>{exchangeResult.formattedOriginal}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>You receive:</Text>
              <Text style={[styles.resultValue, styles.receiveValue]}>
                {exchangeResult.formattedConverted}
              </Text>
            </View>
          </View>
        )}

        {/* Exchange Button */}
        <TouchableOpacity
          style={[
            styles.exchangeButton,
            !exchangeResult && styles.disabledButton
          ]}
          onPress={handleExchange}
          disabled={!exchangeResult}
        >
          <Text style={styles.exchangeButtonText}>Exchange Now</Text>
        </TouchableOpacity>
      </View>

      {/* Account Balances */}
      <View style={styles.balancesSection}>
        <Text style={styles.balancesTitle}>Account Balances</Text>
        {accounts.map((account) => (
          <View key={account.id} style={styles.balanceCard}>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceAccountName}>{account.name}</Text>
              <Text style={styles.balanceCurrency}>{account.currency}</Text>
            </View>
            <Text style={styles.balanceAmount}>
              {formatCurrency(account.balance, account.currency)}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 5,
  },
  exchangeCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currencySelector: {
    marginBottom: 20,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  currencyScroll: {
    marginHorizontal: -10,
  },
  currencyOption: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  selectedCurrency: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  currencyCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  currencyName: {
    fontSize: 10,
    color: '#8E8E93',
    textAlign: 'center',
  },
  selectedText: {
    color: 'white',
  },
  amountSection: {
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 10,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    paddingLeft: 15,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  currencyPrefix: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginRight: 10,
  },
  amountInput: {
    flex: 1,
    padding: 15,
    paddingLeft: 0,
    fontSize: 18,
    fontWeight: '600',
  },
  swapContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  swapButton: {
    backgroundColor: '#F2F2F7',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  rateSection: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  rateLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 5,
  },
  rateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  resultSection: {
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  receiveValue: {
    color: '#34C759',
  },
  exchangeButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#C7C7CC',
  },
  exchangeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  balancesSection: {
    margin: 20,
    marginTop: 0,
  },
  balancesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 15,
  },
  balanceCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceAccountName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  balanceCurrency: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
});