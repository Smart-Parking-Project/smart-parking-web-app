import { makeStyles } from '@material-ui/core'

export const userPageUseStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 6px',
    display: 'flex',
    alignItems: 'center',
    width: 400,
  },
  input: {
    marginLeft: theme.spacing(),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  grid: {
    padding: '2px 20px',
  },
}))
