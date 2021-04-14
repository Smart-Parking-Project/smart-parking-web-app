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
      id
      email
      username
      firstName
      lastName
      token
    }
  }
`;

export const AUTHENTICATE_USER = gql`
  mutation authenticateUser($username: String!, $password: String!) {
    authenticateUser(username: $username, password: $password) {
      id
      username
      email
      firstName
      lastName
      token
      isAdmin
    }
  }
`;

export const CREATE_PARKING_SESSION = gql`
  mutation createParkingSession(
    $userId: ID!
    $enterTime: String!
    $exitTime: String
    $enterDate: String!
    $exitDate: String
    $payAmount: String
    $elapsedTime: String
    $hasPaid: Boolean!
  ) {
    createParkingSession(
      userId: $userId
      newSession: {
        enterTime: $enterTime
        exitTime: $exitTime
        enterDate: $enterDate
        exitDate: $exitDate
        payAmount: $payAmount
        elapsedTime: $elapsedTime
        hasPaid: $hasPaid
      }
    ) {
      id
      enterTime
      exitTime
      enterDate
      exitDate
      elapsedTime
      payAmount
      hasPaid
      userId
    }
  }
`;

export const END_PARKING_SESSION = gql`
  mutation endParkingSession(
    $id: ID!
    $exitTime: String!
    $exitDate: String!
    $elapsedTime: String!
  ) {
    endParkingSession(
      endSession: {
        id: $id
        exitTime: $exitTime
        exitDate: $exitDate
        elapsedTime: $elapsedTime
      }
    ) {
      id
      enterTime
      exitTime
      enterDate
      exitDate
      elapsedTime
      payAmount
      hasPaid
      userId
    }
  }
`;

export const PAID_FOR_SESSION = gql`
  mutation paidForSession(
    $id: ID!
    $hasPaid: Boolean!
  ) {
    paidForSession(
        id: $id
        hasPaid: $hasPaid
    ) {
      id
      enterTime
      exitTime
      enterDate
      exitDate
      elapsedTime
      payAmount
      hasPaid
      userId
    }
  }
`;

export const GET_USER_SESSIONS = gql`
  mutation getAllCurrentUserParkingSessions(
    $id: ID!
  ) {
    getAllCurrentUserParkingSessions(
        id: $id
    ) {
      id
      enterTime
      exitTime
      enterDate
      exitDate
      elapsedTime
      payAmount
      hasPaid
      userId
    }
  }
`;


