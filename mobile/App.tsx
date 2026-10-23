import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type ForexPair = {
  symbol: string,
  name: string,
  price: string,
  change: string,
  isPositive: boolean
}

const initialPairs: ForexPair[] = [
  {
    symbol: "EUR/USD",
    name: "Euro / US Dollar",
    price: "1.08452",
    change: "+0.24%",
    isPositive: true
  },
  {
    symbol: "GBP/USD",
    name: "British Pound / US Dollar",
    price: "1.27185",
    change: "+0.18%",
    isPositive: true,
  },
  {
    symbol: "USD/JPY",
    name: "US Dollar / Japanese Yen",
    price: "149.625",
    change: "-0.12%",
    isPositive: false,
  },
  {
    symbol: "USD/CHF",
    name: "US Dollar / Swiss Franc",
    price: "0.88342",
    change: "-0.08%",
    isPositive: false,
  },
  {
    symbol: "AUD/USD",
    name: "Australian Dollar / US Dollar",
    price: "0.65418",
    change: "+0.31%",
    isPositive: true,
  },
];

const API_URL = 'http://192.168.1.37:3000/'

export default function App() {
  const [pairs] = useState<ForexPair[]>(initialPairs);
  // const [message, setMessage] = useState('Connecting to backend...')
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetch(API_URL)
  //     .then((response) => {
  //       if(!response.ok){
  //         throw new Error('Server returned an error.');
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       setMessage(data.message ?? 'Connected, but no message received.');
  //     })
  //     .catch(()=> {
  //       setMessage('Connection failed. Check Wi-Fi and backend server.');
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     })
  // }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.appName}>SMART STOCK ALARM LAB</Text>
        <Text style={styles.title}>Forex Watchlist</Text>
        <Text style={styles.subtitle}>
          Monitor your favourite currency pairs
        </Text>
      </View>

      <View style={styles.marketInfo}>
        <View>
          <Text style={styles.marketLabel}>MARKET DATA</Text>
          <Text style={styles.marketValue}>Simulated prices</Text>
        </View>
        <View style={styles.demoBadge}>
          <Text style={styles.demoText}>DEMO</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {pairs.map((pair) => (
          <View key={pair.symbol} style={styles.pairCard}>
            <View style={styles.pairInfo}>
              <Text style={styles.pairSymbol}>{pair.symbol}</Text>
              <Text style={styles.pairName}>{pair.name}</Text>
            </View>

            <View style={styles.priceInfo}>
              <Text style={styles.price}>{pair.price}</Text>
              <Text
                style={[
                  styles.change,
                  pair.isPositive ? styles.positive : styles.negative,
                ]}
              >
                {pair.change}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Demo data only · Not live market prices
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B1220",
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 24,
  },
  appName: {
    color: "#60A5FA",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    marginBottom: 14,
  },
  title: {
    color: "#F8FAFC",
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#94A3B8",
    fontSize: 14,
    marginTop: 8,
  },
  marketInfo: {
    marginHorizontal: 18,
    marginBottom: 14,
    padding: 16,
    backgroundColor: "#172235",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  marketLabel: {
    color: "#94A3B8",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  marketValue: {
    color: "#F8FAFC",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 6,
  },
  demoBadge: {
    backgroundColor: "#334155",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 7,
  },
  demoText: {
    color: "#93C5FD",
    fontSize: 10,
    fontWeight: "bold",
  },
  list: {
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  pairCard: {
    backgroundColor: "#172235",
    borderRadius: 14,
    padding: 17,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pairInfo: {
    flex: 1,
    paddingRight: 8,
  },
  pairSymbol: {
    color: "#F8FAFC",
    fontSize: 18,
    fontWeight: "bold",
  },
  pairName: {
    color: "#94A3B8",
    fontSize: 11,
    marginTop: 5,
  },
  priceInfo: {
    alignItems: "flex-end",
  },
  price: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "600",
  },
  change: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
  },
  positive: {
    color: "#34D399",
  },
  negative: {
    color: "#F87171",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#263449",
    padding: 14,
    alignItems: "center",
  },
  footerText: {
    color: "#94A3B8",
    fontSize: 11,
  },
});
