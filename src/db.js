import firebase from 'firebase/app';
import 'firebase/firestore';

// Get a Firestore instance
export const db = firebase
  .initializeApp({ projectId: 'mealplan-33790' })
  .firestore();

const { TimeStamp } = firebase.firestore;
export { TimeStamp };

// // if using Firebase JS SDK < 5.8.0
// db.settings({ timestampsInSnapshots: true })
