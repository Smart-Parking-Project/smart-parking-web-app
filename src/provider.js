import React, { createContext, useState, ReactNode } from "react";
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable,
} from "@apollo/client";
import { onError } from "@apollo/link-error";

let authToken = "";
const initial = {
  appState: { loggedIn: false },
  gqlError: { msg: "" },
  appSetLogin: (token) => {},
  appSetLogout: () => {},
  appSetAuthToken: (token) => {},
  appClearAuthToken: () => {},
};

export const AppStateContext = createContext(initial);

function AppStateProvider(children) {
  const [appState, setAppState] = useState({ loggenIn: false });
  const [gqlError, setGQLError] = useState({ msg: "" });

  const appSetLogin = (token) => {
    authToken = token;
    setAppState({ ...appState, loggedIn: true });
  };

  const appSetLogout = () => {
    authToken = "";
    setAppState({ ...appState, loggedIn: false });
  };

  const appSetAuthToken = (token) => {
    authToken = token;
  };

  const appClearAuthToken = () => {
    authToken = "";
  };

  const appGetAuthToken = () => {
    return authToken;
  };
}
