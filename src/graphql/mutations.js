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
  mutation createNewUser($newUser: UserInput!) {
    createNewUser(newUser: $newUser) {
      user {
        id 
        username
        email
        firstName
        lastName
      }
    }
   
`;
