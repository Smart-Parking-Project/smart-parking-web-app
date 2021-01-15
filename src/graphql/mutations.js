import { gql } from "@apollo/client";

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
