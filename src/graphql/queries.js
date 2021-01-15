import { gql } from "@apollo/client";

export const AUTHENTICATE_USER = gql`
  query authenticateUser($username: String!, $password: String!) {
    authenticateUser(username: $username, password: $password) {
      token
      user
    }
  }
`;
