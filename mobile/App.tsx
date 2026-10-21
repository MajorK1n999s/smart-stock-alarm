import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";

const API_URL = 'http://192.168.1.37:3000/'

export default function App() {
  const [message, setMessage] = useState('Connecting to backend...')
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => {
        if(!response.ok){
          throw new Error('Server returned an error.');
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message ?? 'Connected, but no message received.');
      })
      .catch(()=> {
        setMessage('Connection failed. Check Wi-Fi and backend server.');
      })
      .finally(() => {
        setLoading(false);
      })
  }, [])

  return(
    <View style={styles.container}>
      <Text style={styles.title}>Smart Stock Alarm Lab</Text>
      {loading && <ActivityIndicator size="large" />}
      <Text style={styles.message}>{message}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});
