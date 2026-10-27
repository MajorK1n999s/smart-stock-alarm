
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission() {
  const settings = await Notifications.getPermissionsAsync();

  if (settings.granted) {
    return true;
  }

  const result = await Notifications.requestPermissionsAsync();

  return result.granted;
}

export async function scheduleAlarmNotification(
  pair: string,
  targetPrice: number,
  secondsFromNow: number
) {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("price-alarms", {
      name: "Price Alarms",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const permitted = await requestNotificationPermission();

  if (!permitted) {
    throw new Error("Notification permission was not granted.");
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: `Price Alarm: ${pair}`,
      body: `Target price: ${targetPrice}`,
      sound: "default",
      ...(Platform.OS === "android" ? { channelId: "price-alarms" } : {}),
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, Math.floor(secondsFromNow)),
    },
  });
}

export async function cancelAlarmNotification(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
