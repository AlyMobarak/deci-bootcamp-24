// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAB_6oGoKsmOtFli8WvIOjE1AIUuf34CQ",
  authDomain: "deci-mental-health.firebaseapp.com",
  projectId: "deci-mental-health",
  storageBucket: "deci-mental-health.appspot.com",
  messagingSenderId: "650809602995",
  appId: "1:650809602995:web:f0e330797eb57e31df51c6",
};

// function giveAlert(msg) {
//     alert(msg)
// }

// Initialize Firebase
window.app = firebase.initializeApp(firebaseConfig);
window.auth = firebase.auth(app);
window.db = firebase.firestore(app);

async function updateBio(bio) {
  await db
    .collection(path)
    .doc(auth.currentUser.uid)
    .update({ bio }, { merge: true });
}
async function pickFav(therapistID) {
  var res;
  let userData = await db.collection("users").doc(auth.currentUser.uid).get();
  userData = userData.data();
  let favorites = userData.favorites;
  if (favorites.includes(therapistID)) {
    favorites = favorites.filter((fav) => fav !== therapistID);
    res = false;
  } else {
    favorites.push(therapistID);
    res = true;
  }
  await db
    .collection("users")
    .doc(auth.currentUser.uid)
    .update({ favorites }, { merge: true });
}

async function recordMoodEntry(category, mood, why) {
  if (other == null) other = "";
  const path = `users/${auth.currentUser.uid}/moods`;
  const docRef = await db.collection(path).add({
    category,
    mood,
    why,
  });
  console.log("Document written with ID: ", docRef.id);
}

async function getMoodEntries() {
  const path = `users/${auth.currentUser.uid}/moods`;
  let docs = await db.collection(path).get();
  docs = docs.docs.map((doc) => doc.data());
  return docs;
}

async function scheduleAppointment(therapistID) {}
async function getAppointments() {}
