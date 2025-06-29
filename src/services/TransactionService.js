import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSACTIONS_KEY = 'multi_currency_transactions';

// Sample transactions for initial setup
const sampleTransactions = [
  {
    id: 1,
    accountId: 1,
    type: 'deposit',
    amount: 1500.00,
    currency: 'USD',
    description: 'Salary Deposit',
    category: 'Income',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    status: 'completed',
  },
  {
    id: 2,
    accountId: 2,
    type: 'withdrawal',
    amount: -250.00,
    currency: 'EUR',
    description: 'Grocery Shopping',
    category: 'Food',
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    status: 'completed',
  },
  {
    id: 3,
    accountId: 1,
    type: 'transfer',
    amount: -500.00,
    currency: 'USD',
    description: 'Transfer to Savings',
    category: 'Transfer',
    date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    status: 'completed',
    toAccountId: 2,
  },
  {
    id: 4,
    accountId: 3,
    type: 'deposit',
    amount: 890.25,
    currency: 'GBP',
    description: 'Investment Return',
    category: 'Investment',
    date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    status: 'completed',
  },
  {
    id: 5,
    accountId: 1,
    type: 'withdrawal',
    amount: -75.50,
    currency: 'USD',
    description: 'Gas Station',
    category: 'Transportation',
    date: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
    status: 'completed',
  },
];

export const getTransactions = async (accountId = null) => {
  try {
    const transactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
    let allTransactions = [];
    
    if (transactions) {
      allTransactions = JSON.parse(transactions);
    } else {
      // Initialize with sample data
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(sampleTransactions));
      allTransactions = sampleTransactions;
    }
    
    // Filter by account if specified
    if (accountId) {
      return allTransactions.filter(transaction => transaction.accountId === accountId);
    }
    
    return allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (error) {
    console.error('Error getting transactions:', error);
    return [];
  }
};

export const getRecentTransactions = async (limit = 10) => {
  try {
    const transactions = await getTransactions();
    return transactions.slice(0, limit);
  } catch (error) {
    console.error('Error getting recent transactions:', error);
    return [];
  }
};

export const addTransaction = async (transactionData) => {
  try {
    const transactions = await getTransactions();
    const newTransaction = {
      id: Date.now(),
      ...transactionData,
      amount: parseFloat(transactionData.amount),
      date: new Date().toISOString(),
      status: 'completed',
    };
    
    const updatedTransactions = [newTransaction, ...transactions];
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
    return newTransaction;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const getTransactionById = async (transactionId) => {
  try {
    const transactions = await getTransactions();
    return transactions.find(transaction => transaction.id === transactionId);
  } catch (error) {
    console.error('Error getting transaction by ID:', error);
    return null;
  }
};

export const getTransactionsByCategory = async (category) => {
  try {
    const transactions = await getTransactions();
    return transactions.filter(transaction => transaction.category === category);
  } catch (error) {
    console.error('Error getting transactions by category:', error);
    return [];
  }
};

export const getTransactionsByDateRange = async (startDate, endDate) => {
  try {
    const transactions = await getTransactions();
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  } catch (error) {
    console.error('Error getting transactions by date range:', error);
    return [];
  }
};

export const updateTransaction = async (transactionId, updates) => {
  try {
    const transactions = await getTransactions();
    const updatedTransactions = transactions.map(transaction =>
      transaction.id === transactionId ? { ...transaction, ...updates } : transaction
    );
    
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
    return updatedTransactions.find(transaction => transaction.id === transactionId);
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (transactionId) => {
  try {
    const transactions = await getTransactions();
    const updatedTransactions = transactions.filter(transaction => transaction.id !== transactionId);
    await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updatedTransactions));
    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

export const getTransactionStats = async (accountId = null) => {
  try {
    const transactions = await getTransactions(accountId);
    
    const stats = {
      totalIncome: 0,
      totalExpenses: 0,
      transactionCount: transactions.length,
      categories: {},
    };
    
    transactions.forEach(transaction => {
      if (transaction.amount > 0) {
        stats.totalIncome += transaction.amount;
      } else {
        stats.totalExpenses += Math.abs(transaction.amount);
      }
      
      // Count by category
      if (stats.categories[transaction.category]) {
        stats.categories[transaction.category]++;
      } else {
        stats.categories[transaction.category] = 1;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Error getting transaction stats:', error);
    return {
      totalIncome: 0,
      totalExpenses: 0,
      transactionCount: 0,
      categories: {},
    };
  }
};