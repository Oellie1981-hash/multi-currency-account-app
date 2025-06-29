import AsyncStorage from '@react-native-async-storage/async-storage';

const ACCOUNTS_KEY = 'multi_currency_accounts';
const TRANSACTIONS_KEY = 'multi_currency_transactions';

// Sample data for initial setup
const sampleAccounts = [
  {
    id: 1,
    name: 'US Dollar Account',
    currency: 'USD',
    type: 'Checking',
    balance: 5420.50,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Euro Savings',
    currency: 'EUR',
    type: 'Savings',
    balance: 3250.75,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'British Pound',
    currency: 'GBP',
    type: 'Investment',
    balance: 1890.25,
    createdAt: new Date().toISOString(),
  },
];

export const getAccounts = async () => {
  try {
    const accounts = await AsyncStorage.getItem(ACCOUNTS_KEY);
    if (accounts) {
      return JSON.parse(accounts);
    } else {
      // Initialize with sample data
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(sampleAccounts));
      return sampleAccounts;
    }
  } catch (error) {
    console.error('Error getting accounts:', error);
    return [];
  }
};

export const addAccount = async (accountData) => {
  try {
    const accounts = await getAccounts();
    const newAccount = {
      id: Date.now(),
      ...accountData,
      balance: parseFloat(accountData.balance) || 0,
      createdAt: new Date().toISOString(),
    };
    
    const updatedAccounts = [...accounts, newAccount];
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
    return newAccount;
  } catch (error) {
    console.error('Error adding account:', error);
    throw error;
  }
};

export const updateAccount = async (accountId, updates) => {
  try {
    const accounts = await getAccounts();
    const updatedAccounts = accounts.map(account =>
      account.id === accountId ? { ...account, ...updates } : account
    );
    
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
    return updatedAccounts.find(account => account.id === accountId);
  } catch (error) {
    console.error('Error updating account:', error);
    throw error;
  }
};

export const deleteAccount = async (accountId) => {
  try {
    const accounts = await getAccounts();
    const updatedAccounts = accounts.filter(account => account.id !== accountId);
    await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updatedAccounts));
    return true;
  } catch (error) {
    console.error('Error deleting account:', error);
    throw error;
  }
};

export const getAccountById = async (accountId) => {
  try {
    const accounts = await getAccounts();
    return accounts.find(account => account.id === accountId);
  } catch (error) {
    console.error('Error getting account by ID:', error);
    return null;
  }
};

export const getTotalBalance = async (baseCurrency = 'USD') => {
  try {
    const accounts = await getAccounts();
    // For now, we'll just sum all balances assuming they're in the same currency
    // In a real app, you'd convert currencies using exchange rates
    const total = accounts.reduce((sum, account) => {
      // Simple conversion factor (in real app, use live exchange rates)
      let convertedBalance = account.balance;
      if (account.currency !== baseCurrency) {
        const conversionRates = {
          'EUR': 1.1,
          'GBP': 1.25,
          'JPY': 0.0067,
          'CAD': 0.74,
          'AUD': 0.65,
        };
        convertedBalance = account.balance * (conversionRates[account.currency] || 1);
      }
      return sum + convertedBalance;
    }, 0);
    
    return total;
  } catch (error) {
    console.error('Error calculating total balance:', error);
    return 0;
  }
};

export const updateAccountBalance = async (accountId, newBalance) => {
  try {
    return await updateAccount(accountId, { balance: newBalance });
  } catch (error) {
    console.error('Error updating account balance:', error);
    throw error;
  }
};