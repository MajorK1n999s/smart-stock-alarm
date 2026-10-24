import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, ScrollView, Pressable, TextInput, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AlarmList from "./components/AlarmList";
import { useAudioPlayer } from "expo-audio";

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

//const API_URL = 'http://192.168.1.37:3000/'

export default function App() {
  const [pairs, setPairs] = useState<ForexPair[]>(initialPairs);
  const [currentScreen, setCurrentScreen] = useState<"watchlist" | "alarms">("watchlist");
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [targetPrice, setTargetPrice] = useState("");
  const [alarmMessage, setAlarmMessage] = useState("");
  const [activeAlarms, setActiveAlarms] = useState<{ id: string; pair: string; target: number; active: boolean }[]>([]);
  const alarmPlayer = useAudioPlayer( require("./assets/alarm.mp3"));
  const [alarmModelVisible, setAlarmModelVisible] = useState(false)
  
  useEffect(() => {
    const triggered = activeAlarms
      .filter((alarm) => alarm.active)
      .map((alarm) => ({
        alarm,
        pair: pairs.find((item) => item.symbol === alarm.pair),
      }))
      .filter(
        (item) =>
          item.pair !== undefined &&
          Number(item.pair.price) >= item.alarm.target
      );

    if (triggered.length === 0) {
      return;
    }

    alarmPlayer.seekTo(0);
    alarmPlayer.play();

    const triggeredIds = new Set(
      triggered.map((item) => item.alarm.id)
    );

    setActiveAlarms((currentAlarms) =>
      currentAlarms.map((alarm) =>
        triggeredIds.has(alarm.id) && alarm.active
          ? { ...alarm, active: false }
          : alarm
      )
    );

    setAlarmMessage((currentMessage) => {
      const newMessages = triggered
        .map(({ alarm, pair }) => {
          if (!pair) {
            return "";
          }

          return (
            `Demo price alert: ${alarm.pair} reached ${pair.price} ` +
            `(target: ${alarm.target.toFixed(5)})`
          );
        })
        .filter(Boolean);

      return [...new Set([
        ...currentMessage.split("\n").filter(Boolean),
        ...newMessages,
      ])].join("\n");
    });
  }, [activeAlarms, pairs]);


  useEffect( () => {
    const timer = setInterval(() => {
      setPairs((currentPrice) => 
        currentPrice.map((pair) => {
          const currentPrice = Number(pair.price);
          const precision = pair.symbol.includes("JPY") ? 3 : 5;
          const movement = 
            (Math.random() - 0.5) *
            (pair.symbol.includes("JPY") ? 0.1 : 0.001);

            return{
              ...pair,
              price: (currentPrice + movement).toFixed(precision),
            };
        })
      );
    }, 3000);

    return () => clearInterval(timer);
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.appName}>SMART STOCK ALARM LAB</Text>
        <Text style={styles.title}>Forex Watchlist</Text>
        <Text style={styles.subtitle}>
          Monitor your favourite currency pairs
        </Text>

        <View style={{ flexDirection: "row", gap: 10, marginTop: 18 }}>
          <Pressable
            onPress={() => setCurrentScreen("watchlist")}
            style={{
              backgroundColor: currentScreen === "watchlist" ? "#2563EB" : "#172235",
              padding: 12,
              borderRadius: 10,
            }}>
              <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Watchlist</Text>
            </Pressable>

            <Pressable
              onPress={() => setCurrentScreen("alarms")}
              style={{
                backgroundColor: currentScreen === "alarms" ? "#2563EB" : "#172235",
                padding: 12,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>My Alarms</Text>
            </Pressable>
        </View>
      </View>

      {currentScreen === "watchlist" && (
        <View style={styles.marketInfo}>
          <View>
            <Text style={styles.marketLabel}>MARKET DATA</Text>
            <Text style={styles.marketValue}>Simulated prices</Text>
          </View>
          <View style={styles.demoBadge}>
            <Text style={styles.demoText}>DEMO</Text>
          </View>
        </View>
      )}

      
      
      {currentScreen === "watchlist" && selectedPair && (
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionText}>
            Selected pair: {selectedPair}
          </Text>

          <Pressable
            style={styles.mainSetAlarmButton}
            onPress={() => {
              setTargetPrice("");
              setAlarmMessage("");
              setAlarmModelVisible(true);
            }}
          >
            <Text style={styles.setAlarmButtonText}>Set Alarm</Text>
          </Pressable>
        </View>
      )}


      {currentScreen === "watchlist" && selectedPair && (
        <Modal
          visible={alarmModelVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setAlarmModelVisible(false)}
        >
          <View style={styles.modelOverlay}>

            <View style = {styles.alarmPanel}>
              <Text style = {styles.alarmTitle}>Set Price Alarm</Text>

              <TextInput
                style={styles.priceInput}
                value={targetPrice}
                onChangeText={setTargetPrice}
                placeholder="Enter Target Price"
                placeholderTextColor="#94A3B8"
                keyboardType="decimal-pad"
              />

              <View style={styles.modelButtonRow}>
                <Pressable 
                  style={styles.cancelButton}
                  onPress={() => {
                    setAlarmModelVisible(false);
                    setTargetPrice("");
                    setAlarmMessage("");
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>

                
                <Pressable
                  style={styles.setAlarmButton}
                  onPress={() =>{
                    if(!targetPrice.trim() || !Number.isFinite(Number(targetPrice)) || Number(targetPrice) <= 0){
                      setAlarmMessage("Please enter the valid target price.");
                      return;
                    }

                    if(!selectedPair){
                      setAlarmMessage("Please select currency pair.");
                      return;
                    }

                    const newAlarm = {
                      id: `${Date.now()}-${selectedPair}`,
                      pair: selectedPair,
                      target: Number(targetPrice),
                      active: true, 
                    };

                    setActiveAlarms((current) => [...current, newAlarm]);
                    setAlarmMessage(`Alarm set for ${selectedPair} at ${targetPrice.trim()}`);
                  }}
                >
                  <Text style={styles.setAlarmButtonText}>Ok</Text>
                </Pressable>
              </View>

              {alarmMessage !== "" && (
                <Text style={styles.alarmMessage}>{alarmMessage}</Text>
              )}
            </View>
          </View>
        </Modal>
      )}

      {currentScreen === "watchlist" && (
        <ScrollView contentContainerStyle={styles.list}>
          {pairs.map((pair) => (
            <Pressable key={pair.symbol}
              onPress={() => setSelectedPair(pair.symbol)}
              style={[
                styles.pairCard,
                selectedPair === pair.symbol && styles.selectedPairCard
              ]}>
                
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
            </Pressable>
          ))}
          <View style={styles.footer}></View>
        </ScrollView>
      )}
      
      {currentScreen === "alarms" && (
        <ScrollView contentContainerStyle={styles.list}>
          <AlarmList alarms={activeAlarms}
            onDelete={(id) => {
              setActiveAlarms((previousAlarms) =>
                previousAlarms.filter((alarm) => alarm.id !== id) 
              )
            }} 
            onEdit={(id, newTarget) => {
              setActiveAlarms((previousAlarms) =>
                previousAlarms.map((alarm) =>
                  alarm.id === id ? {...alarm, target: newTarget, active: true }: alarm 
                ) 
              )
            }} 
          />
        </ScrollView>
      )}

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
  selectedPairCard: {
    borderWidth: 2,
    borderColor: "#60A5FA",
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
  selectionInfo: {
    marginHorizontal: 18,
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#1E3A5F",
    borderRadius: 10,
  },
  selectionText: {
    color: "#BFDBFE",
    fontSize: 13,
    fontWeight: "600",
  },
  alarmPanel: {
    width: "100%",
    maxWidth: 420,
    minHeight: 300,
    padding: 24,
    backgroundColor: "#172235",
    borderRadius: 18,
    justifyContent: "flex-start",
  },
  alarmTitle: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  priceInput: {
    backgroundColor: "#0B1220",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 10,
    padding: 12,
    color: "#F8FAFC",
    fontSize: 16,
  },
  mainSetAlarmButton: {
    backgroundColor: "#2563EB",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  setAlarmButton: {
    flex: 1,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 12,
  },
  setAlarmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  alarmMessage: {
    color: "#60A5FA",
    fontSize: 14,
    marginTop: 10,
  },
  modelOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  modelButtonRow: {
    flexDirection: "row",
    width: "100%",
    gap: 14,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#334155",
    borderRadius: 12,
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
