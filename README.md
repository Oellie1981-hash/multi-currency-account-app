# Multi-Currency Account App

A comprehensive mobile application for managing multiple currency accounts with real-time exchange rates and transaction tracking.

## Features

### 🏦 Account Management
- Create and manage multiple currency accounts
- Support for 10+ major currencies (USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, SEK, NZD)
- Different account types (Checking, Savings, Investment, Business, Credit Card)
- Real-time balance tracking

### 💱 Currency Exchange
- Live exchange rate calculations
- Currency conversion with visual rate display
- Swap functionality for quick conversions
- Support for all major world currencies

### 📊 Transaction Management
- Comprehensive transaction history
- Categorized transactions (Income, Food, Transportation, etc.)
- Transaction details with receipts
- Search and filter capabilities

### 📱 User Experience
- Clean, modern iOS-style interface
- Intuitive navigation with bottom tabs
- Real-time data updates
- Offline data storage

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **Storage**: AsyncStorage for local data persistence
- **UI Components**: Custom components with iOS design principles
- **Icons**: Expo Vector Icons (Ionicons)
- **Styling**: StyleSheet with responsive design

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Oellie1981-hash/multi-currency-account-app.git
cd multi-currency-account-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Project Structure

```
src/
├── screens/           # App screens
│   ├── HomeScreen.js
│   ├── AccountsScreen.js
│   ├── AddAccountScreen.js
│   ├── TransactionsScreen.js
│   ├── TransactionDetailScreen.js
│   ├── ExchangeScreen.js
│   └── SettingsScreen.js
├── services/          # Data services
│   ├── AccountService.js
│   └── TransactionService.js
└── utils/             # Utility functions
    └── CurrencyUtils.js
```

## Key Features Explained

### Account Management
- Create accounts in different currencies
- Set initial balances
- Choose account types
- View consolidated balance in preferred currency

### Currency Exchange
- Real-time exchange rate display
- Visual currency selection
- Amount conversion with live updates
- Exchange rate history (future feature)

### Transaction Tracking
- Automatic transaction categorization
- Visual transaction icons
- Detailed transaction views
- Export capabilities (future feature)

## Data Storage

The app uses AsyncStorage for local data persistence:
- Account data stored in `multi_currency_accounts`
- Transaction data stored in `multi_currency_transactions`
- Sample data automatically loaded on first run

## Currency Support

Currently supported currencies:
- USD (US Dollar)
- EUR (Euro)
- GBP (British Pound)
- JPY (Japanese Yen)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)
- CHF (Swiss Franc)
- CNY (Chinese Yuan)
- SEK (Swedish Krona)
- NZD (New Zealand Dollar)

## Future Enhancements

- [ ] Real-time exchange rate API integration
- [ ] Cloud data synchronization
- [ ] Biometric authentication
- [ ] Push notifications
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Export to PDF/CSV
- [ ] Budget tracking and goals
- [ ] Investment portfolio tracking

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@multicurrencyapp.com or create an issue in this repository.

## Acknowledgments

- Expo team for the excellent development platform
- React Navigation for seamless navigation
- Ionicons for beautiful icons
- The React Native community for continuous support