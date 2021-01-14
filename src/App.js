import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignIn from "./components/LogIn";
import SignUp from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import "./App.css";

export default function App() {
  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}

      <Switch>
        <Route path="/Register">
          <Register />
        </Route>

        <Route path="/ForgotPassword">
          <ResetPassword />
        </Route>

        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );

  function ResetPassword() {
    return ForgotPassword();
  }

  function Home() {
    return SignIn();
  }

  function Register() {
    return SignUp();
  }
}
