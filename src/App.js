import './App.css'
import { ApolloProvider } from '@apollo/client'
import client from './ApolloContainer'
import HomePage from './components/Home/HomePage'

function App() {
  return (
    <ApolloProvider client={client}>
      <HomePage />
    </ApolloProvider>
  )
}
export default App
