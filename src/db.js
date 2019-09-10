import firebase from 'firebase/app';
import 'firebase/firestore';

// Get a Firestore instance
export const db = firebase
  .initializeApp({ projectId: process.env.VUE_APP_FIREBASE_ID })
  .firestore();

console.log(db);

const { TimeStamp } = firebase.firestore;
export { TimeStamp };

// // if using Firebase JS SDK < 5.8.0
// db.settings({ timestampsInSnapshots: true })
