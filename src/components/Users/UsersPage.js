import { useMutation, useQuery } from '@apollo/client'
import { READ_USERS } from 'graphql/queries'
import { ADD_USER } from 'graphql/mutations'
import { Email, Add, List as ListIcon } from '@material-ui/icons'
import {
  List,
  ListItemIcon,
  ListItemText,
  Grid,
  ListItem,
  InputBase,
  IconButton,
  Paper,
} from '@material-ui/core'
import { useState } from 'react'
import _ from 'lodash'

import { readFromCache, writeToCache } from '../../cacheInvalidator'
import { userPageUseStyles } from './userPageSyles'

export default function UsersPage() {
  const classes = userPageUseStyles()
  return (
    <div>
      <h2>
        <Paper component="form" className={classes.root} elevation={0}>
          <ListIcon className={classes.iconButton} /> Users Email List
        </Paper>
      </h2>
      <Grid className={classes.grid} container spacing={3}>
        <Grid item xs={12}>
          <AddUsers />
        </Grid>
        <Grid item xs={12}>
          <ListUsers />
        </Grid>
      </Grid>
    </div>
  )
}

function ListUsers() {
  const { loading, error, data } = useQuery(READ_USERS)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  const UsersEmail = data.users.map((u) => (
    <ListItem button key={u.email}>
      <ListItemIcon>
        <Email />
      </ListItemIcon>
      <ListItemText primary={u.email} />
    </ListItem>
  ))
  return (
    <div>
      <List component="nav" aria-label="main mailbox folders">
        {UsersEmail}
      </List>
    </div>
  )
}

function AddUsers() {
  const [emailInput, setEmailInput] = useState({ value: '' })
  const [addUser] = useMutation(ADD_USER)

  const handleChange = (inputEvent) => {
    setEmailInput({ value: inputEvent.target.value })
  }

  const handleSubmit = () => {
    setEmailInput({ value: '' })
  }

  const classes = userPageUseStyles()
  return (
    <Paper
      component="form"
      className={classes.root}
      onSubmit={(submittedInputEvent) => {
        addUser({ variables: { email: emailInput.value } })
        handleSubmit()
        submittedInputEvent.preventDefault()
      }}
    >
      <IconButton
        className={classes.iconButton}
        type="submit"
        aria-label="add email"
      >
        <Add />
      </IconButton>
      <InputBase
        className={classes.input}
        value={emailInput.value}
        onChange={handleChange}
        placeholder="add email"
        inputProps={{ 'aria-label': 'add email' }}
      />
    </Paper>
  )
}

// const [addUser] = useMutation(ADD_USER, {
//   update(cache, { data }) {
//     const { success, user } = data.addUser
//     if (success) {
//       const { users } = readFromCache(cache, {}, READ_USERS)
//       const copiedUsers = _.cloneDeep(users)
//       copiedUsers.push(user)
//       const newData = {
//         users: copiedUsers,
//       }
//       writeToCache(cache, newData, READ_USERS)
//       console.log('User added with success')
//     } else {
//       console.log('Error user not added properly')
//     }
//   },
// })
