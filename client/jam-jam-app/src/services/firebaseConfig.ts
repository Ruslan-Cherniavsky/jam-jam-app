import {initializeApp} from "firebase/app"
import {getAuth} from "firebase/auth"
import {getStorage} from "firebase/storage"
// import {getAnalytics} from "firebase/analytics"
// import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  // measurementId: process.env.REACT_APP_FIREBASE_MEASURMENT_ID,
}

// try {
//   const app = initializeApp(firebaseConfig)
//    const analytics = getAnalytics(app)
//    const auth = getAuth(app)
//    const db = getFirestore(app)

//   console.log("Firebase initialized successfully")
// } catch (error) {
//   console.error("Error initializing Firebase: ", error)
// }

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const storage = getStorage(app)

// const analytics = getAnalytics(app)
// const db = getFirestore(app)

export {auth, storage}
// export { app, analytics, db}
