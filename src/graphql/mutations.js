import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation AddUser($email: String!) {
    addUser(email: $email) {
      message
      success
      code
      user {
        id
        email
      }
    }
  }
`;

export const CREATE_NEW_USER = gql`
  mutation createNewUser(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $firstName: String
    $lastName: String
  ) {
    createNewUser(
      newUser: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      token
      user {
        id
        username
        email
        firstName
        lastName
      }
    }
  }
`;
