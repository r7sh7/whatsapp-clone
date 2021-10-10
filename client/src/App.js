import "./App.css";
import LoginScreen from "./screens/Login/LoginScreen";
import { Switch, Route } from "react-router-dom";
import { Redirect } from "react-router";
import LoginForm from "./screens/Login/LoginForm";
import HomeScreen from "./screens/Home/HomeScreen";

function App() {
  return (
    <Switch>
      <Route exact path="/">
        <HomeScreen />
      </Route>
      <Route exact path="/login">
        <LoginScreen />
      </Route>
      <Route exact path="/loginform">
        <LoginForm />
      </Route>
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

export default App;
