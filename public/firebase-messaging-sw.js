importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyDE9X1q_dP_vgQdWBcXF-QzIVcMUg15A7Q",
  authDomain: "alsharq-76f89.firebaseapp.com",
  projectId: "alsharq-76f89",
  storageBucket: "alsharq-76f89.firebasestorage.app",
  messagingSenderId: "842443400568",
  appId: "1:842443400568:web:581c4038c4c1310e46948d",
  measurementId: "G-CE0Z772TJK"
})

const messaging = firebase.messaging()
