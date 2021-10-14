import "./App.css";
import LoginScreen from "./screens/Login/LoginScreen.jsx";
import { Switch, Route } from "react-router-dom";
import { Redirect } from "react-router";
import LoginForm from "./screens/Login/LoginForm.jsx";
import HomeScreen from "./screens/Home/HomeScreen.jsx";
import { auth, db } from "./config/fbconfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import firebase from "firebase";
import Loader from "./components/Loader";

function App() {
  const [user, loading] = useAuthState(auth);
  useEffect(() => {
    if (user) {
      db.collection("users").doc(user.uid).set(
        {
          pno: user.phoneNumber,
          lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: user.photoURL,
          name: user.displayName,
        },
        { merge: true }
      );
    }
  }, [user]);

  if (loading) return <Loader />;
  return (
    <Switch>
      <Route exact path="/">
        {user ? <HomeScreen /> : <LoginScreen />}
      </Route>
      <Route exact path="/loginform">
        <LoginForm />
      </Route>
      <Route exact path="/chats/:id">
        {user ? <HomeScreen /> : <Redirect to="/" />}
      </Route>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

export default App;
