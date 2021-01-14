import { Home } from '@material-ui/icons'
import Paper from '@material-ui/core/Paper'

import { homePageUseStyles } from './homePageSyles'
import UsersPage from '../Users/UsersPage'

export default function HomePage() {
  const classes = homePageUseStyles()
  return (
    <div>
      <h1>
        <Paper component="form" className={classes.root} elevation={0}>
          <Home className={classes.iconButton} />
          Home Page🚀
        </Paper>
      </h1>
      <UsersPage />
    </div>
  )
}
