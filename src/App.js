import {React} from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import "../node_modules/react-grid-layout/css/styles.css"
import "../node_modules/react-resizable/css/styles.css"
import "./App.css";
import { Container } from "semantic-ui-react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardUser from "./pages/DashboardUser";
import DashboardAdmin from "./pages/DashboardAdmin";
import { AuthProvider } from "./context/auth";
import AuthRoute from "./util/AuthRoute";
import LotMap from "./pages/Map";
import DashMap from "./pages/DashMap";
import DashMapAdmin from "./pages/DashMapAdmin";


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <Route exact path="/" component={Home} />

          <AuthRoute exact path="/login" component={Login} />

          <AuthRoute exact path="/register" component={Register} />

          <Route exact path="/dash" component={DashboardUser} />
          <Route exact path="/dashAdmin" component={DashboardAdmin} />

          <Route exact path="/map" component={DashMap} />
          <Route exact path="/mapAdmin" component={DashMapAdmin} />
          
        </Container>
      </Router>
    </AuthProvider>
  );
}
