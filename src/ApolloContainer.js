import { ApolloClient, InMemoryCache } from '@apollo/client'

const uri = 'http://localhost:5000/graphql'

const client = new ApolloClient({
  uri,
  cache: new InMemoryCache(),
})

export default client
