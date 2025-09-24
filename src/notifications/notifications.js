import notifee, { EventType, AuthorizationStatus } from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import { navRef } from "../../App"; // <- export navRef from App.js

/**
 * Initialize and set up notifications
 * Call this once in App.js (inside useEffect).
 */
export async function setupNotifications() {
  // 1. Request permission
  const settings = await notifee.requestPermission();

  if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
    console.log("✅ Notification permission granted");
  } else {
    console.log("❌ Notification permission denied");
    return;
  }

  // 2. Create channel (Android)
  await notifee.createChannel({
    id: "default",
    name: "Default Channel",
  });

  // 3. Firebase foreground listener
  const unsubscribeMsg = messaging().onMessage(async (remoteMessage) => {
    await notifee.displayNotification({
      title: remoteMessage.notification?.title || "📩 Firebase Push",
      body: remoteMessage.notification?.body || "You have a new message",
      android: { channelId: "default" },
      data: remoteMessage.data || {},
    });
  });

  // 4. Handle tap on notification
  const unsubscribeTap = notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      const taskId = detail.notification.data?.taskId;
      if (taskId && navRef.current) {
        navRef.current.navigate("AddEditScree", { taskid: Number(taskId) });
      }
    }
  });

  return () => {
    unsubscribeMsg();
    unsubscribeTap();
  };
}

/**
 * Simulate a push notification locally (assignment-friendly).
 * @param {string} title - notification title
 * @param {string} body - notification body
 * @param {object} data - optional payload (e.g., taskId)
 */
export async function simulateNotification(message) {
  await notifee.displayNotification({
   title: message,
    android: { channelId: "default" },
  });
}
