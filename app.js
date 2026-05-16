import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

// Firebase configuration: replace with your project settings
const firebaseConfig = {
  apiKey: "AIzaSyCuknNcjMrCtCWzEIZ6rtbogyHJnVqfpcA",
  authDomain: "ssmedia-kkd.firebaseapp.com",
  projectId: "ssmedia-kkd",
  storageBucket: "ssmedia-kkd.firebasestorage.app",
  messagingSenderId: "66899150851",
  appId: "1:66899150851:web:3ec8d4638105b479f22636",
  measurementId: "G-X0PJFZKE73"
};

// Initialize Firebase app and get a Firestore instance
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Save a review to the Firestore `reviews` collection.
 * @param {{name:string,eventType:string,rating:number,feedback:string}} review
 */
window.saveReviewToFirestore = async function saveReviewToFirestore(review) {
  const { name, eventType, rating, feedback } = review;

  if (!name || !eventType || !rating) {
    throw new Error('Missing required review fields.');
  }

  const reviewsCollection = collection(db, 'reviews');
  const docRef = await addDoc(reviewsCollection, {
    name,
    eventType,
    rating,
    feedback: feedback || '',
    createdAt: serverTimestamp(),
  });

  return docRef;
};

/**
 * Subscribe to the Firestore `reviews` collection and receive live updates.
 * Reviews are ordered by createdAt descending so newest reviews appear first.
 * @param {function(Array<object>):void} onUpdate
 * @param {function(Error):void} onError
 * @returns {function():void} unsubscribe
 */
window.subscribeToReviews = function subscribeToReviews(onUpdate, onError) {
  const reviewsCollection = collection(db, 'reviews');
  const reviewsQuery = query(reviewsCollection, orderBy('createdAt', 'desc'));

  return onSnapshot(
    reviewsQuery,
    (snapshot) => {
      const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (typeof onUpdate === 'function') {
        onUpdate(reviews);
      }
    },
    (error) => {
      if (typeof onError === 'function') {
        onError(error);
      }
    }
  );
};