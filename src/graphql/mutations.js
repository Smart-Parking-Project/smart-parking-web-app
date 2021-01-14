import { gql } from '@apollo/client'

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
`

export const CREATE_NEW_USER = gql`
  mutation createNewUser(newUser: UserInput!) {
    newUser: {
      username: "test5"
      email: "onemoretest@yahoo.com"
      password: "randomPasswordAgain"
      firstName: "Omar"
    }
   {
    token
    user {
      id
      username
      email
      firstName
    }
  }
`
