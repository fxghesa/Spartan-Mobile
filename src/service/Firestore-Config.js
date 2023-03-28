import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getMessaging, getToken } from "firebase/messaging";
import { getAuth, signInAnonymously } from "firebase/auth";

import { fcmTokenLocalStorage } from "./Localstorage-config";

import { Capacitor } from '@capacitor/core';
import { FCM } from "@capacitor-community/fcm";
import { PushNotifications } from "@capacitor/push-notifications";
  
const firebaseConfig = {
    apiKey: "AIzaSyBbOZqg19S67nkfzis-7SXGvaQzN_GPGks",
    authDomain: "apps-2ee38.firebaseapp.com",
    databaseURL: "https://apps-2ee38.firebaseio.com",
    projectId: "apps-2ee38",
    storageBucket: "apps-2ee38.appspot.com",
    messagingSenderId: "545216665155",
    appId: "1:545216665155:web:5f5d97112ebe366c4566f6"
};
const keyPair = "BK9LDwqEU0UHytupHlvuJMV2F9Q9IjeZuj0JAspF55NN5JyIgqIttI6UTH6dTmyl7C8b5iCZUTD0NuNA7aoJHik";
  
const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

export const signUpAnonymously = () => {
    signInAnonymously(getAuth(firebaseApp))
    .then(user => {});
}

async function fetchFcm() {
    const isPushNotificationsAvailable = Capacitor.isPluginAvailable('PushNotifications');
    if (isPushNotificationsAvailable) {
        // external required step
        // register for push
        await PushNotifications.requestPermissions();
        await PushNotifications.register();

        // now you can subscribe to a specific topic
        FCM.subscribeTo({ topic: "test" })
        .then((r) => {
            // alert(`subscribed to topic`)
        })
        .catch((err) => console.log(err));

        // Unsubscribe from a specific topic
        FCM.unsubscribeFrom({ topic: "test" })
        .then(() => {
            // alert(`unsubscribed from topic`)
        })
        .catch((err) => console.log(err));

        // Get FCM token instead the APN one returned by Capacitor
        FCM.getToken()
        .then((r) => {
            localStorage.setItem(fcmTokenLocalStorage, r.token);
        })
        .catch((err) => console.log(err));

        // Remove FCM instance
        // FCM.deleteInstance()
        // .then(() => alert(`Token deleted`))
        // .catch((err) => console.log(err));

        // Enable the auto initialization of the library
        FCM.setAutoInit({ enabled: true }).then(() => {
            // alert(`Auto init enabled`)
        });

        // Check the auto initialization status
        // FCM.isAutoInitEnabled().then((r) => {
        // console.log("Auto init is " + (r.enabled ? "enabled" : "disabled"));
        // });
    } else {
        const messaging = getMessaging(firebaseApp);
        getToken(messaging, {
            vapidKey: keyPair,
            }).then((currentToken) => {
                if (currentToken) {
                    if (currentToken == null) {
                        localStorage.setItem(fcmTokenLocalStorage, '');
                    } else if (currentToken === '') {
                        localStorage.setItem(fcmTokenLocalStorage, '');
                    } else {
                        localStorage.setItem(fcmTokenLocalStorage, currentToken);
                    }
                } else {
                    console.error("Can not get token");
                    localStorage.setItem(fcmTokenLocalStorage, 'Can not get token');
                }
            });
    }
}
fetchFcm();

export const isProd = false;
