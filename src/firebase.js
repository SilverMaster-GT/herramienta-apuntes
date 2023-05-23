import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// Configura la información de tu proyecto Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyD4IVDsBZa4-ZmQ_AogxT2prvGHJ4s04Vw',
  authDomain: 'apuntes-develop.firebaseapp.com',
  projectId: 'apuntes-develop',
  storageBucket: 'apuntes-develop.appspot.com',
  messagingSenderId: '714460534039',
  appId: '1:714460534039:web:4d657fec06a7700ba71352',
  measurementId: 'G-4K90R8X2G3'
}

// Inicializa la aplicación Firebase
const firebaseApp = initializeApp(firebaseConfig)

// Obtén las instancias de autenticación y Firestore
const auth = getAuth(firebaseApp)
const firestore = getFirestore(firebaseApp)
const analytics = getAnalytics(firebaseApp)
const storage = getStorage(firebaseApp)

export { auth, onAuthStateChanged, signInWithEmailAndPassword, firestore, analytics, storage }
