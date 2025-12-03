"use client";
import { useEffect, useState } from "react";
import { messaging } from "@/config/firebase";
import { getToken } from "firebase/messaging";

export default function NotificationsPage() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const registerToken = async () => {
      try {
        const fcmToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY });
        if (fcmToken) {
          setToken(fcmToken);
          await fetch("/api/store-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token: fcmToken }),
          });
        }
      } catch (err) {
        console.error("Error getting FCM token:", err);
      }
    };

    registerToken();
  }, []);

  return (
    <div className="mt-10">
      <h1>FCM Token</h1>
      <p>{token || "Fetching token..."}</p>
    </div>
  );
}
