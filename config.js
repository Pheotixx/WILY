import* as firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyBKh7f2i32otJgV4MJzOa81vvmW0HDB6ME",
    authDomain: "wily-48f3f.firebaseapp.com",
    projectId: "wily-48f3f",
    storageBucket: "wily-48f3f.appspot.com",
    messagingSenderId: "534400843662",
    appId: "1:534400843662:web:fb8bb5352b890389fc2edf"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();