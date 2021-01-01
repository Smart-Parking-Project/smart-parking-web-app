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
