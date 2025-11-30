import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCKdpTy2sM5K3DxevQhPrPpwyyJWyq4_vE",
  authDomain: "betha-studio.firebaseapp.com",
  databaseURL: "https://betha-studio-default-rtdb.firebaseio.com",
  projectId: "betha-studio",
  storageBucket: "betha-studio.firebasestorage.app",
  messagingSenderId: "517027567084",
  appId: "1:517027567084:web:9fb0cc23225f1646da1cc9",
  measurementId: "G-56PG7XHGEC"
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);