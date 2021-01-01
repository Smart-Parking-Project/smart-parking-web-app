import { gql } from '@apollo/client'

export const READ_USERS = gql`
  query {
    users {
      id
      email
    }
  }
`
